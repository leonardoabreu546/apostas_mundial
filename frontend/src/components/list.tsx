import React from "react";

interface ListProps {
  children: React.ReactNode;
  title?: string;
}

export function List({ children, title }: ListProps) {
  return (
    <div className="text-start">
      {title && <h5 className="mb-3">{title}</h5>}
      <ul className="list-group">
        {children}
      </ul>
    </div>
  );
}

interface ListItemProps {
  title: string;
  badgeText: string;
}

export function ListItem({ title, badgeText }: ListItemProps) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <strong>{title}</strong>
      <span className="badge bg-secondary rounded-pill">{badgeText}</span>
    </li>
  );
}