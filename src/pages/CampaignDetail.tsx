
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BaseLayout } from '@/components/BaseLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Copy, 
  Archive, 
  DollarSign, 
  Target, 
  Users, 
  Calendar,
  TrendingUp,
  FileText,
  BarChart3
} from 'lucide-react';
import { useCampaign } from '@/hooks/useCampaigns';
import { useContent } from '@/hooks/useContent';
import { format } from 'date-fns';

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, isLoading: campaignLoading } = useCampaign(id!);
  const { data: content } = useContent();

  const campaignContent = content?.filter(c => c.campaign_id === id) || [];

  if (campaignLoading) {
    return (
      <BaseLayout title="Campaign Details">
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </BaseLayout>
    );
  }

  if (!campaign) {
    return (
      <BaseLayout title="Campaign Not Found">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-professional-gray">Campaign not found</h2>
          <p className="text-gray-600 mt-2">The campaign you're looking for doesn't exist.</p>
          <Link to="/campaigns">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
          </Link>
        </div>
      </BaseLayout>
    );
  }

  const budgetAllocation = campaign.budget_allocation as any || { content: 40, pr: 30, seo: 30 };
  const actualSpend = campaign.actual_spend || 0;
  const totalBudget = campaign.budget || 0;
  const spendPercentage = totalBudget > 0 ? (actualSpend / totalBudget) * 100 : 0;
  const milestones = campaign.milestones as any[] || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <BaseLayout title="Campaign Details" breadcrumb={`Campaigns / ${campaign.name}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/campaigns">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Campaigns
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-professional-gray">{campaign.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
                <span className="text-gray-500 capitalize">
                  {campaign.campaign_type.replace('_', ' ')}
                </span>
                {campaign.start_date && (
                  <span className="text-gray-500">
                    {format(new Date(campaign.start_date), 'MMM dd, yyyy')} - 
                    {campaign.end_date ? format(new Date(campaign.end_date), 'MMM dd, yyyy') : 'Ongoing'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Campaign
            </Button>
            <Button variant="outline">
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-professional-gray">
                  ${totalBudget.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-pravado-orange" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actual Spend</p>
                <p className="text-2xl font-bold text-professional-gray">
                  ${actualSpend.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {spendPercentage.toFixed(1)}% of budget
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-enterprise-blue" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Content Pieces</p>
                <p className="text-2xl font-bold text-professional-gray">
                  {campaignContent.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-pravado-purple" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Milestones</p>
                <p className="text-2xl font-bold text-professional-gray">
                  {milestones.filter(m => m.completed).length}/{milestones.length}
                </p>
              </div>
              <Target className="h-8 w-8 text-pravado-crimson" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Campaign Description</h3>
                <p className="text-gray-600">{campaign.description || 'No description provided'}</p>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="font-medium text-professional-gray">Goals & Objectives</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {(campaign.goals as any)?.description || 'No goals specified'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-professional-gray">Target Audience</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {(campaign.target_audience as any)?.description || 'No target audience specified'}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Budget Allocation</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Content Marketing</span>
                      <span className="text-sm text-gray-600">{budgetAllocation.content}%</span>
                    </div>
                    <Progress value={budgetAllocation.content} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Public Relations</span>
                      <span className="text-sm text-gray-600">{budgetAllocation.pr}%</span>
                    </div>
                    <Progress value={budgetAllocation.pr} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">SEO Intelligence</span>
                      <span className="text-sm text-gray-600">{budgetAllocation.seo}%</span>
                    </div>
                    <Progress value={budgetAllocation.seo} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="budget" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Budget Tracking</h3>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Budget Utilization</span>
                  <span className="text-sm text-gray-600">
                    ${actualSpend.toLocaleString()} / ${totalBudget.toLocaleString()}
                  </span>
                </div>
                <Progress value={spendPercentage} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">
                  {spendPercentage.toFixed(1)}% of total budget used
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-soft-gray rounded-lg p-4">
                  <h4 className="font-medium text-professional-gray">Content Marketing</h4>
                  <p className="text-2xl font-bold text-enterprise-blue">
                    ${((totalBudget * budgetAllocation.content) / 100).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">{budgetAllocation.content}% allocation</p>
                </div>
                
                <div className="bg-soft-gray rounded-lg p-4">
                  <h4 className="font-medium text-professional-gray">Public Relations</h4>
                  <p className="text-2xl font-bold text-pravado-orange">
                    ${((totalBudget * budgetAllocation.pr) / 100).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">{budgetAllocation.pr}% allocation</p>
                </div>
                
                <div className="bg-soft-gray rounded-lg p-4">
                  <h4 className="font-medium text-professional-gray">SEO Intelligence</h4>
                  <p className="text-2xl font-bold text-pravado-purple">
                    ${((totalBudget * budgetAllocation.seo) / 100).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">{budgetAllocation.seo}% allocation</p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="content" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Campaign Content</h3>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
              </div>
              
              {campaignContent.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-professional-gray mb-2">No content yet</h4>
                  <p className="text-gray-600 mb-4">Start creating content for this campaign.</p>
                  <Button>Create First Content Piece</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaignContent.map((content) => (
                    <div key={content.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-professional-gray">{content.title}</h4>
                          <p className="text-sm text-gray-600 capitalize">{content.content_type}</p>
                          <p className="text-xs text-gray-500">
                            Created {format(new Date(content.created_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <Badge className={
                          content.status === 'published' ? 'bg-green-100 text-green-800' :
                          content.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {content.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="milestones" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Campaign Milestones</h3>
              
              {milestones.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-professional-gray mb-2">No milestones defined</h4>
                  <p className="text-gray-600">Add milestones to track campaign progress.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-professional-gray">{milestone.title}</h4>
                          {milestone.description && (
                            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                          )}
                          {milestone.date && (
                            <p className="text-xs text-gray-500 mt-2">
                              Due: {format(new Date(milestone.date), 'MMM dd, yyyy')}
                            </p>
                          )}
                        </div>
                        <Badge className={
                          milestone.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }>
                          {milestone.completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Campaign Analytics</h3>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-professional-gray mb-2">Analytics Coming Soon</h4>
                <p className="text-gray-600">Detailed campaign analytics will be available soon.</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
}
