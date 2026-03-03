'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';

function FloatingCore() {
  const meshRef = useRef();

  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 64, 64]} ref={meshRef}>
        <MeshDistortMaterial
          color="#0AFFE8"
          roughness={0.1}
          metalness={0.8}
          distort={0.4}
          speed={4}
          emissive="#0AFFE8"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
}

export default function ZeroGCanvas() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} color="#0AFFE8" intensity={2} />
      <pointLight position={[-10, -10, -10]} color="#7B2FFF" intensity={1} />
      <FloatingCore />
    </Canvas>
  );
}
