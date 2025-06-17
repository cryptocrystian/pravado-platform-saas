
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';

export interface SEOProject {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  website_url: string;
  target_location?: string;
  target_language?: string;
  tracking_frequency?: string;
  competitor_analysis_enabled?: boolean;
  technical_audit_enabled?: boolean;
  content_optimization_enabled?: boolean;
  status: string;
  last_audit_at?: string;
  next_audit_at?: string;
  total_keywords?: number;
  avg_position?: number;
  organic_traffic_estimate?: number;
  visibility_score?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export function useSEOProjects() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-projects', userTenant?.id],
    queryFn: async (): Promise<SEOProject[]> => {
      if (!userTenant?.id) return [];
      
      try {
        const { data, error } = await supabase
          .from('seo_projects')
          .select('*')
          .eq('tenant_id', userTenant.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching SEO projects:', error);
          return [];
        }
        return (data as unknown as SEOProject[]) || [];
      } catch (error) {
        console.error('Error in useSEOProjects:', error);
        return [];
      }
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
      description?: string;
      website_url: string;
      target_location?: string;
      target_language?: string;
      tracking_frequency?: string;
      competitor_analysis_enabled?: boolean;
      technical_audit_enabled?: boolean;
      content_optimization_enabled?: boolean;
      status?: string;
    }): Promise<SEOProject> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      try {
        const { data, error } = await supabase
          .from('seo_projects')
          .insert({
            tenant_id: userTenant.id,
            name: projectData.name,
            description: projectData.description,
            website_url: projectData.website_url,
            target_location: projectData.target_location || 'US',
            target_language: projectData.target_language || 'en',
            tracking_frequency: projectData.tracking_frequency || 'daily',
            competitor_analysis_enabled: projectData.competitor_analysis_enabled ?? true,
            technical_audit_enabled: projectData.technical_audit_enabled ?? true,
            content_optimization_enabled: projectData.content_optimization_enabled ?? true,
            status: projectData.status || 'active'
          })
          .select()
          .single();

        if (error) throw error;
        return data as unknown as SEOProject;
      } catch (error) {
        console.error('Error creating SEO project:', error);
        throw error;
      }
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
