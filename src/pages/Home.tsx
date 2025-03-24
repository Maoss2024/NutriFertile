import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Baby, BookOpen, Play } from 'lucide-react';
import { VideoModal } from '../components/VideoModal';
import { HeaderVideo } from '../components/HeaderVideo';
import { useAuthStore } from '../store/authStore';
import { useAuthModalStore } from '../store/authModalStore';

export function HomePage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [nextVideoId, setNextVideoId] = useState('');
  const { user } = useAuthStore();
  const { openAuthModal } = useAuthModalStore();
  const { t } = useTranslation();

  const handleOpenVideo = (videoId: string, nextId?: string) => {
    if (!user) {
      openAuthModal();
      return;
    }
    setCurrentVideoId(videoId);
    setNextVideoId(nextId || '');
    setIsVideoModalOpen(true);
  };

  const featuredCourses = [
    {
      title: t('courses.miscarriage.title'),
      videoId: "1UKXWoe-byY",
      thumbnail: `https://img.youtube.com/vi/1UKXWoe-byY/maxresdefault.jpg`,
      duration: t('courses.miscarriage.description')
    },
    {
      title: t('courses.endocrine.title'),
      videoId: "vJv4aYiXTLM",
      thumbnail: `https://img.youtube.com/vi/vJv4aYiXTLM/maxresdefault.jpg`,
      duration: t('courses.endocrine.description')
    },
    {
      title: t('courses.hormones.title'),
      videoId: "c78OgFqtggI",
      thumbnail: `https://img.youtube.com/vi/c78OgFqtggI/maxresdefault.jpg`,
      duration: t('courses.hormones.description')
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="relative text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-[#7AB80E]">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-800 mb-8 leading-relaxed font-light whitespace-pre-line">
              {t('hero.subtitle')}
            </p>
            <button 
              onClick={() => !user && openAuthModal()}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#ed0d53] hover:bg-[#d50c4b] transition-colors text-xl md:text-2xl font-semibold text-white"
            >
              {user ? t('hero.ctaLoggedIn') : t('hero.cta')}
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-16 group">
            <div className="bg-white rounded-xl overflow-hidden transform transition-all duration-300 group-hover:translate-y-[-4px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] group-hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)]">
              <div className="relative aspect-video">
                <HeaderVideo 
                  firstVideoId="H9ZD8CJizS4"
                  secondVideoId="LLb1A6L-SYU"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Emotional Well-being */}
            <div className="flex flex-col space-y-6">
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#7AB80E]/10 rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-8 w-8 text-[#7AB80E]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('features.emotional.title')}</h3>
                <p className="text-gray-600">
                  {t('features.emotional.description')}
                </p>
              </div>
              <div 
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOpenVideo('VvR6WdJdTis')}
              >
                <div className="relative aspect-[16/9]">
                  <img 
                    src={`https://img.youtube.com/vi/VvR6WdJdTis/maxresdefault.jpg`}
                    alt={t('features.emotional.title')}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition-opacity">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pregnancy Preparation */}
            <div className="flex flex-col space-y-6">
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#ed0d53]/10 rounded-full flex items-center justify-center mb-6">
                  <Baby className="h-8 w-8 text-[#ed0d53]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('features.pregnancy.title')}</h3>
                <p className="text-gray-600">
                  {t('features.pregnancy.description')}
                </p>
              </div>
              <div 
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOpenVideo('1ggdOrwS4ps')}
              >
                <div className="relative aspect-[16/9]">
                  <img 
                    src={`https://img.youtube.com/vi/1ggdOrwS4ps/maxresdefault.jpg`}
                    alt={t('features.pregnancy.title')}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition-opacity">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Digital Content */}
            <div className="flex flex-col space-y-6">
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#7AB80E]/10 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="h-8 w-8 text-[#7AB80E]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('features.digital.title')}</h3>
                <p className="text-gray-600">
                  {t('features.digital.description')}
                </p>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[16/9]">
                  <img 
                    src="https://www.dropbox.com/scl/fi/4qgx3ypbxbo2vgtoym9wm/ebooks.jpg?rlkey=inmpbp6z14vl4lqjma6f0p15p&raw=1"
                    alt="Contenus numériques"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="bg-[#f9fafb] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 text-[#ed0d53]">{t('courses.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-video">
                  <div 
                    className="relative h-full cursor-pointer" 
                    onClick={() => handleOpenVideo(course.videoId)}
                  >
                    <img 
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition-opacity">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm">{course.duration}</p>
                  <button 
                    onClick={() => !user && openAuthModal()}
                    className={`mt-4 text-lg font-medium transition-colors ${
                      user 
                        ? "text-[#ed0d53] hover:text-[#d50c4b]"
                        : "text-[#7AB80E] hover:text-[#689A0D]"
                    }`}
                  >
                    {user ? t('courses.learnMore') : t('courses.loginToAccess')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)}
        videoId={currentVideoId}
        nextVideoId={nextVideoId}
      />
    </>
  );
}