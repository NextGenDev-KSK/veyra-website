"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { asset } from "@/lib/asset";

gsap.registerPlugin(ScrollTrigger);

const SHOTS = [
  {
    src: asset("/screenshots/home.png"),
    title: "Home",
    desc: "EQ, visualizer and the master chain",
    featured: true,
  },
  { src: asset("/screenshots/presets.png"), title: "Presets", desc: "27 built in presets with favourites" },
  { src: asset("/screenshots/gamermode.png"), title: "Gamer Mode", desc: "Sound Tracker, spatial audio and night mode" },
  { src: asset("/screenshots/apps.png"), title: "Apps", desc: "Rules for every app" },
  { src: asset("/screenshots/device.png"), title: "Devices", desc: "Pick where your sound goes" },
  { src: asset("/screenshots/settings.png"), title: "Settings", desc: "Themes, hotkeys and updates" },
  { src: asset("/screenshots/minimode.png"), title: "Mini Mode", desc: "Small window, always on top" },
];

function TiltCard({
  src,
  title,
  desc,
  featured,
}: {
  src: string;
  title: string;
  desc: string;
  featured?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null!);

  const handleMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateZ(6px)`;
  };

  const handleLeave = () => {
    cardRef.current.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  };

  return (
    <div
      className={cn("gallery-card group", featured && "md:col-span-2")}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-[10px] shadow-2xl transition-[border-color,box-shadow] duration-500 ease-out group-hover:border-[#8b5cf6]/40 group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] will-change-transform"
        style={{ transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.5s, box-shadow 0.5s" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`The ${title} screen in Veyra Sounds`}
          loading="lazy"
          className="w-full h-auto select-none"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-6 pb-5 pt-14">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-white">{title}</p>
          <p className="mt-1 font-mono text-[11px] text-white/50">{desc}</p>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#8b5cf6]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null!);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gallery-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 64, rotateX: 9 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            delay: (i % 3) * 0.08,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center px-8 py-32 md:px-24 lg:px-32"
      style={{ perspective: "1200px" }}
    >
      <div className="pointer-events-auto w-full max-w-6xl">
        <div className="mb-16 text-center">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-white">
            Inside the App
          </span>
          <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
            Every Screen, Tuned
          </h2>
          <div className="mx-auto mt-8 h-[1px] w-56 bg-gradient-to-r from-transparent via-[#8b5cf6]/60 to-transparent" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SHOTS.map((s) => (
            <TiltCard key={s.src} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
