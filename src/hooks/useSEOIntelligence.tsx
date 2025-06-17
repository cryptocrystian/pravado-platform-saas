import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';

// Competitor Analysis Types
export interface Competitor {
  id: string;
  tenant_id: string;
  project_id?: string;
  domain: string;
  name?: string;
  estimated_traffic?: number;
  total_keywords?: number;
  avg_position?: number;
  visibility_score?: number;
  domain_authority?: number;
  keyword_overlap_count?: number;
  content_gaps?: string[];
  opportunity_score?: number;
  last_analyzed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CompetitorKeyword {
  id: string;
  tenant_id: string;
  competitor_id: string;
  keyword: string;
  position: number;
  search_volume?: number;
  traffic_estimate?: number;
  url?: string;
  our_position?: number;
  opportunity_level?: 'high' | 'medium' | 'low';
  tracked_at: string;
}

// Technical Audit Types
export interface TechnicalAudit {
  id: string;
  tenant_id: string;
  project_id?: string;
  audit_type?: string;
  status?: string;
  largest_contentful_paint?: number;
  first_input_delay?: number;
  cumulative_layout_shift?: number;
  page_speed_score?: number;
  mobile_usability_score?: number;
  crawl_errors?: number;
  broken_links?: number;
  missing_meta_descriptions?: number;
  duplicate_content_issues?: number;
  missing_alt_tags?: number;
  overall_score?: number;
  issues_critical?: number;
  issues_warning?: number;
  issues_notice?: number;
  audit_results?: any;
  recommendations?: string[];
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

// Content Optimization Types
export interface ContentOptimization {
  id: string;
  tenant_id: string;
  project_id?: string;
  url: string;
  title?: string;
  meta_description?: string;
  content_text?: string;
  primary_keyword?: string;
  secondary_keywords?: string[];
  overall_score?: number;
  keyword_optimization_score?: number;
  content_quality_score?: number;
  readability_score?: number;
  word_count?: number;
  keyword_density?: number;
  semantic_keywords?: string[];
  content_gaps?: string[];
  optimization_suggestions?: any[];
  ai_generated_improvements?: any;
  status?: string;
  analyzed_at: string;
  updated_at: string;
}

// Backlink Types
export interface Backlink {
  id: string;
  tenant_id: string;
  project_id?: string;
  source_domain: string;
  source_url: string;
  source_title?: string;
  target_url: string;
  anchor_text?: string;
  domain_authority?: number;
  page_authority?: number;
  spam_score?: number;
  link_type?: 'dofollow' | 'nofollow' | 'sponsored' | 'ugc';
  link_status?: 'active' | 'lost' | 'toxic' | 'disavowed';
  first_seen: string;
  last_seen: string;
  discovered_by?: string;
}

// Competitors Hook
export function useSEOCompetitors(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-competitors', userTenant?.id, projectId],
    queryFn: async (): Promise<Competitor[]> => {
      if (!userTenant?.id) return [];
      
      try {
        let query = supabase
          .from('seo_competitors')
          .select('*')
          .eq('tenant_id', userTenant.id);
        
        if (projectId) {
          query = query.eq('project_id', projectId);
        }
        
        const { data, error } = await query.order('opportunity_score', { ascending: false });
        
        if (error) {
          console.error('Error fetching competitors:', error);
          return [];
        }
        return (data as unknown as Competitor[]) || [];
      } catch (error) {
        console.error('Error in useSEOCompetitors:', error);
        return [];
      }
    },
    enabled: !!userTenant?.id,
  });
}

// Competitor Analysis Hook
export function useCompetitorAnalysis() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async (request: {
      projectId: string;
      competitors: string[];
      targetDomain: string;
    }): Promise<any> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      const { data, error } = await supabase.functions.invoke('seo-intelligence', {
        body: {
          action: 'competitor_analysis',
          tenant_id: userTenant.id,
          data: {
            project_id: request.projectId,
            competitors: request.competitors,
            target_domain: request.targetDomain
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['seo-competitors'] });
      toast({
        title: "Competitor Analysis Complete",
        description: `Analyzed ${data.competitors_analyzed} competitors`,
      });
    },
    onError: (error) => {
      console.error('Competitor analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to complete competitor analysis",
        variant: "destructive",
      });
    },
  });
}

// Technical Audits Hook
export function useTechnicalAudits(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-technical-audits', userTenant?.id, projectId],
    queryFn: async (): Promise<TechnicalAudit[]> => {
      if (!userTenant?.id) return [];
      
      try {
        let query = supabase
          .from('seo_technical_audits')
          .select('*')
          .eq('tenant_id', userTenant.id);
        
        if (projectId) {
          query = query.eq('project_id', projectId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching technical audits:', error);
          return [];
        }
        return (data as unknown as TechnicalAudit[]) || [];
      } catch (error) {
        console.error('Error in useTechnicalAudits:', error);
        return [];
      }
    },
    enabled: !!userTenant?.id,
  });
}

// Technical Audit Hook
export function useTechnicalAudit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async (request: {
      projectId: string;
      url: string;
      auditType?: string;
    }): Promise<any> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      const { data, error } = await supabase.functions.invoke('seo-intelligence', {
        body: {
          action: 'technical_audit',
          tenant_id: userTenant.id,
          data: {
            project_id: request.projectId,
            url: request.url,
            audit_type: request.auditType || 'full'
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['seo-technical-audits'] });
      toast({
        title: "Technical Audit Complete",
        description: `Overall score: ${data.overall_score}/100`,
      });
    },
    onError: (error) => {
      console.error('Technical audit error:', error);
      toast({
        title: "Audit Failed",
        description: "Failed to complete technical audit",
        variant: "destructive",
      });
    },
  });
}

// Content Optimizations Hook
export function useContentOptimizations(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-content-optimizations', userTenant?.id, projectId],
    queryFn: async (): Promise<ContentOptimization[]> => {
      if (!userTenant?.id) return [];
      
      try {
        let query = supabase
          .from('seo_content_optimization')
          .select('*')
          .eq('tenant_id', userTenant.id);
        
        if (projectId) {
          query = query.eq('project_id', projectId);
        }
        
        const { data, error } = await query.order('overall_score', { ascending: false });
        
        if (error) {
          console.error('Error fetching content optimizations:', error);
          return [];
        }
        return (data as unknown as ContentOptimization[]) || [];
      } catch (error) {
        console.error('Error in useContentOptimizations:', error);
        return [];
      }
    },
    enabled: !!userTenant?.id,
  });
}

// Content Optimization Hook
export function useContentOptimization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async (request: {
      projectId: string;
      url: string;
      content: string;
      primaryKeyword: string;
      secondaryKeywords?: string[];
    }): Promise<any> => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      const { data, error } = await supabase.functions.invoke('seo-intelligence', {
        body: {
          action: 'content_optimization',
          tenant_id: userTenant.id,
          data: {
            project_id: request.projectId,
            url: request.url,
            content: request.content,
            primary_keyword: request.primaryKeyword,
            secondary_keywords: request.secondaryKeywords || []
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['seo-content-optimizations'] });
      toast({
        title: "Content Optimization Complete",
        description: `Overall score: ${data.overall_score}/100`,
      });
    },
    onError: (error) => {
      console.error('Content optimization error:', error);
      toast({
        title: "Optimization Failed",
        description: "Failed to complete content optimization",
        variant: "destructive",
      });
    },
  });
}

// Backlinks Hook
export function useSEOBacklinks(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-backlinks', userTenant?.id, projectId],
    queryFn: async (): Promise<Backlink[]> => {
      if (!userTenant?.id) return [];
      
      try {
        let query = supabase
          .from('seo_backlinks')
          .select('*')
          .eq('tenant_id', userTenant.id);
        
        if (projectId) {
          query = query.eq('project_id', projectId);
        }
        
        const { data, error } = await query
          .eq('link_status', 'active')
          .order('domain_authority', { ascending: false });
        
        if (error) {
          console.error('Error fetching backlinks:', error);
          return [];
        }
        return (data as unknown as Backlink[]) || [];
      } catch (error) {
        console.error('Error in useSEOBacklinks:', error);
        return [];
      }
    },
    enabled: !!userTenant?.id,
  });
}

// SEO Overview Hook - Aggregated data for dashboard
export function useSEOOverview(projectId?: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['seo-overview', userTenant?.id, projectId],
    queryFn: async () => {
      if (!userTenant?.id) return null;
      
      try {
        // Get keywords count and avg position
        let keywordsQuery = supabase
          .from('seo_keywords')
          .select('ranking_position')
          .eq('tenant_id', userTenant.id);
        
        if (projectId) {
          keywordsQuery = keywordsQuery.eq('project_id', projectId);
        }
        
        const { data: keywords } = await keywordsQuery;
        
        // Get traffic estimate from latest SERP tracking
        let serpQuery = supabase
          .from('serp_tracking')
          .select('estimated_traffic')
          .eq('tenant_id', userTenant.id);
        
        if (projectId) {
          serpQuery = serpQuery.eq('project_id', projectId);
        }
        
        const { data: serpData } = await serpQuery;
        
        // Calculate metrics
        const totalKeywords = keywords?.length || 0;
        const avgPosition = keywords?.length ? 
          keywords.reduce((sum, k) => sum + (k.ranking_position || 0), 0) / keywords.length : 0;
        const totalTraffic = serpData?.reduce((sum, s) => sum + (s.estimated_traffic || 0), 0) || 0;
        
        return {
          totalKeywords,
          avgPosition: avgPosition ? Math.round(avgPosition * 10) / 10 : 0,
          organicTraffic: totalTraffic
        };
      } catch (error) {
        console.error('Error in useSEOOverview:', error);
        return null;
      }
    },
    enabled: !!userTenant?.id,
  });
}