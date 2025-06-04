
import React from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BarChart3, TrendingUp, Users, Eye, MousePointer, Search, Brain } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { CitationMonitoring } from '@/components/CitationMonitoring';
import { CitationAnalytics } from '@/components/CitationAnalytics';
import { useCitationMonitoring } from '@/hooks/useCitationMonitoring';

const Analytics = () => {
  const { citations, analytics, isLoading } = useCitationMonitoring();

  const analyticsMetrics = [
    { title: "Total Visitors", value: "0", icon: Users, color: "enterprise-blue" },
    { title: "Page Views", value: "0", icon: Eye, color: "pravado-orange" },
    { title: "Conversion Rate", value: "0%", icon: MousePointer, color: "pravado-purple" },
    { title: "AI Citations", value: citations.length.toString(), icon: Brain, color: "pravado-crimson" },
  ];

  return (
    <BaseLayout title="Analytics" breadcrumb="Analytics">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-professional-gray mb-2">Analytics</h1>
              <p className="text-gray-600">Track performance across all your marketing channels and AI platforms</p>
            </div>
            <div className="mt-4 lg:mt-0 flex space-x-3">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
              <Button>
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {analyticsMetrics.map((metric, index) => (
              <Card key={index} className="p-6 bg-white border border-border-gray hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`h-8 w-8 text-${metric.color}`} />
                  <div className={`text-2xl font-bold text-${metric.color}`}>
                    {metric.value}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-professional-gray">{metric.title}</h3>
              </Card>
            ))}
          </div>

          {/* Analytics Dashboard */}
          <Card className="bg-white border border-border-gray">
            <div className="p-6 border-b border-border-gray">
              <h2 className="text-xl font-semibold text-professional-gray">Performance Dashboard</h2>
            </div>
            <div className="p-6">
              <Tabs defaultValue="ai-citations" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="ai-citations">AI Citations</TabsTrigger>
                  <TabsTrigger value="citation-analytics">Citation Analytics</TabsTrigger>
                  <TabsTrigger value="traffic">Traffic</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  <TabsTrigger value="conversion">Conversion</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ai-citations" className="mt-6">
                  <CitationMonitoring />
                </TabsContent>
                
                <TabsContent value="citation-analytics" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-professional-gray">Citation Analytics</h3>
                    {citations.length > 0 ? (
                      <div className="grid gap-4">
                        {citations.slice(0, 5).map((citation, index) => (
                          <Card key={index} className="p-4 border border-border-gray">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-sm font-medium text-enterprise-blue capitalize">
                                    {citation.platform}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    citation.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                                    citation.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {citation.sentiment}
                                  </span>
                                </div>
                                <p className="text-sm text-professional-gray mb-2">
                                  <strong>Query:</strong> {citation.query}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {citation.mentions.length > 0 ? citation.mentions[0] : citation.response.substring(0, 150) + '...'}
                                </p>
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(citation.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Brain}
                        title="No citation data"
                        description="AI citation analytics will appear here once monitoring starts."
                      />
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="traffic" className="mt-6">
                  <EmptyState
                    icon={TrendingUp}
                    title="No traffic data"
                    description="Your website traffic analytics will appear here once connected."
                  />
                </TabsContent>
                <TabsContent value="content" className="mt-6">
                  <EmptyState
                    icon={Eye}
                    title="No content analytics"
                    description="Track how your content performs across different channels."
                  />
                </TabsContent>
                <TabsContent value="campaigns" className="mt-6">
                  <EmptyState
                    icon={TrendingUp}
                    title="No campaign data"
                    description="Monitor the performance of your marketing campaigns."
                  />
                </TabsContent>
                <TabsContent value="conversion" className="mt-6">
                  <EmptyState
                    icon={MousePointer}
                    title="No conversion data"
                    description="Track conversions and ROI from your marketing efforts."
                  />
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Analytics;
