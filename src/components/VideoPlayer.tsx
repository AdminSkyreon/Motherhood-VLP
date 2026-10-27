'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

type VideoPlayerProps = {
  src: string;
  poster?: string;
};

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    video
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err: unknown) => {
        console.log('Autoplay prevented:', err);
        setIsPlaying(false);
      });

    const handleScroll = () => {
      if (video && !video.muted) {
        video.muted = true;
        setIsMuted(true);
        video.currentTime = 0;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [src]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err: unknown) => {
          console.log('Play failed:', err);
        });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMutedState = !isMuted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
    video.currentTime = 0;
  };

  return (
    <div
      className="
        w-full
        h-full
        relative

        flex
        items-center
        justify-center

        overflow-hidden

        bg-transparent
        rounded-none

        border-0
        shadow-none

        sm:bg-neutral-900
        sm:rounded-2xl

        sm:border-0

        sm:shadow-[0_8px_30px_rgb(37,99,235,0.25)]

        lg:rounded-3xl
      "
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="auto"
        playsInline
        autoPlay
        loop
        muted={isMuted}
        onClick={togglePlay}
        className="
          absolute
          inset-0

          w-full
          h-full

          object-cover

          cursor-pointer

          border-0
          outline-none
        "
      />

      <div
        className="
          absolute
          bottom-4
          left-4

          flex
          items-center
          gap-2.5

          z-10
        "
      >
        <button
          type="button"
          onClick={togglePlay}
          className="
            w-10
            h-10
            rounded-full

            bg-black/60
            hover:bg-black/80

            text-white

            flex
            items-center
            justify-center

            backdrop-blur-md

            transition-all

            shadow-md

            border
            border-white/20
          "
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={18} className="text-white fill-white" />
          ) : (
            <Play size={18} className="text-white fill-white ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          className="
            w-10
            h-10
            rounded-full

            bg-black/60
            hover:bg-black/80

            text-white

            flex
            items-center
            justify-center

            backdrop-blur-md

            transition-all

            shadow-md

            border
            border-white/20
          "
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX size={18} className="text-white" />
          ) : (
            <Volume2 size={18} className="text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
