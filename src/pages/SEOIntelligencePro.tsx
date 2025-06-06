
import React, { useState } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Lightbulb,
  Eye,
  Settings,
  Users
} from 'lucide-react';
import { SEOProjectManagement } from '@/components/seo/SEOProjectManagement';
import { KeywordResearchDashboard } from '@/components/seo/KeywordResearchDashboard';
import { TechnicalSEOAudit } from '@/components/seo/TechnicalSEOAudit';
import { RankTrackingDashboard } from '@/components/seo/RankTrackingDashboard';
import { SEOContentOptimizer } from '@/components/seo/SEOContentOptimizer';
import { useSEOProjects, useSEOAudits, useKeywordTracking } from '@/hooks/useSEOData';
import { useAutomateProgress } from '@/hooks/useUserData';

const SEOIntelligencePro = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  const { data: projects = [] } = useSEOProjects();
  const { data: audits = [] } = useSEOAudits();
  const { data: tracking = [] } = useKeywordTracking();
  const { data: automateProgress = [] } = useAutomateProgress();

  // Calculate overall SEO metrics
  const totalKeywords = tracking.length;
  const avgPosition = tracking.length > 0 
    ? tracking.reduce((sum, t) => sum + (t.position || 0), 0) / tracking.length 
    : 0;
  const improvingKeywords = tracking.filter(t => 
    t.previous_position && t.position && t.position < t.previous_position
  ).length;
  const overallHealth = audits.length > 0 
    ? audits.reduce((sum, a) => sum + (a.overall_score || 0), 0) / audits.length 
    : 0;

  // AUTOMATE methodology progress for SEO
  const seoAutomateSteps = [
    { 
      code: 'A', 
      name: 'Assess & Audit', 
      progress: audits.length > 0 ? 85 : 0,
      activities: ['Technical SEO Audit', 'Site Health Analysis', 'Competitor Research'],
      status: audits.length > 0 ? 'completed' : 'pending'
    },
    { 
      code: 'T', 
      name: 'Target & Strategy', 
      progress: totalKeywords > 0 ? 75 : 0,
      activities: ['Keyword Research', 'Content Strategy', 'Target Setting'],
      status: totalKeywords > 0 ? 'in_progress' : 'pending'
    },
    { 
      code: 'O', 
      name: 'Optimize Systems', 
      progress: 60,
      activities: ['Technical Optimization', 'Page Speed', 'Mobile Optimization'],
      status: 'in_progress'
    },
    { 
      code: 'M', 
      name: 'Measure & Monitor', 
      progress: tracking.length > 0 ? 90 : 0,
      activities: ['Rank Tracking', 'Performance Monitoring', 'Analytics Setup'],
      status: tracking.length > 0 ? 'completed' : 'pending'
    },
    { 
      code: 'T', 
      name: 'Transform & Evolve', 
      progress: 45,
      activities: ['Content Optimization', 'Algorithm Adaptation', 'Strategy Refinement'],
      status: 'in_progress'
    }
  ];

  const overallSEOProgress = seoAutomateSteps.reduce((sum, step) => sum + step.progress, 0) / seoAutomateSteps.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Brain className="w-4 h-4 text-pravado-purple" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <BaseLayout title="SEO Intelligence Pro" breadcrumb="SEO Intelligence Pro">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with AUTOMATE Integration */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-professional-gray mb-2">SEO Intelligence Pro</h1>
              <p className="text-gray-600">Comprehensive SEO management with AUTOMATE methodology integration</p>
              <div className="flex items-center space-x-2 mt-2">
                <Brain className="w-4 h-4 text-pravado-purple" />
                <span className="text-sm text-pravado-purple font-medium">
                  SEO AUTOMATE Progress: {Math.round(overallSEOProgress)}% Complete
                </span>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 flex space-x-3">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                SEO Settings
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* SEO AUTOMATE Progress Dashboard */}
          <Card className="mb-8 bg-gradient-to-r from-pravado-purple/10 to-enterprise-blue/10 border-l-4 border-l-pravado-purple">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-pravado-purple" />
                  <div>
                    <h3 className="text-lg font-semibold text-professional-gray">SEO AUTOMATE Methodology</h3>
                    <p className="text-sm text-gray-600">Systematic SEO optimization framework</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-pravado-purple">{Math.round(overallSEOProgress)}%</div>
                  <div className="text-sm text-gray-600">Overall Progress</div>
                </div>
              </div>
              <Progress value={overallSEOProgress} className="h-2 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {seoAutomateSteps.map((step) => (
                  <div key={step.code} className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{step.code}</span>
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{step.name}</div>
                    <Progress value={step.progress} className="h-1 mb-2" />
                    <div className="text-xs text-gray-500">{step.progress}%</div>
                    <div className="mt-2 space-y-1">
                      {step.activities.slice(0, 2).map((activity, idx) => (
                        <div key={idx} className="text-xs text-gray-600">• {activity}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key SEO Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border border-border-gray hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-8 w-8 text-enterprise-blue" />
                  <div className="text-2xl font-bold text-enterprise-blue">{totalKeywords}</div>
                </div>
                <h3 className="text-lg font-semibold text-professional-gray mb-1">Keywords Tracked</h3>
                <div className="text-xs text-gray-600 bg-soft-gray rounded px-2 py-1">
                  AUTOMATE: Target & Strategy
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-border-gray hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-8 w-8 text-pravado-orange" />
                  <div className="text-2xl font-bold text-pravado-orange">{Math.round(avgPosition)}</div>
                </div>
                <h3 className="text-lg font-semibold text-professional-gray mb-1">Avg. Position</h3>
                <div className="text-xs text-gray-600 bg-soft-gray rounded px-2 py-1">
                  AUTOMATE: Measure & Monitor
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-border-gray hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="h-8 w-8 text-pravado-purple" />
                  <div className="text-2xl font-bold text-pravado-purple">{improvingKeywords}</div>
                </div>
                <h3 className="text-lg font-semibold text-professional-gray mb-1">Improving Keywords</h3>
                <div className="text-xs text-gray-600 bg-soft-gray rounded px-2 py-1">
                  AUTOMATE: Transform & Evolve
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-border-gray hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Globe className="h-8 w-8 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">{Math.round(overallHealth)}%</div>
                </div>
                <h3 className="text-lg font-semibold text-professional-gray mb-1">Site Health</h3>
                <div className="text-xs text-gray-600 bg-soft-gray rounded px-2 py-1">
                  AUTOMATE: Assess & Audit
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main SEO Intelligence Interface */}
          <Card className="bg-white border border-border-gray">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                  <TabsTrigger value="audit">Technical Audit</TabsTrigger>
                  <TabsTrigger value="tracking">Rank Tracking</TabsTrigger>
                  <TabsTrigger value="optimization">Content SEO</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Eye className="w-5 h-5 text-enterprise-blue" />
                          <span>SEO Projects Overview</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {projects.slice(0, 3).map((project) => (
                            <div key={project.id} className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                              <div>
                                <div className="font-medium">{project.name}</div>
                                <div className="text-sm text-gray-600">{project.domain}</div>
                              </div>
                              <Badge className={project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {project.status}
                              </Badge>
                            </div>
                          ))}
                          {projects.length === 0 && (
                            <div className="text-center py-4 text-gray-600">
                              No SEO projects yet. Create your first project to get started.
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Lightbulb className="w-5 h-5 text-pravado-orange" />
                          <span>AUTOMATE SEO Recommendations</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="font-medium text-blue-900">Complete Technical Audit</div>
                            <div className="text-sm text-blue-700">Advance your Assess & Audit step by running a comprehensive site audit</div>
                            <div className="text-xs text-blue-600 mt-1">AUTOMATE Impact: +15% methodology score</div>
                          </div>
                          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="font-medium text-purple-900">Expand Keyword Research</div>
                            <div className="text-sm text-purple-700">Enhance Target & Strategy with comprehensive keyword analysis</div>
                            <div className="text-xs text-purple-600 mt-1">AUTOMATE Impact: +12% strategy effectiveness</div>
                          </div>
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="font-medium text-green-900">Optimize Content SEO</div>
                            <div className="text-sm text-green-700">Progress Transform & Evolve through content optimization</div>
                            <div className="text-xs text-green-600 mt-1">AUTOMATE Impact: +18% content performance</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="mt-6">
                  <SEOProjectManagement 
                    projects={projects}
                    selectedProject={selectedProject}
                    onSelectProject={setSelectedProject}
                  />
                </TabsContent>

                <TabsContent value="keywords" className="mt-6">
                  <KeywordResearchDashboard 
                    projectId={selectedProject}
                    automateProgress={seoAutomateSteps.find(s => s.code === 'T')?.progress || 0}
                  />
                </TabsContent>

                <TabsContent value="audit" className="mt-6">
                  <TechnicalSEOAudit 
                    projectId={selectedProject}
                    automateProgress={seoAutomateSteps.find(s => s.code === 'A')?.progress || 0}
                  />
                </TabsContent>

                <TabsContent value="tracking" className="mt-6">
                  <RankTrackingDashboard 
                    projectId={selectedProject}
                    automateProgress={seoAutomateSteps.find(s => s.code === 'M')?.progress || 0}
                  />
                </TabsContent>

                <TabsContent value="optimization" className="mt-6">
                  <SEOContentOptimizer 
                    projectId={selectedProject}
                    automateProgress={seoAutomateSteps.find(s => s.code === 'T')?.progress || 0}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default SEOIntelligencePro;
