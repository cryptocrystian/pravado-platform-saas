
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';

export type JournalistContact = {
  id: string;
  tenant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  outlet: string;
  beat: string;
  location?: string;
  title?: string;
  bio?: string;
  twitter_handle?: string;
  linkedin_url?: string;
  relationship_score: number;
  interaction_count: number;
  last_contacted?: string;
  preferences: any;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type JournalistOutreach = {
  id: string;
  tenant_id: string;
  journalist_id: string;
  campaign_id?: string;
  press_release_id?: string;
  subject: string;
  message: string;
  outreach_type: string;
  status: string;
  sent_at: string;
  opened_at?: string;
  replied_at?: string;
  reply_sentiment?: string;
  follow_up_scheduled?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  journalist_contacts?: JournalistContact;
};

export function useJournalistContacts() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['journalist-contacts', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('journalist_contacts')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .eq('is_active', true)
        .order('relationship_score', { ascending: false });

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
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('journalist_outreach')
        .select(`
          *,
          journalist_contacts(*)
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
    mutationFn: async (contact: Partial<JournalistContact>) => {
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
    mutationFn: async (outreach: Partial<JournalistOutreach>) => {
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
