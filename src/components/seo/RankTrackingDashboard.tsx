
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  Search,
  Brain,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import { useKeywordTracking, useSEOCompetitors } from '@/hooks/useSEOData';

interface RankTrackingDashboardProps {
  projectId: string | null;
  automateProgress: number;
}

export function RankTrackingDashboard({ projectId, automateProgress }: RankTrackingDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  
  const { data: tracking = [] } = useKeywordTracking(projectId || undefined);
  const { data: competitors = [] } = useSEOCompetitors(projectId || undefined);

  // Mock tracking data for demonstration
  const mockTrackingData = [
    {
      id: 1,
      keyword: 'digital marketing strategy',
      current_position: 12,
      previous_position: 15,
      change: 3,
      url: '/digital-marketing-guide',
      search_volume: 8100,
      automate_step: 'Measure & Monitor',
      trend: 'up',
      serp_features: ['Featured Snippet', 'People Also Ask']
    },
    {
      id: 2,
      keyword: 'SEO optimization tools',
      current_position: 8,
      previous_position: 8,
      change: 0,
      url: '/seo-tools-guide',
      search_volume: 5400,
      automate_step: 'Measure & Monitor',
      trend: 'stable',
      serp_features: ['Featured Snippet']
    },
    {
      id: 3,
      keyword: 'content marketing automation',
      current_position: 23,
      previous_position: 18,
      change: -5,
      url: '/content-automation',
      search_volume: 3200,
      automate_step: 'Measure & Monitor',
      trend: 'down',
      serp_features: ['Video Pack']
    }
  ];

  const mockCompetitorRankings = [
    {
      keyword: 'digital marketing strategy',
      our_position: 12,
      competitor_rankings: [
        { domain: 'competitor1.com', position: 3 },
        { domain: 'competitor2.com', position: 7 },
        { domain: 'competitor3.com', position: 15 }
      ]
    }
  ];

  const getPositionChange = (current: number, previous: number) => {
    if (current < previous) return { type: 'improvement', value: previous - current };
    if (current > previous) return { type: 'decline', value: current - previous };
    return { type: 'stable', value: 0 };
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600 bg-green-100';
    if (position <= 10) return 'text-blue-600 bg-blue-100';
    if (position <= 20) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
  };

  return (
    <div className="space-y-6">
      {/* AUTOMATE Integration Header */}
      <Card className="bg-gradient-to-r from-pravado-orange/10 to-enterprise-blue/10 border-l-4 border-l-pravado-orange">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-pravado-orange" />
              <div>
                <h3 className="font-semibold text-professional-gray">Measure & Monitor: Rank Tracking</h3>
                <p className="text-sm text-gray-600">Comprehensive keyword position monitoring and competitive analysis</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-pravado-orange">{automateProgress}%</div>
              <div className="text-sm text-gray-600">AUTOMATE Progress</div>
            </div>
          </div>
          <Progress value={automateProgress} className="h-2 mt-3" />
        </CardContent>
      </Card>

      {/* Tracking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-enterprise-blue" />
            <div className="text-2xl font-bold text-enterprise-blue">{mockTrackingData.length}</div>
            <div className="text-sm text-gray-600">Keywords Tracked</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">
              {mockTrackingData.filter(k => k.change > 0).length}
            </div>
            <div className="text-sm text-gray-600">Improving</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-red-600">
              {mockTrackingData.filter(k => k.change < 0).length}
            </div>
            <div className="text-sm text-gray-600">Declining</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-pravado-purple" />
            <div className="text-2xl font-bold text-pravado-purple">
              {Math.round(mockTrackingData.reduce((sum, k) => sum + k.current_position, 0) / mockTrackingData.length)}
            </div>
            <div className="text-sm text-gray-600">Avg. Position</div>
          </CardContent>
        </Card>
      </div>

      {/* Timeframe Selection */}
      <div className="flex space-x-2">
        {['7d', '30d', '90d', '1y'].map((period) => (
          <Button
            key={period}
            variant={selectedTimeframe === period ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe(period)}
          >
            {period}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="rankings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rankings">Keyword Rankings</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="serp-features">SERP Features</TabsTrigger>
          <TabsTrigger value="alerts">Ranking Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="rankings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-enterprise-blue" />
                <span>Keyword Position Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTrackingData.map((keyword) => {
                  const change = getPositionChange(keyword.current_position, keyword.previous_position);
                  
                  return (
                    <div key={keyword.id} className="border rounded-lg p-4 hover:bg-soft-gray transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-professional-gray">{keyword.keyword}</h3>
                          {getTrendIcon(keyword.change)}
                          <Badge className="bg-pravado-orange/10 text-pravado-orange">
                            {keyword.automate_step}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(keyword.current_position)}`}>
                            #{keyword.current_position}
                          </div>
                          {change.type !== 'stable' && (
                            <div className={`text-sm ${
                              change.type === 'improvement' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {change.type === 'improvement' ? '+' : '-'}{change.value}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-600">Search Volume</div>
                          <div className="font-medium">{keyword.search_volume.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Current URL</div>
                          <div className="font-medium text-blue-600">{keyword.url}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">SERP Features</div>
                          <div className="flex flex-wrap gap-1">
                            {keyword.serp_features.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View SERP
                        </Button>
                        <Button size="sm" variant="outline">
                          <Target className="w-4 h-4 mr-2" />
                          Optimize Page
                        </Button>
                        <Button size="sm">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Trends
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-pravado-orange" />
                <span>Competitor Ranking Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCompetitorRankings.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-professional-gray mb-3">{item.keyword}</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Our Position</div>
                        <div className={`px-3 py-2 rounded-full font-medium ${getPositionColor(item.our_position)}`}>
                          #{item.our_position}
                        </div>
                      </div>
                      {item.competitor_rankings.map((comp, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-sm text-gray-600 mb-1">{comp.domain}</div>
                          <div className={`px-3 py-2 rounded-full font-medium ${getPositionColor(comp.position)}`}>
                            #{comp.position}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="serp-features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-pravado-purple" />
                <span>SERP Features Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">SERP Features Analysis</h3>
                <p className="text-gray-500 mb-6">
                  Track featured snippets, local packs, and other SERP features for your keywords
                </p>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze SERP Features
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Ranking Alerts & Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-red-900">Significant Ranking Drop</h3>
                  </div>
                  <p className="text-sm text-red-700 mb-3">
                    "content marketing automation" dropped 5 positions to #23
                  </p>
                  <Button size="sm" variant="outline">Investigate Issue</Button>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Ranking Improvement</h3>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    "digital marketing strategy" improved 3 positions to #12
                  </p>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">AUTOMATE Recommendation</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Consider content optimization for keywords ranking 11-20 to break into top 10
                  </p>
                  <Button size="sm" variant="outline">Apply Suggestion</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
