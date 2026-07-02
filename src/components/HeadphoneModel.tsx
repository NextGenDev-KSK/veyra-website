"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { STLLoader } from "three-stdlib";
import { MathUtils } from "three";
import * as THREE from "three";
import type { Group } from "three";
import { asset } from "@/lib/asset";

const MODEL_URL = asset("/models/headphone.stl");
// Slightly larger than the toy's frame so the product owns the hero.
const TARGET_SIZE = 3.7;

export function HeadphoneModel(props: JSX.IntrinsicElements["group"]) {
  const groupRef = useRef<Group>(null!);
  const geometry = useLoader(STLLoader, MODEL_URL);
  const [hovered, setHover] = useState(false);

  const { fitScale } = useMemo(() => {
    geometry.center();
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    return { fitScale: TARGET_SIZE / maxDim };
  }, [geometry]);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      // Smooth hover scale animation (same behavior the toy had)
      const targetScale = hovered ? 1.1 : 1;
      groupRef.current.scale.set(
        MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 10),
        MathUtils.lerp(groupRef.current.scale.y, targetScale, delta * 10),
        MathUtils.lerp(groupRef.current.scale.z, targetScale, delta * 10)
      );
    }
  });

  return (
    <group
      ref={groupRef}
      {...props}
      dispose={null}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <mesh geometry={geometry} scale={fitScale} castShadow receiveShadow>
        {/* Matte black body with brushed dark-metal sheen; purple rim comes from the light rig */}
        <meshPhysicalMaterial
          color="#1a1a20"
          roughness={0.3}
          metalness={0.78}
          clearcoat={0.85}
          clearcoatRoughness={0.18}
          envMapIntensity={2.2}
        />
      </mesh>
      {/* white halo shell: backfaces only, so it reads as a glowing edge that bloom lifts */}
      <mesh geometry={geometry} scale={fitScale * 1.022}>
        <meshBasicMaterial
          color="#f5f3ff"
          side={THREE.BackSide}
          transparent
          opacity={0.3}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
