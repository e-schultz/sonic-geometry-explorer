
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
        
        {/* Control Panel */}
        <ControlPanel />
        
        {/* Instructions */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 glassmorphic px-6 py-3 z-10 text-center">
          <p className="opacity-80 text-sm">Click the play button to start the audio-visual experience</p>
        </div>
      </div>
    </AudioVisualProvider>
  );
};

export default Index;
