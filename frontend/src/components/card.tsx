import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Card({ children, title, className = "card p-4 shadow-sm" }: CardProps) {
  return (
    <div className={className}>
      {title && <h3 className="card-title mb-4">{title}</h3>}
      {children}
    </div>
  );
}