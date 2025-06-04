
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiPlatformService, CitationResult } from '@/services/aiPlatformService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface MonitoringConfig {
  brandName: string;
  keywords: string[];
  competitors: string[];
  alerts: boolean;
  frequency: 'realtime' | 'hourly' | 'daily';
  platforms: string[];
}

interface CitationAlert {
  id: string;
  citation: CitationResult;
  read: boolean;
  timestamp: string;
}

export function useCitationMonitoring() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<MonitoringConfig>({
    brandName: '',
    keywords: ['PRAVADO'],
    competitors: [],
    alerts: true,
    frequency: 'hourly',
    platforms: ['openai', 'anthropic', 'perplexity', 'gemini', 'huggingface']
  });

  // Fetch citation monitoring configuration
  const { data: monitoringConfig, isLoading: configLoading } = useQuery({
    queryKey: ['citationConfig', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('citation_monitoring_config')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch recent citations
  const { data: citations, isLoading: citationsLoading } = useQuery({
    queryKey: ['citations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('ai_citations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  // Fetch citation analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['citationAnalytics', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('citation_analytics')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  // Update monitoring configuration
  const updateConfigMutation = useMutation({
    mutationFn: async (newConfig: Partial<MonitoringConfig>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('citation_monitoring_config')
        .upsert({
          user_id: user.id,
          ...newConfig,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citationConfig'] });
    },
  });

  // Start monitoring mutation
  const startMonitoringMutation = useMutation({
    mutationFn: async (queries: string[]) => {
      if (!user) throw new Error('User not authenticated');
      
      const results: CitationResult[] = [];
      
      for (const query of queries) {
        try {
          const platformResults = await aiPlatformService.queryAllPlatforms(query, config.keywords);
          results.push(...platformResults);
        } catch (error) {
          console.error('Error querying platforms:', error);
        }
      }
      
      // Store results in database
      if (results.length > 0) {
        const { error } = await supabase
          .from('ai_citations')
          .insert(results.map(result => ({
            user_id: user.id,
            platform: result.platform,
            model: result.model,
            query: result.query,
            response: result.response,
            mentions: result.mentions,
            sentiment: result.sentiment,
            confidence: result.confidence,
            created_at: result.timestamp
          })));
        
        if (error) throw error;
      }
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citations'] });
      queryClient.invalidateQueries({ queryKey: ['citationAnalytics'] });
    },
  });

  // Query specific platform
  const queryPlatformMutation = useMutation({
    mutationFn: async ({ platform, query }: { platform: string; query: string }) => {
      const result = await aiPlatformService.queryPlatform({
        query,
        platform: platform as any,
        keywords: config.keywords
      });
      
      if (user && result.mentions.length > 0) {
        const { error } = await supabase
          .from('ai_citations')
          .insert({
            user_id: user.id,
            platform: result.platform,
            model: result.model,
            query: result.query,
            response: result.response,
            mentions: result.mentions,
            sentiment: result.sentiment,
            confidence: result.confidence,
            created_at: result.timestamp
          });
        
        if (error) console.error('Error storing citation:', error);
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citations'] });
    },
  });

  // Real-time monitoring
  useEffect(() => {
    if (!user || config.frequency !== 'realtime' || !config.keywords.length) return;
    
    const interval = setInterval(async () => {
      try {
        const testQueries = [
          `What do you know about ${config.brandName}?`,
          `Compare marketing automation tools including ${config.brandName}`,
          `Best practices for ${config.keywords.join(', ')}`
        ];
        
        startMonitoringMutation.mutate(testQueries);
      } catch (error) {
        console.error('Real-time monitoring error:', error);
      }
    }, 60000); // Every minute for real-time
    
    return () => clearInterval(interval);
  }, [user, config.frequency, config.brandName, config.keywords.length]);

  const updateConfig = useCallback((newConfig: Partial<MonitoringConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    updateConfigMutation.mutate(newConfig);
  }, [updateConfigMutation]);

  const startMonitoring = useCallback((queries: string[]) => {
    return startMonitoringMutation.mutateAsync(queries);
  }, [startMonitoringMutation]);

  const queryPlatform = useCallback((platform: string, query: string) => {
    return queryPlatformMutation.mutateAsync({ platform, query });
  }, [queryPlatformMutation]);

  return {
    config,
    updateConfig,
    citations: citations || [],
    analytics,
    isLoading: configLoading || citationsLoading || analyticsLoading,
    startMonitoring,
    queryPlatform,
    isMonitoring: startMonitoringMutation.isPending,
    isQuerying: queryPlatformMutation.isPending,
  };
}
