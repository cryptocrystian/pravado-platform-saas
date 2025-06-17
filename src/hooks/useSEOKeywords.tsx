
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';
import { seoIntelligenceService, KeywordSuggestion } from '@/services/seoIntelligenceService';

export interface SEOKeyword {
  id: string;
  tenant_id: string;
  keyword: string;
  search_volume?: number;
  ranking_position?: number;
  cpc?: number;
  competition_level?: string;
  traffic_potential?: number;
  current_url?: string;
  target_url?: string;
  project_id?: string;
  keyword_difficulty?: number;
  search_intent?: string;
  seasonal_trends?: any;
  related_keywords?: string[];
  last_position_check?: string;
  position_history?: any[];
  created_at: string;
  updated_at: string;
}

export interface KeywordTracking {
  id: string;
  tenant_id: string;
  project_id?: string;
  keyword_id?: string;
  position: number;
  previous_position?: number;
  url?: string;
  title?: string;
  description?: string;
  featured_snippet?: boolean;
  local_pack?: boolean;
  knowledge_panel?: boolean;
  image_pack?: boolean;
  video_results?: boolean;
  search_engine?: string;
  location?: string;
  device?: string;
  estimated_traffic?: number;
  click_through_rate?: number;
  tracked_at: string;
}

export interface KeywordSuggestionsData {
  id: string;
  tenant_id: string;
  project_id?: string;
  keyword: string;
  search_volume?: number;
  keyword_difficulty?: number;
  cpc?: number;
  competition_level?: string;
  search_intent?: string;
  content_gap_score?: number;
  opportunity_score?: number;
  source?: string;
  related_to_keyword?: string;
  status?: string;
  suggested_at: string;
  updated_at: string;
}

export function useSEOKeywords(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-keywords', userTenant?.id, projectId],
    queryFn: async (): Promise<SEOKeyword[]> => {
      if (!userTenant?.id) return [];
      
      try {
        let query = supabase
          .from('seo_keywords')
          .select('*')
          .eq('tenant_id', userTenant.id);
        
        if (projectId) {
          query = query.eq('project_id', projectId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching SEO keywords:', error);
          return [];
        }
        return (data as unknown as SEOKeyword[]) || [];
      } catch (error) {
        console.error('Error in useSEOKeywords:', error);
        return [];
      }
    },
    enabled: !!userTenant?.id,
  });
}

export function useKeywordTracking(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['serp-tracking', userTenant?.id, projectId],
    queryFn: async (): Promise<KeywordTracking[]> => {
      if (!userTenant?.id) return [];
      
      try {
        let query = supabase
          .from('serp_tracking')
          .select('*')
          .eq('tenant_id', userTenant.id);
        
        if (projectId) {
          query = query.eq('project_id', projectId);
        }
        
        const { data, error } = await query.order('tracked_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching SERP tracking:', error);
          return [];
        }
        return (data as unknown as KeywordTracking[]) || [];
      } catch (error) {
        console.error('Error in useKeywordTracking:', error);
        return [];
      }
    },
    enabled: !!userTenant?.id,
  });
}

// AI-Powered Keyword Research Hook
export function useKeywordResearch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async (request: {
      seedKeywords: string[];
      projectId?: string;
      country?: string;
      language?: string;
      includeQuestions?: boolean;
      includeLongTail?: boolean;
    }): Promise<KeywordSuggestion[]> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      const { data, error } = await supabase.functions.invoke('seo-intelligence', {
        body: {
          action: 'keyword_research',
          tenant_id: userTenant.id,
          data: {
            seed_keywords: request.seedKeywords,
            project_id: request.projectId,
            country: request.country || 'US',
            language: request.language || 'en',
            include_questions: request.includeQuestions,
            include_long_tail: request.includeLongTail
          }
        }
      });

      if (error) throw error;
      return data.suggestions || [];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['seo-keyword-suggestions'] });
      toast({
        title: "Keyword Research Complete",
        description: `Found ${data.length} keyword opportunities`,
      });
    },
    onError: (error) => {
      console.error('Keyword research error:', error);
      toast({
        title: "Research Failed",
        description: "Failed to complete keyword research",
        variant: "destructive",
      });
    },
  });
}

// Keyword Suggestions Hook
export function useKeywordSuggestions(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-keyword-suggestions', userTenant?.id, projectId],
    queryFn: async (): Promise<KeywordSuggestionsData[]> => {
      if (!userTenant?.id) return [];
      
      try {
        let query = supabase
          .from('seo_keyword_suggestions')
          .select('*')
          .eq('tenant_id', userTenant.id);
        
        if (projectId) {
          query = query.eq('project_id', projectId);
        }
        
        const { data, error } = await query
          .order('opportunity_score', { ascending: false })
          .limit(50);
        
        if (error) {
          console.error('Error fetching keyword suggestions:', error);
          return [];
        }
        return (data as unknown as KeywordSuggestionsData[]) || [];
      } catch (error) {
        console.error('Error in useKeywordSuggestions:', error);
        return [];
      }
    },
    enabled: !!userTenant?.id,
  });
}

// SERP Tracking Hook
export function useSERPTracking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async (request: {
      projectId: string;
      keywords: { keyword_id: string; keyword: string; }[];
      targetDomain: string;
      location?: string;
      device?: string;
    }): Promise<any> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      const { data, error } = await supabase.functions.invoke('seo-intelligence', {
        body: {
          action: 'serp_tracking',
          tenant_id: userTenant.id,
          data: {
            project_id: request.projectId,
            keywords: request.keywords,
            target_domain: request.targetDomain,
            location: request.location || 'US',
            device: request.device || 'desktop'
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['serp-tracking'] });
      toast({
        title: "SERP Tracking Complete",
        description: `Tracked ${data.keywords_tracked} keywords`,
      });
    },
    onError: (error) => {
      console.error('SERP tracking error:', error);
      toast({
        title: "Tracking Failed",
        description: "Failed to complete SERP tracking",
        variant: "destructive",
      });
    },
  });
}
