
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle, 
  Star, 
  Brain, 
  Target, 
  Users, 
  BookOpen,
  Video,
  MessageSquare,
  Calendar
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action?: string;
  estimatedTime?: string;
}

export function BetaOnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to PRAVADO Beta',
      description: 'Get introduced to the platform and set your success goals',
      icon: <Star className="w-5 h-5" />,
      completed: false,
      estimatedTime: '5 min'
    },
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Set up your company profile and marketing goals',
      icon: <Users className="w-5 h-5" />,
      completed: false,
      estimatedTime: '10 min'
    },
    {
      id: 'automate-intro',
      title: 'AUTOMATE Methodology Training',
      description: 'Learn the fundamentals of our proven methodology',
      icon: <Brain className="w-5 h-5" />,
      completed: false,
      estimatedTime: '20 min'
    },
    {
      id: 'first-campaign',
      title: 'Create Your First Campaign',
      description: 'Build your first campaign with guided assistance',
      icon: <Target className="w-5 h-5" />,
      completed: false,
      estimatedTime: '30 min'
    },
    {
      id: 'video-tutorial',
      title: 'Watch Key Feature Videos',
      description: 'Get familiar with advanced features through video tutorials',
      icon: <Video className="w-5 h-5" />,
      completed: false,
      estimatedTime: '25 min'
    },
    {
      id: 'documentation',
      title: 'Review Documentation',
      description: 'Access comprehensive guides and best practices',
      icon: <BookOpen className="w-5 h-5" />,
      completed: false,
      estimatedTime: '15 min'
    },
    {
      id: 'feedback-setup',
      title: 'Set Up Feedback Channels',
      description: 'Configure feedback collection and schedule check-ins',
      icon: <MessageSquare className="w-5 h-5" />,
      completed: false,
      estimatedTime: '10 min'
    },
    {
      id: 'success-metrics',
      title: 'Define Success Metrics',
      description: 'Set up tracking for your key performance indicators',
      icon: <CheckCircle className="w-5 h-5" />,
      completed: false,
      estimatedTime: '15 min'
    }
  ]);

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const markStepComplete = (stepIndex: number) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, completed: true } : step
    ));
    if (stepIndex === currentStep && stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const totalEstimatedTime = steps.reduce((total, step) => {
    const time = parseInt(step.estimatedTime?.split(' ')[0] || '0');
    return total + time;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Star className="w-8 h-8 text-pravado-orange" />
          <h1 className="text-3xl font-bold text-professional-gray">Beta Onboarding</h1>
        </div>
        <p className="text-lg text-gray-600 mb-4">
          Welcome to PRAVADO! Let's get you set up for success with personalized guidance.
        </p>
        <div className="flex justify-center space-x-4">
          <Badge className="bg-pravado-purple text-white">
            Beta Program
          </Badge>
          <Badge variant="outline">
            ~{totalEstimatedTime} minutes total
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Onboarding Progress</h3>
            <span className="text-sm text-gray-600">{completedSteps}/{steps.length} completed</span>
          </div>
          <Progress value={progress} className="h-3 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-pravado-purple">{completedSteps}</div>
              <div className="text-xs text-gray-500">Steps Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pravado-orange">{Math.round(progress)}%</div>
              <div className="text-xs text-gray-500">Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-enterprise-blue">{steps.length - completedSteps}</div>
              <div className="text-xs text-gray-500">Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {steps.reduce((total, step, index) => {
                  if (!step.completed) {
                    const time = parseInt(step.estimatedTime?.split(' ')[0] || '0');
                    return total + time;
                  }
                  return total;
                }, 0)}m
              </div>
              <div className="text-xs text-gray-500">Time Left</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card 
            key={step.id}
            className={`transition-all duration-200 ${
              index === currentStep ? 'ring-2 ring-pravado-purple' : ''
            } ${step.completed ? 'bg-green-50 border-green-200' : ''}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : index === currentStep 
                      ? 'bg-pravado-purple text-white' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.completed ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-professional-gray">{step.title}</h3>
                    {step.estimatedTime && (
                      <Badge variant="outline" className="text-xs">
                        {step.estimatedTime}
                      </Badge>
                    )}
                    {index === currentStep && (
                      <Badge className="bg-pravado-orange text-white text-xs">
                        Current Step
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  
                  {/* Step-specific content */}
                  {index === currentStep && !step.completed && (
                    <div className="bg-soft-gray p-4 rounded-lg mb-4">
                      {step.id === 'welcome' && (
                        <div>
                          <h4 className="font-medium mb-2">Getting Started</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            As a beta user, you'll have access to all premium features and direct communication with our product team.
                          </p>
                          <ul className="text-sm space-y-1 text-gray-600">
                            <li>• Priority support and personalized guidance</li>
                            <li>• Weekly feedback sessions with product team</li>
                            <li>• Early access to new features and updates</li>
                            <li>• Dedicated beta user Slack channel</li>
                          </ul>
                        </div>
                      )}
                      
                      {step.id === 'automate-intro' && (
                        <div>
                          <h4 className="font-medium mb-2">AUTOMATE Methodology Overview</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Learn our proven 7-step methodology for marketing success:
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>• <strong>A</strong>ssess current state</div>
                            <div>• <strong>U</strong>nify your message</div>
                            <div>• <strong>T</strong>arget your audience</div>
                            <div>• <strong>O</strong>ptimize content</div>
                            <div>• <strong>M</strong>easure performance</div>
                            <div>• <strong>A</strong>djust strategy</div>
                            <div>• <strong>T</strong>rack results</div>
                            <div>• <strong>E</strong>xpand success</div>
                          </div>
                        </div>
                      )}

                      {step.id === 'feedback-setup' && (
                        <div>
                          <h4 className="font-medium mb-2">Feedback Channels</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-pravado-purple" />
                              <span>Schedule weekly check-in calls</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="w-4 h-4 text-pravado-orange" />
                              <span>Join beta user Slack channel</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-enterprise-blue" />
                              <span>Access to direct product team feedback form</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  {!step.completed && index <= currentStep && (
                    <Button
                      onClick={() => markStepComplete(index)}
                      size="sm"
                      className="bg-pravado-purple hover:bg-pravado-purple/90"
                    >
                      {index === currentStep ? 'Complete Step' : 'Mark Complete'}
                    </Button>
                  )}
                  
                  {step.completed && (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Steps */}
      {completedSteps === steps.length && (
        <Card className="mt-8 bg-gradient-to-r from-pravado-purple/10 to-pravado-orange/10">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Onboarding Complete! 🎉</h3>
            <p className="text-gray-600 mb-4">
              You're all set up and ready to accelerate your marketing success with PRAVADO.
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="bg-pravado-purple hover:bg-pravado-purple/90">
                Go to Dashboard
              </Button>
              <Button variant="outline">
                Schedule Success Call
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
