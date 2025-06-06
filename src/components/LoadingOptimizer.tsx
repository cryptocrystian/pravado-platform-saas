
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingOptimizerProps {
  type: 'dashboard' | 'card' | 'table' | 'chart' | 'list';
  count?: number;
  className?: string;
}

export function LoadingOptimizer({ type, count = 1, className = '' }: LoadingOptimizerProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return (
          <div className={`space-y-6 ${className}`}>
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        );
      
      case 'card':
        return (
          <div className={`p-6 space-y-4 ${className}`}>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-24" />
          </div>
        );
      
      case 'table':
        return (
          <div className={`space-y-3 ${className}`}>
            <Skeleton className="h-6 w-48" />
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/6" />
              </div>
            ))}
          </div>
        );
      
      case 'chart':
        return (
          <div className={`space-y-4 ${className}`}>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-64 w-full" />
            <div className="flex justify-center space-x-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return <Skeleton className={`h-32 w-full ${className}`} />;
    }
  };

  return <>{renderSkeleton()}</>;
}
