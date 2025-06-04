
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'enterprise-blue',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2', 
    lg: 'w-8 h-8 border-3'
  };

  return (
    <div 
      className={`loading-spinner ${sizeClasses[size]} ${className}`}
      style={{
        borderColor: '#f3f4f6',
        borderTopColor: color === 'enterprise-blue' ? '#1e40af' : color
      }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
