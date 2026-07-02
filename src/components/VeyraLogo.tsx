"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { LOGO_VIEW_W, LOGO_VIEW_H, RIBBON_PATH, DOT, WAVE_GUIDE } from "./logo-geometry";

gsap.registerPlugin(MotionPathPlugin, ScrollToPlugin);

// Native implementation of the 20-frame logo reveal (§4.2):
// spark -> ribbon of light -> left-to-right wave reveal of the exact traced mark
// -> orb descends into the dot -> pulse -> light sweep -> breathing idle.
export function VeyraLogo() {
  const svgRef = useRef<SVGSVGElement>(null!);
  const rootRef = useRef<SVGGElement>(null!);
  const revealRef = useRef<SVGRectElement>(null!);
  const sparkRef = useRef<SVGGElement>(null!);
  const waveRef = useRef<SVGPathElement>(null!);
  const gatherRef = useRef<SVGEllipseElement>(null!);
  const orbRef = useRef<SVGCircleElement>(null!);
  const dotRef = useRef<SVGCircleElement>(null!);
  const sweepRef = useRef<SVGRectElement>(null!);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const playedRef = useRef(false);

  const showFinal = () => {
    gsap.set(revealRef.current, { attr: { width: LOGO_VIEW_W } });
    gsap.set(dotRef.current, { opacity: 1 });
    gsap.set([sparkRef.current, orbRef.current, gatherRef.current], { opacity: 0 });
    gsap.set(svgRef.current, { opacity: 1 });
    svgRef.current.classList.add("veyra-logo-idle");
  };

  const play = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      showFinal();
      return;
    }

    tlRef.current?.kill();
    svgRef.current.classList.remove("veyra-logo-idle");

    // Frame 1: nothing visible
    gsap.set(svgRef.current, { opacity: 1 });
    gsap.set(revealRef.current, { attr: { width: 0 } });
    gsap.set(dotRef.current, { opacity: 0 });
    gsap.set(gatherRef.current, { opacity: 0 });
    gsap.set(orbRef.current, {
      opacity: 0,
      attr: { cx: DOT.cx, cy: DOT.cy - LOGO_VIEW_H * 0.28 },
      scale: 1,
      transformOrigin: "50% 50%",
    });
    gsap.set(sparkRef.current, { opacity: 0, scale: 0.3, x: 0, y: 0, transformOrigin: "50% 50%" });
    gsap.set(sweepRef.current, { attr: { x: -140 } });
    gsap.set(rootRef.current, { scale: 1, transformOrigin: "50% 50%" });

    const tl = gsap.timeline({ delay: 0.1 });
    tlRef.current = tl;

    // Frames 2-4: spark appears far left, stretches into a luminous wave
    tl.to(sparkRef.current, { opacity: 1, duration: 0.18, ease: "power2.out" }, 0)
      .to(sparkRef.current, { scale: 1.6, duration: 0.28, ease: "power3.out" }, 0.08)
      .to(sparkRef.current, { scale: 2.4, duration: 0.3, ease: "power2.inOut" }, 0.36);

    // Frames 5-11: wave travels left -> right along the mark, revealing the exact geometry
    tl.to(
      sparkRef.current,
      {
        motionPath: { path: waveRef.current, align: waveRef.current, alignOrigin: [0.5, 0.5] },
        duration: 1.05,
        ease: "power2.inOut",
      },
      0.5
    ).to(
      revealRef.current,
      { attr: { width: LOGO_VIEW_W }, duration: 1.05, ease: "power2.inOut" },
      0.5
    );

    // wave head dissolves once the body is fully visible
    tl.to(sparkRef.current, { opacity: 0, scale: 1.2, duration: 0.25, ease: "power2.in" }, 1.5);

    // Frame 12: energy gathers beneath the logo
    tl.to(gatherRef.current, { opacity: 0.28, duration: 0.22, ease: "sine.out" }, 1.62).to(
      gatherRef.current,
      { opacity: 0, duration: 0.3, ease: "sine.in" },
      1.86
    );

    // Frames 13-15: glowing orb fades in above the dot position and descends
    tl.to(orbRef.current, { opacity: 1, duration: 0.22, ease: "power2.out" }, 1.7).to(
      orbRef.current,
      { attr: { cy: DOT.cy }, duration: 0.34, ease: "power2.in" },
      1.95
    );

    // Frame 16: orb settles into the exact dot - no overshoot past 1.05
    tl.to(orbRef.current, { scale: 1.05, duration: 0.1, ease: "power1.out" }, 2.29)
      .to(orbRef.current, { scale: 1, opacity: 0, duration: 0.18, ease: "power2.out" }, 2.39)
      .to(dotRef.current, { opacity: 1, duration: 0.16, ease: "power1.out" }, 2.33);

    // Frame 17: one soft pulse radiates through the whole mark
    tl.to(rootRef.current, { scale: 1.03, duration: 0.16, ease: "sine.out" }, 2.5).to(
      rootRef.current,
      { scale: 1, duration: 0.24, ease: "sine.inOut" },
      2.66
    );

    // Frame 18: diagonal light sweep passes once, left to right
    tl.to(sweepRef.current, { attr: { x: LOGO_VIEW_W + 60 }, duration: 0.55, ease: "power2.inOut" }, 2.6);

    // Frames 19-20: glow settles into the subtle breathing idle
    tl.call(() => svgRef.current.classList.add("veyra-logo-idle"), [], 3.1);
  };

  useEffect(() => {
    // hidden until the experience starts (the loading overlay covers the page)
    gsap.set(svgRef.current, { opacity: 0 });

    const start = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      play();
    };
    window.addEventListener("veyra-experience-start", start);
    return () => {
      window.removeEventListener("veyra-experience-start", start);
      tlRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    gsap.to(window, { scrollTo: 0, duration: 1.2, ease: "power2.inOut" });
    if (playedRef.current) play(); // replay on logo click (nav-to-home)
  };

  return (
    <a
      href="#top"
      onClick={handleClick}
      aria-label="Veyra Sounds — back to top"
      className="fixed top-8 left-8 z-[120] block"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${LOGO_VIEW_W} ${LOGO_VIEW_H}`}
        className="h-10 w-auto md:h-12"
        style={{ filter: "drop-shadow(0 0 6px rgba(139,92,246,0.35))" }}
      >
        <defs>
          <linearGradient id="veyraGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="55%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id="veyraSheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="veyraOrb">
            <stop offset="0%" stopColor="#f5f3ff" />
            <stop offset="45%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="veyraGather">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="veyraSweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="veyraSparkBlur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <clipPath id="veyraReveal">
            <rect ref={revealRef} x="0" y="0" width="0" height={LOGO_VIEW_H} />
          </clipPath>
          <clipPath id="veyraSilhouette">
            <path d={RIBBON_PATH} fillRule="evenodd" />
            <circle cx={DOT.cx} cy={DOT.cy} r={DOT.r} />
          </clipPath>
        </defs>

        <g ref={rootRef}>
          {/* energy gathering beneath the mark (frame 12) */}
          <ellipse
            ref={gatherRef}
            cx={LOGO_VIEW_W / 2}
            cy={LOGO_VIEW_H * 0.86}
            rx={LOGO_VIEW_W * 0.34}
            ry={LOGO_VIEW_H * 0.16}
            fill="url(#veyraGather)"
            opacity="0"
          />

          {/* the exact traced mark, revealed left -> right */}
          <g clipPath="url(#veyraReveal)">
            <path d={RIBBON_PATH} fill="url(#veyraGrad)" fillRule="evenodd" />
            <path d={RIBBON_PATH} fill="url(#veyraSheen)" fillRule="evenodd" />
          </g>

          {/* the exact circular dot (revealed by the orb, frames 13-16) */}
          <circle ref={dotRef} cx={DOT.cx} cy={DOT.cy} r={DOT.r} fill="url(#veyraGrad)" opacity="0" />

          {/* descending orb */}
          <circle ref={orbRef} cx={DOT.cx} cy={DOT.cy} r={DOT.r * 1.5} fill="url(#veyraOrb)" opacity="0" />

          {/* traveling wave head (frames 2-11) */}
          <g ref={sparkRef} opacity="0">
            <circle r="14" fill="#a78bfa" filter="url(#veyraSparkBlur)" />
            <circle r="5" fill="#f5f3ff" />
          </g>

          {/* light sweep, masked to the logo silhouette (frame 18) */}
          <g clipPath="url(#veyraSilhouette)">
            <rect
              ref={sweepRef}
              x="-140"
              y={-LOGO_VIEW_H * 0.2}
              width="90"
              height={LOGO_VIEW_H * 1.4}
              fill="url(#veyraSweep)"
              transform={`skewX(-18)`}
            />
          </g>

          {/* invisible guide path for the wave head */}
          <path ref={waveRef} d={WAVE_GUIDE} fill="none" stroke="none" />
        </g>
      </svg>
    </a>
  );
}
