-- Create content_pieces table for managing content across the platform
CREATE TABLE IF NOT EXISTS content_pieces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Content Details
    title VARCHAR(255) NOT NULL,
    content_body TEXT,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('article', 'social_post', 'video', 'infographic', 'podcast', 'email', 'blog_post')),
    
    -- Campaign Association
    campaign_id UUID REFERENCES unified_campaigns(id) ON DELETE SET NULL,
    
    -- Publishing Details
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    published_date TIMESTAMP WITH TIME ZONE,
    
    -- Distribution
    target_platforms TEXT[] DEFAULT '{}',
    published_urls JSONB DEFAULT '{}',
    
    -- Performance Metrics
    views INTEGER DEFAULT 0,
    engagements INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    performance_metrics JSONB DEFAULT '{}',
    
    -- AI Integration
    ai_optimized BOOLEAN DEFAULT false,
    ai_suggestions JSONB DEFAULT '{}',
    seo_score DECIMAL(4,2),
    readability_score DECIMAL(4,2),
    
    -- Version Control
    version INTEGER DEFAULT 1,
    revision_history JSONB DEFAULT '[]',
    
    -- Metadata
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation
CREATE POLICY tenant_isolation_content ON content_pieces
    FOR ALL USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
    WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

-- Create indexes for performance
CREATE INDEX idx_content_tenant ON content_pieces(tenant_id);
CREATE INDEX idx_content_campaign ON content_pieces(campaign_id);
CREATE INDEX idx_content_status ON content_pieces(status);
CREATE INDEX idx_content_type ON content_pieces(content_type);
CREATE INDEX idx_content_created_at ON content_pieces(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_pieces_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
CREATE TRIGGER trigger_content_pieces_updated_at
    BEFORE UPDATE ON content_pieces
    FOR EACH ROW
    EXECUTE FUNCTION update_content_pieces_updated_at();

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON content_pieces TO authenticated; 