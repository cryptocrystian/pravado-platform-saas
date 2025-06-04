
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';

export interface Campaign {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  campaign_type: 'content_only' | 'pr_only' | 'seo_only' | 'content_pr' | 'content_seo' | 'pr_seo' | 'integrated';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  goals: any;
  target_audience: any;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useCampaigns() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['campaigns', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userTenant?.id,
  });
}

export function useCampaign(id: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['campaign', id, userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id || !id) return null;
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', userTenant.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userTenant?.id && !!id,
  });
}

export function useCampaignMetrics() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['campaign-metrics', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return null;
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('status')
        .eq('tenant_id', userTenant.id);

      if (error) throw error;
      
      const campaigns = data || [];
      
      const metrics = {
        total: campaigns.length,
        draft: campaigns.filter((c: any) => c.status === 'draft').length,
        active: campaigns.filter((c: any) => c.status === 'active').length,
        completed: campaigns.filter((c: any) => c.status === 'completed').length,
        paused: campaigns.filter((c: any) => c.status === 'paused').length,
        cancelled: campaigns.filter((c: any) => c.status === 'cancelled').length,
      };
      
      return metrics;
    },
    enabled: !!userTenant?.id,
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)
        .eq('tenant_id', userTenant?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign-metrics'] });
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Campaign> }) => {
      const { error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id)
        .eq('tenant_id', userTenant?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign-metrics'] });
      toast({
        title: "Success",
        description: "Campaign updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign",
        variant: "destructive",
      });
    },
  });
}
