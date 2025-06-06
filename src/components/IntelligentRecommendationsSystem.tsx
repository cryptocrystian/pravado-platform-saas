
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Brain,
  FileText,
  Megaphone,
  Search,
  Clock,
  Star
} from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'optimization' | 'action' | 'strategy' | 'urgent';
  title: string;
  description: string;
  pillar: 'content' | 'pr' | 'seo' | 'cross-pillar';
  automateStep: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  priority: number;
  estimatedTimeToComplete: string;
  potentialImprovements: {
    methodologyScore: number;
    performanceBoost: number;
  };
}

interface AutomateGap {
  step: string;
  currentScore: number;
  targetScore: number;
  gap: number;
  criticalActions: string[];
}

interface IntelligentRecommendationsSystemProps {
  recommendations: Recommendation[];
  automateGaps: AutomateGap[];
  performanceAlerts: Array<{
    level: 'warning' | 'critical';
    message: string;
    suggestedAction: string;
  }>;
}

export function IntelligentRecommendationsSystem({ 
  recommendations, 
  automateGaps,
  performanceAlerts 
}: IntelligentRecommendationsSystemProps) {
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
      case 'content': return 'text-pravado-purple';
      case 'pr': return 'text-pravado-orange';
      case 'seo': return 'text-enterprise-blue';
      default: return 'text-pravado-navy';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return TrendingUp;
      case 'action': return Target;
      case 'strategy': return Brain;
      case 'urgent': return AlertTriangle;
      default: return Lightbulb;
    }
  };

  const sortedRecommendations = recommendations.sort((a, b) => b.priority - a.priority);
  const highPriorityRecommendations = sortedRecommendations.filter(r => r.priority >= 8);

  return (
    <div className="space-y-6">
      {/* Performance Alerts */}
      {performanceAlerts.length > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Performance Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {performanceAlerts.map((alert, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={alert.level === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                        {alert.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-800 mb-2">{alert.message}</p>
                    <p className="text-sm text-blue-600 font-medium">{alert.suggestedAction}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Take Action
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* High Priority Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-pravado-orange" />
            <span>High Priority Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {highPriorityRecommendations.map((rec) => {
            const PillarIcon = getPillarIcon(rec.pillar);
            const TypeIcon = getTypeIcon(rec.type);
            
            return (
              <div key={rec.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pravado-purple/10 rounded-full flex items-center justify-center">
                      <TypeIcon className="w-5 h-5 text-pravado-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-professional-gray">{rec.title}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center space-x-1">
                          <PillarIcon className={`w-4 h-4 ${getPillarColor(rec.pillar)}`} />
                          <span className="text-sm text-gray-600 capitalize">{rec.pillar}</span>
                        </div>
                        <Badge className={getImpactColor(rec.impact)}>
                          {rec.impact} impact
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{rec.estimatedTimeToComplete}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-pravado-purple">#{rec.priority}</div>
                    <div className="text-xs text-gray-500">Priority</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>

                <div className="bg-soft-gray rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">AUTOMATE Step:</span>
                    <span className="text-pravado-purple">{rec.automateStep}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">+{rec.potentialImprovements.methodologyScore}%</div>
                    <div className="text-xs text-gray-600">Methodology Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">+{rec.potentialImprovements.performanceBoost}%</div>
                    <div className="text-xs text-gray-600">Performance Boost</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    Implement Now
                  </Button>
                  <Button size="sm" variant="outline">
                    Schedule
                  </Button>
                  <Button size="sm" variant="ghost">
                    Learn More
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* AUTOMATE Gaps Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-pravado-purple" />
            <span>AUTOMATE Methodology Gaps</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {automateGaps.map((gap, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-professional-gray">{gap.step}</h3>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {gap.currentScore}% → {gap.targetScore}%
                  </div>
                  <div className="text-lg font-bold text-red-600">-{gap.gap}%</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Current Progress</span>
                  <span>{gap.currentScore}%</span>
                </div>
                <Progress value={gap.currentScore} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Target: {gap.targetScore}%</span>
                  <span>Gap: {gap.gap}%</span>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-3">
                <h4 className="font-medium text-sm text-red-800 mb-2">Critical Actions:</h4>
                <ul className="space-y-1">
                  {gap.criticalActions.map((action, actionIndex) => (
                    <li key={actionIndex} className="text-sm text-red-700 flex items-center">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* All Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-pravado-orange" />
            <span>All Smart Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedRecommendations.map((rec) => {
              const PillarIcon = getPillarIcon(rec.pillar);
              
              return (
                <div key={rec.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-soft-gray transition-colors">
                  <div className="flex items-center space-x-3">
                    <PillarIcon className={`w-4 h-4 ${getPillarColor(rec.pillar)}`} />
                    <div>
                      <div className="font-medium text-sm">{rec.title}</div>
                      <div className="text-xs text-gray-600">{rec.automateStep}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={getImpactColor(rec.impact)}>
                      {rec.impact}
                    </Badge>
                    <div className="text-sm font-medium text-pravado-purple">
                      +{rec.potentialImprovements.methodologyScore}%
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
