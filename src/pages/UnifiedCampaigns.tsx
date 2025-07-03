import React, { useState } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3, 
  Lightbulb, 
  Zap, 
  ArrowRight,
  Calendar,
  DollarSign,
  Eye,
  MousePointer,
  Share2,
  MessageSquare,
  Newspaper,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  PieChart,
  LineChart,
  Settings,
  RefreshCw,
  Brain,
  Filter,
  Download
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { 
  useUnifiedCampaigns, 
  useCreateUnifiedCampaign,
  useCampaignAnalyticsDashboard,
  useGenerateCampaignInsights,
  useOptimizePillars,
  useSyncCrossPillarData,
  usePredictCampaignPerformance
} from '@/hooks/useUnifiedCampaigns';
import { useToast } from '@/hooks/use-toast';

const UnifiedCampaigns = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    campaign_type: 'integrated' as 'content' | 'pr' | 'seo' | 'integrated',
    start_date: '',
    end_date: '',
    budget: 0,
    primary_goal: '',
    target_keywords: '',
    target_outlets: '',
    content_themes: '',
    pillars: [
      { type: 'content' as const, weight: 33.33, budget: 0 },
      { type: 'pr' as const, weight: 33.33, budget: 0 },
      { type: 'seo' as const, weight: 33.34, budget: 0 }
    ]
  });

  const { toast } = useToast();
  
  // Data hooks
  const { data: campaigns, isLoading } = useUnifiedCampaigns();
  const createCampaignMutation = useCreateUnifiedCampaign();
  const generateInsightsMutation = useGenerateCampaignInsights();
  const optimizePillarsMutation = useOptimizePillars();
  const syncDataMutation = useSyncCrossPillarData();
  const predictPerformanceMutation = usePredictCampaignPerformance();
  
  // Dashboard data for selected campaign
  const dashboardData = useCampaignAnalyticsDashboard(selectedCampaign || '');

  const handleCreateCampaign = async () => {
    if (!newCampaign.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a campaign name",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCampaignMutation.mutateAsync({
        name: newCampaign.name,
        description: newCampaign.description,
        campaign_type: newCampaign.campaign_type,
        start_date: newCampaign.start_date || undefined,
        end_date: newCampaign.end_date || undefined,
        budget: newCampaign.budget || undefined,
        primary_goal: newCampaign.primary_goal || undefined,
        target_keywords: newCampaign.target_keywords ? newCampaign.target_keywords.split(',').map(k => k.trim()) : undefined,
        target_outlets: newCampaign.target_outlets ? newCampaign.target_outlets.split(',').map(o => o.trim()) : undefined,
        content_themes: newCampaign.content_themes ? newCampaign.content_themes.split(',').map(t => t.trim()) : undefined,
        pillars: newCampaign.pillars
      });
      
      setCreateCampaignOpen(false);
      setNewCampaign({
        name: '',
        description: '',
        campaign_type: 'integrated',
        start_date: '',
        end_date: '',
        budget: 0,
        primary_goal: '',
        target_keywords: '',
        target_outlets: '',
        content_themes: '',
        pillars: [
          { type: 'content', weight: 33.33, budget: 0 },
          { type: 'pr', weight: 33.33, budget: 0 },
          { type: 'seo', weight: 33.34, budget: 0 }
        ]
      });
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const updatePillarWeight = (index: number, weight: number) => {
    const updatedPillars = [...newCampaign.pillars];
    updatedPillars[index].weight = weight;
    setNewCampaign({ ...newCampaign, pillars: updatedPillars });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (isLoading) {
    return (
      <BaseLayout title="Unified Campaigns" breadcrumb="Unified Campaigns">
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout title="Unified Campaigns" breadcrumb="Unified Campaigns">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-professional-gray mb-2">Unified Campaigns</h1>
              <p className="text-gray-600">Manage integrated campaigns across Content, PR, and SEO pillars</p>
            </div>
            <div className="mt-4 lg:mt-0 flex space-x-3">
              {selectedCampaign && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => syncDataMutation.mutate(selectedCampaign)}
                    disabled={syncDataMutation.isPending}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {syncDataMutation.isPending ? 'Syncing...' : 'Sync Data'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateInsightsMutation.mutate(selectedCampaign)}
                    disabled={generateInsightsMutation.isPending}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {generateInsightsMutation.isPending ? 'Generating...' : 'AI Insights'}
                  </Button>
                </>
              )}
              <Dialog open={createCampaignOpen} onOpenChange={setCreateCampaignOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Unified Campaign</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Campaign Name</Label>
                        <Input
                          id="name"
                          value={newCampaign.name}
                          onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                          placeholder="Q4 Product Launch Campaign"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newCampaign.description}
                          onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                          placeholder="Comprehensive campaign to launch our new product..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="campaign_type">Campaign Type</Label>
                          <Select
                            value={newCampaign.campaign_type}
                            onValueChange={(value: any) => setNewCampaign({ ...newCampaign, campaign_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="integrated">Integrated</SelectItem>
                              <SelectItem value="content">Content-Focused</SelectItem>
                              <SelectItem value="pr">PR-Focused</SelectItem>
                              <SelectItem value="seo">SEO-Focused</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="budget">Total Budget</Label>
                          <Input
                            id="budget"
                            type="number"
                            value={newCampaign.budget}
                            onChange={(e) => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })}
                            placeholder="10000"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="start_date">Start Date</Label>
                          <Input
                            id="start_date"
                            type="date"
                            value={newCampaign.start_date}
                            onChange={(e) => setNewCampaign({ ...newCampaign, start_date: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="end_date">End Date</Label>
                          <Input
                            id="end_date"
                            type="date"
                            value={newCampaign.end_date}
                            onChange={(e) => setNewCampaign({ ...newCampaign, end_date: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Targeting */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Targeting</h3>
                      <div>
                        <Label htmlFor="primary_goal">Primary Goal</Label>
                        <Input
                          id="primary_goal"
                          value={newCampaign.primary_goal}
                          onChange={(e) => setNewCampaign({ ...newCampaign, primary_goal: e.target.value })}
                          placeholder="Brand awareness, Lead generation, Traffic growth"
                        />
                      </div>
                      <div>
                        <Label htmlFor="target_keywords">Target Keywords (comma-separated)</Label>
                        <Input
                          id="target_keywords"
                          value={newCampaign.target_keywords}
                          onChange={(e) => setNewCampaign({ ...newCampaign, target_keywords: e.target.value })}
                          placeholder="marketing automation, CRM software, lead generation"
                        />
                      </div>
                      <div>
                        <Label htmlFor="target_outlets">Target Media Outlets (comma-separated)</Label>
                        <Input
                          id="target_outlets"
                          value={newCampaign.target_outlets}
                          onChange={(e) => setNewCampaign({ ...newCampaign, target_outlets: e.target.value })}
                          placeholder="TechCrunch, Forbes, Wired"
                        />
                      </div>
                      <div>
                        <Label htmlFor="content_themes">Content Themes (comma-separated)</Label>
                        <Input
                          id="content_themes"
                          value={newCampaign.content_themes}
                          onChange={(e) => setNewCampaign({ ...newCampaign, content_themes: e.target.value })}
                          placeholder="Product updates, Industry insights, Customer success"
                        />
                      </div>
                    </div>

                    {/* Pillar Allocation */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Pillar Allocation</h3>
                      {newCampaign.pillars.map((pillar, index) => (
                        <div key={pillar.type} className="flex items-center space-x-4 p-4 border border-border-gray rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {pillar.type === 'content' && <MessageSquare className="h-4 w-4 text-enterprise-blue" />}
                              {pillar.type === 'pr' && <Newspaper className="h-4 w-4 text-pravado-orange" />}
                              {pillar.type === 'seo' && <Search className="h-4 w-4 text-pravado-purple" />}
                              <span className="font-medium capitalize">{pillar.type}</span>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <Label>Weight: {pillar.weight.toFixed(1)}%</Label>
                                <Input
                                  type="range"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                  value={pillar.weight}
                                  onChange={(e) => updatePillarWeight(index, Number(e.target.value))}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <Label>Budget Allocation</Label>
                                <Input
                                  type="number"
                                  value={pillar.budget}
                                  onChange={(e) => {
                                    const updatedPillars = [...newCampaign.pillars];
                                    updatedPillars[index].budget = Number(e.target.value);
                                    setNewCampaign({ ...newCampaign, pillars: updatedPillars });
                                  }}
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={handleCreateCampaign} 
                      disabled={createCampaignMutation.isPending}
                      className="w-full"
                    >
                      {createCampaignMutation.isPending ? 'Creating...' : 'Create Campaign'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Campaign List */}
          {!campaigns || campaigns.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No unified campaigns"
              description="Create your first integrated campaign to connect Content, PR, and SEO efforts."
              actionLabel="Create Campaign"
              onAction={() => setCreateCampaignOpen(true)}
            />
          ) : (
            <div className="space-y-6">
              {/* Campaign Selector */}
              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <Label>Select Campaign:</Label>
                  <Select value={selectedCampaign || ''} onValueChange={setSelectedCampaign}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Choose a campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.map(campaign => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {campaigns.length > 0 && !selectedCampaign && (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCampaign(campaigns[0].id)}
                    >
                      View Latest
                    </Button>
                  )}
                </div>
              </Card>

              {/* Campaign Overview Cards */}
              {campaigns.map(campaign => (
                <Card 
                  key={campaign.id} 
                  className={`p-6 cursor-pointer transition-all ${
                    selectedCampaign === campaign.id ? 'ring-2 ring-enterprise-blue' : ''
                  }`}
                  onClick={() => setSelectedCampaign(campaign.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-professional-gray">{campaign.name}</h3>
                      <p className="text-gray-600">{campaign.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={
                          campaign.status === 'active' ? 'default' : 
                          campaign.status === 'completed' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {campaign.status}
                      </Badge>
                      <Badge variant="outline">{campaign.campaign_type}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Budget</div>
                      <div className="font-medium">{formatCurrency(campaign.budget || 0)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Duration</div>
                      <div className="font-medium">
                        {campaign.start_date && campaign.end_date 
                          ? `${Math.ceil((new Date(campaign.end_date).getTime() - new Date(campaign.start_date).getTime()) / (1000 * 60 * 60 * 24))} days`
                          : 'Ongoing'
                        }
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Goal</div>
                      <div className="font-medium">{campaign.primary_goal || 'Not set'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Created</div>
                      <div className="font-medium">{new Date(campaign.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Detailed Dashboard */}
              {selectedCampaign && dashboardData.overview && (
                <div className="space-y-6">
                  {/* Performance Overview */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-professional-gray">Campaign Performance</h2>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => optimizePillarsMutation.mutate(selectedCampaign)}
                          disabled={optimizePillarsMutation.isPending}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          {optimizePillarsMutation.isPending ? 'Optimizing...' : 'Optimize'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => predictPerformanceMutation.mutate({ campaignId: selectedCampaign })}
                          disabled={predictPerformanceMutation.isPending}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          {predictPerformanceMutation.isPending ? 'Predicting...' : 'Predict'}
                        </Button>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-enterprise-blue">
                          {dashboardData.overview.progressPercentage}%
                        </div>
                        <div className="text-sm text-gray-600">Campaign Progress</div>
                        <Progress value={dashboardData.overview.progressPercentage} className="mt-2" />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-pravado-orange">
                          {dashboardData.roi ? `${dashboardData.roi.roi}%` : '0%'}
                        </div>
                        <div className="text-sm text-gray-600">ROI</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {dashboardData.roi ? formatCurrency(dashboardData.roi.totalRevenue) : '$0'} revenue
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-pravado-purple">
                          {dashboardData.performance?.total_conversions || 0}
                        </div>
                        <div className="text-sm text-gray-600">Total Conversions</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {dashboardData.performance?.total_clicks || 0} clicks
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {dashboardData.overview.activePillars}/3
                        </div>
                        <div className="text-sm text-gray-600">Active Pillars</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {dashboardData.overview.totalActivities} activities
                        </div>
                      </div>
                    </div>

                    {/* Pillar Performance */}
                    {dashboardData.pillarComparison && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Pillar Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Content Pillar */}
                          <Card className="p-4 border-l-4 border-l-enterprise-blue">
                            <div className="flex items-center space-x-2 mb-3">
                              <MessageSquare className="h-5 w-5 text-enterprise-blue" />
                              <span className="font-medium">Content</span>
                              <Badge variant="outline">{dashboardData.pillarComparison.content.weight}%</Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Conversions:</span>
                                <span className="font-medium">{dashboardData.pillarComparison.content.conversions}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Views:</span>
                                <span className="font-medium">{formatNumber(dashboardData.pillarComparison.content.views)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Engagement:</span>
                                <span className="font-medium">{dashboardData.pillarComparison.content.engagement}%</span>
                              </div>
                            </div>
                          </Card>

                          {/* PR Pillar */}
                          <Card className="p-4 border-l-4 border-l-pravado-orange">
                            <div className="flex items-center space-x-2 mb-3">
                              <Newspaper className="h-5 w-5 text-pravado-orange" />
                              <span className="font-medium">PR</span>
                              <Badge variant="outline">{dashboardData.pillarComparison.pr.weight}%</Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Conversions:</span>
                                <span className="font-medium">{dashboardData.pillarComparison.pr.conversions}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Mentions:</span>
                                <span className="font-medium">{formatNumber(dashboardData.pillarComparison.pr.mentions)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Sentiment:</span>
                                <span className="font-medium">{dashboardData.pillarComparison.pr.sentiment}/5</span>
                              </div>
                            </div>
                          </Card>

                          {/* SEO Pillar */}
                          <Card className="p-4 border-l-4 border-l-pravado-purple">
                            <div className="flex items-center space-x-2 mb-3">
                              <Search className="h-5 w-5 text-pravado-purple" />
                              <span className="font-medium">SEO</span>
                              <Badge variant="outline">{dashboardData.pillarComparison.seo.weight}%</Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Conversions:</span>
                                <span className="font-medium">{dashboardData.pillarComparison.seo.conversions}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Traffic:</span>
                                <span className="font-medium">{formatNumber(dashboardData.pillarComparison.seo.traffic)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Avg Position:</span>
                                <span className="font-medium">{dashboardData.pillarComparison.seo.position}</span>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* Attribution Analysis */}
                  {dashboardData.attribution && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Cross-Pillar Attribution</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-enterprise-blue">
                            {dashboardData.attribution.pillarAttribution?.content?.toFixed(1) || 0}%
                          </div>
                          <div className="text-sm text-gray-600">Content Attribution</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-pravado-orange">
                            {dashboardData.attribution.pillarAttribution?.pr?.toFixed(1) || 0}%
                          </div>
                          <div className="text-sm text-gray-600">PR Attribution</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-pravado-purple">
                            {dashboardData.attribution.pillarAttribution?.seo?.toFixed(1) || 0}%
                          </div>
                          <div className="text-sm text-gray-600">SEO Attribution</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {dashboardData.attribution.avgJourneyLength || 0}
                          </div>
                          <div className="text-sm text-gray-600">Avg Journey Length</div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* AI Insights */}
                  {dashboardData.insights && dashboardData.insights.length > 0 && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
                        <Badge variant="outline">{dashboardData.insights.length} active</Badge>
                      </div>
                      <div className="space-y-4">
                        {dashboardData.insights.slice(0, 3).map((insight: any) => (
                          <div key={insight.id} className="flex items-start space-x-4 p-4 border border-border-gray rounded-lg">
                            <div className="flex-shrink-0">
                              {insight.severity === 'high' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                              {insight.severity === 'medium' && <Lightbulb className="h-5 w-5 text-yellow-500" />}
                              {insight.severity === 'low' && <CheckCircle className="h-5 w-5 text-green-500" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-professional-gray">{insight.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {insight.confidence_score}% confidence
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {insight.insight_category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};

export default UnifiedCampaigns;