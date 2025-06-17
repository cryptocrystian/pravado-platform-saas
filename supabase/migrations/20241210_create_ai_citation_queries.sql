-- Create AI Citation Queries table for CiteMind monitoring
CREATE TABLE IF NOT EXISTS ai_citation_queries (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Query configuration
    query_text TEXT NOT NULL,
    target_keywords TEXT[] DEFAULT '{}',
    platforms TEXT[] DEFAULT '{"openai","anthropic","perplexity","gemini"}',
    
    -- Monitoring settings
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'error')),
    frequency VARCHAR(20) DEFAULT 'daily' CHECK (frequency IN ('realtime', 'hourly', 'daily', 'weekly')),
    
    -- Execution tracking
    last_executed_at TIMESTAMP WITH TIME ZONE,
    next_execution_at TIMESTAMP WITH TIME ZONE,
    execution_count INTEGER DEFAULT 0,
    
    -- Results summary
    total_citations_found INTEGER DEFAULT 0,
    avg_sentiment_score DECIMAL(3,2) DEFAULT 0.0,
    avg_confidence_score DECIMAL(3,2) DEFAULT 0.0,
    
    -- Metadata
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI Citation Results table to extend existing ai_platform_citations
CREATE TABLE IF NOT EXISTS ai_citation_results (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Query reference
    query_id UUID REFERENCES ai_citation_queries(id) ON DELETE CASCADE,
    
    -- Platform and model info
    platform VARCHAR(50) NOT NULL,
    model_used VARCHAR(100),
    
    -- Query and response
    query_text TEXT NOT NULL,
    response_text TEXT,
    citations_found TEXT[] DEFAULT '{}',
    
    -- Analysis results
    sentiment_score DECIMAL(3,2) DEFAULT 0.0 CHECK (sentiment_score >= -1.0 AND sentiment_score <= 1.0),
    confidence_score DECIMAL(3,2) DEFAULT 0.0 CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    context_relevance DECIMAL(3,2) DEFAULT 0.0 CHECK (context_relevance >= 0.0 AND context_relevance <= 1.0),
    
    -- Timing
    query_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    response_time_ms INTEGER,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Citation Analytics table for aggregated statistics
CREATE TABLE IF NOT EXISTS citation_analytics (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Analytics dimensions
    date_recorded DATE NOT NULL,
    platform VARCHAR(50) NOT NULL,
    
    -- Metrics
    total_queries INTEGER DEFAULT 0,
    citations_found INTEGER DEFAULT 0,
    positive_mentions INTEGER DEFAULT 0,
    neutral_mentions INTEGER DEFAULT 0,
    negative_mentions INTEGER DEFAULT 0,
    avg_sentiment_score DECIMAL(3,2) DEFAULT 0.0,
    avg_confidence_score DECIMAL(3,2) DEFAULT 0.0,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_ai_citation_queries_tenant_id ON ai_citation_queries(tenant_id);
CREATE INDEX idx_ai_citation_queries_status ON ai_citation_queries(status);
CREATE INDEX idx_ai_citation_queries_next_execution ON ai_citation_queries(next_execution_at) WHERE status = 'active';

CREATE INDEX idx_ai_citation_results_tenant_id ON ai_citation_results(tenant_id);
CREATE INDEX idx_ai_citation_results_query_id ON ai_citation_results(query_id);
CREATE INDEX idx_ai_citation_results_platform ON ai_citation_results(platform);
CREATE INDEX idx_ai_citation_results_timestamp ON ai_citation_results(query_timestamp);

CREATE INDEX idx_citation_analytics_tenant_platform ON citation_analytics(tenant_id, platform);
CREATE INDEX idx_citation_analytics_date ON citation_analytics(date_recorded);

-- Create unique constraint for analytics to prevent duplicates
CREATE UNIQUE INDEX idx_citation_analytics_unique 
    ON citation_analytics(tenant_id, platform, date_recorded);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_citation_queries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
CREATE TRIGGER trigger_ai_citation_queries_updated_at
    BEFORE UPDATE ON ai_citation_queries
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_citation_queries_updated_at();

-- Function to auto-update analytics
CREATE OR REPLACE FUNCTION update_citation_analytics()
RETURNS TRIGGER AS $$
DECLARE
    today DATE := CURRENT_DATE;
    existing_record citation_analytics%ROWTYPE;
BEGIN
    -- Get existing analytics record for today
    SELECT * INTO existing_record
    FROM citation_analytics
    WHERE tenant_id = NEW.tenant_id
      AND platform = NEW.platform
      AND date_recorded = today;
    
    IF FOUND THEN
        -- Update existing record
        UPDATE citation_analytics SET
            total_queries = total_queries + 1,
            citations_found = citations_found + array_length(NEW.citations_found, 1),
            positive_mentions = positive_mentions + CASE WHEN NEW.sentiment_score > 0.2 THEN 1 ELSE 0 END,
            neutral_mentions = neutral_mentions + CASE WHEN NEW.sentiment_score BETWEEN -0.2 AND 0.2 THEN 1 ELSE 0 END,
            negative_mentions = negative_mentions + CASE WHEN NEW.sentiment_score < -0.2 THEN 1 ELSE 0 END,
            avg_sentiment_score = (avg_sentiment_score * (total_queries - 1) + NEW.sentiment_score) / total_queries,
            avg_confidence_score = (avg_confidence_score * (total_queries - 1) + NEW.confidence_score) / total_queries,
            updated_at = NOW()
        WHERE id = existing_record.id;
    ELSE
        -- Create new record
        INSERT INTO citation_analytics (
            tenant_id,
            platform,
            date_recorded,
            total_queries,
            citations_found,
            positive_mentions,
            neutral_mentions,
            negative_mentions,
            avg_sentiment_score,
            avg_confidence_score
        ) VALUES (
            NEW.tenant_id,
            NEW.platform,
            today,
            1,
            array_length(NEW.citations_found, 1),
            CASE WHEN NEW.sentiment_score > 0.2 THEN 1 ELSE 0 END,
            CASE WHEN NEW.sentiment_score BETWEEN -0.2 AND 0.2 THEN 1 ELSE 0 END,
            CASE WHEN NEW.sentiment_score < -0.2 THEN 1 ELSE 0 END,
            NEW.sentiment_score,
            NEW.confidence_score
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update analytics when citation results are inserted
CREATE TRIGGER trigger_update_citation_analytics
    AFTER INSERT ON ai_citation_results
    FOR EACH ROW
    EXECUTE FUNCTION update_citation_analytics();

-- Add Row Level Security (RLS)
ALTER TABLE ai_citation_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_citation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE citation_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant isolation
CREATE POLICY ai_citation_queries_tenant_isolation ON ai_citation_queries
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

CREATE POLICY ai_citation_results_tenant_isolation ON ai_citation_results
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

CREATE POLICY citation_analytics_tenant_isolation ON citation_analytics
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

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ai_citation_queries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ai_citation_results TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON citation_analytics TO authenticated;

-- Add helpful comments
COMMENT ON TABLE ai_citation_queries IS 'Stores AI citation monitoring queries and configurations for CiteMind';
COMMENT ON TABLE ai_citation_results IS 'Stores individual citation monitoring results from AI platforms';
COMMENT ON TABLE citation_analytics IS 'Aggregated analytics for citation monitoring performance';