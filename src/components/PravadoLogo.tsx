
import React from 'react';

interface PravadoLogoProps {
  variant?: 'navbar' | 'sidebar' | 'hero' | 'icon-only';
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
          className="h-10 w-10 object-contain flex-shrink-0"
          loading="lazy"
        />
        <span className="text-xl font-bold text-white leading-tight">PRAVADO</span>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`flex items-center space-x-6 ${className}`}>
        <img 
          src={logoSrc}
          alt="PRAVADO - Marketing Operating System"
          className="h-24 lg:h-32 w-24 lg:w-32 object-contain flex-shrink-0"
          loading="eager"
        />
        <div className="flex flex-col">
          <span className="text-4xl lg:text-6xl font-bold text-white leading-tight">PRAVADO</span>
          <span className="text-lg lg:text-xl text-white/90 leading-tight mt-2">Marketing Operating System</span>
        </div>
      </div>
    );
  }

  // Navbar variant - clean icon + text for top navigation
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
