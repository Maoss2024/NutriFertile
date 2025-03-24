import React from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { useAuthStore } from '../store/authStore';

interface SecureVideoPlayerProps {
  playbackId: string;
  title: string;
  className?: string;
}

export function SecureVideoPlayer({ playbackId, title, className = '' }: SecureVideoPlayerProps) {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 ${className}`}>
        <p className="text-white text-center p-4">
          Please login to watch this video
        </p>
      </div>
    );
  }

  return (
    <MuxPlayer
      streamType="on-demand"
      playbackId={playbackId}
      metadata={{ video_title: title }}
      className={className}
      tokens={{
        playback: process.env.VITE_MUX_PLAYBACK_TOKEN
      }}
    />
  );
}