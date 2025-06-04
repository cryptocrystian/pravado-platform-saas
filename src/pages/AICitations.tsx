
import React, { useState } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  MessageSquare, 
  Search, 
  Zap, 
  TrendingUp,
  Bell,
  Settings,
  Plus,
  Play,
  Pause,
  RefreshCw,
  BarChart3,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useCitationMonitoring } from '@/hooks/useCitationMonitoring';

const platformIcons = {
  openai: Brain,
  anthropic: MessageSquare,
  perplexity: Search,
  gemini: Zap,
  huggingface: TrendingUp
};

const platformColors = {
  openai: 'bg-green-100 text-green-800 border-green-200',
  anthropic: 'bg-orange-100 text-orange-800 border-orange-200',
  perplexity: 'bg-blue-100 text-blue-800 border-blue-200',
  gemini: 'bg-purple-100 text-purple-800 border-purple-200',
  huggingface: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

const sentimentColors = {
  positive: 'bg-green-100 text-green-800 border-green-200',
  neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  negative: 'bg-red-100 text-red-800 border-red-200'
};

export default function AICitations() {
  const { config, updateConfig, citations, analytics, isLoading, startMonitoring, isMonitoring } = useCitationMonitoring();
  const [newKeyword, setNewKeyword] = useState('');
  const [newCompetitor, setNewCompetitor] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !config.keywords.includes(newKeyword.trim())) {
      updateConfig({
        keywords: [...config.keywords, newKeyword.trim()]
      });
      setNewKeyword('');
    }
  };

  const handleAddCompetitor = () => {
    if (newCompetitor.trim() && !config.competitors.includes(newCompetitor.trim())) {
      updateConfig({
        competitors: [...config.competitors, newCompetitor.trim()]
      });
      setNewCompetitor('');
    }
  };

  const removeKeyword = (keyword: string) => {
    updateConfig({
      keywords: config.keywords.filter(k => k !== keyword)
    });
  };

  const removeCompetitor = (competitor: string) => {
    updateConfig({
      competitors: config.competitors.filter(c => c !== competitor)
    });
  };

  const handleStartMonitoring = async () => {
    if (!config.brandName || config.keywords.length === 0) {
      return;
    }

    try {
      const testQueries = [
        `What do you know about ${config.brandName}?`,
        `Compare marketing automation tools including ${config.brandName}`,
        `Best practices for ${config.keywords.join(', ')}`
      ];
      
      await startMonitoring(testQueries);
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  };

  return (
    <BaseLayout title="AI Citation Monitoring">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-professional-gray">AI Citation Monitoring</h1>
            <p className="text-gray-600 mt-1">Track and analyze brand mentions across major AI platforms</p>
          </div>
          <div className="mt-4 lg:mt-0 flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsConfiguring(!isConfiguring)}
              className="border-enterprise-blue text-enterprise-blue hover:bg-enterprise-blue hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button 
              onClick={handleStartMonitoring} 
              disabled={isMonitoring || isLoading}
              className="bg-enterprise-blue hover:bg-enterprise-blue/90"
            >
              {isMonitoring ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Monitoring...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Monitoring
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Configuration Panel */}
        {isConfiguring && (
          <Card className="border-2 border-enterprise-blue/20">
            <CardHeader>
              <CardTitle className="text-enterprise-blue flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Monitoring Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input
                      id="brandName"
                      value={config.brandName}
                      onChange={(e) => updateConfig({ brandName: e.target.value })}
                      placeholder="Enter your brand name"
                      className="border-border-gray focus:border-enterprise-blue"
                    />
                  </div>
                  
                  <div>
                    <Label>Keywords to Monitor</Label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="Add keyword"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                        className="border-border-gray focus:border-enterprise-blue"
                      />
                      <Button onClick={handleAddKeyword} size="sm" className="bg-enterprise-blue hover:bg-enterprise-blue/90">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {config.keywords.map((keyword) => (
                        <Badge
                          key={keyword}
                          variant="outline"
                          className="cursor-pointer hover:bg-red-50 hover:border-red-200"
                          onClick={() => removeKeyword(keyword)}
                        >
                          {keyword} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Competitors to Track</Label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        value={newCompetitor}
                        onChange={(e) => setNewCompetitor(e.target.value)}
                        placeholder="Add competitor"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCompetitor()}
                        className="border-border-gray focus:border-enterprise-blue"
                      />
                      <Button onClick={handleAddCompetitor} size="sm" className="bg-enterprise-blue hover:bg-enterprise-blue/90">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {config.competitors.map((competitor) => (
                        <Badge
                          key={competitor}
                          variant="outline"
                          className="cursor-pointer hover:bg-red-50 hover:border-red-200"
                          onClick={() => removeCompetitor(competitor)}
                        >
                          {competitor} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Monitoring Frequency</Label>
                    <Select 
                      value={config.frequency} 
                      onValueChange={(value) => updateConfig({ frequency: value as any })}
                    >
                      <SelectTrigger className="border-border-gray focus:border-enterprise-blue">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="alerts">Enable Alerts</Label>
                    <Switch
                      id="alerts"
                      checked={config.alerts}
                      onCheckedChange={(checked) => updateConfig({ alerts: checked })}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">AI Platforms</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {Object.entries(platformIcons).map(([platform, Icon]) => (
                        <div key={platform} className="flex items-center space-x-2 p-2 border border-border-gray rounded">
                          <Icon className="h-4 w-4 text-enterprise-blue" />
                          <span className="text-sm capitalize">{platform}</span>
                          <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Platform Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(platformIcons).map(([platform, Icon]) => (
            <Card key={platform} className="p-4 text-center hover:shadow-lg transition-shadow border-border-gray">
              <Icon className="h-8 w-8 mx-auto mb-2 text-enterprise-blue" />
              <h3 className="font-semibold text-sm capitalize text-professional-gray">{platform}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {citations.filter(c => c.platform === platform).length} mentions
              </p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="live-feed" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="live-feed">Live Feed</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="live-feed" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-professional-gray flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2 text-enterprise-blue" />
                    Real-time Citation Feed
                  </CardTitle>
                  <Badge variant="outline" className="text-enterprise-blue border-enterprise-blue">
                    {citations.length} total mentions
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {citations.length === 0 ? (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-500">No citations yet</h3>
                      <p className="text-sm text-gray-400">Start monitoring to see brand mentions across AI platforms</p>
                    </div>
                  ) : (
                    citations.slice(0, 10).map((citation, index) => {
                      const PlatformIcon = platformIcons[citation.platform];
                      return (
                        <div key={index} className="border border-border-gray rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <PlatformIcon className="h-5 w-5 text-enterprise-blue" />
                              <div>
                                <Badge className={platformColors[citation.platform]}>
                                  {citation.platform}
                                </Badge>
                                {citation.model && (
                                  <Badge variant="outline" className="ml-2">
                                    {citation.model}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={sentimentColors[citation.sentiment]}>
                                {citation.sentiment}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(citation.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              <strong>Query:</strong> {citation.query}
                            </p>
                            <div className="bg-soft-gray p-3 rounded border-l-4 border-enterprise-blue">
                              <p className="text-sm text-professional-gray">
                                {citation.mentions.length > 0 ? citation.mentions[0] : citation.response.substring(0, 200) + '...'}
                              </p>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Confidence: {Math.round(citation.confidence * 100)}%</span>
                              <span>Mentions: {citation.mentions.length}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-pravado-orange" />
                  <h3 className="font-semibold text-professional-gray">Mention Trend</h3>
                </div>
                <p className="text-2xl font-bold text-pravado-orange">+{analytics?.mentionTrendPercentage || 0}%</p>
                <p className="text-xs text-gray-500">vs last week</p>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-enterprise-blue" />
                  <h3 className="font-semibold text-professional-gray">Avg Sentiment</h3>
                </div>
                <p className="text-2xl font-bold text-enterprise-blue">{analytics?.avgSentimentScore || 0}/10</p>
                <p className="text-xs text-gray-500">Positive sentiment</p>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-pravado-purple" />
                  <h3 className="font-semibold text-professional-gray">Top Platform</h3>
                </div>
                <p className="text-2xl font-bold text-pravado-purple">{analytics?.topPlatform || 'N/A'}</p>
                <p className="text-xs text-gray-500">Most mentions</p>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-professional-gray">Citation Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-500">Advanced Analytics</h3>
                  <p className="text-sm text-gray-400">Detailed analytics and trends will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-professional-gray flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-enterprise-blue" />
                  Alert Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-500">No alerts configured</h3>
                  <p className="text-sm text-gray-400">Set up alerts to get notified of important mentions</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-professional-gray">Executive Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-500">Executive-ready reports</h3>
                  <p className="text-sm text-gray-400">Comprehensive reports and insights coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
}
