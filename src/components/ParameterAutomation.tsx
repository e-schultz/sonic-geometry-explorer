
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, MinusIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { AutomationParameterItem } from './automation/AutomationParameterItem';
import { AddParameterForm } from './automation/AddParameterForm';
import { useAutomation } from '@/contexts/AutomationContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const ParameterAutomation: React.FC = () => {
  const { parameters } = useAutomation();
  const [isAddingParameter, setIsAddingParameter] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="max-w-md mx-auto p-6 space-y-6 glassmorphic">
      <Collapsible
        open={!isCollapsed}
        onOpenChange={(open) => setIsCollapsed(!open)}
      >
        <div className="flex justify-between items-center">
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <h2 className="text-2xl font-bold gradient-text">Parameter Automation</h2>
              {isCollapsed ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          
          {!isCollapsed && (
            <Button
              variant={isAddingParameter ? "destructive" : "default"}
              size="icon"
              onClick={() => setIsAddingParameter(!isAddingParameter)}
              className="h-8 w-8"
            >
              {isAddingParameter ? <MinusIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
            </Button>
          )}
        </div>
        
        <CollapsibleContent className="transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          {isAddingParameter && (
            <div className="border border-input rounded-lg p-4 bg-background shadow-sm mt-4">
              <h3 className="text-lg font-medium mb-4">Add New Parameter</h3>
              <AddParameterForm onComplete={() => setIsAddingParameter(false)} />
            </div>
          )}
          
          <div className="space-y-4 mt-4">
            {parameters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No automation parameters created yet.
              </div>
            ) : (
              parameters.map(param => (
                <AutomationParameterItem key={param.id} parameter={param} />
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
