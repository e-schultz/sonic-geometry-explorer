
import React from 'react';
import { DetailParameter } from './DetailParameter';
import { useToast } from "@/hooks/use-toast";

export const ParameterAutomationDemo: React.FC = () => {
  const { toast } = useToast();

  const handleValueChange = async (id: string, newValue: string): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate a random server error (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Simulated server error');
    }
    
    // Log the change
    console.log(`Parameter ${id} changed to ${newValue}`);
    
    // You would typically update your global state or send to API here
  };

  // Example validators
  const numericValidator = (value: string): boolean | string => {
    if (!/^\d+$/.test(value)) {
      return "Value must be numeric";
    }
    return true;
  };

  const bpmValidator = (value: string): boolean | string => {
    const num = Number(value);
    if (isNaN(num)) {
      return "BPM must be a number";
    }
    if (num < 60 || num > 180) {
      return "BPM must be between 60 and 180";
    }
    return true;
  };

  const volumeValidator = (value: string): boolean | string => {
    const num = Number(value);
    if (isNaN(num)) {
      return "Volume must be a number";
    }
    if (num < 0 || num > 100) {
      return "Volume must be between 0 and 100";
    }
    return true;
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold gradient-text">Parameter Automation</h2>
      
      <div className="grid gap-4">
        <DetailParameter
          id="bpm"
          name="BPM"
          value="120"
          onValueChange={handleValueChange}
          validator={bpmValidator}
        />
        
        <DetailParameter
          id="volume"
          name="Master Volume"
          value="75"
          onValueChange={handleValueChange}
          validator={volumeValidator}
        />
        
        <DetailParameter
          id="preset"
          name="Preset Name"
          value="Default"
          onValueChange={handleValueChange}
        />
        
        <DetailParameter
          id="intensity"
          name="Visual Intensity"
          value="Medium"
          onValueChange={handleValueChange}
        />
      </div>
    </div>
  );
};
