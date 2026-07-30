import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean; 
}

export function Button({ 
  children, 
  onClick, 
  type = "button", 
  className = "btn btn-primary",
  disabled = false
}: ButtonProps) {
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}