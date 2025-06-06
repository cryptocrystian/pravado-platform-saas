
import React from 'react';

interface PravadoLogoProps {
  variant?: 'full' | 'compact' | 'icon-only' | 'hero';
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
          alt="PRAVADO"
          className="h-8 w-8 object-contain flex-shrink-0"
          loading="lazy"
        />
        <span className="text-lg font-bold text-white leading-tight">PRAVADO</span>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`flex items-center space-x-6 ${className}`}>
        <img 
          src={logoSrc}
          alt="PRAVADO - Marketing Operating System"
          className="h-32 lg:h-40 w-32 lg:w-40 object-contain flex-shrink-0"
          loading="eager"
        />
        <div className="flex flex-col">
          <span className="text-5xl lg:text-7xl font-bold text-white leading-tight">PRAVADO</span>
          <span className="text-xl lg:text-2xl text-white/90 leading-tight mt-2">Marketing Operating System</span>
        </div>
      </div>
    );
  }

  // Full horizontal variant - clean icon + text for navbar
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <img 
        src={logoSrc}
        alt="PRAVADO"
        className="h-12 w-12 object-contain flex-shrink-0"
        loading="lazy"
      />
      <span className="text-2xl font-bold text-white leading-tight">PRAVADO</span>
    </div>
  );
}
