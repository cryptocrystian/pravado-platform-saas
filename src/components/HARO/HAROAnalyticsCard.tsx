
import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface HAROAnalyticsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  accentColor: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function HAROAnalyticsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  accentColor,
  trend = 'neutral' 
}: HAROAnalyticsCardProps) {
  return (
    <Card className="p-6 bg-white border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: accentColor }}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="h-8 w-8 text-professional-gray" />
        <div className="text-3xl font-bold text-professional-gray" style={{ color: accentColor }}>
          {value}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-professional-gray mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      {trend !== 'neutral' && (
        <div className={`text-xs mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↗ Trending up' : '↘ Trending down'}
        </div>
      )}
    </Card>
  );
}
