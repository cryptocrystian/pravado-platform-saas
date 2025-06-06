
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ContentPiece } from '@/hooks/useContent';

interface ContentGridProps {
  content: ContentPiece[];
  viewMode: 'grid' | 'list';
}

export function ContentGrid({ content, viewMode }: ContentGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateContent = (text: string, maxLength: number = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
      {content.map((item) => (
        <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-professional-gray mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 capitalize mb-2">{item.content_type.replace('_', ' ')}</p>
              {item.content_body && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                  {truncateContent(item.content_body)}
                </p>
              )}
            </div>
            <Badge className={getStatusColor(item.status)}>
              {item.status}
            </Badge>
          </div>
          
          <div className="space-y-2">
            {(item as any).target_platforms && (item as any).target_platforms.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {(item as any).target_platforms.slice(0, 3).map((platform: string, idx: number) => (
                  <span key={idx} className="text-xs bg-soft-gray px-2 py-1 rounded capitalize">
                    {platform}
                  </span>
                ))}
                {(item as any).target_platforms.length > 3 && (
                  <span className="text-xs bg-soft-gray px-2 py-1 rounded">
                    +{(item as any).target_platforms.length - 3} more
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Created {format(new Date(item.created_at), 'MMM dd, yyyy')}</span>
              {item.view_count !== undefined && (
                <span>{item.view_count} views</span>
              )}
            </div>
            
            {(item as any).scheduled_date && (
              <p className="text-xs text-blue-600">
                Scheduled: {format(new Date((item as any).scheduled_date), 'MMM dd, yyyy')}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
