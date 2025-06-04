
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6 animate-fade-in">
      <div className="bg-soft-gray rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 transition-all duration-200 hover:bg-gray-100">
        <Icon className="h-8 w-8 text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-medium text-professional-gray mb-3">{title}</h3>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="transition-all duration-200 hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-enterprise-blue focus:ring-offset-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
