import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Target,
  Users,
  Brain,
  BarChart3,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  Clock,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  ChevronRight,
  ChevronDown,
  FileText,
  Megaphone,
  Search,
  Star,
  Info,
  ArrowRight,
  Zap,
  Award,
  BookOpen,
  HelpCircle,
  Timer,
  Flag
} from 'lucide-react';
import { 
  automateMethodologyService, 
  AutomateStepProgress, 
  AutomateGuidedAction,
  AUTOMATE_STEPS
} from '@/services/automateMethodologyService';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserData';

interface AutomateGuidedWorkflowProps {
  tenantId: string;
  campaignId?: string;
  onStepComplete?: (stepCode: string) => void;
  onMethodologyComplete?: () => void;
}

const AutomateGuidedWorkflow: React.FC<AutomateGuidedWorkflowProps> = ({
  tenantId,
  campaignId,
  onStepComplete,
  onMethodologyComplete
}) => {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();
  
  const [methodology, setMethodology] = useState<any>(null);
  const [steps, setSteps] = useState<AutomateStepProgress[]>([]);
  const [currentStep, setCurrentStep] = useState<AutomateStepProgress | null>(null);
  const [guidedActions, setGuidedActions] = useState<AutomateGuidedAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [showGuidanceDialog, setShowGuidanceDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AutomateGuidedAction | null>(null);

  useEffect(() => {
    if (tenantId) {
      initializeMethodology();
    }
  }, [tenantId, campaignId]);

  const initializeMethodology = async () => {
    try {
      setIsLoading(true);
      
      // Initialize or get existing methodology
      const methodologyData = await automateMethodologyService.initializeMethodology(tenantId, {
        campaignId,
        methodologyOwner: user?.id,
        templateType: 'default'
      });

      // Get progress data
      const progressData = await automateMethodologyService.getMethodologyProgress(tenantId, campaignId);
      
      setMethodology(progressData.methodology);
      setSteps(progressData.steps);
      setCurrentStep(progressData.nextRecommendedStep);

      // Load guided actions for current step
      if (progressData.nextRecommendedStep) {
        const actions = await automateMethodologyService.getGuidedActions(progressData.nextRecommendedStep.id!);
        setGuidedActions(actions);
      }

    } catch (error) {
      console.error('Failed to initialize methodology:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepStart = async (stepId: string) => {
    try {
      await automateMethodologyService.updateStepProgress(stepId, {
        status: 'in_progress'
      });
      
      // Refresh data
      await initializeMethodology();
    } catch (error) {
      console.error('Failed to start step:', error);
    }
  };

  const handleStepComplete = async (stepId: string) => {
    try {
      const step = steps.find(s => s.id === stepId);
      if (!step) return;

      await automateMethodologyService.updateStepProgress(stepId, {
        status: 'completed',
        completion_percentage: 100
      });

      onStepComplete?.(step.step_code);
      
      // Check if methodology is complete
      const updatedProgress = await automateMethodologyService.getMethodologyProgress(tenantId, campaignId);
      if (updatedProgress.overallProgress >= 100) {
        onMethodologyComplete?.();
      }
      
      // Refresh data
      await initializeMethodology();
    } catch (error) {
      console.error('Failed to complete step:', error);
    }
  };

  const handleActionComplete = async (actionId: string, notes?: string) => {
    try {
      await automateMethodologyService.updateGuidedAction(actionId, {
        status: 'completed',
        completion_notes: notes
      });

      // Refresh guided actions
      if (currentStep?.id) {
        const actions = await automateMethodologyService.getGuidedActions(currentStep.id);
        setGuidedActions(actions);
      }
    } catch (error) {
      console.error('Failed to complete action:', error);
    }
  };

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getStepIcon = (stepCode: string) => {
    const iconMap: Record<string, any> = {
      'A': Target,
      'U': Users,
      'T': Brain,
      'O': BarChart3,
      'M': TrendingUp,
      'E': Lightbulb
    };
    return iconMap[stepCode] || Target;
  };

  const getStepColor = (stepCode: string, index: number) => {
    const colors = [
      'text-enterprise-blue border-enterprise-blue',
      'text-pravado-orange border-pravado-orange',
      'text-pravado-purple border-pravado-purple',
      'text-green-600 border-green-600',
      'text-blue-600 border-blue-600',
      'text-yellow-600 border-yellow-600',
      'text-red-600 border-red-600',
      'text-indigo-600 border-indigo-600'
    ];
    return colors[index] || 'text-gray-600 border-gray-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return PlayCircle;
      case 'blocked': return AlertTriangle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'blocked': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-enterprise-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Methodology Overview */}
      <Card className="bg-gradient-to-r from-enterprise-blue to-pravado-purple text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">AUTOMATE Methodology</h1>
              <p className="text-blue-100">Systematic approach to integrated marketing excellence</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{methodology?.overall_completion_percentage || 0}%</div>
              <p className="text-blue-200">Complete</p>
            </div>
          </div>
          
          <Progress 
            value={methodology?.overall_completion_percentage || 0} 
            className="h-3 bg-blue-800"
          />
          
          <div className="flex items-center justify-between mt-4 text-sm text-blue-100">
            <span>{steps.filter(s => s.status === 'completed').length} of {steps.length} steps completed</span>
            <span>Next: {currentStep?.step_name || 'All steps complete'}</span>
          </div>
        </div>
      </Card>

      {/* Current Step Focus */}
      {currentStep && (
        <Card className="border-l-4 border-l-enterprise-blue">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-enterprise-blue/10 rounded-lg">
                  {React.createElement(getStepIcon(currentStep.step_code), { 
                    className: "h-6 w-6 text-enterprise-blue" 
                  })}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Current Focus: {currentStep.step_name}</h2>
                  <p className="text-gray-600">{currentStep.step_description}</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                Step {currentStep.step_code}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-enterprise-blue">{currentStep.completion_percentage}%</div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pravado-orange">{guidedActions.length}</div>
                <div className="text-sm text-gray-600">Guided Actions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pravado-purple">
                  {guidedActions.filter(a => a.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>

            <Progress value={currentStep.completion_percentage} className="mb-4" />

            <div className="flex space-x-2">
              {currentStep.status === 'pending' && (
                <Button onClick={() => handleStepStart(currentStep.id!)} className="bg-enterprise-blue">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start This Step
                </Button>
              )}
              {currentStep.status === 'in_progress' && currentStep.completion_percentage >= 80 && (
                <Button onClick={() => handleStepComplete(currentStep.id!)} className="bg-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowGuidanceDialog(true)}>
                <BookOpen className="h-4 w-4 mr-2" />
                View Step Guide
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Guided Actions for Current Step */}
      {currentStep && guidedActions.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-pravado-orange" />
              Guided Actions for {currentStep.step_name}
            </h3>
            
            <div className="space-y-4">
              {guidedActions.map((action, index) => (
                <GuidedActionCard
                  key={action.id}
                  action={action}
                  index={index}
                  onComplete={handleActionComplete}
                  onViewDetails={(action) => setSelectedAction(action)}
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* All Steps Overview */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">AUTOMATE Steps Overview</h3>
          
          <div className="space-y-4">
            {steps.map((step, index) => {
              const StepIcon = getStepIcon(step.step_code);
              const StatusIcon = getStatusIcon(step.status);
              const stepColor = getStepColor(step.step_code, index);
              const isExpanded = expandedSteps.has(step.id!);
              
              return (
                <Collapsible key={step.id} open={isExpanded} onOpenChange={() => toggleStepExpansion(step.id!)}>
                  <Card className={`border-l-4 ${stepColor.split(' ')[1]}`}>
                    <CollapsibleTrigger className="w-full">
                      <div className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-opacity-10 ${stepColor.split(' ')[0]} bg-current`}>
                              <StepIcon className={`h-5 w-5 ${stepColor.split(' ')[0]}`} />
                            </div>
                            <div className="text-left">
                              <h4 className="font-semibold">{step.step_name}</h4>
                              <p className="text-sm text-gray-600">{step.step_description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Badge className={getStatusColor(step.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {step.status.replace('_', ' ')}
                            </Badge>
                            <div className="text-right">
                              <div className="font-semibold">{step.completion_percentage}%</div>
                              <div className="text-xs text-gray-500">Step {step.step_code}</div>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="px-4 pb-4 border-t">
                        <div className="pt-4 space-y-4">
                          <Progress value={step.completion_percentage} className="h-2" />
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-pravado-purple">Content: </span>
                              {step.content_pillar_weight}%
                            </div>
                            <div>
                              <span className="font-medium text-pravado-orange">PR: </span>
                              {step.pr_pillar_weight}%
                            </div>
                            <div>
                              <span className="font-medium text-enterprise-blue">SEO: </span>
                              {step.seo_pillar_weight}%
                            </div>
                          </div>

                          {step.action_items && step.action_items.length > 0 && (
                            <div>
                              <h5 className="font-medium mb-2">Key Action Items:</h5>
                              <ul className="space-y-1">
                                {step.action_items.slice(0, 3).map((item: any, itemIndex: number) => (
                                  <li key={itemIndex} className="text-sm text-gray-600 flex items-center">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                                    {typeof item === 'string' ? item : item.title || 'Action item'}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            {step.status === 'pending' && (
                              <Button size="sm" onClick={() => handleStepStart(step.id!)}>
                                <PlayCircle className="h-3 w-3 mr-1" />
                                Start
                              </Button>
                            )}
                            {step.status === 'in_progress' && step.completion_percentage >= 80 && (
                              <Button size="sm" onClick={() => handleStepComplete(step.id!)} variant="outline">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Complete
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <BookOpen className="h-3 w-3 mr-1" />
                              View Guide
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Step Guidance Dialog */}
      <Dialog open={showGuidanceDialog} onOpenChange={setShowGuidanceDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {currentStep && React.createElement(getStepIcon(currentStep.step_code), { 
                className: "h-6 w-6 text-enterprise-blue" 
              })}
              <span>Step Guide: {currentStep?.step_name}</span>
            </DialogTitle>
          </DialogHeader>
          
          {currentStep && (
            <StepGuideContent step={currentStep} actions={guidedActions} />
          )}
        </DialogContent>
      </Dialog>

      {/* Action Details Dialog */}
      <Dialog open={!!selectedAction} onOpenChange={() => setSelectedAction(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAction?.action_title}</DialogTitle>
          </DialogHeader>
          
          {selectedAction && (
            <ActionDetailsContent 
              action={selectedAction} 
              onComplete={handleActionComplete}
              onClose={() => setSelectedAction(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Guided Action Card Component
const GuidedActionCard: React.FC<{
  action: AutomateGuidedAction;
  index: number;
  onComplete: (actionId: string, notes?: string) => void;
  onViewDetails: (action: AutomateGuidedAction) => void;
}> = ({ action, index, onComplete, onViewDetails }) => {
  const [completionNotes, setCompletionNotes] = useState('');
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  const handleComplete = () => {
    onComplete(action.id!, completionNotes);
    setShowCompletionForm(false);
    setCompletionNotes('');
  };

  return (
    <Card className={`transition-all ${action.status === 'completed' ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 w-6 h-6 bg-enterprise-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{action.action_title}</h4>
              <p className="text-sm text-gray-600 mt-1">{action.action_description}</p>
              
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="outline" className={getDifficultyColor(action.difficulty_level)}>
                  {action.difficulty_level}
                </Badge>
                {action.estimated_time_minutes && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Timer className="h-3 w-3 mr-1" />
                    {action.estimated_time_minutes}m
                  </div>
                )}
                <Badge variant="outline">
                  {action.action_category}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {action.status === 'completed' ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            ) : (
              <Badge className={getStatusColor(action.status)}>
                {action.status.replace('_', ' ')}
              </Badge>
            )}
          </div>
        </div>

        {showCompletionForm && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <Textarea
              placeholder="Add completion notes (optional)..."
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              rows={2}
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleComplete}>
                <CheckCircle className="h-3 w-3 mr-1" />
                Mark Complete
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowCompletionForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex space-x-2 mt-3">
          {action.status !== 'completed' && !showCompletionForm && (
            <Button size="sm" onClick={() => setShowCompletionForm(true)}>
              <CheckCircle className="h-3 w-3 mr-1" />
              Complete
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onViewDetails(action)}>
            <Info className="h-3 w-3 mr-1" />
            Details
          </Button>
          {action.platform_guidance_url && (
            <Button size="sm" variant="ghost" asChild>
              <a href={action.platform_guidance_url} target="_blank" rel="noopener noreferrer">
                <ArrowRight className="h-3 w-3 mr-1" />
                Go to Platform
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// Step Guide Content Component
const StepGuideContent: React.FC<{
  step: AutomateStepProgress;
  actions: AutomateGuidedAction[];
}> = ({ step, actions }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Step Overview</h3>
        <p className="text-gray-600">{step.step_description}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-pravado-purple/10 rounded-lg">
          <div className="text-2xl font-bold text-pravado-purple">{step.content_pillar_weight}%</div>
          <div className="text-sm">Content Focus</div>
        </div>
        <div className="text-center p-4 bg-pravado-orange/10 rounded-lg">
          <div className="text-2xl font-bold text-pravado-orange">{step.pr_pillar_weight}%</div>
          <div className="text-sm">PR Focus</div>
        </div>
        <div className="text-center p-4 bg-enterprise-blue/10 rounded-lg">
          <div className="text-2xl font-bold text-enterprise-blue">{step.seo_pillar_weight}%</div>
          <div className="text-sm">SEO Focus</div>
        </div>
      </div>

      {actions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Guided Actions ({actions.length})</h3>
          <div className="space-y-3">
            {actions.map((action, index) => (
              <div key={action.id} className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="w-5 h-5 bg-enterprise-blue text-white rounded-full text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h4 className="font-medium">{action.action_title}</h4>
                  <Badge className={getDifficultyColor(action.difficulty_level)} variant="outline">
                    {action.difficulty_level}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 ml-7">{action.action_description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Action Details Content Component
const ActionDetailsContent: React.FC<{
  action: AutomateGuidedAction;
  onComplete: (actionId: string, notes?: string) => void;
  onClose: () => void;
}> = ({ action, onComplete, onClose }) => {
  const [completionNotes, setCompletionNotes] = useState('');

  const handleComplete = () => {
    onComplete(action.id!, completionNotes);
    onClose();
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={getDifficultyColor(action.difficulty_level)}>
            {action.difficulty_level}
          </Badge>
          <Badge variant="outline">{action.action_category}</Badge>
          {action.estimated_time_minutes && (
            <Badge variant="outline">
              <Timer className="h-3 w-3 mr-1" />
              {action.estimated_time_minutes}m
            </Badge>
          )}
        </div>
        <p className="text-gray-600">{action.action_description}</p>
      </div>

      {action.why_important && (
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            Why This Matters
          </h4>
          <p className="text-sm text-gray-600">{action.why_important}</p>
        </div>
      )}

      {action.how_to_complete && (
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
            How to Complete
          </h4>
          <div className="text-sm text-gray-600 whitespace-pre-wrap">{action.how_to_complete}</div>
        </div>
      )}

      {action.best_practices && action.best_practices.length > 0 && (
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <Award className="h-4 w-4 mr-2 text-green-500" />
            Best Practices
          </h4>
          <ul className="space-y-1">
            {action.best_practices.map((practice, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                {practice}
              </li>
            ))}
          </ul>
        </div>
      )}

      {action.common_mistakes && action.common_mistakes.length > 0 && (
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
            Common Mistakes to Avoid
          </h4>
          <ul className="space-y-1">
            {action.common_mistakes.map((mistake, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <AlertTriangle className="h-3 w-3 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}

      {action.status !== 'completed' && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium">Mark as Complete</h4>
          <Textarea
            placeholder="Add completion notes (optional)..."
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
            rows={3}
          />
          <div className="flex space-x-2">
            <Button onClick={handleComplete}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Action
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomateGuidedWorkflow;