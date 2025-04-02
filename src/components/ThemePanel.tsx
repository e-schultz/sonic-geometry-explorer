
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ThemePanelProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  className?: string;
}

export const ThemePanel: React.FC<ThemePanelProps> = ({ 
  theme, 
  onThemeChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${className}`}>
      <p className="text-sm mr-2">Theme:</p>
      <ToggleGroup type="single" value={theme} onValueChange={(value) => {
        if (value) onThemeChange(value as 'light' | 'dark');
      }}>
        <ToggleGroupItem value="light" aria-label="Light Mode" className="p-1">
          <Sun className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Dark Mode" className="p-1">
          <Moon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
