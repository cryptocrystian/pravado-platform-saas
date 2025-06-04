
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Headphones, 
  Upload, 
  TrendingUp, 
  Users, 
  Play, 
  Radio, 
  Share2, 
  BarChart3,
  Rss
} from 'lucide-react';
import { usePodcastSyndication } from '@/hooks/usePodcastSyndication';
import { EmptyState } from '@/components/EmptyState';

export const PodcastSyndicationDashboard = () => {
  const { 
    episodes, 
    metrics, 
    isLoading, 
    createPodcast, 
    syndicateEpisode, 
    getSupportedPlatforms,
    isCreating,
    isSyndicating 
  } = usePodcastSyndication();

  const platforms = getSupportedPlatforms();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  const podcastMetrics = [
    { title: "Total Episodes", value: metrics?.totalEpisodes || 0, icon: Headphones, color: "enterprise-blue" },
    { title: "Total Downloads", value: (metrics?.totalDownloads || 0).toLocaleString(), icon: TrendingUp, color: "pravado-orange" },
    { title: "Avg per Episode", value: (metrics?.avgDownloadsPerEpisode || 0).toLocaleString(), icon: Users, color: "pravado-purple" },
    { title: "Platforms Connected", value: metrics?.platformsConnected || 0, icon: Radio, color: "pravado-crimson" },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {podcastMetrics.map((metric, index) => (
          <Card key={index} className="p-6 bg-white border border-border-gray hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`h-8 w-8 text-${metric.color}`} />
              <div className={`text-2xl font-bold text-${metric.color}`}>
                {metric.value}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-professional-gray">{metric.title}</h3>
            {metric.title === "Total Downloads" && metrics?.monthlyGrowth && (
              <div className="mt-2 text-sm text-green-600">
                +{metrics.monthlyGrowth}% this month
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Podcast Management */}
      <Card className="bg-white border border-border-gray">
        <div className="p-6 border-b border-border-gray">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-professional-gray">Podcast Syndication</h2>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Rss className="h-4 w-4 mr-2" />
                RSS Feed
              </Button>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Manual Upload
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <Tabs defaultValue="episodes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="episodes">Episodes</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="episodes" className="mt-6">
              {episodes.length > 0 ? (
                <div className="space-y-4">
                  {episodes.map((episode) => (
                    <Card key={episode.id} className="p-6 border border-border-gray">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Play className="h-5 w-5 text-enterprise-blue" />
                            <h3 className="text-lg font-semibold text-professional-gray">
                              {episode.title}
                            </h3>
                            <Badge variant="outline">{Math.floor(episode.duration / 60)}:{(episode.duration % 60).toString().padStart(2, '0')}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {episode.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Published: {new Date(episode.publishDate).toLocaleDateString()}</span>
                            <span>Platforms: {episode.syndicationStatus?.length || 0}/34+</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button 
                            size="sm" 
                            onClick={() => syndicateEpisode(episode.id)}
                            disabled={isSyndicating}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            {isSyndicating ? 'Syndicating...' : 'Syndicate'}
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Headphones}
                  title="No podcast episodes"
                  description="Podcast episodes will be automatically created from your press releases."
                  actionLabel="View Press Releases"
                  onAction={() => window.location.href = '/public-relations'}
                />
              )}
            </TabsContent>
            
            <TabsContent value="platforms" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platforms.map((platform, index) => (
                  <Card key={index} className="p-4 border border-border-gray">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-professional-gray">
                        {platform.name}
                      </h4>
                      <Badge 
                        variant={platform.status === 'connected' ? 'default' : 'secondary'}
                        className={platform.status === 'connected' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {platform.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {platform.requiresManualUpload ? 'Manual upload required' : 'Automated syndication'}
                    </p>
                  </Card>
                ))}
              </div>
              <div className="mt-6 p-4 bg-soft-gray rounded-lg">
                <div className="flex items-center space-x-3">
                  <Radio className="h-5 w-5 text-enterprise-blue" />
                  <div>
                    <h4 className="text-sm font-semibold text-professional-gray">
                      34+ Platform Distribution
                    </h4>
                    <p className="text-xs text-gray-600">
                      Your podcasts reach maximum audience across all major platforms
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 border border-border-gray">
                  <h4 className="text-lg font-semibold text-professional-gray mb-4">Download Trends</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>This Month</span>
                      <span className="font-semibold">3,420 downloads</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Last Month</span>
                      <span className="font-semibold">2,750 downloads</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </Card>
                
                <Card className="p-6 border border-border-gray">
                  <h4 className="text-lg font-semibold text-professional-gray mb-4">Top Platforms</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Spotify', percentage: 38, downloads: '1,298' },
                      { name: 'Apple Podcasts', percentage: 29, downloads: '992' },
                      { name: 'Google Podcasts', percentage: 18, downloads: '616' },
                      { name: 'Others', percentage: 15, downloads: '514' }
                    ].map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between">
                        <span className="text-sm text-professional-gray">{platform.name}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={platform.percentage} className="w-20 h-2" />
                          <span className="text-xs text-gray-500 w-16 text-right">
                            {platform.downloads}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};
