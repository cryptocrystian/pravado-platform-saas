
import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

export function MetricCard({ title, value, icon: Icon, description, color }: MetricCardProps) {
  return (
    <Card className={`p-6 bg-white border-l-4 border-l-${color} border border-border-gray transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className={`h-8 w-8 text-${color}`} />
        <div className={`text-3xl font-bold text-${color}`}>
          {value}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-professional-gray mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Card>
  );
}
