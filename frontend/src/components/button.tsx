import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

export function Button({ children, onClick, type = "button", className = "btn btn-primary" }: ButtonProps) {
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}