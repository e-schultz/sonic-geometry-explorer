
import React from 'react';
import { Scene } from '@/components/Scene';
import { ControlPanel } from '@/components/ControlPanel';
import { AudioVisualProvider } from '@/contexts/AudioVisualContext';
import { ThemePanel } from '@/components/ThemePanel';
import { useTheme } from '@/hooks/useTheme';
import { ParameterAutomationDemo } from '@/components/ParameterAutomationDemo';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <AudioVisualProvider>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-visualizer-bg' : 'bg-solarized-base3'}`}>
        {/* Background Three.js Scene */}
        <Scene />
        
        {/* Header */}
        <div className="absolute top-0 left-0 w-full p-6 z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center gradient-text animate-float">
            Sonic Geometry Explorer
          </h1>
        </div>
        
        {/* Theme Toggle Panel */}
        <div className="absolute top-4 right-4 z-20">
          <ThemePanel theme={theme} onThemeChange={() => toggleTheme()} className="glassmorphic" />
        </div>
        
        {/* Control Panel (now a collapsible panel) */}
        <ControlPanel />
        
        {/* Parameter Automation Demo */}
        <div className="absolute bottom-4 right-4 z-20 w-80">
          <ParameterAutomationDemo />
        </div>
      </div>
    </AudioVisualProvider>
  );
};

export default Index;
