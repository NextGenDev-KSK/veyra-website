"use client";

import { useEffect, useMemo, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial, Environment, Lightformer } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

import { HeadphoneModel } from "./HeadphoneModel";
import { EnergyOrb } from "./EnergyOrb";
import { Loader } from "./Loader";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// Procedural ripple normal map so the reflective floor needs no external texture.
function useRippleNormalMap() {
  return useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    const h = (x: number, y: number) =>
      Math.sin((x / size) * Math.PI * 8 + Math.cos((y / size) * Math.PI * 4)) * 0.5 +
      Math.sin((y / size) * Math.PI * 10) * 0.35 +
      Math.sin(((x + y) / size) * Math.PI * 6) * 0.3;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = h((x + 1) % size, y) - h((x - 1 + size) % size, y);
        const dy = h(x, (y + 1) % size) - h(x, (y - 1 + size) % size);
        const n = new THREE.Vector3(-dx * 2, -dy * 2, 1).normalize();
        const i = (y * size + x) * 4;
        data[i] = (n.x * 0.5 + 0.5) * 255;
        data[i + 1] = (n.y * 0.5 + 0.5) * 255;
        data[i + 2] = (n.z * 0.5 + 0.5) * 255;
        data[i + 3] = 255;
      }
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(18, 18); // tile finely so the ripples read as water, not a stretch
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

function Scene() {
  const { camera, scene } = useThree();
  const normalMap = useRippleNormalMap();

  useEffect(() => {
    camera.position.set(0, 0, 4.5);
    const lookAtTarget = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookAtTarget);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Initial states for all 10 orbs - same starting formation as the reference build
    const bStates = {
      b1: { x: -6, y: 2, z: -2, rx: 0, ry: 0, rz: 0 },
      b2: { x: 6, y: -1, z: -3, rx: 0, ry: 0, rz: 0 },
      b3: { x: -4, y: -3, z: -1, rx: 0, ry: 0, rz: 0 },
      b4: { x: 3, y: 4, z: -4, rx: 0, ry: 0, rz: 0 },
      b5: { x: -7, y: 0, z: 1, rx: 0, ry: 0, rz: 0 },
      w1: { x: -8, y: 5, z: -3, rx: 0, ry: 0, rz: 0 },
      w2: { x: 8, y: 5, z: -3, rx: 0, ry: 0, rz: 0 },
      w3: { x: -8, y: -5, z: -3, rx: 0, ry: 0, rz: 0 },
      w4: { x: 8, y: -5, z: -3, rx: 0, ry: 0, rz: 0 },
      w5: { x: 0, y: 6, z: -6, rx: 0, ry: 0, rz: 0 },
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    // Camera moves (original three phases + gallery overview + CTA settle)
    tl.to(camera.position, { x: -3, y: 1, z: 4.5, ease: "sine.inOut", duration: 2 }, 0)
      .to(camera.position, { x: 4, y: -1, z: 6, ease: "sine.inOut", duration: 2 }, 2)
      .to(camera.position, { x: 0, y: 0.5, z: 5, ease: "sine.inOut", duration: 2 }, 4)
      .to(camera.position, { x: -2.5, y: 1.8, z: 7, ease: "sine.inOut", duration: 1 }, 6)
      .to(camera.position, { x: 0, y: 0.3, z: 5.2, ease: "sine.inOut", duration: 1 }, 7);

    tl.to(lookAtTarget, { x: 0.4, y: 0.6, z: 0, ease: "sine.inOut", duration: 2 }, 0)
      .to(lookAtTarget, { x: -0.4, y: -0.6, z: 0, ease: "sine.inOut", duration: 2 }, 2)
      .to(lookAtTarget, { x: 0, y: 0, z: 0, ease: "sine.inOut", duration: 2 }, 4)
      .to(lookAtTarget, { x: 0, y: 0.3, z: 0, ease: "sine.inOut", duration: 1 }, 6)
      .to(lookAtTarget, { x: 0, y: 0, z: 0, ease: "sine.inOut", duration: 1 }, 7);

    // Flight paths (identical structure to the reference; extended through the new sections)
    tl.to(bStates.b1, { x: 8, y: -1, z: 2, ry: -3, duration: 2, ease: "sine.inOut" }, 0)
      .to(bStates.b1, { x: -10, y: 3, z: 4, ry: 2, duration: 2, ease: "sine.inOut" }, 2)
      .to(bStates.b1, { x: 0, y: 0, z: 0, ry: 0, duration: 1 }, 4)
      .to(bStates.b1, { x: 6, y: 2, z: -2, ry: 2, duration: 2, ease: "sine.inOut" }, 5.5);

    tl.to(bStates.b2, { x: -8, y: 6, z: 1, ry: 4, duration: 2, ease: "sine.inOut" }, 0.5)
      .to(bStates.b2, { x: 10, y: -6, z: -2, ry: -2, duration: 2, ease: "sine.inOut" }, 2.5)
      .to(bStates.b2, { x: -6, y: 3, z: -4, ry: 3, duration: 2.5, ease: "sine.inOut" }, 5.5);

    tl.to(bStates.b3, { x: 6, y: -4, z: 4, ry: -2, duration: 2, ease: "sine.inOut" }, 0.2)
      .to(bStates.b3, { x: -6, y: 5, z: -3, ry: 5, duration: 2, ease: "sine.inOut" }, 2.2)
      .to(bStates.b3, { x: 5, y: -2, z: 2, ry: -3, duration: 2.5, ease: "sine.inOut" }, 5.8);

    tl.to(bStates.b4, { x: -10, y: -2, z: 1, ry: 6, duration: 2.5, ease: "sine.inOut" }, 0)
      .to(bStates.b4, { x: 10, y: 4, z: -1, ry: -6, duration: 2, ease: "sine.inOut" }, 2.5)
      .to(bStates.b4, { x: -4, y: 5, z: -5, ry: 4, duration: 2.5, ease: "sine.inOut" }, 6);

    tl.to(bStates.b5, { x: 8, y: 1, z: 6, ry: -2, duration: 1.5, ease: "sine.inOut" }, 1)
      .to(bStates.b5, { x: -12, y: -8, z: -8, ry: 4, duration: 2, ease: "sine.inOut" }, 3)
      .to(bStates.b5, { x: 7, y: 0, z: -3, ry: -4, duration: 2.5, ease: "sine.inOut" }, 6);

    tl.to(bStates.w1, { x: 10, y: -4, z: 1, ry: -3, duration: 2, ease: "sine.inOut" }, 0)
      .to(bStates.w1, { x: -10, y: 8, z: -3, ry: 4, duration: 2 }, 3)
      .to(bStates.w1, { x: 8, y: 4, z: -6, ry: -2, duration: 2.5, ease: "sine.inOut" }, 6);

    tl.to(bStates.w2, { x: -10, y: -4, z: 1, ry: 3, duration: 2, ease: "sine.inOut" }, 0.5)
      .to(bStates.w2, { x: 10, y: 8, z: -3, ry: -4, duration: 2 }, 3.5)
      .to(bStates.w2, { x: -8, y: -3, z: -5, ry: 3, duration: 2, ease: "sine.inOut" }, 6.2);

    tl.to(bStates.w3, { x: 12, y: 0, z: 3, ry: -4, duration: 2, ease: "sine.inOut" }, 1)
      .to(bStates.w3, { x: -12, y: -6, z: -6, ry: 3, duration: 2 }, 4)
      .to(bStates.w3, { x: 10, y: 5, z: -4, ry: -3, duration: 2, ease: "sine.inOut" }, 6.4);

    tl.to(bStates.w4, { x: -12, y: 0, z: 3, ry: 4, duration: 2, ease: "sine.inOut" }, 1.5)
      .to(bStates.w4, { x: 12, y: -6, z: -6, ry: -3, duration: 2 }, 4.5)
      .to(bStates.w4, { x: -9, y: 6, z: -5, ry: 4, duration: 1.5, ease: "sine.inOut" }, 6.8);

    tl.to(bStates.w5, { x: 0, y: -1, z: 4, ry: 6, duration: 2.5, ease: "sine.inOut" }, 1)
      .to(bStates.w5, { x: 0, y: 10, z: -8, ry: -6, duration: 2 }, 3.5)
      .to(bStates.w5, { x: 0, y: -2, z: 3, ry: 5, duration: 2, ease: "sine.inOut" }, 6.2);

    const updateScene = () => {
      camera.lookAt(lookAtTarget);

      ["b1", "b2", "b3", "b4", "b5", "w1", "w2", "w3", "w4", "w5"].forEach((name) => {
        const obj = scene.getObjectByName(name);
        if (obj) {
          const state = bStates[name as keyof typeof bStates];
          obj.position.set(state.x, state.y, state.z);
          obj.rotation.set(state.rx || 0, state.ry || 0, state.rz || 0);
        }
      });
    };

    tl.eventCallback("onUpdate", updateScene);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [camera, scene]);

  useFrame((_state, delta) => {
    normalMap.offset.x += delta * 0.012;
    normalMap.offset.y += delta * 0.006;
  });

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 10, 25]} />
      <ambientLight intensity={0.55} />
      <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={3.2} castShadow />
      {/* soft frontal fill so the product reads against the dark set */}
      <directionalLight position={[0, 3, 8]} intensity={1.5} color="#e8e6f5" />
      {/* white rim: directional backlight (no distance falloff) catches the top edges */}
      <directionalLight position={[0, 5, -8]} intensity={2.2} color="#ffffff" />
      {/* Purple accent pair */}
      <pointLight position={[-10, 5, 5]} intensity={2.4} color="#8b5cf6" />
      <pointLight position={[5, -5, -5]} intensity={1.6} color="#a78bfa" />

      {/* Self-contained studio environment (no external HDR) - kept dim so the
          mirror floor stays a dark night reflection like the reference */}
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={0.4} position={[0, 9, -9]} scale={[8, 4, 1]} />
        <Lightformer intensity={0.2} position={[0, 6, 4]} scale={[6, 2, 1]} />
        <Lightformer intensity={0.55} color="#8b5cf6" position={[-5, 2, -1]} rotation-y={Math.PI / 2} scale={[14, 1, 1]} />
        <Lightformer intensity={0.45} color="#a78bfa" position={[5, 0, 1]} rotation-y={-Math.PI / 2} scale={[14, 0.7, 1]} />
      </Environment>

      <Suspense fallback={<Loader />}>
        <HeadphoneModel position={[0, -0.85, 0]} />

        <EnergyOrb name="b1" position={[-6, 2, -2]} scale={0.15 * 2} glowColor="#a78bfa" glowIntensity={8} />
        <EnergyOrb name="b2" position={[6, -1, -3]} scale={0.12 * 2} glowColor="#a78bfa" glowIntensity={8} />
        <EnergyOrb name="b3" position={[-4, -3, -1]} scale={0.1 * 2} glowColor="#8b5cf6" glowIntensity={8} />
        <EnergyOrb name="b4" position={[3, 4, -4]} scale={0.13 * 2} glowColor="#a78bfa" glowIntensity={8} />
        <EnergyOrb name="b5" position={[-7, 0, 1]} scale={0.18 * 2} glowColor="#8b5cf6" glowIntensity={8} />

        <EnergyOrb name="w1" position={[-8, 5, -3]} scale={0.14 * 2} glowColor="#a78bfa" glowIntensity={8} />
        <EnergyOrb name="w2" position={[8, 5, -3]} scale={0.14 * 2} glowColor="#a78bfa" glowIntensity={8} />
        <EnergyOrb name="w3" position={[-8, -5, -3]} scale={0.14 * 2} glowColor="#8b5cf6" glowIntensity={8} />
        <EnergyOrb name="w4" position={[8, -5, -3]} scale={0.14 * 2} glowColor="#a78bfa" glowIntensity={8} />
        <EnergyOrb name="w5" position={[0, 6, -6]} scale={0.16 * 2} glowColor="#8b5cf6" glowIntensity={8} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.3, 0]}>
          <planeGeometry args={[500, 500]} />
          <MeshReflectorMaterial
            mirror={0}
            resolution={1024}
            mixBlur={0}
            mixStrength={9}
            roughness={0}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#080808"
            metalness={0.9}
            normalMap={normalMap}
            normalScale={new THREE.Vector2(0.35, 0.35)}
          />
        </mesh>
      </Suspense>

      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur />
        <ChromaticAberration
          blendFunction={BlendFunction.SCREEN}
          offset={new THREE.Vector2(0.0008, 0.0008)}
          radialModulation={false}
          modulationOffset={0.15}
        />
        <Noise opacity={0.04} />
        <Vignette eskil={false} offset={0.1} darkness={1.2} />
      </EffectComposer>
    </>
  );
}

export default function ModelViewerClient() {
  return (
    <div className="relative h-full w-full">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        className="h-full w-full"
        shadows
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
