
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAudioVisual } from '@/contexts/AudioVisualContext';
import * as THREE from 'three';

export const Circles = () => {
  const { audioData, isPlaying } = useAudioVisual();
  
  // Create multiple circles
  const circleRefs = useRef<THREE.Mesh[]>([]);
  
  const circleCount = 5;
  const circles = useMemo(() => 
    Array.from({ length: circleCount }).map((_, i) => ({
      radius: 2 + i * 0.7,
      speed: 0.01 - i * 0.002,
      color: new THREE.Color().setHSL(i * 0.1 + 0.6, 0.8, 0.5),
    })), 
  []);
  
  useFrame(() => {
    if (!isPlaying || audioData.length === 0) return;
    
    circleRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      
      // Get frequency data relevant to this circle
      const freqIndex = Math.floor(audioData.length * (i / circleCount));
      const audioValue = Math.abs(audioData[freqIndex] || 0);
      
      // Rotate and scale based on audio
      mesh.rotation.z += circles[i].speed;
      const scale = 1 + audioValue * 0.5;
      mesh.scale.set(scale, scale, 1);
    });
  });
  
  return (
    <group>
      {circles.map((circle, i) => (
        <mesh 
          key={i}
          ref={el => {
            if (el) circleRefs.current[i] = el;
          }}
          position={[0, 0, -i * 0.1]}
        >
          <ringGeometry args={[circle.radius, circle.radius + 0.05, 64]} />
          <meshBasicMaterial 
            color={circle.color} 
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
};
