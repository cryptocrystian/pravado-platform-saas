
import React, { useState, useMemo } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Grid, List, TrendingUp, Eye, ThumbsUp, Search } from 'lucide-react';
import { CreateContentModal } from '@/components/CreateContentModal';
import { ContentGrid } from '@/components/ContentGrid';
import { useContent } from '@/hooks/useContent';
import { useCampaigns } from '@/hooks/useCampaigns';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const ContentMarketing = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  
  const { data: content, isLoading: contentLoading, refetch } = useContent();
  const { data: campaigns } = useCampaigns();

  // Memoize filtered content to prevent unnecessary recalculations
  const filteredContent = useMemo(() => {
    if (!content) return [];
    
    return content.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.content_body && item.content_body.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesCampaign = campaignFilter === 'all' || (item as any).campaign_id === campaignFilter;
      
      return matchesSearch && matchesStatus && matchesCampaign;
    });
  }, [content, searchTerm, statusFilter, campaignFilter]);

  // Memoize content metrics to prevent recalculation
  const contentMetrics = useMemo(() => {
    if (!content) return [
      { title: "Published Content", value: "0", icon: TrendingUp, accentColor: "#059669" },
      { title: "Total Views", value: "0", icon: Eye, accentColor: "#1e40af" },
      { title: "Avg. Engagement", value: "0%", icon: ThumbsUp, accentColor: "#ff6b35" },
    ];

    const publishedCount = content.filter(c => c.status === 'published').length;
    const totalViews = content.reduce((sum, c) => sum + (c.view_count || 0), 0);
    const avgEngagement = content.length > 0 
      ? (content.reduce((sum, c) => sum + (c.engagement_rate || 0), 0) / content.length).toFixed(1) + '%'
      : '0%';

    return [
      { title: "Published Content", value: publishedCount.toString(), icon: TrendingUp, accentColor: "#059669" },
      { title: "Total Views", value: totalViews.toLocaleString(), icon: Eye, accentColor: "#1e40af" },
      { title: "Avg. Engagement", value: avgEngagement, icon: ThumbsUp, accentColor: "#ff6b35" },
    ];
  }, [content]);

  // Memoize filtered content by status
  const contentByStatus = useMemo(() => {
    if (!filteredContent) return { published: [], draft: [], scheduled: [] };
    
    return {
      published: filteredContent.filter(c => c.status === 'published'),
      draft: filteredContent.filter(c => c.status === 'draft'),
      scheduled: filteredContent.filter(c => c.status === 'scheduled'),
    };
  }, [filteredContent]);

  if (contentLoading) {
    return (
      <BaseLayout title="Content Marketing" breadcrumb="Content Marketing">
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout title="Content Marketing" breadcrumb="Content Marketing">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-professional-gray mb-2">Content Marketing</h1>
              <p className="text-gray-600">Create, manage, and optimize your content strategy</p>
            </div>
            <div className="mt-4 lg:mt-0 flex space-x-3">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Content Calendar
              </Button>
              <CreateContentModal onContentCreated={refetch} />
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {contentMetrics.map((metric, index) => (
              <Card key={index} className="p-6 bg-white border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: metric.accentColor }}>
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="h-8 w-8 text-professional-gray" />
                  <div className="text-2xl font-bold text-professional-gray">
                    {metric.value}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-professional-gray">{metric.title}</h3>
              </Card>
            ))}
          </div>

          {/* Content Management */}
          <Card className="bg-white border border-border-gray">
            <div className="p-6 border-b border-border-gray">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-professional-gray">Content Library</h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    {campaigns?.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="p-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Content ({filteredContent.length})</TabsTrigger>
                  <TabsTrigger value="published">
                    Published ({contentByStatus.published.length})
                  </TabsTrigger>
                  <TabsTrigger value="draft">
                    Drafts ({contentByStatus.draft.length})
                  </TabsTrigger>
                  <TabsTrigger value="scheduled">
                    Scheduled ({contentByStatus.scheduled.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-6">
                  {filteredContent.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-professional-gray mb-2">
                        {content?.length === 0 ? 'No content yet' : 'No content matches your filters'}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {content?.length === 0 
                          ? 'Start creating compelling content to engage your audience and drive results.'
                          : 'Try adjusting your search or filter criteria'
                        }
                      </p>
                      {content?.length === 0 && (
                        <CreateContentModal onContentCreated={refetch} />
                      )}
                    </div>
                  ) : (
                    <ContentGrid content={filteredContent} viewMode={viewMode} />
                  )}
                </TabsContent>
                
                {['published', 'draft', 'scheduled'].map((status) => (
                  <TabsContent key={status} value={status} className="mt-6">
                    <ContentGrid 
                      content={contentByStatus[status as keyof typeof contentByStatus]} 
                      viewMode={viewMode} 
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ContentMarketing;
