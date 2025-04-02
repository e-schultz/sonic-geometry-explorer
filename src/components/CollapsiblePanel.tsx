
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAudioVisual } from '@/contexts/AudioVisualContext';

interface CollapsiblePanelProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  collapsed,
  onToggleCollapse,
}) => {
  const { isPlaying, togglePlay } = useAudioVisual();

  return (
    <div className="fixed bottom-0 left-0 w-full z-10">
      <Collapsible
        open={!collapsed}
        onOpenChange={(open) => {
          if (open !== collapsed) {
            onToggleCollapse();
          }
        }}
      >
        {/* Controls that are always visible */}
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-16 flex items-center gap-3">
            {/* Play/Pause button */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full glassmorphic border-visualizer-purple/30 hover:bg-visualizer-purple/20"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-visualizer-text" />
              ) : (
                <Play className="h-5 w-5 text-visualizer-text" />
              )}
            </Button>
            
            {/* Toggle panel button */}
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-12 w-12 rounded-full glassmorphic border-visualizer-purple/30 hover:bg-visualizer-purple/20"
              >
                {collapsed ? (
                  <ChevronUp className="h-5 w-5 text-visualizer-text" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-visualizer-text" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        
        <CollapsibleContent className="glassmorphic border-t border-visualizer-purple/30 pb-8">
          <div className="flex flex-col gap-4 p-5 max-w-3xl mx-auto w-full">
            {/* Content for the collapsible panel goes here */}
            <p className="text-center text-visualizer-text">Control Panel Content</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
