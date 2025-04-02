import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAudioVisual } from '@/contexts/AudioVisualContext';
import * as THREE from 'three';

export const Bars = () => {
  const { audioData, isPlaying } = useAudioVisual();
  const groupRef = useRef<THREE.Group>(null);
  
  const barCount = 32;
  const bars = useMemo(() => 
    Array.from({ length: barCount }).map((_, i) => ({
      position: [(i - barCount/2 + 0.5) * 0.3, 0, 0],
      color: new THREE.Color().setHSL(i / barCount * 0.6 + 0.6, 0.8, 0.5)
    })),
  []);
  
  useFrame(() => {
    if (!groupRef.current || !isPlaying || !audioData || audioData.length === 0) return;
    
    groupRef.current.children.forEach((child, i) => {
      // Map each bar to a frequency in the audio data
      const freqIndex = Math.floor((i / barCount) * Math.min(audioData.length, 64));
      const audioValue = Math.abs(audioData[freqIndex] || 0);
      
      // Scale the bar height based on audio intensity
      const scaleY = Math.max(0.1, audioValue * 10);
      child.scale.y = scaleY;
      
      // Update position to keep the bar grounded
      child.position.y = scaleY / 2;
    });
  });
  
  return (
    <group ref={groupRef}>
      {bars.map((bar, i) => (
        <mesh key={i} position={bar.position}>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial 
            color={bar.color} 
            emissive={bar.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};
