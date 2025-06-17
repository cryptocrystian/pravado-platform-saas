-- Comprehensive SEO Intelligence Platform Schema
-- This migration creates all tables needed for a full-featured SEO platform

-- SEO Projects table for organizing SEO campaigns
CREATE TABLE IF NOT EXISTS seo_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Project details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    website_url VARCHAR(500) NOT NULL,
    target_location VARCHAR(100),
    target_language VARCHAR(10) DEFAULT 'en',
    
    -- Project settings
    tracking_frequency VARCHAR(20) DEFAULT 'daily' CHECK (tracking_frequency IN ('hourly', 'daily', 'weekly')),
    competitor_analysis_enabled BOOLEAN DEFAULT true,
    technical_audit_enabled BOOLEAN DEFAULT true,
    content_optimization_enabled BOOLEAN DEFAULT true,
    
    -- Project status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    last_audit_at TIMESTAMP WITH TIME ZONE,
    next_audit_at TIMESTAMP WITH TIME ZONE,
    
    -- Metrics
    total_keywords INTEGER DEFAULT 0,
    avg_position DECIMAL(5,2),
    organic_traffic_estimate INTEGER DEFAULT 0,
    visibility_score INTEGER DEFAULT 0 CHECK (visibility_score >= 0 AND visibility_score <= 100),
    
    -- Audit fields
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced SEO Keywords table (extend existing)
ALTER TABLE seo_keywords ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE;
ALTER TABLE seo_keywords ADD COLUMN IF NOT EXISTS keyword_difficulty INTEGER CHECK (keyword_difficulty >= 0 AND keyword_difficulty <= 100);
ALTER TABLE seo_keywords ADD COLUMN IF NOT EXISTS search_intent VARCHAR(50) CHECK (search_intent IN ('informational', 'navigational', 'transactional', 'commercial'));
ALTER TABLE seo_keywords ADD COLUMN IF NOT EXISTS seasonal_trends JSONB DEFAULT '{}';
ALTER TABLE seo_keywords ADD COLUMN IF NOT EXISTS related_keywords TEXT[];
ALTER TABLE seo_keywords ADD COLUMN IF NOT EXISTS last_position_check TIMESTAMP WITH TIME ZONE;
ALTER TABLE seo_keywords ADD COLUMN IF NOT EXISTS position_history JSONB DEFAULT '[]';

-- SERP Tracking table for detailed ranking monitoring
CREATE TABLE IF NOT EXISTS serp_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES seo_keywords(id) ON DELETE CASCADE,
    
    -- SERP data
    position INTEGER NOT NULL,
    previous_position INTEGER,
    url VARCHAR(500),
    title TEXT,
    description TEXT,
    
    -- SERP features
    featured_snippet BOOLEAN DEFAULT false,
    local_pack BOOLEAN DEFAULT false,
    knowledge_panel BOOLEAN DEFAULT false,
    image_pack BOOLEAN DEFAULT false,
    video_results BOOLEAN DEFAULT false,
    
    -- Tracking metadata
    search_engine VARCHAR(20) DEFAULT 'google',
    location VARCHAR(100),
    device VARCHAR(20) DEFAULT 'desktop' CHECK (device IN ('desktop', 'mobile', 'tablet')),
    
    -- Performance metrics
    estimated_traffic INTEGER DEFAULT 0,
    click_through_rate DECIMAL(5,2),
    
    tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitor Analysis table
CREATE TABLE IF NOT EXISTS seo_competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    
    -- Competitor details
    domain VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    
    -- Metrics
    estimated_traffic INTEGER DEFAULT 0,
    total_keywords INTEGER DEFAULT 0,
    avg_position DECIMAL(5,2),
    visibility_score INTEGER DEFAULT 0 CHECK (visibility_score >= 0 AND visibility_score <= 100),
    domain_authority INTEGER DEFAULT 0 CHECK (domain_authority >= 0 AND domain_authority <= 100),
    
    -- Gap analysis
    keyword_overlap_count INTEGER DEFAULT 0,
    content_gaps JSONB DEFAULT '[]',
    opportunity_score INTEGER DEFAULT 0 CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
    
    -- Tracking
    last_analyzed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitor Keywords table for gap analysis
CREATE TABLE IF NOT EXISTS competitor_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    competitor_id UUID REFERENCES seo_competitors(id) ON DELETE CASCADE,
    
    keyword VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    search_volume INTEGER,
    traffic_estimate INTEGER,
    url VARCHAR(500),
    
    -- Gap analysis
    our_position INTEGER, -- NULL if we don't rank
    opportunity_level VARCHAR(20) CHECK (opportunity_level IN ('high', 'medium', 'low')),
    
    tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Technical SEO Audits table
CREATE TABLE IF NOT EXISTS seo_technical_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    
    -- Audit metadata
    audit_type VARCHAR(50) DEFAULT 'full' CHECK (audit_type IN ('full', 'crawl', 'performance', 'structure')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    
    -- Core Web Vitals
    largest_contentful_paint DECIMAL(5,2), -- LCP in seconds
    first_input_delay DECIMAL(5,2), -- FID in milliseconds
    cumulative_layout_shift DECIMAL(5,3), -- CLS score
    
    -- Performance metrics
    page_speed_score INTEGER CHECK (page_speed_score >= 0 AND page_speed_score <= 100),
    mobile_usability_score INTEGER CHECK (mobile_usability_score >= 0 AND mobile_usability_score <= 100),
    
    -- Technical issues
    crawl_errors INTEGER DEFAULT 0,
    broken_links INTEGER DEFAULT 0,
    missing_meta_descriptions INTEGER DEFAULT 0,
    duplicate_content_issues INTEGER DEFAULT 0,
    missing_alt_tags INTEGER DEFAULT 0,
    
    -- SEO health
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    issues_critical INTEGER DEFAULT 0,
    issues_warning INTEGER DEFAULT 0,
    issues_notice INTEGER DEFAULT 0,
    
    -- Detailed results
    audit_results JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '[]',
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Optimization table
CREATE TABLE IF NOT EXISTS seo_content_optimization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    
    -- Content details
    url VARCHAR(500) NOT NULL,
    title VARCHAR(255),
    meta_description TEXT,
    content_text TEXT,
    
    -- Target keywords
    primary_keyword VARCHAR(255),
    secondary_keywords TEXT[],
    
    -- Optimization scores
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    keyword_optimization_score INTEGER CHECK (keyword_optimization_score >= 0 AND keyword_optimization_score <= 100),
    content_quality_score INTEGER CHECK (content_quality_score >= 0 AND content_quality_score <= 100),
    readability_score INTEGER CHECK (readability_score >= 0 AND readability_score <= 100),
    
    -- Analysis results
    word_count INTEGER,
    keyword_density DECIMAL(5,2),
    semantic_keywords TEXT[],
    content_gaps TEXT[],
    
    -- Recommendations
    optimization_suggestions JSONB DEFAULT '[]',
    ai_generated_improvements JSONB DEFAULT '{}',
    
    -- Status
    status VARCHAR(20) DEFAULT 'analyzed' CHECK (status IN ('pending', 'analyzed', 'optimized')),
    
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backlink Analysis table
CREATE TABLE IF NOT EXISTS seo_backlinks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    
    -- Source information
    source_domain VARCHAR(255) NOT NULL,
    source_url VARCHAR(500) NOT NULL,
    source_title TEXT,
    
    -- Target information
    target_url VARCHAR(500) NOT NULL,
    anchor_text VARCHAR(255),
    
    -- Link metrics
    domain_authority INTEGER CHECK (domain_authority >= 0 AND domain_authority <= 100),
    page_authority INTEGER CHECK (page_authority >= 0 AND page_authority <= 100),
    spam_score INTEGER CHECK (spam_score >= 0 AND spam_score <= 100),
    
    -- Link attributes
    link_type VARCHAR(20) CHECK (link_type IN ('dofollow', 'nofollow', 'sponsored', 'ugc')),
    link_status VARCHAR(20) DEFAULT 'active' CHECK (link_status IN ('active', 'lost', 'toxic', 'disavowed')),
    
    -- Discovery and tracking
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    discovered_by VARCHAR(50) -- 'crawler', 'api', 'manual', etc.
);

-- SERP Features Tracking
CREATE TABLE IF NOT EXISTS serp_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES seo_keywords(id) ON DELETE CASCADE,
    
    -- Feature details
    feature_type VARCHAR(50) NOT NULL, -- 'featured_snippet', 'local_pack', 'knowledge_panel', etc.
    position INTEGER,
    content TEXT,
    url VARCHAR(500),
    
    -- Opportunity analysis
    our_content_eligible BOOLEAN DEFAULT false,
    optimization_opportunity INTEGER CHECK (optimization_opportunity >= 0 AND optimization_opportunity <= 100),
    
    tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keyword Research Suggestions (AI-powered)
CREATE TABLE IF NOT EXISTS seo_keyword_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    
    -- Suggestion details
    keyword VARCHAR(255) NOT NULL,
    search_volume INTEGER,
    keyword_difficulty INTEGER CHECK (keyword_difficulty >= 0 AND keyword_difficulty <= 100),
    cpc DECIMAL(8,2),
    competition_level VARCHAR(20),
    
    -- AI analysis
    search_intent VARCHAR(50),
    content_gap_score INTEGER CHECK (content_gap_score >= 0 AND content_gap_score <= 100),
    opportunity_score INTEGER CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
    
    -- Suggestion metadata
    source VARCHAR(50), -- 'ai_analysis', 'competitor_gap', 'search_console', 'related_keywords'
    related_to_keyword VARCHAR(255),
    
    -- Status
    status VARCHAR(20) DEFAULT 'suggested' CHECK (status IN ('suggested', 'approved', 'rejected', 'tracking')),
    
    suggested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_seo_projects_tenant_id ON seo_projects(tenant_id);
CREATE INDEX IF NOT EXISTS idx_seo_projects_status ON seo_projects(status);

CREATE INDEX IF NOT EXISTS idx_seo_keywords_project_id ON seo_keywords(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_ranking_position ON seo_keywords(ranking_position);

CREATE INDEX IF NOT EXISTS idx_serp_tracking_keyword_id ON serp_tracking(keyword_id);
CREATE INDEX IF NOT EXISTS idx_serp_tracking_tracked_at ON serp_tracking(tracked_at);
CREATE INDEX IF NOT EXISTS idx_serp_tracking_position ON serp_tracking(position);

CREATE INDEX IF NOT EXISTS idx_seo_competitors_project_id ON seo_competitors(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_competitors_visibility_score ON seo_competitors(visibility_score);

CREATE INDEX IF NOT EXISTS idx_competitor_keywords_competitor_id ON competitor_keywords(competitor_id);
CREATE INDEX IF NOT EXISTS idx_competitor_keywords_opportunity_level ON competitor_keywords(opportunity_level);

CREATE INDEX IF NOT EXISTS idx_seo_technical_audits_project_id ON seo_technical_audits(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_technical_audits_status ON seo_technical_audits(status);

CREATE INDEX IF NOT EXISTS idx_seo_content_optimization_project_id ON seo_content_optimization(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_content_optimization_score ON seo_content_optimization(overall_score);

CREATE INDEX IF NOT EXISTS idx_seo_backlinks_project_id ON seo_backlinks(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_backlinks_link_status ON seo_backlinks(link_status);

CREATE INDEX IF NOT EXISTS idx_serp_features_keyword_id ON serp_features(keyword_id);
CREATE INDEX IF NOT EXISTS idx_serp_features_type ON serp_features(feature_type);

CREATE INDEX IF NOT EXISTS idx_seo_keyword_suggestions_project_id ON seo_keyword_suggestions(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_keyword_suggestions_status ON seo_keyword_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_seo_keyword_suggestions_opportunity_score ON seo_keyword_suggestions(opportunity_score);

-- Add Row Level Security (RLS)
ALTER TABLE seo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE serp_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_technical_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_content_optimization ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_backlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE serp_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keyword_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant isolation
CREATE POLICY seo_projects_tenant_isolation ON seo_projects
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY serp_tracking_tenant_isolation ON serp_tracking
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY seo_competitors_tenant_isolation ON seo_competitors
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY competitor_keywords_tenant_isolation ON competitor_keywords
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY seo_technical_audits_tenant_isolation ON seo_technical_audits
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY seo_content_optimization_tenant_isolation ON seo_content_optimization
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY seo_backlinks_tenant_isolation ON seo_backlinks
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY serp_features_tenant_isolation ON serp_features
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY seo_keyword_suggestions_tenant_isolation ON seo_keyword_suggestions
    FOR ALL
    USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON seo_projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON serp_tracking TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON seo_competitors TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON competitor_keywords TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON seo_technical_audits TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON seo_content_optimization TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON seo_backlinks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON serp_features TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON seo_keyword_suggestions TO authenticated;

-- Update functions for timestamp updates
CREATE OR REPLACE FUNCTION update_seo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER trigger_seo_projects_updated_at
    BEFORE UPDATE ON seo_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_seo_competitors_updated_at
    BEFORE UPDATE ON seo_competitors
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_seo_content_optimization_updated_at
    BEFORE UPDATE ON seo_content_optimization
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER trigger_seo_keyword_suggestions_updated_at
    BEFORE UPDATE ON seo_keyword_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_updated_at();

-- Comments for documentation
COMMENT ON TABLE seo_projects IS 'SEO project management and organization';
COMMENT ON TABLE serp_tracking IS 'Detailed SERP position tracking and monitoring';
COMMENT ON TABLE seo_competitors IS 'Competitor analysis and monitoring';
COMMENT ON TABLE competitor_keywords IS 'Competitor keyword analysis and gap identification';
COMMENT ON TABLE seo_technical_audits IS 'Technical SEO audit results and recommendations';
COMMENT ON TABLE seo_content_optimization IS 'Content optimization analysis and scoring';
COMMENT ON TABLE seo_backlinks IS 'Backlink profile analysis and monitoring';
COMMENT ON TABLE serp_features IS 'SERP features tracking and opportunity analysis';
COMMENT ON TABLE seo_keyword_suggestions IS 'AI-powered keyword research and suggestions';