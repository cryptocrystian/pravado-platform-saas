-- Enterprise Analytics System
-- Real-time performance tracking, ROI attribution, and comprehensive reporting

-- Real-time Analytics Events table for streaming data
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Event Details
    event_type VARCHAR(50) NOT NULL, -- 'pageview', 'conversion', 'engagement', 'attribution'
    event_name VARCHAR(100) NOT NULL,
    event_category VARCHAR(50), -- 'content', 'pr', 'seo', 'campaign'
    
    -- Source Information
    source_pillar VARCHAR(20) CHECK (source_pillar IN ('content', 'pr', 'seo', 'direct', 'social')),
    source_campaign_id UUID,
    source_content_id UUID,
    source_url TEXT,
    
    -- User and Session
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    anonymous_id VARCHAR(255),
    
    -- Device and Context
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    country VARCHAR(2),
    region VARCHAR(100),
    city VARCHAR(100),
    
    -- Event Properties
    properties JSONB DEFAULT '{}',
    custom_properties JSONB DEFAULT '{}',
    
    -- Value and Metrics
    event_value DECIMAL(12,2) DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0,
    quantity INTEGER DEFAULT 1,
    
    -- Timestamps
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100)
);

-- Performance Metrics Aggregations table for fast queries
CREATE TABLE IF NOT EXISTS analytics_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Time Dimension
    date_key DATE NOT NULL,
    hour_key INTEGER, -- 0-23 for hourly aggregations
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('hourly', 'daily', 'weekly', 'monthly')),
    
    -- Dimension Keys
    pillar VARCHAR(20) CHECK (pillar IN ('content', 'pr', 'seo', 'unified')),
    campaign_id UUID,
    content_type VARCHAR(50),
    device_type VARCHAR(50),
    traffic_source VARCHAR(100),
    
    -- Core Metrics
    sessions BIGINT DEFAULT 0,
    users BIGINT DEFAULT 0,
    pageviews BIGINT DEFAULT 0,
    unique_pageviews BIGINT DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    avg_session_duration DECIMAL(10,2) DEFAULT 0,
    
    -- Engagement Metrics
    total_engagement_events BIGINT DEFAULT 0,
    avg_engagement_rate DECIMAL(5,2) DEFAULT 0,
    time_on_page DECIMAL(10,2) DEFAULT 0,
    scroll_depth DECIMAL(5,2) DEFAULT 0,
    
    -- Conversion Metrics
    conversions BIGINT DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    conversion_value DECIMAL(12,2) DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0,
    
    -- Content Metrics
    content_views BIGINT DEFAULT 0,
    content_shares BIGINT DEFAULT 0,
    content_likes BIGINT DEFAULT 0,
    content_comments BIGINT DEFAULT 0,
    content_downloads BIGINT DEFAULT 0,
    
    -- PR Metrics
    pr_mentions BIGINT DEFAULT 0,
    pr_impressions BIGINT DEFAULT 0,
    pr_reach BIGINT DEFAULT 0,
    earned_media_value DECIMAL(12,2) DEFAULT 0,
    sentiment_score DECIMAL(5,2),
    
    -- SEO Metrics
    organic_sessions BIGINT DEFAULT 0,
    organic_users BIGINT DEFAULT 0,
    search_impressions BIGINT DEFAULT 0,
    search_clicks BIGINT DEFAULT 0,
    avg_position DECIMAL(5,2),
    
    -- Attribution Metrics
    first_touch_conversions BIGINT DEFAULT 0,
    last_touch_conversions BIGINT DEFAULT 0,
    linear_conversions DECIMAL(10,2) DEFAULT 0,
    time_decay_conversions DECIMAL(10,2) DEFAULT 0,
    
    -- Cost and ROI
    total_cost DECIMAL(12,2) DEFAULT 0,
    cost_per_click DECIMAL(8,2),
    cost_per_conversion DECIMAL(8,2),
    return_on_ad_spend DECIMAL(8,2),
    return_on_investment DECIMAL(8,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Executive Reporting table for high-level dashboards
CREATE TABLE IF NOT EXISTS executive_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Report Configuration
    report_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- 'executive_summary', 'roi_analysis', 'pillar_performance', 'client_presentation'
    report_category VARCHAR(50), -- 'monthly', 'quarterly', 'campaign', 'custom'
    
    -- Time Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Target Audience
    audience_type VARCHAR(50) DEFAULT 'executive', -- 'executive', 'client', 'stakeholder', 'team'
    client_id UUID, -- If this is a client-specific report
    
    -- Report Content
    executive_summary JSONB,
    key_metrics JSONB,
    pillar_performance JSONB,
    roi_analysis JSONB,
    attribution_insights JSONB,
    recommendations JSONB,
    
    -- Visualizations
    charts_config JSONB DEFAULT '[]',
    dashboard_config JSONB DEFAULT '{}',
    
    -- Report Metadata
    generated_by UUID REFERENCES user_profiles(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'published')),
    auto_generated BOOLEAN DEFAULT false,
    schedule_frequency VARCHAR(20), -- 'weekly', 'monthly', 'quarterly'
    
    -- Export and Sharing
    export_formats TEXT[] DEFAULT ARRAY['pdf', 'excel'], -- Available export formats
    sharing_permissions JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Real-time Dashboards configuration
CREATE TABLE IF NOT EXISTS dashboard_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Dashboard Details
    dashboard_name VARCHAR(255) NOT NULL,
    dashboard_type VARCHAR(50) NOT NULL, -- 'executive', 'operational', 'client', 'pillar_specific'
    description TEXT,
    
    -- Configuration
    layout_config JSONB NOT NULL, -- Widget layouts and positions
    widgets_config JSONB NOT NULL, -- Widget types and settings
    filters_config JSONB DEFAULT '{}', -- Available filters
    
    -- Access Control
    visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('private', 'team', 'client', 'public')),
    allowed_users JSONB DEFAULT '[]',
    client_access BOOLEAN DEFAULT false,
    
    -- Real-time Settings
    refresh_interval INTEGER DEFAULT 300, -- Seconds
    real_time_enabled BOOLEAN DEFAULT true,
    auto_refresh BOOLEAN DEFAULT true,
    
    -- Branding
    theme_config JSONB DEFAULT '{}',
    white_label BOOLEAN DEFAULT false,
    client_branding JSONB DEFAULT '{}',
    
    -- Metadata
    created_by UUID REFERENCES user_profiles(id),
    is_default BOOLEAN DEFAULT false,
    is_template BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROI Attribution Models table
CREATE TABLE IF NOT EXISTS roi_attribution_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Model Configuration
    model_name VARCHAR(255) NOT NULL,
    model_type VARCHAR(50) NOT NULL, -- 'first_touch', 'last_touch', 'linear', 'time_decay', 'position_based', 'custom'
    description TEXT,
    
    -- Attribution Rules
    attribution_rules JSONB NOT NULL,
    lookback_window_days INTEGER DEFAULT 30,
    conversion_window_days INTEGER DEFAULT 7,
    
    -- Pillar Weights (for custom models)
    content_weight DECIMAL(5,2) DEFAULT 33.33,
    pr_weight DECIMAL(5,2) DEFAULT 33.33,
    seo_weight DECIMAL(5,2) DEFAULT 33.34,
    
    -- Model Settings
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    use_machine_learning BOOLEAN DEFAULT false,
    ml_model_config JSONB DEFAULT '{}',
    
    -- Performance Tracking
    model_accuracy DECIMAL(5,2),
    last_trained_at TIMESTAMP WITH TIME ZONE,
    training_data_points INTEGER,
    
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data Quality and Validation
CREATE TABLE IF NOT EXISTS analytics_data_quality (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Quality Check Details
    check_date DATE NOT NULL,
    data_source VARCHAR(50) NOT NULL, -- 'events', 'metrics', 'campaigns', 'content'
    quality_score DECIMAL(5,2) NOT NULL, -- 0-100
    
    -- Quality Metrics
    completeness_score DECIMAL(5,2),
    accuracy_score DECIMAL(5,2),
    consistency_score DECIMAL(5,2),
    timeliness_score DECIMAL(5,2),
    
    -- Issues Found
    missing_data_points INTEGER DEFAULT 0,
    duplicate_records INTEGER DEFAULT 0,
    inconsistent_values INTEGER DEFAULT 0,
    outliers_detected INTEGER DEFAULT 0,
    
    -- Issue Details
    quality_issues JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    
    -- Auto-correction Applied
    auto_corrections_applied JSONB DEFAULT '[]',
    manual_review_required BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time Alerts and Notifications
CREATE TABLE IF NOT EXISTS analytics_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Alert Configuration
    alert_name VARCHAR(255) NOT NULL,
    alert_type VARCHAR(50) NOT NULL, -- 'threshold', 'anomaly', 'goal', 'trend'
    metric_name VARCHAR(100) NOT NULL,
    
    -- Trigger Conditions
    threshold_value DECIMAL(12,2),
    comparison_operator VARCHAR(10), -- '>', '<', '>=', '<=', '=', '!='
    time_window_minutes INTEGER DEFAULT 60,
    
    -- Alert Settings
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    is_active BOOLEAN DEFAULT true,
    
    -- Notification Preferences
    notification_channels JSONB DEFAULT '["email"]', -- email, slack, webhook, dashboard
    notification_recipients JSONB DEFAULT '[]',
    
    -- Frequency Control
    cooldown_minutes INTEGER DEFAULT 60,
    max_alerts_per_day INTEGER DEFAULT 10,
    
    -- Alert History
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    trigger_count INTEGER DEFAULT 0,
    false_positive_count INTEGER DEFAULT 0,
    
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_tenant_timestamp ON analytics_events(tenant_id, event_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_pillar ON analytics_events(event_type, source_pillar);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_campaign ON analytics_events(source_campaign_id);

CREATE INDEX IF NOT EXISTS idx_analytics_metrics_tenant_date ON analytics_metrics(tenant_id, date_key DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_pillar_period ON analytics_metrics(pillar, period_type);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_campaign ON analytics_metrics(campaign_id);

CREATE INDEX IF NOT EXISTS idx_executive_reports_tenant_type ON executive_reports(tenant_id, report_type);
CREATE INDEX IF NOT EXISTS idx_executive_reports_period ON executive_reports(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_executive_reports_client ON executive_reports(client_id);

CREATE INDEX IF NOT EXISTS idx_dashboard_configs_tenant_type ON dashboard_configs(tenant_id, dashboard_type);
CREATE INDEX IF NOT EXISTS idx_dashboard_configs_visibility ON dashboard_configs(visibility);

CREATE INDEX IF NOT EXISTS idx_roi_attribution_models_tenant_active ON roi_attribution_models(tenant_id, is_active);

-- Partitioning for analytics_events table (by month)
-- This would be implemented based on the database setup and requirements

-- Add Row Level Security (RLS)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE roi_attribution_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_data_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant isolation
CREATE POLICY analytics_events_tenant_isolation ON analytics_events
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY analytics_metrics_tenant_isolation ON analytics_metrics
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY executive_reports_tenant_isolation ON executive_reports
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY dashboard_configs_tenant_isolation ON dashboard_configs
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY roi_attribution_models_tenant_isolation ON roi_attribution_models
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY analytics_data_quality_tenant_isolation ON analytics_data_quality
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY analytics_alerts_tenant_isolation ON analytics_alerts
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON analytics_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON analytics_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON executive_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON dashboard_configs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON roi_attribution_models TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON analytics_data_quality TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON analytics_alerts TO authenticated;

-- Triggers for auto-updating timestamps
CREATE TRIGGER trigger_analytics_metrics_updated_at
    BEFORE UPDATE ON analytics_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_executive_reports_updated_at
    BEFORE UPDATE ON executive_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_dashboard_configs_updated_at
    BEFORE UPDATE ON dashboard_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_roi_attribution_models_updated_at
    BEFORE UPDATE ON roi_attribution_models
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

-- Functions for real-time aggregations
CREATE OR REPLACE FUNCTION aggregate_analytics_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update daily metrics when new events are inserted
    INSERT INTO analytics_metrics (
        tenant_id, date_key, period_type, pillar, 
        sessions, users, pageviews, conversions, revenue
    )
    VALUES (
        NEW.tenant_id, 
        DATE(NEW.event_timestamp), 
        'daily', 
        NEW.source_pillar,
        CASE WHEN NEW.event_type = 'session_start' THEN 1 ELSE 0 END,
        CASE WHEN NEW.event_type = 'user_identification' THEN 1 ELSE 0 END,
        CASE WHEN NEW.event_type = 'pageview' THEN 1 ELSE 0 END,
        CASE WHEN NEW.event_type = 'conversion' THEN 1 ELSE 0 END,
        NEW.revenue
    )
    ON CONFLICT (tenant_id, date_key, period_type, pillar) 
    DO UPDATE SET
        sessions = analytics_metrics.sessions + EXCLUDED.sessions,
        users = analytics_metrics.users + EXCLUDED.users,
        pageviews = analytics_metrics.pageviews + EXCLUDED.pageviews,
        conversions = analytics_metrics.conversions + EXCLUDED.conversions,
        revenue = analytics_metrics.revenue + EXCLUDED.revenue,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for real-time aggregation
CREATE TRIGGER trigger_aggregate_analytics_metrics
    AFTER INSERT ON analytics_events
    FOR EACH ROW
    EXECUTE FUNCTION aggregate_analytics_metrics();

-- Comments for documentation
COMMENT ON TABLE analytics_events IS 'Real-time analytics events for streaming data and immediate insights';
COMMENT ON TABLE analytics_metrics IS 'Pre-aggregated performance metrics for fast dashboard queries';
COMMENT ON TABLE executive_reports IS 'High-level executive and client reports with comprehensive insights';
COMMENT ON TABLE dashboard_configs IS 'Real-time dashboard configurations for different audiences';
COMMENT ON TABLE roi_attribution_models IS 'ROI attribution models for cross-pillar performance analysis';
COMMENT ON TABLE analytics_data_quality IS 'Data quality monitoring and validation tracking';
COMMENT ON TABLE analytics_alerts IS 'Real-time alerts and notifications for performance monitoring';