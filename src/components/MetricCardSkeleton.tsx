
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MetricCardSkeleton() {
  return (
    <Card className="p-6 bg-white border-l-4 border-gray-200 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-5 w-32 mb-1" />
      <Skeleton className="h-4 w-24" />
    </Card>
  );
}
