
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, ArrowRight, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MethodologyProgress {
  id: string;
  overall_progress: number;
  status: string;
  automate_step_progress?: Array<{
    id: string;
    step_code: string;
    step_name: string;
    step_index: number;
    completion_percentage: number;
    status: string;
  }>;
}

interface CampaignMethodologyProgressProps {
  methodology: MethodologyProgress | null;
  campaignId: string;
}

export function CampaignMethodologyProgress({ methodology, campaignId }: CampaignMethodologyProgressProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-pravado-orange" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stepProgress = methodology?.automate_step_progress || [];
  const overallProgress = methodology?.overall_progress || 0;
  const completedSteps = stepProgress.filter(step => step.status === 'completed').length;
  const inProgressSteps = stepProgress.filter(step => step.status === 'in_progress').length;

  const nextStep = stepProgress.find(step => step.status === 'pending') || 
                  stepProgress.find(step => step.status === 'in_progress');

  return (
    <Card className="bg-white border-l-4 border-l-pravado-purple">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg text-professional-gray">
          <Brain className="w-5 h-5 text-pravado-purple" />
          <span>AUTOMATE Methodology Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!methodology ? (
          <div className="text-center py-6">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-professional-gray mb-2">
              No AUTOMATE Methodology Tracking
            </h4>
            <p className="text-gray-600 mb-4">
              This campaign was created before methodology integration.
            </p>
            <Button className="bg-pravado-purple hover:bg-pravado-purple/90 text-white">
              Initialize AUTOMATE Tracking
            </Button>
          </div>
        ) : (
          <>
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-professional-gray">Overall Progress</span>
                <span className="text-sm font-semibold text-pravado-purple">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{completedSteps} of 8 steps completed</span>
                <Badge className={getStatusColor(methodology.status)}>
                  {methodology.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            {/* Step Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-soft-gray rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-professional-gray">Completed</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{completedSteps}</p>
              </div>
              <div className="bg-soft-gray rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-pravado-orange" />
                  <span className="font-medium text-professional-gray">In Progress</span>
                </div>
                <p className="text-2xl font-bold text-pravado-orange">{inProgressSteps}</p>
              </div>
            </div>

            {/* Next Step Recommendation */}
            {nextStep && (
              <div className="bg-gradient-to-r from-pravado-purple/10 to-pravado-crimson/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-professional-gray">Next Recommended Step</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {nextStep.step_name} ({nextStep.completion_percentage}% complete)
                    </p>
                  </div>
                  <Link to={`/automate/assess-audit`}>
                    <Button size="sm" className="bg-pravado-purple hover:bg-pravado-purple/90 text-white">
                      Continue
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Step Progress List */}
            <div className="space-y-2">
              <h4 className="font-medium text-professional-gray">Methodology Steps</h4>
              <div className="space-y-1">
                {stepProgress
                  .sort((a, b) => a.step_index - b.step_index)
                  .map((step) => (
                    <div 
                      key={step.id} 
                      className="flex items-center justify-between py-2 px-3 rounded hover:bg-soft-gray transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(step.status)}
                        <span className="text-sm font-medium text-professional-gray">
                          {step.step_code}. {step.step_name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600">
                          {step.completion_percentage}%
                        </span>
                        <div className="w-16">
                          <Progress value={step.completion_percentage} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4 border-t">
              <Link to="/automate" className="flex-1">
                <Button variant="outline" className="w-full border-pravado-purple text-pravado-purple hover:bg-pravado-purple hover:text-white">
                  View Full Methodology
                </Button>
              </Link>
              {nextStep && (
                <Link to={`/automate/assess-audit`} className="flex-1">
                  <Button className="w-full bg-pravado-purple hover:bg-pravado-purple/90 text-white">
                    Continue Next Step
                  </Button>
                </Link>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
