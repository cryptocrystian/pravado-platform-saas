
import React from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target, TrendingUp, Search, BarChart3, Globe } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import AutomateStepGuidance from '@/components/AutomateStepGuidance';
import { useAutomateIntegration } from '@/hooks/useAutomateIntegration';
import { useUserProfile } from '@/hooks/useUserData';

const SEOIntelligence = () => {
  const { data: userProfile } = useUserProfile();
  
  // AUTOMATE methodology integration
  const automateIntegration = useAutomateIntegration({
    currentPage: 'seo-intelligence',
    enableAutoTracking: true,
    trackPageEvents: true
  });
  
  const seoMetrics = [
    { title: "Keywords Tracked", value: "0", icon: Target, color: "enterprise-blue" },
    { title: "Avg. Position", value: "-", icon: TrendingUp, color: "pravado-orange" },
    { title: "Organic Traffic", value: "0", icon: BarChart3, color: "pravado-purple" },
  ];

  return (
    <BaseLayout title="SEO Intelligence" breadcrumb="SEO Intelligence">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-professional-gray mb-2">SEO Intelligence</h1>
              <p className="text-gray-600">Monitor and optimize your search engine performance</p>
            </div>
            <div className="mt-4 lg:mt-0 flex space-x-3">
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Site Audit
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Keywords
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {seoMetrics.map((metric, index) => (
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

          {/* AUTOMATE Methodology Guidance */}
          {userProfile?.tenant_id && (
            <div className="mb-8">
              <AutomateStepGuidance
                tenantId={userProfile.tenant_id}
                currentPage="seo-intelligence"
                compact={true}
                onActionComplete={(actionId) => {
                  // Track SEO optimization actions
                  automateIntegration.trackPageInteraction('seo_optimization_completed', {
                    actionId,
                    seoType: 'keyword_research'
                  });
                }}
                className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200"
              />
            </div>
          )}

          {/* SEO Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Keyword Tracking */}
            <Card className="bg-white border border-border-gray">
              <div className="p-6 border-b border-border-gray">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-professional-gray">Keyword Tracking</h2>
                  <Button size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Add Keywords
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <EmptyState
                  icon={Target}
                  title="No keywords tracked"
                  description="Start tracking keywords to monitor your search engine rankings."
                  actionLabel="Add Keywords"
                  onAction={() => console.log('Add keywords')}
                />
              </div>
            </Card>

            {/* Site Health */}
            <Card className="bg-white border border-border-gray">
              <div className="p-6 border-b border-border-gray">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-professional-gray">Site Health</h2>
                  <Button size="sm">
                    <Globe className="h-4 w-4 mr-2" />
                    Run Audit
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <EmptyState
                  icon={Globe}
                  title="No audit data"
                  description="Run a comprehensive site audit to identify SEO opportunities."
                  actionLabel="Start Audit"
                  onAction={() => console.log('Start audit')}
                />
              </div>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Card className="bg-white border border-border-gray">
            <div className="p-6 border-b border-border-gray">
              <h2 className="text-xl font-semibold text-professional-gray">SEO Analytics</h2>
            </div>
            <div className="p-6">
              <Tabs defaultValue="keywords" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                  <TabsTrigger value="pages">Top Pages</TabsTrigger>
                  <TabsTrigger value="competitors">Competitors</TabsTrigger>
                  <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
                </TabsList>
                <TabsContent value="keywords" className="mt-6">
                  <EmptyState
                    icon={Search}
                    title="No keyword data"
                    description="Track your keyword performance and discover new opportunities."
                    actionLabel="Add Keywords"
                    onAction={() => console.log('Add keywords')}
                  />
                </TabsContent>
                <TabsContent value="pages" className="mt-6">
                  <EmptyState
                    icon={BarChart3}
                    title="No page data"
                    description="Analyze your top-performing pages and optimize for better results."
                  />
                </TabsContent>
                <TabsContent value="competitors" className="mt-6">
                  <EmptyState
                    icon={TrendingUp}
                    title="No competitor data"
                    description="Monitor your competitors' SEO strategies and find new opportunities."
                  />
                </TabsContent>
                <TabsContent value="backlinks" className="mt-6">
                  <EmptyState
                    icon={Globe}
                    title="No backlink data"
                    description="Track your backlink profile and build high-quality links."
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

export default SEOIntelligence;
