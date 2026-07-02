"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface EnergyOrbProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  name?: string;
  glowColor?: string;
  glowIntensity?: number;
}

// Glowing purple energy orbs - they inherit the exact flight paths,
// glow treatment and idle-float choreography the butterflies had.
export function EnergyOrb({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  name,
  glowColor = "#a78bfa",
  glowIntensity = 8,
}: EnergyOrbProps) {
  const group = useRef<THREE.Group>(null!);
  const hoverGroup = useRef<THREE.Group>(null!);
  const core = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Unique seed based on initial position so they don't move in sync
    const seed = position[0] + position[1] + position[2];

    if (hoverGroup.current) {
      // Pronounced idle floating animation (independent of scroll)
      hoverGroup.current.position.y = Math.sin(t * 1.2 + seed) * 0.25;
      hoverGroup.current.position.x = Math.cos(t * 0.8 + seed) * 0.15;
      hoverGroup.current.position.z = Math.sin(t * 1.5 + seed) * 0.1;

      hoverGroup.current.rotation.z = Math.sin(t * 0.5 + seed) * 0.15;
      hoverGroup.current.rotation.x = Math.cos(t * 0.4 + seed) * 0.1;
    }
    if (core.current) {
      // Gentle energy pulse
      const pulse = 1 + Math.sin(t * 2.2 + seed) * 0.09;
      core.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={group} position={position} scale={scale} rotation={rotation} name={name} dispose={null}>
      <group ref={hoverGroup}>
        <mesh ref={core}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#160b2e"
            emissive={new THREE.Color(glowColor)}
            emissiveIntensity={glowIntensity}
            toneMapped={false}
          />
        </mesh>
        {/* faint halo shell */}
        <mesh scale={1.55}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial
            color={new THREE.Color(glowColor)}
            transparent
            opacity={0.08}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}
