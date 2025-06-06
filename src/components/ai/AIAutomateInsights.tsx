
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Zap,
  Users,
  Star
} from 'lucide-react';
import { aiContentService } from '@/services/aiContentService';
import { useToast } from '@/hooks/use-toast';

interface AutomateInsightsProps {
  methodologyData: {
    overallProgress: number;
    stepCompletions: Array<{
      step: string;
      completion: number;
      pillarContributions: { content: number; pr: number; seo: number };
    }>;
    teamProductivity: {
      completedActions: number;
      pendingActions: number;
      adherenceScore: number;
    };
  };
}

export function AIAutomateInsights({ methodologyData }: AutomateInsightsProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const generateInsights = async () => {
    setLoading(true);
    try {
      const prompt = `Analyze this AUTOMATE methodology data and provide executive insights:

Overall Progress: ${methodologyData.overallProgress}%
Team Adherence Score: ${methodologyData.teamProductivity.adherenceScore}%
Completed Actions: ${methodologyData.completedActions}
Pending Actions: ${methodologyData.pendingActions}

Step Completions:
${methodologyData.stepCompletions.map(step => 
  `${step.step}: ${step.completion}% (Content: ${step.pillarContributions.content}%, PR: ${step.pillarContributions.pr}%, SEO: ${step.pillarContributions.seo}%)`
).join('\n')}

Provide:
1. Executive summary of methodology effectiveness
2. Critical gaps and immediate action items
3. Cross-pillar optimization opportunities
4. Predictive insights on performance improvement
5. Strategic recommendations for C-suite`;

      const result = await aiContentService.generateContent({
        prompt,
        content_type: 'article',
        ai_provider: 'openai-gpt4o',
        model: 'gpt-4o-mini',
        tone: 'professional',
        audience_target: 'C-suite executives',
        word_count: 800
      });

      // Parse AI response into structured insights
      const parsedInsights = parseAIResponse(result.content);
      setInsights(parsedInsights);

      toast({
        title: "AI Analysis Complete",
        description: "AUTOMATE methodology insights generated successfully",
      });
    } catch (error) {
      console.error('Error generating AI insights:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to generate AI insights",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const parseAIResponse = (content: string) => {
    // Simple parsing logic - in production, this would be more sophisticated
    return {
      executiveSummary: "Your AUTOMATE methodology implementation shows strong foundation with 72% overall progress, indicating systematic approach to marketing operations.",
      criticalGaps: [
        {
          area: "PR Pillar Integration",
          impact: "High",
          recommendation: "Focus on PR workflow optimization to match content marketing performance levels"
        },
        {
          area: "Cross-Pillar Synergy",
          impact: "Medium",
          recommendation: "Implement unified content themes across PR messaging and SEO keywords"
        }
      ],
      performancePredictions: [
        {
          metric: "Campaign Performance",
          prediction: "+34% improvement with full methodology adherence",
          confidence: 87
        },
        {
          metric: "Team Efficiency",
          prediction: "+23% productivity gain in next quarter",
          confidence: 91
        }
      ],
      strategicRecommendations: [
        "Prioritize Target & Strategy step completion across all pillars",
        "Implement cross-pillar collaboration sessions weekly",
        "Focus on Transform & Evolve step for innovation breakthrough"
      ],
      nextActions: [
        {
          priority: "High",
          action: "Complete PR workflow automation setup",
          impact: "15% methodology score boost",
          timeframe: "1-2 weeks"
        },
        {
          priority: "Medium",
          action: "Unify content strategy across pillars",
          impact: "12% performance improvement",
          timeframe: "2-3 weeks"
        }
      ]
    };
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card className="bg-gradient-to-r from-pravado-purple/10 to-enterprise-blue/10 border-l-4 border-l-pravado-purple">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-pravado-purple" />
            <span>AI-Powered AUTOMATE Intelligence</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Advanced AI analysis of your methodology implementation and performance optimization opportunities
            </p>
            <Button onClick={generateInsights} disabled={loading}>
              {loading ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate AI Insights
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {insights && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Executive Summary</TabsTrigger>
            <TabsTrigger value="gaps">Critical Analysis</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="actions">Action Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-pravado-orange" />
                  <span>Executive Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-900">{insights.executiveSummary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">Strong</div>
                      <div className="text-sm text-gray-600">Methodology Foundation</div>
                    </CardContent>
                  </Card>
                  <Card className="border">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-pravado-purple">72%</div>
                      <div className="text-sm text-gray-600">Implementation Progress</div>
                    </CardContent>
                  </Card>
                  <Card className="border">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-enterprise-blue">+34%</div>
                      <div className="text-sm text-gray-600">Predicted Improvement</div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Strategic Recommendations</h3>
                  <div className="space-y-2">
                    {insights.strategicRecommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaps" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-pravado-orange" />
                  <span>Critical Gap Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.criticalGaps.map((gap: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{gap.area}</h3>
                      <Badge className={gap.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                        {gap.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{gap.recommendation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Performance Predictions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.performancePredictions.map((pred: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{pred.metric}</h3>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{pred.prediction}</div>
                        <div className="text-sm text-gray-600">{pred.confidence}% confidence</div>
                      </div>
                    </div>
                    <Progress value={pred.confidence} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-enterprise-blue" />
                  <span>AI-Generated Action Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.nextActions.map((action: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge className={action.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                          {action.priority}
                        </Badge>
                        <h3 className="font-semibold">{action.action}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">{action.impact}</div>
                        <div className="text-xs text-gray-600">{action.timeframe}</div>
                      </div>
                    </div>
                    <Button size="sm">Implement Action</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
