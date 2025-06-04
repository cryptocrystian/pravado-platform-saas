
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';

export type PressRelease = {
  id: string;
  tenant_id: string;
  title: string;
  content: string;
  status: string;
  release_date?: string;
  created_by?: string;
  distribution_channels: string[];
  reach_estimate: number;
  pickup_count: number;
  media_value: number;
  sentiment_score: number;
  campaign_id?: string;
  distribution_targets: string[];
  distribution_status: string;
  total_pickup_count: number;
  total_reach: number;
  ai_optimization_score: number;
  seo_keywords: string[];
  target_outlets: string[];
  scheduled_distribution?: string;
  performance_metrics: any;
  created_at: string;
  updated_at: string;
};

export type MediaOutlet = {
  id: string;
  name: string;
  website: string;
  category: string;
  industry_focus: string[];
  geographic_focus: string[];
  circulation: number;
  domain_authority: number;
  is_premium: boolean;
  submission_email?: string;
  submission_guidelines?: string;
  turnaround_time?: string;
  is_active: boolean;
};

export type PressDistribution = {
  id: string;
  tenant_id: string;
  press_release_id: string;
  outlet_id: string;
  status: string;
  distributed_at?: string;
  pickup_confirmed: boolean;
  pickup_url?: string;
  views: number;
  shares: number;
  created_at: string;
  media_outlets?: MediaOutlet;
};

export function usePressReleases() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['press-releases', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('press_releases')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userTenant?.id,
  });
}

export function useMediaOutlets() {
  return useQuery({
    queryKey: ['media-outlets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_outlets')
        .select('*')
        .eq('is_active', true)
        .order('domain_authority', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function usePressDistributions(pressReleaseId: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['press-distributions', pressReleaseId],
    queryFn: async () => {
      if (!userTenant?.id || !pressReleaseId) return [];
      
      const { data, error } = await supabase
        .from('press_distributions')
        .select(`
          *,
          media_outlets(*)
        `)
        .eq('tenant_id', userTenant.id)
        .eq('press_release_id', pressReleaseId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!userTenant?.id && !!pressReleaseId,
  });
}

export function useCreatePressRelease() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (pressRelease: Partial<PressRelease>) => {
      const { error } = await supabase
        .from('press_releases')
        .insert({
          ...pressRelease,
          tenant_id: userTenant?.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['press-releases'] });
      toast({
        title: "Success",
        description: "Press release created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating press release:', error);
      toast({
        title: "Error",
        description: "Failed to create press release",
        variant: "destructive",
      });
    },
  });
}

export function useDistributePressRelease() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ pressReleaseId, outletIds }: { pressReleaseId: string; outletIds: string[] }) => {
      const distributions = outletIds.map(outletId => ({
        tenant_id: userTenant?.id,
        press_release_id: pressReleaseId,
        outlet_id: outletId,
        status: 'pending',
      }));

      const { error } = await supabase
        .from('press_distributions')
        .insert(distributions);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['press-distributions'] });
      queryClient.invalidateQueries({ queryKey: ['press-releases'] });
      toast({
        title: "Success",
        description: "Press release distributed successfully",
      });
    },
    onError: (error) => {
      console.error('Error distributing press release:', error);
      toast({
        title: "Error",
        description: "Failed to distribute press release",
        variant: "destructive",
      });
    },
  });
}
