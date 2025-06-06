import React, { useEffect, useState } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, TrendingUp, Users, Target, Settings, BarChart, Zap, RefreshCw, Star, Play, ArrowRight, Loader2 } from 'lucide-react';
import { useAutomateMethodologyProgress, useCreateAutomateMethodology } from '@/hooks/useAutomateData';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const automateSteps = [
  {
    id: 'assess-audit',
    code: 'A',
    title: 'Assess & Audit',
    description: 'Comprehensive analysis of current marketing infrastructure',
    icon: CheckCircle,
    route: '/automate/assess-audit',
    color: 'bg-pravado-purple'
  },
  {
    id: 'understand-audience',
    code: 'U', 
    title: 'Understand Audience',
    description: 'Deep dive into target demographics and behavior patterns',
    icon: Users,
    route: '/automate/understand-audience',
    color: 'bg-pravado-orange'
  },
  {
    id: 'target-strategy',
    code: 'T',
    title: 'Target & Strategy',
    description: 'Strategic positioning and campaign targeting framework',
    icon: Target,
    route: '/automate/target-strategy',
    color: 'bg-enterprise-blue'
  },
  {
    id: 'optimize-systems',
    code: 'O',
    title: 'Optimize Systems',
    description: 'Technology stack optimization and workflow automation',
    icon: Settings,
    route: '/automate/optimize-systems',
    color: 'bg-professional-gray'
  },
  {
    id: 'measure-monitor',
    code: 'M',
    title: 'Measure & Monitor',
    description: 'Analytics implementation and performance tracking setup',
    icon: BarChart,
    route: '/automate/measure-monitor',
    color: 'bg-pravado-orange'
  },
  {
    id: 'accelerate-growth',
    code: 'A',
    title: 'Accelerate Growth',
    description: 'Growth hacking strategies and conversion optimization',
    icon: Zap,
    route: '/automate/accelerate-growth',
    color: 'bg-pravado-crimson'
  },
  {
    id: 'transform-evolve',
    code: 'T',
    title: 'Transform & Evolve',
    description: 'Continuous improvement and strategic evolution',
    icon: RefreshCw,
    route: '/automate/transform-evolve',
    color: 'bg-professional-gray'
  },
  {
    id: 'execute-excellence',
    code: 'E',
    title: 'Execute Excellence',
    description: 'Operational excellence and sustainable growth execution',
    icon: Star,
    route: '/automate/execute-excellence',
    color: 'bg-pravado-purple'
  }
];

const priorityActions = [
  { title: 'Complete audience segmentation analysis', urgency: 'high', dueDate: '2 days', step: 'Understand Audience' },
  { title: 'Finalize content strategy framework', urgency: 'medium', dueDate: '1 week', step: 'Target & Strategy' },
  { title: 'Set up automated reporting dashboard', urgency: 'high', dueDate: '3 days', step: 'Measure & Monitor' },
  { title: 'Review competitor positioning', urgency: 'low', dueDate: '2 weeks', step: 'Assess & Audit' }
];

const recentAchievements = [
  { title: 'Marketing audit completed', date: '2 days ago', impact: '+15% efficiency', step: 'Assess & Audit' },
  { title: 'Customer personas finalized', date: '1 week ago', impact: '3 new segments', step: 'Understand Audience' },
  { title: 'Analytics tracking improved', date: '1 week ago', impact: '+40% data accuracy', step: 'Measure & Monitor' }
];

export default function AutomateHub() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: progressData, isLoading, error: progressError } = useAutomateMethodologyProgress();
  const createMethodology = useCreateAutomateMethodology();
  const [initializationAttempted, setInitializationAttempted] = useState(false);

  // Initialize methodology if no progress data exists
  useEffect(() => {
    if (!isLoading && !progressData?.length && !createMethodology.isPending && !initializationAttempted) {
      console.log('No progress data found, initializing AUTOMATE methodology...');
      setInitializationAttempted(true);
      createMethodology.mutate({});
    }
  }, [isLoading, progressData, createMethodology, initializationAttempted]);

  // Handle retry initialization
  const handleRetryInitialization = () => {
    console.log('Retrying AUTOMATE methodology initialization...');
    setInitializationAttempted(false);
    createMethodology.mutate({});
  };

  // Map progress data to steps
  const stepsWithProgress = automateSteps.map(step => {
    const progressRecord = progressData?.find(p => p.step_code === step.code && p.step_index === automateSteps.indexOf(step));
    return {
      ...step,
      progress: progressRecord?.completion_percentage || 0,
      status: progressRecord?.status || 'pending',
      stepId: progressRecord?.id
    };
  });

  const overallProgress = Math.round(stepsWithProgress.reduce((acc, step) => acc + step.progress, 0) / stepsWithProgress.length);
  const completedSteps = stepsWithProgress.filter(step => step.status === 'completed').length;
  const activeSteps = stepsWithProgress.filter(step => step.status === 'in_progress').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-pravado-orange" />;
      default:
        return <AlertCircle className="w-5 h-5 text-professional-gray" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  if (isLoading || createMethodology.isPending) {
    return (
      <BaseLayout title="AUTOMATE Hub" breadcrumb="Marketing Operating System">
        <div className="p-6 space-y-6">
          <div className="text-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-pravado-purple mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-professional-gray mb-2">
              {createMethodology.isPending ? 'Initializing AUTOMATE Methodology...' : 'Loading AUTOMATE methodology...'}
            </h3>
            <p className="text-gray-600">
              {createMethodology.isPending 
                ? 'Setting up your systematic marketing framework'
                : 'Please wait while we load your progress'
              }
            </p>
          </div>
        </div>
      </BaseLayout>
    );
  }

  if (progressError || createMethodology.error) {
    return (
      <BaseLayout title="AUTOMATE Hub" breadcrumb="Marketing Operating System">
        <div className="p-6 space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                AUTOMATE Setup Issue
              </h3>
              <p className="text-red-700 mb-4">
                {createMethodology.error?.message || progressError?.message || 'Failed to load AUTOMATE methodology'}
              </p>
              <div className="space-x-3">
                <Button 
                  onClick={handleRetryInitialization}
                  className="bg-pravado-purple hover:bg-pravado-purple/90 text-white"
                  disabled={createMethodology.isPending}
                >
                  {createMethodology.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    'Retry Setup'
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Support Contact",
                      description: "Please contact support if this issue persists. Error details have been logged.",
                    });
                  }}
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout title="AUTOMATE Hub" breadcrumb="Marketing Operating System">
      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pravado-purple to-pravado-crimson rounded-lg p-8 text-white">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-4">AUTOMATE Methodology</h1>
            <p className="text-lg mb-6 text-blue-100">
              Your systematic 8-step framework for marketing excellence. Transform your marketing operations 
              with our proven methodology that drives measurable results.
            </p>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{overallProgress}%</div>
                <div className="text-sm text-blue-100">Overall Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{completedSteps}</div>
                <div className="text-sm text-blue-100">Steps Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{activeSteps}</div>
                <div className="text-sm text-blue-100">In Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-l-4 border-l-pravado-purple">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-professional-gray">Overall Progress</p>
                  <p className="text-3xl font-bold text-pravado-purple">{overallProgress}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-pravado-purple" />
              </div>
              <Progress value={overallProgress} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-professional-gray">Completed Steps</p>
                  <p className="text-3xl font-bold text-green-600">{completedSteps}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-professional-gray mt-2">of {stepsWithProgress.length} total steps</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-pravado-orange">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-professional-gray">Active Steps</p>
                  <p className="text-3xl font-bold text-pravado-orange">{activeSteps}</p>
                </div>
                <Clock className="w-8 h-8 text-pravado-orange" />
              </div>
              <p className="text-sm text-professional-gray mt-2">currently in progress</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-pravado-crimson">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-professional-gray">Efficiency Gain</p>
                  <p className="text-3xl font-bold text-pravado-crimson">+32%</p>
                </div>
                <Zap className="w-8 h-8 text-pravado-crimson" />
              </div>
              <p className="text-sm text-professional-gray mt-2">vs. previous quarter</p>
            </CardContent>
          </Card>
        </div>

        {/* AUTOMATE Steps Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-professional-gray">AUTOMATE Methodology Steps</h2>
            <Button variant="outline" className="text-pravado-purple border-pravado-purple hover:bg-pravado-purple hover:text-white">
              <Play className="w-4 h-4 mr-2" />
              Start Next Step
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepsWithProgress.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.id} className="bg-white hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-pravado-purple/30" 
                      onClick={() => navigate(step.route)}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg ${step.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(step.status)}
                        <span className="text-2xl font-bold text-pravado-purple">{step.code}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-professional-gray">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-professional-gray">{step.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-professional-gray">Progress</span>
                        <span className="font-medium text-pravado-purple">{step.progress}%</span>
                      </div>
                      <Progress value={step.progress} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center">
                      <Badge variant={step.status === 'completed' ? 'default' : 'secondary'} 
                             className={step.status === 'completed' ? 'bg-green-100 text-green-800' : ''}>
                        {step.status.replace('_', ' ')}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-professional-gray" />
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4 border-pravado-purple text-pravado-purple hover:bg-pravado-purple hover:text-white"
                      disabled={step.status === 'pending' && index > 0 && stepsWithProgress[index - 1].status !== 'completed'}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(step.route);
                      }}
                    >
                      {step.status === 'completed' ? 'Review' : step.status === 'in_progress' ? 'Continue' : 'Start'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Priority Actions & Recent Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl text-professional-gray flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-pravado-orange" />
                Priority Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {priorityActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-soft-gray rounded-lg border hover:border-pravado-purple/30 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-professional-gray">{action.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-professional-gray">Due in {action.dueDate}</span>
                      <span className="text-xs text-pravado-purple">• {action.step}</span>
                    </div>
                  </div>
                  <Badge className={getUrgencyColor(action.urgency)}>
                    {action.urgency}
                  </Badge>
                </div>
              ))}
              <Button className="w-full mt-4 bg-pravado-purple hover:bg-pravado-purple/90 text-white" variant="default">
                View All Actions
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl text-professional-gray flex items-center">
                <Star className="w-5 h-5 mr-2 text-pravado-orange" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-soft-gray rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium text-professional-gray">{achievement.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-professional-gray">{achievement.date}</span>
                      <span className="text-xs text-pravado-purple">• {achievement.step}</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {achievement.impact}
                  </Badge>
                </div>
              ))}
              <Button className="w-full mt-4 text-pravado-purple border-pravado-purple hover:bg-pravado-purple hover:text-white" variant="outline">
                View Achievement History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
}
