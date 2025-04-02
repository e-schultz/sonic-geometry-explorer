
export interface AutomationParameter {
  id: string;
  name: string;
  value: number;
  type: ParameterType;
  automationEnabled: boolean;
  automationConfig?: AutomationConfig;
}

export type ParameterType = 'BPM' | 'bass-intensity' | 'visualizer-property';

export type AutomationPattern = 'linear' | 'exponential' | 'sine' | 'random';

export interface AutomationConfig {
  pattern: AutomationPattern;
  minValue: number;
  maxValue: number;
  speed: number; // cycles per minute
  phase: number; // 0-1, starting position in the cycle
}

export const validateAutomationParameter = (param: Partial<AutomationParameter>): string | true => {
  if (!param.id) return "ID is required";
  if (!param.name || param.name.trim() === '') return "Name is required";
  if (param.value === undefined || isNaN(param.value)) return "Value must be a number";
  if (!param.type) return "Parameter type is required";
  
  const validTypes: ParameterType[] = ['BPM', 'bass-intensity', 'visualizer-property'];
  if (!validTypes.includes(param.type as ParameterType)) {
    return `Type must be one of: ${validTypes.join(', ')}`;
  }
  
  return true;
};

export const validateAutomationConfig = (config: Partial<AutomationConfig>): string | true => {
  if (!config.pattern) return "Automation pattern is required";
  
  const validPatterns: AutomationPattern[] = ['linear', 'exponential', 'sine', 'random'];
  if (!validPatterns.includes(config.pattern as AutomationPattern)) {
    return `Pattern must be one of: ${validPatterns.join(', ')}`;
  }
  
  if (config.minValue === undefined || isNaN(config.minValue)) return "Minimum value must be a number";
  if (config.maxValue === undefined || isNaN(config.maxValue)) return "Maximum value must be a number";
  if (config.minValue >= config.maxValue) return "Maximum value must be greater than minimum value";
  if (config.speed === undefined || isNaN(config.speed) || config.speed <= 0) return "Speed must be a positive number";
  
  return true;
};
