
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAudioVisual } from '@/contexts/AudioVisualContext';
import * as THREE from 'three';

export const Spiral = () => {
  const { audioData, isPlaying } = useAudioVisual();
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create spiral points
  const particleCount = 2000;
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = 0.2 * i;
      const radius = 0.02 * angle;
      
      // Spiral positions
      positions[i3] = radius * Math.cos(angle);
      positions[i3 + 1] = radius * Math.sin(angle);
      positions[i3 + 2] = (i / particleCount) * 5 - 2.5;
      
      // Color gradient along the spiral
      const hue = i / particleCount * 0.3 + 0.6;
      const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, []);
  
  // Geometry with positions and colors
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, [positions, colors]);
  
  useFrame(() => {
    if (!pointsRef.current || !isPlaying) return;
    
    // Rotate the spiral
    pointsRef.current.rotation.z += 0.002;
    pointsRef.current.rotation.y += 0.001;
    
    if (audioData && audioData.length > 0) {
      // Get average audio level
      const avgLevel = audioData.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.length;
      
      // Scale the particles based on audio intensity
      pointsRef.current.scale.set(1 + avgLevel, 1 + avgLevel, 1 + avgLevel * 2);
    }
  });
  
  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.05} 
        vertexColors 
        transparent
        opacity={0.8}
      />
    </points>
  );
};
