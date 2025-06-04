
import React, { useState } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { CreateCampaignModal } from '@/components/CreateCampaignModal';
import { CampaignCard } from '@/components/CampaignCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus } from 'lucide-react';
import { useCampaigns, useDeleteCampaign, Campaign } from '@/hooks/useCampaigns';
import { useToast } from '@/hooks/use-toast';

export default function Campaigns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const { data: campaigns, isLoading, refetch } = useCampaigns();
  const deleteCampaign = useDeleteCampaign();
  const { toast } = useToast();

  const filteredCampaigns = campaigns?.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.campaign_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const handleEdit = (campaign: Campaign) => {
    // Navigate to edit page - will implement in next iteration
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
            <h1 className="text-3xl font-bold text-professional-gray">Campaign Management</h1>
            <p className="text-gray-600 mt-2">Create, manage, and track your marketing campaigns</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <CreateCampaignModal onCampaignCreated={refetch} />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

        {/* Campaign Grid */}
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-soft-gray rounded-full flex items-center justify-center mb-4">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-professional-gray mb-2">
              {campaigns?.length === 0 ? 'No campaigns yet' : 'No campaigns match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {campaigns?.length === 0 
                ? 'Get started by creating your first marketing campaign'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {campaigns?.length === 0 && (
              <CreateCampaignModal onCampaignCreated={refetch} />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
