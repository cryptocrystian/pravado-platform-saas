
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Campaign } from '@/hooks/useCampaigns';
import { format } from 'date-fns';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaignId: string) => void;
  onDuplicate: (campaign: Campaign) => void;
}

const campaignTypeLabels: Record<Campaign['campaign_type'], string> = {
  content_only: 'Content Only',
  pr_only: 'PR Only',
  seo_only: 'SEO Only',
  content_pr: 'Content + PR',
  content_seo: 'Content + SEO',
  pr_seo: 'PR + SEO',
  integrated: 'Integrated',
};

const statusColors: Record<Campaign['status'], string> = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

const typeColors: Record<Campaign['campaign_type'], string> = {
  content_only: 'bg-purple-100 text-purple-800',
  pr_only: 'bg-orange-100 text-orange-800',
  seo_only: 'bg-blue-100 text-blue-800',
  content_pr: 'bg-pink-100 text-pink-800',
  content_seo: 'bg-indigo-100 text-indigo-800',
  pr_seo: 'bg-yellow-100 text-yellow-800',
  integrated: 'bg-green-100 text-green-800',
};

export function CampaignCard({ campaign, onEdit, onDelete, onDuplicate }: CampaignCardProps) {
  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'No budget set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold text-professional-gray">
            {campaign.name}
          </CardTitle>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className={statusColors[campaign.status]}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
            <Badge variant="outline" className={typeColors[campaign.campaign_type]}>
              {campaignTypeLabels[campaign.campaign_type]}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(campaign)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(campaign)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(campaign.id)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {campaign.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {campaign.description}
          </p>
        )}
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Budget:</span>
            <span className="font-medium">{formatCurrency(campaign.budget)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Start Date:</span>
            <span className="font-medium">{formatDate(campaign.start_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">End Date:</span>
            <span className="font-medium">{formatDate(campaign.end_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Created:</span>
            <span className="font-medium">{formatDate(campaign.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
