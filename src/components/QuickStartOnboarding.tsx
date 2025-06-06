
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, ArrowRight, Play, Target, Users, Cog, BarChart } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  icon: any;
  status: 'pending' | 'in_progress' | 'completed';
  quickWin?: boolean;
}

export function QuickStartOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'setup',
      title: 'Platform Setup & Team Invitation',
      description: 'Connect your essential tools and invite your team members',
      timeEstimate: '15 minutes',
      icon: Users,
      status: 'completed',
      quickWin: true
    },
    {
      id: 'assess',
      title: 'Quick Marketing Assessment',
      description: 'Complete our simplified audit to identify immediate opportunities',
      timeEstimate: '20 minutes',
      icon: Target,
      status: 'in_progress'
    },
    {
      id: 'goals',
      title: 'Set 30-Day Growth Goals',
      description: 'Define clear, measurable objectives for your first month',
      timeEstimate: '10 minutes',
      icon: BarChart,
      status: 'pending',
      quickWin: true
    },
    {
      id: 'automate',
      title: 'AUTOMATE Quick Start',
      description: 'Begin with high-impact methodology steps for fast results',
      timeEstimate: '30 minutes',
      icon: Cog,
      status: 'pending'
    }
  ]);

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const milestones = [
    {
      period: '30 Days',
      title: 'Quick Wins Achieved',
      goals: [
        'Marketing assessment completed',
        'Team productivity increased by 20%',
        'First AUTOMATE methodology cycle complete',
        'Baseline metrics established'
      ],
      status: 'upcoming'
    },
    {
      period: '60 Days',
      title: 'Systems Optimized',
      goals: [
        'Full tool integration completed',
        'Automated workflows implemented',
        'Performance dashboards live',
        'Team adoption at 90%+'
      ],
      status: 'upcoming'
    },
    {
      period: '90 Days',
      title: 'Growth Accelerated',
      goals: [
        'Measurable ROI demonstrated',
        'Scaling processes in place',
        'Advanced features activated',
        'Success metrics trending up'
      ],
      status: 'upcoming'
    }
  ];

  const industryTemplates = [
    {
      name: 'Technology & SaaS',
      description: 'Growth-focused templates for tech companies',
      templates: ['Product Launch', 'Lead Generation', 'Customer Success', 'Partner Marketing']
    },
    {
      name: 'Professional Services',
      description: 'Trust-building and expertise positioning',
      templates: ['Thought Leadership', 'Case Studies', 'Client Acquisition', 'Referral Programs']
    },
    {
      name: 'Manufacturing',
      description: 'B2B focused marketing strategies',
      templates: ['Trade Shows', 'Technical Content', 'Supply Chain', 'Product Showcases']
    },
    {
      name: 'Healthcare',
      description: 'Compliance-aware marketing approaches',
      templates: ['Patient Education', 'Provider Relations', 'Compliance Marketing', 'Community Outreach']
    }
  ];

  const handleStepComplete = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status: 'completed' } : step
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-pravado-orange" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-pravado-purple/10 text-pravado-purple px-4 py-2 rounded-full mb-4">
          <Target className="w-4 h-4" />
          <span className="text-sm font-semibold">30-Day Quick Start Program</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to PRAVADO</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get up and running fast with our proven onboarding process designed specifically for mid-market companies
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-pravado-purple to-pravado-crimson text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Setup Progress</h3>
              <p className="text-blue-100">You're {progressPercentage.toFixed(0)}% complete</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{completedSteps}/{steps.length}</div>
              <div className="text-sm text-blue-100">Steps Complete</div>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-white/20" />
        </CardContent>
      </Card>

      {/* Onboarding Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Getting Started Steps</h3>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.id} className={`bg-white transition-all hover:shadow-lg ${
                step.status === 'in_progress' ? 'border-pravado-purple' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      step.status === 'completed' ? 'bg-green-100' :
                      step.status === 'in_progress' ? 'bg-pravado-purple/10' :
                      'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        step.status === 'completed' ? 'text-green-600' :
                        step.status === 'in_progress' ? 'text-pravado-purple' :
                        'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-foreground">{step.title}</h4>
                        {step.quickWin && (
                          <Badge className="bg-pravado-orange/10 text-pravado-orange text-xs">
                            Quick Win
                          </Badge>
                        )}
                        {getStatusIcon(step.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">⏱ {step.timeEstimate}</span>
                        <Button 
                          size="sm" 
                          variant={step.status === 'completed' ? 'outline' : 'default'}
                          className={step.status === 'completed' ? '' : 'bg-pravado-purple hover:bg-pravado-purple/90'}
                          onClick={() => handleStepComplete(step.id)}
                        >
                          {step.status === 'completed' ? 'Review' : 'Start'}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Success Milestones */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Success Milestones</h3>
          {milestones.map((milestone, index) => (
            <Card key={index} className="bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{milestone.period}</CardTitle>
                  <Badge variant="outline" className="text-pravado-purple border-pravado-purple">
                    {milestone.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-pravado-purple">{milestone.title}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {milestone.goals.map((goal, goalIndex) => (
                    <li key={goalIndex} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-pravado-purple/30 rounded-full"></div>
                      <span className="text-gray-600">{goal}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Industry Templates */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-xl">Industry-Specific Quick Start Templates</CardTitle>
          <p className="text-gray-600">Choose templates designed for your industry to accelerate setup</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industryTemplates.map((industry, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-pravado-purple transition-colors">
                <h4 className="font-semibold text-foreground mb-2">{industry.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{industry.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {industry.templates.map((template, templateIndex) => (
                    <Badge key={templateIndex} variant="outline" className="text-xs">
                      {template}
                    </Badge>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="text-pravado-purple border-pravado-purple hover:bg-pravado-purple hover:text-white">
                  Use Templates
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps CTA */}
      <Card className="bg-gradient-to-r from-enterprise-blue to-pravado-purple text-white">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to Accelerate Your Growth?</h3>
          <p className="text-blue-100 mb-4">
            Complete your setup and start seeing results in the next 30 days
          </p>
          <Button className="bg-white text-pravado-purple hover:bg-gray-100">
            Continue Setup Process
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
