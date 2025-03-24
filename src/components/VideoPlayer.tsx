import React, { useEffect, useRef, useState } from 'react';
import { Settings, MonitorSmartphone, Play, Subtitles } from 'lucide-react';
import { useYouTubeAPI } from '../lib/youtube';
import { useLanguageStore } from '../store/languageStore';

interface VideoPlayerProps {
  videoId: string;
  nextVideoId?: string;
  className?: string;
  isHeader?: boolean;
  autoplay?: boolean;
  onEnd?: () => void;
}

type Quality = {
  label: string;
  value: string;
};

const QUALITY_OPTIONS: Quality[] = [
  { label: '4K', value: 'hd2160' },
  { label: '1440p', value: 'hd1440' },
  { label: '1080p HD', value: 'hd1080' },
  { label: '720p HD', value: 'hd720' },
  { label: '480p', value: 'large' },
  { label: '360p', value: 'medium' },
  { label: 'Auto', value: 'default' }
];

export function VideoPlayer({ 
  videoId, 
  nextVideoId, 
  className = '', 
  isHeader = false,
  autoplay = true,
  onEnd 
}: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<string>('hd1080');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [hasPlayedNext, setHasPlayedNext] = useState(false);
  const [showTimestampSelector, setShowTimestampSelector] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const { currentLanguage } = useLanguageStore();
  const isAPILoaded = useYouTubeAPI();

  const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const TIMESTAMP_OPTIONS = [
    { label: 'Début', value: 0 },
    { label: '25%', value: 0.25 },
    { label: '50%', value: 0.5 },
    { label: '75%', value: 0.75 }
  ];

  const clearProgressInterval = () => {
    if (progressInterval.current !== null) {
      window.clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const startProgressInterval = () => {
    clearProgressInterval();
    progressInterval.current = window.setInterval(updateProgress, 1000);
  };

  useEffect(() => {
    if (!isAPILoaded || !window.YT || !containerRef.current) return;

    try {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      const player = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          modestbranding: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          iv_load_policy: 3,
          fs: 0,
          playsinline: 1,
          disablekb: 1,
          enablejsapi: 1,
          origin: window.location.origin,
          hd: 1,
          vq: 'hd1080',
          suggestedQuality: 'hd1080',
          cc_load_policy: 0,
          cc_lang_pref: currentLanguage,
          hl: currentLanguage,
          loop: 0
        },
        events: {
          onReady: (event: any) => {
            playerRef.current = event.target;
            setDuration(event.target.getDuration());
            setIsReady(true);
            
            const qualities = event.target.getAvailableQualityLevels();
            setAvailableQualities(qualities);

            const highestQuality = qualities[0] || 'hd1080';
            event.target.setPlaybackQuality(highestQuality);
            setCurrentQuality(highestQuality);

            event.target.loadModule('captions');
            event.target.setOption('captions', 'track', { languageCode: currentLanguage });
            event.target.unloadModule('captions');

            if (isHeader && autoplay) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            const isNowPlaying = event.data === window.YT.PlayerState.PLAYING;
            setIsPlaying(isNowPlaying);
            
            if (isNowPlaying) {
              startProgressInterval();
            } else {
              clearProgressInterval();
            }

            if (event.data === window.YT.PlayerState.ENDED) {
              if (nextVideoId && !hasPlayedNext) {
                if (isHeader) {
                  playerRef.current.loadVideoById({
                    videoId: nextVideoId,
                    suggestedQuality: currentQuality
                  });
                  setHasPlayedNext(true);
                } else {
                  setShowTimestampSelector(true);
                }
                setIsPlaying(false);
                if (onEnd) onEnd();
              } else {
                const lastTime = event.target.getDuration() - 0.1;
                event.target.seekTo(lastTime);
                event.target.pauseVideo();
                setIsPlaying(false);
              }
            }
          },
          onPlaybackQualityChange: (event: any) => {
            setCurrentQuality(event.data);
          },
          onError: (event: any) => {
            console.error('YouTube Player Error:', event.data);
            clearProgressInterval();
          }
        }
      });

      return () => {
        clearProgressInterval();
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      };
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
      clearProgressInterval();
    }
  }, [videoId, nextVideoId, isAPILoaded, currentLanguage, isHeader, autoplay]);

  const toggleSubtitles = () => {
    if (!playerRef.current) return;

    try {
      const newState = !subtitlesEnabled;
      setSubtitlesEnabled(newState);

      if (newState) {
        playerRef.current.loadModule('captions');
        playerRef.current.setOption('captions', 'track', { languageCode: currentLanguage });
      } else {
        playerRef.current.unloadModule('captions');
      }
    } catch (error) {
      console.error('Error toggling subtitles:', error);
    }
  };

  const updateProgress = () => {
    if (!playerRef.current) return;
    try {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      setProgress((currentTime / duration) * 100);
    } catch (error) {
      console.error('Error updating progress:', error);
      clearProgressInterval();
    }
  };

  const handlePlayPause = () => {
    if (!isReady || !playerRef.current) return;
    
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (error) {
      console.error('Error handling play/pause:', error);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isReady || !playerRef.current) return;

    try {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const newTime = (percentage / 100) * duration;
      playerRef.current.seekTo(newTime);
      setProgress(percentage);
    } catch (error) {
      console.error('Error handling progress click:', error);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (!isReady || !playerRef.current) return;

    try {
      playerRef.current.setPlaybackRate(speed);
      setPlaybackRate(speed);
      setShowSpeedMenu(false);
    } catch (error) {
      console.error('Error changing playback speed:', error);
    }
  };

  const handleQualityChange = (quality: string) => {
    if (!isReady || !playerRef.current) return;
    
    try {
      playerRef.current.setPlaybackQuality(quality);
      setCurrentQuality(quality);
      setShowQualityMenu(false);
    } catch (error) {
      console.error('Error changing quality:', error);
    }
  };

  const handleTimestampSelect = (timestamp: number) => {
    if (!nextVideoId || !playerRef.current) return;

    try {
      const startTime = Math.floor(timestamp * duration);
      playerRef.current.loadVideoById({
        videoId: nextVideoId,
        startSeconds: startTime,
        suggestedQuality: currentQuality
      });
      setShowTimestampSelector(false);
      setHasPlayedNext(true);
    } catch (error) {
      console.error('Error selecting timestamp:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCurrentQualityLabel = () => {
    const quality = QUALITY_OPTIONS.find(q => q.value === currentQuality);
    return quality ? quality.label : 'Auto';
  };

  const getAvailableQualityOptions = () => {
    return QUALITY_OPTIONS.filter(option => 
      availableQualities.includes(option.value) || option.value === 'default'
    );
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        setShowControls(false);
        setShowQualityMenu(false);
        setShowSpeedMenu(false);
      }}
      onClick={!isPlaying ? handlePlayPause : undefined}
    >
      <div ref={containerRef} className="w-full h-full" />
      
      {!isPlaying && !isHeader && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition-opacity cursor-pointer">
          <Play className="h-12 w-12 text-white" />
        </div>
      )}

      {showTimestampSelector && !isHeader && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">À partir d'où souhaitez-vous regarder la suite ?</h3>
            <div className="grid grid-cols-2 gap-3">
              {TIMESTAMP_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTimestampSelect(option.value)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 z-10">
          <div 
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-4"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-[#7AB80E] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                {formatTime(progress * duration / 100)} / {formatTime(duration)}
              </span>
              <button
                onClick={toggleSubtitles}
                className={`text-white hover:text-[#7AB80E] transition-colors ${
                  subtitlesEnabled ? 'text-[#7AB80E]' : ''
                }`}
              >
                <Subtitles className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => {
                    setShowQualityMenu(!showQualityMenu);
                    setShowSpeedMenu(false);
                  }}
                  className="text-white hover:text-[#7AB80E] transition-colors flex items-center space-x-1"
                >
                  <MonitorSmartphone className="h-5 w-5" />
                  <span className="text-sm">{getCurrentQualityLabel()}</span>
                </button>
                
                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg overflow-hidden">
                    {getAvailableQualityOptions().map((quality) => (
                      <button
                        key={quality.value}
                        onClick={() => handleQualityChange(quality.value)}
                        className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${
                          currentQuality === quality.value ? 'text-[#7AB80E]' : 'text-white'
                        }`}
                      >
                        {quality.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSpeedMenu(!showSpeedMenu);
                    setShowQualityMenu(false);
                  }}
                  className="text-white hover:text-[#7AB80E] transition-colors flex items-center space-x-1"
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-sm">{playbackRate}x</span>
                </button>

                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg overflow-hidden">
                    {SPEED_OPTIONS.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${
                          playbackRate === speed ? 'text-[#7AB80E]' : 'text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}