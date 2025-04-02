
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, ChevronUp } from 'lucide-react';
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
        {/* Play button that's always visible */}
        <div className="relative">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            variant="outline"
            size="icon"
            className="absolute left-1/2 transform -translate-x-1/2 -top-16 h-12 w-12 rounded-full glassmorphic border-visualizer-purple/30 hover:bg-visualizer-purple/20"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-visualizer-text" />
            ) : (
              <Play className="h-5 w-5 text-visualizer-text" />
            )}
          </Button>
          
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[calc(100%+4px)] h-10 w-28 rounded-t-xl glassmorphic border-visualizer-purple/30 hover:bg-visualizer-purple/20"
            >
              <ChevronUp className="h-5 w-5 text-visualizer-text" />
              <span className="ml-1 text-xs">Controls</span>
            </Button>
          </CollapsibleTrigger>
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
