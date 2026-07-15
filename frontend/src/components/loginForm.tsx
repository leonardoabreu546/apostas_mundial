import React from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Card } from "./card";

interface FormProps {
  title: string;
  fields: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    type?: string;
  }[];
  submitText: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function Form({ title, fields, submitText, onSubmit }: FormProps) {
  return (
    <Card title={title}>
      <form onSubmit={onSubmit}>
        {fields.map((field, idx) => (
          <Input 
            key={idx}
            label={field.label}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
            type={field.type}
            required
          />
        ))}
        <Button type="submit" className="btn btn-primary w-100">
          {submitText}
        </Button>
      </form>
    </Card>
  );
}