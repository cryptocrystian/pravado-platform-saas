-- Unified Campaign Management System
-- This migration creates a comprehensive system that connects Content, PR, and SEO pillars
-- with cross-pillar attribution, performance tracking, and workflow integration

-- Unified Campaigns table - Master campaign management
CREATE TABLE IF NOT EXISTS unified_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Campaign Details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50) DEFAULT 'integrated' CHECK (campaign_type IN ('content', 'pr', 'seo', 'integrated')),
    
    -- Timeline
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'cancelled')),
    
    -- Budget and Goals
    budget DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'USD',
    primary_goal VARCHAR(100), -- 'brand_awareness', 'lead_generation', 'traffic_growth', etc.
    kpi_targets JSONB DEFAULT '{}', -- Flexible KPI targets for each pillar
    
    -- Target Audience
    target_audience JSONB DEFAULT '{}',
    target_markets TEXT[], -- Geographic markets
    target_keywords TEXT[], -- SEO focus keywords
    target_outlets TEXT[], -- PR target outlets
    content_themes TEXT[], -- Content themes and topics
    
    -- Campaign Settings
    cross_pillar_attribution_enabled BOOLEAN DEFAULT true,
    workflow_automation_enabled BOOLEAN DEFAULT true,
    performance_tracking_enabled BOOLEAN DEFAULT true,
    
    -- Campaign Manager
    campaign_manager_id UUID REFERENCES user_profiles(id),
    team_members JSONB DEFAULT '[]', -- Array of user IDs and roles
    
    -- Metadata
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Pillars - Links unified campaigns to specific pillar campaigns
CREATE TABLE IF NOT EXISTS campaign_pillars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    unified_campaign_id UUID NOT NULL REFERENCES unified_campaigns(id) ON DELETE CASCADE,
    
    -- Pillar Configuration
    pillar_type VARCHAR(20) NOT NULL CHECK (pillar_type IN ('content', 'pr', 'seo')),
    pillar_weight DECIMAL(5,2) DEFAULT 33.33 CHECK (pillar_weight >= 0 AND pillar_weight <= 100), -- Attribution weight
    
    -- Pillar-specific Campaign IDs
    content_campaign_id UUID REFERENCES campaigns(id), -- Links to existing campaigns table
    pr_campaign_id UUID REFERENCES pr_campaigns(id),
    seo_project_id UUID REFERENCES seo_projects(id),
    
    -- Pillar Goals and KPIs
    pillar_goals JSONB DEFAULT '{}',
    pillar_budget DECIMAL(12,2),
    pillar_status VARCHAR(20) DEFAULT 'active',
    
    -- Performance Targets
    target_metrics JSONB DEFAULT '{}', -- Specific metrics for this pillar
    
    -- Timing
    pillar_start_date TIMESTAMP WITH TIME ZONE,
    pillar_end_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cross-Pillar Activities - Track activities that span multiple pillars
CREATE TABLE IF NOT EXISTS cross_pillar_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    unified_campaign_id UUID NOT NULL REFERENCES unified_campaigns(id) ON DELETE CASCADE,
    
    -- Activity Details
    activity_type VARCHAR(50) NOT NULL, -- 'content_creation', 'press_release', 'seo_optimization', 'social_promotion'
    activity_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Cross-Pillar Impact
    primary_pillar VARCHAR(20) NOT NULL CHECK (primary_pillar IN ('content', 'pr', 'seo')),
    supporting_pillars TEXT[] DEFAULT '{}', -- Which other pillars this activity supports
    
    -- Asset References
    content_piece_id UUID REFERENCES content_pieces(id),
    press_release_id UUID REFERENCES press_releases(id),
    seo_content_optimization_id UUID REFERENCES seo_content_optimization(id),
    
    -- Activity Status and Timeline
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    planned_date TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Assignment
    assigned_to UUID REFERENCES user_profiles(id),
    assigned_pillar_teams JSONB DEFAULT '{}', -- Which teams from each pillar are involved
    
    -- Dependencies
    depends_on_activities UUID[], -- Array of activity IDs this depends on
    blocks_activities UUID[], -- Array of activity IDs this blocks
    
    -- Performance Data
    performance_data JSONB DEFAULT '{}', -- Store cross-pillar performance metrics
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Performance Tracking - Unified performance metrics
CREATE TABLE IF NOT EXISTS campaign_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    unified_campaign_id UUID NOT NULL REFERENCES unified_campaigns(id) ON DELETE CASCADE,
    
    -- Time Period
    reporting_period VARCHAR(20) NOT NULL CHECK (reporting_period IN ('daily', 'weekly', 'monthly', 'campaign_total')),
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Unified Metrics
    total_impressions BIGINT DEFAULT 0,
    total_reach BIGINT DEFAULT 0,
    total_engagement BIGINT DEFAULT 0,
    total_clicks BIGINT DEFAULT 0,
    total_conversions BIGINT DEFAULT 0,
    total_leads BIGINT DEFAULT 0,
    
    -- Financial Metrics
    total_spend DECIMAL(12,2) DEFAULT 0,
    cost_per_click DECIMAL(8,2),
    cost_per_conversion DECIMAL(8,2),
    return_on_investment DECIMAL(8,2),
    
    -- Content Metrics
    content_views BIGINT DEFAULT 0,
    content_shares BIGINT DEFAULT 0,
    content_comments BIGINT DEFAULT 0,
    content_engagement_rate DECIMAL(5,2),
    
    -- PR Metrics
    media_mentions BIGINT DEFAULT 0,
    media_impressions BIGINT DEFAULT 0,
    earned_media_value DECIMAL(12,2) DEFAULT 0,
    sentiment_score DECIMAL(5,2),
    
    -- SEO Metrics
    organic_traffic BIGINT DEFAULT 0,
    organic_keywords_ranking BIGINT DEFAULT 0,
    average_keyword_position DECIMAL(5,2),
    seo_visibility_score DECIMAL(5,2),
    
    -- Cross-Pillar Attribution
    content_attributed_conversions BIGINT DEFAULT 0,
    pr_attributed_conversions BIGINT DEFAULT 0,
    seo_attributed_conversions BIGINT DEFAULT 0,
    multi_touch_conversions BIGINT DEFAULT 0,
    
    -- Performance Scores
    overall_performance_score DECIMAL(5,2), -- 0-100 score
    pillar_performance_scores JSONB DEFAULT '{}', -- Individual pillar scores
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Attribution - Track customer journey across pillars
CREATE TABLE IF NOT EXISTS campaign_attribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    unified_campaign_id UUID NOT NULL REFERENCES unified_campaigns(id) ON DELETE CASCADE,
    
    -- User Journey Tracking
    session_id VARCHAR(255),
    user_id VARCHAR(255), -- Can be anonymous or identified
    journey_step INTEGER NOT NULL, -- Order in the customer journey
    
    -- Touchpoint Details
    touchpoint_type VARCHAR(50) NOT NULL, -- 'content_view', 'press_mention', 'organic_search', 'social_share'
    pillar_source VARCHAR(20) NOT NULL CHECK (pillar_source IN ('content', 'pr', 'seo', 'direct')),
    
    -- Asset References
    source_content_id UUID REFERENCES content_pieces(id),
    source_press_release_id UUID REFERENCES press_releases(id),
    source_keyword VARCHAR(255), -- For SEO attribution
    source_url TEXT,
    referring_domain VARCHAR(255),
    
    -- Interaction Data
    interaction_type VARCHAR(50), -- 'view', 'click', 'share', 'comment', 'conversion'
    interaction_value DECIMAL(8,2), -- Assigned value to this interaction
    time_spent_seconds INTEGER,
    
    -- Attribution Modeling
    first_touch_attribution DECIMAL(5,2), -- Percentage attributed as first touch
    last_touch_attribution DECIMAL(5,2), -- Percentage attributed as last touch
    linear_attribution DECIMAL(5,2), -- Linear attribution percentage
    time_decay_attribution DECIMAL(5,2), -- Time decay attribution percentage
    
    -- Context
    device_type VARCHAR(50),
    traffic_source VARCHAR(100),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    -- Conversion Data
    is_conversion BOOLEAN DEFAULT false,
    conversion_type VARCHAR(50), -- 'lead', 'signup', 'purchase', 'download'
    conversion_value DECIMAL(12,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Workflows - Automate cross-pillar processes
CREATE TABLE IF NOT EXISTS campaign_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    unified_campaign_id UUID NOT NULL REFERENCES unified_campaigns(id) ON DELETE CASCADE,
    
    -- Workflow Definition
    workflow_name VARCHAR(255) NOT NULL,
    workflow_type VARCHAR(50) NOT NULL, -- 'content_to_pr', 'pr_to_seo', 'integrated_launch'
    description TEXT,
    
    -- Workflow Configuration
    trigger_conditions JSONB NOT NULL, -- What triggers this workflow
    workflow_steps JSONB NOT NULL, -- Detailed steps and actions
    
    -- Automation Settings
    is_automated BOOLEAN DEFAULT false,
    requires_approval BOOLEAN DEFAULT true,
    auto_execute BOOLEAN DEFAULT false,
    
    -- Stakeholders
    workflow_owner_id UUID REFERENCES user_profiles(id),
    approvers JSONB DEFAULT '[]', -- Array of user IDs who can approve
    participants JSONB DEFAULT '[]', -- Array of user IDs involved in execution
    
    -- Status and Execution
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    last_executed_at TIMESTAMP WITH TIME ZONE,
    next_execution_at TIMESTAMP WITH TIME ZONE,
    execution_count INTEGER DEFAULT 0,
    
    -- Performance
    success_rate DECIMAL(5,2),
    average_completion_time INTERVAL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Workflow Executions - Track workflow runs
CREATE TABLE IF NOT EXISTS campaign_workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workflow_id UUID NOT NULL REFERENCES campaign_workflows(id) ON DELETE CASCADE,
    unified_campaign_id UUID NOT NULL REFERENCES unified_campaigns(id) ON DELETE CASCADE,
    
    -- Execution Details
    execution_trigger VARCHAR(100), -- What triggered this execution
    triggered_by_user_id UUID REFERENCES user_profiles(id),
    
    -- Execution Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Step Tracking
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER NOT NULL,
    steps_completed INTEGER DEFAULT 0,
    step_results JSONB DEFAULT '[]', -- Results from each step
    
    -- Error Handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    
    -- Results
    execution_results JSONB DEFAULT '{}',
    created_assets JSONB DEFAULT '[]', -- Assets created during execution
    notifications_sent JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Insights - AI-powered campaign insights and recommendations
CREATE TABLE IF NOT EXISTS campaign_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    unified_campaign_id UUID NOT NULL REFERENCES unified_campaigns(id) ON DELETE CASCADE,
    
    -- Insight Details
    insight_type VARCHAR(50) NOT NULL, -- 'performance_alert', 'optimization_suggestion', 'cross_pillar_opportunity'
    insight_category VARCHAR(50) NOT NULL, -- 'budget', 'content', 'timing', 'audience', 'channel'
    
    -- Insight Content
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- AI Analysis
    confidence_score DECIMAL(5,2), -- AI confidence in this insight (0-100)
    data_sources JSONB DEFAULT '[]', -- What data sources contributed to this insight
    analysis_metadata JSONB DEFAULT '{}',
    
    -- Recommendations
    recommended_actions JSONB DEFAULT '[]', -- Array of recommended actions
    expected_impact JSONB DEFAULT '{}', -- Expected impact of implementing recommendations
    priority_score DECIMAL(5,2), -- Priority ranking
    
    -- Impact on Pillars
    affects_content BOOLEAN DEFAULT false,
    affects_pr BOOLEAN DEFAULT false,
    affects_seo BOOLEAN DEFAULT false,
    cross_pillar_impact JSONB DEFAULT '{}',
    
    -- Status and Actions
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'implementing', 'completed', 'dismissed')),
    reviewed_by UUID REFERENCES user_profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    action_taken JSONB DEFAULT '{}',
    
    -- Expiration
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_unified_campaigns_tenant_id ON unified_campaigns(tenant_id);
CREATE INDEX IF NOT EXISTS idx_unified_campaigns_status ON unified_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_unified_campaigns_dates ON unified_campaigns(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_campaign_pillars_unified_campaign_id ON campaign_pillars(unified_campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_pillars_pillar_type ON campaign_pillars(pillar_type);

CREATE INDEX IF NOT EXISTS idx_cross_pillar_activities_campaign_id ON cross_pillar_activities(unified_campaign_id);
CREATE INDEX IF NOT EXISTS idx_cross_pillar_activities_primary_pillar ON cross_pillar_activities(primary_pillar);
CREATE INDEX IF NOT EXISTS idx_cross_pillar_activities_status ON cross_pillar_activities(status);

CREATE INDEX IF NOT EXISTS idx_campaign_performance_campaign_id ON campaign_performance(unified_campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_performance_period ON campaign_performance(reporting_period, period_start);

CREATE INDEX IF NOT EXISTS idx_campaign_attribution_campaign_id ON campaign_attribution(unified_campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_attribution_user_journey ON campaign_attribution(user_id, journey_step);
CREATE INDEX IF NOT EXISTS idx_campaign_attribution_pillar_source ON campaign_attribution(pillar_source);

CREATE INDEX IF NOT EXISTS idx_campaign_workflows_campaign_id ON campaign_workflows(unified_campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_workflows_type ON campaign_workflows(workflow_type);

CREATE INDEX IF NOT EXISTS idx_campaign_workflow_executions_workflow_id ON campaign_workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_campaign_workflow_executions_status ON campaign_workflow_executions(status);

CREATE INDEX IF NOT EXISTS idx_campaign_insights_campaign_id ON campaign_insights(unified_campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_insights_type ON campaign_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_campaign_insights_status ON campaign_insights(status);

-- Add Row Level Security (RLS)
ALTER TABLE unified_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_pillar_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant isolation
CREATE POLICY unified_campaigns_tenant_isolation ON unified_campaigns
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY campaign_pillars_tenant_isolation ON campaign_pillars
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY cross_pillar_activities_tenant_isolation ON cross_pillar_activities
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY campaign_performance_tenant_isolation ON campaign_performance
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY campaign_attribution_tenant_isolation ON campaign_attribution
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY campaign_workflows_tenant_isolation ON campaign_workflows
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY campaign_workflow_executions_tenant_isolation ON campaign_workflow_executions
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY campaign_insights_tenant_isolation ON campaign_insights
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON unified_campaigns TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON campaign_pillars TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON cross_pillar_activities TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON campaign_performance TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON campaign_attribution TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON campaign_workflows TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON campaign_workflow_executions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON campaign_insights TO authenticated;

-- Update functions for timestamp updates
CREATE TRIGGER trigger_unified_campaigns_updated_at
    BEFORE UPDATE ON unified_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_campaign_pillars_updated_at
    BEFORE UPDATE ON campaign_pillars
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_cross_pillar_activities_updated_at
    BEFORE UPDATE ON cross_pillar_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_campaign_workflows_updated_at
    BEFORE UPDATE ON campaign_workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_campaign_workflow_executions_updated_at
    BEFORE UPDATE ON campaign_workflow_executions
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_campaign_insights_updated_at
    BEFORE UPDATE ON campaign_insights
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

-- Comments for documentation
COMMENT ON TABLE unified_campaigns IS 'Master campaign management that connects Content, PR, and SEO pillars';
COMMENT ON TABLE campaign_pillars IS 'Links unified campaigns to specific pillar campaigns with attribution weights';
COMMENT ON TABLE cross_pillar_activities IS 'Activities that span multiple pillars with dependency tracking';
COMMENT ON TABLE campaign_performance IS 'Unified performance metrics across all pillars with attribution';
COMMENT ON TABLE campaign_attribution IS 'Customer journey tracking across pillars for attribution modeling';
COMMENT ON TABLE campaign_workflows IS 'Automated cross-pillar workflow definitions';
COMMENT ON TABLE campaign_workflow_executions IS 'Tracking of workflow execution runs';
COMMENT ON TABLE campaign_insights IS 'AI-powered insights and recommendations for campaign optimization';