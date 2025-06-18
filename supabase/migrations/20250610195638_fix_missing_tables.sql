-- Fix missing tables for AUTOMATE methodology and AI citations
-- This migration adds tables that were referenced but missing

-- Create automate_guided_actions if it doesn't exist
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
    why_important TEXT,
    how_to_complete TEXT,
    expected_outcome TEXT,
    best_practices JSONB DEFAULT '[]',
    common_mistakes JSONB DEFAULT '[]',
    
    -- Progress Tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'blocked')),
    completion_notes TEXT,
    completion_evidence JSONB DEFAULT '{}',
    
    -- Timeline
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automate_methodology_insights if it doesn't exist
CREATE TABLE IF NOT EXISTS automate_methodology_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    methodology_campaign_id UUID NOT NULL REFERENCES automate_methodology_campaigns(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Insight Details
    insight_type VARCHAR(50) NOT NULL,
    insight_category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Insight Content
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    recommendations JSONB DEFAULT '[]',
    action_items JSONB DEFAULT '[]',
    
    -- Status
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'in_progress', 'resolved', 'dismissed')),
    resolution_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_citation_queries if it doesn't exist
CREATE TABLE IF NOT EXISTS ai_citation_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Query configuration
    query_text TEXT NOT NULL,
    target_keywords TEXT[] DEFAULT '{}',
    platforms TEXT[] DEFAULT '{"openai","anthropic","perplexity","gemini"}',
    
    -- Monitoring settings
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'error')),
    frequency VARCHAR(20) DEFAULT 'daily' CHECK (frequency IN ('realtime', 'hourly', 'daily', 'weekly')),
    
    -- Results summary
    total_citations_found INTEGER DEFAULT 0,
    avg_sentiment_score DECIMAL(3,2) DEFAULT 0.0,
    avg_confidence_score DECIMAL(3,2) DEFAULT 0.0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE automate_guided_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE automate_methodology_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_citation_queries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation
CREATE POLICY tenant_isolation_guided_actions ON automate_guided_actions
    FOR ALL USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY tenant_isolation_methodology_insights ON automate_methodology_insights
    FOR ALL USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY tenant_isolation_citation_queries ON ai_citation_queries
    FOR ALL USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

-- Create indexes for performance
CREATE INDEX idx_guided_actions_tenant ON automate_guided_actions(tenant_id);
CREATE INDEX idx_guided_actions_step ON automate_guided_actions(step_progress_id);
CREATE INDEX idx_guided_actions_status ON automate_guided_actions(status);

CREATE INDEX idx_methodology_insights_tenant ON automate_methodology_insights(tenant_id);
CREATE INDEX idx_methodology_insights_campaign ON automate_methodology_insights(methodology_campaign_id);
CREATE INDEX idx_methodology_insights_status ON automate_methodology_insights(status);

CREATE INDEX idx_citation_queries_tenant ON ai_citation_queries(tenant_id);
CREATE INDEX idx_citation_queries_status ON ai_citation_queries(status);

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON automate_guided_actions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON automate_methodology_insights TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ai_citation_queries TO authenticated; 