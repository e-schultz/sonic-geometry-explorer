
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pen, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface DetailParameterProps {
  id: string;
  name: string;
  value: string;
  onValueChange?: (id: string, newValue: string) => Promise<void>;
  validator?: (value: string) => boolean | string;
}

export const DetailParameter: React.FC<DetailParameterProps> = ({
  id,
  name,
  value: initialValue,
  onValueChange,
  validator,
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempValue, setTempValue] = useState<string>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setTempValue(value);
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempValue(value);
    setError(null);
  };

  const validateInput = (input: string): boolean => {
    if (!validator) return true;
    
    const validationResult = validator(input);
    
    if (typeof validationResult === 'string') {
      setError(validationResult);
      return false;
    } else if (validationResult === false) {
      setError(`Invalid value for ${name}`);
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateInput(tempValue)) {
      return;
    }

    if (onValueChange) {
      setIsSubmitting(true);
      
      try {
        await onValueChange(id, tempValue);
        setValue(tempValue);
        setIsEditing(false);
        toast({
          title: "Parameter updated",
          description: `${name} has been updated to ${tempValue}`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: `Could not update ${name}. Please try again.`,
        });
        console.error("Failed to update parameter:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // If no onValueChange handler, just update the local state
      setValue(tempValue);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative rounded-md border border-input p-3 shadow-sm">
      <div className="flex flex-col gap-1">
        {isEditing ? (
          <>
            <div className="flex flex-col gap-2">
              <Input
                id={`param-${id}`}
                value={tempValue}
                onChange={(e) => {
                  setTempValue(e.target.value);
                  validateInput(e.target.value);
                }}
                className={error ? "border-red-500" : ""}
                aria-invalid={!!error}
                disabled={isSubmitting}
              />
              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <Label className="text-sm text-muted-foreground">{name}</Label>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-7 w-7"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleSave}
                  className="h-7 w-7"
                  disabled={isSubmitting}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-base font-medium">{value}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleEdit}
                className="h-7 w-7"
              >
                <Pen className="h-4 w-4" />
              </Button>
            </div>
            <Label className="text-sm text-muted-foreground">{name}</Label>
          </>
        )}
      </div>
    </div>
  );
};
