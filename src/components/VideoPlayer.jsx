'use client';
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Browser autoplay policy ke liye shuru mein muted rakha hai

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
    }

    // Shuru mein muted autoplay ensure karte hain taaki video kabhi na ruke
    video.muted = true;
    video.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.log("Autoplay prevented:", err);
      setIsPlaying(false);
    });

    // Jab user niche scroll karega toh video chalti rahegi, bas mute ho jayegi
    const handleScroll = () => {
      if (video && !video.muted) {
        video.muted = true;
        setIsMuted(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (hls) {
        hls.destroy();
      }
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
      video.play().then(() => {
        setIsPlaying(true);
      });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full h-full relative bg-neutral-900 flex items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-blue-600/15 backdrop-blur-lg shadow-[0_8px_30px_rgb(37,99,235,0.25)]">
      {/* Video Element: object-cover se upar-niche ki black patti hat jayegi */}
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        autoPlay
        loop
        muted={isMuted}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Custom Control Buttons */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2.5 z-10">
        {/* Play / Pause Button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md border border-white/20"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={18} className="text-white fill-white" />
          ) : (
            <Play size={18} className="text-white fill-white ml-0.5" />
          )}
        </button>

        {/* Mute / Unmute Button */}
        <button
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md border border-white/20"
          aria-label={isMuted ? "Unmute" : "Mute"}
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