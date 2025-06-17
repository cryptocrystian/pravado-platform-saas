
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

export type JournalistContact = Database['public']['Tables']['journalist_contacts']['Row'];
export type JournalistContactInsert = Database['public']['Tables']['journalist_contacts']['Insert'];
export type JournalistContactUpdate = Database['public']['Tables']['journalist_contacts']['Update'];
export type MediaRelationship = Database['public']['Tables']['media_relationships']['Row'];
export type JournalistOutreach = Database['public']['Tables']['journalist_outreach']['Row'];

// Enhanced journalist contact with additional computed fields
export interface EnhancedJournalistContact extends JournalistContact {
  success_rate?: number;
  days_since_contact?: number;
  response_time_average?: number;
}

export function useJournalistContacts(filters?: {
  beat?: string;
  outlet?: string;
  searchTerm?: string;
  verificationStatus?: string;
  minRelationshipScore?: number;
}) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['journalist-contacts', userTenant?.id, filters],
    queryFn: async (): Promise<EnhancedJournalistContact[]> => {
      if (!userTenant?.id) return [];
      
      console.log('🔍 Fetching journalist contacts for tenant:', userTenant.id);
      
      let query = supabase
        .from('journalist_contacts')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .eq('is_active', true);

      // Apply filters
      if (filters?.beat) {
        query = query.eq('beat', filters.beat);
      }
      if (filters?.outlet) {
        query = query.eq('outlet', filters.outlet);
      }
      if (filters?.searchTerm) {
        query = query.or(`first_name.ilike.%${filters.searchTerm}%,last_name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%,outlet.ilike.%${filters.searchTerm}%`);
      }
      if (filters?.verificationStatus) {
        query = query.eq('verification_status', filters.verificationStatus);
      }
      if (filters?.minRelationshipScore) {
        query = query.gte('relationship_score', filters.minRelationshipScore);
      }

      query = query.order('relationship_score', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('❌ Journalist contacts query error:', error);
        throw error;
      }
      
      console.log(`📊 Fetched ${data?.length || 0} journalist contacts`);
      
      // Enhance data with computed fields
      const enhancedData: EnhancedJournalistContact[] = data?.map(contact => {
        const successRate = contact.interaction_count && contact.interaction_count > 0 
          ? ((contact.interaction_count || 0) / (contact.interaction_count || 1)) * 100 
          : 0;
        
        const daysSinceContact = contact.last_contacted
          ? Math.floor((Date.now() - new Date(contact.last_contacted).getTime()) / (1000 * 60 * 60 * 24))
          : null;

        return {
          ...contact,
          success_rate: successRate,
          days_since_contact: daysSinceContact,
        };
      }) || [];
      
      return enhancedData;
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
    mutationFn: async (contact: Omit<JournalistContactInsert, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => {
      if (!userTenant?.id) {
        throw new Error('No tenant ID available');
      }

      const { data, error } = await supabase
        .from('journalist_contacts')
        .insert({
          ...contact,
          tenant_id: userTenant.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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

export function useUpdateJournalistContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: JournalistContactUpdate }) => {
      const { data, error } = await supabase
        .from('journalist_contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalist-contacts'] });
      toast({
        title: "Success",
        description: "Journalist contact updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating journalist contact:', error);
      toast({
        title: "Error",
        description: "Failed to update journalist contact",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteJournalistContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('journalist_contacts')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalist-contacts'] });
      toast({
        title: "Success",
        description: "Journalist contact deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting journalist contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete journalist contact",
        variant: "destructive",
      });
    },
  });
}

export function useJournalistContact(id: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['journalist-contact', id],
    queryFn: async (): Promise<JournalistContact | null> => {
      if (!userTenant?.id || !id) return null;
      
      const { data, error } = await supabase
        .from('journalist_contacts')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', userTenant.id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw error;
      }
      
      return data;
    },
    enabled: !!userTenant?.id && !!id,
  });
}

export function useJournalistContactsByOutlet(outlet: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['journalist-contacts-by-outlet', userTenant?.id, outlet],
    queryFn: async (): Promise<JournalistContact[]> => {
      if (!userTenant?.id || !outlet) return [];
      
      const { data, error } = await supabase
        .from('journalist_contacts')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .eq('outlet', outlet)
        .eq('is_active', true)
        .order('relationship_score', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userTenant?.id && !!outlet,
  });
}

export function useJournalistContactsByBeat(beat: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['journalist-contacts-by-beat', userTenant?.id, beat],
    queryFn: async (): Promise<JournalistContact[]> => {
      if (!userTenant?.id || !beat) return [];
      
      const { data, error } = await supabase
        .from('journalist_contacts')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .eq('beat', beat)
        .eq('is_active', true)
        .order('relationship_score', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userTenant?.id && !!beat,
  });
}

export function useBulkUpdateJournalistContacts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: { id: string; updates: JournalistContactUpdate }[]) => {
      const results = await Promise.all(
        updates.map(({ id, updates }) =>
          supabase
            .from('journalist_contacts')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
        )
      );

      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error(`Failed to update ${errors.length} contacts`);
      }

      return results.map(result => result.data).filter(Boolean);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['journalist-contacts'] });
      toast({
        title: "Success",
        description: `${data.length} journalist contacts updated successfully`,
      });
    },
    onError: (error) => {
      console.error('Error bulk updating journalist contacts:', error);
      toast({
        title: "Error",
        description: "Failed to update journalist contacts",
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
