
import React from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, TrendingUp, Users, Target, Settings, BarChart, Zap, RefreshCw, Star } from 'lucide-react';

const automateSteps = [
  {
    id: 'assess',
    title: 'Assess & Audit',
    description: 'Comprehensive analysis of current marketing infrastructure',
    icon: CheckCircle,
    progress: 85,
    status: 'completed',
    color: 'bg-green-500',
    tasks: 12,
    completedTasks: 10
  },
  {
    id: 'understand',
    title: 'Understand Audience',
    description: 'Deep dive into target demographics and behavior patterns',
    icon: Users,
    progress: 72,
    status: 'in-progress',
    color: 'bg-pravado-orange',
    tasks: 8,
    completedTasks: 6
  },
  {
    id: 'target',
    title: 'Target & Strategy',
    description: 'Strategic positioning and campaign targeting framework',
    icon: Target,
    progress: 45,
    status: 'in-progress',
    color: 'bg-pravado-orange',
    tasks: 15,
    completedTasks: 7
  },
  {
    id: 'optimize',
    title: 'Optimize Systems',
    description: 'Technology stack optimization and workflow automation',
    icon: Settings,
    progress: 30,
    status: 'pending',
    color: 'bg-professional-gray',
    tasks: 10,
    completedTasks: 3
  },
  {
    id: 'measure',
    title: 'Measure & Monitor',
    description: 'Analytics implementation and performance tracking setup',
    icon: BarChart,
    progress: 60,
    status: 'in-progress',
    color: 'bg-pravado-orange',
    tasks: 9,
    completedTasks: 5
  },
  {
    id: 'accelerate',
    title: 'Accelerate Growth',
    description: 'Growth hacking strategies and conversion optimization',
    icon: Zap,
    progress: 25,
    status: 'pending',
    color: 'bg-professional-gray',
    tasks: 12,
    completedTasks: 3
  },
  {
    id: 'transform',
    title: 'Transform & Evolve',
    description: 'Continuous improvement and strategic evolution',
    icon: RefreshCw,
    progress: 15,
    status: 'pending',
    color: 'bg-professional-gray',
    tasks: 8,
    completedTasks: 1
  },
  {
    id: 'execute',
    title: 'Execute Excellence',
    description: 'Operational excellence and sustainable growth execution',
    icon: Star,
    progress: 10,
    status: 'pending',
    color: 'bg-professional-gray',
    tasks: 14,
    completedTasks: 1
  }
];

const priorityActions = [
  { title: 'Complete audience segmentation analysis', urgency: 'high', dueDate: '2 days' },
  { title: 'Finalize content strategy framework', urgency: 'medium', dueDate: '1 week' },
  { title: 'Set up automated reporting dashboard', urgency: 'high', dueDate: '3 days' },
  { title: 'Review competitor positioning', urgency: 'low', dueDate: '2 weeks' }
];

const recentAchievements = [
  { title: 'Marketing audit completed', date: '2 days ago', impact: '+15% efficiency' },
  { title: 'Customer personas finalized', date: '1 week ago', impact: '3 new segments' },
  { title: 'Analytics tracking improved', date: '1 week ago', impact: '+40% data accuracy' }
];

export default function AutomateHub() {
  const overallProgress = Math.round(automateSteps.reduce((acc, step) => acc + step.progress, 0) / automateSteps.length);
  const completedSteps = automateSteps.filter(step => step.status === 'completed').length;
  const activeSteps = automateSteps.filter(step => step.status === 'in-progress').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-pravado-orange" />;
      default:
        return <AlertCircle className="w-5 h-5 text-professional-gray" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <BaseLayout title="AUTOMATE Hub" breadcrumb="Marketing Operating System">
      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white">
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

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-professional-gray">Completed Steps</p>
                  <p className="text-3xl font-bold text-green-600">{completedSteps}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-professional-gray mt-2">of {automateSteps.length} total steps</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
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

          <Card className="bg-white">
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
          <h2 className="text-2xl font-bold text-professional-gray">AUTOMATE Methodology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {automateSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.id} className="bg-white hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${step.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {getStatusIcon(step.status)}
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

                    <div className="flex justify-between text-sm text-professional-gray">
                      <span>Tasks: {step.completedTasks}/{step.tasks}</span>
                      <Badge variant={step.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {step.status.replace('-', ' ')}
                      </Badge>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      disabled={step.status === 'pending'}
                    >
                      {step.status === 'completed' ? 'Review' : step.status === 'in-progress' ? 'Continue' : 'Start'}
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
            <CardHeader>
              <CardTitle className="text-xl text-professional-gray">Priority Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {priorityActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-soft-gray rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-professional-gray">{action.title}</p>
                    <p className="text-sm text-professional-gray">Due in {action.dueDate}</p>
                  </div>
                  <Badge className={getUrgencyColor(action.urgency)}>
                    {action.urgency}
                  </Badge>
                </div>
              ))}
              <Button className="w-full mt-4" variant="outline">
                View All Actions
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-professional-gray">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-soft-gray rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-professional-gray">{achievement.title}</p>
                    <p className="text-sm text-professional-gray">{achievement.date}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {achievement.impact}
                  </Badge>
                </div>
              ))}
              <Button className="w-full mt-4" variant="outline">
                View Achievement History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
}
