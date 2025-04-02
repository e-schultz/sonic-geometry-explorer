
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAudioVisual } from '@/contexts/AudioVisualContext';
import * as THREE from 'three';

export const Diamond = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { audioData, isPlaying } = useAudioVisual();
  
  // Get average audio level for scaling
  const getAverageAudioLevel = () => {
    if (!audioData || audioData.length === 0) return 0;
    return audioData.reduce((sum, value) => sum + Math.abs(value), 0) / audioData.length;
  };
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Rotate diamond continuously
    meshRef.current.rotation.y += 0.005;
    meshRef.current.rotation.x += 0.002;
    
    if (isPlaying) {
      const audioLevel = getAverageAudioLevel();
      // Pulse the diamond with the audio
      const scale = 1 + audioLevel * 2;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1.5, 0]} />
      <meshStandardMaterial 
        color="#8B5CF6" 
        wireframe={true}
        emissive="#8B5CF6"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};
