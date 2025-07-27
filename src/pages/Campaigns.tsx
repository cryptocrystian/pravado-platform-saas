import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseLayout } from '@/components/BaseLayout';
import { CreateCampaignModal } from '@/components/CreateCampaignModal';
import { CampaignCard } from '@/components/CampaignCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Eye, 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3,
  Activity,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useCampaigns, useDeleteCampaign, Campaign } from '@/hooks/useCampaigns';
import { useJournalistAnalytics } from '@/hooks/useJournalists';
import { useToast } from '@/hooks/use-toast';

export default function Campaigns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const { data: campaigns, isLoading, refetch } = useCampaigns();
  const deleteCampaign = useDeleteCampaign();
  const { toast } = useToast();
  const journalistAnalytics = useJournalistAnalytics();

  const filteredCampaigns = campaigns?.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.campaign_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  // Calculate AI campaign statistics
  const aiCampaigns = campaigns?.filter(c => (c as any).ai_intelligence?.journalist_targeting) || [];
  const totalAITargetedJournalists = aiCampaigns.reduce((sum, c) => {
    return sum + ((c as any).ai_intelligence?.journalist_targeting?.selected_journalists?.length || 0);
  }, 0);

  const handleView = (campaign: Campaign) => {
    // Navigation to detail page is handled by Link component
  };

  const handleEdit = (campaign: Campaign) => {
    console.log('Edit campaign:', campaign.id);
    toast({
      title: "Feature Coming Soon",
      description: "Campaign editing will be available in the next update.",
    });
  };

  const handleDelete = async (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      deleteCampaign.mutate(campaignId);
    }
  };

  const handleDuplicate = (campaign: Campaign) => {
    console.log('Duplicate campaign:', campaign.id);
    toast({
      title: "Feature Coming Soon",
      description: "Campaign duplication will be available in the next update.",
    });
  };

  if (isLoading) {
    return (
      <BaseLayout title="Campaigns">
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout title="Campaigns" breadcrumb="Campaign Management">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-professional-gray">AI-Enhanced Campaign Management</h1>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Sparkles className="h-3 w-3 mr-1" />
                Phase B: Integrated
              </Badge>
            </div>
            <p className="text-gray-600 mt-2">
              Create and manage campaigns with AI-powered journalist targeting and relationship intelligence
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <CreateCampaignModal onCampaignCreated={refetch} />
          </div>
        </div>

        {/* AI Intelligence Overview */}
        {(aiCampaigns.length > 0 || journalistAnalytics) && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">AI Campaigns</p>
                    <p className="text-2xl font-bold text-purple-900">{aiCampaigns.length}</p>
                    <p className="text-xs text-purple-600">with journalist targeting</p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Targeted Journalists</p>
                    <p className="text-2xl font-bold text-blue-900">{totalAITargetedJournalists}</p>
                    <p className="text-xs text-blue-600">across all campaigns</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Avg Relationship Score</p>
                    <p className="text-2xl font-bold text-green-900">
                      {journalistAnalytics ? Math.round(journalistAnalytics.averageRelationshipScore) : 0}
                    </p>
                    <p className="text-xs text-green-600">AI intelligence</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Success Rate</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {journalistAnalytics ? Math.round(journalistAnalytics.successfulPitchRate * 100) : 0}%
                    </p>
                    <p className="text-xs text-orange-600">predicted vs actual</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="content_only">Content Only</SelectItem>
                  <SelectItem value="pr_only">PR Only</SelectItem>
                  <SelectItem value="seo_only">SEO Only</SelectItem>
                  <SelectItem value="content_pr">Content + PR</SelectItem>
                  <SelectItem value="content_seo">Content + SEO</SelectItem>
                  <SelectItem value="pr_seo">PR + SEO</SelectItem>
                  <SelectItem value="integrated">Integrated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Grid */}
        {filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                <Brain className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-professional-gray mb-2">
                {campaigns?.length === 0 ? 'Ready to launch AI-powered campaigns?' : 'No campaigns match your filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {campaigns?.length === 0 
                  ? 'Create your first AI-enhanced campaign with intelligent journalist targeting and relationship scoring'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {campaigns?.length === 0 && (
                <div className="space-y-4">
                  <CreateCampaignModal onCampaignCreated={refetch} />
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mt-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      AI Journalist Targeting
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Relationship Intelligence
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Success Predictions
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredCampaigns.length} of {campaigns?.length || 0} campaigns
                {aiCampaigns.length > 0 && (
                  <span className="ml-2">
                    • <span className="text-purple-600 font-medium">{aiCampaigns.length} AI-enhanced</span>
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Activity className="h-4 w-4" />
                Real-time AI insights
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => {
                const hasAI = !!(campaign as any).ai_intelligence?.journalist_targeting;
                const targetedJournalists = (campaign as any).ai_intelligence?.journalist_targeting?.selected_journalists?.length || 0;
                
                return (
                  <div key={campaign.id} className="relative">
                    {hasAI && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <Badge className="bg-purple-500 text-white gap-1 px-2 py-1">
                          <Sparkles className="h-3 w-3" />
                          AI Enhanced
                        </Badge>
                      </div>
                    )}
                    <CampaignCard
                      campaign={campaign}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onDuplicate={handleDuplicate}
                      className={hasAI ? 'ring-1 ring-purple-200 shadow-lg' : ''}
                    />
                    {hasAI && targetedJournalists > 0 && (
                      <div className="absolute bottom-4 left-4 right-16">
                        <div className="bg-purple-50 rounded-lg p-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-purple-700 font-medium">
                              {targetedJournalists} journalists targeted
                            </span>
                            <div className="flex items-center gap-1 text-purple-600">
                              <Zap className="h-3 w-3" />
                              AI Powered
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <Link 
                      to={`/campaigns/${campaign.id}`}
                      className="absolute top-4 right-4 z-10"
                    >
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" />
                        {hasAI ? 'View AI Analytics' : 'View'}
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* AI Features Promotion */}
        {campaigns && campaigns.length > 0 && aiCampaigns.length === 0 && (
          <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Upgrade to AI-Enhanced Campaigns</h3>
                  </div>
                  <p className="text-purple-700 text-sm mb-4">
                    Get better results with intelligent journalist targeting, relationship scoring, and success predictions.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-purple-600">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      30+ AI Intelligence Fields
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Relationship Scoring
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Success Predictions
                    </div>
                  </div>
                </div>
                <CreateCampaignModal onCampaignCreated={refetch} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </BaseLayout>
  );
}