'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import MagneticWrapper from '@/Component/ui/MagneticWrapper';

function Orb() {
  const meshRef = useRef();

  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={1}>
      <Sphere args={[0.6, 32, 32]} ref={meshRef}>
        <MeshDistortMaterial
          color="#0AFFE8"
          roughness={0}
          metalness={1}
          distort={0.4}
          speed={5}
          emissive="#0AFFE8"
          emissiveIntensity={0.2}
        />
      </Sphere>
    </Float>
  );
}

export default function CartOrb({ count = 0 }) {
  return (
    <div className="relative group">
      <Link href="/cart">
        <MagneticWrapper strength={0.4}>
          <div className="w-12 h-12 relative flex items-center justify-center">
            {/* 3D CANVAS FOR ORB */}
            <div className="absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity">
              <Canvas camera={{ position: [0, 0, 2] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} color="#0AFFE8" />
                <Orb />
              </Canvas>
            </div>
            
            {/* ICON OVERLAY */}
            <div className="relative z-10 text-black group-hover:scale-110 transition-transform">
              <ShoppingCart size={18} strokeWidth={3} />
            </div>

            {/* COUNT BADGE */}
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-magenta-500 text-white text-[10px] flex items-center justify-center font-bold animate-bounce shadow-[0_0_15px_rgba(255,45,120,0.8)] border border-white/20">
              {count}
            </div>
          </div>
        </MagneticWrapper>
      </Link>
    </div>
  );
}
