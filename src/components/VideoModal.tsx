import React from 'react';
import { X } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  nextVideoId?: string;
}

export function VideoModal({ isOpen, onClose, videoId, nextVideoId }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="relative pt-[56.25%]">
          <div className="absolute inset-0">
            <VideoPlayer videoId={videoId} nextVideoId={nextVideoId} className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}