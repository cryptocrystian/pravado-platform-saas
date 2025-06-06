
import React, { useState } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  FileText, 
  TrendingUp, 
  Target,
  Brain,
  CheckCircle,
  Calendar,
  BarChart3,
  Users,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';

const ContentMarketingEnhanced = () => {
  const [activeTab, setActiveTab] = useState('strategy');
  
  // Mock data for AUTOMATE-Content integration
  const contentAutomateSteps = [
    {
      code: 'U',
      name: 'Understand Audience',
      contentActivities: ['Audience Research', 'Persona Development', 'Content Audit'],
      progress: 88,
      status: 'completed',
      nextActions: ['Refine buyer personas', 'Update content themes']
    },
    {
      code: 'T',
      name: 'Target & Strategy',
      contentActivities: ['Content Strategy', 'Editorial Calendar', 'Goal Setting'],
      progress: 75,
      status: 'in_progress',
      nextActions: ['Finalize Q1 content calendar', 'Set content KPIs']
    },
    {
      code: 'O',
      name: 'Optimize Systems',
      contentActivities: ['Workflow Optimization', 'Tool Integration', 'Process Automation'],
      progress: 62,
      status: 'in_progress',
      nextActions: ['Implement content workflow', 'Setup automation tools']
    },
    {
      code: 'M',
      name: 'Measure & Monitor',
      contentActivities: ['Performance Tracking', 'Analytics Setup', 'ROI Measurement'],
      progress: 70,
      status: 'in_progress',
      nextActions: ['Setup advanced analytics', 'Create performance dashboard']
    },
    {
      code: 'T',
      name: 'Transform & Evolve',
      contentActivities: ['Content Optimization', 'Format Innovation', 'Channel Expansion'],
      progress: 45,
      status: 'in_progress',
      nextActions: ['Test new content formats', 'Optimize underperforming content']
    }
  ];

  const contentMetrics = [
    { 
      title: "Content Pieces", 
      value: "156", 
      icon: FileText, 
      color: "pravado-purple",
      change: "+23%",
      automateContribution: "Target & Strategy: +15%"
    },
    { 
      title: "Engagement Rate", 
      value: "4.8%", 
      icon: TrendingUp, 
      color: "enterprise-blue",
      change: "+12%",
      automateContribution: "Transform & Evolve: +8%"
    },
    { 
      title: "Content Score", 
      value: "87/100", 
      icon: Target, 
      color: "pravado-orange",
      change: "+5%",
      automateContribution: "Optimize Systems: +12%"
    },
    { 
      title: "Conversion Rate", 
      value: "3.2%", 
      icon: BarChart3, 
      color: "green-600",
      change: "+18%",
      automateContribution: "Measure & Monitor: +10%"
    }
  ];

  const contentRecommendations = [
    {
      title: "Complete Audience Persona Refinement",
      automateStep: "Understand Audience",
      priority: "High",
      impact: "+20% targeting accuracy",
      description: "Update buyer personas based on recent engagement data to improve content relevance",
      timeEstimate: "2-3 hours",
      contentPillarImpact: "Improves content strategy foundation"
    },
    {
      title: "Optimize Content Workflow",
      automateStep: "Optimize Systems",
      priority: "High",
      impact: "+30% efficiency",
      description: "Implement automated content approval and publishing workflow",
      timeEstimate: "4-6 hours",
      contentPillarImpact: "Reduces content production time"
    },
    {
      title: "Enhance Performance Tracking",
      automateStep: "Measure & Monitor",
      priority: "Medium",
      impact: "+15% insights",
      description: "Setup advanced content analytics and ROI tracking",
      timeEstimate: "3-4 hours",
      contentPillarImpact: "Better content performance visibility"
    }
  ];

  const contentCalendarMilestones = [
    {
      date: "2024-01-15",
      milestone: "Q1 Content Strategy Finalization",
      automateStep: "Target & Strategy",
      status: "completed",
      description: "Complete content themes and messaging framework"
    },
    {
      date: "2024-01-30",
      milestone: "Workflow Automation Setup",
      automateStep: "Optimize Systems", 
      status: "in_progress",
      description: "Implement content production and approval workflows"
    },
    {
      date: "2024-02-15",
      milestone: "Advanced Analytics Implementation",
      automateStep: "Measure & Monitor",
      status: "pending",
      description: "Setup comprehensive content performance tracking"
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
    <BaseLayout title="Content Marketing" breadcrumb="Content Marketing">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with AUTOMATE Integration */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-professional-gray mb-2">Content Marketing</h1>
              <p className="text-gray-600">AUTOMATE-powered content strategy and execution</p>
              <div className="flex items-center space-x-2 mt-2">
                <Brain className="w-4 h-4 text-pravado-purple" />
                <span className="text-sm text-pravado-purple font-medium">
                  Content AUTOMATE Integration: 68% Complete
                </span>
              </div>
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

          {/* Content AUTOMATE Progress */}
          <Card className="mb-8 bg-gradient-to-r from-pravado-purple/10 to-pravado-orange/10 border-l-4 border-l-pravado-purple">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-pravado-purple" />
                  <div>
                    <h3 className="text-lg font-semibold text-professional-gray">Content AUTOMATE Progress</h3>
                    <p className="text-sm text-gray-600">Systematic content marketing methodology</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-pravado-purple">68%</div>
                  <div className="text-sm text-gray-600">Content Integration</div>
                </div>
              </div>
              <Progress value={68} className="h-2 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {contentAutomateSteps.map((step) => (
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

          {/* Content Metrics with AUTOMATE Attribution */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {contentMetrics.map((metric, index) => (
              <Card key={index} className="bg-white border border-border-gray hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className={`h-8 w-8 text-${metric.color}`} />
                    <div className="text-right">
                      <div className={`text-2xl font-bold text-${metric.color}`}>
                        {metric.value}
                      </div>
                      <div className="text-sm font-medium text-green-600">{metric.change}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-professional-gray mb-2">{metric.title}</h3>
                  <div className="text-xs text-gray-600 bg-soft-gray rounded px-2 py-1">
                    {metric.automateContribution}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AUTOMATE-Guided Content Recommendations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-pravado-orange" />
                <span>AUTOMATE-Guided Content Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentRecommendations.map((rec, index) => (
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="bg-pravado-purple/10 text-pravado-purple px-3 py-1 rounded-full text-sm">
                      AUTOMATE: {rec.automateStep}
                    </div>
                    <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Time: {rec.timeEstimate}
                    </div>
                    <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm">
                      {rec.contentPillarImpact}
                    </div>
                  </div>
                  <Button size="sm">Implement</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Content Strategy with AUTOMATE Integration */}
          <Card className="bg-white border border-border-gray">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="strategy">Strategy</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="production">Production</TabsTrigger>
                  <TabsTrigger value="optimization">Optimization</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="strategy" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Content Strategy Development</h3>
                      <Badge className="bg-pravado-purple/10 text-pravado-purple">
                        AUTOMATE: Understand Audience + Target & Strategy
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="border">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-pravado-purple" />
                            <span>Audience Understanding</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Persona Development</span>
                              <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Content Audit</span>
                              <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Audience Research</span>
                              <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>
                            </div>
                            <Progress value={88} className="h-2 mt-3" />
                            <div className="text-sm text-gray-600">88% Complete</div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Target className="w-5 h-5 text-enterprise-blue" />
                            <span>Strategic Planning</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Content Themes</span>
                              <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Goal Setting</span>
                              <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">KPI Definition</span>
                              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                            </div>
                            <Progress value={75} className="h-2 mt-3" />
                            <div className="text-sm text-gray-600">75% Complete</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="calendar" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Content Calendar & Milestones</h3>
                      <Badge className="bg-enterprise-blue/10 text-enterprise-blue">
                        AUTOMATE: Target & Strategy Integration
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {contentCalendarMilestones.map((milestone, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <Calendar className="w-5 h-5 text-pravado-purple" />
                              <div>
                                <h4 className="font-semibold text-professional-gray">{milestone.milestone}</h4>
                                <p className="text-sm text-gray-600">{milestone.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge className={getStatusColor(milestone.status)}>
                                {milestone.status.replace('_', ' ')}
                              </Badge>
                              {getStatusIcon(milestone.status)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                          <div className="bg-pravado-purple/10 text-pravado-purple px-3 py-1 rounded-full text-sm inline-block">
                            AUTOMATE: {milestone.automateStep}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="production" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Content Production Workflow</h3>
                      <Badge className="bg-pravado-orange/10 text-pravado-orange">
                        AUTOMATE: Optimize Systems
                      </Badge>
                    </div>
                    <EmptyState
                      icon={FileText}
                      title="Production workflow optimization"
                      description="Implement systematic content production processes to advance the Optimize Systems AUTOMATE step."
                      actionLabel="Setup Workflow"
                      onAction={() => console.log('Setup workflow')}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="optimization" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Content Optimization</h3>
                      <Badge className="bg-pravado-purple/10 text-pravado-purple">
                        AUTOMATE: Transform & Evolve
                      </Badge>
                    </div>
                    <EmptyState
                      icon={TrendingUp}
                      title="Content optimization opportunities"
                      description="Analyze and optimize existing content to advance the Transform & Evolve AUTOMATE step."
                      actionLabel="Start Optimization"
                      onAction={() => console.log('Start optimization')}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Content Performance Analytics</h3>
                      <Badge className="bg-green-100 text-green-800">
                        AUTOMATE: Measure & Monitor
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border">
                        <CardHeader>
                          <CardTitle className="text-base">Performance Tracking</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-4">
                            <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Setup analytics to track content performance</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border">
                        <CardHeader>
                          <CardTitle className="text-base">ROI Measurement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-4">
                            <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Configure ROI tracking for content initiatives</p>
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

export default ContentMarketingEnhanced;
