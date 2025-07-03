-- Create journalist_outreach table for PR module
-- This table tracks all outreach attempts and responses with comprehensive analytics

CREATE TABLE IF NOT EXISTS journalist_outreach (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Relationship fields
    journalist_id UUID NOT NULL REFERENCES journalist_contacts(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES pr_campaigns(id) ON DELETE SET NULL,
    press_release_id UUID REFERENCES press_releases(id) ON DELETE SET NULL,
    
    -- Outreach content
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'html', 'multipart')),
    
    -- Outreach details
    outreach_type VARCHAR(50) NOT NULL 
        CHECK (outreach_type IN ('pitch', 'press_release', 'follow_up', 'exclusive', 'embargo', 'media_alert', 'background_brief', 'expert_source')),
    outreach_method VARCHAR(50) DEFAULT 'email' 
        CHECK (outreach_method IN ('email', 'phone', 'social_media', 'in_person', 'press_conference')),
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'draft' 
        CHECK (status IN ('draft', 'scheduled', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'spam', 'failed')),
    
    -- Timing information
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    first_click_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,
    
    -- Response tracking
    response_received BOOLEAN DEFAULT false,
    response_type VARCHAR(50) CHECK (response_type IN ('positive', 'negative', 'neutral', 'request_info', 'decline', 'out_of_office', 'unsubscribe')),
    response_message TEXT,
    response_sentiment VARCHAR(20) CHECK (response_sentiment IN ('positive', 'neutral', 'negative')),
    response_sentiment_score DECIMAL(4,2), -- -1.0 to 1.0
    
    -- Engagement metrics
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    link_clicks JSONB DEFAULT '{}', -- Track which links were clicked
    time_to_open_minutes INTEGER, -- Minutes between send and first open
    time_to_reply_hours INTEGER, -- Hours between send and reply
    
    -- Follow-up tracking
    follow_up_scheduled BOOLEAN DEFAULT false,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    follow_up_count INTEGER DEFAULT 0,
    is_follow_up BOOLEAN DEFAULT false,
    parent_outreach_id UUID REFERENCES journalist_outreach(id),
    
    -- Content analysis
    word_count INTEGER,
    reading_time_seconds INTEGER,
    personalization_score INTEGER CHECK (personalization_score >= 0 AND personalization_score <= 100),
    urgency_level VARCHAR(20) DEFAULT 'normal' CHECK (urgency_level IN ('low', 'normal', 'high', 'urgent')),
    
    -- Email technical details (for email outreach)
    from_email VARCHAR(255),
    from_name VARCHAR(200),
    reply_to_email VARCHAR(255),
    cc_emails TEXT[],
    bcc_emails TEXT[],
    
    -- Attachments and media
    attachments JSONB DEFAULT '[]', -- Array of attachment metadata
    has_images BOOLEAN DEFAULT false,
    has_videos BOOLEAN DEFAULT false,
    has_documents BOOLEAN DEFAULT false,
    
    -- Delivery and technical tracking
    email_provider VARCHAR(100), -- Gmail, Outlook, etc.
    user_agent TEXT,
    ip_address INET,
    device_type VARCHAR(50), -- Desktop, Mobile, Tablet
    email_client VARCHAR(100),
    
    -- Campaign attribution
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    tracking_domain VARCHAR(255),
    
    -- Results and outcomes
    coverage_resulted BOOLEAN DEFAULT false,
    coverage_url VARCHAR(500),
    coverage_date TIMESTAMP WITH TIME ZONE,
    coverage_headline VARCHAR(500),
    coverage_sentiment VARCHAR(20),
    coverage_reach_estimate BIGINT,
    media_value DECIMAL(10,2),
    
    -- Quality and compliance
    spam_score DECIMAL(4,2), -- 0.0 to 1.0, higher = more likely to be spam
    compliance_checked BOOLEAN DEFAULT false,
    gdpr_consent BOOLEAN DEFAULT false,
    can_spam_compliant BOOLEAN DEFAULT true,
    unsubscribe_link VARCHAR(500),
    
    -- Performance metrics
    success_score INTEGER CHECK (success_score >= 0 AND success_score <= 100),
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    
    -- Journalist feedback
    journalist_rating INTEGER CHECK (journalist_rating >= 1 AND journalist_rating <= 5),
    journalist_feedback TEXT,
    
    -- Internal tracking
    notes TEXT,
    internal_tags TEXT[],
    priority_level VARCHAR(20) DEFAULT 'medium' 
        CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
    
    -- A/B testing
    test_variant VARCHAR(50), -- For subject line or content testing
    test_group VARCHAR(50),
    
    -- Automation and AI
    automated_outreach BOOLEAN DEFAULT false,
    ai_generated_content BOOLEAN DEFAULT false,
    ai_model_used VARCHAR(100),
    personalization_ai_used BOOLEAN DEFAULT false,
    
    -- Cost tracking
    outreach_cost DECIMAL(8,2), -- Cost of this outreach (tools, time, etc.)
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id),
    last_updated_by UUID REFERENCES user_profiles(id)
);

-- Create indexes for performance
CREATE INDEX idx_journalist_outreach_tenant_id ON journalist_outreach(tenant_id);
CREATE INDEX idx_journalist_outreach_journalist_id ON journalist_outreach(journalist_id);
CREATE INDEX idx_journalist_outreach_campaign_id ON journalist_outreach(campaign_id);
CREATE INDEX idx_journalist_outreach_press_release_id ON journalist_outreach(press_release_id);
CREATE INDEX idx_journalist_outreach_status ON journalist_outreach(status);
CREATE INDEX idx_journalist_outreach_outreach_type ON journalist_outreach(outreach_type);
CREATE INDEX idx_journalist_outreach_sent_at ON journalist_outreach(sent_at DESC);
CREATE INDEX idx_journalist_outreach_replied_at ON journalist_outreach(replied_at DESC);
CREATE INDEX idx_journalist_outreach_coverage_resulted ON journalist_outreach(coverage_resulted) WHERE coverage_resulted = true;
CREATE INDEX idx_journalist_outreach_parent_id ON journalist_outreach(parent_outreach_id);

-- Create composite indexes for common queries
CREATE INDEX idx_journalist_outreach_tenant_status ON journalist_outreach(tenant_id, status);
CREATE INDEX idx_journalist_outreach_tenant_type ON journalist_outreach(tenant_id, outreach_type);
CREATE INDEX idx_journalist_outreach_journalist_status ON journalist_outreach(journalist_id, status);
CREATE INDEX idx_journalist_outreach_campaign_status ON journalist_outreach(campaign_id, status);
CREATE INDEX idx_journalist_outreach_tenant_sent ON journalist_outreach(tenant_id, sent_at DESC);

-- Create GIN indexes for array and JSONB fields
CREATE INDEX idx_journalist_outreach_attachments ON journalist_outreach USING GIN(attachments);
CREATE INDEX idx_journalist_outreach_link_clicks ON journalist_outreach USING GIN(link_clicks);
CREATE INDEX idx_journalist_outreach_internal_tags ON journalist_outreach USING GIN(internal_tags);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_journalist_outreach_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_journalist_outreach_updated_at
    BEFORE UPDATE ON journalist_outreach
    FOR EACH ROW
    EXECUTE FUNCTION update_journalist_outreach_updated_at();

-- Function to calculate success score based on outcome
CREATE OR REPLACE FUNCTION calculate_outreach_success_score(
    p_status VARCHAR,
    p_response_type VARCHAR,
    p_coverage_resulted BOOLEAN,
    p_open_count INTEGER,
    p_click_count INTEGER,
    p_time_to_reply_hours INTEGER
) RETURNS INTEGER AS $$
DECLARE
    base_score INTEGER := 0;
    engagement_bonus INTEGER := 0;
    response_bonus INTEGER := 0;
    coverage_bonus INTEGER := 0;
    speed_bonus INTEGER := 0;
BEGIN
    -- Base score from status
    base_score := CASE p_status
        WHEN 'bounced' THEN 0
        WHEN 'spam' THEN 0
        WHEN 'failed' THEN 0
        WHEN 'sent' THEN 10
        WHEN 'delivered' THEN 15
        WHEN 'opened' THEN 25
        WHEN 'clicked' THEN 35
        WHEN 'replied' THEN 50
        ELSE 5
    END;
    
    -- Engagement bonus (opens and clicks)
    engagement_bonus := LEAST((COALESCE(p_open_count, 0) * 2) + (COALESCE(p_click_count, 0) * 5), 20);
    
    -- Response type bonus
    response_bonus := CASE p_response_type
        WHEN 'positive' THEN 20
        WHEN 'request_info' THEN 15
        WHEN 'neutral' THEN 10
        WHEN 'negative' THEN 5
        WHEN 'decline' THEN 2
        WHEN 'unsubscribe' THEN -5
        ELSE 0
    END;
    
    -- Coverage bonus (biggest impact)
    IF p_coverage_resulted THEN
        coverage_bonus := 30;
    END IF;
    
    -- Speed bonus (faster replies get bonus)
    IF p_time_to_reply_hours IS NOT NULL THEN
        speed_bonus := CASE 
            WHEN p_time_to_reply_hours <= 2 THEN 10
            WHEN p_time_to_reply_hours <= 24 THEN 5
            WHEN p_time_to_reply_hours <= 72 THEN 2
            ELSE 0
        END;
    END IF;
    
    RETURN GREATEST(LEAST(base_score + engagement_bonus + response_bonus + coverage_bonus + speed_bonus, 100), 0);
END;
$$ LANGUAGE plpgsql;

-- Function to update journalist relationship score when outreach is successful
CREATE OR REPLACE FUNCTION update_journalist_relationship_on_outreach()
RETURNS TRIGGER AS $$
BEGIN
    -- Update journalist interaction count and last contacted
    UPDATE journalist_contacts 
    SET 
        interaction_count = interaction_count + 1,
        last_contacted_at = NEW.sent_at,
        total_pitches = total_pitches + 1,
        successful_pitches = CASE 
            WHEN NEW.coverage_resulted THEN successful_pitches + 1 
            ELSE successful_pitches 
        END,
        last_response_at = CASE 
            WHEN NEW.replied_at IS NOT NULL THEN NEW.replied_at 
            ELSE last_response_at 
        END
    WHERE id = NEW.journalist_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update journalist relationship data
CREATE TRIGGER trigger_update_journalist_relationship
    AFTER INSERT OR UPDATE ON journalist_outreach
    FOR EACH ROW
    WHEN (NEW.sent_at IS NOT NULL)
    EXECUTE FUNCTION update_journalist_relationship_on_outreach();

-- Add Row Level Security (RLS)
ALTER TABLE journalist_outreach ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access outreach from their tenant
CREATE POLICY journalist_outreach_tenant_isolation ON journalist_outreach
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

-- RLS Policy: Users can read outreach they created or are assigned to
CREATE POLICY journalist_outreach_creator_access ON journalist_outreach
    FOR SELECT
    USING (
        created_by = auth.uid() 
        OR tenant_id IN (
            SELECT get_user_tenant_ids(auth.uid())
        )
    );

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON journalist_outreach TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Add helpful comments
COMMENT ON TABLE journalist_outreach IS 'Comprehensive tracking of all journalist outreach attempts with engagement analytics';
COMMENT ON COLUMN journalist_outreach.success_score IS 'Calculated score 0-100 based on engagement, response, and coverage outcomes';
COMMENT ON COLUMN journalist_outreach.personalization_score IS 'Score 0-100 indicating how personalized the outreach was';
COMMENT ON COLUMN journalist_outreach.response_sentiment_score IS 'AI-analyzed sentiment score from -1.0 (negative) to 1.0 (positive)';
COMMENT ON COLUMN journalist_outreach.media_value IS 'Estimated monetary value of resulting coverage';
COMMENT ON COLUMN journalist_outreach.time_to_reply_hours IS 'Hours between outreach send and journalist reply';
COMMENT ON COLUMN journalist_outreach.link_clicks IS 'JSON object tracking which links in the outreach were clicked';