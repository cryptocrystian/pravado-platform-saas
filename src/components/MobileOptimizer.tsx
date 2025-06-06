
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileOptimizerProps {
  children: React.ReactNode;
  mobileLayout?: React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  showOnlyMobile?: boolean;
}

export function MobileOptimizer({ 
  children, 
  mobileLayout, 
  className = '',
  hideOnMobile = false,
  showOnlyMobile = false 
}: MobileOptimizerProps) {
  const isMobile = useIsMobile();

  if (hideOnMobile && isMobile) {
    return null;
  }

  if (showOnlyMobile && !isMobile) {
    return null;
  }

  if (mobileLayout && isMobile) {
    return <div className={className}>{mobileLayout}</div>;
  }

  return (
    <div className={cn(
      // Base responsive classes
      'transition-all duration-200',
      
      // Mobile-first optimizations
      isMobile && [
        'touch-manipulation', // Optimize touch interactions
        'select-none', // Prevent text selection on touch
        'overscroll-behavior-contain' // Prevent overscroll bounce
      ],
      
      className
    )}>
      {children}
    </div>
  );
}

// Mobile-optimized navigation component
interface MobileNavProps {
  items: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
    active?: boolean;
  }>;
  className?: string;
}

export function MobileNav({ items, className = '' }: MobileNavProps) {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 z-50',
      'bg-white border-t border-gray-200',
      'safe-area-inset-bottom', // Handle iOS safe area
      className
    )}>
      <div className="grid grid-cols-5 h-16">
        {items.slice(0, 5).map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center',
              'text-xs font-medium transition-colors',
              'active:bg-gray-100', // Touch feedback
              item.active 
                ? 'text-pravado-purple bg-pravado-purple/5' 
                : 'text-gray-600 hover:text-pravado-purple'
            )}
          >
            {item.icon && (
              <div className="w-5 h-5 mb-1">
                {item.icon}
              </div>
            )}
            <span className="truncate max-w-full px-1">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}

// Mobile-optimized touch gestures
export function useTouchGestures() {
  const isMobile = useIsMobile();

  const addTouchOptimizations = (element: HTMLElement) => {
    if (!isMobile || !element) return;

    // Add touch-friendly classes
    element.classList.add('touch-manipulation');
    element.style.touchAction = 'manipulation';
    
    // Optimize for 44px minimum touch target (iOS HIG)
    const computedStyle = window.getComputedStyle(element);
    const height = parseInt(computedStyle.height);
    const width = parseInt(computedStyle.width);
    
    if (height < 44) {
      element.style.minHeight = '44px';
    }
    if (width < 44) {
      element.style.minWidth = '44px';
    }
  };

  return { addTouchOptimizations };
}
