import React from 'react';
import { VideoPlayer } from './VideoPlayer';

interface HeaderVideoProps {
  firstVideoId: string;
  secondVideoId: string;
}

export function HeaderVideo({ firstVideoId, secondVideoId }: HeaderVideoProps) {
  return (
    <div className="relative bg-black" style={{ paddingTop: '56.25%' }}>
      <div className="absolute inset-0">
        <VideoPlayer 
          videoId={firstVideoId} 
          nextVideoId={secondVideoId}
          className="w-full h-full" 
          isHeader={true}
          autoplay={false} // Disable autoplay for first video
          onEnd={() => {
            // When first video ends, second video will play automatically once
            // This is handled in the VideoPlayer component
          }}
        />
      </div>
    </div>
  );
}