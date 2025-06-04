
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GoogleTTSService } from '@/services/googleTTSService';
import { PodcastSyndicationService } from '@/services/podcastSyndicationService';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  publishDate: string;
  duration: number;
  pressReleaseId?: string;
  syndicationStatus: any[];
}

export function usePodcastSyndication() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mock data for demonstration
  const mockEpisodes: PodcastEpisode[] = [
    {
      id: '1',
      title: 'PRAVADO Launches Revolutionary Marketing Operating System',
      description: 'Breaking news about PRAVADO\'s new AI-powered marketing platform that\'s transforming how enterprises manage their marketing operations.',
      audioUrl: 'https://hubwire.com/audio/episode-1.mp3',
      publishDate: new Date().toISOString(),
      duration: 180,
      pressReleaseId: 'pr-1',
      syndicationStatus: [
        { platform: 'Spotify', status: 'published', url: 'https://spotify.com/hubwire/episode-1' },
        { platform: 'Apple Podcasts', status: 'published', url: 'https://podcasts.apple.com/hubwire/episode-1' },
        { platform: 'Google Podcasts', status: 'published', url: 'https://podcasts.google.com/hubwire/episode-1' }
      ]
    }
  ];

  const syndicationService = new PodcastSyndicationService();

  // Fetch podcast episodes
  const { data: episodes, isLoading: episodesLoading } = useQuery({
    queryKey: ['podcastEpisodes', user?.id],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockEpisodes;
    },
    enabled: !!user,
  });

  // Fetch syndication metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['podcastMetrics', user?.id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        totalEpisodes: mockEpisodes.length,
        totalDownloads: 15420,
        avgDownloadsPerEpisode: 1250,
        platformsConnected: 34,
        monthlyGrowth: 24.5
      };
    },
    enabled: !!user,
  });

  // Create podcast from press release
  const createPodcastMutation = useMutation({
    mutationFn: async ({ pressReleaseId, title, content }: { pressReleaseId: string; title: string; content: string }) => {
      // Simulate TTS conversion and podcast creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newEpisode = {
        id: Date.now().toString(),
        title: `Breaking: ${title}`,
        description: `Latest business intelligence from Hubwire. ${content.substring(0, 200)}...`,
        audioUrl: `https://hubwire.com/audio/episode-${Date.now()}.mp3`,
        publishDate: new Date().toISOString(),
        duration: Math.floor(content.length / 10), // Rough duration estimate
        pressReleaseId,
        syndicationStatus: []
      };

      return newEpisode;
    },
    onSuccess: (episode) => {
      queryClient.invalidateQueries({ queryKey: ['podcastEpisodes'] });
      toast({
        title: "Podcast created successfully",
        description: `Episode "${episode.title}" has been generated and is ready for syndication.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create podcast episode. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Syndicate episode to all platforms
  const syndicateEpisodeMutation = useMutation({
    mutationFn: async (episodeId: string) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate syndication to 34+ platforms
      return syndicationService.getSupportedPlatforms().map(platform => ({
        platform: platform.name,
        status: platform.requiresManualUpload ? 'manual_upload_required' : 'published',
        url: platform.requiresManualUpload 
          ? `https://dashboard.${platform.name.toLowerCase().replace(/\s+/g, '')}.com`
          : `https://${platform.name.toLowerCase().replace(/\s+/g, '')}.com/hubwire/${episodeId}`
      }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcastEpisodes'] });
      toast({
        title: "Syndication initiated",
        description: "Episode is being distributed across all 34+ podcast platforms.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to syndicate episode. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createPodcast = useCallback((pressReleaseId: string, title: string, content: string) => {
    return createPodcastMutation.mutateAsync({ pressReleaseId, title, content });
  }, [createPodcastMutation]);

  const syndicateEpisode = useCallback((episodeId: string) => {
    return syndicateEpisodeMutation.mutateAsync(episodeId);
  }, [syndicateEpisodeMutation]);

  const getSupportedPlatforms = useCallback(() => {
    return syndicationService.getSupportedPlatforms();
  }, [syndicationService]);

  return {
    episodes: episodes || [],
    metrics,
    isLoading: episodesLoading || metricsLoading,
    createPodcast,
    syndicateEpisode,
    getSupportedPlatforms,
    isCreating: createPodcastMutation.isPending,
    isSyndicating: syndicateEpisodeMutation.isPending,
  };
}
