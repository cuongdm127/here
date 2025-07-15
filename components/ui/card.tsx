import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={
        `bg-white shadow-md rounded-2xl p-4 ${className}`
      }
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function CardContent({ children, className = '', ...props }: CardContentProps) {
  return (
    <div
      className={`space-y-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
