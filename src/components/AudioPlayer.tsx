"use client";

import { useEffect, useRef, useState } from "react";
import { VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  url: string;
  autoPlay?: boolean;
}

export function AudioPlayer({ url, autoPlay = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const availableRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0;
    // if the track is missing or unplayable, fall back to the Off state
    audio.addEventListener("error", () => {
      availableRef.current = false;
      audio.pause();
      setIsPlaying(false);
    });
    audioRef.current = audio;

    // only arm the player when the file really exists and is audio
    fetch(url, { method: "HEAD" })
      .then((res) => {
        const type = res.headers.get("content-type") ?? "";
        if (res.ok && !type.includes("text/html")) {
          availableRef.current = true;
          audio.src = url;
          if (autoPlay) handlePlay();
        }
      })
      .catch(() => {
        availableRef.current = false;
      });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, autoPlay]);

  const handlePlay = () => {
    if (!audioRef.current || !availableRef.current) return;

    const audio = audioRef.current;

    if (isPlaying) {
      // Fade out over 1 second
      let volume = audio.volume;
      const step = volume / 20;
      const fadeOut = setInterval(() => {
        if (volume > step) {
          volume -= step;
          audio.volume = volume;
        } else {
          audio.volume = 0;
          audio.pause();
          setIsPlaying(false);
          clearInterval(fadeOut);
        }
      }, 50);
    } else {
      // Fade in over 1 second
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          let volume = 0;
          const step = 1 / 20;
          const fadeIn = setInterval(() => {
            if (volume < 1 - step) {
              volume += step;
              audio.volume = volume;
            } else {
              audio.volume = 1;
              clearInterval(fadeIn);
            }
          }, 50);
        })
        .catch(() => {
          // Track missing or autoplay blocked - stay silent.
          console.log("Audio unavailable. Drop a track at /audio/theme.mp3.");
        });
    }
  };

  // LoadingScreen dispatches this when the user clicks Begin
  useEffect(() => {
    const handleStartAudio = () => {
      if (!isPlaying) handlePlay();
    };
    window.addEventListener("start-background-audio", handleStartAudio);
    return () => window.removeEventListener("start-background-audio", handleStartAudio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <div className="fixed bottom-8 left-8 z-[100] flex items-center gap-4">
      <button
        onClick={handlePlay}
        className={cn(
          "group flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full transition-all duration-500 hover:bg-white/10 hover:border-white/20",
          isPlaying ? "opacity-100" : "opacity-50"
        )}
      >
        <div className="relative flex items-center justify-center w-6 h-6">
          {isPlaying ? (
            <div className="flex gap-1 items-end h-3">
              <div className="w-0.5 h-full bg-white animate-[music-bar_0.8s_ease-in-out_infinite]" />
              <div className="w-0.5 h-2/3 bg-white animate-[music-bar_1.2s_ease-in-out_infinite]" />
              <div className="w-0.5 h-full bg-white animate-[music-bar_1s_ease-in-out_infinite]" />
            </div>
          ) : (
            <VolumeX className="w-4 h-4 text-white/40" />
          )}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
          {isPlaying ? "Audio On" : "Audio Off"}
        </span>
      </button>

      <style jsx global>{`
        @keyframes music-bar {
          0%,
          100% {
            height: 20%;
          }
          50% {
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
}
