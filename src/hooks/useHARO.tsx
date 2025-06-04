
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';

export type HARORequest = {
  id: string;
  subject: string;
  description: string;
  requirements?: string;
  deadline?: string;
  journalist_name?: string;
  journalist_email?: string;
  outlet?: string;
  category?: string;
  keywords: string[];
  industry_tags: string[];
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  difficulty_score: number;
  opportunity_score: number;
};

export type HAROMatch = {
  id: string;
  haro_request_id: string;
  user_id: string;
  match_confidence: number;
  match_reasons: string[];
  ai_generated_response?: string;
  user_edited_response?: string;
  final_response?: string;
  response_status: string;
  submitted: boolean;
  submitted_at?: string;
  journalist_replied: boolean;
  coverage_secured: boolean;
  coverage_url?: string;
  coverage_value: number;
  created_at: string;
  haro_requests?: HARORequest;
};

export type UserExpertiseProfile = {
  id: string;
  tenant_id: string;
  user_id: string;
  full_name: string;
  title?: string;
  company?: string;
  expertise_areas: string[];
  keywords: string[];
  bio?: string;
  credentials?: string;
  industries: string[];
  contact_email?: string;
  notification_preferences: any;
  matching_threshold: number;
  is_active: boolean;
};

export function useHARORequests() {
  return useQuery({
    queryKey: ['haro-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('haro_requests')
        .select('*')
        .eq('is_active', true)
        .gte('deadline', new Date().toISOString())
        .order('deadline', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useHAROMatches() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['haro-matches', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('haro_matches')
        .select(`
          *,
          haro_requests!inner(*)
        `)
        .eq('tenant_id', userTenant.id)
        .order('match_confidence', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userTenant?.id,
  });
}

export function useUserExpertiseProfile() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['user-expertise-profile', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return null;
      
      const { data, error } = await supabase
        .from('user_expertise_profiles')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!userTenant?.id,
  });
}

export function useCreateExpertiseProfile() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profile: Partial<UserExpertiseProfile>) => {
      const { error } = await supabase
        .from('user_expertise_profiles')
        .insert({
          ...profile,
          tenant_id: userTenant?.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-expertise-profile'] });
      toast({
        title: "Success",
        description: "Expertise profile created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating expertise profile:', error);
      toast({
        title: "Error",
        description: "Failed to create expertise profile",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateHAROMatch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<HAROMatch> }) => {
      const { error } = await supabase
        .from('haro_matches')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['haro-matches'] });
      toast({
        title: "Success",
        description: "HARO response updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating HARO match:', error);
      toast({
        title: "Error",
        description: "Failed to update HARO response",
        variant: "destructive",
      });
    },
  });
}

export function useHAROAnalytics() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['haro-analytics', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return null;
      
      const { data, error } = await supabase
        .from('haro_analytics')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('date_period', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data || [];
    },
    enabled: !!userTenant?.id,
  });
}
