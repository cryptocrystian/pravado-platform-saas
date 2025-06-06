
import React, { useState } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Search, 
  BarChart3, 
  Globe, 
  Brain,
  CheckCircle,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';

const SEOIntelligenceEnhanced = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for AUTOMATE integration
  const automateSteps = [
    {
      code: 'A',
      name: 'Assess & Audit',
      seoActivities: ['Technical SEO Audit', 'Site Health Check', 'Competitor Analysis'],
      progress: 85,
      status: 'completed'
    },
    {
      code: 'T',
      name: 'Target & Strategy',
      seoActivities: ['Keyword Research', 'Content Strategy', 'Link Building Strategy'],
      progress: 72,
      status: 'in_progress'
    },
    {
      code: 'O',
      name: 'Optimize Systems',
      seoActivities: ['Technical Optimization', 'Page Speed', 'Mobile Optimization'],
      progress: 68,
      status: 'in_progress'
    },
    {
      code: 'M',
      name: 'Measure & Monitor',
      seoActivities: ['Rank Tracking', 'Analytics Setup', 'Performance Monitoring'],
      progress: 90,
      status: 'completed'
    },
    {
      code: 'T',
      name: 'Transform & Evolve',
      seoActivities: ['Content Optimization', 'Algorithm Adaptation', 'Strategy Refinement'],
      progress: 45,
      status: 'in_progress'
    }
  ];

  const seoMetrics = [
    { title: "Keywords Tracked", value: "247", icon: Target, color: "enterprise-blue", automateStep: "Measure & Monitor" },
    { title: "Avg. Position", value: "12.4", icon: TrendingUp, color: "pravado-orange", automateStep: "Transform & Evolve" },
    { title: "Organic Traffic", value: "15.2K", icon: BarChart3, color: "pravado-purple", automateStep: "Accelerate Growth" },
    { title: "Technical Score", value: "92%", icon: Globe, color: "green-600", automateStep: "Optimize Systems" },
  ];

  const seoRecommendations = [
    {
      title: "Complete Technical SEO Audit",
      automateStep: "Assess & Audit",
      priority: "High",
      impact: "+15% AUTOMATE score",
      description: "Comprehensive site audit to identify technical issues and optimization opportunities"
    },
    {
      title: "Optimize Core Web Vitals",
      automateStep: "Optimize Systems",
      priority: "High",
      impact: "+12% performance",
      description: "Improve page speed and user experience metrics for better rankings"
    },
    {
      title: "Expand Keyword Portfolio",
      automateStep: "Target & Strategy",
      priority: "Medium",
      impact: "+8% coverage",
      description: "Research and target new keyword opportunities in your niche"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Brain className="w-4 h-4 text-pravado-purple" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <BaseLayout title="SEO Intelligence" breadcrumb="SEO Intelligence">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with AUTOMATE Integration */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-professional-gray mb-2">SEO Intelligence</h1>
              <p className="text-gray-600">AUTOMATE-powered search engine optimization</p>
              <div className="flex items-center space-x-2 mt-2">
                <Brain className="w-4 h-4 text-pravado-purple" />
                <span className="text-sm text-pravado-purple font-medium">
                  Methodology Integration: 72% Complete
                </span>
              </div>
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

          {/* AUTOMATE Progress Banner */}
          <Card className="mb-8 bg-gradient-to-r from-pravado-purple/10 to-enterprise-blue/10 border-l-4 border-l-pravado-purple">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-pravado-purple" />
                  <div>
                    <h3 className="text-lg font-semibold text-professional-gray">SEO AUTOMATE Progress</h3>
                    <p className="text-sm text-gray-600">Your systematic SEO methodology advancement</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-pravado-purple">72%</div>
                  <div className="text-sm text-gray-600">Overall Progress</div>
                </div>
              </div>
              <Progress value={72} className="h-2 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {automateSteps.map((step) => (
                  <div key={step.code} className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{step.code}</span>
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{step.name}</div>
                    <Progress value={step.progress} className="h-1" />
                    <div className="text-xs text-gray-500 mt-1">{step.progress}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metrics with AUTOMATE Attribution */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {seoMetrics.map((metric, index) => (
              <Card key={index} className="bg-white border border-border-gray hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className={`h-8 w-8 text-${metric.color}`} />
                    <div className={`text-2xl font-bold text-${metric.color}`}>
                      {metric.value}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-professional-gray mb-1">{metric.title}</h3>
                  <div className="text-xs text-gray-600 bg-soft-gray rounded px-2 py-1">
                    AUTOMATE: {metric.automateStep}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AUTOMATE-Guided Recommendations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-pravado-orange" />
                <span>AUTOMATE-Guided SEO Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {seoRecommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-professional-gray">{rec.title}</h3>
                    <div className="flex items-center space-x-3">
                      <Badge className={rec.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                        {rec.priority}
                      </Badge>
                      <span className="text-sm font-medium text-green-600">{rec.impact}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="bg-pravado-purple/10 text-pravado-purple px-3 py-1 rounded-full text-sm">
                      AUTOMATE: {rec.automateStep}
                    </div>
                    <Button size="sm">Implement</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Enhanced SEO Tools with AUTOMATE Integration */}
          <Card className="bg-white border border-border-gray">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="w-5 h-5 text-enterprise-blue" />
                          <span>Keyword Performance</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <EmptyState
                          icon={Target}
                          title="Start tracking keywords"
                          description="Begin monitoring your search rankings to advance the Measure & Monitor AUTOMATE step."
                          actionLabel="Add Keywords"
                          onAction={() => setActiveTab('keywords')}
                        />
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Globe className="w-5 h-5 text-pravado-purple" />
                          <span>Technical Health</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <EmptyState
                          icon={Globe}
                          title="Run technical audit"
                          description="Complete your site audit to progress the Assess & Audit AUTOMATE step."
                          actionLabel="Start Audit"
                          onAction={() => setActiveTab('technical')}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="keywords" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Keyword Research & Tracking</h3>
                      <Badge className="bg-pravado-purple/10 text-pravado-purple">
                        AUTOMATE: Target & Strategy + Measure & Monitor
                      </Badge>
                    </div>
                    <EmptyState
                      icon={Search}
                      title="No keywords tracked yet"
                      description="Start your keyword research to advance both Target & Strategy and Measure & Monitor AUTOMATE steps."
                      actionLabel="Research Keywords"
                      onAction={() => console.log('Research keywords')}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Technical SEO Optimization</h3>
                      <Badge className="bg-enterprise-blue/10 text-enterprise-blue">
                        AUTOMATE: Assess & Audit + Optimize Systems
                      </Badge>
                    </div>
                    <EmptyState
                      icon={Globe}
                      title="Technical audit needed"
                      description="Run a comprehensive technical audit to identify optimization opportunities and advance your AUTOMATE methodology."
                      actionLabel="Start Technical Audit"
                      onAction={() => console.log('Start audit')}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="content" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Content Optimization</h3>
                      <Badge className="bg-pravado-orange/10 text-pravado-orange">
                        AUTOMATE: Transform & Evolve
                      </Badge>
                    </div>
                    <EmptyState
                      icon={FileText}
                      title="Content optimization opportunities"
                      description="Optimize your content for search engines to advance the Transform & Evolve AUTOMATE step."
                      actionLabel="Analyze Content"
                      onAction={() => console.log('Analyze content')}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="monitoring" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Performance Monitoring</h3>
                      <Badge className="bg-green-100 text-green-800">
                        AUTOMATE: Measure & Monitor
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border">
                        <CardHeader>
                          <CardTitle className="text-base">Rank Tracking</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-4">
                            <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">No ranking data available</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border">
                        <CardHeader>
                          <CardTitle className="text-base">Traffic Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-4">
                            <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Connect analytics to start tracking</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default SEOIntelligenceEnhanced;
