import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

// Supabase types
export type HARORequest = Database['public']['Tables']['haro_requests']['Row'];
export type HARORequestInsert = Database['public']['Tables']['haro_requests']['Insert'];
export type HARORequestUpdate = Database['public']['Tables']['haro_requests']['Update'];

export type HAROMatch = Database['public']['Tables']['haro_matches']['Row'] & {
  haro_requests?: HARORequest;
};
export type HAROMatchInsert = Database['public']['Tables']['haro_matches']['Insert'];
export type HAROMatchUpdate = Database['public']['Tables']['haro_matches']['Update'];

export type UserExpertiseProfile = Database['public']['Tables']['user_expertise_profiles']['Row'];
export type UserExpertiseProfileInsert = Database['public']['Tables']['user_expertise_profiles']['Insert'];
export type UserExpertiseProfileUpdate = Database['public']['Tables']['user_expertise_profiles']['Update'];

export type HAROAnalytics = Database['public']['Tables']['haro_analytics']['Row'];

// Enhanced HARO request with additional computed fields
export interface EnhancedHARORequest extends HARORequest {
  days_until_deadline?: number;
  match_score?: number;
  is_expired?: boolean;
}

// Enhanced HARO match with additional data
export interface EnhancedHAROMatch extends HAROMatch {
  days_since_match?: number;
  response_time_average?: number;
}

export function useHARORequests(filters?: {
  category?: string;
  outlet?: string;
  searchTerm?: string;
  isActive?: boolean;
  minOpportunityScore?: number;
}) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['haro-requests', userTenant?.id, filters],
    queryFn: async (): Promise<EnhancedHARORequest[]> => {
      if (!userTenant?.id) return [];
      
      console.log('🔍 Fetching HARO requests for tenant:', userTenant.id);
      
      let query = supabase
        .from('haro_requests')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .eq('is_active', filters?.isActive ?? true)
        .gte('deadline', new Date().toISOString()) // Only active requests
        .order('deadline', { ascending: true });

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.outlet) {
        query = query.ilike('outlet', `%${filters.outlet}%`);
      }
      if (filters?.searchTerm) {
        query = query.or(`subject.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,journalist_name.ilike.%${filters.searchTerm}%`);
      }
      if (filters?.minOpportunityScore) {
        query = query.gte('opportunity_score', filters.minOpportunityScore);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching HARO requests:', error);
        throw error;
      }
      
      // Enhance data with computed fields
      const enhancedData: EnhancedHARORequest[] = (data || []).map(request => {
        const deadline = request.deadline ? new Date(request.deadline) : null;
        const now = new Date();
        
        return {
          ...request,
          days_until_deadline: deadline ? Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null,
          is_expired: deadline ? deadline < now : false,
          match_score: 0 // Will be calculated during matching
        };
      });
      
      return enhancedData;
    },
    enabled: !!userTenant?.id,
  });
}

export function useHAROMatches(filters?: {
  status?: string;
  coverageSecured?: boolean;
}) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['haro-matches', userTenant?.id, filters],
    queryFn: async (): Promise<EnhancedHAROMatch[]> => {
      if (!userTenant?.id) return [];
      
      console.log('🔍 Fetching HARO matches for tenant:', userTenant.id);
      
      let query = supabase
        .from('haro_matches')
        .select(`
          *,
          haro_requests!inner(*)
        `)
        .eq('tenant_id', userTenant.id)
        .order('match_confidence', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query.eq('response_status', filters.status);
      }
      if (filters?.coverageSecured !== undefined) {
        query = query.eq('coverage_secured', filters.coverageSecured);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching HARO matches:', error);
        throw error;
      }
      
      // Enhance data with computed fields
      const enhancedData: EnhancedHAROMatch[] = (data || []).map(match => {
        const createdAt = new Date(match.created_at);
        const now = new Date();
        
        return {
          ...match,
          days_since_match: Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)),
          response_time_average: match.submitted_at ? 
            Math.ceil((new Date(match.submitted_at).getTime() - createdAt.getTime()) / (1000 * 60 * 60)) : 0
        };
      });
      
      return enhancedData;
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
      
      console.log('🔍 Fetching expertise profile for tenant:', userTenant.id);
      
      const { data, error } = await supabase
        .from('user_expertise_profiles')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching expertise profile:', error);
        throw error;
      }
      
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
    mutationFn: async (profile: Partial<UserExpertiseProfileInsert>) => {
      if (!userTenant?.id) throw new Error('No tenant ID available');
      
      console.log('Creating expertise profile:', profile);
      
      const { data, error } = await supabase
        .from('user_expertise_profiles')
        .insert({
          ...profile,
          tenant_id: userTenant.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
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

export function useUpdateExpertiseProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UserExpertiseProfileUpdate> }) => {
      console.log('Updating expertise profile:', id, updates);
      
      const { data, error } = await supabase
        .from('user_expertise_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-expertise-profile'] });
      toast({
        title: "Success",
        description: "Expertise profile updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating expertise profile:', error);
      toast({
        title: "Error",
        description: "Failed to update expertise profile",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateHAROMatch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<HAROMatchUpdate> }) => {
      console.log('Updating HARO match:', id, updates);
      
      const { data, error } = await supabase
        .from('haro_matches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
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

export function useCreateHAROMatch() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (matchData: Partial<HAROMatchInsert>) => {
      if (!userTenant?.id) throw new Error('No tenant ID available');
      
      console.log('Creating HARO match:', matchData);
      
      const { data, error } = await supabase
        .from('haro_matches')
        .insert({
          ...matchData,
          tenant_id: userTenant.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['haro-matches'] });
      toast({
        title: "Success",
        description: "HARO match created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating HARO match:', error);
      toast({
        title: "Error",
        description: "Failed to create HARO match",
        variant: "destructive",
      });
    },
  });
}

// AI-powered matching logic using existing journalist_contacts
export function useGenerateHAROMatches() {
  const { data: userTenant } = useUserTenant();
  const { data: expertiseProfile } = useUserExpertiseProfile();
  const createMatch = useCreateHAROMatch();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (haroRequestId: string) => {
      if (!userTenant?.id || !expertiseProfile) {
        throw new Error('Expertise profile required for matching');
      }

      console.log('🧠 Generating AI-powered HARO matches for request:', haroRequestId);

      // Get the HARO request details
      const { data: haroRequest, error: requestError } = await supabase
        .from('haro_requests')
        .select('*')
        .eq('id', haroRequestId)
        .single();

      if (requestError) throw requestError;

      // Calculate match confidence based on keyword overlap and expertise
      const calculateMatchConfidence = (request: HARORequest, profile: UserExpertiseProfile): number => {
        let confidence = 0;
        
        // Keyword matching (40% weight)
        const keywordOverlap = request.keywords.filter(keyword => 
          profile.keywords.some(userKeyword => 
            userKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(userKeyword.toLowerCase())
          )
        ).length;
        confidence += (keywordOverlap / Math.max(request.keywords.length, 1)) * 40;

        // Industry matching (30% weight)
        const industryOverlap = request.industry_tags.filter(industry => 
          profile.industries.includes(industry)
        ).length;
        confidence += (industryOverlap / Math.max(request.industry_tags.length, 1)) * 30;

        // Expertise area matching (30% weight)
        const expertiseMatch = profile.expertise_areas.some(area =>
          request.description.toLowerCase().includes(area.toLowerCase()) ||
          request.subject.toLowerCase().includes(area.toLowerCase())
        );
        confidence += expertiseMatch ? 30 : 0;

        return Math.min(100, Math.round(confidence));
      };

      const matchConfidence = calculateMatchConfidence(haroRequest, expertiseProfile);

      // Only create match if confidence is above user's threshold
      if (matchConfidence >= expertiseProfile.matching_threshold) {
        const matchReasons = [];
        
        // Determine match reasons
        const keywordMatches = haroRequest.keywords.filter(keyword => 
          expertiseProfile.keywords.some(userKeyword => 
            userKeyword.toLowerCase().includes(keyword.toLowerCase())
          )
        );
        if (keywordMatches.length > 0) {
          matchReasons.push(`Keyword expertise: ${keywordMatches.join(', ')}`);
        }

        const industryMatches = haroRequest.industry_tags.filter(industry => 
          expertiseProfile.industries.includes(industry)
        );
        if (industryMatches.length > 0) {
          matchReasons.push(`Industry experience: ${industryMatches.join(', ')}`);
        }

        const expertiseMatches = expertiseProfile.expertise_areas.filter(area =>
          haroRequest.description.toLowerCase().includes(area.toLowerCase())
        );
        if (expertiseMatches.length > 0) {
          matchReasons.push(`Direct expertise: ${expertiseMatches.join(', ')}`);
        }

        // Create the match
        await createMatch.mutateAsync({
          haro_request_id: haroRequestId,
          user_expertise_profile_id: expertiseProfile.id,
          match_confidence: matchConfidence,
          match_reasons: matchReasons,
          response_status: 'draft'
        });

        return { 
          matched: true, 
          confidence: matchConfidence, 
          reasons: matchReasons 
        };
      }

      return { 
        matched: false, 
        confidence: matchConfidence, 
        threshold: expertiseProfile.matching_threshold 
      };
    },
    onSuccess: (result) => {
      if (result.matched) {
        toast({
          title: "Match Found!",
          description: `HARO opportunity matched with ${result.confidence}% confidence`,
        });
      } else {
        toast({
          title: "No Match",
          description: `Match confidence (${result.confidence}%) below threshold (${result.threshold}%)`,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error('Error generating HARO matches:', error);
      toast({
        title: "Error",
        description: "Failed to generate HARO matches",
        variant: "destructive",
      });
    },
  });
}

export function useHAROAnalytics() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['haro-analytics', userTenant?.id],
    queryFn: async (): Promise<HAROAnalytics[]> => {
      if (!userTenant?.id) return [];
      
      console.log('📊 Fetching HARO analytics for tenant:', userTenant.id);
      
      const { data, error } = await supabase
        .from('haro_analytics')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('date_period', { ascending: false })
        .limit(30);
      
      if (error) {
        console.error('Error fetching HARO analytics:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!userTenant?.id,
  });
}

export function useCreateHARORequest() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (requestData: Partial<HARORequestInsert>) => {
      if (!userTenant?.id) throw new Error('No tenant ID available');
      
      console.log('Creating HARO request:', requestData);
      
      const { data, error } = await supabase
        .from('haro_requests')
        .insert({
          ...requestData,
          tenant_id: userTenant.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['haro-requests'] });
      toast({
        title: "Success",
        description: "HARO request created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating HARO request:', error);
      toast({
        title: "Error",
        description: "Failed to create HARO request",
        variant: "destructive",
      });
    },
  });
}

// Batch process all active HARO requests for matching
export function useBatchProcessHAROMatching() {
  const { data: userTenant } = useUserTenant();
  const { data: activeRequests } = useHARORequests({ isActive: true });
  const generateMatches = useGenerateHAROMatches();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      if (!userTenant?.id || !activeRequests?.length) {
        throw new Error('No active HARO requests to process');
      }

      console.log('🔄 Batch processing HARO matching for', activeRequests.length, 'requests');

      const results = [];
      for (const request of activeRequests) {
        try {
          const result = await generateMatches.mutateAsync(request.id);
          results.push({ requestId: request.id, ...result });
        } catch (error) {
          console.error('Error processing request:', request.id, error);
          results.push({ requestId: request.id, error: error.message });
        }
      }

      return results;
    },
    onSuccess: (results) => {
      const matchCount = results.filter(r => r.matched).length;
      toast({
        title: "Batch Processing Complete",
        description: `Found ${matchCount} matches from ${results.length} requests`,
      });
    },
    onError: (error) => {
      console.error('Error in batch processing:', error);
      toast({
        title: "Error",
        description: "Failed to process HARO matching",
        variant: "destructive",
      });
    },
  });
}