
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
      <div className={`flex items-center space-x-2 ${className}`}>
        <img 
          src={logoSrc}
          alt="PRAVADO - Marketing Operating System"
          className="h-8 w-auto object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  // Full variant - show complete logo with tagline space
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoSrc}
        alt="PRAVADO - Marketing Operating System"
        className="h-12 w-auto object-contain"
        loading="lazy"
      />
    </div>
  );
}
