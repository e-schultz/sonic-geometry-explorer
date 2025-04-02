
import React, { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAutomation } from '@/contexts/AutomationContext';
import { ParameterType } from '@/models/automation';

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.coerce.number({
    required_error: "Value is required",
    invalid_type_error: "Value must be a number",
  }),
  type: z.enum(['BPM', 'bass-intensity', 'visualizer-property'], {
    required_error: "Parameter type is required",
  }),
});

type FormData = z.infer<typeof formSchema>;

export const AddParameterForm: React.FC<{
  onComplete: () => void;
}> = ({ onComplete }) => {
  const { addParameter } = useAutomation();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      value: 0,
      type: 'BPM' as ParameterType,
    },
  });
  
  const onSubmit = (data: FormData) => {
    // Explicitly ensure all required properties are present
    addParameter({
      name: data.name,           // Required: explicitly passed
      value: data.value,         // Required: explicitly passed
      type: data.type,           // Required: explicitly passed
      automationEnabled: false,  // Required: default value
      automationConfig: {
        pattern: 'sine',
        minValue: data.value * 0.5,
        maxValue: data.value * 1.5,
        speed: 30,
        phase: 0,
      },
    });
    form.reset();
    onComplete();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Parameter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input type="number" step="any" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parameter Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parameter type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background border border-input">
                  <SelectItem value="BPM">BPM</SelectItem>
                  <SelectItem value="bass-intensity">Bass Intensity</SelectItem>
                  <SelectItem value="visualizer-property">Visualizer Property</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit">Add Parameter</Button>
        </div>
      </form>
    </Form>
  );
};
