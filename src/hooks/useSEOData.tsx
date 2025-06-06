
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';

// Define interfaces for our SEO data
interface SEOProject {
  id: string;
  tenant_id: string;
  name: string;
  domain: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SEOAudit {
  id: string;
  tenant_id: string;
  project_id?: string;
  audit_type: string;
  overall_score: number;
  recommendations: any[];
  created_at: string;
}

interface KeywordTracking {
  id: string;
  tenant_id: string;
  project_id?: string;
  keyword_id?: string;
  position: number;
  previous_position?: number;
  tracked_at: string;
}

interface SEOCompetitor {
  id: string;
  tenant_id: string;
  project_id?: string;
  competitor_domain: string;
  competitor_name?: string;
  visibility_score: number;
}

interface ContentOptimization {
  id: string;
  tenant_id: string;
  content_id?: string;
  target_keyword: string;
  seo_score: number;
  optimization_suggestions: any[];
}

export function useSEOProjects() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-projects', userTenant?.id],
    queryFn: async (): Promise<SEOProject[]> => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('seo_projects' as any)
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as SEOProject[];
    },
    enabled: !!userTenant?.id,
  });
}

export function useCreateSEOProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async (projectData: {
      name: string;
      domain: string;
      status?: string;
    }): Promise<SEOProject> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      const { data, error } = await supabase
        .from('seo_projects' as any)
        .insert({
          tenant_id: userTenant.id,
          name: projectData.name,
          domain: projectData.domain,
          status: projectData.status || 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data as SEOProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-projects'] });
      toast({
        title: "SEO Project Created",
        description: "Your SEO project has been created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating SEO project:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create SEO project",
        variant: "destructive",
      });
    },
  });
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
      
      if (error) throw error;
      return (data || []) as SEOAudit[];
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
      
      let query = supabase
        .from('keyword_tracking' as any)
        .select('*')
        .eq('tenant_id', userTenant.id);
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query.order('tracked_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as KeywordTracking[];
    },
    enabled: !!userTenant?.id,
  });
}

export function useSEOCompetitors(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-competitors', userTenant?.id, projectId],
    queryFn: async (): Promise<SEOCompetitor[]> => {
      if (!userTenant?.id) return [];
      
      let query = supabase
        .from('seo_competitors' as any)
        .select('*')
        .eq('tenant_id', userTenant.id);
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query.order('visibility_score', { ascending: false });
      
      if (error) throw error;
      return (data || []) as SEOCompetitor[];
    },
    enabled: !!userTenant?.id,
  });
}

export function useEnhancedSEOKeywords(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['enhanced-seo-keywords', userTenant?.id, projectId],
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      let query = supabase
        .from('seo_keywords')
        .select('*')
        .eq('tenant_id', userTenant.id);
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
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
      
      let query = supabase
        .from('seo_content_optimization' as any)
        .select('*')
        .eq('tenant_id', userTenant.id);
      
      if (contentId) {
        query = query.eq('content_id', contentId);
      }
      
      const { data, error } = await query.order('seo_score', { ascending: false });
      
      if (error) throw error;
      return (data || []) as ContentOptimization[];
    },
    enabled: !!userTenant?.id,
  });
}
