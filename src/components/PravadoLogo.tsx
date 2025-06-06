
import React from 'react';

interface PravadoLogoProps {
  variant?: 'full' | 'compact' | 'icon-only';
  className?: string;
}

export function PravadoLogo({ variant = 'full', className = '' }: PravadoLogoProps) {
  const LogoIcon = () => (
    <div className="relative">
      <svg 
        viewBox="0 0 100 100" 
        className="w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pravadoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff9a56" />
            <stop offset="50%" stopColor="#ff6b35" />
            <stop offset="100%" stopColor="#ff4757" />
          </linearGradient>
          <linearGradient id="pravadoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c3073f" />
            <stop offset="50%" stopColor="#8e44ad" />
            <stop offset="100%" stopColor="#6f2dbd" />
          </linearGradient>
          <linearGradient id="pravadoGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3d59" />
            <stop offset="50%" stopColor="#3742fa" />
            <stop offset="100%" stopColor="#5f27cd" />
          </linearGradient>
        </defs>
        
        {/* Top oval */}
        <ellipse cx="50" cy="20" rx="35" ry="15" fill="url(#pravadoGradient1)" />
        
        {/* Left rounded rectangle */}
        <rect x="15" y="35" width="20" height="50" rx="10" fill="url(#pravadoGradient2)" />
        
        {/* Right circle with curved element */}
        <circle cx="70" cy="50" r="15" fill="url(#pravadoGradient3)" />
        <path d="M 70 35 A 15 15 0 0 1 85 50 A 15 15 0 0 1 70 65 A 25 25 0 0 0 70 35 Z" fill="url(#pravadoGradient3)" opacity="0.7" />
      </svg>
    </div>
  );

  if (variant === 'icon-only') {
    return (
      <div className={`flex items-center ${className}`}>
        <LogoIcon />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <LogoIcon />
        <span className="text-lg font-bold text-white">PRAVADO</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex flex-col items-center">
        <LogoIcon />
        <div className="text-center">
          <h2 className="text-lg font-bold text-white leading-tight">PRAVADO</h2>
          <p className="text-xs text-blue-100 opacity-90 leading-tight">Marketing Operating System</p>
        </div>
      </div>
    </div>
  );
}
