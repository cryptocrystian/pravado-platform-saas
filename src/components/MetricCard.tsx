
import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  accentColor: string;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  accentColor, 
  trend = 'neutral',
  isLoading = false 
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <span className="text-green-500 text-sm ml-1">↗</span>;
      case 'down':
        return <span className="text-red-500 text-sm ml-1">↘</span>;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-professional-gray';
    }
  };

  return (
    <Card 
      className={`p-6 bg-white border-l-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in cursor-pointer focus:outline-none focus:ring-2 focus:ring-enterprise-blue focus:ring-offset-2`} 
      style={{ borderLeftColor: accentColor }}
      tabIndex={0}
      role="button"
      aria-label={`${title}: ${value}. ${description}`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon 
          className="h-8 w-8 text-professional-gray transition-colors duration-200" 
          aria-hidden="true"
        />
        <div className={`text-3xl font-bold transition-all duration-300 ${getTrendColor()}`}>
          <span className="inline-block transition-transform duration-200 hover:scale-105">
            {value}
          </span>
          {getTrendIcon()}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-professional-gray mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Card>
  );
}
