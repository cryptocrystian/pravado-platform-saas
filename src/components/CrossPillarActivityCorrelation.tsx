
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Megaphone, 
  Search, 
  TrendingUp, 
  Target,
  Users,
  BarChart3,
  Brain,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface ActivityImpact {
  activity: string;
  pillar: 'content' | 'pr' | 'seo';
  automateStep: string;
  contribution: number;
  completedToday: number;
  trend: 'up' | 'down' | 'neutral';
}

interface PillarCorrelation {
  pillar: 'content' | 'pr' | 'seo';
  totalActivities: number;
  completedActivities: number;
  automateContribution: number;
  topContributingStep: string;
  weeklyTrend: number;
}

interface CrossPillarActivityCorrelationProps {
  activities: ActivityImpact[];
  pillarCorrelations: PillarCorrelation[];
  crossPillarSynergies: Array<{
    combination: string;
    synergyScore: number;
    description: string;
    recommendation: string;
  }>;
}

export function CrossPillarActivityCorrelation({ 
  activities, 
  pillarCorrelations,
  crossPillarSynergies 
}: CrossPillarActivityCorrelationProps) {
  const getPillarIcon = (pillar: string) => {
    switch (pillar) {
      case 'content': return FileText;
      case 'pr': return Megaphone;
      case 'seo': return Search;
      default: return Brain;
    }
  };

  const getPillarColor = (pillar: string) => {
    switch (pillar) {
      case 'content': return 'pravado-purple';
      case 'pr': return 'pravado-orange';
      case 'seo': return 'enterprise-blue';
      default: return 'pravado-navy';
    }
  };

  const getStepIcon = (step: string) => {
    const stepMap: Record<string, React.ComponentType<any>> = {
      'Assess & Audit': Target,
      'Understand Audience': Users,
      'Target & Strategy': Brain,
      'Optimize Systems': BarChart3,
      'Measure & Monitor': TrendingUp,
      'Accelerate Growth': TrendingUp,
      'Transform & Evolve': Lightbulb,
      'Execute Excellence': Target
    };
    return stepMap[step] || Brain;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '→';
    }
  };

  return (
    <div className="space-y-6">
      {/* Pillar Correlations Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {pillarCorrelations.map((correlation) => {
          const PillarIcon = getPillarIcon(correlation.pillar);
          const pillarColor = getPillarColor(correlation.pillar);
          const completionRate = (correlation.completedActivities / correlation.totalActivities) * 100;
          
          return (
            <Card key={correlation.pillar} className={`border-l-4 border-l-${pillarColor}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PillarIcon className={`w-5 h-5 text-${pillarColor}`} />
                    <span className="capitalize">{correlation.pillar}</span>
                  </div>
                  <Badge className={`bg-${pillarColor}/10 text-${pillarColor}`}>
                    {correlation.weeklyTrend > 0 ? '+' : ''}{correlation.weeklyTrend}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Activity Completion</span>
                    <span>{correlation.completedActivities}/{correlation.totalActivities}</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>AUTOMATE Contribution</span>
                    <span className={`font-semibold text-${pillarColor}`}>{correlation.automateContribution}%</span>
                  </div>
                  <Progress value={correlation.automateContribution} className="h-2" />
                </div>
                
                <div className="bg-soft-gray rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Top Contributing Step</div>
                  <div className="font-medium text-sm">{correlation.topContributingStep}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Impact Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-enterprise-blue" />
            <span>Activity Impact on AUTOMATE Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const PillarIcon = getPillarIcon(activity.pillar);
              const StepIcon = getStepIcon(activity.automateStep);
              const pillarColor = getPillarColor(activity.pillar);
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-${pillarColor}/10 rounded-full flex items-center justify-center`}>
                        <PillarIcon className={`w-4 h-4 text-${pillarColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-professional-gray">{activity.activity}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <StepIcon className="w-3 h-3" />
                          <span>{activity.automateStep}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-enterprise-blue">{activity.contribution}%</div>
                        <div className="text-xs text-gray-600">Contribution</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{activity.completedToday}</div>
                        <div className="text-xs text-gray-600">Today</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg">{getTrendIcon(activity.trend)}</div>
                        <div className="text-xs text-gray-600">Trend</div>
                      </div>
                    </div>
                  </div>
                  
                  <Progress value={activity.contribution} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cross-Pillar Synergies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-pravado-purple" />
            <span>Cross-Pillar Synergies</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {crossPillarSynergies.map((synergy, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-professional-gray">{synergy.combination}</h3>
                  <p className="text-sm text-gray-600 mt-1">{synergy.description}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pravado-purple">{synergy.synergyScore}%</div>
                  <div className="text-xs text-gray-600">Synergy Score</div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Recommendation</span>
                </div>
                <p className="text-sm text-blue-700">{synergy.recommendation}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Attribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-enterprise-blue" />
            <span>Performance Attribution Through AUTOMATE</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-professional-gray">Direct Impact</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                  <span className="text-sm">Content Strategy → Target & Strategy</span>
                  <span className="font-semibold text-pravado-purple">+23%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                  <span className="text-sm">SEO Optimization → Optimize Systems</span>
                  <span className="font-semibold text-enterprise-blue">+18%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                  <span className="text-sm">PR Outreach → Accelerate Growth</span>
                  <span className="font-semibold text-pravado-orange">+15%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-professional-gray">Indirect Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                  <span className="text-sm">Cross-pillar coordination</span>
                  <span className="font-semibold text-green-600">+12%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                  <span className="text-sm">Methodology adherence</span>
                  <span className="font-semibold text-blue-600">+8%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                  <span className="text-sm">Team productivity boost</span>
                  <span className="font-semibold text-purple-600">+6%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
