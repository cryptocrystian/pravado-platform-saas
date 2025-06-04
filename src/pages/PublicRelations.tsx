
import React from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, FileText, TrendingUp, Newspaper, Phone } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';

const PublicRelations = () => {
  const prMetrics = [
    { title: "Media Contacts", value: "0", icon: Users, accentColor: "#6f2dbd" }, // PRAVADO purple
    { title: "Press Releases", value: "0", icon: Newspaper, accentColor: "#1e40af" }, // Enterprise blue
    { title: "Active Campaigns", value: "0", icon: TrendingUp, accentColor: "#c3073f" }, // PRAVADO crimson
  ];

  return (
    <BaseLayout title="Public Relations" breadcrumb="Public Relations">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-professional-gray mb-2">Public Relations</h1>
              <p className="text-gray-600">Manage media relationships and PR campaigns</p>
            </div>
            <div className="mt-4 lg:mt-0 flex space-x-3">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {prMetrics.map((metric, index) => (
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

          {/* PR Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Media Contacts */}
            <Card className="bg-white border border-border-gray">
              <div className="p-6 border-b border-border-gray">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-professional-gray">Media Contacts</h2>
                  <Button size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <EmptyState
                  icon={Users}
                  title="No media contacts"
                  description="Build your media network by adding journalists and influencers."
                  actionLabel="Add First Contact"
                  onAction={() => console.log('Add contact')}
                />
              </div>
            </Card>

            {/* Press Releases */}
            <Card className="bg-white border border-border-gray">
              <div className="p-6 border-b border-border-gray">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-professional-gray">Press Releases</h2>
                  <Button size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Release
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <EmptyState
                  icon={Newspaper}
                  title="No press releases"
                  description="Share your news with the world through professional press releases."
                  actionLabel="Create Press Release"
                  onAction={() => console.log('Create press release')}
                />
              </div>
            </Card>
          </div>

          {/* Campaign Management */}
          <Card className="bg-white border border-border-gray mt-6">
            <div className="p-6 border-b border-border-gray">
              <h2 className="text-xl font-semibold text-professional-gray">PR Campaigns</h2>
            </div>
            <div className="p-6">
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="active">Active Campaigns</TabsTrigger>
                  <TabsTrigger value="planned">Planned</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="mt-6">
                  <EmptyState
                    icon={TrendingUp}
                    title="No active campaigns"
                    description="Launch PR campaigns to increase brand visibility and media coverage."
                    actionLabel="Start Campaign"
                    onAction={() => console.log('Start campaign')}
                  />
                </TabsContent>
                <TabsContent value="planned" className="mt-6">
                  <EmptyState
                    icon={TrendingUp}
                    title="No planned campaigns"
                    description="Plan your upcoming PR initiatives to stay ahead of the competition."
                  />
                </TabsContent>
                <TabsContent value="completed" className="mt-6">
                  <EmptyState
                    icon={TrendingUp}
                    title="No completed campaigns"
                    description="Your completed campaigns and their results will appear here."
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

export default PublicRelations;
