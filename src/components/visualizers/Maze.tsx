
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAudioVisual } from '@/contexts/AudioVisualContext';
import * as THREE from 'three';

export const Maze = () => {
  const { audioData, isPlaying } = useAudioVisual();
  const groupRef = useRef<THREE.Group>(null);
  
  // Create corner maze elements
  const mazeSize = 6;
  const elements = useMemo(() => {
    const items = [];
    for (let x = 0; x < mazeSize; x++) {
      for (let y = 0; y < mazeSize; y++) {
        // Create elements at the corners
        if (x === 0 || x === mazeSize - 1 || y === 0 || y === mazeSize - 1) {
          items.push({
            position: [(x - mazeSize/2 + 0.5) * 1.2, (y - mazeSize/2 + 0.5) * 1.2, 0],
            size: [0.5, 0.5, 2],
            color: new THREE.Color().setHSL(
              ((x + y) % mazeSize) / mazeSize * 0.3 + 0.6, 
              0.8, 
              0.5
            ),
            index: x * mazeSize + y
          });
        }
      }
    }
    return items;
  }, []);
  
  useFrame(() => {
    if (!groupRef.current || !isPlaying) return;
    
    // Rotate the entire maze
    groupRef.current.rotation.z += 0.003;
    
    // Update each element based on audio
    groupRef.current.children.forEach((child, index) => {
      if (!audioData || audioData.length === 0) return;
      
      // Map each element to a frequency range
      const freqIndex = Math.floor((index / elements.length) * audioData.length);
      const audioValue = Math.abs(audioData[freqIndex] || 0);
      
      // Scale the element based on audio
      const scaleZ = 1 + audioValue * 4;
      child.scale.z = Math.max(0.2, Math.min(4, scaleZ));
    });
  });
  
  return (
    <group ref={groupRef}>
      {elements.map((el, i) => (
        <mesh key={i} position={el.position}>
          <boxGeometry args={el.size} />
          <meshStandardMaterial 
            color={el.color} 
            transparent
            opacity={0.7}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};
