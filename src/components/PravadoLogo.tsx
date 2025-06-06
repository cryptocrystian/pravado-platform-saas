
import React from 'react';

interface PravadoLogoProps {
  variant?: 'full' | 'compact' | 'icon-only';
  className?: string;
}

export function PravadoLogo({ variant = 'full', className = '' }: PravadoLogoProps) {
  const logoSrc = '/lovable-uploads/b6e060fa-91ad-4bda-9b7e-330354ecd57b.png';

  if (variant === 'icon-only') {
    return (
      <div className={`flex items-center ${className}`}>
        <img 
          src={logoSrc}
          alt="PRAVADO"
          className="w-8 h-8 object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <img 
          src={logoSrc}
          alt="PRAVADO - Marketing Operating System"
          className="h-8 w-8 object-contain flex-shrink-0"
          loading="lazy"
        />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white leading-tight">PRAVADO</span>
        </div>
      </div>
    );
  }

  // Full horizontal variant - icon on left, text on right
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <img 
        src={logoSrc}
        alt="PRAVADO - Marketing Operating System"
        className="h-12 w-12 object-contain flex-shrink-0"
        loading="lazy"
      />
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-white leading-tight">PRAVADO</span>
        <span className="text-xs text-white/80 leading-tight">Marketing Operating System</span>
      </div>
    </div>
  );
}
