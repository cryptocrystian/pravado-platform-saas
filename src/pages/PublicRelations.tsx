
import React, { useState } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HARODashboard } from '@/components/HARO/HARODashboard';
import { Plus, Users, FileText, TrendingUp, Newspaper, Phone, Brain, Target, Sparkles, Send } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { usePressReleases, useMediaOutlets } from '@/hooks/usePressReleases';
import { useJournalistContacts } from '@/hooks/useJournalists';
import { useHAROMatches, useHARORequests } from '@/hooks/useHARO';

const PublicRelations = () => {
  const [activeTab, setActiveTab] = useState('haro');
  
  const { data: pressReleases } = usePressReleases();
  const { data: mediaOutlets } = useMediaOutlets();
  const { data: journalistContacts } = useJournalistContacts();
  const { data: haroMatches } = useHAROMatches();
  const { data: haroRequests } = useHARORequests();

  const prMetrics = [
    { 
      title: "HARO Matches", 
      value: haroMatches?.length?.toString() || "0", 
      icon: Brain, 
      accentColor: "#6f2dbd",
      description: "AI-powered opportunities"
    },
    { 
      title: "Press Releases", 
      value: pressReleases?.length?.toString() || "0", 
      icon: Newspaper, 
      accentColor: "#1e40af",
      description: "Created and distributed"
    },
    { 
      title: "Media Contacts", 
      value: journalistContacts?.length?.toString() || "0", 
      icon: Users, 
      accentColor: "#c3073f",
      description: "Journalist relationships"
    },
    { 
      title: "Coverage Secured", 
      value: haroMatches?.filter(match => match.coverage_secured)?.length?.toString() || "0", 
      icon: TrendingUp, 
      accentColor: "#059669",
      description: "Successful placements"
    },
  ];

  return (
    <BaseLayout title="Public Relations" breadcrumb="Public Relations">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-professional-gray mb-2">Public Relations</h1>
              <p className="text-gray-600">AI-powered PR management with HARO intelligence and media distribution</p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-3">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {prMetrics.map((metric, index) => (
              <Card key={index} className="p-6 bg-white border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: metric.accentColor }}>
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="h-8 w-8 text-professional-gray" />
                  <div className="text-2xl font-bold text-professional-gray">
                    {metric.value}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-professional-gray">{metric.title}</h3>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </Card>
            ))}
          </div>

          {/* PR Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="haro" className="flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                HARO Intelligence
              </TabsTrigger>
              <TabsTrigger value="press-releases" className="flex items-center">
                <Newspaper className="h-4 w-4 mr-2" />
                Press Releases
              </TabsTrigger>
              <TabsTrigger value="media-contacts" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Media Contacts
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="haro" className="mt-6">
              <HARODashboard />
            </TabsContent>

            <TabsContent value="press-releases" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Press Release Management */}
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
                      description="Create and distribute professional press releases to 400+ media outlets."
                      actionLabel="Create Press Release"
                      onAction={() => console.log('Create press release')}
                    />
                  </div>
                </Card>

                {/* Media Distribution Network */}
                <Card className="bg-white border border-border-gray">
                  <div className="p-6 border-b border-border-gray">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-professional-gray">Distribution Network</h2>
                      <Button size="sm" variant="outline">
                        <Target className="h-4 w-4 mr-2" />
                        View All Outlets
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    {mediaOutlets && mediaOutlets.length > 0 ? (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600 mb-4">
                          Connected to {mediaOutlets.length} premium media outlets
                        </div>
                        {mediaOutlets.slice(0, 5).map((outlet) => (
                          <div key={outlet.id} className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                            <div>
                              <div className="font-medium text-sm">{outlet.name}</div>
                              <div className="text-xs text-gray-500">{outlet.category} • DA {outlet.domain_authority}</div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {outlet.circulation?.toLocaleString()} reach
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full">
                          View All {mediaOutlets.length} Outlets
                        </Button>
                      </div>
                    ) : (
                      <EmptyState
                        icon={Target}
                        title="Premium outlets ready"
                        description="Access 400+ premium media outlets for instant distribution."
                        actionLabel="View Distribution Network"
                        onAction={() => console.log('View outlets')}
                      />
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="media-contacts" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Journalist Database */}
                <Card className="bg-white border border-border-gray">
                  <div className="p-6 border-b border-border-gray">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-professional-gray">Journalist Database</h2>
                      <Button size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Add Contact
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    {journalistContacts && journalistContacts.length > 0 ? (
                      <div className="space-y-3">
                        {journalistContacts.slice(0, 3).map((contact) => (
                          <div key={contact.id} className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                            <div>
                              <div className="font-medium text-sm">{contact.first_name} {contact.last_name}</div>
                              <div className="text-xs text-gray-500">{contact.outlet} • {contact.beat}</div>
                            </div>
                            <div className="text-xs text-gray-500">
                              Score: {contact.relationship_score}/100
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full">
                          View All Contacts
                        </Button>
                      </div>
                    ) : (
                      <EmptyState
                        icon={Users}
                        title="No media contacts"
                        description="Build your media network by adding journalists and influencers."
                        actionLabel="Add First Contact"
                        onAction={() => console.log('Add contact')}
                      />
                    )}
                  </div>
                </Card>

                {/* Media Outreach */}
                <Card className="bg-white border border-border-gray">
                  <div className="p-6 border-b border-border-gray">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-professional-gray">Media Outreach</h2>
                      <Button size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        New Campaign
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <EmptyState
                      icon={Send}
                      title="No outreach campaigns"
                      description="Create personalized media pitches with AI assistance."
                      actionLabel="Start Outreach"
                      onAction={() => console.log('Start outreach')}
                    />
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Analytics */}
                <Card className="bg-white border border-border-gray">
                  <div className="p-6 border-b border-border-gray">
                    <h2 className="text-xl font-semibold text-professional-gray">PR Performance</h2>
                  </div>
                  <div className="p-6">
                    <EmptyState
                      icon={TrendingUp}
                      title="Analytics coming soon"
                      description="Track your PR success with comprehensive analytics and insights."
                    />
                  </div>
                </Card>

                {/* Competitive Intelligence */}
                <Card className="bg-white border border-border-gray">
                  <div className="p-6 border-b border-border-gray">
                    <h2 className="text-xl font-semibold text-professional-gray">Competitive Intelligence</h2>
                  </div>
                  <div className="p-6">
                    <EmptyState
                      icon={Sparkles}
                      title="Intelligence dashboard"
                      description="Monitor competitor PR activities and industry trends."
                    />
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BaseLayout>
  );
};

export default PublicRelations;
