
import React from 'react';
import { useAudioVisual } from '@/contexts/AudioVisualContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Volume2, Music, Wand2, ChevronUp, ChevronDown } from 'lucide-react';
import { CollapsiblePanel } from '@/components/CollapsiblePanel';

export const ControlPanel = () => {
  const {
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    bpm,
    setBpm,
    activeVisualizers,
    toggleVisualizer,
    bassIntensity,
    setBassIntensity,
    melodyIntensity,
    setMelodyIntensity
  } = useAudioVisual();
  
  const [isOpen, setIsOpen] = React.useState(false);
  
  const visualizerTypes = [
    { id: 'diamond', label: 'Diamond' },
    { id: 'circles', label: 'Circles' },
    { id: 'lines', label: 'Lines' },
    { id: 'maze', label: 'Maze' },
    { id: 'bars', label: 'Bars' },
    { id: 'spiral', label: 'Spiral' }
  ] as const;
  
  return (
    <div className="fixed bottom-0 left-0 w-full z-10">
      <div className={`glassmorphic border-t border-visualizer-purple/30 pb-8 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col gap-4 p-5 max-w-3xl mx-auto w-full">
          {/* Play Controls */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold gradient-text">Geometric Audio-Visual Experience</h2>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                togglePlay();
              }}
              className="h-12 w-12 rounded-full bg-visualizer-purple/20 border-visualizer-purple/50"
            >
              {isPlaying ? (
                <ChevronDown className="h-5 w-5 text-visualizer-text" />
              ) : (
                <ChevronUp className="h-5 w-5 text-visualizer-text" />
              )}
            </Button>
          </div>
          
          {/* Audio Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Volume2 className="w-4 h-4 mr-2 text-visualizer-blue" />
                    <Label>Master Volume</Label>
                  </div>
                  <span className="text-sm opacity-70">{Math.round(volume * 100)}%</span>
                </div>
                <Slider
                  value={[volume * 100]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolume(value[0] / 100)}
                  className="control-slider"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Music className="w-4 h-4 mr-2 text-visualizer-blue" />
                    <Label>BPM</Label>
                  </div>
                  <span className="text-sm opacity-70">{bpm}</span>
                </div>
                <Slider
                  value={[bpm]}
                  min={60}
                  max={180}
                  step={1}
                  onValueChange={(value) => setBpm(value[0])}
                  className="control-slider"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bass Intensity</Label>
                  <Slider
                    value={[bassIntensity * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setBassIntensity(value[0] / 100)}
                    className="control-slider"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Melody Intensity</Label>
                  <Slider
                    value={[melodyIntensity * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setMelodyIntensity(value[0] / 100)}
                    className="control-slider"
                  />
                </div>
              </div>
            </div>
            
            {/* Visualizer Toggles */}
            <div className="space-y-2">
              <div className="flex items-center mb-2">
                <Wand2 className="w-4 h-4 mr-2 text-visualizer-pink" />
                <Label className="text-base">Active Visualizers</Label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {visualizerTypes.map((vis) => (
                  <div key={vis.id} className="flex items-center justify-between">
                    <Label htmlFor={`toggle-${vis.id}`} className="text-sm">
                      {vis.label}
                    </Label>
                    <Switch
                      id={`toggle-${vis.id}`}
                      checked={activeVisualizers.includes(vis.id)}
                      onCheckedChange={() => toggleVisualizer(vis.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline"
            className="text-visualizer-text opacity-50 hover:opacity-100 mx-auto mt-2"
            onClick={() => setIsOpen(false)}
          >
            <ChevronDown className="h-5 w-5 mr-2" />
            Close
          </Button>
        </div>
      </div>
      
      {/* Collapsible Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 h-12 w-28 rounded-full glassmorphic border-visualizer-purple/30 hover:bg-visualizer-purple/20 ${isOpen ? 'hidden' : 'flex items-center justify-center'}`}
      >
        <ChevronUp className="h-5 w-5 text-visualizer-text mr-1" />
        <span className="text-xs">Controls</span>
      </Button>
    </div>
  );
};
