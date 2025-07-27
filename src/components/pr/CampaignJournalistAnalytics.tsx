import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { JournalistCard } from './JournalistCard';
import { 
  Brain,
  TrendingUp,
  Target,
  Users,
  Award,
  Sparkles,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  Globe,
  Star,
  Zap
} from 'lucide-react';
import { useJournalistContacts } from '@/hooks/useJournalists';

interface CampaignJournalistRelationship {
  id: string;
  campaign_id: string;
  journalist_id: string;
  status: 'pending' | 'contacted' | 'responded' | 'successful' | 'declined';
  predicted_success_rate: number;
  relationship_score_at_selection: number;
  authority_score_at_selection: number;
  actual_response_time_hours?: number;
  outreach_date?: string;
  response_date?: string;
  outcome?: 'positive' | 'negative' | 'neutral';
  notes?: string;
}

interface CampaignJournalistAnalyticsProps {
  campaignId: string;
  relationships: CampaignJournalistRelationship[];
  campaignBudget?: number;
  campaignGoals?: any;
}

export function CampaignJournalistAnalytics({ 
  campaignId, 
  relationships, 
  campaignBudget,
  campaignGoals 
}: CampaignJournalistAnalyticsProps) {
  const journalistIds = relationships.map(r => r.journalist_id);
  const { data: journalists } = useJournalistContacts();
  
  const campaignJournalists = useMemo(() => {
    if (!journalists) return [];
    return journalists.filter(j => journalistIds.includes(j.id));
  }, [journalists, journalistIds]);

  const analytics = useMemo(() => {
    if (relationships.length === 0) return null;

    const totalTargeted = relationships.length;
    const contacted = relationships.filter(r => ['contacted', 'responded', 'successful', 'declined'].includes(r.status)).length;
    const responded = relationships.filter(r => ['responded', 'successful', 'declined'].includes(r.status)).length;
    const successful = relationships.filter(r => r.status === 'successful').length;
    const declined = relationships.filter(r => r.status === 'declined').length;
    const pending = relationships.filter(r => r.status === 'pending').length;

    const responseRate = contacted > 0 ? (responded / contacted) * 100 : 0;
    const successRate = contacted > 0 ? (successful / contacted) * 100 : 0;
    const conversionRate = totalTargeted > 0 ? (successful / totalTargeted) * 100 : 0;

    // Calculate average scores
    const avgPredictedSuccess = relationships.reduce((sum, r) => sum + r.predicted_success_rate, 0) / totalTargeted;
    const avgRelationshipScore = relationships.reduce((sum, r) => sum + r.relationship_score_at_selection, 0) / totalTargeted;
    const avgAuthorityScore = relationships.reduce((sum, r) => sum + r.authority_score_at_selection, 0) / totalTargeted;

    // Calculate response time analytics
    const responseTimes = relationships.filter(r => r.actual_response_time_hours).map(r => r.actual_response_time_hours!);
    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    // Tier analysis
    const tierBreakdown = campaignJournalists.reduce((acc, j) => {
      const tier = j.dynamic_tier || j.static_tier || 'unclassified';
      const relationship = relationships.find(r => r.journalist_id === j.id);
      if (!acc[tier]) {
        acc[tier] = { total: 0, successful: 0, contacted: 0 };
      }
      acc[tier].total++;
      if (relationship?.status === 'successful') acc[tier].successful++;
      if (['contacted', 'responded', 'successful', 'declined'].includes(relationship?.status || '')) {
        acc[tier].contacted++;
      }
      return acc;
    }, {} as Record<string, { total: number; successful: number; contacted: number }>);

    // Media category analysis
    const categoryBreakdown = campaignJournalists.reduce((acc, j) => {
      const category = j.media_category || 'traditional_media';
      const relationship = relationships.find(r => r.journalist_id === j.id);
      if (!acc[category]) {
        acc[category] = { total: 0, successful: 0, contacted: 0 };
      }
      acc[category].total++;
      if (relationship?.status === 'successful') acc[category].successful++;
      if (['contacted', 'responded', 'successful', 'declined'].includes(relationship?.status || '')) {
        acc[category].contacted++;
      }
      return acc;
    }, {} as Record<string, { total: number; successful: number; contacted: number }>);

    // Performance vs prediction analysis
    const predictionAccuracy = relationships.filter(r => 
      ['successful', 'declined'].includes(r.status)
    ).map(r => {
      const actualSuccess = r.status === 'successful' ? 1 : 0;
      const predictedSuccess = r.predicted_success_rate;
      return Math.abs(actualSuccess - predictedSuccess);
    });

    const avgPredictionAccuracy = predictionAccuracy.length > 0
      ? (1 - (predictionAccuracy.reduce((sum, acc) => sum + acc, 0) / predictionAccuracy.length)) * 100
      : 0;

    return {
      totalTargeted,
      contacted,
      responded,
      successful,
      declined,
      pending,
      responseRate,
      successRate,
      conversionRate,
      avgPredictedSuccess: avgPredictedSuccess * 100,
      avgRelationshipScore,
      avgAuthorityScore,
      avgResponseTime,
      tierBreakdown,
      categoryBreakdown,
      avgPredictionAccuracy,
    };
  }, [relationships, campaignJournalists]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful': return 'bg-green-100 text-green-800';
      case 'responded': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful': return <CheckCircle2 className="h-4 w-4" />;
      case 'responded': return <Mail className="h-4 w-4" />;
      case 'contacted': return <Clock className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatResponseTime = (hours: number) => {
    if (hours < 24) return `${Math.round(hours)}h`;
    const days = Math.round(hours / 24);
    return `${days}d`;
  };

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No journalist data available</h3>
          <p className="text-gray-600">Add journalists to your campaign to see analytics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900">AI Journalist Intelligence</h2>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            <Brain className="h-3 w-3 mr-1" />
            AI Enhanced
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Activity className="h-4 w-4" />
          Real-time campaign performance
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">AI Prediction Accuracy</p>
                <p className="text-2xl font-bold text-purple-900">{Math.round(analytics.avgPredictionAccuracy)}%</p>
                <p className="text-xs text-purple-600">vs actual outcomes</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Success Rate</p>
                <p className="text-2xl font-bold text-green-900">{Math.round(analytics.successRate)}%</p>
                <p className="text-xs text-green-600">{analytics.successful}/{analytics.contacted} contacted</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Response Rate</p>
                <p className="text-2xl font-bold text-blue-900">{Math.round(analytics.responseRate)}%</p>
                <p className="text-xs text-blue-600">{analytics.responded}/{analytics.contacted} responded</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Avg Response Time</p>
                <p className="text-2xl font-bold text-orange-900">{formatResponseTime(analytics.avgResponseTime)}</p>
                <p className="text-xs text-orange-600">from outreach</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Campaign Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalTargeted}</div>
              <div className="text-sm text-gray-600">Targeted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{analytics.contacted}</div>
              <div className="text-sm text-gray-600">Contacted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{analytics.responded}</div>
              <div className="text-sm text-gray-600">Responded</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{analytics.successful}</div>
              <div className="text-sm text-gray-600">Successful</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{analytics.declined}</div>
              <div className="text-sm text-gray-600">Declined</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Campaign Completion</span>
                <span>{Math.round(analytics.conversionRate)}%</span>
              </div>
              <Progress value={analytics.conversionRate} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Outreach Progress</span>
                <span>{Math.round((analytics.contacted / analytics.totalTargeted) * 100)}%</span>
              </div>
              <Progress value={(analytics.contacted / analytics.totalTargeted) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="journalists">Journalists</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Intelligence Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Average Relationship Score</span>
                    <span className="font-medium">{Math.round(analytics.avgRelationshipScore)}/100</span>
                  </div>
                  <Progress value={analytics.avgRelationshipScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Average Authority Score</span>
                    <span className="font-medium">{Math.round(analytics.avgAuthorityScore)}/100</span>
                  </div>
                  <Progress value={analytics.avgAuthorityScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Predicted Success Rate</span>
                    <span className="font-medium">{Math.round(analytics.avgPredictedSuccess)}%</span>
                  </div>
                  <Progress value={analytics.avgPredictedSuccess} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign ROI Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">
                    {analytics.successful > 0 ? `+${Math.round((analytics.successful * 1000 / (campaignBudget || 1000)) * 100)}%` : 'TBD'}
                  </div>
                  <div className="text-sm text-gray-600">Projected ROI</div>
                  <div className="text-xs text-gray-500">
                    Based on {analytics.successful} successful placements
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance by Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.tierBreakdown).map(([tier, data]) => (
                    <div key={tier} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">
                          {tier}
                        </Badge>
                        <span className="text-sm text-gray-600">{data.total} journalists</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {data.contacted > 0 ? Math.round((data.successful / data.contacted) * 100) : 0}% success
                        </div>
                        <div className="text-xs text-gray-500">
                          {data.successful}/{data.contacted} contacted
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance by Media Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.categoryBreakdown).map(([category, data]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">
                          {category.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-gray-600">{data.total} journalists</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {data.contacted > 0 ? Math.round((data.successful / data.contacted) * 100) : 0}% success
                        </div>
                        <div className="text-xs text-gray-500">
                          {data.successful}/{data.contacted} contacted
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="journalists" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Campaign Journalists</h3>
            <Badge variant="outline">{relationships.length} total</Badge>
          </div>
          
          <ScrollArea className="h-96">
            <div className="grid grid-cols-1 gap-4">
              {relationships.map((relationship) => {
                const journalist = campaignJournalists.find(j => j.id === relationship.journalist_id);
                if (!journalist) return null;

                return (
                  <div key={relationship.id} className="relative">
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <Badge className={getStatusColor(relationship.status)}>
                        {getStatusIcon(relationship.status)}
                        {relationship.status}
                      </Badge>
                      {relationship.actual_response_time_hours && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatResponseTime(relationship.actual_response_time_hours)}
                        </Badge>
                      )}
                    </div>
                    <JournalistCard
                      journalist={journalist}
                      onContact={() => {}}
                      onViewDetails={() => {}}
                      className="pr-24"
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Prediction Accuracy</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    AI predictions are {Math.round(analytics.avgPredictionAccuracy)}% accurate compared to actual outcomes.
                    {analytics.avgPredictionAccuracy > 80 ? " Excellent prediction quality!" : " Consider refining targeting criteria."}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Performance Trend</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {analytics.successRate > analytics.avgPredictedSuccess 
                      ? "Campaign is outperforming AI predictions!" 
                      : "Campaign performance aligns with AI forecasts."}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Top Performing Segment</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {Object.entries(analytics.tierBreakdown)
                      .sort(([,a], [,b]) => (b.contacted > 0 ? b.successful/b.contacted : 0) - (a.contacted > 0 ? a.successful/a.contacted : 0))[0]?.[0] || 'N/A'} tier 
                    journalists show the highest success rate.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Response Time Analysis</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Average response time is {formatResponseTime(analytics.avgResponseTime)}.
                    {analytics.avgResponseTime < 48 ? " Excellent engagement!" : " Consider follow-up strategies."}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Optimization Recommendations</span>
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {analytics.pending > 0 && (
                    <li>• Follow up with {analytics.pending} pending journalists for better coverage</li>
                  )}
                  {analytics.avgPredictionAccuracy < 70 && (
                    <li>• Refine targeting criteria to improve AI prediction accuracy</li>
                  )}
                  {analytics.responseRate < 30 && (
                    <li>• Consider personalizing outreach messages for better response rates</li>
                  )}
                  {analytics.avgResponseTime > 72 && (
                    <li>• Implement follow-up sequences to reduce response times</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}