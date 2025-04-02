
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useAudioVisual } from '@/contexts/AudioVisualContext';

// Import visualizers
import { Diamond } from '@/components/visualizers/Diamond';
import { Circles } from '@/components/visualizers/Circles';
import { Lines } from '@/components/visualizers/Lines';
import { Maze } from '@/components/visualizers/Maze';
import { Bars } from '@/components/visualizers/Bars';
import { Spiral } from '@/components/visualizers/Spiral';

export const Scene = () => {
  const { activeVisualizers } = useAudioVisual();
  
  return (
    <Canvas className="visualizer-canvas">
      <color attach="background" args={["#0D0E19"]} />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      
      <Suspense fallback={null}>
        {activeVisualizers.includes('diamond') && <Diamond />}
        {activeVisualizers.includes('circles') && <Circles />}
        {activeVisualizers.includes('lines') && <Lines />}
        {activeVisualizers.includes('maze') && <Maze />}
        {activeVisualizers.includes('bars') && <Bars />}
        {activeVisualizers.includes('spiral') && <Spiral />}
      </Suspense>
      
      <OrbitControls 
        enablePan={false}
        minDistance={4}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};
