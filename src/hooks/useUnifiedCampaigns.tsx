import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';
import { 
  unifiedCampaignService, 
  UnifiedCampaign, 
  CampaignPillar,
  CrossPillarActivity,
  CampaignPerformance,
  CampaignAttribution,
  CampaignInsight
} from '@/services/unifiedCampaignService';

// Unified Campaigns Hook
export function useUnifiedCampaigns() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['unified-campaigns', userTenant?.id],
    queryFn: async (): Promise<UnifiedCampaign[]> => {
      if (!userTenant?.id) return [];
      return await unifiedCampaignService.getUnifiedCampaigns(userTenant.id);
    },
    enabled: !!userTenant?.id,
  });
}

// Single Campaign Hook
export function useUnifiedCampaign(campaignId: string) {
  return useQuery({
    queryKey: ['unified-campaign', campaignId],
    queryFn: async (): Promise<UnifiedCampaign | null> => {
      if (!campaignId) return null;
      return await unifiedCampaignService.getUnifiedCampaign(campaignId);
    },
    enabled: !!campaignId,
  });
}

// Campaign Overview Hook
export function useCampaignOverview(campaignId: string) {
  return useQuery({
    queryKey: ['campaign-overview', campaignId],
    queryFn: async () => {
      if (!campaignId) return null;
      return await unifiedCampaignService.getCampaignOverview(campaignId);
    },
    enabled: !!campaignId,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
}

// Create Campaign Hook
export function useCreateUnifiedCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async (campaignData: {
      name: string;
      description?: string;
      campaign_type: 'content' | 'pr' | 'seo' | 'integrated';
      start_date?: string;
      end_date?: string;
      budget?: number;
      primary_goal?: string;
      target_audience?: any;
      target_markets?: string[];
      target_keywords?: string[];
      target_outlets?: string[];
      content_themes?: string[];
      pillars: {
        type: 'content' | 'pr' | 'seo';
        weight: number;
        budget?: number;
        goals?: any;
      }[];
    }): Promise<UnifiedCampaign> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      // Create the unified campaign
      const campaign = await unifiedCampaignService.createUnifiedCampaign({
        tenant_id: userTenant.id,
        name: campaignData.name,
        description: campaignData.description,
        campaign_type: campaignData.campaign_type,
        start_date: campaignData.start_date,
        end_date: campaignData.end_date,
        budget: campaignData.budget,
        primary_goal: campaignData.primary_goal,
        target_audience: campaignData.target_audience,
        target_markets: campaignData.target_markets,
        target_keywords: campaignData.target_keywords,
        target_outlets: campaignData.target_outlets,
        content_themes: campaignData.content_themes,
        status: 'planning'
      });

      // Add pillars
      for (const pillar of campaignData.pillars) {
        await unifiedCampaignService.addCampaignPillar({
          tenant_id: userTenant.id,
          unified_campaign_id: campaign.id,
          pillar_type: pillar.type,
          pillar_weight: pillar.weight,
          pillar_budget: pillar.budget,
          pillar_goals: pillar.goals,
          pillar_status: 'active'
        });
      }

      return campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-campaigns'] });
      toast({
        title: "Campaign Created",
        description: "Unified campaign has been created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating campaign:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create unified campaign",
        variant: "destructive",
      });
    },
  });
}

// Update Campaign Hook
export function useUpdateUnifiedCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      campaignId,
      updates
    }: {
      campaignId: string;
      updates: Partial<UnifiedCampaign>;
    }): Promise<UnifiedCampaign> => {
      return await unifiedCampaignService.updateUnifiedCampaign(campaignId, updates);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['unified-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['unified-campaign', data.id] });
      queryClient.invalidateQueries({ queryKey: ['campaign-overview', data.id] });
      toast({
        title: "Campaign Updated",
        description: "Campaign has been updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating campaign:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update campaign",
        variant: "destructive",
      });
    },
  });
}

// Campaign Pillars Hook
export function useCampaignPillars(campaignId: string) {
  return useQuery({
    queryKey: ['campaign-pillars', campaignId],
    queryFn: async (): Promise<CampaignPillar[]> => {
      if (!campaignId) return [];
      return await unifiedCampaignService.getCampaignPillars(campaignId);
    },
    enabled: !!campaignId,
  });
}

// Cross-Pillar Activities Hook
export function useCrossPillarActivities(campaignId: string) {
  return useQuery({
    queryKey: ['cross-pillar-activities', campaignId],
    queryFn: async (): Promise<CrossPillarActivity[]> => {
      if (!campaignId) return [];
      return await unifiedCampaignService.getCrossPillarActivities(campaignId);
    },
    enabled: !!campaignId,
  });
}

// Create Activity Hook
export function useCreateCrossPillarActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async (activityData: {
      unified_campaign_id: string;
      activity_type: string;
      activity_name: string;
      description?: string;
      primary_pillar: 'content' | 'pr' | 'seo';
      supporting_pillars?: string[];
      planned_date?: string;
      assigned_to?: string;
      depends_on_activities?: string[];
    }): Promise<CrossPillarActivity> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      return await unifiedCampaignService.createCrossPillarActivity({
        tenant_id: userTenant.id,
        ...activityData,
        status: 'planned'
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cross-pillar-activities', data.unified_campaign_id] });
      queryClient.invalidateQueries({ queryKey: ['campaign-overview', data.unified_campaign_id] });
      toast({
        title: "Activity Created",
        description: "Cross-pillar activity has been created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating activity:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create cross-pillar activity",
        variant: "destructive",
      });
    },
  });
}

// Update Activity Status Hook
export function useUpdateActivityStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      activityId,
      status,
      campaignId
    }: {
      activityId: string;
      status: string;
      campaignId: string;
    }): Promise<void> => {
      const completedAt = status === 'completed' ? new Date().toISOString() : undefined;
      await unifiedCampaignService.updateActivityStatus(activityId, status, completedAt);
    },
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['cross-pillar-activities', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaign-overview', campaignId] });
      toast({
        title: "Activity Updated",
        description: "Activity status has been updated",
      });
    },
    onError: (error) => {
      console.error('Error updating activity:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update activity status",
        variant: "destructive",
      });
    },
  });
}

// Campaign Performance Hook
export function useCampaignPerformance(campaignId: string, period?: string) {
  return useQuery({
    queryKey: ['campaign-performance', campaignId, period],
    queryFn: async (): Promise<CampaignPerformance[]> => {
      if (!campaignId) return [];
      return await unifiedCampaignService.getCampaignPerformance(campaignId, period);
    },
    enabled: !!campaignId,
  });
}

// Latest Performance Hook
export function useLatestCampaignPerformance(campaignId: string) {
  return useQuery({
    queryKey: ['latest-campaign-performance', campaignId],
    queryFn: async (): Promise<CampaignPerformance | null> => {
      if (!campaignId) return null;
      return await unifiedCampaignService.getLatestCampaignPerformance(campaignId);
    },
    enabled: !!campaignId,
  });
}

// Campaign Attribution Hook
export function useCampaignAttribution(campaignId: string) {
  return useQuery({
    queryKey: ['campaign-attribution', campaignId],
    queryFn: async () => {
      if (!campaignId) return null;
      return await unifiedCampaignService.getAttributionAnalysis(campaignId);
    },
    enabled: !!campaignId,
  });
}

// Track Attribution Hook
export function useTrackAttribution() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async (attributionData: {
      campaign_id: string;
      user_id?: string;
      session_id?: string;
      touchpoint_type: string;
      pillar_source: 'content' | 'pr' | 'seo' | 'direct';
      source_data?: any;
      interaction_data?: any;
    }): Promise<any> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      const { data, error } = await supabase.functions.invoke('unified-campaign-analytics', {
        body: {
          action: 'track_attribution',
          tenant_id: userTenant.id,
          data: attributionData
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { campaign_id }) => {
      queryClient.invalidateQueries({ queryKey: ['campaign-attribution', campaign_id] });
      queryClient.invalidateQueries({ queryKey: ['campaign-performance', campaign_id] });
    },
    onError: (error) => {
      console.error('Error tracking attribution:', error);
    },
  });
}

// Campaign Insights Hook
export function useCampaignInsights(campaignId: string, status?: string) {
  return useQuery({
    queryKey: ['campaign-insights', campaignId, status],
    queryFn: async (): Promise<CampaignInsight[]> => {
      if (!campaignId) return [];
      return await unifiedCampaignService.getCampaignInsights(campaignId, status);
    },
    enabled: !!campaignId,
  });
}

// Generate Insights Hook
export function useGenerateCampaignInsights() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async (campaignId: string): Promise<any> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      const { data, error } = await supabase.functions.invoke('unified-campaign-analytics', {
        body: {
          action: 'generate_insights',
          tenant_id: userTenant.id,
          data: { campaign_id: campaignId }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, campaignId) => {
      queryClient.invalidateQueries({ queryKey: ['campaign-insights', campaignId] });
      toast({
        title: "Insights Generated",
        description: `Generated ${data.insights_generated} new insights`,
      });
    },
    onError: (error) => {
      console.error('Error generating insights:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate campaign insights",
        variant: "destructive",
      });
    },
  });
}

// Update Insight Status Hook
export function useUpdateInsightStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      insightId,
      status,
      actionTaken,
      campaignId
    }: {
      insightId: string;
      status: string;
      actionTaken?: any;
      campaignId: string;
    }): Promise<void> => {
      await unifiedCampaignService.updateInsightStatus(insightId, status, actionTaken);
    },
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['campaign-insights', campaignId] });
      toast({
        title: "Insight Updated",
        description: "Insight status has been updated",
      });
    },
    onError: (error) => {
      console.error('Error updating insight:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update insight status",
        variant: "destructive",
      });
    },
  });
}

// Campaign ROI Hook
export function useCampaignROI(campaignId: string) {
  return useQuery({
    queryKey: ['campaign-roi', campaignId],
    queryFn: async () => {
      if (!campaignId) return null;
      return await unifiedCampaignService.getCampaignROI(campaignId);
    },
    enabled: !!campaignId,
  });
}

// Pillar Performance Comparison Hook
export function usePillarPerformanceComparison(campaignId: string) {
  return useQuery({
    queryKey: ['pillar-performance-comparison', campaignId],
    queryFn: async () => {
      if (!campaignId) return null;
      return await unifiedCampaignService.getPillarPerformanceComparison(campaignId);
    },
    enabled: !!campaignId,
  });
}

// Optimize Pillars Hook
export function useOptimizePillars() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async (campaignId: string): Promise<any> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      const { data, error } = await supabase.functions.invoke('unified-campaign-analytics', {
        body: {
          action: 'optimize_pillars',
          tenant_id: userTenant.id,
          data: { campaign_id: campaignId }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, campaignId) => {
      queryClient.invalidateQueries({ queryKey: ['campaign-pillars', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['pillar-performance-comparison', campaignId] });
      toast({
        title: "Optimization Complete",
        description: "Pillar allocation recommendations generated",
      });
    },
    onError: (error) => {
      console.error('Error optimizing pillars:', error);
      toast({
        title: "Optimization Failed",
        description: "Failed to generate optimization recommendations",
        variant: "destructive",
      });
    },
  });
}

// Predict Performance Hook
export function usePredictCampaignPerformance() {
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async ({
      campaignId,
      predictionDays = 30
    }: {
      campaignId: string;
      predictionDays?: number;
    }): Promise<any> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      const { data, error } = await supabase.functions.invoke('unified-campaign-analytics', {
        body: {
          action: 'predict_performance',
          tenant_id: userTenant.id,
          data: { 
            campaign_id: campaignId,
            prediction_days: predictionDays
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Prediction Generated",
        description: `Performance prediction for ${data.prediction_period_days} days completed`,
      });
    },
    onError: (error) => {
      console.error('Error predicting performance:', error);
      toast({
        title: "Prediction Failed",
        description: "Failed to generate performance prediction",
        variant: "destructive",
      });
    },
  });
}

// Sync Cross-Pillar Data Hook
export function useSyncCrossPillarData() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async (campaignId: string): Promise<any> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      const { data, error } = await supabase.functions.invoke('unified-campaign-analytics', {
        body: {
          action: 'cross_pillar_sync',
          tenant_id: userTenant.id,
          data: { campaign_id: campaignId }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, campaignId) => {
      queryClient.invalidateQueries({ queryKey: ['campaign-performance', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaign-overview', campaignId] });
      toast({
        title: "Sync Complete",
        description: `Synced ${data.synced_pillars} pillars successfully`,
      });
    },
    onError: (error) => {
      console.error('Error syncing data:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync cross-pillar data",
        variant: "destructive",
      });
    },
  });
}

// Campaign Analytics Dashboard Hook
export function useCampaignAnalyticsDashboard(campaignId: string) {
  const { data: overview } = useCampaignOverview(campaignId);
  const { data: performance } = useLatestCampaignPerformance(campaignId);
  const { data: attribution } = useCampaignAttribution(campaignId);
  const { data: insights } = useCampaignInsights(campaignId, 'new');
  const { data: roi } = useCampaignROI(campaignId);
  const { data: pillarComparison } = usePillarPerformanceComparison(campaignId);

  return {
    overview,
    performance,
    attribution,
    insights,
    roi,
    pillarComparison,
    isLoading: !overview || !performance || !attribution || !roi,
    hasData: overview && performance && attribution
  };
}