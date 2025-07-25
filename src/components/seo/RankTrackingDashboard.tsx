
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
  Brain,
  Eye
} from 'lucide-react';
import { useKeywordTracking, useSEOCompetitors } from '@/hooks/useSEOData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RankTrackingDashboardProps {
  projectId?: string | null;
  automateProgress: number;
}

export function RankTrackingDashboard({ projectId, automateProgress }: RankTrackingDashboardProps) {
  const { data: trackingData = [], isLoading: trackingLoading } = useKeywordTracking(projectId || undefined);
  const { data: competitors = [], isLoading: competitorsLoading } = useSEOCompetitors(projectId || undefined);

  // Transform tracking data for charts and performance display
  const chartData = trackingData.map(item => ({
    date: new Date(item.tracked_at).toISOString().split('T')[0],
    position: item.position,
    keyword: trackingData.find(t => t.keyword_id === item.keyword_id)?.keyword_id || 'Unknown'
  }));

  // Calculate keyword performance with position changes
  const keywordPerformance = trackingData.reduce((acc, current) => {
    const keyword = current.keyword_id || 'Unknown';
    const existing = acc.find(item => item.keyword === keyword);
    
    if (!existing) {
      acc.push({
        keyword,
        currentPosition: current.position,
        previousPosition: current.previous_position || current.position,
        change: current.previous_position ? current.position - current.previous_position : 0,
        volume: current.estimated_traffic || 0
      });
    }
    
    return acc;
  }, [] as Array<{keyword: string, currentPosition: number, previousPosition: number, change: number, volume: number}>);

  // Transform competitors data for display
  const competitorData = competitors.map(comp => ({
    domain: comp.competitor_domain,
    visibility: comp.visibility_score,
    keywords: 0, // This would need additional data
    change: 0 // This would need historical data
  }));

  const getPositionChange = (change: number) => {
    if (change > 0) return { icon: <ArrowUp className="w-4 h-4 text-green-600" />, color: 'text-green-600' };
    if (change < 0) return { icon: <ArrowDown className="w-4 h-4 text-red-600" />, color: 'text-red-600' };
    return { icon: <Minus className="w-4 h-4 text-gray-400" />, color: 'text-gray-400' };
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600';
    if (position <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVisibilityColor = (visibility: number) => {
    if (visibility >= 90) return 'bg-green-100 text-green-800';
    if (visibility >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header with AUTOMATE Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-professional-gray">Rank Tracking Dashboard</h2>
          <p className="text-gray-600">Measure & Monitor methodology for ranking performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-pravado-purple" />
          <span className="text-sm text-pravado-purple font-medium">
            Measure & Monitor: {automateProgress}%
          </span>
        </div>
      </div>

      {/* AUTOMATE Progress */}
      <Card className="bg-gradient-to-r from-pravado-purple/10 to-enterprise-blue/10 border-l-4 border-l-pravado-purple">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-professional-gray">Measure & Monitor Progress</span>
            <span className="text-sm text-pravado-purple font-bold">{automateProgress}%</span>
          </div>
          <Progress value={automateProgress} className="h-2 mb-2" />
          <div className="text-xs text-gray-600">
            Ranking measurement and monitoring within AUTOMATE methodology
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Target className="h-8 w-8 text-enterprise-blue" />
              <div className="text-2xl font-bold text-enterprise-blue">{trackingData.length}</div>
            </div>
            <h3 className="text-lg font-semibold text-professional-gray mt-2">Keywords Tracked</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="text-2xl font-bold text-green-600">
                {keywordPerformance.filter(kw => kw.change > 0).length}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-professional-gray mt-2">Improving</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="text-2xl font-bold text-red-600">
                {keywordPerformance.filter(kw => kw.change < 0).length}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-professional-gray mt-2">Declining</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <BarChart3 className="h-8 w-8 text-pravado-orange" />
              <div className="text-2xl font-bold text-pravado-orange">
                {keywordPerformance.length > 0 
                  ? (keywordPerformance.reduce((sum, kw) => sum + kw.currentPosition, 0) / keywordPerformance.length).toFixed(1)
                  : '0'
                }
              </div>
            </div>
            <h3 className="text-lg font-semibold text-professional-gray mt-2">Avg. Position</h3>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keywords" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keywords">Keyword Rankings</TabsTrigger>
          <TabsTrigger value="trends">Ranking Trends</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackingLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-enterprise-blue mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading keyword performance...</p>
                  </div>
                ) : keywordPerformance.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No keyword tracking data</h4>
                    <p className="text-gray-500">Start tracking keywords to see performance metrics.</p>
                  </div>
                ) : (
                  keywordPerformance.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-soft-gray rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-professional-gray">{keyword.keyword}</div>
                      <div className="text-sm text-gray-600">
                        Monthly Volume: {keyword.volume.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getPositionColor(keyword.currentPosition)}`}>
                          #{keyword.currentPosition}
                        </div>
                        <div className="text-xs text-gray-600">Current</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">#{keyword.previousPosition}</div>
                        <div className="text-xs text-gray-600">Previous</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getPositionChange(keyword.change).icon}
                        <span className={`text-sm font-medium ${getPositionChange(keyword.change).color}`}>
                          {Math.abs(keyword.change)}
                        </span>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ranking Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 30]} reversed />
                    <Tooltip 
                      labelFormatter={(label) => `Date: ${label}`}
                      formatter={(value) => [`Position #${value}`, 'Ranking']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="position" 
                      stroke="#1e40af" 
                      strokeWidth={3}
                      dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">+17</div>
                        <div className="text-xs text-green-700">Positions Gained</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Target className="w-6 h-6 text-enterprise-blue" />
                      <div className="text-right">
                        <div className="text-lg font-bold text-enterprise-blue">3</div>
                        <div className="text-xs text-blue-700">Top 10 Rankings</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <BarChart3 className="w-6 h-6 text-pravado-purple" />
                      <div className="text-right">
                        <div className="text-lg font-bold text-pravado-purple">68%</div>
                        <div className="text-xs text-purple-700">Improvement Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-pravado-purple" />
                <span>Competitor Visibility Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pravado-purple mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading competitor data...</p>
                  </div>
                ) : competitorData.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No competitor data</h4>
                    <p className="text-gray-500">Add competitors to track their visibility and performance.</p>
                  </div>
                ) : (
                  competitorData.map((competitor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-enterprise-blue to-pravado-purple rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-professional-gray">{competitor.domain}</div>
                        <div className="text-sm text-gray-600">{competitor.keywords} keywords tracked</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getVisibilityColor(competitor.visibility)}>
                        {competitor.visibility}% Visibility
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {getPositionChange(competitor.change).icon}
                        <span className={`text-sm ${getPositionChange(competitor.change).color}`}>
                          {Math.abs(competitor.change)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Competitive Insights</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div>• Your domain ranks for 45% of competitor keywords</div>
                  <div>• Opportunity gap: 120 high-volume keywords to target</div>
                  <div>• Average competitor visibility: 86%</div>
                  <div>• Market share potential: 15% increase with optimization</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
