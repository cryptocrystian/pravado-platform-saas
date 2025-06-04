
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Building, User, AlertCircle, Target, Sparkles } from 'lucide-react';
import { format, differenceInHours } from 'date-fns';

interface HAROOpportunityCardProps {
  request: any;
  urgencyLevel: 'low' | 'medium' | 'high';
  onGenerateResponse: () => void;
}

export function HAROOpportunityCard({ request, urgencyLevel, onGenerateResponse }: HAROOpportunityCardProps) {
  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getUrgencyIcon = (level: string) => {
    return level === 'high' ? AlertCircle : Clock;
  };

  const hoursUntilDeadline = request.deadline ? 
    differenceInHours(new Date(request.deadline), new Date()) : null;

  // Simulate AI match confidence (in real implementation, this would come from the matching algorithm)
  const matchConfidence = Math.floor(Math.random() * 40) + 60; // 60-100%

  const UrgencyIcon = getUrgencyIcon(urgencyLevel);

  return (
    <Card className="p-6 bg-white border border-border-gray hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="space-y-4">
        {/* Header with urgency and match confidence */}
        <div className="flex items-center justify-between">
          <Badge className={`${getUrgencyColor(urgencyLevel)} flex items-center`}>
            <UrgencyIcon className="h-3 w-3 mr-1" />
            {urgencyLevel === 'high' ? 'Urgent' : urgencyLevel === 'medium' ? 'Medium' : 'Low Priority'}
          </Badge>
          <Badge 
            variant="outline" 
            className={`${
              matchConfidence >= 90 ? 'bg-green-100 text-green-800 border-green-200' :
              matchConfidence >= 75 ? 'bg-blue-100 text-blue-800 border-blue-200' :
              'bg-gray-100 text-gray-800 border-gray-200'
            }`}
          >
            <Target className="h-3 w-3 mr-1" />
            {matchConfidence}% Match
          </Badge>
        </div>

        {/* Title and Category */}
        <div>
          <h3 className="text-lg font-semibold text-professional-gray mb-2 line-clamp-2">
            {request.subject}
          </h3>
          <Badge variant="outline" className="bg-pravado-purple/10 text-pravado-purple border-pravado-purple">
            {request.category}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {request.description}
        </p>

        {/* Requirements if present */}
        {request.requirements && (
          <div className="p-3 bg-soft-gray rounded-lg">
            <p className="text-xs font-medium text-professional-gray mb-1">Requirements:</p>
            <p className="text-xs text-gray-600">{request.requirements}</p>
          </div>
        )}

        {/* Journalist and Outlet Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {request.journalist_name && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{request.journalist_name}</span>
            </div>
          )}
          {request.outlet && (
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-1" />
              <span>{request.outlet}</span>
            </div>
          )}
        </div>

        {/* Keywords */}
        {request.keywords && request.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {request.keywords.slice(0, 3).map((keyword: string, index: number) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-enterprise-blue/10 text-enterprise-blue border-enterprise-blue/20"
              >
                {keyword}
              </Badge>
            ))}
            {request.keywords.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{request.keywords.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Deadline and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border-gray">
          <div className="text-sm text-gray-600">
            {request.deadline ? (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {hoursUntilDeadline && hoursUntilDeadline > 0 ? (
                    `${hoursUntilDeadline}h remaining`
                  ) : (
                    format(new Date(request.deadline), 'MMM dd, HH:mm')
                  )}
                </span>
              </div>
            ) : (
              <span>No deadline specified</span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              onClick={onGenerateResponse}
              className="bg-enterprise-blue hover:bg-enterprise-blue/90"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Generate Response
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
