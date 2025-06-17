import { supabase } from '@/integrations/supabase/client';

// Unified Campaign Types
export interface UnifiedCampaign {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  campaign_type: 'content' | 'pr' | 'seo' | 'integrated';
  start_date?: string;
  end_date?: string;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget?: number;
  currency?: string;
  primary_goal?: string;
  kpi_targets?: any;
  target_audience?: any;
  target_markets?: string[];
  target_keywords?: string[];
  target_outlets?: string[];
  content_themes?: string[];
  cross_pillar_attribution_enabled?: boolean;
  workflow_automation_enabled?: boolean;
  performance_tracking_enabled?: boolean;
  campaign_manager_id?: string;
  team_members?: any[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignPillar {
  id: string;
  tenant_id: string;
  unified_campaign_id: string;
  pillar_type: 'content' | 'pr' | 'seo';
  pillar_weight: number;
  content_campaign_id?: string;
  pr_campaign_id?: string;
  seo_project_id?: string;
  pillar_goals?: any;
  pillar_budget?: number;
  pillar_status?: string;
  target_metrics?: any;
  pillar_start_date?: string;
  pillar_end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CrossPillarActivity {
  id: string;
  tenant_id: string;
  unified_campaign_id: string;
  activity_type: string;
  activity_name: string;
  description?: string;
  primary_pillar: 'content' | 'pr' | 'seo';
  supporting_pillars?: string[];
  content_piece_id?: string;
  press_release_id?: string;
  seo_content_optimization_id?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  planned_date?: string;
  started_at?: string;
  completed_at?: string;
  assigned_to?: string;
  assigned_pillar_teams?: any;
  depends_on_activities?: string[];
  blocks_activities?: string[];
  performance_data?: any;
  created_at: string;
  updated_at: string;
}

export interface CampaignPerformance {
  id: string;
  tenant_id: string;
  unified_campaign_id: string;
  reporting_period: 'daily' | 'weekly' | 'monthly' | 'campaign_total';
  period_start: string;
  period_end: string;
  total_impressions?: number;
  total_reach?: number;
  total_engagement?: number;
  total_clicks?: number;
  total_conversions?: number;
  total_leads?: number;
  total_spend?: number;
  cost_per_click?: number;
  cost_per_conversion?: number;
  return_on_investment?: number;
  content_views?: number;
  content_shares?: number;
  content_comments?: number;
  content_engagement_rate?: number;
  media_mentions?: number;
  media_impressions?: number;
  earned_media_value?: number;
  sentiment_score?: number;
  organic_traffic?: number;
  organic_keywords_ranking?: number;
  average_keyword_position?: number;
  seo_visibility_score?: number;
  content_attributed_conversions?: number;
  pr_attributed_conversions?: number;
  seo_attributed_conversions?: number;
  multi_touch_conversions?: number;
  overall_performance_score?: number;
  pillar_performance_scores?: any;
  created_at: string;
}

export interface CampaignAttribution {
  id: string;
  tenant_id: string;
  unified_campaign_id: string;
  session_id?: string;
  user_id?: string;
  journey_step: number;
  touchpoint_type: string;
  pillar_source: 'content' | 'pr' | 'seo' | 'direct';
  source_content_id?: string;
  source_press_release_id?: string;
  source_keyword?: string;
  source_url?: string;
  referring_domain?: string;
  interaction_type?: string;
  interaction_value?: number;
  time_spent_seconds?: number;
  first_touch_attribution?: number;
  last_touch_attribution?: number;
  linear_attribution?: number;
  time_decay_attribution?: number;
  device_type?: string;
  traffic_source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  is_conversion?: boolean;
  conversion_type?: string;
  conversion_value?: number;
  created_at: string;
}

export interface CampaignInsight {
  id: string;
  tenant_id: string;
  unified_campaign_id: string;
  insight_type: string;
  insight_category: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence_score?: number;
  data_sources?: string[];
  analysis_metadata?: any;
  recommended_actions?: any[];
  expected_impact?: any;
  priority_score?: number;
  affects_content?: boolean;
  affects_pr?: boolean;
  affects_seo?: boolean;
  cross_pillar_impact?: any;
  status: 'new' | 'reviewed' | 'implementing' | 'completed' | 'dismissed';
  reviewed_by?: string;
  reviewed_at?: string;
  action_taken?: any;
  valid_until?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

class UnifiedCampaignService {
  // Campaign Management
  async createUnifiedCampaign(campaignData: Partial<UnifiedCampaign>): Promise<UnifiedCampaign> {
    console.log('🚀 Creating unified campaign:', campaignData.name);

    const { data, error } = await supabase
      .from('unified_campaigns')
      .insert(campaignData)
      .select()
      .single();

    if (error) throw error;
    return data as UnifiedCampaign;
  }

  async getUnifiedCampaigns(tenantId: string): Promise<UnifiedCampaign[]> {
    const { data, error } = await supabase
      .from('unified_campaigns')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as UnifiedCampaign[]) || [];
  }

  async getUnifiedCampaign(campaignId: string): Promise<UnifiedCampaign | null> {
    const { data, error } = await supabase
      .from('unified_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (error) throw error;
    return data as UnifiedCampaign;
  }

  async updateUnifiedCampaign(campaignId: string, updates: Partial<UnifiedCampaign>): Promise<UnifiedCampaign> {
    const { data, error } = await supabase
      .from('unified_campaigns')
      .update(updates)
      .eq('id', campaignId)
      .select()
      .single();

    if (error) throw error;
    return data as UnifiedCampaign;
  }

  // Pillar Management
  async addCampaignPillar(pillarData: Partial<CampaignPillar>): Promise<CampaignPillar> {
    console.log('📊 Adding campaign pillar:', pillarData.pillar_type);

    const { data, error } = await supabase
      .from('campaign_pillars')
      .insert(pillarData)
      .select()
      .single();

    if (error) throw error;
    return data as CampaignPillar;
  }

  async getCampaignPillars(campaignId: string): Promise<CampaignPillar[]> {
    const { data, error } = await supabase
      .from('campaign_pillars')
      .select('*')
      .eq('unified_campaign_id', campaignId)
      .order('pillar_type');

    if (error) throw error;
    return (data as CampaignPillar[]) || [];
  }

  async updatePillarWeight(pillarId: string, weight: number): Promise<void> {
    const { error } = await supabase
      .from('campaign_pillars')
      .update({ pillar_weight: weight })
      .eq('id', pillarId);

    if (error) throw error;
  }

  // Cross-Pillar Activities
  async createCrossPillarActivity(activityData: Partial<CrossPillarActivity>): Promise<CrossPillarActivity> {
    console.log('🔗 Creating cross-pillar activity:', activityData.activity_name);

    const { data, error } = await supabase
      .from('cross_pillar_activities')
      .insert(activityData)
      .select()
      .single();

    if (error) throw error;
    return data as CrossPillarActivity;
  }

  async getCrossPillarActivities(campaignId: string): Promise<CrossPillarActivity[]> {
    const { data, error } = await supabase
      .from('cross_pillar_activities')
      .select('*')
      .eq('unified_campaign_id', campaignId)
      .order('planned_date');

    if (error) throw error;
    return (data as CrossPillarActivity[]) || [];
  }

  async updateActivityStatus(activityId: string, status: string, completedAt?: string): Promise<void> {
    const updates: any = { status };
    if (status === 'completed' && completedAt) {
      updates.completed_at = completedAt;
    }

    const { error } = await supabase
      .from('cross_pillar_activities')
      .update(updates)
      .eq('id', activityId);

    if (error) throw error;
  }

  // Performance Tracking
  async recordCampaignPerformance(performanceData: Partial<CampaignPerformance>): Promise<CampaignPerformance> {
    console.log('📈 Recording campaign performance for period:', performanceData.reporting_period);

    const { data, error } = await supabase
      .from('campaign_performance')
      .insert(performanceData)
      .select()
      .single();

    if (error) throw error;
    return data as CampaignPerformance;
  }

  async getCampaignPerformance(
    campaignId: string, 
    period?: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<CampaignPerformance[]> {
    let query = supabase
      .from('campaign_performance')
      .select('*')
      .eq('unified_campaign_id', campaignId);

    if (period) {
      query = query.eq('reporting_period', period);
    }

    if (startDate) {
      query = query.gte('period_start', startDate);
    }

    if (endDate) {
      query = query.lte('period_end', endDate);
    }

    const { data, error } = await query.order('period_start', { ascending: false });

    if (error) throw error;
    return (data as CampaignPerformance[]) || [];
  }

  async getLatestCampaignPerformance(campaignId: string): Promise<CampaignPerformance | null> {
    const { data, error } = await supabase
      .from('campaign_performance')
      .select('*')
      .eq('unified_campaign_id', campaignId)
      .eq('reporting_period', 'campaign_total')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as CampaignPerformance || null;
  }

  // Attribution Tracking
  async trackAttribution(attributionData: Partial<CampaignAttribution>): Promise<CampaignAttribution> {
    const { data, error } = await supabase
      .from('campaign_attribution')
      .insert(attributionData)
      .select()
      .single();

    if (error) throw error;
    return data as CampaignAttribution;
  }

  async getCampaignAttribution(campaignId: string, userId?: string): Promise<CampaignAttribution[]> {
    let query = supabase
      .from('campaign_attribution')
      .select('*')
      .eq('unified_campaign_id', campaignId);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('created_at');

    if (error) throw error;
    return (data as CampaignAttribution[]) || [];
  }

  async getAttributionAnalysis(campaignId: string): Promise<any> {
    console.log('🔍 Analyzing attribution for campaign:', campaignId);

    const attributions = await this.getCampaignAttribution(campaignId);
    
    // Calculate attribution by pillar
    const pillarAttribution = {
      content: 0,
      pr: 0,
      seo: 0,
      direct: 0
    };

    const conversionsByPillar = {
      content: 0,
      pr: 0,
      seo: 0,
      direct: 0
    };

    attributions.forEach(attr => {
      if (attr.is_conversion) {
        conversionsByPillar[attr.pillar_source]++;
      }
      
      // Use linear attribution as default
      pillarAttribution[attr.pillar_source] += attr.linear_attribution || 0;
    });

    // Calculate customer journey insights
    const userJourneys = new Map();
    attributions.forEach(attr => {
      if (!attr.user_id) return;
      
      if (!userJourneys.has(attr.user_id)) {
        userJourneys.set(attr.user_id, []);
      }
      userJourneys.get(attr.user_id).push(attr);
    });

    const avgJourneyLength = Array.from(userJourneys.values())
      .reduce((sum, journey) => sum + journey.length, 0) / userJourneys.size || 0;

    return {
      pillarAttribution,
      conversionsByPillar,
      totalConversions: attributions.filter(a => a.is_conversion).length,
      totalTouchpoints: attributions.length,
      uniqueUsers: userJourneys.size,
      avgJourneyLength: Math.round(avgJourneyLength * 10) / 10,
      multiTouchUsers: Array.from(userJourneys.values()).filter(j => j.length > 1).length
    };
  }

  // Campaign Insights
  async generateCampaignInsight(insightData: Partial<CampaignInsight>): Promise<CampaignInsight> {
    console.log('💡 Generating campaign insight:', insightData.insight_type);

    const { data, error } = await supabase
      .from('campaign_insights')
      .insert(insightData)
      .select()
      .single();

    if (error) throw error;
    return data as CampaignInsight;
  }

  async getCampaignInsights(
    campaignId: string, 
    status?: string,
    insightType?: string
  ): Promise<CampaignInsight[]> {
    let query = supabase
      .from('campaign_insights')
      .select('*')
      .eq('unified_campaign_id', campaignId)
      .eq('is_active', true);

    if (status) {
      query = query.eq('status', status);
    }

    if (insightType) {
      query = query.eq('insight_type', insightType);
    }

    const { data, error } = await query.order('priority_score', { ascending: false });

    if (error) throw error;
    return (data as CampaignInsight[]) || [];
  }

  async updateInsightStatus(insightId: string, status: string, actionTaken?: any): Promise<void> {
    const updates: any = { 
      status,
      reviewed_at: new Date().toISOString()
    };
    
    if (actionTaken) {
      updates.action_taken = actionTaken;
    }

    const { error } = await supabase
      .from('campaign_insights')
      .update(updates)
      .eq('id', insightId);

    if (error) throw error;
  }

  // Advanced Analytics
  async getCampaignROI(campaignId: string): Promise<any> {
    console.log('💰 Calculating campaign ROI:', campaignId);

    const performance = await this.getLatestCampaignPerformance(campaignId);
    const campaign = await this.getUnifiedCampaign(campaignId);

    if (!performance || !campaign) {
      return {
        roi: 0,
        totalSpend: 0,
        totalRevenue: 0,
        costPerConversion: 0,
        conversionRate: 0
      };
    }

    const totalSpend = performance.total_spend || 0;
    const totalConversions = performance.total_conversions || 0;
    const conversionValue = totalConversions * 100; // Simplified conversion value
    const roi = totalSpend > 0 ? ((conversionValue - totalSpend) / totalSpend) * 100 : 0;
    const costPerConversion = totalConversions > 0 ? totalSpend / totalConversions : 0;
    const conversionRate = performance.total_clicks > 0 ? 
      (totalConversions / performance.total_clicks) * 100 : 0;

    return {
      roi: Math.round(roi * 100) / 100,
      totalSpend,
      totalRevenue: conversionValue,
      costPerConversion: Math.round(costPerConversion * 100) / 100,
      conversionRate: Math.round(conversionRate * 100) / 100,
      totalConversions,
      totalClicks: performance.total_clicks || 0,
      totalImpressions: performance.total_impressions || 0
    };
  }

  async getPillarPerformanceComparison(campaignId: string): Promise<any> {
    console.log('⚖️ Comparing pillar performance:', campaignId);

    const performance = await this.getLatestCampaignPerformance(campaignId);
    const pillars = await this.getCampaignPillars(campaignId);

    if (!performance) return {};

    const comparison = {
      content: {
        conversions: performance.content_attributed_conversions || 0,
        engagement: performance.content_engagement_rate || 0,
        views: performance.content_views || 0,
        weight: 0
      },
      pr: {
        conversions: performance.pr_attributed_conversions || 0,
        mentions: performance.media_mentions || 0,
        impressions: performance.media_impressions || 0,
        sentiment: performance.sentiment_score || 0,
        weight: 0
      },
      seo: {
        conversions: performance.seo_attributed_conversions || 0,
        traffic: performance.organic_traffic || 0,
        keywords: performance.organic_keywords_ranking || 0,
        position: performance.average_keyword_position || 0,
        weight: 0
      }
    };

    // Add pillar weights
    pillars.forEach(pillar => {
      if (comparison[pillar.pillar_type]) {
        comparison[pillar.pillar_type].weight = pillar.pillar_weight;
      }
    });

    return comparison;
  }

  // Campaign Overview
  async getCampaignOverview(campaignId: string): Promise<any> {
    console.log('📊 Getting campaign overview:', campaignId);

    const [
      campaign,
      pillars,
      activities,
      performance,
      insights,
      attribution,
      roi
    ] = await Promise.all([
      this.getUnifiedCampaign(campaignId),
      this.getCampaignPillars(campaignId),
      this.getCrossPillarActivities(campaignId),
      this.getLatestCampaignPerformance(campaignId),
      this.getCampaignInsights(campaignId, 'new'),
      this.getAttributionAnalysis(campaignId),
      this.getCampaignROI(campaignId)
    ]);

    const activePillars = pillars.filter(p => p.pillar_status === 'active').length;
    const completedActivities = activities.filter(a => a.status === 'completed').length;
    const totalActivities = activities.length;
    const progressPercentage = totalActivities > 0 ? 
      Math.round((completedActivities / totalActivities) * 100) : 0;

    return {
      campaign,
      pillars,
      activePillars,
      totalActivities,
      completedActivities,
      progressPercentage,
      performance,
      insights: insights.slice(0, 5), // Top 5 insights
      attribution,
      roi,
      status: campaign?.status || 'unknown',
      daysRemaining: campaign?.end_date ? 
        Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null
    };
  }
}

export const unifiedCampaignService = new UnifiedCampaignService();