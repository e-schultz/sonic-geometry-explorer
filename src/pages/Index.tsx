
import React from 'react';
import { Scene } from '@/components/Scene';
import { ControlPanel } from '@/components/ControlPanel';
import { AudioVisualProvider } from '@/contexts/AudioVisualContext';

const Index = () => {
  return (
    <AudioVisualProvider>
      <div className="min-h-screen bg-visualizer-bg">
        {/* Background Three.js Scene */}
        <Scene />
        
        {/* Header */}
        <div className="absolute top-0 left-0 w-full p-6 z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center gradient-text animate-float">
            Sonic Geometry Explorer
          </h1>
        </div>
        
        {/* Control Panel (now a slide-up drawer) */}
        <ControlPanel />
      </div>
    </AudioVisualProvider>
  );
};

export default Index;
