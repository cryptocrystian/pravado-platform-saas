
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';

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
  tracked_at: string;
}

export function useSEOKeywords(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-keywords', userTenant?.id, projectId],
    queryFn: async (): Promise<SEOKeyword[]> => {
      if (!userTenant?.id) return [];
      
      try {
        const { data, error } = await supabase
          .from('seo_keywords')
          .select('*')
          .eq('tenant_id', userTenant.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching SEO keywords:', error);
          return [];
        }
        return (data as SEOKeyword[]) || [];
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
    queryKey: ['keyword-tracking', userTenant?.id, projectId],
    queryFn: async (): Promise<KeywordTracking[]> => {
      if (!userTenant?.id) return [];
      
      try {
        let query = supabase
          .from('keyword_tracking' as any)
          .select('*')
          .eq('tenant_id', userTenant.id);
        
        if (projectId) {
          query = query.eq('project_id', projectId);
        }
        
        const { data, error } = await query.order('tracked_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching keyword tracking:', error);
          return [];
        }
        return (data as KeywordTracking[]) || [];
      } catch (error) {
        console.error('Error in useKeywordTracking:', error);
        return [];
      }
    },
    enabled: !!userTenant?.id,
  });
}
