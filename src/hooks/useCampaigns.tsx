
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

export type Campaign = Database['public']['Tables']['campaigns']['Row'];

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

export function useCampaignWithMethodology(id: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['campaign-methodology', id, userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id || !id) return null;
      
      // Get campaign data
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', userTenant.id)
        .single();

      if (campaignError) throw campaignError;

      // Get methodology progress for this campaign
      const { data: methodology, error: methodologyError } = await supabase
        .from('automate_methodology_campaigns')
        .select(`
          *,
          automate_step_progress(*)
        `)
        .eq('campaign_id', id)
        .eq('tenant_id', userTenant.id)
        .maybeSingle();

      if (methodologyError) throw methodologyError;

      return {
        campaign,
        methodology: methodology || null,
        stepProgress: methodology?.automate_step_progress || []
      };
    },
    enabled: !!userTenant?.id && !!id,
  });
}

export function useCreateCampaignWithMethodology() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaignData: Partial<Campaign> & { name: string; campaign_type: string }) => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      // Create campaign with required fields
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          name: campaignData.name,
          campaign_type: campaignData.campaign_type,
          tenant_id: userTenant.id,
          status: campaignData.status || 'draft',
          description: campaignData.description || null,
          budget: campaignData.budget || null,
          start_date: campaignData.start_date || null,
          end_date: campaignData.end_date || null,
          goals: campaignData.goals || {},
          target_audience: campaignData.target_audience || {},
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Create AUTOMATE methodology tracking for this campaign
      const { data: methodology, error: methodologyError } = await supabase
        .from('automate_methodology_campaigns')
        .insert({
          tenant_id: userTenant.id,
          campaign_id: campaign.id,
          status: 'not_started',
        })
        .select()
        .single();

      if (methodologyError) throw methodologyError;

      // Create all 8 AUTOMATE step progress records
      const steps = [
        { code: 'A', name: 'Assess & Audit', index: 0 },
        { code: 'U', name: 'Understand Audience', index: 1 },
        { code: 'T', name: 'Target & Strategy', index: 2 },
        { code: 'O', name: 'Optimize Systems', index: 3 },
        { code: 'M', name: 'Measure & Monitor', index: 4 },
        { code: 'A', name: 'Accelerate Growth', index: 5 },
        { code: 'T', name: 'Transform & Evolve', index: 6 },
        { code: 'E', name: 'Execute Excellence', index: 7 }
      ];

      const stepProgressInserts = steps.map(step => ({
        methodology_campaign_id: methodology.id,
        tenant_id: userTenant.id,
        step_code: step.code,
        step_name: step.name,
        step_index: step.index,
        completion_percentage: 0,
        status: 'pending' as const
      }));

      const { error: stepsError } = await supabase
        .from('automate_step_progress')
        .insert(stepProgressInserts);

      if (stepsError) throw stepsError;

      return { campaign, methodology };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['automate-methodology-progress'] });
      toast({
        title: "Campaign Created",
        description: "Campaign created with AUTOMATE methodology tracking",
      });
    },
    onError: (error) => {
      console.error('Error creating campaign with methodology:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    },
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
