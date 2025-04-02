
import React from 'react';
import { AutomationPattern } from '@/models/automation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Zap, Waves, Shuffle } from 'lucide-react';

interface AutomationPatternSelectorProps {
  value: AutomationPattern;
  onChange: (value: AutomationPattern) => void;
  disabled?: boolean;
}

export const AutomationPatternSelector: React.FC<AutomationPatternSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <Select
      disabled={disabled}
      value={value}
      onValueChange={(val) => onChange(val as AutomationPattern)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select pattern" />
      </SelectTrigger>
      <SelectContent className="bg-background border border-input">
        <SelectItem value="linear" className="flex items-center">
          <div className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Linear</span>
          </div>
        </SelectItem>
        <SelectItem value="exponential" className="flex items-center">
          <div className="flex items-center">
            <Zap className="mr-2 h-4 w-4" />
            <span>Exponential</span>
          </div>
        </SelectItem>
        <SelectItem value="sine" className="flex items-center">
          <div className="flex items-center">
            <Waves className="mr-2 h-4 w-4" />
            <span>Sine Wave</span>
          </div>
        </SelectItem>
        <SelectItem value="random" className="flex items-center">
          <div className="flex items-center">
            <Shuffle className="mr-2 h-4 w-4" />
            <span>Random</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
