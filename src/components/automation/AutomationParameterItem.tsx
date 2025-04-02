
import React, { useState } from 'react';
import { AutomationParameter, AutomationPattern, AutomationConfig } from '@/models/automation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { AutomationPatternSelector } from './AutomationPatternSelector';
import { CheckIcon, Trash2Icon, Settings } from 'lucide-react';
import { useAutomation } from '@/contexts/AutomationContext';

interface AutomationParameterItemProps {
  parameter: AutomationParameter;
}

export const AutomationParameterItem: React.FC<AutomationParameterItemProps> = ({ parameter }) => {
  const { updateParameter, deleteParameter, toggleAutomation } = useAutomation();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [editState, setEditState] = useState<Partial<AutomationParameter>>({
    name: parameter.name,
    value: parameter.value,
    type: parameter.type,
    automationConfig: parameter.automationConfig || {
      pattern: 'sine',
      minValue: parameter.value * 0.5,
      maxValue: parameter.value * 1.5,
      speed: 30,
      phase: 0,
    }
  });
  
  const handleToggleAutomation = () => {
    toggleAutomation(parameter.id, !parameter.automationEnabled);
  };

  const handlePatternChange = (pattern: AutomationPattern) => {
    setEditState(prev => ({
      ...prev,
      automationConfig: {
        ...prev.automationConfig!,
        pattern
      }
    }));
  };
  
  const handleConfigChange = (key: keyof AutomationConfig, value: number) => {
    setEditState(prev => ({
      ...prev,
      automationConfig: {
        ...prev.automationConfig!,
        [key]: value
      }
    }));
  };
  
  const handleSave = () => {
    // Validate and save changes
    const success = updateParameter(parameter.id, editState);
    if (success) {
      setIsEditing(false);
      setError(null);
    }
  };
  
  const handleCancel = () => {
    setEditState({
      name: parameter.name,
      value: parameter.value,
      type: parameter.type,
      automationConfig: parameter.automationConfig
    });
    setIsEditing(false);
    setError(null);
  };
  
  const handleDelete = () => {
    deleteParameter(parameter.id);
  };

  return (
    <div className="border border-input rounded-lg p-4 space-y-4 bg-background shadow-sm">
      {/* Header with name, value and actions */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-medium">{parameter.name}</div>
          <div className="text-sm text-muted-foreground">{parameter.type}</div>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsEditing(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={handleDelete}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCancel}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                onClick={handleSave}
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Current value display */}
      <div className="flex items-center justify-between">
        <span>Current Value:</span>
        <span className="font-mono">{parameter.value.toFixed(2)}</span>
      </div>

      {/* Automation toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-input">
        <span>Enable Automation</span>
        <Switch
          checked={parameter.automationEnabled}
          onCheckedChange={handleToggleAutomation}
        />
      </div>

      {/* Configuration panel (only visible when editing) */}
      {isEditing && (
        <div className="space-y-4 pt-4 border-t border-input">
          <div className="space-y-2">
            <Label htmlFor={`name-${parameter.id}`}>Name</Label>
            <Input
              id={`name-${parameter.id}`}
              value={editState.name}
              onChange={e => setEditState(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Pattern</Label>
            <AutomationPatternSelector
              value={editState.automationConfig?.pattern || 'sine'}
              onChange={handlePatternChange}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor={`min-${parameter.id}`}>Min Value</Label>
              <span className="font-mono text-sm">
                {editState.automationConfig?.minValue.toFixed(2)}
              </span>
            </div>
            <Input
              id={`min-${parameter.id}`}
              type="number"
              value={editState.automationConfig?.minValue}
              onChange={e => handleConfigChange('minValue', Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor={`max-${parameter.id}`}>Max Value</Label>
              <span className="font-mono text-sm">
                {editState.automationConfig?.maxValue.toFixed(2)}
              </span>
            </div>
            <Input
              id={`max-${parameter.id}`}
              type="number"
              value={editState.automationConfig?.maxValue}
              onChange={e => handleConfigChange('maxValue', Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Speed (cycles/min)</Label>
              <span className="font-mono text-sm">
                {editState.automationConfig?.speed.toFixed(1)}
              </span>
            </div>
            <Slider
              value={[editState.automationConfig?.speed || 30]}
              min={1}
              max={120}
              step={1}
              onValueChange={values => handleConfigChange('speed', values[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Phase</Label>
              <span className="font-mono text-sm">
                {editState.automationConfig?.phase.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[editState.automationConfig?.phase || 0]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={values => handleConfigChange('phase', values[0])}
            />
          </div>
          
          {error && (
            <div className="text-destructive text-sm">{error}</div>
          )}
        </div>
      )}
    </div>
  );
};
