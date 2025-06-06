
import React from 'react';

interface PravadoLogoProps {
  variant?: 'navbar' | 'sidebar' | 'landing' | 'icon-only';
  className?: string;
}

export function PravadoLogo({ variant = 'navbar', className = '' }: PravadoLogoProps) {
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

  if (variant === 'sidebar') {
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

  if (variant === 'landing') {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <img 
          src={logoSrc}
          alt="PRAVADO"
          className="h-12 w-12 object-contain flex-shrink-0"
          loading="eager"
        />
        <span className="text-3xl font-bold text-white leading-tight">PRAVADO</span>
      </div>
    );
  }

  // Navbar variant - clean horizontal layout
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
