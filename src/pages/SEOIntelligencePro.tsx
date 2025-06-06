
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
  Users,
  Zap
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

  // Calculate overall SEO metrics with proper type checking
  const totalKeywords = tracking.length;
  const avgPosition = tracking.length > 0 
    ? tracking.reduce((sum, t) => sum + (t.position || 0), 0) / tracking.length 
    : 0;
  const improvingKeywords = tracking.filter((t) => 
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
      code: 'U', 
      name: 'Understand Audience', 
      progress: 65,
      activities: ['User Intent Analysis', 'Search Behavior Study', 'Audience Segmentation'],
      status: 'in_progress'
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
      code: 'A', 
      name: 'Accelerate Growth', 
      progress: 55,
      activities: ['Content Scaling', 'Link Building', 'Authority Building'],
      status: 'in_progress'
    },
    { 
      code: 'T', 
      name: 'Transform & Evolve', 
      progress: 45,
      activities: ['Content Optimization', 'Algorithm Adaptation', 'Strategy Refinement'],
      status: 'in_progress'
    },
    { 
      code: 'E', 
      name: 'Execute Excellence', 
      progress: 40,
      activities: ['Process Automation', 'Quality Assurance', 'Performance Excellence'],
      status: 'in_progress'
    }
  ];

  const overallSEOProgress = seoAutomateSteps.reduce((sum, step) => sum + step.progress, 0) / seoAutomateSteps.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Brain className="w-4 h-4 text-purple-600" />;
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Intelligence Pro</h1>
              <p className="text-gray-600">Comprehensive SEO management with AUTOMATE methodology integration</p>
              <div className="flex items-center space-x-2 mt-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-600 font-medium">
                  SEO AUTOMATE Progress: {Math.round(overallSEOProgress)}% Complete
                </span>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 flex space-x-3">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                SEO Settings
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* SEO AUTOMATE Progress Dashboard */}
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-l-purple-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">SEO AUTOMATE Methodology</h3>
                    <p className="text-sm text-gray-600">Systematic SEO optimization framework</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(overallSEOProgress)}%</div>
                  <div className="text-sm text-gray-600">Overall Progress</div>
                </div>
              </div>
              <Progress value={overallSEOProgress} className="h-2 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {seoAutomateSteps.map((step, index) => (
                  <div key={`${step.code}-${step.name}-${index}`} className="bg-white rounded-lg p-3 border">
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
            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{totalKeywords}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Keywords Tracked</h3>
                <div className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">
                  AUTOMATE: Target & Strategy
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-600">{Math.round(avgPosition) || '-'}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Avg. Position</h3>
                <div className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">
                  AUTOMATE: Measure & Monitor
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">{improvingKeywords}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Improving Keywords</h3>
                <div className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">
                  AUTOMATE: Transform & Evolve
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Globe className="h-8 w-8 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">{Math.round(overallHealth) || '-'}%</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Site Health</h3>
                <div className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">
                  AUTOMATE: Assess & Audit
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main SEO Intelligence Interface */}
          <Card className="bg-white border border-gray-200">
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

                  {/* Cross-Pillar Integration */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-professional-gray mb-4">Three-Pillar Integration Impact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="border-enterprise-blue border-2">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-enterprise-blue flex items-center space-x-2">
                            <Search className="w-5 h-5" />
                            <span>SEO → Content</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div>• 23 content pieces optimized for SEO</div>
                            <div>• 15% increase in organic reach</div>
                            <div>• 8 high-value keywords integrated</div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-pravado-orange border-2">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-pravado-orange flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>SEO → PR</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div>• 5 PR campaigns with SEO targeting</div>
                            <div>• 32% boost in brand visibility</div>
                            <div>• 12 high-authority backlinks earned</div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-pravado-purple border-2">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-pravado-purple flex items-center space-x-2">
                            <Zap className="w-5 h-5" />
                            <span>Cross-Pillar Synergy</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div>• 87% AUTOMATE methodology completion</div>
                            <div>• 45% overall marketing efficiency gain</div>
                            <div>• 28% improvement in lead quality</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
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
                    automateProgress={seoAutomateSteps.find(s => s.code === 'T' && s.name === 'Transform & Evolve')?.progress || 0}
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
