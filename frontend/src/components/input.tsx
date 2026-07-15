import React from "react";

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function Input({ label, type = "text", value, onChange, placeholder, required = false }: InputProps) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input 
        type={type} 
        className="form-control" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}