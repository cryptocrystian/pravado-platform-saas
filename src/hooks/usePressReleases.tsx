
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

export type MediaOutlet = Database['public']['Tables']['media_outlets']['Row'];
export type PressRelease = Database['public']['Tables']['press_releases']['Row'];

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
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['media-outlets', userTenant?.id],
    queryFn: async (): Promise<MediaOutlet[]> => {
      if (!userTenant?.id) return [];
      
      console.log('🔍 Fetching media outlets for tenant:', userTenant.id);
      
      const { data, error } = await supabase
        .from('media_outlets')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .eq('is_active', true)
        .order('domain_authority', { ascending: false });
      
      if (error) {
        console.error('❌ Media outlets query error:', error);
        throw error;
      }
      
      console.log(`📊 Fetched ${data?.length || 0} media outlets`);
      return data || [];
    },
    enabled: !!userTenant?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useCreatePressRelease() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (pressRelease: any) => {
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
