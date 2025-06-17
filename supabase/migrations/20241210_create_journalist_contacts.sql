-- Create journalist_contacts table for PR module
-- This table stores comprehensive journalist contact information with intelligence data

CREATE TABLE IF NOT EXISTS journalist_contacts (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Basic contact information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    title VARCHAR(200),
    
    -- Professional information
    outlet_id UUID REFERENCES media_outlets(id) ON DELETE SET NULL,
    outlet_name VARCHAR(200), -- Denormalized for queries when outlet_id is null
    beat VARCHAR(100), -- Technology, Business, Healthcare, etc.
    secondary_beats TEXT[], -- Array of additional coverage areas
    expertise_score INTEGER DEFAULT 0 CHECK (expertise_score >= 0 AND expertise_score <= 100),
    
    -- Contact intelligence
    preferred_contact_time VARCHAR(50), -- 'morning', 'afternoon', 'evening'
    timezone VARCHAR(50), -- 'America/New_York', 'Europe/London', etc.
    relationship_score INTEGER DEFAULT 0 CHECK (relationship_score >= 0 AND relationship_score <= 100),
    response_rate DECIMAL(5,2) DEFAULT 0.0 CHECK (response_rate >= 0 AND response_rate <= 100),
    avg_response_time_hours INTEGER DEFAULT NULL, -- Average hours to respond
    
    -- Contact verification and confidence
    verification_status VARCHAR(20) DEFAULT 'unverified' 
        CHECK (verification_status IN ('unverified', 'pending', 'verified', 'bounced', 'invalid')),
    verification_method VARCHAR(50), -- 'email_verify', 'social_media', 'direct_contact', etc.
    last_verified_at TIMESTAMP WITH TIME ZONE,
    confidence_score INTEGER DEFAULT 50 CHECK (confidence_score >= 0 AND confidence_score <= 100),
    data_source VARCHAR(100), -- Where this contact was sourced from
    
    -- Relationship and interaction tracking
    interaction_count INTEGER DEFAULT 0,
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    last_response_at TIMESTAMP WITH TIME ZONE,
    successful_pitches INTEGER DEFAULT 0,
    total_pitches INTEGER DEFAULT 0,
    
    -- Communication preferences
    pitch_preferences JSONB DEFAULT '{}', -- Preferred pitch format, length, style
    embargo_preferences JSONB DEFAULT '{}', -- Embargo handling preferences
    communication_restrictions TEXT[], -- 'no_cold_outreach', 'media_list_only', etc.
    preferred_topics TEXT[], -- Specific topics they're interested in
    blacklisted_topics TEXT[], -- Topics to avoid
    
    -- Social media and online presence
    twitter_handle VARCHAR(100),
    linkedin_url VARCHAR(255),
    personal_website VARCHAR(255),
    bio TEXT,
    
    -- Additional metadata
    notes TEXT, -- Internal notes about the journalist
    tags TEXT[], -- Custom tags for categorization
    priority_level VARCHAR(20) DEFAULT 'medium' 
        CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Status and management
    is_active BOOLEAN DEFAULT true,
    is_blacklisted BOOLEAN DEFAULT false,
    blacklist_reason TEXT,
    
    -- Location information
    location VARCHAR(200), -- City, State/Country
    geographic_coverage TEXT[], -- Areas they cover geographically
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id),
    last_updated_by UUID REFERENCES user_profiles(id)
);

-- Create indexes for performance
CREATE INDEX idx_journalist_contacts_tenant_id ON journalist_contacts(tenant_id);
CREATE INDEX idx_journalist_contacts_email ON journalist_contacts(email);
CREATE INDEX idx_journalist_contacts_outlet_id ON journalist_contacts(outlet_id);
CREATE INDEX idx_journalist_contacts_beat ON journalist_contacts(beat);
CREATE INDEX idx_journalist_contacts_verification_status ON journalist_contacts(verification_status);
CREATE INDEX idx_journalist_contacts_relationship_score ON journalist_contacts(relationship_score DESC);
CREATE INDEX idx_journalist_contacts_last_contacted ON journalist_contacts(last_contacted_at DESC);
CREATE INDEX idx_journalist_contacts_active ON journalist_contacts(is_active) WHERE is_active = true;
CREATE INDEX idx_journalist_contacts_location ON journalist_contacts(location);

-- Create composite indexes for common queries
CREATE INDEX idx_journalist_contacts_tenant_beat ON journalist_contacts(tenant_id, beat);
CREATE INDEX idx_journalist_contacts_tenant_active ON journalist_contacts(tenant_id, is_active);
CREATE INDEX idx_journalist_contacts_tenant_score ON journalist_contacts(tenant_id, relationship_score DESC);

-- Create GIN indexes for array and JSONB fields
CREATE INDEX idx_journalist_contacts_secondary_beats ON journalist_contacts USING GIN(secondary_beats);
CREATE INDEX idx_journalist_contacts_preferred_topics ON journalist_contacts USING GIN(preferred_topics);
CREATE INDEX idx_journalist_contacts_tags ON journalist_contacts USING GIN(tags);
CREATE INDEX idx_journalist_contacts_pitch_preferences ON journalist_contacts USING GIN(pitch_preferences);

-- Create unique constraint to prevent duplicate emails within a tenant
CREATE UNIQUE INDEX idx_journalist_contacts_tenant_email_unique 
    ON journalist_contacts(tenant_id, email) WHERE is_active = true;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_journalist_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_journalist_contacts_updated_at
    BEFORE UPDATE ON journalist_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_journalist_contacts_updated_at();

-- Function to calculate relationship score based on interactions
CREATE OR REPLACE FUNCTION calculate_relationship_score(
    p_interaction_count INTEGER,
    p_successful_pitches INTEGER,
    p_total_pitches INTEGER,
    p_response_rate DECIMAL,
    p_last_contacted_at TIMESTAMP WITH TIME ZONE
) RETURNS INTEGER AS $$
DECLARE
    base_score INTEGER := 0;
    interaction_bonus INTEGER := 0;
    success_bonus INTEGER := 0;
    response_bonus INTEGER := 0;
    recency_bonus INTEGER := 0;
    days_since_contact INTEGER;
BEGIN
    -- Base score from interaction count (0-30 points)
    interaction_bonus := LEAST(p_interaction_count * 2, 30);
    
    -- Success rate bonus (0-25 points)
    IF p_total_pitches > 0 THEN
        success_bonus := ROUND((p_successful_pitches::DECIMAL / p_total_pitches) * 25);
    END IF;
    
    -- Response rate bonus (0-25 points)
    response_bonus := ROUND(p_response_rate * 0.25);
    
    -- Recency bonus (0-20 points, decays over time)
    IF p_last_contacted_at IS NOT NULL THEN
        days_since_contact := EXTRACT(DAYS FROM NOW() - p_last_contacted_at);
        IF days_since_contact <= 30 THEN
            recency_bonus := 20 - (days_since_contact * 20 / 30);
        END IF;
    END IF;
    
    base_score := interaction_bonus + success_bonus + response_bonus + recency_bonus;
    
    RETURN LEAST(base_score, 100);
END;
$$ LANGUAGE plpgsql;

-- Add Row Level Security (RLS)
ALTER TABLE journalist_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access journalists from their tenant
CREATE POLICY journalist_contacts_tenant_isolation ON journalist_contacts
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

-- RLS Policy: Allow read access to active journalists
CREATE POLICY journalist_contacts_read_active ON journalist_contacts
    FOR SELECT
    USING (
        is_active = true 
        AND NOT is_blacklisted
        AND tenant_id IN (
            SELECT get_user_tenant_ids(auth.uid())
        )
    );

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON journalist_contacts TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Add helpful comments
COMMENT ON TABLE journalist_contacts IS 'Comprehensive journalist contact database with relationship intelligence';
COMMENT ON COLUMN journalist_contacts.expertise_score IS 'Score 0-100 based on journalist expertise and influence in their beat';
COMMENT ON COLUMN journalist_contacts.relationship_score IS 'Score 0-100 based on interaction history and response patterns';
COMMENT ON COLUMN journalist_contacts.confidence_score IS 'Score 0-100 indicating confidence in contact information accuracy';
COMMENT ON COLUMN journalist_contacts.pitch_preferences IS 'JSON object storing preferred communication style, format, timing';
COMMENT ON COLUMN journalist_contacts.embargo_preferences IS 'JSON object storing embargo handling preferences and policies';
COMMENT ON COLUMN journalist_contacts.verification_status IS 'Current status of contact information verification';