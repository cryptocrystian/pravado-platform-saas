
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

// Mock data for HARO requests
const mockHARORequests: HARORequest[] = [
  {
    id: '1',
    subject: 'Seeking Marketing Technology Experts',
    description: 'Looking for marketing professionals who have implemented AI-powered marketing automation systems. Need specific examples of ROI improvements and implementation challenges.',
    requirements: 'Must have 3+ years experience with marketing automation, specific metrics required',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    journalist_name: 'Sarah Johnson',
    journalist_email: 'sarah@marketingtech.com',
    outlet: 'Marketing Technology Weekly',
    category: 'Marketing',
    keywords: ['marketing automation', 'AI', 'ROI', 'technology'],
    industry_tags: ['Marketing', 'Technology'],
    is_active: true,
    created_at: new Date().toISOString(),
    difficulty_score: 65,
    opportunity_score: 85
  },
  {
    id: '2',
    subject: 'Small Business Growth Stories',
    description: 'Seeking small business owners who have scaled from $1M to $10M+ revenue. Looking for specific growth strategies and lessons learned.',
    requirements: 'Revenue verification required, must be willing to share specific numbers',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    journalist_name: 'Mike Chen',
    journalist_email: 'mchen@bizgrowth.com',
    outlet: 'Business Growth Magazine',
    category: 'Business',
    keywords: ['small business', 'growth', 'scaling', 'revenue'],
    industry_tags: ['Business', 'Entrepreneurship'],
    is_active: true,
    created_at: new Date().toISOString(),
    difficulty_score: 75,
    opportunity_score: 90
  },
  {
    id: '3',
    subject: 'Digital Transformation Case Studies',
    description: 'Looking for enterprise executives who led successful digital transformation initiatives. Need before/after metrics and key challenges overcome.',
    requirements: 'C-level or VP level only, enterprise companies with 1000+ employees',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    journalist_name: 'Lisa Rodriguez',
    journalist_email: 'lrodriguez@enterprise.com',
    outlet: 'Enterprise Tech Today',
    category: 'Technology',
    keywords: ['digital transformation', 'enterprise', 'technology', 'leadership'],
    industry_tags: ['Technology', 'Enterprise'],
    is_active: true,
    created_at: new Date().toISOString(),
    difficulty_score: 80,
    opportunity_score: 95
  }
];

export function useHARORequests() {
  return useQuery({
    queryKey: ['haro-requests'],
    queryFn: async (): Promise<HARORequest[]> => {
      // TODO: Replace with actual Supabase query when types are available
      // const { data, error } = await supabase
      //   .from('haro_requests')
      //   .select('*')
      //   .eq('is_active', true)
      //   .gte('deadline', new Date().toISOString())
      //   .order('deadline', { ascending: true });
      // if (error) throw error;
      // return data || [];
      
      return mockHARORequests;
    },
  });
}

export function useHAROMatches() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['haro-matches', userTenant?.id],
    queryFn: async (): Promise<HAROMatch[]> => {
      if (!userTenant?.id) return [];
      
      // TODO: Replace with actual Supabase query when types are available
      // const { data, error } = await supabase
      //   .from('haro_matches')
      //   .select(`
      //     *,
      //     haro_requests!inner(*)
      //   `)
      //   .eq('tenant_id', userTenant.id)
      //   .order('match_confidence', { ascending: false });
      // if (error) throw error;
      // return data || [];

      // Mock data for development
      const mockMatches: HAROMatch[] = [
        {
          id: '1',
          haro_request_id: '1',
          user_id: 'user-1',
          match_confidence: 92,
          match_reasons: ['Marketing automation expertise', 'AI implementation experience'],
          response_status: 'draft',
          submitted: false,
          journalist_replied: false,
          coverage_secured: false,
          coverage_value: 0,
          created_at: new Date().toISOString(),
          haro_requests: mockHARORequests[0]
        },
        {
          id: '2',
          haro_request_id: '2',
          user_id: 'user-1',
          match_confidence: 78,
          match_reasons: ['Business growth experience', 'Revenue scaling expertise'],
          response_status: 'submitted',
          submitted: true,
          submitted_at: new Date().toISOString(),
          journalist_replied: false,
          coverage_secured: false,
          coverage_value: 0,
          created_at: new Date().toISOString(),
          haro_requests: mockHARORequests[1]
        }
      ];
      
      return mockMatches;
    },
    enabled: !!userTenant?.id,
  });
}

export function useUserExpertiseProfile() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['user-expertise-profile', userTenant?.id],
    queryFn: async (): Promise<UserExpertiseProfile | null> => {
      if (!userTenant?.id) return null;
      
      // TODO: Replace with actual Supabase query when types are available
      // const { data, error } = await supabase
      //   .from('user_expertise_profiles')
      //   .select('*')
      //   .eq('tenant_id', userTenant.id)
      //   .eq('is_active', true)
      //   .single();
      // if (error && error.code !== 'PGRST116') throw error;
      // return data;

      // Mock expertise profile
      return {
        id: 'profile-1',
        tenant_id: userTenant.id,
        user_id: 'user-1',
        full_name: 'Marketing Expert',
        title: 'Marketing Director',
        company: 'Tech Solutions Inc',
        expertise_areas: ['Marketing Automation', 'AI Implementation', 'Digital Strategy'],
        keywords: ['marketing', 'automation', 'AI', 'ROI', 'technology'],
        bio: 'Experienced marketing professional with 8+ years in marketing automation and AI implementation.',
        credentials: 'MBA Marketing, Google Analytics Certified, HubSpot Certified',
        industries: ['Technology', 'SaaS', 'Marketing'],
        contact_email: 'expert@techsolutions.com',
        notification_preferences: { email: true, in_app: true, sms: false },
        matching_threshold: 70,
        is_active: true
      };
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
      // TODO: Replace with actual Supabase mutation when types are available
      // const { error } = await supabase
      //   .from('user_expertise_profiles')
      //   .insert({
      //     ...profile,
      //     tenant_id: userTenant?.id,
      //   });
      // if (error) throw error;
      
      console.log('Creating expertise profile:', profile);
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
      // TODO: Replace with actual Supabase mutation when types are available
      // const { error } = await supabase
      //   .from('haro_matches')
      //   .update(updates)
      //   .eq('id', id);
      // if (error) throw error;
      
      console.log('Updating HARO match:', id, updates);
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
      
      // TODO: Replace with actual Supabase query when types are available
      // const { data, error } = await supabase
      //   .from('haro_analytics')
      //   .select('*')
      //   .eq('tenant_id', userTenant.id)
      //   .order('date_period', { ascending: false })
      //   .limit(30);
      // if (error) throw error;
      // return data || [];

      // Mock analytics data
      return [
        {
          id: '1',
          tenant_id: userTenant.id,
          user_id: 'user-1',
          date_period: new Date().toISOString().split('T')[0],
          requests_matched: 15,
          responses_submitted: 8,
          journalist_replies: 3,
          coverage_secured: 2,
          total_coverage_value: 15000,
          average_match_confidence: 85,
          success_rate: 25,
          roi_score: 75
        }
      ];
    },
    enabled: !!userTenant?.id,
  });
}
