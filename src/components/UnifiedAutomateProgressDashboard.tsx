
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  FileText, 
  Megaphone, 
  Search, 
  Target,
  Users,
  BarChart3,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface PillarProgress {
  content: number;
  pr: number;
  seo: number;
}

interface AutomateStep {
  code: string;
  name: string;
  overallProgress: number;
  pillarContributions: PillarProgress;
  nextActions: string[];
  priority: 'high' | 'medium' | 'low';
}

interface UnifiedAutomateProgressDashboardProps {
  overallProgress: number;
  steps: AutomateStep[];
  teamProductivity: {
    completedActions: number;
    pendingActions: number;
    adherenceScore: number;
  };
}

export function UnifiedAutomateProgressDashboard({ 
  overallProgress, 
  steps, 
  teamProductivity 
}: UnifiedAutomateProgressDashboardProps) {
  const getStepIcon = (code: string) => {
    const iconMap: Record<string, any> = {
      'A': Target,
      'U': Users,
      'T': Brain,
      'O': BarChart3,
      'M': TrendingUp,
      'E': Lightbulb
    };
    return iconMap[code] || Brain;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card className="bg-gradient-to-r from-pravado-navy to-enterprise-blue text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">AUTOMATE Methodology Progress</h2>
              <p className="text-blue-100">Unified marketing operations across Content + PR + SEO</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{overallProgress}%</div>
              <p className="text-blue-200">Overall Completion</p>
            </div>
          </div>
          
          <div className="mt-6">
            <Progress value={overallProgress} className="h-3 bg-blue-800" />
          </div>
        </CardContent>
      </Card>

      {/* Three Pillar Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-pravado-purple">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FileText className="w-5 h-5 text-pravado-purple" />
              <span>Content Marketing</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pravado-purple mb-2">
              {Math.round(steps.reduce((acc, step) => acc + step.pillarContributions.content, 0) / steps.length)}%
            </div>
            <p className="text-sm text-gray-600">AUTOMATE Integration</p>
            <div className="mt-3 space-y-1">
              <div className="text-xs text-gray-500">Content Strategy: 85%</div>
              <div className="text-xs text-gray-500">Performance Tracking: 72%</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-pravado-orange">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Megaphone className="w-5 h-5 text-pravado-orange" />
              <span>Public Relations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pravado-orange mb-2">
              {Math.round(steps.reduce((acc, step) => acc + step.pillarContributions.pr, 0) / steps.length)}%
            </div>
            <p className="text-sm text-gray-600">AUTOMATE Integration</p>
            <div className="mt-3 space-y-1">
              <div className="text-xs text-gray-500">Media Outreach: 68%</div>
              <div className="text-xs text-gray-500">Press Monitoring: 55%</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-enterprise-blue">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Search className="w-5 h-5 text-enterprise-blue" />
              <span>SEO Intelligence</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-enterprise-blue mb-2">
              {Math.round(steps.reduce((acc, step) => acc + step.pillarContributions.seo, 0) / steps.length)}%
            </div>
            <p className="text-sm text-gray-600">AUTOMATE Integration</p>
            <div className="mt-3 space-y-1">
              <div className="text-xs text-gray-500">Technical SEO: 78%</div>
              <div className="text-xs text-gray-500">Rank Tracking: 82%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AUTOMATE Steps Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-pravado-purple" />
            <span>AUTOMATE Steps Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, index) => {
            const StepIcon = getStepIcon(step.code);
            return (
              <div key={step.code} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-pravado-purple/10 rounded-full flex items-center justify-center">
                      <StepIcon className="w-4 h-4 text-pravado-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-professional-gray">{step.name}</h3>
                      <p className="text-sm text-gray-600">Step {step.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getPriorityColor(step.priority)}>
                      {step.priority} priority
                    </Badge>
                    <span className="font-semibold text-pravado-purple">{step.overallProgress}%</span>
                  </div>
                </div>

                <Progress value={step.overallProgress} className="mb-3" />

                {/* Pillar Contributions */}
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-sm font-medium text-pravado-purple">Content</div>
                    <div className="text-lg font-bold">{step.pillarContributions.content}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-pravado-orange">PR</div>
                    <div className="text-lg font-bold">{step.pillarContributions.pr}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-enterprise-blue">SEO</div>
                    <div className="text-lg font-bold">{step.pillarContributions.seo}%</div>
                  </div>
                </div>

                {/* Next Actions */}
                {step.nextActions.length > 0 && (
                  <div className="bg-soft-gray rounded-lg p-3">
                    <h4 className="font-medium text-sm text-professional-gray mb-2">Next Actions:</h4>
                    <ul className="space-y-1">
                      {step.nextActions.map((action, actionIndex) => (
                        <li key={actionIndex} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-pravado-purple rounded-full mr-2"></div>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Team Productivity Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-enterprise-blue" />
              <span>Team Productivity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Actions Completed</span>
              <span className="text-lg font-bold text-green-600">{teamProductivity.completedActions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pending Actions</span>
              <span className="text-lg font-bold text-yellow-600">{teamProductivity.pendingActions}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Adherence Score</span>
                <span className="text-lg font-bold text-pravado-purple">{teamProductivity.adherenceScore}%</span>
              </div>
              <Progress value={teamProductivity.adherenceScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-pravado-orange" />
              <span>Smart Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Target className="w-4 h-4 text-enterprise-blue" />
                <span className="text-sm font-medium text-enterprise-blue">Priority Focus</span>
              </div>
              <p className="text-sm text-blue-800">Complete Target & Strategy step for 15% methodology boost</p>
            </div>
            
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Search className="w-4 h-4 text-pravado-purple" />
                <span className="text-sm font-medium text-pravado-purple">SEO Opportunity</span>
              </div>
              <p className="text-sm text-purple-800">Keyword research activities will advance Assess & Audit step</p>
            </div>
            
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Megaphone className="w-4 h-4 text-pravado-orange" />
                <span className="text-sm font-medium text-pravado-orange">PR Integration</span>
              </div>
              <p className="text-sm text-orange-800">Schedule HARO responses to boost Accelerate Growth progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link to="/content-marketing">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Content Strategy
              </Button>
            </Link>
            <Link to="/public-relations">
              <Button variant="outline" className="w-full justify-start">
                <Megaphone className="w-4 h-4 mr-2" />
                PR Activities
              </Button>
            </Link>
            <Link to="/seo-intelligence">
              <Button variant="outline" className="w-full justify-start">
                <Search className="w-4 h-4 mr-2" />
                SEO Optimization
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
