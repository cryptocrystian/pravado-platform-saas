
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface CitationQuery {
  id?: string;
  query_text: string;
  target_keywords: string[];
  platforms: string[];
  status?: string;
}

export interface CitationResult {
  id: string;
  platform: string;
  model_used?: string;
  response_text: string;
  citations_found: string[];
  sentiment_score: number;
  confidence_score: number;
  context_relevance: number;
  query_timestamp: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description?: string;
  audio_url?: string;
  audio_duration_seconds?: number;
  episode_number: number;
  season_number: number;
  publish_date?: string;
  status: string;
  processing_status?: any;
}

export function useCiteMindData() {
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch citation queries
  const { data: citationQueries, isLoading: queriesLoading } = useQuery({
    queryKey: ['citation-queries', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('ai_citation_queries')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userTenant?.id,
  });

  // Fetch recent citation results
  const { data: citationResults, isLoading: resultsLoading } = useQuery({
    queryKey: ['citation-results', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('ai_citation_results')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('query_timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!userTenant?.id,
  });

  // Fetch citation analytics
  const { data: citationAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['citation-analytics', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('citation_analytics')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('date_recorded', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data;
    },
    enabled: !!userTenant?.id,
  });

  // Fetch podcast episodes
  const { data: podcastEpisodes, isLoading: episodesLoading } = useQuery({
    queryKey: ['podcast-episodes', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('podcast_episodes')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userTenant?.id,
  });

  // Fetch podcast platforms
  const { data: podcastPlatforms } = useQuery({
    queryKey: ['podcast-platforms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('podcast_platforms')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Create citation monitoring query
  const createCitationQuery = useMutation({
    mutationFn: async (queryData: CitationQuery) => {
      if (!userTenant?.id) throw new Error('No tenant ID');
      
      const { data, error } = await supabase
        .from('ai_citation_queries')
        .insert({
          tenant_id: userTenant.id,
          query_text: queryData.query_text,
          target_keywords: queryData.target_keywords,
          platforms: queryData.platforms,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citation-queries'] });
      toast({
        title: "Citation query created",
        description: "AI monitoring has been set up for your keywords",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create citation query",
        variant: "destructive",
      });
    },
  });

  // Run citation monitoring
  const runCitationMonitoring = useMutation({
    mutationFn: async (queryId?: string) => {
      const { data, error } = await supabase.functions.invoke('ai-citation-monitor', {
        body: {
          action: queryId ? 'monitor_single_query' : 'monitor_all_active',
          tenant_id: userTenant?.id,
          query_id: queryId
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['citation-results'] });
      queryClient.invalidateQueries({ queryKey: ['citation-analytics'] });
      toast({
        title: "Monitoring completed",
        description: `Found ${data.total_citations} citations across AI platforms`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to run citation monitoring",
        variant: "destructive",
      });
    },
  });

  // Generate podcast from content
  const generatePodcast = useMutation({
    mutationFn: async (contentData: any) => {
      const { data, error } = await supabase.functions.invoke('podcast-generator', {
        body: {
          action: 'process_content_to_podcast',
          tenant_id: userTenant?.id,
          ...contentData
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcast-episodes'] });
      toast({
        title: "Podcast generated",
        description: "Your content has been converted to a podcast episode",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate podcast episode",
        variant: "destructive",
      });
    },
  });

  // Syndicate podcast episode
  const syndicateEpisode = useMutation({
    mutationFn: async (episodeId: string) => {
      const { data, error } = await supabase.functions.invoke('podcast-syndication', {
        body: {
          action: 'syndicate_episode',
          episode_id: episodeId
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['podcast-episodes'] });
      toast({
        title: "Syndication started",
        description: `Episode submitted to ${data.successful_submissions} platforms`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to syndicate episode",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    citationQueries,
    citationResults,
    citationAnalytics,
    podcastEpisodes,
    podcastPlatforms,
    
    // Loading states
    isLoading: queriesLoading || resultsLoading || analyticsLoading || episodesLoading,
    
    // Mutations
    createCitationQuery,
    runCitationMonitoring,
    generatePodcast,
    syndicateEpisode,
    
    // Mutation states
    isCreatingQuery: createCitationQuery.isPending,
    isRunningMonitoring: runCitationMonitoring.isPending,
    isGeneratingPodcast: generatePodcast.isPending,
    isSyndicating: syndicateEpisode.isPending,
  };
}
