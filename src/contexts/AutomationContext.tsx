
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAudioVisual } from './AudioVisualContext';
import { AutomationParameter, AutomationPattern, validateAutomationParameter } from '@/models/automation';
import { useToast } from '@/hooks/use-toast';

interface AutomationContextType {
  parameters: AutomationParameter[];
  addParameter: (param: Omit<AutomationParameter, 'id'>) => string | Error;
  updateParameter: (id: string, updates: Partial<AutomationParameter>) => boolean;
  deleteParameter: (id: string) => boolean;
  toggleAutomation: (id: string, enabled: boolean) => boolean;
}

const AutomationContext = createContext<AutomationContextType | undefined>(undefined);

export const useAutomation = () => {
  const context = useContext(AutomationContext);
  if (!context) {
    throw new Error('useAutomation must be used within an AutomationProvider');
  }
  return context;
};

export const AutomationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parameters, setParameters] = useState<AutomationParameter[]>([]);
  const { setBpm, setBassIntensity } = useAudioVisual();
  const { toast } = useToast();
  
  // Generate a unique ID
  const generateId = () => `param_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // Add a new parameter
  const addParameter = (param: Omit<AutomationParameter, 'id'>): string | Error => {
    const newParam = { ...param, id: generateId() };
    
    // Validate the parameter
    const validationResult = validateAutomationParameter(newParam);
    if (validationResult !== true) {
      toast({
        title: "Parameter Error",
        description: validationResult,
        variant: "destructive",
      });
      return new Error(validationResult);
    }
    
    setParameters(prev => [...prev, newParam as AutomationParameter]);
    
    toast({
      title: "Parameter Added",
      description: `${newParam.name} has been added to automation.`,
    });
    
    return newParam.id;
  };
  
  // Update an existing parameter
  const updateParameter = (id: string, updates: Partial<AutomationParameter>): boolean => {
    let success = false;
    
    setParameters(prev => {
      const index = prev.findIndex(p => p.id === id);
      if (index === -1) return prev;
      
      const updatedParam = { ...prev[index], ...updates };
      
      // Validate the updated parameter
      const validationResult = validateAutomationParameter(updatedParam);
      if (validationResult !== true) {
        toast({
          title: "Update Error",
          description: validationResult,
          variant: "destructive",
        });
        return prev;
      }
      
      success = true;
      const newParams = [...prev];
      newParams[index] = updatedParam;
      return newParams;
    });
    
    if (success) {
      toast({
        title: "Parameter Updated",
        description: `Parameter has been updated successfully.`,
      });
    }
    
    return success;
  };
  
  // Delete a parameter
  const deleteParameter = (id: string): boolean => {
    let deleted = false;
    
    setParameters(prev => {
      const index = prev.findIndex(p => p.id === id);
      if (index === -1) return prev;
      
      deleted = true;
      const newParams = [...prev];
      newParams.splice(index, 1);
      return newParams;
    });
    
    if (deleted) {
      toast({
        title: "Parameter Deleted",
        description: "Parameter has been removed from automation.",
      });
    }
    
    return deleted;
  };
  
  // Toggle automation for a parameter
  const toggleAutomation = (id: string, enabled: boolean): boolean => {
    let success = false;
    
    setParameters(prev => {
      const index = prev.findIndex(p => p.id === id);
      if (index === -1) return prev;
      
      success = true;
      const newParams = [...prev];
      newParams[index] = { ...newParams[index], automationEnabled: enabled };
      return newParams;
    });
    
    return success;
  };
  
  // Apply automation calculations
  const calculateAutomatedValue = useCallback((param: AutomationParameter, time: number): number => {
    if (!param.automationEnabled || !param.automationConfig) return param.value;
    
    const { pattern, minValue, maxValue, speed, phase } = param.automationConfig;
    const cyclePosition = ((time / 60000) * speed + phase) % 1; // Position in cycle (0-1)
    
    switch (pattern) {
      case 'linear':
        // Triangular wave: up then down
        return cyclePosition <= 0.5
          ? minValue + cyclePosition * 2 * (maxValue - minValue)
          : maxValue - (cyclePosition - 0.5) * 2 * (maxValue - minValue);
      
      case 'exponential':
        // Exponential curve
        const normalized = cyclePosition <= 0.5
          ? cyclePosition * 2
          : 2 - cyclePosition * 2;
        const expCurve = Math.pow(normalized, 2);
        return minValue + expCurve * (maxValue - minValue);
      
      case 'sine':
        // Sinusoidal wave
        return minValue + (Math.sin(cyclePosition * Math.PI * 2) + 1) / 2 * (maxValue - minValue);
      
      case 'random':
        // Random steps (4 per cycle)
        const step = Math.floor(cyclePosition * 4);
        const randomValue = Math.sin(step * 12345.67890 + phase * 1000); // Deterministic "random"
        return minValue + (randomValue + 1) / 2 * (maxValue - minValue);
      
      default:
        return param.value;
    }
  }, []);
  
  // Animation loop to update automated parameters
  useEffect(() => {
    if (parameters.length === 0 || !parameters.some(p => p.automationEnabled)) {
      return;
    }
    
    let animationFrameId: number;
    let lastUpdateTime = Date.now();
    
    const updateParameters = () => {
      const currentTime = Date.now();
      const enabledParams = parameters.filter(p => p.automationEnabled && p.automationConfig);
      
      // Update parameters based on their automation patterns
      enabledParams.forEach(param => {
        const newValue = calculateAutomatedValue(param, currentTime);
        
        // Apply the automated value to the audio engine parameters
        switch (param.type) {
          case 'BPM':
            setBpm(newValue);
            break;
          case 'bass-intensity':
            setBassIntensity(newValue);
            break;
          case 'visualizer-property':
            // Would need implementation for specific visualizer properties
            break;
        }
        
        // Update our internal state to show the current value
        setParameters(prev => {
          const index = prev.findIndex(p => p.id === param.id);
          if (index === -1) return prev;
          
          const newParams = [...prev];
          newParams[index] = { ...newParams[index], value: newValue };
          return newParams;
        });
      });
      
      lastUpdateTime = currentTime;
      animationFrameId = requestAnimationFrame(updateParameters);
    };
    
    animationFrameId = requestAnimationFrame(updateParameters);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [parameters, setBpm, setBassIntensity, calculateAutomatedValue]);
  
  return (
    <AutomationContext.Provider value={{
      parameters,
      addParameter,
      updateParameter,
      deleteParameter,
      toggleAutomation
    }}>
      {children}
    </AutomationContext.Provider>
  );
};
