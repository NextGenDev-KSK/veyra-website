"use client";

import { useState, useEffect } from "react";
import { ModelViewer } from "@/components/ModelViewerWrapper";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AudioPlayer } from "@/components/AudioPlayer";
import { AutoScrollButton } from "@/components/AutoScrollButton";
import { VeyraLogo } from "@/components/VeyraLogo";
import { GallerySection } from "@/components/GallerySection";
import { cn } from "@/lib/utils";
import { asset } from "@/lib/asset";
import { Github } from "lucide-react";

const REPO_URL = "https://github.com/NextGenDev-KSK/veyra";
const DOWNLOAD_URL = "https://github.com/NextGenDev-KSK/veyra/releases/latest";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <main id="top" className="relative min-h-screen bg-black">
      {/* Cinematic Loading Overlay */}
      <LoadingScreen onStarted={() => setIsLoaded(true)} />

      {/* Animated logo — top left, persists everywhere */}
      <VeyraLogo />

      {/* Background Music (drop your track at public/audio/theme.mp3) */}
      <AudioPlayer url={asset("/audio/theme.mp3")} />

      {/* Auto-scroll button */}
      <AutoScrollButton />

      {/* Fixed 3D Background */}
      <div className="fixed inset-0 z-0">
        <ModelViewer />
      </div>

      {/* Fixed Top Right GitHub Link */}
      <div
        className={cn(
          "fixed top-8 right-8 z-50 transition-all duration-1000 delay-1000",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}
      >
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 px-5 py-2.5 bg-black/40 backdrop-blur-2xl rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-500 shadow-2xl"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">
            Open Source
          </span>
          <div className="w-[1px] h-4 bg-white/10 group-hover:bg-white/30 transition-colors" />
          <Github className="w-5 h-5 text-white/60 group-hover:text-white group-hover:rotate-[360deg] transition-all duration-1000" />
        </a>
      </div>

      {/* Overlay Content Sections - visible only when loaded */}
      <div
        className={cn(
          "relative z-10 pointer-events-none transition-opacity duration-1000 delay-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Hero Section */}
        <header className="h-screen flex flex-col items-center justify-center p-8">
          <div className="text-center space-y-6">
            <h1 className="font-display text-5xl md:text-8xl font-black text-white tracking-tight uppercase drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
              Veyra Sounds
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium uppercase tracking-[0.4em] animate-pulse">
              Hear Everything
            </p>
          </div>
          <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-60">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white">Scroll to Experience</p>
            <div className="w-px h-12 bg-gradient-to-b from-[#8b5cf6] to-transparent" />
          </div>
        </header>

        {/* Section 1: Audio Engine */}
        <section className="h-screen flex items-center justify-start p-8 md:p-32">
          <div className="max-w-xl bg-white/[0.03] backdrop-blur-[10px] p-12 rounded-[3rem] border border-white/10 shadow-2xl pointer-events-auto transform transition-all hover:scale-105 hover:bg-white/[0.06] duration-700 translate-y-12">
            <span className="text-white text-xs font-bold tracking-widest uppercase mb-4 block">Audio Engine</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">Thirty Effects Deep</h2>
            <p className="text-lg text-white/70 leading-relaxed font-light">
              Ten bands of graphic EQ, a sixteen band parametric editor and a true peak limiter
              that watches your levels so you never have to. Every sound on your PC, shaped in
              realtime, in under five milliseconds.
            </p>
          </div>
        </section>

        {/* Section 2: Spatial Audio */}
        <section className="h-screen flex items-center justify-end p-8 md:p-32 text-right">
          <div className="max-w-xl bg-white/[0.03] backdrop-blur-[10px] p-12 rounded-[3rem] border border-white/10 shadow-2xl pointer-events-auto transform transition-all hover:scale-105 hover:bg-white/[0.06] duration-700">
            <span className="text-white text-xs font-bold tracking-widest uppercase mb-4 block">Spatial Audio</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">Space You Can Feel</h2>
            <p className="text-lg text-white/70 leading-relaxed font-light">
              HRTF virtualization built on the MIT KEMAR measurements, gentle crossfeed and a
              proper room reverb. Stereo stops living between your ears and starts living
              around you.
            </p>
          </div>
        </section>

        {/* Section 3: Voice & Microphone */}
        <section className="h-screen flex items-center justify-center p-8 md:p-32 text-center">
          <div className="max-w-2xl bg-white/[0.04] backdrop-blur-[10px] p-16 rounded-[3.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto transform transition-all hover:scale-105 duration-700">
            <span className="text-white text-xs font-bold tracking-widest uppercase mb-4 block">Voice &amp; Microphone</span>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-8 text-white tracking-tight">Say It Clean</h2>
            <p className="text-xl text-white/60 leading-relaxed font-light">
              A neural denoiser strips keyboards, fans and echo out of your microphone, backed
              by a noise gate and automatic gain. Your voice arrives clean, levelled and free
              of the room behind you.
            </p>
          </div>
        </section>

        {/* Section 4: Gamer Mode */}
        <section className="h-screen flex items-center justify-start p-8 md:p-32">
          <div className="max-w-xl bg-white/[0.03] backdrop-blur-[10px] p-12 rounded-[3rem] border border-white/10 shadow-2xl pointer-events-auto transform transition-all hover:scale-105 hover:bg-white/[0.06] duration-700">
            <span className="text-white text-xs font-bold tracking-widest uppercase mb-4 block">Gamer Mode</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">Hear Them First</h2>
            <p className="text-lg text-white/70 leading-relaxed font-light">
              The Sound Tracker overlay paints footsteps, gunshots and voices onto a radar. It
              only reads the sound you are already hearing and never touches the game itself, so
              it stays safe to use. Veyra spots your game the moment it launches and switches
              your sound on its own.
            </p>
          </div>
        </section>

        {/* Gallery: real app screens */}
        <GallerySection />

        {/* Section 5: The Call */}
        <section className="h-[150vh] flex flex-col items-center justify-center p-8 md:p-32 text-center">
          <div className="max-w-4xl space-y-12 pointer-events-auto">
            <h2 className="font-display text-5xl md:text-8xl font-black text-white uppercase tracking-tight drop-shadow-2xl">
              HEAR EVERYTHING<span className="text-[#a78bfa]">.</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Free and open source. 27 presets, 11 themes, one download.
            </p>
            <div className="pt-8 flex justify-center">
              <a
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-block px-12 py-5 bg-black/95 text-white font-bold uppercase tracking-[0.4em] rounded-full border border-white/10 overflow-hidden transition-all duration-500 hover:scale-110 hover:border-[#8b5cf6]/60 hover:shadow-[0_0_60px_rgba(139,92,246,0.35),0_0_100px_rgba(139,92,246,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent group-hover:from-[#8b5cf6]/10 transition-colors duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.25)_0%,transparent_70%)] opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-gradient-to-r from-transparent via-[#a78bfa]/60 to-transparent group-hover:via-[#a78bfa] transition-all duration-500" />
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                <span className="relative z-10 text-xl drop-shadow-[0_0_15px_rgba(167,139,250,0.8)] group-hover:drop-shadow-[0_0_25px_rgba(167,139,250,1)] transition-all duration-300">
                  Download for Windows
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-72 pb-20 px-8 text-center space-y-8 pointer-events-auto bg-transparent">
          <div className="flex justify-center items-center gap-12 text-white/40 text-xs font-bold uppercase tracking-widest">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
          <p className="text-white/20 text-[10px] uppercase tracking-[0.5em]">
            © 2026 Veyra Sounds. Free software under GPLv3, built for Windows.
          </p>
        </footer>
      </div>
    </main>
  );
}
