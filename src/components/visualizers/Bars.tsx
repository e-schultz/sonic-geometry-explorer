
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAudioVisual } from '@/contexts/AudioVisualContext';

const NUM_BARS = 64;
const BAR_WIDTH = 0.1;
const MAX_HEIGHT = 5;
const SPACING = 0.15;

export const Bars = () => {
  const { audioData } = useAudioVisual();
  const meshRefs = useRef<THREE.Mesh[]>([]);
  
  const bars = useMemo(() => {
    const width = NUM_BARS * (BAR_WIDTH + SPACING) - SPACING;
    const positions = [];
    const geometries = [];
    
    for (let i = 0; i < NUM_BARS; i++) {
      const x = i * (BAR_WIDTH + SPACING) - width / 2;
      positions.push(x);
      
      const geometry = new THREE.BoxGeometry(BAR_WIDTH, 0.1, BAR_WIDTH);
      geometry.translate(0, 0.05, 0);
      geometries.push(geometry);
    }
    
    return { positions, geometries };
  }, []);
  
  useFrame(() => {
    if (!audioData || !audioData.length) return;
    
    for (let i = 0; i < NUM_BARS; i++) {
      if (meshRefs.current[i]) {
        const height = Math.max(0.1, audioData[i] * MAX_HEIGHT);
        meshRefs.current[i].scale.y = height;
        meshRefs.current[i].position.y = height / 2;
      }
    }
  });
  
  return (
    <group>
      {bars.positions.map((x, i) => (
        <mesh
          key={i}
          ref={el => el && (meshRefs.current[i] = el)}
          position={[x, 0, 0]}
          geometry={bars.geometries[i]}
        >
          <meshStandardMaterial 
            color={new THREE.Color(0.6, 0.2, 0.8)}
            emissive={new THREE.Color(0.2, 0.05, 0.4)}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};
