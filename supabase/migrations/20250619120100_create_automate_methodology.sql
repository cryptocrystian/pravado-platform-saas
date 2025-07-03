-- AUTOMATE Methodology Framework
-- This migration creates comprehensive step-by-step guidance and progress tracking
-- for the AUTOMATE methodology across all platform features

-- AUTOMATE Methodology Master Configuration
CREATE TABLE IF NOT EXISTS automate_methodology_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Methodology Configuration
    methodology_name VARCHAR(50) DEFAULT 'AUTOMATE' NOT NULL,
    campaign_id UUID REFERENCES unified_campaigns(id), -- Optional link to specific campaign
    
    -- Status and Progress
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')),
    overall_completion_percentage DECIMAL(5,2) DEFAULT 0 CHECK (overall_completion_percentage >= 0 AND overall_completion_percentage <= 100),
    
    -- Timeline
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    target_completion_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Configuration
    custom_step_configuration JSONB DEFAULT '{}', -- Custom step weights and configurations
    methodology_goals JSONB DEFAULT '{}', -- Specific goals for this methodology instance
    success_criteria JSONB DEFAULT '{}', -- Success criteria and KPIs
    
    -- Team and Stakeholders
    methodology_owner_id UUID REFERENCES user_profiles(id),
    stakeholder_team JSONB DEFAULT '[]', -- Array of user IDs and roles
    
    -- Metadata
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one active methodology per tenant per campaign
    UNIQUE(tenant_id, campaign_id)
);

-- AUTOMATE Step Progress Tracking
CREATE TABLE IF NOT EXISTS automate_step_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    methodology_campaign_id UUID NOT NULL REFERENCES automate_methodology_campaigns(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Step Identification
    step_code VARCHAR(1) NOT NULL CHECK (step_code IN ('A', 'U', 'T', 'O', 'M', 'A', 'T', 'E')),
    step_name VARCHAR(100) NOT NULL,
    step_index INTEGER NOT NULL CHECK (step_index >= 0 AND step_index <= 7),
    step_description TEXT,
    
    -- Progress Tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked', 'skipped')),
    completion_percentage DECIMAL(5,2) DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- Step Configuration
    is_required BOOLEAN DEFAULT true,
    estimated_hours DECIMAL(5,2),
    actual_hours_spent DECIMAL(5,2),
    priority_level VARCHAR(10) DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Cross-Pillar Integration
    content_pillar_weight DECIMAL(5,2) DEFAULT 33.33,
    pr_pillar_weight DECIMAL(5,2) DEFAULT 33.33,
    seo_pillar_weight DECIMAL(5,2) DEFAULT 33.34,
    
    -- Assessment and Audit Data (for step A)
    audit_scores JSONB DEFAULT '{}', -- Store audit results and scores
    baseline_metrics JSONB DEFAULT '{}', -- Initial metrics and benchmarks
    
    -- Step-Specific Data
    target_audience_data JSONB DEFAULT '{}', -- For step U
    strategy_framework JSONB DEFAULT '{}', -- For step T
    optimization_recommendations JSONB DEFAULT '{}', -- For step O
    measurement_kpis JSONB DEFAULT '{}', -- For step M
    acceleration_tactics JSONB DEFAULT '{}', -- For step A (second)
    transformation_roadmap JSONB DEFAULT '{}', -- For step T (second)
    excellence_standards JSONB DEFAULT '{}', -- For step E
    
    -- Action Items and Tasks
    action_items JSONB DEFAULT '[]', -- Array of specific tasks for this step
    completed_actions JSONB DEFAULT '[]', -- Array of completed action IDs
    
    -- Dependencies and Blockers
    depends_on_steps INTEGER[], -- Array of step indices this depends on
    blocking_issues JSONB DEFAULT '[]', -- Current blockers preventing progress
    
    -- Timeline
    started_at TIMESTAMP WITH TIME ZONE,
    target_completion_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Assignment
    assigned_to UUID REFERENCES user_profiles(id),
    assigned_team JSONB DEFAULT '[]', -- Array of user IDs assigned to this step
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique step per methodology campaign
    UNIQUE(methodology_campaign_id, step_code, step_index)
);

-- AUTOMATE Guided Actions - Specific actionable items for each step
CREATE TABLE IF NOT EXISTS automate_guided_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_progress_id UUID NOT NULL REFERENCES automate_step_progress(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Action Details
    action_title VARCHAR(255) NOT NULL,
    action_description TEXT NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'assessment', 'research', 'creation', 'optimization', 'analysis'
    action_category VARCHAR(50) NOT NULL, -- 'content', 'pr', 'seo', 'strategy', 'technical'
    
    -- Guidance Information
    why_important TEXT, -- Explanation of why this action is important
    how_to_complete TEXT, -- Step-by-step instructions
    expected_outcome TEXT, -- What the user should achieve
    best_practices JSONB DEFAULT '[]', -- Array of best practice tips
    common_mistakes JSONB DEFAULT '[]', -- Array of common mistakes to avoid
    
    -- Action Configuration
    is_required BOOLEAN DEFAULT true,
    estimated_time_minutes INTEGER,
    difficulty_level VARCHAR(10) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'expert')),
    order_index INTEGER NOT NULL, -- Order within the step
    
    -- Prerequisites and Dependencies
    prerequisites JSONB DEFAULT '[]', -- What must be completed before this action
    required_tools JSONB DEFAULT '[]', -- Tools or resources needed
    required_skills JSONB DEFAULT '[]', -- Skills or knowledge required
    
    -- Platform Integration
    related_platform_features JSONB DEFAULT '[]', -- Links to specific platform features
    auto_completion_available BOOLEAN DEFAULT false, -- Can this be automated?
    platform_guidance_url VARCHAR(500), -- Deep link to specific platform section
    
    -- Progress Tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'blocked')),
    completion_notes TEXT, -- User notes on completion
    completion_evidence JSONB DEFAULT '{}', -- Evidence or results of completion
    
    -- Quality Assurance
    requires_review BOOLEAN DEFAULT false,
    reviewed_by UUID REFERENCES user_profiles(id),
    review_status VARCHAR(20) DEFAULT 'not_required' CHECK (review_status IN ('not_required', 'pending', 'approved', 'needs_revision')),
    review_notes TEXT,
    
    -- Assignment
    assigned_to UUID REFERENCES user_profiles(id),
    
    -- Timeline
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AUTOMATE Step Templates - Predefined step configurations for different scenarios
CREATE TABLE IF NOT EXISTS automate_step_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE, -- NULL for global templates
    
    -- Template Configuration
    template_name VARCHAR(255) NOT NULL,
    template_description TEXT,
    template_type VARCHAR(50) NOT NULL, -- 'startup', 'enterprise', 'agency', 'custom'
    industry_focus VARCHAR(100), -- Target industry
    company_size VARCHAR(50), -- 'startup', 'small', 'medium', 'large', 'enterprise'
    
    -- Step Configuration
    step_code VARCHAR(1) NOT NULL CHECK (step_code IN ('A', 'U', 'T', 'O', 'M', 'A', 'T', 'E')),
    step_index INTEGER NOT NULL,
    
    -- Template Content
    guided_actions JSONB NOT NULL, -- Predefined actions for this step
    default_completion_criteria JSONB DEFAULT '{}',
    estimated_timeline_days INTEGER,
    resource_requirements JSONB DEFAULT '{}',
    
    -- Template Settings
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    
    -- Template Metadata
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AUTOMATE Methodology Analytics - Track methodology effectiveness
CREATE TABLE IF NOT EXISTS automate_methodology_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    methodology_campaign_id UUID NOT NULL REFERENCES automate_methodology_campaigns(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Analytics Period
    analytics_date DATE NOT NULL,
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'milestone')),
    
    -- Progress Metrics
    overall_progress_percentage DECIMAL(5,2),
    steps_completed INTEGER,
    steps_in_progress INTEGER,
    steps_pending INTEGER,
    
    -- Step-Level Metrics
    step_completion_data JSONB DEFAULT '{}', -- Progress for each step
    pillar_integration_scores JSONB DEFAULT '{}', -- How well pillars are integrated
    
    -- Performance Metrics
    velocity_score DECIMAL(5,2), -- Rate of progress
    quality_score DECIMAL(5,2), -- Quality of completion
    adherence_score DECIMAL(5,2), -- How well methodology is being followed
    team_engagement_score DECIMAL(5,2), -- Team participation and engagement
    
    -- Business Impact
    business_metrics JSONB DEFAULT '{}', -- Business metrics affected by methodology
    roi_indicators JSONB DEFAULT '{}', -- ROI tracking related to methodology
    
    -- Insights and Recommendations
    ai_insights JSONB DEFAULT '[]', -- AI-generated insights
    recommended_focus_areas JSONB DEFAULT '[]', -- Areas needing attention
    next_best_actions JSONB DEFAULT '[]', -- Recommended next actions
    
    -- Comparative Analysis
    benchmark_comparison JSONB DEFAULT '{}', -- Comparison to industry benchmarks
    historical_comparison JSONB DEFAULT '{}', -- Comparison to previous periods
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AUTOMATE Methodology Insights - AI-powered insights and recommendations
CREATE TABLE IF NOT EXISTS automate_methodology_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    methodology_campaign_id UUID NOT NULL REFERENCES automate_methodology_campaigns(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Insight Details
    insight_type VARCHAR(50) NOT NULL, -- 'progress_alert', 'optimization_tip', 'best_practice', 'risk_warning'
    insight_category VARCHAR(50) NOT NULL, -- 'step_completion', 'pillar_integration', 'team_performance', 'business_impact'
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Insight Content
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    detailed_analysis TEXT,
    
    -- Context
    related_step_code VARCHAR(1), -- Which step this relates to
    related_pillars TEXT[], -- Which pillars are affected
    
    -- AI Analysis
    confidence_score DECIMAL(5,2), -- AI confidence in this insight
    data_sources JSONB DEFAULT '[]', -- What data contributed to this insight
    analysis_methodology VARCHAR(100), -- How this insight was generated
    
    -- Recommendations
    recommended_actions JSONB DEFAULT '[]', -- Specific recommended actions
    expected_impact JSONB DEFAULT '{}', -- Expected impact of following recommendations
    implementation_difficulty VARCHAR(20) DEFAULT 'medium', -- How hard to implement
    estimated_time_to_implement INTERVAL,
    
    -- Status and Follow-up
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'implementing', 'completed', 'dismissed')),
    acknowledged_by UUID REFERENCES user_profiles(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    
    -- Effectiveness Tracking
    was_helpful BOOLEAN,
    user_feedback TEXT,
    implementation_results JSONB DEFAULT '{}',
    
    -- Lifecycle
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive indexes for performance
CREATE INDEX IF NOT EXISTS idx_automate_methodology_campaigns_tenant_id ON automate_methodology_campaigns(tenant_id);
CREATE INDEX IF NOT EXISTS idx_automate_methodology_campaigns_status ON automate_methodology_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_automate_methodology_campaigns_campaign_id ON automate_methodology_campaigns(campaign_id);

CREATE INDEX IF NOT EXISTS idx_automate_step_progress_methodology_id ON automate_step_progress(methodology_campaign_id);
CREATE INDEX IF NOT EXISTS idx_automate_step_progress_tenant_id ON automate_step_progress(tenant_id);
CREATE INDEX IF NOT EXISTS idx_automate_step_progress_step_code ON automate_step_progress(step_code);
CREATE INDEX IF NOT EXISTS idx_automate_step_progress_status ON automate_step_progress(status);
CREATE INDEX IF NOT EXISTS idx_automate_step_progress_assigned_to ON automate_step_progress(assigned_to);

CREATE INDEX IF NOT EXISTS idx_automate_guided_actions_step_id ON automate_guided_actions(step_progress_id);
CREATE INDEX IF NOT EXISTS idx_automate_guided_actions_tenant_id ON automate_guided_actions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_automate_guided_actions_status ON automate_guided_actions(status);
CREATE INDEX IF NOT EXISTS idx_automate_guided_actions_type ON automate_guided_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_automate_guided_actions_assigned_to ON automate_guided_actions(assigned_to);

CREATE INDEX IF NOT EXISTS idx_automate_step_templates_tenant_id ON automate_step_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_automate_step_templates_step_code ON automate_step_templates(step_code);
CREATE INDEX IF NOT EXISTS idx_automate_step_templates_template_type ON automate_step_templates(template_type);

CREATE INDEX IF NOT EXISTS idx_automate_methodology_analytics_methodology_id ON automate_methodology_analytics(methodology_campaign_id);
CREATE INDEX IF NOT EXISTS idx_automate_methodology_analytics_date ON automate_methodology_analytics(analytics_date);
CREATE INDEX IF NOT EXISTS idx_automate_methodology_analytics_period ON automate_methodology_analytics(period_type);

CREATE INDEX IF NOT EXISTS idx_automate_methodology_insights_methodology_id ON automate_methodology_insights(methodology_campaign_id);
CREATE INDEX IF NOT EXISTS idx_automate_methodology_insights_type ON automate_methodology_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_automate_methodology_insights_status ON automate_methodology_insights(status);
CREATE INDEX IF NOT EXISTS idx_automate_methodology_insights_severity ON automate_methodology_insights(severity);

-- Enable Row Level Security (RLS)
ALTER TABLE automate_methodology_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE automate_step_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE automate_guided_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE automate_step_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE automate_methodology_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE automate_methodology_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for tenant isolation
CREATE POLICY automate_methodology_campaigns_tenant_isolation ON automate_methodology_campaigns
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY automate_step_progress_tenant_isolation ON automate_step_progress
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY automate_guided_actions_tenant_isolation ON automate_guided_actions
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY automate_step_templates_tenant_isolation ON automate_step_templates
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())) OR tenant_id IS NULL)
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())) OR tenant_id IS NULL);

CREATE POLICY automate_methodology_analytics_tenant_isolation ON automate_methodology_analytics
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY automate_methodology_insights_tenant_isolation ON automate_methodology_insights
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON automate_methodology_campaigns TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON automate_step_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON automate_guided_actions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON automate_step_templates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON automate_methodology_analytics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON automate_methodology_insights TO authenticated;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER trigger_automate_methodology_campaigns_updated_at
    BEFORE UPDATE ON automate_methodology_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_automate_step_progress_updated_at
    BEFORE UPDATE ON automate_step_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_automate_guided_actions_updated_at
    BEFORE UPDATE ON automate_guided_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_automate_step_templates_updated_at
    BEFORE UPDATE ON automate_step_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_automate_methodology_insights_updated_at
    BEFORE UPDATE ON automate_methodology_insights
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

-- Insert default AUTOMATE step templates
INSERT INTO automate_step_templates (template_name, template_description, template_type, step_code, step_index, guided_actions, estimated_timeline_days, is_default) 
VALUES 
-- Step A: Assess & Audit
('Default Assess & Audit', 'Comprehensive assessment and audit framework', 'default', 'A', 0, '[
    {
        "title": "Conduct Content Audit",
        "description": "Analyze existing content performance, gaps, and opportunities",
        "type": "assessment",
        "category": "content",
        "estimatedTime": 240,
        "difficulty": "medium",
        "instructions": "Review all existing content pieces, analyze performance metrics, identify content gaps and opportunities for improvement"
    },
    {
        "title": "PR Coverage Analysis", 
        "description": "Assess current PR coverage, media relationships, and brand mentions",
        "type": "assessment",
        "category": "pr",
        "estimatedTime": 180,
        "difficulty": "medium",
        "instructions": "Analyze media coverage, assess journalist relationships, evaluate brand sentiment and share of voice"
    },
    {
        "title": "SEO Technical Audit",
        "description": "Comprehensive technical SEO audit of website and content",
        "type": "assessment", 
        "category": "seo",
        "estimatedTime": 300,
        "difficulty": "hard",
        "instructions": "Perform technical SEO audit, keyword analysis, competitor analysis, and identify optimization opportunities"
    }
]'::jsonb, 7, true),

-- Step U: Understand Audience  
('Default Understand Audience', 'Comprehensive audience research and persona development', 'default', 'U', 1, '[
    {
        "title": "Create Audience Personas",
        "description": "Develop detailed buyer personas based on research and data",
        "type": "research",
        "category": "strategy",
        "estimatedTime": 180,
        "difficulty": "medium",
        "instructions": "Conduct audience research, analyze customer data, create detailed personas with demographics, psychographics, and behavior patterns"
    },
    {
        "title": "Map Customer Journey",
        "description": "Map the complete customer journey across all touchpoints",
        "type": "research",
        "category": "strategy", 
        "estimatedTime": 240,
        "difficulty": "medium",
        "instructions": "Identify all customer touchpoints, map journey stages, identify pain points and opportunities for each pillar"
    },
    {
        "title": "Audience Content Preferences",
        "description": "Research audience content consumption habits and preferences",
        "type": "research",
        "category": "content",
        "estimatedTime": 120,
        "difficulty": "easy",
        "instructions": "Survey audience, analyze content engagement data, identify preferred content types, formats, and distribution channels"
    }
]'::jsonb, 5, true),

-- Step T: Target & Strategy
('Default Target & Strategy', 'Strategic planning and goal setting framework', 'default', 'T', 2, '[
    {
        "title": "Set SMART Goals",
        "description": "Define specific, measurable, achievable, relevant, time-bound goals",
        "type": "strategy", 
        "category": "strategy",
        "estimatedTime": 120,
        "difficulty": "medium",
        "instructions": "Define clear SMART goals for each pillar, ensure alignment with business objectives, set measurable KPIs"
    },
    {
        "title": "Develop Content Strategy",
        "description": "Create comprehensive content marketing strategy",
        "type": "strategy",
        "category": "content",
        "estimatedTime": 300,
        "difficulty": "medium",
        "instructions": "Define content themes, formats, distribution strategy, editorial calendar, and content promotion tactics"
    },
    {
        "title": "PR Strategy Development",
        "description": "Create targeted PR and media outreach strategy",
        "type": "strategy",
        "category": "pr", 
        "estimatedTime": 240,
        "difficulty": "medium",
        "instructions": "Develop PR strategy, identify target media outlets, create story angles, plan campaign timeline"
    },
    {
        "title": "SEO Strategy Planning",
        "description": "Develop comprehensive SEO strategy and keyword targeting",
        "type": "strategy",
        "category": "seo",
        "estimatedTime": 180,
        "difficulty": "medium", 
        "instructions": "Create SEO strategy, prioritize keywords, plan content optimization, develop link building strategy"
    }
]'::jsonb, 8, true),

-- Add more default templates for remaining steps...
('Default Optimize Systems', 'System optimization and process improvement', 'default', 'O', 3, '[
    {
        "title": "Implement Marketing Automation",
        "description": "Set up automated marketing workflows and systems",
        "type": "optimization",
        "category": "technical",
        "estimatedTime": 360,
        "difficulty": "hard",
        "instructions": "Configure marketing automation platform, create automated workflows, set up lead scoring and nurturing sequences"
    }
]'::jsonb, 10, true),

('Default Measure & Monitor', 'Analytics and performance monitoring setup', 'default', 'M', 4, '[
    {
        "title": "Set Up Analytics Tracking",
        "description": "Implement comprehensive analytics and tracking systems",
        "type": "optimization",
        "category": "technical", 
        "estimatedTime": 240,
        "difficulty": "medium",
        "instructions": "Set up Google Analytics, configure conversion tracking, implement attribution modeling, create custom dashboards"
    }
]'::jsonb, 5, true),

('Default Accelerate Growth', 'Growth acceleration tactics and optimization', 'default', 'A', 5, '[
    {
        "title": "Launch Growth Experiments",
        "description": "Implement growth hacking experiments and optimizations",
        "type": "optimization",
        "category": "strategy",
        "estimatedTime": 480,
        "difficulty": "hard",
        "instructions": "Design and launch growth experiments, A/B test campaigns, optimize conversion funnels, scale successful tactics"
    }
]'::jsonb, 12, true),

('Default Transform & Evolve', 'Digital transformation and evolution strategy', 'default', 'T', 6, '[
    {
        "title": "Digital Transformation Planning",
        "description": "Plan comprehensive digital transformation initiatives",
        "type": "strategy",
        "category": "strategy",
        "estimatedTime": 360,
        "difficulty": "expert",
        "instructions": "Assess digital maturity, plan transformation roadmap, identify technology needs, create change management plan"
    }
]'::jsonb, 15, true),

('Default Execute Excellence', 'Excellence execution and continuous improvement', 'default', 'E', 7, '[
    {
        "title": "Establish Excellence Standards",
        "description": "Create standards and processes for operational excellence", 
        "type": "optimization",
        "category": "strategy",
        "estimatedTime": 240,
        "difficulty": "hard",
        "instructions": "Define quality standards, create process documentation, implement continuous improvement framework, establish team training programs"
    }
]'::jsonb, 8, true);

-- Comments for documentation
COMMENT ON TABLE automate_methodology_campaigns IS 'Master configuration for AUTOMATE methodology implementations';
COMMENT ON TABLE automate_step_progress IS 'Progress tracking for each step in the AUTOMATE methodology';
COMMENT ON TABLE automate_guided_actions IS 'Specific actionable items with step-by-step guidance for each methodology step';
COMMENT ON TABLE automate_step_templates IS 'Predefined templates for AUTOMATE steps based on different scenarios and industries';
COMMENT ON TABLE automate_methodology_analytics IS 'Analytics and metrics tracking for methodology effectiveness';
COMMENT ON TABLE automate_methodology_insights IS 'AI-powered insights and recommendations for methodology optimization';