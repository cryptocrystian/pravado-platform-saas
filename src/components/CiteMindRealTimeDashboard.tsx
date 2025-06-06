
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Play, 
  Radio, 
  TrendingUp, 
  Brain, 
  Target,
  Globe,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { useCiteMindData } from '@/hooks/useCiteMindData';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function CiteMindRealTimeDashboard() {
  const {
    citationQueries,
    citationResults,
    citationAnalytics,
    podcastEpisodes,
    podcastPlatforms,
    isLoading,
    createCitationQuery,
    runCitationMonitoring,
    generatePodcast,
    syndicateEpisode,
    isCreatingQuery,
    isRunningMonitoring,
    isGeneratingPodcast,
    isSyndicating
  } = useCiteMindData();

  const [newQuery, setNewQuery] = useState({
    query_text: '',
    target_keywords: '',
    platforms: ['openai', 'anthropic', 'perplexity', 'gemini']
  });

  const handleCreateQuery = async () => {
    await createCitationQuery.mutateAsync({
      query_text: newQuery.query_text,
      target_keywords: newQuery.target_keywords.split(',').map(k => k.trim()),
      platforms: newQuery.platforms
    });
    setNewQuery({ query_text: '', target_keywords: '', platforms: ['openai', 'anthropic', 'perplexity', 'gemini'] });
  };

  const totalCitations = citationResults?.reduce((sum, result) => sum + (result.citations_found?.length || 0), 0) || 0;
  const avgSentiment = citationResults?.reduce((sum, result) => sum + (result.sentiment_score || 0), 0) / (citationResults?.length || 1) || 0;
  const totalEpisodes = podcastEpisodes?.length || 0;
  const publishedEpisodes = podcastEpisodes?.filter(ep => ep.status === 'published').length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Brain className="w-6 h-6" />
              {totalCitations}
            </CardTitle>
            <CardDescription>AI Platform Citations Found</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-orange-500 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              {(avgSentiment * 100).toFixed(1)}%
            </CardTitle>
            <CardDescription>Average Sentiment Score</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-purple-600 flex items-center gap-2">
              <Radio className="w-6 h-6" />
              {publishedEpisodes}/{totalEpisodes}
            </CardTitle>
            <CardDescription>Published Podcast Episodes</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-green-500 flex items-center gap-2">
              <Globe className="w-6 h-6" />
              {podcastPlatforms?.length || 0}
            </CardTitle>
            <CardDescription>Connected Podcast Platforms</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitoring">AI Citation Monitoring</TabsTrigger>
          <TabsTrigger value="podcasting">Podcast Syndication</TabsTrigger>
          <TabsTrigger value="analytics">Cross-Platform Analytics</TabsTrigger>
        </TabsList>

        {/* AI Citation Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create New Monitoring Query */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Create Citation Monitoring
                </CardTitle>
                <CardDescription>
                  Set up automated monitoring for your content across AI platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter monitoring query (e.g., 'What is the best marketing automation tool?')"
                  value={newQuery.query_text}
                  onChange={(e) => setNewQuery(prev => ({ ...prev, query_text: e.target.value }))}
                />
                <Input
                  placeholder="Target keywords (comma-separated)"
                  value={newQuery.target_keywords}
                  onChange={(e) => setNewQuery(prev => ({ ...prev, target_keywords: e.target.value }))}
                />
                <Button 
                  onClick={handleCreateQuery} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isCreatingQuery || !newQuery.query_text || !newQuery.target_keywords}
                >
                  {isCreatingQuery ? <LoadingSpinner size="sm" /> : 'Create Monitoring Query'}
                </Button>
              </CardContent>
            </Card>

            {/* Active Monitoring Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Active Monitoring Queries
                </CardTitle>
                <CardDescription>
                  Currently monitored queries across AI platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {citationQueries?.slice(0, 5).map((query) => (
                    <div key={query.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{query.query_text}</p>
                          <div className="flex gap-2 mt-1">
                            {query.target_keywords?.map((keyword, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge variant={query.status === 'active' ? 'default' : 'secondary'}>
                          {query.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => runCitationMonitoring.mutateAsync(undefined)}
                    disabled={isRunningMonitoring}
                  >
                    {isRunningMonitoring ? <LoadingSpinner size="sm" /> : 'Run All Monitoring Queries'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Citation Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Recent AI Platform Citations
              </CardTitle>
              <CardDescription>
                Latest citations found across ChatGPT, Claude, Perplexity, and Gemini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {citationResults?.slice(0, 10).map((result) => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{result.platform}</Badge>
                        {result.model_used && (
                          <Badge variant="secondary" className="text-xs">{result.model_used}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={result.sentiment_score > 0 ? 'default' : result.sentiment_score < 0 ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          Sentiment: {((result.sentiment_score || 0) * 100).toFixed(0)}%
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Confidence: {((result.confidence_score || 0) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        {result.citations_found?.map((citation, idx) => (
                          <Badge key={idx} className="bg-purple-600 text-white text-xs">
                            {citation}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {result.response_text}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(result.query_timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {!citationResults?.length && (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No citations found yet. Create a monitoring query to get started!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Podcast Syndication Tab */}
        <TabsContent value="podcasting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Episodes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="w-5 h-5" />
                  Recent Podcast Episodes
                </CardTitle>
                <CardDescription>
                  Generated episodes and syndication status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {podcastEpisodes?.slice(0, 8).map((episode) => (
                    <div key={episode.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{episode.title}</p>
                          <p className="text-xs text-gray-500">
                            Episode {episode.episode_number} • Season {episode.season_number}
                          </p>
                          {episode.audio_duration_seconds && (
                            <p className="text-xs text-gray-400">
                              Duration: {Math.floor(episode.audio_duration_seconds / 60)}m {episode.audio_duration_seconds % 60}s
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge 
                            variant={episode.status === 'published' ? 'default' : 
                                   episode.status === 'processing' ? 'secondary' : 'destructive'}
                          >
                            {episode.status}
                          </Badge>
                          {episode.status === 'published' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => syndicateEpisode.mutateAsync(episode.id)}
                              disabled={isSyndicating}
                            >
                              {isSyndicating ? <LoadingSpinner size="sm" /> : 'Syndicate'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {!podcastEpisodes?.length && (
                    <div className="text-center py-8 text-gray-500">
                      <Radio className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No podcast episodes yet. Generate content to create episodes!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Connected Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Connected Podcast Platforms
                </CardTitle>
                <CardDescription>
                  {podcastPlatforms?.length || 0} platforms ready for syndication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {podcastPlatforms?.map((platform) => (
                    <div key={platform.id} className="flex items-center gap-2 p-2 border rounded">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{platform.name}</span>
                      {platform.requires_manual_upload && (
                        <Badge variant="outline" className="text-xs">Manual</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generation Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Generate podcasts from your existing content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  disabled={isGeneratingPodcast}
                >
                  <Play className="w-6 h-6" />
                  Generate from Press Release
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  disabled={isGeneratingPodcast}
                >
                  <Radio className="w-6 h-6" />
                  Generate from Blog Post
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  disabled={isGeneratingPodcast}
                >
                  <BarChart3 className="w-6 h-6" />
                  Generate from Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cross-Platform Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Citation Trends */}
            <Card>
              <CardHeader>
                <CardTitle>AI Citation Trends</CardTitle>
                <CardDescription>
                  Citation performance across platforms over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {citationAnalytics?.slice(0, 5).map((analytics, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{analytics.platform}</span>
                        <span className="text-sm text-gray-500">
                          {analytics.citations_found} citations
                        </span>
                      </div>
                      <Progress 
                        value={(analytics.citations_found / Math.max(...(citationAnalytics?.map(a => a.citations_found) || [1]))) * 100} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Sentiment: {(analytics.avg_sentiment_score * 100).toFixed(0)}%</span>
                        <span>Confidence: {(analytics.avg_confidence_score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                  {!citationAnalytics?.length && (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Analytics will appear as citation data is collected.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ROI Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>CiteMind™ ROI Impact</CardTitle>
                <CardDescription>
                  Business value generated by AI citations and podcast syndication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Estimated AI Visibility Value</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${(totalCitations * 125).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Podcast Reach Multiplier</span>
                    <span className="text-lg font-bold text-purple-600">
                      {(publishedEpisodes * 1250).toLocaleString()} listeners
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Content Amplification</span>
                    <span className="text-lg font-bold text-green-600">
                      {((totalCitations + publishedEpisodes) * 3.2).toFixed(1)}x reach
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
