
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  MessageSquare, 
  Search,
  Zap,
  Download,
  AlertCircle,
  Users,
  Target
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Citation {
  id: string;
  platform: string;
  model?: string;
  query: string;
  mention: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string;
  confidence: number;
}

interface AnalyticsProps {
  citations: Citation[];
}

export function CitationAnalytics({ citations }: AnalyticsProps) {
  // Platform colors
  const platformColors = {
    openai: '#10B981',
    anthropic: '#F59E0B', 
    perplexity: '#3B82F6',
    gemini: '#8B5CF6',
    huggingface: '#EF4444'
  };

  // Calculate analytics metrics
  const totalMentions = citations.length;
  const uniquePlatforms = new Set(citations.map(c => c.platform)).size;
  const averageSentiment = citations.length > 0 
    ? citations.filter(c => c.sentiment === 'positive').length / citations.length * 100
    : 0;
  const averageConfidence = citations.length > 0
    ? citations.reduce((sum, c) => sum + c.confidence, 0) / citations.length * 100
    : 0;

  // Platform distribution data
  const platformData = Object.entries(
    citations.reduce((acc, citation) => {
      acc[citation.platform] = (acc[citation.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([platform, count]) => ({
    platform,
    count,
    percentage: (count / totalMentions * 100).toFixed(1)
  }));

  // Sentiment distribution
  const sentimentData = [
    { 
      name: 'Positive', 
      value: citations.filter(c => c.sentiment === 'positive').length,
      color: '#10B981'
    },
    { 
      name: 'Neutral', 
      value: citations.filter(c => c.sentiment === 'neutral').length,
      color: '#6B7280'
    },
    { 
      name: 'Negative', 
      value: citations.filter(c => c.sentiment === 'negative').length,
      color: '#EF4444'
    }
  ];

  // Timeline data (last 7 days)
  const timelineData = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayMentions = citations.filter(c => 
        c.timestamp.split('T')[0] === date
      );
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        mentions: dayMentions.length,
        positive: dayMentions.filter(c => c.sentiment === 'positive').length,
        neutral: dayMentions.filter(c => c.sentiment === 'neutral').length,
        negative: dayMentions.filter(c => c.sentiment === 'negative').length
      };
    });
  }, [citations]);

  // Top performing platforms
  const topPlatforms = platformData
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Recent trend calculation
  const recentMentions = citations.filter(c => {
    const citationDate = new Date(c.timestamp);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return citationDate >= threeDaysAgo;
  }).length;

  const previousMentions = citations.filter(c => {
    const citationDate = new Date(c.timestamp);
    const sixDaysAgo = new Date();
    const threeDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return citationDate >= sixDaysAgo && citationDate < threeDaysAgo;
  }).length;

  const trendPercentage = previousMentions > 0 
    ? ((recentMentions - previousMentions) / previousMentions * 100)
    : recentMentions > 0 ? 100 : 0;

  const platformIcons = {
    openai: Brain,
    anthropic: MessageSquare,
    perplexity: Search,
    gemini: Zap,
    huggingface: TrendingUp
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Mentions</p>
              <p className="text-2xl font-bold text-enterprise-blue">{totalMentions}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-enterprise-blue" />
          </div>
          <div className="flex items-center mt-2">
            {trendPercentage >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${trendPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(trendPercentage).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last 3 days</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">AI Platforms</p>
              <p className="text-2xl font-bold text-pravado-purple">{uniquePlatforms}</p>
            </div>
            <Users className="h-8 w-8 text-pravado-purple" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Active monitoring</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Positive Sentiment</p>
              <p className="text-2xl font-bold text-green-500">{averageSentiment.toFixed(1)}%</p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Average sentiment</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-pravado-orange">{averageConfidence.toFixed(1)}%</p>
            </div>
            <AlertCircle className="h-8 w-8 text-pravado-orange" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Citation confidence</p>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-professional-gray">Mention Timeline</h3>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="mentions" 
                stroke="#1e40af" 
                strokeWidth={2}
                dot={{ fill: '#1e40af' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Platform Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-professional-gray mb-4">Platform Distribution</h3>
          <div className="space-y-4">
            {platformData.map((platform) => {
              const Icon = platformIcons[platform.platform as keyof typeof platformIcons] || Brain;
              return (
                <div key={platform.platform} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-enterprise-blue" />
                    <span className="font-medium capitalize">{platform.platform}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{platform.count} mentions</span>
                    <Badge variant="outline">{platform.percentage}%</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Sentiment Analysis */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-professional-gray mb-4">Sentiment Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Performing Platforms */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-professional-gray mb-4">Top Performing Platforms</h3>
          <div className="space-y-4">
            {topPlatforms.map((platform, index) => {
              const Icon = platformIcons[platform.platform as keyof typeof platformIcons] || Brain;
              return (
                <div key={platform.platform} className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <Icon className="h-5 w-5 text-enterprise-blue" />
                    <span className="font-medium capitalize">{platform.platform}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-enterprise-blue">{platform.count}</p>
                    <p className="text-sm text-gray-500">{platform.percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Export and Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-professional-gray">Export & Reports</h3>
            <p className="text-gray-600">Download comprehensive citation monitoring reports</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button className="bg-enterprise-blue hover:bg-enterprise-blue/90">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
