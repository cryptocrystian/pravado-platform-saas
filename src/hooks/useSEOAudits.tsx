
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';

export interface SEOAudit {
  id: string;
  tenant_id: string;
  project_id?: string;
  audit_type: string;
  overall_score: number;
  recommendations: any[];
  created_at: string;
}

export function useSEOAudits(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-audits', userTenant?.id, projectId],
    queryFn: async (): Promise<SEOAudit[]> => {
      if (!userTenant?.id) return [];
      
      let query = supabase
        .from('seo_audits' as any)
        .select('*')
        .eq('tenant_id', userTenant.id);
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching SEO audits:', error);
        return [];
      }
      return (data as SEOAudit[]) || [];
    },
    enabled: !!userTenant?.id,
  });
}
