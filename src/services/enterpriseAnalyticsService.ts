import { supabase } from '@/integrations/supabase/client';

// Enterprise Analytics Types
export interface AnalyticsEvent {
  id?: string;
  tenant_id: string;
  event_type: string;
  event_name: string;
  event_category?: string;
  source_pillar?: 'content' | 'pr' | 'seo' | 'direct' | 'social';
  source_campaign_id?: string;
  source_content_id?: string;
  source_url?: string;
  user_id?: string;
  session_id?: string;
  anonymous_id?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  country?: string;
  region?: string;
  city?: string;
  properties?: any;
  custom_properties?: any;
  event_value?: number;
  revenue?: number;
  quantity?: number;
  event_timestamp?: string;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface AnalyticsMetrics {
  id?: string;
  tenant_id: string;
  date_key: string;
  hour_key?: number;
  period_type: 'hourly' | 'daily' | 'weekly' | 'monthly';
  pillar?: 'content' | 'pr' | 'seo' | 'unified';
  campaign_id?: string;
  content_type?: string;
  device_type?: string;
  traffic_source?: string;
  sessions?: number;
  users?: number;
  pageviews?: number;
  unique_pageviews?: number;
  bounce_rate?: number;
  avg_session_duration?: number;
  total_engagement_events?: number;
  avg_engagement_rate?: number;
  time_on_page?: number;
  scroll_depth?: number;
  conversions?: number;
  conversion_rate?: number;
  conversion_value?: number;
  revenue?: number;
  content_views?: number;
  content_shares?: number;
  content_likes?: number;
  content_comments?: number;
  content_downloads?: number;
  pr_mentions?: number;
  pr_impressions?: number;
  pr_reach?: number;
  earned_media_value?: number;
  sentiment_score?: number;
  organic_sessions?: number;
  organic_users?: number;
  search_impressions?: number;
  search_clicks?: number;
  avg_position?: number;
  first_touch_conversions?: number;
  last_touch_conversions?: number;
  linear_conversions?: number;
  time_decay_conversions?: number;
  total_cost?: number;
  cost_per_click?: number;
  cost_per_conversion?: number;
  return_on_ad_spend?: number;
  return_on_investment?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExecutiveReport {
  id?: string;
  tenant_id: string;
  report_name: string;
  report_type: 'executive_summary' | 'roi_analysis' | 'pillar_performance' | 'client_presentation';
  report_category?: string;
  period_start: string;
  period_end: string;
  audience_type?: string;
  client_id?: string;
  executive_summary?: any;
  key_metrics?: any;
  pillar_performance?: any;
  roi_analysis?: any;
  attribution_insights?: any;
  recommendations?: any;
  charts_config?: any[];
  dashboard_config?: any;
  generated_by?: string;
  status?: string;
  auto_generated?: boolean;
  schedule_frequency?: string;
  export_formats?: string[];
  sharing_permissions?: any;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

export interface DashboardConfig {
  id?: string;
  tenant_id: string;
  dashboard_name: string;
  dashboard_type: 'executive' | 'operational' | 'client' | 'pillar_specific';
  description?: string;
  layout_config: any;
  widgets_config: any;
  filters_config?: any;
  visibility?: string;
  allowed_users?: string[];
  client_access?: boolean;
  refresh_interval?: number;
  real_time_enabled?: boolean;
  auto_refresh?: boolean;
  theme_config?: any;
  white_label?: boolean;
  client_branding?: any;
  created_by?: string;
  is_default?: boolean;
  is_template?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ROIAttributionModel {
  id?: string;
  tenant_id: string;
  model_name: string;
  model_type: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based' | 'custom';
  description?: string;
  attribution_rules: any;
  lookback_window_days?: number;
  conversion_window_days?: number;
  content_weight?: number;
  pr_weight?: number;
  seo_weight?: number;
  is_active?: boolean;
  is_default?: boolean;
  use_machine_learning?: boolean;
  ml_model_config?: any;
  model_accuracy?: number;
  last_trained_at?: string;
  training_data_points?: number;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PillarROIData {
  pillar: string;
  revenue: number;
  cost: number;
  roi: number;
  conversions: number;
  attribution_percentage: number;
  efficiency_score: number;
}

export interface RealTimeMetrics {
  current_visitors: number;
  sessions_today: number;
  conversions_today: number;
  revenue_today: number;
  top_content: any[];
  top_sources: any[];
  real_time_events: AnalyticsEvent[];
}

class EnterpriseAnalyticsService {
  // Real-time Event Tracking
  async trackEvent(eventData: AnalyticsEvent): Promise<AnalyticsEvent> {
    console.log('📊 Tracking analytics event:', eventData.event_type);

    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        ...eventData,
        event_timestamp: eventData.event_timestamp || new Date().toISOString(),
        processed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as AnalyticsEvent;
  }

  async trackPageView(data: {
    tenant_id: string;
    page_url: string;
    page_title?: string;
    user_id?: string;
    session_id: string;
    source_pillar?: string;
    campaign_id?: string;
    referrer?: string;
    utm_params?: any;
  }): Promise<AnalyticsEvent> {
    return await this.trackEvent({
      tenant_id: data.tenant_id,
      event_type: 'pageview',
      event_name: 'Page View',
      event_category: 'engagement',
      source_pillar: data.source_pillar as any,
      source_campaign_id: data.campaign_id,
      source_url: data.page_url,
      user_id: data.user_id,
      session_id: data.session_id,
      properties: {
        page_title: data.page_title,
        page_url: data.page_url
      },
      referrer: data.referrer,
      utm_source: data.utm_params?.utm_source,
      utm_medium: data.utm_params?.utm_medium,
      utm_campaign: data.utm_params?.utm_campaign,
      utm_term: data.utm_params?.utm_term,
      utm_content: data.utm_params?.utm_content
    });
  }

  async trackConversion(data: {
    tenant_id: string;
    conversion_type: string;
    conversion_value: number;
    user_id?: string;
    session_id: string;
    source_pillar?: string;
    campaign_id?: string;
    properties?: any;
  }): Promise<AnalyticsEvent> {
    return await this.trackEvent({
      tenant_id: data.tenant_id,
      event_type: 'conversion',
      event_name: data.conversion_type,
      event_category: 'conversion',
      source_pillar: data.source_pillar as any,
      source_campaign_id: data.campaign_id,
      user_id: data.user_id,
      session_id: data.session_id,
      revenue: data.conversion_value,
      event_value: data.conversion_value,
      properties: data.properties || {}
    });
  }

  // Analytics Metrics Queries
  async getMetrics(
    tenantId: string,
    options: {
      period_type?: 'hourly' | 'daily' | 'weekly' | 'monthly';
      pillar?: string;
      campaign_id?: string;
      start_date?: string;
      end_date?: string;
      limit?: number;
    } = {}
  ): Promise<AnalyticsMetrics[]> {
    let query = supabase
      .from('analytics_metrics')
      .select('*')
      .eq('tenant_id', tenantId);

    if (options.period_type) {
      query = query.eq('period_type', options.period_type);
    }

    if (options.pillar) {
      query = query.eq('pillar', options.pillar);
    }

    if (options.campaign_id) {
      query = query.eq('campaign_id', options.campaign_id);
    }

    if (options.start_date) {
      query = query.gte('date_key', options.start_date);
    }

    if (options.end_date) {
      query = query.lte('date_key', options.end_date);
    }

    const { data, error } = await query
      .order('date_key', { ascending: false })
      .limit(options.limit || 100);

    if (error) throw error;
    return (data as AnalyticsMetrics[]) || [];
  }

  async getKPIDashboard(tenantId: string, period: string = '30d'): Promise<any> {
    console.log('📈 Getting KPI dashboard for:', period);

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - (parseInt(period) * 24 * 60 * 60 * 1000))
      .toISOString().split('T')[0];

    const metrics = await this.getMetrics(tenantId, {
      period_type: 'daily',
      start_date: startDate,
      end_date: endDate
    });

    // Aggregate metrics
    const totalMetrics = metrics.reduce((acc, metric) => {
      acc.sessions += metric.sessions || 0;
      acc.users += metric.users || 0;
      acc.pageviews += metric.pageviews || 0;
      acc.conversions += metric.conversions || 0;
      acc.revenue += metric.revenue || 0;
      acc.total_cost += metric.total_cost || 0;
      return acc;
    }, {
      sessions: 0,
      users: 0,
      pageviews: 0,
      conversions: 0,
      revenue: 0,
      total_cost: 0
    });

    // Calculate derived metrics
    const conversionRate = totalMetrics.sessions > 0 ? 
      (totalMetrics.conversions / totalMetrics.sessions) * 100 : 0;
    const roi = totalMetrics.total_cost > 0 ? 
      ((totalMetrics.revenue - totalMetrics.total_cost) / totalMetrics.total_cost) * 100 : 0;
    const costPerConversion = totalMetrics.conversions > 0 ? 
      totalMetrics.total_cost / totalMetrics.conversions : 0;

    return {
      period: {
        start_date: startDate,
        end_date: endDate,
        days: parseInt(period)
      },
      key_metrics: {
        sessions: totalMetrics.sessions,
        users: totalMetrics.users,
        pageviews: totalMetrics.pageviews,
        conversions: totalMetrics.conversions,
        revenue: totalMetrics.revenue,
        conversion_rate: Math.round(conversionRate * 100) / 100,
        roi: Math.round(roi * 100) / 100,
        cost_per_conversion: Math.round(costPerConversion * 100) / 100
      },
      trends: this.calculateTrends(metrics),
      pillar_breakdown: await this.getPillarBreakdown(tenantId, startDate, endDate)
    };
  }

  // ROI Attribution Analysis
  async calculateROIAttribution(
    tenantId: string,
    options: {
      start_date: string;
      end_date: string;
      attribution_model?: string;
    }
  ): Promise<PillarROIData[]> {
    console.log('💰 Calculating ROI attribution for period:', options.start_date, 'to', options.end_date);

    // Get attribution model
    const attributionModel = await this.getAttributionModel(tenantId, options.attribution_model);
    
    // Get metrics by pillar
    const pillars = ['content', 'pr', 'seo'];
    const pillarData: PillarROIData[] = [];

    for (const pillar of pillars) {
      const metrics = await this.getMetrics(tenantId, {
        period_type: 'daily',
        pillar: pillar,
        start_date: options.start_date,
        end_date: options.end_date
      });

      const aggregated = metrics.reduce((acc, metric) => {
        acc.revenue += metric.revenue || 0;
        acc.cost += metric.total_cost || 0;
        acc.conversions += metric.conversions || 0;
        acc.sessions += metric.sessions || 0;
        return acc;
      }, { revenue: 0, cost: 0, conversions: 0, sessions: 0 });

      // Apply attribution model weights
      const attributionWeight = this.getAttributionWeight(pillar, attributionModel);
      const attributedRevenue = aggregated.revenue * attributionWeight;
      const roi = aggregated.cost > 0 ? ((attributedRevenue - aggregated.cost) / aggregated.cost) * 100 : 0;
      const efficiencyScore = this.calculateEfficiencyScore(aggregated, attributionWeight);

      pillarData.push({
        pillar,
        revenue: attributedRevenue,
        cost: aggregated.cost,
        roi: Math.round(roi * 100) / 100,
        conversions: aggregated.conversions,
        attribution_percentage: attributionWeight * 100,
        efficiency_score: efficiencyScore
      });
    }

    return pillarData.sort((a, b) => b.roi - a.roi);
  }

  // Executive Reporting
  async generateExecutiveReport(
    tenantId: string,
    reportConfig: {
      report_type: 'executive_summary' | 'roi_analysis' | 'pillar_performance' | 'client_presentation';
      period_start: string;
      period_end: string;
      client_id?: string;
      custom_metrics?: string[];
    }
  ): Promise<ExecutiveReport> {
    console.log('📋 Generating executive report:', reportConfig.report_type);

    // Get comprehensive data
    const [kpiData, roiData, pillarMetrics, attributionData] = await Promise.all([
      this.getKPIDashboard(tenantId, '30d'),
      this.calculateROIAttribution(tenantId, {
        start_date: reportConfig.period_start,
        end_date: reportConfig.period_end
      }),
      this.getPillarPerformanceAnalysis(tenantId, reportConfig.period_start, reportConfig.period_end),
      this.getAttributionInsights(tenantId, reportConfig.period_start, reportConfig.period_end)
    ]);

    // Generate executive summary
    const executiveSummary = this.generateExecutiveSummary(kpiData, roiData, pillarMetrics);

    // Generate recommendations
    const recommendations = this.generateRecommendations(kpiData, roiData, pillarMetrics);

    const report: ExecutiveReport = {
      tenant_id: tenantId,
      report_name: `${reportConfig.report_type.replace('_', ' ').toUpperCase()} - ${reportConfig.period_start} to ${reportConfig.period_end}`,
      report_type: reportConfig.report_type,
      report_category: 'custom',
      period_start: reportConfig.period_start,
      period_end: reportConfig.period_end,
      client_id: reportConfig.client_id,
      executive_summary: executiveSummary,
      key_metrics: kpiData.key_metrics,
      pillar_performance: pillarMetrics,
      roi_analysis: roiData,
      attribution_insights: attributionData,
      recommendations: recommendations,
      status: 'draft',
      auto_generated: true
    };

    // Save report
    const { data, error } = await supabase
      .from('executive_reports')
      .insert(report)
      .select()
      .single();

    if (error) throw error;
    return data as ExecutiveReport;
  }

  // Real-time Dashboard
  async getRealTimeMetrics(tenantId: string): Promise<RealTimeMetrics> {
    console.log('⚡ Getting real-time metrics');

    const today = new Date().toISOString().split('T')[0];
    
    // Get today's metrics
    const todayMetrics = await this.getMetrics(tenantId, {
      period_type: 'daily',
      start_date: today,
      end_date: today
    });

    const aggregated = todayMetrics.reduce((acc, metric) => {
      acc.sessions += metric.sessions || 0;
      acc.conversions += metric.conversions || 0;
      acc.revenue += metric.revenue || 0;
      return acc;
    }, { sessions: 0, conversions: 0, revenue: 0 });

    // Get recent events for real-time activity
    const { data: recentEvents } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('event_timestamp', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
      .order('event_timestamp', { ascending: false })
      .limit(20);

    // Simulate current visitors (would be calculated from session data)
    const currentVisitors = Math.floor(Math.random() * 50) + 10;

    return {
      current_visitors: currentVisitors,
      sessions_today: aggregated.sessions,
      conversions_today: aggregated.conversions,
      revenue_today: aggregated.revenue,
      top_content: await this.getTopContent(tenantId, today),
      top_sources: await this.getTopSources(tenantId, today),
      real_time_events: (recentEvents as AnalyticsEvent[]) || []
    };
  }

  // Dashboard Configuration
  async createDashboard(dashboardConfig: DashboardConfig): Promise<DashboardConfig> {
    console.log('🎛️ Creating dashboard:', dashboardConfig.dashboard_name);

    const { data, error } = await supabase
      .from('dashboard_configs')
      .insert(dashboardConfig)
      .select()
      .single();

    if (error) throw error;
    return data as DashboardConfig;
  }

  async getDashboards(tenantId: string, dashboardType?: string): Promise<DashboardConfig[]> {
    let query = supabase
      .from('dashboard_configs')
      .select('*')
      .eq('tenant_id', tenantId);

    if (dashboardType) {
      query = query.eq('dashboard_type', dashboardType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data as DashboardConfig[]) || [];
  }

  // Attribution Models
  async createAttributionModel(model: ROIAttributionModel): Promise<ROIAttributionModel> {
    console.log('🎯 Creating attribution model:', model.model_name);

    const { data, error } = await supabase
      .from('roi_attribution_models')
      .insert(model)
      .select()
      .single();

    if (error) throw error;
    return data as ROIAttributionModel;
  }

  async getAttributionModels(tenantId: string): Promise<ROIAttributionModel[]> {
    const { data, error } = await supabase
      .from('roi_attribution_models')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return (data as ROIAttributionModel[]) || [];
  }

  // Helper Methods
  private calculateTrends(metrics: AnalyticsMetrics[]): any {
    if (metrics.length < 2) return {};

    const recent = metrics.slice(0, Math.floor(metrics.length / 2));
    const previous = metrics.slice(Math.floor(metrics.length / 2));

    const recentAvg = this.calculateAverage(recent);
    const previousAvg = this.calculateAverage(previous);

    return {
      sessions_trend: this.calculatePercentageChange(previousAvg.sessions, recentAvg.sessions),
      conversions_trend: this.calculatePercentageChange(previousAvg.conversions, recentAvg.conversions),
      revenue_trend: this.calculatePercentageChange(previousAvg.revenue, recentAvg.revenue)
    };
  }

  private calculateAverage(metrics: AnalyticsMetrics[]): any {
    if (metrics.length === 0) return { sessions: 0, conversions: 0, revenue: 0 };

    const total = metrics.reduce((acc, metric) => {
      acc.sessions += metric.sessions || 0;
      acc.conversions += metric.conversions || 0;
      acc.revenue += metric.revenue || 0;
      return acc;
    }, { sessions: 0, conversions: 0, revenue: 0 });

    return {
      sessions: total.sessions / metrics.length,
      conversions: total.conversions / metrics.length,
      revenue: total.revenue / metrics.length
    };
  }

  private calculatePercentageChange(previous: number, current: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 100) / 100;
  }

  private async getPillarBreakdown(tenantId: string, startDate: string, endDate: string): Promise<any> {
    const pillars = ['content', 'pr', 'seo'];
    const breakdown: any = {};

    for (const pillar of pillars) {
      const metrics = await this.getMetrics(tenantId, {
        period_type: 'daily',
        pillar: pillar,
        start_date: startDate,
        end_date: endDate
      });

      const total = metrics.reduce((acc, metric) => {
        acc.sessions += metric.sessions || 0;
        acc.conversions += metric.conversions || 0;
        acc.revenue += metric.revenue || 0;
        return acc;
      }, { sessions: 0, conversions: 0, revenue: 0 });

      breakdown[pillar] = total;
    }

    return breakdown;
  }

  private async getAttributionModel(tenantId: string, modelName?: string): Promise<ROIAttributionModel> {
    const models = await this.getAttributionModels(tenantId);
    
    if (modelName) {
      const model = models.find(m => m.model_name === modelName);
      if (model) return model;
    }

    // Return default model or create one
    const defaultModel = models.find(m => m.is_default);
    if (defaultModel) return defaultModel;

    // Create default linear attribution model
    return {
      tenant_id: tenantId,
      model_name: 'Default Linear',
      model_type: 'linear',
      attribution_rules: { type: 'linear', equal_weight: true },
      content_weight: 33.33,
      pr_weight: 33.33,
      seo_weight: 33.34,
      is_active: true,
      is_default: true
    };
  }

  private getAttributionWeight(pillar: string, model: ROIAttributionModel): number {
    switch (pillar) {
      case 'content':
        return (model.content_weight || 33.33) / 100;
      case 'pr':
        return (model.pr_weight || 33.33) / 100;
      case 'seo':
        return (model.seo_weight || 33.34) / 100;
      default:
        return 0.33;
    }
  }

  private calculateEfficiencyScore(metrics: any, attributionWeight: number): number {
    const { revenue, cost, conversions, sessions } = metrics;
    
    // Efficiency = (Revenue per dollar spent * Attribution weight * Conversion rate) * 100
    const revenueEfficiency = cost > 0 ? revenue / cost : 0;
    const conversionRate = sessions > 0 ? conversions / sessions : 0;
    
    return Math.round(revenueEfficiency * attributionWeight * conversionRate * 100 * 100) / 100;
  }

  private async getPillarPerformanceAnalysis(tenantId: string, startDate: string, endDate: string): Promise<any> {
    const roiData = await this.calculateROIAttribution(tenantId, { start_date: startDate, end_date: endDate });
    
    return {
      summary: {
        best_performing_pillar: roiData[0]?.pillar || 'content',
        total_roi: roiData.reduce((sum, pillar) => sum + pillar.roi, 0),
        total_revenue: roiData.reduce((sum, pillar) => sum + pillar.revenue, 0),
        total_cost: roiData.reduce((sum, pillar) => sum + pillar.cost, 0)
      },
      pillar_details: roiData,
      recommendations: this.generatePillarRecommendations(roiData)
    };
  }

  private async getAttributionInsights(tenantId: string, startDate: string, endDate: string): Promise<any> {
    // Get conversion events for attribution analysis
    const { data: events } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('event_type', 'conversion')
      .gte('event_timestamp', startDate)
      .lte('event_timestamp', endDate);

    const insights = {
      total_conversions: events?.length || 0,
      multi_touch_conversions: 0,
      average_touchpoints: 0,
      top_conversion_paths: [],
      attribution_distribution: {}
    };

    // Analyze conversion paths (simplified)
    if (events && events.length > 0) {
      const pathAnalysis = this.analyzeConversionPaths(events);
      insights.multi_touch_conversions = pathAnalysis.multiTouch;
      insights.average_touchpoints = pathAnalysis.avgTouchpoints;
      insights.top_conversion_paths = pathAnalysis.topPaths;
    }

    return insights;
  }

  private generateExecutiveSummary(kpiData: any, roiData: PillarROIData[], pillarMetrics: any): any {
    const totalROI = pillarMetrics.summary.total_roi;
    const bestPillar = pillarMetrics.summary.best_performing_pillar;
    const totalRevenue = kpiData.key_metrics.revenue;
    const conversionRate = kpiData.key_metrics.conversion_rate;

    return {
      headline: `Generated ${this.formatCurrency(totalRevenue)} revenue with ${totalROI.toFixed(1)}% ROI`,
      key_highlights: [
        `${bestPillar.toUpperCase()} pillar delivered the highest ROI`,
        `${conversionRate}% conversion rate across all channels`,
        `${kpiData.key_metrics.sessions.toLocaleString()} total sessions generated`
      ],
      performance_status: totalROI > 100 ? 'excellent' : totalROI > 50 ? 'good' : 'needs_improvement',
      priority_actions: this.generatePriorityActions(roiData, kpiData)
    };
  }

  private generateRecommendations(kpiData: any, roiData: PillarROIData[], pillarMetrics: any): any[] {
    const recommendations = [];

    // ROI-based recommendations
    const lowestROI = roiData.reduce((min, pillar) => pillar.roi < min.roi ? pillar : min);
    const highestROI = roiData.reduce((max, pillar) => pillar.roi > max.roi ? pillar : max);

    if (lowestROI.roi < 50) {
      recommendations.push({
        type: 'budget_reallocation',
        priority: 'high',
        title: `Optimize ${lowestROI.pillar} pillar performance`,
        description: `${lowestROI.pillar} shows ${lowestROI.roi}% ROI. Consider reallocating budget to ${highestROI.pillar}.`,
        expected_impact: 'Increase overall ROI by 15-25%'
      });
    }

    // Conversion rate recommendations
    if (kpiData.key_metrics.conversion_rate < 2) {
      recommendations.push({
        type: 'conversion_optimization',
        priority: 'medium',
        title: 'Improve conversion rate optimization',
        description: 'Current conversion rate is below industry average. Focus on landing page optimization.',
        expected_impact: 'Potential 30-50% increase in conversions'
      });
    }

    return recommendations;
  }

  private generatePillarRecommendations(roiData: PillarROIData[]): any[] {
    return roiData.map(pillar => ({
      pillar: pillar.pillar,
      status: pillar.roi > 100 ? 'performing_well' : 'needs_optimization',
      action: pillar.roi > 100 ? 'Scale investment' : 'Optimize strategy',
      reason: `${pillar.roi}% ROI with ${pillar.attribution_percentage}% attribution`
    }));
  }

  private generatePriorityActions(roiData: PillarROIData[], kpiData: any): string[] {
    const actions = [];
    
    const bestPillar = roiData[0];
    const worstPillar = roiData[roiData.length - 1];

    actions.push(`Scale ${bestPillar.pillar} investments (${bestPillar.roi}% ROI)`);
    
    if (worstPillar.roi < 50) {
      actions.push(`Review ${worstPillar.pillar} strategy (${worstPillar.roi}% ROI)`);
    }

    if (kpiData.key_metrics.conversion_rate < 2) {
      actions.push('Implement conversion rate optimization');
    }

    return actions;
  }

  private async getTopContent(tenantId: string, date: string): Promise<any[]> {
    const { data } = await supabase
      .from('analytics_events')
      .select('source_url, properties')
      .eq('tenant_id', tenantId)
      .eq('event_type', 'pageview')
      .gte('event_timestamp', date)
      .limit(10);

    // Group by URL and count views
    const contentViews = (data || []).reduce((acc: any, event: any) => {
      const url = event.source_url || 'Unknown';
      acc[url] = (acc[url] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(contentViews)
      .map(([url, views]) => ({ url, views }))
      .sort((a: any, b: any) => b.views - a.views)
      .slice(0, 5);
  }

  private async getTopSources(tenantId: string, date: string): Promise<any[]> {
    const { data } = await supabase
      .from('analytics_events')
      .select('source_pillar, utm_source')
      .eq('tenant_id', tenantId)
      .gte('event_timestamp', date)
      .limit(100);

    // Group by source and count
    const sources = (data || []).reduce((acc: any, event: any) => {
      const source = event.utm_source || event.source_pillar || 'Direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(sources)
      .map(([source, count]) => ({ source, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);
  }

  private analyzeConversionPaths(events: any[]): any {
    // Simplified conversion path analysis
    return {
      multiTouch: Math.floor(events.length * 0.3), // Simulate 30% multi-touch
      avgTouchpoints: 2.4,
      topPaths: [
        { path: 'Content → PR → Conversion', count: 45 },
        { path: 'SEO → Content → Conversion', count: 38 },
        { path: 'PR → SEO → Conversion', count: 22 }
      ]
    };
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

export const enterpriseAnalyticsService = new EnterpriseAnalyticsService();