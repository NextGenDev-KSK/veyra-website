"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { LOGO_VIEW_W, LOGO_VIEW_H, RIBBON_PATH, DOT } from "./logo-geometry";

// Loading-screen variant of the logo reveal: a watery ribbon of light rolls in
// from the left at mid height, forms the exact mark as it passes, pops the dot
// with a ripple, then rolls away to the right and dissolves.
export function LoadingLogoReveal() {
  const svgRef = useRef<SVGSVGElement>(null!);
  const revealRef = useRef<SVGRectElement>(null!);
  const waveRef = useRef<SVGGElement>(null!);
  const dotRef = useRef<SVGCircleElement>(null!);
  const rippleRef = useRef<SVGCircleElement>(null!);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null!);

  useEffect(() => {
    const W = LOGO_VIEW_W;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.set(revealRef.current, { attr: { width: W } });
      gsap.set(dotRef.current, { opacity: 1 });
      gsap.set(waveRef.current, { opacity: 0 });
      svgRef.current.classList.add("veyra-logo-idle");
      return;
    }

    gsap.set(revealRef.current, { attr: { width: 0 } });
    gsap.set(dotRef.current, { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" });
    gsap.set(rippleRef.current, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
    gsap.set(waveRef.current, { x: -W * 0.55, opacity: 0 });

    // watery shimmer: wobble the displacement while the wave lives
    const wobble = { s: 26 };
    const wobbleTween = gsap.to(wobble, {
      s: 13,
      duration: 0.38,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      onUpdate: () => dispRef.current?.setAttribute("scale", String(wobble.s)),
    });

    const dotMoment = 0.18 + 1.45 * (DOT.cx / W);
    const tl = gsap.timeline({
      delay: 0.35,
      onComplete: () => wobbleTween.kill(),
    });

    tl.to(waveRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0)
      .to(waveRef.current, { x: W * 1.55, duration: 1.6, ease: "power2.inOut" }, 0.08)
      .to(revealRef.current, { attr: { width: W } , duration: 1.45, ease: "power2.inOut" }, 0.18)
      // the dot blooms as the wave rolls over it
      .to(dotRef.current, { opacity: 1, scale: 1.05, duration: 0.2, ease: "power2.out" }, dotMoment)
      .to(dotRef.current, { scale: 1, duration: 0.18, ease: "power2.inOut" }, ">")
      .to(rippleRef.current, { opacity: 0.5, duration: 0.05 }, dotMoment)
      .to(rippleRef.current, { scale: 2.3, opacity: 0, duration: 0.55, ease: "power2.out" }, dotMoment + 0.05)
      // the wave rolls off and dissolves
      .to(waveRef.current, { opacity: 0, duration: 0.35, ease: "power2.in" }, 1.4)
      .call(() => svgRef.current.classList.add("veyra-logo-idle"), [], 2.0);

    return () => {
      tl.kill();
      wobbleTween.kill();
    };
  }, []);

  const midY = LOGO_VIEW_H * 0.5;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${LOGO_VIEW_W} ${LOGO_VIEW_H}`}
      className="w-56 md:w-72 h-auto overflow-visible"
      style={{ filter: "drop-shadow(0 0 10px rgba(139,92,246,0.4))" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ldgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="55%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="ldgSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ldgHead">
          <stop offset="0%" stopColor="#f5f3ff" />
          <stop offset="40%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ldgTail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.55" />
        </linearGradient>
        {/* watery wavy air: turbulence-displaced, softly blurred */}
        <filter id="ldgWater" x="-80%" y="-120%" width="260%" height="340%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.045" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
        <clipPath id="ldgReveal">
          <rect ref={revealRef} x="0" y={-LOGO_VIEW_H * 0.25} width="0" height={LOGO_VIEW_H * 1.5} />
        </clipPath>
      </defs>

      {/* the exact mark, revealed left to right by the passing wave */}
      <g clipPath="url(#ldgReveal)">
        <path d={RIBBON_PATH} fill="url(#ldgGrad)" fillRule="evenodd" />
        <path d={RIBBON_PATH} fill="url(#ldgSheen)" fillRule="evenodd" />
      </g>

      {/* the exact circular dot */}
      <circle ref={dotRef} cx={DOT.cx} cy={DOT.cy} r={DOT.r} fill="url(#ldgGrad)" opacity="0" />
      <circle
        ref={rippleRef}
        cx={DOT.cx}
        cy={DOT.cy}
        r={DOT.r * 1.5}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="3"
        opacity="0"
      />

      {/* the watery ribbon of light, entering from the left at mid height */}
      <g ref={waveRef} filter="url(#ldgWater)" opacity="0">
        <rect x={-190} y={midY - 15} width={180} height={30} rx={15} fill="url(#ldgTail)" />
        <ellipse cx={0} cy={midY} rx={56} ry={24} fill="url(#ldgHead)" />
        <ellipse cx={-12} cy={midY} rx={20} ry={9} fill="#f5f3ff" opacity="0.85" />
      </g>
    </svg>
  );
}
