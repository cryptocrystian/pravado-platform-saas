import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ChevronRight,
  ChevronDown,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Target,
  Users,
  Brain,
  BarChart3,
  TrendingUp,
  Lightbulb,
  Zap,
  Star,
  Info,
  Clock,
  AlertTriangle,
  PlayCircle,
  HelpCircle,
  Award,
  Timer,
  Flag
} from 'lucide-react';
import { 
  automateMethodologyService, 
  AutomateStepProgress, 
  AutomateGuidedAction,
  AUTOMATE_STEPS
} from '@/services/automateMethodologyService';

interface AutomateStepGuidanceProps {
  tenantId: string;
  currentPage?: string; // The current platform page/feature
  campaignId?: string;
  compact?: boolean; // Show compact version
  showCurrentStepOnly?: boolean; // Only show guidance for current step
  onActionComplete?: (actionId: string) => void;
  className?: string;
}

interface StepGuidanceMapping {
  page: string;
  relatedSteps: string[]; // Step codes that are relevant to this page
  stepWeights?: { [stepCode: string]: number }; // How relevant each step is (1-10)
}

// Mapping of platform features to AUTOMATE steps
const PLATFORM_STEP_MAPPING: StepGuidanceMapping[] = [
  {
    page: 'content-marketing',
    relatedSteps: ['A', 'U', 'T', 'M'],
    stepWeights: { 'A': 9, 'U': 8, 'T': 10, 'M': 7 }
  },
  {
    page: 'public-relations',
    relatedSteps: ['A', 'U', 'T', 'M'],
    stepWeights: { 'A': 8, 'U': 9, 'T': 10, 'M': 8 }
  },
  {
    page: 'seo-intelligence',
    relatedSteps: ['A', 'T', 'O', 'M'],
    stepWeights: { 'A': 10, 'T': 9, 'O': 8, 'M': 9 }
  },
  {
    page: 'analytics',
    relatedSteps: ['M', 'A', 'T'],
    stepWeights: { 'M': 10, 'A': 7, 'T': 6 }
  },
  {
    page: 'campaigns',
    relatedSteps: ['T', 'O', 'M', 'A'],
    stepWeights: { 'T': 10, 'O': 9, 'M': 8, 'A': 7 }
  },
  {
    page: 'dashboard',
    relatedSteps: ['A', 'M', 'T'],
    stepWeights: { 'A': 6, 'M': 8, 'T': 5 }
  }
];

const AutomateStepGuidance: React.FC<AutomateStepGuidanceProps> = ({
  tenantId,
  currentPage,
  campaignId,
  compact = false,
  showCurrentStepOnly = false,
  onActionComplete,
  className = ''
}) => {
  const [methodology, setMethodology] = useState<{ id: string; name: string; steps: AutomateStepProgress[] } | null>(null);
  const [steps, setSteps] = useState<AutomateStepProgress[]>([]);
  const [relevantSteps, setRelevantSteps] = useState<AutomateStepProgress[]>([]);
  const [currentStep, setCurrentStep] = useState<AutomateStepProgress | null>(null);
  const [relevantActions, setRelevantActions] = useState<AutomateGuidedAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [showAllSteps, setShowAllSteps] = useState(false);

  useEffect(() => {
    if (tenantId) {
      loadMethodologyData();
    }
  }, [tenantId, campaignId, currentPage]);

  const loadMethodologyData = async () => {
    try {
      setIsLoading(true);
      
      // Get methodology progress
      const progressData = await automateMethodologyService.getMethodologyProgress(tenantId, campaignId);
      
      setMethodology(progressData.methodology);
      setSteps(progressData.steps);
      setCurrentStep(progressData.nextRecommendedStep);

      // Filter steps relevant to current page
      if (currentPage && !showCurrentStepOnly) {
        const mapping = PLATFORM_STEP_MAPPING.find(m => m.page === currentPage);
        if (mapping) {
          const filtered = progressData.steps.filter(step => 
            mapping.relatedSteps.includes(step.step_code)
          ).sort((a, b) => {
            const weightA = mapping.stepWeights?.[a.step_code] || 5;
            const weightB = mapping.stepWeights?.[b.step_code] || 5;
            return weightB - weightA;
          });
          setRelevantSteps(filtered);
        } else {
          setRelevantSteps(progressData.steps);
        }
      } else if (showCurrentStepOnly && progressData.nextRecommendedStep) {
        setRelevantSteps([progressData.nextRecommendedStep]);
      } else {
        setRelevantSteps(progressData.steps);
      }

      // Load relevant actions for current/relevant steps
      if (progressData.nextRecommendedStep) {
        const actions = await automateMethodologyService.getGuidedActions(progressData.nextRecommendedStep.id!);
        const pageRelevantActions = currentPage ? 
          actions.filter(action => 
            action.action_category === getPageCategory(currentPage) ||
            action.related_platform_features?.includes(currentPage)
          ) : actions;
        setRelevantActions(pageRelevantActions);
      }

    } catch (error) {
      console.error('Failed to load methodology data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPageCategory = (page: string): string => {
    const categoryMap: { [key: string]: string } = {
      'content-marketing': 'content',
      'public-relations': 'pr',
      'seo-intelligence': 'seo',
      'analytics': 'technical',
      'campaigns': 'strategy'
    };
    return categoryMap[page] || 'strategy';
  };

  const getStepIcon = (stepCode: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'A': Target,
      'U': Users,
      'T': Brain,
      'O': BarChart3,
      'M': TrendingUp,
      'E': Lightbulb
    };
    return iconMap[stepCode] || Target;
  };

  const getStepColor = (stepCode: string) => {
    const colorMap: Record<string, string> = {
      'A': 'text-red-600 bg-red-100 border-red-200',
      'U': 'text-blue-600 bg-blue-100 border-blue-200',
      'T': 'text-green-600 bg-green-100 border-green-200',
      'O': 'text-yellow-600 bg-yellow-100 border-yellow-200',
      'M': 'text-purple-600 bg-purple-100 border-purple-200',
      'E': 'text-indigo-600 bg-indigo-100 border-indigo-200'
    };
    return colorMap[stepCode] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getRelevanceScore = (step: AutomateStepProgress): number => {
    if (!currentPage) return 5;
    const mapping = PLATFORM_STEP_MAPPING.find(m => m.page === currentPage);
    return mapping?.stepWeights?.[step.step_code] || 5;
  };

  const handleActionComplete = async (actionId: string) => {
    try {
      await automateMethodologyService.updateGuidedAction(actionId, {
        status: 'completed'
      });
      onActionComplete?.(actionId);
      await loadMethodologyData(); // Refresh data
    } catch (error) {
      console.error('Failed to complete action:', error);
    }
  };

  const startStep = async (stepId: string) => {
    try {
      await automateMethodologyService.updateStepProgress(stepId, {
        status: 'in_progress'
      });
      await loadMethodologyData(); // Refresh data
    } catch (error) {
      console.error('Failed to start step:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!methodology || relevantSteps.length === 0) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-center py-4">
          <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No AUTOMATE guidance available</p>
          <Button size="sm" className="mt-2" onClick={loadMethodologyData}>
            Initialize AUTOMATE Methodology
          </Button>
        </div>
      </Card>
    );
  }

  if (compact && !isExpanded) {
    return (
      <Card className={`${className} transition-all hover:shadow-md cursor-pointer`} onClick={() => setIsExpanded(true)}>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-pravado-orange" />
              <span className="text-sm font-medium">AUTOMATE Guidance</span>
              {currentStep && (
                <Badge variant="outline" className="text-xs">
                  Step {currentStep.step_code}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Progress value={methodology.overall_completion_percentage} className="w-16 h-1" />
              <span className="text-xs text-gray-500">{methodology.overall_completion_percentage}%</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-pravado-orange" />
            <h3 className="font-semibold">AUTOMATE Methodology</h3>
            {currentPage && (
              <Badge variant="outline" className="text-xs">
                {currentPage.replace('-', ' ')}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Progress value={methodology.overall_completion_percentage} className="w-20" />
            <span className="text-sm text-gray-600">{methodology.overall_completion_percentage}%</span>
            {compact && (
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Current Step Focus */}
        {currentStep && (
          <Alert className="mb-4 border-enterprise-blue bg-blue-50">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Current Focus: {currentStep.step_name}</span>
                  {currentPage && (
                    <span className="text-sm text-gray-600 ml-2">
                      (Relevance: {getRelevanceScore(currentStep)}/10 for this page)
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{currentStep.completion_percentage}%</span>
                  {currentStep.status === 'pending' && (
                    <Button size="sm" onClick={() => startStep(currentStep.id!)}>
                      <PlayCircle className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions for Current Page */}
        {relevantActions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              Recommended Actions for This Page
            </h4>
            <div className="space-y-2">
              {relevantActions.slice(0, compact ? 2 : 3).map((action) => (
                <div key={action.id} className={`p-2 rounded border text-sm ${
                  action.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="font-medium">{action.action_title}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {action.difficulty_level}
                        </Badge>
                        {action.estimated_time_minutes && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <Timer className="h-3 w-3 mr-0.5" />
                            {action.estimated_time_minutes}m
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {action.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleActionComplete(action.id!)}>
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relevant Steps for Current Page */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              {currentPage ? 'Relevant Steps' : 'All Steps'} 
              ({relevantSteps.length})
            </h4>
            {!showCurrentStepOnly && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAllSteps(!showAllSteps)}
              >
                {showAllSteps ? 'Show Relevant' : 'Show All'}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {(showAllSteps ? steps : relevantSteps).slice(0, compact ? 3 : 6).map((step) => {
              const StepIcon = getStepIcon(step.step_code);
              const stepColor = getStepColor(step.step_code);
              const relevanceScore = getRelevanceScore(step);
              
              return (
                <div key={step.id} className={`p-3 rounded-lg border ${stepColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      <StepIcon className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{step.step_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {step.step_code}
                          </Badge>
                          {currentPage && relevanceScore > 7 && (
                            <Badge className="text-xs bg-yellow-100 text-yellow-800">
                              High Relevance
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={step.completion_percentage} className="w-16 h-1" />
                          <span className="text-xs text-gray-600">{step.completion_percentage}%</span>
                          <Badge variant="outline" className="text-xs">
                            {step.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {step.status === 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => startStep(step.id!)}>
                          <PlayCircle className="h-3 w-3" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Methodology Insights */}
        {methodology.overall_completion_percentage > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Methodology Insight</span>
            </div>
            <p className="text-sm text-gray-700">
              {methodology.overall_completion_percentage < 25 ? (
                "You're just getting started! Focus on the Assessment & Audit step to build a strong foundation."
              ) : methodology.overall_completion_percentage < 50 ? (
                "Great progress! Continue with Understanding your Audience to ensure targeted strategies."
              ) : methodology.overall_completion_percentage < 75 ? (
                "You're making excellent progress! Focus on optimization and measurement for maximum impact."
              ) : (
                "Outstanding! You're nearing methodology completion. Focus on acceleration and transformation."
              )}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <Button size="sm" variant="outline">
            <BookOpen className="h-3 w-3 mr-1" />
            View Full Guide
          </Button>
          {currentStep && (
            <Button size="sm">
              <ArrowRight className="h-3 w-3 mr-1" />
              Continue {currentStep.step_code}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AutomateStepGuidance;