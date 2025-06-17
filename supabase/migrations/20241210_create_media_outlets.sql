-- Create media_outlets table for PR module
-- This table stores comprehensive media publication information with metrics and intelligence

CREATE TABLE IF NOT EXISTS media_outlets (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Basic publication information
    name VARCHAR(200) NOT NULL,
    website VARCHAR(255),
    outlet_type VARCHAR(50) NOT NULL 
        CHECK (outlet_type IN ('newspaper', 'magazine', 'blog', 'podcast', 'tv', 'radio', 'newsletter', 'trade_publication', 'wire_service', 'digital_native')),
    category VARCHAR(100), -- Technology, Business, Healthcare, General Interest, etc.
    subcategories TEXT[], -- More specific focus areas
    
    -- Publication metrics and authority
    domain_authority INTEGER CHECK (domain_authority >= 0 AND domain_authority <= 100),
    page_authority INTEGER CHECK (page_authority >= 0 AND page_authority <= 100),
    monthly_visitors BIGINT,
    alexa_rank INTEGER,
    
    -- Social media presence
    social_followers JSONB DEFAULT '{}', -- {twitter: 10000, facebook: 5000, linkedin: 2000}
    social_engagement_rate DECIMAL(5,2),
    
    -- Contact information
    editorial_email VARCHAR(255),
    press_email VARCHAR(255),
    news_tip_email VARCHAR(255),
    general_contact_email VARCHAR(255),
    phone VARCHAR(50),
    fax VARCHAR(50),
    
    -- Physical location
    headquarters_address TEXT,
    headquarters_city VARCHAR(100),
    headquarters_state VARCHAR(100),
    headquarters_country VARCHAR(100),
    coverage_areas TEXT[], -- Geographic areas they cover
    
    -- Editorial information
    submission_guidelines TEXT,
    editorial_calendar_url VARCHAR(255),
    media_kit_url VARCHAR(255),
    press_release_guidelines TEXT,
    preferred_file_formats TEXT[], -- PDF, DOCX, TXT, etc.
    
    -- Intelligence and metrics
    avg_response_time_hours INTEGER, -- Average time to respond to pitches
    acceptance_rate DECIMAL(5,2) CHECK (acceptance_rate >= 0 AND acceptance_rate <= 100),
    lead_time_days INTEGER, -- How far in advance they need stories
    publication_frequency VARCHAR(50), -- Daily, Weekly, Monthly, etc.
    
    -- Editorial preferences
    story_length_preferences JSONB DEFAULT '{}', -- {min_words: 500, max_words: 2000, preferred: 1000}
    content_preferences TEXT[], -- Press releases, exclusive interviews, data stories, etc.
    pitch_preferences JSONB DEFAULT '{}', -- Preferred pitch format, timing, style
    embargo_policy TEXT,
    
    -- Relationship and engagement data
    relationship_score INTEGER DEFAULT 0 CHECK (relationship_score >= 0 AND relationship_score <= 100),
    last_interaction_at TIMESTAMP WITH TIME ZONE,
    total_stories_published INTEGER DEFAULT 0,
    successful_pitches INTEGER DEFAULT 0,
    total_pitches INTEGER DEFAULT 0,
    
    -- Quality and reputation metrics
    credibility_score INTEGER DEFAULT 50 CHECK (credibility_score >= 0 AND credibility_score <= 100),
    influence_score INTEGER DEFAULT 50 CHECK (influence_score >= 0 AND influence_score <= 100),
    fact_check_rating VARCHAR(50), -- From fact-checking organizations
    bias_rating VARCHAR(50), -- Political bias rating if applicable
    
    -- Technical information
    cms_platform VARCHAR(100), -- WordPress, Custom, etc.
    accepts_multimedia BOOLEAN DEFAULT false,
    video_capabilities BOOLEAN DEFAULT false,
    podcast_capabilities BOOLEAN DEFAULT false,
    live_streaming BOOLEAN DEFAULT false,
    
    -- Business information
    ownership_type VARCHAR(50), -- Independent, Corporate, Public, Non-profit
    parent_company VARCHAR(200),
    revenue_model TEXT[], -- Subscription, Advertising, Sponsored content, etc.
    target_audience_demographics JSONB DEFAULT '{}',
    
    -- Content analysis
    average_article_length INTEGER,
    posting_frequency_per_day DECIMAL(4,2),
    peak_posting_hours TEXT[], -- Best times to reach them
    popular_content_types TEXT[], -- News, Opinion, Analysis, Features, etc.
    trending_topics TEXT[], -- Currently popular topics
    
    -- SEO and digital presence
    backlink_count BIGINT,
    referring_domains INTEGER,
    organic_traffic_estimate BIGINT,
    top_keywords TEXT[], -- Keywords they rank for
    
    -- Contact preferences and restrictions
    communication_preferences JSONB DEFAULT '{}',
    blacklisted_companies TEXT[], -- Companies they won't cover
    preferred_sources TEXT[], -- Types of sources they prefer
    embargo_preferences JSONB DEFAULT '{}',
    
    -- Status and management
    is_active BOOLEAN DEFAULT true,
    is_premium_outlet BOOLEAN DEFAULT false, -- High-value outlet
    priority_level VARCHAR(20) DEFAULT 'medium' 
        CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Verification and data quality
    verification_status VARCHAR(20) DEFAULT 'unverified' 
        CHECK (verification_status IN ('unverified', 'pending', 'verified', 'outdated')),
    last_verified_at TIMESTAMP WITH TIME ZONE,
    data_source VARCHAR(100),
    data_quality_score INTEGER DEFAULT 50 CHECK (data_quality_score >= 0 AND data_quality_score <= 100),
    
    -- Additional metadata
    notes TEXT,
    tags TEXT[], -- Custom categorization tags
    internal_rating INTEGER CHECK (internal_rating >= 1 AND internal_rating <= 5),
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id),
    last_updated_by UUID REFERENCES user_profiles(id)
);

-- Create indexes for performance
CREATE INDEX idx_media_outlets_tenant_id ON media_outlets(tenant_id);
CREATE INDEX idx_media_outlets_name ON media_outlets(name);
CREATE INDEX idx_media_outlets_website ON media_outlets(website);
CREATE INDEX idx_media_outlets_type ON media_outlets(outlet_type);
CREATE INDEX idx_media_outlets_category ON media_outlets(category);
CREATE INDEX idx_media_outlets_domain_authority ON media_outlets(domain_authority DESC);
CREATE INDEX idx_media_outlets_monthly_visitors ON media_outlets(monthly_visitors DESC);
CREATE INDEX idx_media_outlets_relationship_score ON media_outlets(relationship_score DESC);
CREATE INDEX idx_media_outlets_credibility_score ON media_outlets(credibility_score DESC);
CREATE INDEX idx_media_outlets_active ON media_outlets(is_active) WHERE is_active = true;
CREATE INDEX idx_media_outlets_premium ON media_outlets(is_premium_outlet) WHERE is_premium_outlet = true;

-- Create composite indexes for common queries
CREATE INDEX idx_media_outlets_tenant_type ON media_outlets(tenant_id, outlet_type);
CREATE INDEX idx_media_outlets_tenant_category ON media_outlets(tenant_id, category);
CREATE INDEX idx_media_outlets_tenant_active ON media_outlets(tenant_id, is_active);

-- Create GIN indexes for array and JSONB fields
CREATE INDEX idx_media_outlets_subcategories ON media_outlets USING GIN(subcategories);
CREATE INDEX idx_media_outlets_coverage_areas ON media_outlets USING GIN(coverage_areas);
CREATE INDEX idx_media_outlets_tags ON media_outlets USING GIN(tags);
CREATE INDEX idx_media_outlets_social_followers ON media_outlets USING GIN(social_followers);
CREATE INDEX idx_media_outlets_pitch_preferences ON media_outlets USING GIN(pitch_preferences);

-- Create unique constraint to prevent duplicate outlets within a tenant
CREATE UNIQUE INDEX idx_media_outlets_tenant_name_unique 
    ON media_outlets(tenant_id, LOWER(name)) WHERE is_active = true;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_media_outlets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_media_outlets_updated_at
    BEFORE UPDATE ON media_outlets
    FOR EACH ROW
    EXECUTE FUNCTION update_media_outlets_updated_at();

-- Function to calculate outlet influence score
CREATE OR REPLACE FUNCTION calculate_outlet_influence_score(
    p_domain_authority INTEGER,
    p_monthly_visitors BIGINT,
    p_social_followers JSONB,
    p_backlink_count BIGINT,
    p_credibility_score INTEGER
) RETURNS INTEGER AS $$
DECLARE
    authority_score INTEGER := 0;
    traffic_score INTEGER := 0;
    social_score INTEGER := 0;
    backlink_score INTEGER := 0;
    credibility_bonus INTEGER := 0;
    total_score INTEGER := 0;
BEGIN
    -- Domain authority contribution (0-25 points)
    authority_score := COALESCE(p_domain_authority, 0) * 25 / 100;
    
    -- Monthly visitors contribution (0-25 points)
    IF p_monthly_visitors IS NOT NULL THEN
        traffic_score := CASE 
            WHEN p_monthly_visitors >= 10000000 THEN 25
            WHEN p_monthly_visitors >= 1000000 THEN 20
            WHEN p_monthly_visitors >= 100000 THEN 15
            WHEN p_monthly_visitors >= 10000 THEN 10
            WHEN p_monthly_visitors >= 1000 THEN 5
            ELSE 0
        END;
    END IF;
    
    -- Social media following contribution (0-25 points)
    IF p_social_followers IS NOT NULL THEN
        social_score := LEAST(
            (COALESCE((p_social_followers->>'twitter')::INTEGER, 0) + 
             COALESCE((p_social_followers->>'facebook')::INTEGER, 0) + 
             COALESCE((p_social_followers->>'linkedin')::INTEGER, 0)) / 40000 * 25, 
            25
        );
    END IF;
    
    -- Backlink count contribution (0-15 points)
    IF p_backlink_count IS NOT NULL THEN
        backlink_score := CASE 
            WHEN p_backlink_count >= 1000000 THEN 15
            WHEN p_backlink_count >= 100000 THEN 12
            WHEN p_backlink_count >= 10000 THEN 9
            WHEN p_backlink_count >= 1000 THEN 6
            WHEN p_backlink_count >= 100 THEN 3
            ELSE 0
        END;
    END IF;
    
    -- Credibility bonus (0-10 points)
    credibility_bonus := COALESCE(p_credibility_score, 50) * 10 / 100;
    
    total_score := authority_score + traffic_score + social_score + backlink_score + credibility_bonus;
    
    RETURN LEAST(total_score, 100);
END;
$$ LANGUAGE plpgsql;

-- Add Row Level Security (RLS)
ALTER TABLE media_outlets ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access outlets from their tenant
CREATE POLICY media_outlets_tenant_isolation ON media_outlets
    FOR ALL
    USING (
        tenant_id IN (
            SELECT get_user_tenant_ids(auth.uid())
        )
    )
    WITH CHECK (
        tenant_id IN (
            SELECT get_user_tenant_ids(auth.uid())
        )
    );

-- RLS Policy: Allow read access to active outlets
CREATE POLICY media_outlets_read_active ON media_outlets
    FOR SELECT
    USING (
        is_active = true 
        AND tenant_id IN (
            SELECT get_user_tenant_ids(auth.uid())
        )
    );

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON media_outlets TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Add helpful comments
COMMENT ON TABLE media_outlets IS 'Comprehensive media outlet database with metrics and relationship intelligence';
COMMENT ON COLUMN media_outlets.domain_authority IS 'SEO metric (0-100) indicating the outlets search engine ranking power';
COMMENT ON COLUMN media_outlets.acceptance_rate IS 'Percentage of pitches that result in coverage';
COMMENT ON COLUMN media_outlets.lead_time_days IS 'How many days in advance they need story pitches';
COMMENT ON COLUMN media_outlets.relationship_score IS 'Score 0-100 based on interaction history and coverage success';
COMMENT ON COLUMN media_outlets.influence_score IS 'Calculated score based on reach, authority, and credibility';
COMMENT ON COLUMN media_outlets.social_followers IS 'JSON object with follower counts per platform';
COMMENT ON COLUMN media_outlets.pitch_preferences IS 'JSON object storing preferred communication style and format';