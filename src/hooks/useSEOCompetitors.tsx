
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';

export interface SEOCompetitor {
  id: string;
  tenant_id: string;
  project_id?: string;
  competitor_domain: string;
  competitor_name?: string;
  visibility_score: number;
}

export interface ContentOptimization {
  id: string;
  tenant_id: string;
  content_id?: string;
  target_keyword: string;
  seo_score: number;
  optimization_suggestions: any[];
}

export function useSEOCompetitors(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-competitors', userTenant?.id, projectId],
    queryFn: async (): Promise<SEOCompetitor[]> => {
      if (!userTenant?.id) return [];
      
      try {
        let query = supabase
          .from('seo_competitors' as any)
          .select('*')
          .eq('tenant_id', userTenant.id);
        
        if (projectId) {
          query = query.eq('project_id', projectId);
        }
        
        const { data, error } = await query.order('visibility_score', { ascending: false });
        
        if (error) {
          console.error('Error fetching SEO competitors:', error);
          return [];
        }
        return (data as SEOCompetitor[]) || [];
      } catch (error) {
        console.error('Error in useSEOCompetitors:', error);
        return [];
      }
    },
    enabled: !!userTenant?.id,
  });
}

export function useContentOptimization(contentId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-content-optimization', userTenant?.id, contentId],
    queryFn: async (): Promise<ContentOptimization[]> => {
      if (!userTenant?.id) return [];
      
      try {
        let query = supabase
          .from('seo_content_optimization' as any)
          .select('*')
          .eq('tenant_id', userTenant.id);
        
        if (contentId) {
          query = query.eq('content_id', contentId);
        }
        
        const { data, error } = await query.order('seo_score', { ascending: false });
        
        if (error) {
          console.error('Error fetching content optimization:', error);
          return [];
        }
        return (data as ContentOptimization[]) || [];
      } catch (error) {
        console.error('Error in useContentOptimization:', error);
        return [];
      }
    },
    enabled: !!userTenant?.id,
  });
}
