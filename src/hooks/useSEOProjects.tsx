
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';

export interface SEOProject {
  id: string;
  tenant_id: string;
  name: string;
  domain: string;
  status: string;
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
          .from('seo_projects' as any)
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
      domain: string;
      status?: string;
    }): Promise<SEOProject> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      try {
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
