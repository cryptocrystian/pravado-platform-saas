
import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  accentColor: string;
}

export function MetricCard({ title, value, icon: Icon, description, accentColor }: MetricCardProps) {
  return (
    <Card className={`p-6 bg-white border-l-4 transition-all hover:shadow-md`} style={{ borderLeftColor: accentColor }}>
      <div className="flex items-center justify-between mb-4">
        <Icon className="h-8 w-8 text-professional-gray" />
        <div className="text-3xl font-bold text-professional-gray">
          {value}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-professional-gray mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Card>
  );
}
