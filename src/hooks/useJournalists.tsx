
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

export type JournalistContact = Database['public']['Tables']['journalist_contacts']['Row'];
export type MediaRelationship = Database['public']['Tables']['media_relationships']['Row'];
export type JournalistOutreach = Database['public']['Tables']['journalist_outreach']['Row'];

export function useJournalistContacts() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['journalist-contacts', userTenant?.id],
    queryFn: async (): Promise<JournalistContact[]> => {
      if (!userTenant?.id) return [];
      
      console.log('🔍 Fetching journalist contacts for tenant:', userTenant.id);
      
      const { data, error } = await supabase
        .from('journalist_contacts')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .eq('is_active', true)
        .order('relationship_score', { ascending: false });

      if (error) {
        console.error('❌ Journalist contacts query error:', error);
        throw error;
      }
      
      console.log(`📊 Fetched ${data?.length || 0} journalist contacts`);
      return data || [];
    },
    enabled: !!userTenant?.id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMediaRelationships() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['media-relationships', userTenant?.id],
    queryFn: async (): Promise<MediaRelationship[]> => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('media_relationships')
        .select(`
          *,
          journalist_contacts(*),
          media_outlets(*)
        `)
        .eq('tenant_id', userTenant.id)
        .order('strength_score', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userTenant?.id,
  });
}

export function useJournalistOutreach() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['journalist-outreach', userTenant?.id],
    queryFn: async (): Promise<JournalistOutreach[]> => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('journalist_outreach')
        .select(`
          *,
          journalist_contacts(first_name, last_name, outlet),
          campaigns(name),
          press_releases(title)
        `)
        .eq('tenant_id', userTenant.id)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userTenant?.id,
  });
}

export function useCreateJournalistContact() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (contact: Omit<JournalistContact, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase
        .from('journalist_contacts')
        .insert({
          ...contact,
          tenant_id: userTenant?.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalist-contacts'] });
      toast({
        title: "Success",
        description: "Journalist contact added successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating journalist contact:', error);
      toast({
        title: "Error",
        description: "Failed to add journalist contact",
        variant: "destructive",
      });
    },
  });
}

export function useCreateJournalistOutreach() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (outreach: Omit<JournalistOutreach, 'id' | 'tenant_id' | 'created_at'>) => {
      const { error } = await supabase
        .from('journalist_outreach')
        .insert({
          ...outreach,
          tenant_id: userTenant?.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalist-outreach'] });
      toast({
        title: "Success",
        description: "Outreach sent successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating journalist outreach:', error);
      toast({
        title: "Error",
        description: "Failed to send outreach",
        variant: "destructive",
      });
    },
  });
}
