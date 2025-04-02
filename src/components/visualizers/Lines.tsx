
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAudioVisual } from '@/contexts/AudioVisualContext';
import * as THREE from 'three';

export const Lines = () => {
  const { audioData, isPlaying } = useAudioVisual();
  const linesRef = useRef<THREE.Group>(null);
  
  const lineCount = 20;
  const lines = useMemo(() => 
    Array.from({ length: lineCount }).map((_, i) => ({
      length: 10,
      rotation: (Math.PI * 2 * i) / lineCount,
      color: new THREE.Color().setHSL(i * 0.03 + 0.5, 0.8, 0.5),
    })),
  []);
  
  useFrame(() => {
    if (!linesRef.current || !isPlaying || audioData.length === 0) return;
    
    // Rotate the entire group
    linesRef.current.rotation.z += 0.002;
    
    // Update each line based on audio frequency data
    linesRef.current.children.forEach((line, i) => {
      if (i >= lineCount) return;
      
      // Map each line to a specific audio frequency range
      const freqIndex = Math.floor((i / lineCount) * audioData.length);
      const audioValue = Math.abs(audioData[freqIndex] || 0);
      
      // Scale the line based on the audio intensity
      const scale = 1 + audioValue * 3;
      line.scale.y = Math.max(0.2, scale);
    });
  });
  
  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <mesh key={i} rotation={[0, 0, line.rotation]}>
          <boxGeometry args={[0.05, line.length, 0.05]} />
          <meshBasicMaterial color={line.color} />
        </mesh>
      ))}
    </group>
  );
};
