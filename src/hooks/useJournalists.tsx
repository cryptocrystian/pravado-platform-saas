
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
    queryFn: async (): Promise<JournalistContact[]> => {
      if (!userTenant?.id) return [];
      
      // TODO: Replace with actual Supabase query when types are available
      // const { data, error } = await supabase
      //   .from('journalist_contacts')
      //   .select('*')
      //   .eq('tenant_id', userTenant.id)
      //   .eq('is_active', true)
      //   .order('relationship_score', { ascending: false });
      // if (error) throw error;
      // return data || [];

      // Mock journalist contacts
      const mockContacts: JournalistContact[] = [
        {
          id: '1',
          tenant_id: userTenant.id,
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah@marketingtech.com',
          phone: '+1-555-0123',
          outlet: 'Marketing Technology Weekly',
          beat: 'Marketing Automation',
          location: 'San Francisco, CA',
          title: 'Senior Technology Reporter',
          bio: 'Covers marketing technology trends and automation platforms',
          twitter_handle: '@sarahtech',
          relationship_score: 85,
          interaction_count: 12,
          last_contacted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          preferences: { preferred_time: 'morning', response_style: 'data-driven' },
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          tenant_id: userTenant.id,
          first_name: 'Mike',
          last_name: 'Chen',
          email: 'mchen@bizgrowth.com',
          outlet: 'Business Growth Magazine',
          beat: 'Small Business',
          location: 'New York, NY',
          title: 'Business Editor',
          bio: 'Focuses on small business growth stories and entrepreneurship',
          relationship_score: 72,
          interaction_count: 8,
          last_contacted: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          preferences: { preferred_time: 'afternoon', response_style: 'story-focused' },
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return mockContacts;
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
      
      // TODO: Replace with actual Supabase query when types are available
      // const { data, error } = await supabase
      //   .from('journalist_outreach')
      //   .select(`
      //     *,
      //     journalist_contacts(*)
      //   `)
      //   .eq('tenant_id', userTenant.id)
      //   .order('sent_at', { ascending: false });
      // if (error) throw error;
      // return data || [];

      return [];
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
      // TODO: Replace with actual Supabase mutation when types are available
      // const { error } = await supabase
      //   .from('journalist_contacts')
      //   .insert({
      //     ...contact,
      //     tenant_id: userTenant?.id,
      //   });
      // if (error) throw error;
      
      console.log('Creating journalist contact:', contact);
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
      // TODO: Replace with actual Supabase mutation when types are available
      // const { error } = await supabase
      //   .from('journalist_outreach')
      //   .insert({
      //     ...outreach,
      //     tenant_id: userTenant?.id,
      //   });
      // if (error) throw error;
      
      console.log('Creating journalist outreach:', outreach);
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
