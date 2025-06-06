
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';

export function useSEOProjects() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-projects', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('seo_projects' as any)
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
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
    }) => {
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
      return data;
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
    queryFn: async () => {
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
      return data || [];
    },
    enabled: !!userTenant?.id,
  });
}

export function useKeywordTracking(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['keyword-tracking', userTenant?.id, projectId],
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      let query = supabase
        .from('keyword_tracking' as any)
        .select(`
          *,
          seo_keywords (*)
        `)
        .eq('tenant_id', userTenant.id);
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query.order('tracked_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userTenant?.id,
  });
}

export function useSEOCompetitors(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-competitors', userTenant?.id, projectId],
    queryFn: async () => {
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
      return data || [];
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
    queryFn: async () => {
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
      return data || [];
    },
    enabled: !!userTenant?.id,
  });
}
