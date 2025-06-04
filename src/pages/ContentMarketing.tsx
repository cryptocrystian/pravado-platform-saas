
import React, { useState } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Grid, List, TrendingUp, Eye, ThumbsUp } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';

const ContentMarketing = () => {
  const [viewMode, setViewMode] = useState('grid');

  const contentMetrics = [
    { title: "Published Content", value: "0", icon: TrendingUp, color: "enterprise-blue" },
    { title: "Total Views", value: "0", icon: Eye, color: "pravado-orange" },
    { title: "Engagement Rate", value: "0%", icon: ThumbsUp, color: "pravado-purple" },
  ];

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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {contentMetrics.map((metric, index) => (
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

          {/* Content Management */}
          <Card className="bg-white border border-border-gray">
            <div className="p-6 border-b border-border-gray">
              <div className="flex items-center justify-between">
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
            </div>
            <div className="p-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Content</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6">
                  <EmptyState
                    icon={Calendar}
                    title="No content yet"
                    description="Start creating compelling content to engage your audience and drive results."
                    actionLabel="Create First Content"
                    onAction={() => console.log('Create content')}
                  />
                </TabsContent>
                <TabsContent value="published" className="mt-6">
                  <EmptyState
                    icon={Calendar}
                    title="No published content"
                    description="Your published content will appear here once you start creating."
                  />
                </TabsContent>
                <TabsContent value="draft" className="mt-6">
                  <EmptyState
                    icon={Calendar}
                    title="No drafts"
                    description="Save your work in progress as drafts to continue later."
                  />
                </TabsContent>
                <TabsContent value="scheduled" className="mt-6">
                  <EmptyState
                    icon={Calendar}
                    title="No scheduled content"
                    description="Schedule your content to publish automatically at the perfect time."
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

export default ContentMarketing;
