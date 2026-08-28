"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@/components/icons";

export function CinematicVideo({ className = "", label = "Vista Ridge exterior film", poster = "/media/truck-court.webp" }: { className?: string; label?: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduce.matches) void video.play();
      else video.pause();
    }, { threshold: 0.22 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  return (
    <div className={`cinematic-video ${className}`}>
      <video ref={videoRef} muted loop playsInline preload="metadata" poster={poster} aria-label={label} onPause={() => setPaused(true)} onPlay={() => setPaused(false)}>
        <source src="/media/vista-ridge-exterior-film.mp4" type="video/mp4" />
      </video>
      <button type="button" className="video-control" onClick={toggle} aria-label={paused ? "Play property film" : "Pause property film"}>
        {paused ? <Play /> : <Pause />}
      </button>
    </div>
  );
}
