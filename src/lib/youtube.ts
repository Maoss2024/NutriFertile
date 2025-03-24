import { useEffect } from 'react';

let isAPILoaded = false;
let isAPILoading = false;
const callbacks: (() => void)[] = [];

export function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT && isAPILoaded) {
      resolve();
      return;
    }

    callbacks.push(resolve);

    if (isAPILoading) {
      return;
    }

    isAPILoading = true;

    // Create YouTube API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';

    // Add script to page
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Setup global callback
    window.onYouTubeIframeAPIReady = () => {
      isAPILoaded = true;
      callbacks.forEach(callback => callback());
      callbacks.length = 0;
    };
  });
}

export function useYouTubeAPI() {
  useEffect(() => {
    loadYouTubeAPI();
  }, []);

  return isAPILoaded;
}

// Add TypeScript types for YouTube IFrame API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}