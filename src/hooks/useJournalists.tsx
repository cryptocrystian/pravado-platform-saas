import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { useMemo } from 'react';

export type JournalistContact = Database['public']['Tables']['journalist_contacts']['Row'];
export type JournalistContactInsert = Database['public']['Tables']['journalist_contacts']['Insert'];
export type JournalistContactUpdate = Database['public']['Tables']['journalist_contacts']['Update'];
export type MediaRelationship = Database['public']['Tables']['media_relationships']['Row'];
export type JournalistOutreach = Database['public']['Tables']['journalist_outreach']['Row'];

export interface EnhancedJournalistContact extends JournalistContact {
  // Computed fields not in database
  success_rate?: number;
  days_since_contact?: number | null;
  response_time_average?: number;
  pitch_effectiveness?: number;
  engagement_trend?: 'increasing' | 'stable' | 'declining';
  ai_score?: number;
  predicted_response_likelihood?: number;
}

export interface JournalistFilters {
  beat?: string;
  outlet?: string;
  searchTerm?: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  minRelationshipScore?: number;
  maxRelationshipScore?: number;
  minAuthorityScore?: number;
  maxAuthorityScore?: number;
  mediaCategory?: string;
  dynamicTier?: string;
  staticTier?: string;
  beatExpertiseLevel?: 'expert' | 'intermediate' | 'beginner';
  preferredContactMethod?: string;
  timezone?: string;
  minEngagementRate?: number;
  minResponseRate?: number;
  minPitchSuccessProbability?: number;
  hasRecentInteraction?: boolean;
  sortBy?: 'relationship_score' | 'authority_score' | 'engagement_rate' | 'response_rate' | 'last_contacted';
  sortOrder?: 'asc' | 'desc';
}

export interface JournalistAnalytics {
  totalContacts: number;
  verifiedContacts: number;
  averageRelationshipScore: number;
  averageAuthorityScore: number;
  averageEngagementRate: number;
  averageResponseRate: number;
  topBeats: { beat: string; count: number }[];
  topOutlets: { outlet: string; count: number }[];
  tierDistribution: { tier: string; count: number }[];
  mediaCategoryDistribution: { category: string; count: number }[];
  recentActivityTrend: { date: string; interactions: number }[];
  successfulPitchRate: number;
  avgResponseTimeHours: number;
}

export function useJournalistContacts(filters?: JournalistFilters) {
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
      if (filters?.minRelationshipScore !== undefined) {
        query = query.gte('relationship_score', filters.minRelationshipScore);
      }
      if (filters?.maxRelationshipScore !== undefined) {
        query = query.lte('relationship_score', filters.maxRelationshipScore);
      }
      if (filters?.minAuthorityScore !== undefined) {
        query = query.gte('authority_score', filters.minAuthorityScore);
      }
      if (filters?.maxAuthorityScore !== undefined) {
        query = query.lte('authority_score', filters.maxAuthorityScore);
      }
      if (filters?.mediaCategory) {
        query = query.eq('media_category', filters.mediaCategory);
      }
      if (filters?.dynamicTier) {
        query = query.eq('dynamic_tier', filters.dynamicTier);
      }
      if (filters?.staticTier) {
        query = query.eq('static_tier', filters.staticTier);
      }
      if (filters?.beatExpertiseLevel) {
        query = query.eq('beat_expertise_level', filters.beatExpertiseLevel);
      }
      if (filters?.preferredContactMethod) {
        query = query.eq('preferred_contact_method', filters.preferredContactMethod);
      }
      if (filters?.timezone) {
        query = query.eq('timezone', filters.timezone);
      }
      if (filters?.minEngagementRate !== undefined) {
        query = query.gte('engagement_rate', filters.minEngagementRate);
      }
      if (filters?.minResponseRate !== undefined) {
        query = query.gte('response_rate', filters.minResponseRate);
      }
      if (filters?.minPitchSuccessProbability !== undefined) {
        query = query.gte('pitch_success_probability', filters.minPitchSuccessProbability);
      }
      if (filters?.hasRecentInteraction) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.gte('last_contacted', thirtyDaysAgo.toISOString());
      }

      const sortField = filters?.sortBy || 'relationship_score';
      const sortOrder = filters?.sortOrder === 'asc' ? true : false;
      query = query.order(sortField, { ascending: sortOrder });

      const { data, error } = await query;

      if (error) {
        console.error('❌ Journalist contacts query error:', error);
        throw error;
      }
      
      console.log(`📊 Fetched ${data?.length || 0} journalist contacts`);
      
      const enhancedData: EnhancedJournalistContact[] = data?.map(contact => {
        const successRate = contact.total_interactions && contact.total_interactions > 0 
          ? ((contact.successful_pitches || 0) / contact.total_interactions) * 100 
          : 0;
        
        const daysSinceContact = contact.last_contacted
          ? Math.floor((Date.now() - new Date(contact.last_contacted).getTime()) / (1000 * 60 * 60 * 24))
          : null;

        const pitchEffectiveness = contact.total_interactions && contact.total_interactions > 0
          ? ((contact.successful_pitches || 0) / contact.total_interactions)
          : 0;

        let engagementTrend: 'increasing' | 'stable' | 'declining' = 'stable';
        if (contact.engagement_rate && contact.response_rate) {
          const recentEngagement = contact.engagement_rate;
          const historicalAverage = 0.5;
          if (recentEngagement > historicalAverage * 1.2) engagementTrend = 'increasing';
          else if (recentEngagement < historicalAverage * 0.8) engagementTrend = 'declining';
        }

        const aiScore = (
          (contact.relationship_score || 0) * 0.3 +
          (contact.authority_score || 0) * 0.3 +
          (contact.engagement_rate || 0) * 100 * 0.2 +
          (contact.response_rate || 0) * 100 * 0.2
        );

        const predictedResponseLikelihood = contact.pitch_success_probability || 0;

        return {
          ...contact,
          success_rate: successRate,
          days_since_contact: daysSinceContact,
          response_time_average: contact.avg_response_time_hours || 0,
          pitch_effectiveness: pitchEffectiveness,
          engagement_trend: engagementTrend,
          ai_score: aiScore,
          predicted_response_likelihood: predictedResponseLikelihood,
        };
      }) || [];
      
      return enhancedData;
    },
    enabled: !!userTenant?.id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useJournalistAnalytics(filters?: JournalistFilters) {
  const { data: journalists } = useJournalistContacts(filters);
  
  return useMemo((): JournalistAnalytics | null => {
    if (!journalists || journalists.length === 0) return null;
    
    const totalContacts = journalists.length;
    const verifiedContacts = journalists.filter(j => j.verification_status === 'verified').length;
    
    const avgRelationshipScore = journalists.reduce((sum, j) => sum + (j.relationship_score || 0), 0) / totalContacts;
    const avgAuthorityScore = journalists.reduce((sum, j) => sum + (j.authority_score || 0), 0) / totalContacts;
    const avgEngagementRate = journalists.reduce((sum, j) => sum + (j.engagement_rate || 0), 0) / totalContacts;
    const avgResponseRate = journalists.reduce((sum, j) => sum + (j.response_rate || 0), 0) / totalContacts;
    
    const beatCounts = journalists.reduce((acc, j) => {
      if (j.beat) {
        acc[j.beat] = (acc[j.beat] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const topBeats = Object.entries(beatCounts)
      .map(([beat, count]) => ({ beat, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    const outletCounts = journalists.reduce((acc, j) => {
      if (j.outlet) {
        acc[j.outlet] = (acc[j.outlet] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const topOutlets = Object.entries(outletCounts)
      .map(([outlet, count]) => ({ outlet, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    const tierCounts = journalists.reduce((acc, j) => {
      const tier = j.dynamic_tier || j.static_tier || 'unclassified';
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const tierDistribution = Object.entries(tierCounts)
      .map(([tier, count]) => ({ tier, count }));
    
    const categoryCounts = journalists.reduce((acc, j) => {
      if (j.media_category) {
        acc[j.media_category] = (acc[j.media_category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const mediaCategoryDistribution = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }));
    
    const totalSuccessfulPitches = journalists.reduce((sum, j) => sum + (j.successful_pitches || 0), 0);
    const totalPitches = journalists.reduce((sum, j) => sum + (j.total_interactions || 0), 0);
    const successfulPitchRate = totalPitches > 0 ? (totalSuccessfulPitches / totalPitches) : 0;
    
    const avgResponseTimeHours = journalists.reduce((sum, j) => sum + (j.avg_response_time_hours || 0), 0) / totalContacts;
    
    const recentActivityTrend: { date: string; interactions: number }[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const interactions = journalists.filter(j => {
        if (!j.last_contacted) return false;
        const contactDate = new Date(j.last_contacted).toISOString().split('T')[0];
        return contactDate === dateStr;
      }).length;
      
      recentActivityTrend.push({ date: dateStr, interactions });
    }
    
    return {
      totalContacts,
      verifiedContacts,
      averageRelationshipScore: avgRelationshipScore,
      averageAuthorityScore: avgAuthorityScore,
      averageEngagementRate: avgEngagementRate,
      averageResponseRate: avgResponseRate,
      topBeats,
      topOutlets,
      tierDistribution,
      mediaCategoryDistribution,
      recentActivityTrend,
      successfulPitchRate,
      avgResponseTimeHours,
    };
  }, [journalists]);
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

      const enrichedContact: JournalistContactInsert = {
        ...contact,
        tenant_id: userTenant.id,
        verification_status: contact.verification_status || 'pending',
        relationship_score: contact.relationship_score || 0,
        authority_score: contact.authority_score || 0,
        confidence_score: contact.confidence_score || 0.5,
        engagement_rate: contact.engagement_rate || 0,
        response_rate: contact.response_rate || 0,
        pitch_success_probability: contact.pitch_success_probability || 0.5,
        total_interactions: contact.total_interactions || 0,
        successful_pitches: contact.successful_pitches || 0,
        declined_pitches: contact.declined_pitches || 0,
        avg_response_time_hours: contact.avg_response_time_hours || 48,
        is_active: true,
      };

      const { data, error } = await supabase
        .from('journalist_contacts')
        .insert(enrichedContact)
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
      const enrichedUpdates = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('journalist_contacts')
        .update(enrichedUpdates)
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

export function useJournalistContactsByTier(tier: string, tierType: 'dynamic' | 'static' = 'dynamic') {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['journalist-contacts-by-tier', userTenant?.id, tier, tierType],
    queryFn: async (): Promise<JournalistContact[]> => {
      if (!userTenant?.id || !tier) return [];
      
      const tierColumn = tierType === 'dynamic' ? 'dynamic_tier' : 'static_tier';
      
      const { data, error } = await supabase
        .from('journalist_contacts')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .eq(tierColumn, tier)
        .eq('is_active', true)
        .order('authority_score', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userTenant?.id && !!tier,
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
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
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
  const updateContact = useUpdateJournalistContact();

  return useMutation({
    mutationFn: async (outreach: Omit<JournalistOutreach, 'id' | 'tenant_id' | 'created_at'>) => {
      const { error } = await supabase
        .from('journalist_outreach')
        .insert({
          ...outreach,
          tenant_id: userTenant?.id,
        });

      if (error) throw error;

      if (outreach.journalist_id) {
        const { data: journalist } = await supabase
          .from('journalist_contacts')
          .select('total_interactions, last_contacted')
          .eq('id', outreach.journalist_id)
          .single();

        if (journalist) {
          await updateContact.mutateAsync({
            id: outreach.journalist_id,
            updates: {
              total_interactions: (journalist.total_interactions || 0) + 1,
              last_contacted: new Date().toISOString(),
            },
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalist-outreach'] });
      queryClient.invalidateQueries({ queryKey: ['journalist-contacts'] });
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

export function useUpdateJournalistMetrics() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      journalistId, 
      response, 
      responseTime 
    }: { 
      journalistId: string; 
      response: 'positive' | 'negative' | 'neutral';
      responseTime?: number;
    }) => {
      const { data: journalist } = await supabase
        .from('journalist_contacts')
        .select('*')
        .eq('id', journalistId)
        .single();

      if (!journalist) throw new Error('Journalist not found');

      const updates: JournalistContactUpdate = {
        total_interactions: (journalist.total_interactions || 0) + 1,
      };

      if (response === 'positive') {
        updates.successful_pitches = (journalist.successful_pitches || 0) + 1;
      } else if (response === 'negative') {
        updates.declined_pitches = (journalist.declined_pitches || 0) + 1;
      }

      updates.response_rate = (journalist.total_interactions || 0) > 0
        ? ((journalist.successful_pitches || 0) + (journalist.declined_pitches || 0)) / (journalist.total_interactions || 1)
        : 0;

      updates.engagement_rate = (journalist.total_interactions || 0) > 0
        ? (journalist.successful_pitches || 0) / (journalist.total_interactions || 1)
        : 0;

      if (responseTime) {
        const currentAvg = journalist.avg_response_time_hours || 48;
        const totalResponses = (journalist.successful_pitches || 0) + (journalist.declined_pitches || 0);
        updates.avg_response_time_hours = (currentAvg * totalResponses + responseTime) / (totalResponses + 1);
      }

      const newRelationshipScore = Math.min(100, 
        (updates.engagement_rate || 0) * 40 +
        (updates.response_rate || 0) * 30 +
        (journalist.authority_score || 0) * 0.3
      );
      updates.relationship_score = newRelationshipScore;

      const { error } = await supabase
        .from('journalist_contacts')
        .update(updates)
        .eq('id', journalistId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalist-contacts'] });
      toast({
        title: "Success",
        description: "Journalist metrics updated",
      });
    },
    onError: (error) => {
      console.error('Error updating journalist metrics:', error);
      toast({
        title: "Error",
        description: "Failed to update journalist metrics",
        variant: "destructive",
      });
    },
  });
}

export function useJournalistAIRecommendations(campaignId?: string, pressReleaseId?: string) {
  const { data: journalists } = useJournalistContacts();
  const { data: userTenant } = useUserTenant();

  return useQuery({
    queryKey: ['journalist-ai-recommendations', userTenant?.id, campaignId, pressReleaseId],
    queryFn: async () => {
      if (!journalists || journalists.length === 0) return [];

      let campaignData;
      let pressReleaseData;

      if (campaignId) {
        const { data } = await supabase
          .from('campaigns')
          .select('*')
          .eq('id', campaignId)
          .single();
        campaignData = data;
      }

      if (pressReleaseId) {
        const { data } = await supabase
          .from('press_releases')
          .select('*')
          .eq('id', pressReleaseId)
          .single();
        pressReleaseData = data;
      }

      const scoredJournalists = journalists.map(journalist => {
        let score = 0;
        let reasons: string[] = [];

        score += (journalist.relationship_score || 0) * 0.25;
        score += (journalist.authority_score || 0) * 0.25;
        score += (journalist.engagement_rate || 0) * 100 * 0.2;
        score += (journalist.pitch_success_probability || 0) * 100 * 0.3;

        if (journalist.verification_status === 'verified') {
          score += 10;
          reasons.push('Verified contact');
        }

        if (journalist.dynamic_tier === 'tier1' || journalist.static_tier === 'tier1') {
          score += 15;
          reasons.push('Tier 1 journalist');
        }

        if (journalist.days_since_contact && journalist.days_since_contact > 30) {
          score += 5;
          reasons.push('Due for follow-up');
        }

        if (journalist.response_rate && journalist.response_rate > 0.7) {
          score += 10;
          reasons.push('High response rate');
        }

        if (journalist.beat_expertise_level === 'expert') {
          score += 10;
          reasons.push('Beat expert');
        }

        return {
          ...journalist,
          ai_recommendation_score: score,
          recommendation_reasons: reasons,
        };
      });

      return scoredJournalists
        .sort((a, b) => b.ai_recommendation_score - a.ai_recommendation_score)
        .slice(0, 20);
    },
    enabled: !!userTenant?.id && !!journalists && journalists.length > 0,
  });
}