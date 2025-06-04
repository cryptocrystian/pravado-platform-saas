
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Bell, 
  TrendingUp, 
  Brain, 
  Zap, 
  MessageSquare,
  AlertCircle,
  BarChart3,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Citation {
  id: string;
  platform: 'openai' | 'anthropic' | 'perplexity' | 'gemini' | 'huggingface';
  model?: string;
  query: string;
  mention: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string;
  confidence: number;
  context: string;
}

interface MonitoringConfig {
  brandName: string;
  keywords: string[];
  competitors: string[];
  alerts: boolean;
  frequency: 'realtime' | 'hourly' | 'daily';
}

export function CitationMonitoring() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [config, setConfig] = useState<MonitoringConfig>({
    brandName: '',
    keywords: [],
    competitors: [],
    alerts: true,
    frequency: 'hourly'
  });
  const [loading, setLoading] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const { toast } = useToast();

  const platformIcons = {
    openai: Brain,
    anthropic: MessageSquare,
    perplexity: Search,
    gemini: Zap,
    huggingface: TrendingUp
  };

  const platformColors = {
    openai: 'bg-green-100 text-green-800',
    anthropic: 'bg-orange-100 text-orange-800',
    perplexity: 'bg-blue-100 text-blue-800',
    gemini: 'bg-purple-100 text-purple-800',
    huggingface: 'bg-yellow-100 text-yellow-800'
  };

  const sentimentColors = {
    positive: 'bg-green-100 text-green-800',
    neutral: 'bg-gray-100 text-gray-800',
    negative: 'bg-red-100 text-red-800'
  };

  // Mock data for demonstration
  useEffect(() => {
    const mockCitations: Citation[] = [
      {
        id: '1',
        platform: 'openai',
        model: 'GPT-4',
        query: 'Best marketing automation tools',
        mention: 'PRAVADO is a comprehensive marketing operating system that helps businesses automate their marketing workflows.',
        sentiment: 'positive',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        confidence: 0.92,
        context: 'Marketing automation discussion'
      },
      {
        id: '2',
        platform: 'gemini',
        model: 'Gemini Pro',
        query: 'Marketing platform comparison',
        mention: 'When comparing marketing platforms, PRAVADO offers unique AI-powered insights for enterprise teams.',
        sentiment: 'positive',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        confidence: 0.87,
        context: 'Platform comparison analysis'
      },
      {
        id: '3',
        platform: 'huggingface',
        model: 'Llama-2-70b',
        query: 'Enterprise marketing solutions',
        mention: 'PRAVADO is mentioned as one of the emerging players in the marketing technology space.',
        sentiment: 'neutral',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        confidence: 0.78,
        context: 'Enterprise solution overview'
      }
    ];
    setCitations(mockCitations);
  }, []);

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !config.keywords.includes(newKeyword.trim())) {
      setConfig(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
      toast({
        title: "Keyword added",
        description: `Now monitoring "${newKeyword.trim()}" across all AI platforms`,
      });
    }
  };

  const removeKeyword = (keyword: string) => {
    setConfig(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const startMonitoring = async () => {
    setLoading(true);
    try {
      // Simulate API call to start monitoring
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Monitoring started",
        description: "Now tracking citations across all AI platforms",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start monitoring. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshCitations = async () => {
    setLoading(true);
    try {
      // Simulate API call to refresh citations
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Citations refreshed",
        description: "Latest mentions retrieved from all platforms",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh citations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-professional-gray">AI Citation Monitoring</h2>
          <p className="text-gray-600">Track brand mentions across major AI platforms</p>
        </div>
        <div className="mt-4 lg:mt-0 flex space-x-3">
          <Button variant="outline" onClick={refreshCitations} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={startMonitoring} disabled={loading} className="bg-enterprise-blue hover:bg-enterprise-blue/90">
            <Bell className="h-4 w-4 mr-2" />
            Start Monitoring
          </Button>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(platformIcons).map(([platform, Icon]) => (
          <Card key={platform} className="p-4 text-center hover:shadow-lg transition-shadow">
            <Icon className="h-8 w-8 mx-auto mb-2 text-enterprise-blue" />
            <h3 className="font-semibold text-sm capitalize text-professional-gray">{platform}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {citations.filter(c => c.platform === platform).length} mentions
            </p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="citations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="citations">Live Citations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="citations" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-professional-gray">Recent Citations</h3>
              <Badge variant="outline" className="text-enterprise-blue">
                {citations.length} total mentions
              </Badge>
            </div>
            <div className="space-y-4">
              {citations.map((citation) => {
                const PlatformIcon = platformIcons[citation.platform];
                return (
                  <div key={citation.id} className="border border-border-gray rounded-lg p-4 hover:shadow-md transition-shadow">
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
                      <p className="text-sm text-professional-gray bg-soft-gray p-3 rounded">
                        {citation.mention}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Confidence: {Math.round(citation.confidence * 100)}%</span>
                        <span>Context: {citation.context}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-pravado-orange" />
                <h3 className="font-semibold text-professional-gray">Mention Trend</h3>
              </div>
              <p className="text-2xl font-bold text-pravado-orange">+24%</p>
              <p className="text-xs text-gray-500">vs last week</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-5 w-5 text-enterprise-blue" />
                <h3 className="font-semibold text-professional-gray">Avg Sentiment</h3>
              </div>
              <p className="text-2xl font-bold text-enterprise-blue">8.2/10</p>
              <p className="text-xs text-gray-500">Positive sentiment</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5 text-pravado-purple" />
                <h3 className="font-semibold text-professional-gray">Top Platform</h3>
              </div>
              <p className="text-2xl font-bold text-pravado-purple">OpenAI</p>
              <p className="text-xs text-gray-500">42% of mentions</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-professional-gray mb-4">Monitoring Configuration</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  value={config.brandName}
                  onChange={(e) => setConfig(prev => ({ ...prev, brandName: e.target.value }))}
                  placeholder="Enter your brand name"
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
                  />
                  <Button onClick={handleAddKeyword} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeKeyword(keyword)}
                    >
                      {keyword} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
