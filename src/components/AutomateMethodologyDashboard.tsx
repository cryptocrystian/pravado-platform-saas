import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Target,
  Users,
  Brain,
  BarChart3,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  Clock,
  AlertTriangle,
  PlayCircle,
  Award,
  Zap,
  BookOpen,
  ArrowRight,
  Calendar,
  Timer,
  Star,
  TrendingDown,
  Eye,
  Activity,
  FileText,
  Megaphone,
  Search,
  Building,
  ChevronRight,
  Info,
  Flag,
  Settings
} from 'lucide-react';
import { 
  automateMethodologyService, 
  AutomateMethodologyCampaign,
  AutomateStepProgress, 
  AutomateGuidedAction,
  AutomateMethodologyInsight,
  AutomateMethodologyAnalytics,
  AUTOMATE_STEPS
} from '@/services/automateMethodologyService';
import AutomateGuidedWorkflow from './AutomateGuidedWorkflow';

interface AutomateMethodologyDashboardProps {
  tenantId: string;
  campaignId?: string;
  onStepComplete?: (stepCode: string) => void;
  onMethodologyComplete?: () => void;
}

const AutomateMethodologyDashboard: React.FC<AutomateMethodologyDashboardProps> = ({
  tenantId,
  campaignId,
  onStepComplete,
  onMethodologyComplete
}) => {
  const [methodology, setMethodology] = useState<AutomateMethodologyCampaign | null>(null);
  const [steps, setSteps] = useState<AutomateStepProgress[]>([]);
  const [currentStep, setCurrentStep] = useState<AutomateStepProgress | null>(null);
  const [insights, setInsights] = useState<AutomateMethodologyInsight[]>([]);
  const [analytics, setAnalytics] = useState<AutomateMethodologyAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (tenantId) {
      loadDashboardData();
    }
  }, [tenantId, campaignId]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load all methodology data
      const [progressData] = await Promise.all([
        automateMethodologyService.getMethodologyProgress(tenantId, campaignId)
      ]);
      
      setMethodology(progressData.methodology);
      setSteps(progressData.steps);
      setCurrentStep(progressData.nextRecommendedStep);

      // Load insights and analytics if methodology exists
      if (progressData.methodology) {
        const [insightsData, analyticsData] = await Promise.all([
          automateMethodologyService.getMethodologyInsights(progressData.methodology.id!),
          automateMethodologyService.createAnalyticsSnapshot(
            progressData.methodology.id!,
            tenantId,
            'daily'
          )
        ]);
        
        setInsights(insightsData);
        setAnalytics(analyticsData);
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeMethodology = async () => {
    try {
      setIsLoading(true);
      await automateMethodologyService.initializeMethodology(tenantId, {
        campaignId,
        templateType: 'default'
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to initialize methodology:', error);
    }
  };

  const generateInsights = async () => {
    if (!methodology?.id) return;
    
    try {
      const newInsights = await automateMethodologyService.generateMethodologyInsights(
        methodology.id,
        tenantId
      );
      setInsights(prev => [...newInsights, ...prev]);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    }
  };

  const getStepIcon = (stepCode: string) => {
    const iconMap: Record<string, any> = {
      'A': Target,
      'U': Users,
      'T': Brain,
      'O': BarChart3,
      'M': TrendingUp,
      'E': Lightbulb
    };
    return iconMap[stepCode] || Target;
  };

  const getStepColor = (stepCode: string) => {
    const colorMap: Record<string, string> = {
      'A': 'text-red-600 bg-red-100 border-red-500',
      'U': 'text-blue-600 bg-blue-100 border-blue-500',
      'T': 'text-green-600 bg-green-100 border-green-500',
      'O': 'text-yellow-600 bg-yellow-100 border-yellow-500',
      'M': 'text-purple-600 bg-purple-100 border-purple-500',
      'E': 'text-indigo-600 bg-indigo-100 border-indigo-500'
    };
    return colorMap[stepCode] || 'text-gray-600 bg-gray-100 border-gray-500';
  };

  const getInsightIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      'progress_alert': AlertTriangle,
      'optimization_tip': Lightbulb,
      'best_practice': Award,
      'risk_warning': AlertTriangle
    };
    return iconMap[type] || Info;
  };

  const getInsightColor = (severity: string) => {
    const colorMap: Record<string, string> = {
      'low': 'bg-green-50 border-green-200 text-green-800',
      'medium': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'high': 'bg-orange-50 border-orange-200 text-orange-800',
      'critical': 'bg-red-50 border-red-200 text-red-800'
    };
    return colorMap[severity] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!methodology) {
    return (
      <div className="text-center py-12">
        <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AUTOMATE Methodology</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Initialize the AUTOMATE methodology to get step-by-step guidance for integrated marketing excellence
        </p>
        <Button onClick={initializeMethodology} className="bg-enterprise-blue">
          <Zap className="h-4 w-4 mr-2" />
          Initialize AUTOMATE Methodology
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Methodology Header */}
      <Card className="bg-gradient-to-r from-enterprise-blue via-pravado-purple to-pravado-orange text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">AUTOMATE Methodology</h1>
              <p className="text-blue-100">Systematic approach to integrated marketing excellence</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{methodology.overall_completion_percentage}%</div>
              <p className="text-blue-200">Complete</p>
            </div>
          </div>
          
          <Progress value={methodology.overall_completion_percentage} className="h-4 bg-blue-800 mb-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{steps.filter(s => s.status === 'completed').length}</div>
              <div className="text-blue-200">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{steps.filter(s => s.status === 'in_progress').length}</div>
              <div className="text-blue-200">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{steps.filter(s => s.status === 'pending').length}</div>
              <div className="text-blue-200">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics?.velocity_score || 0}</div>
              <div className="text-blue-200">Velocity Score</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Current Focus */}
      {currentStep && (
        <Alert className="border-enterprise-blue bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {React.createElement(getStepIcon(currentStep.step_code), { 
                  className: "h-5 w-5 text-enterprise-blue" 
                })}
                <div>
                  <span className="font-semibold">Current Focus: {currentStep.step_name}</span>
                  <p className="text-sm text-gray-600 mt-1">{currentStep.step_description}</p>
                </div>
              </div>
              <Badge className="bg-enterprise-blue text-white">
                Step {currentStep.step_code}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-enterprise-blue/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-enterprise-blue" />
            </div>
            <div>
              <div className="text-2xl font-bold">{analytics?.velocity_score || 0}</div>
              <div className="text-sm text-gray-600">Velocity Score</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{analytics?.quality_score || 0}</div>
              <div className="text-sm text-gray-600">Quality Score</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{analytics?.adherence_score || 0}</div>
              <div className="text-sm text-gray-600">Adherence Score</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{analytics?.team_engagement_score || 0}</div>
              <div className="text-sm text-gray-600">Team Engagement</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflow">Guided Workflow</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Pillar Integration */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Pillar Integration Overview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4 border-l-4 border-l-pravado-purple">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="h-6 w-6 text-pravado-purple" />
                    <h4 className="font-semibold">Content Marketing</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-pravado-purple">
                      {Math.round(steps.reduce((avg, step) => avg + step.content_pillar_weight, 0) / steps.length)}%
                    </div>
                    <p className="text-sm text-gray-600">Average Integration</p>
                    <Progress 
                      value={steps.reduce((avg, step) => avg + step.content_pillar_weight, 0) / steps.length} 
                      className="h-2"
                    />
                  </div>
                </Card>
                
                <Card className="p-4 border-l-4 border-l-pravado-orange">
                  <div className="flex items-center space-x-3 mb-3">
                    <Megaphone className="h-6 w-6 text-pravado-orange" />
                    <h4 className="font-semibold">Public Relations</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-pravado-orange">
                      {Math.round(steps.reduce((avg, step) => avg + step.pr_pillar_weight, 0) / steps.length)}%
                    </div>
                    <p className="text-sm text-gray-600">Average Integration</p>
                    <Progress 
                      value={steps.reduce((avg, step) => avg + step.pr_pillar_weight, 0) / steps.length} 
                      className="h-2"
                    />
                  </div>
                </Card>
                
                <Card className="p-4 border-l-4 border-l-enterprise-blue">
                  <div className="flex items-center space-x-3 mb-3">
                    <Search className="h-6 w-6 text-enterprise-blue" />
                    <h4 className="font-semibold">SEO Intelligence</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-enterprise-blue">
                      {Math.round(steps.reduce((avg, step) => avg + step.seo_pillar_weight, 0) / steps.length)}%
                    </div>
                    <p className="text-sm text-gray-600">Average Integration</p>
                    <Progress 
                      value={steps.reduce((avg, step) => avg + step.seo_pillar_weight, 0) / steps.length} 
                      className="h-2"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          {/* Step Status Grid */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">AUTOMATE Steps Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {steps.map((step, index) => {
                  const StepIcon = getStepIcon(step.step_code);
                  const stepColor = getStepColor(step.step_code);
                  
                  return (
                    <Card key={step.id} className={`p-4 border-l-4 ${stepColor.split(' ')[2]}`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`p-1.5 rounded ${stepColor.split(' ')[1]}`}>
                          <StepIcon className={`h-4 w-4 ${stepColor.split(' ')[0]}`} />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {step.step_code}
                        </Badge>
                      </div>
                      
                      <h4 className="font-semibold text-sm mb-2">{step.step_name}</h4>
                      
                      <div className="space-y-2">
                        <Progress value={step.completion_percentage} className="h-2" />
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">{step.completion_percentage}%</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              step.status === 'completed' ? 'bg-green-100 text-green-800' :
                              step.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              step.status === 'blocked' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {step.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Guided Workflow Tab */}
        <TabsContent value="workflow">
          <AutomateGuidedWorkflow
            tenantId={tenantId}
            campaignId={campaignId}
            onStepComplete={onStepComplete}
            onMethodologyComplete={onMethodologyComplete}
          />
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
            <Button onClick={generateInsights} variant="outline">
              <Brain className="h-4 w-4 mr-2" />
              Generate New Insights
            </Button>
          </div>

          {insights.length === 0 ? (
            <Card className="p-8 text-center">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
              <p className="text-gray-600 mb-4">AI insights will appear here as you progress through the methodology</p>
              <Button onClick={generateInsights}>
                <Zap className="h-4 w-4 mr-2" />
                Generate Insights
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => {
                const InsightIcon = getInsightIcon(insight.insight_type);
                const insightColor = getInsightColor(insight.severity);
                
                return (
                  <Card key={insight.id} className={`p-4 border-l-4 ${insightColor}`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <InsightIcon className="h-5 w-5 mt-0.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {insight.severity}
                          </Badge>
                          {insight.related_step_code && (
                            <Badge variant="outline" className="text-xs">
                              Step {insight.related_step_code}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                        
                        {insight.recommended_actions && insight.recommended_actions.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                              Recommended Actions:
                            </h5>
                            <ul className="space-y-1">
                              {insight.recommended_actions.slice(0, 3).map((action: any, index: number) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start">
                                  <ArrowRight className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                                  {typeof action === 'string' ? action : action.action || action.title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>Confidence: {insight.confidence_score}%</span>
                            {insight.implementation_difficulty && (
                              <Badge variant="outline" className="text-xs">
                                {insight.implementation_difficulty} difficulty
                              </Badge>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              insight.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              insight.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                              insight.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {insight.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Velocity Score</span>
                  <span className="text-xl font-bold">{analytics?.velocity_score || 0}</span>
                </div>
                <Progress value={analytics?.velocity_score || 0} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quality Score</span>
                  <span className="text-xl font-bold">{analytics?.quality_score || 0}</span>
                </div>
                <Progress value={analytics?.quality_score || 0} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Adherence Score</span>
                  <span className="text-xl font-bold">{analytics?.adherence_score || 0}</span>
                </div>
                <Progress value={analytics?.adherence_score || 0} className="h-2" />
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Step Completion Data</h3>
              <div className="space-y-3">
                {Object.entries(analytics?.step_completion_data || {}).map(([stepCode, data]: [string, any]) => (
                  <div key={stepCode} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {React.createElement(getStepIcon(stepCode), { className: "h-4 w-4" })}
                      <span className="text-sm">Step {stepCode}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={data.completion_percentage} className="w-16 h-2" />
                      <span className="text-sm">{data.completion_percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Business Impact */}
          {analytics?.business_metrics && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Business Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {analytics.business_metrics.steps_on_track || 0}
                  </div>
                  <div className="text-sm text-gray-600">Steps On Track</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {analytics.business_metrics.critical_path_items || 0}
                  </div>
                  <div className="text-sm text-gray-600">Critical Path Items</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-purple-600">
                    {analytics.business_metrics.estimated_completion_date ? 
                      new Date(analytics.business_metrics.estimated_completion_date).toLocaleDateString() : 
                      'TBD'
                    }
                  </div>
                  <div className="text-sm text-gray-600">Est. Completion</div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Progress Timeline</h3>
            
            <div className="space-y-6">
              {steps.map((step, index) => {
                const StepIcon = getStepIcon(step.step_code);
                const isCompleted = step.status === 'completed';
                const isInProgress = step.status === 'in_progress';
                const isCurrent = step.id === currentStep?.id;
                
                return (
                  <div key={step.id} className="relative">
                    {/* Timeline line */}
                    {index < steps.length - 1 && (
                      <div className={`absolute left-4 top-8 w-0.5 h-16 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isInProgress ? 'bg-blue-500 text-white' :
                        isCurrent ? 'bg-yellow-500 text-white' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <StepIcon className="h-4 w-4" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{step.step_name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {step.step_code}
                          </Badge>
                          {isCurrent && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{step.step_description}</p>
                        
                        <div className="flex items-center space-x-4">
                          <Progress value={step.completion_percentage} className="w-32 h-2" />
                          <span className="text-sm text-gray-600">{step.completion_percentage}%</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              step.status === 'completed' ? 'bg-green-100 text-green-800' :
                              step.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              step.status === 'blocked' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {step.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        {step.started_at && (
                          <div className="text-xs text-gray-500 mt-1">
                            Started: {new Date(step.started_at).toLocaleDateString()}
                            {step.completed_at && (
                              <span> • Completed: {new Date(step.completed_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomateMethodologyDashboard;