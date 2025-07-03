-- Create HARO system tables
-- This migration creates the tables for HARO (Help a Reporter Out) functionality

-- HARO Requests table - stores journalist requests for expert sources
CREATE TABLE public.haro_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    deadline TIMESTAMPTZ,
    journalist_name TEXT,
    journalist_email TEXT,
    outlet TEXT,
    category TEXT,
    keywords TEXT[] DEFAULT '{}',
    industry_tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    difficulty_score INTEGER DEFAULT 50 CHECK (difficulty_score >= 0 AND difficulty_score <= 100),
    opportunity_score INTEGER DEFAULT 50 CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
    expires_at TIMESTAMPTZ,
    source_url TEXT,
    external_id TEXT, -- For tracking requests from external HARO feeds
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Expertise Profiles table - stores user expertise for HARO matching
CREATE TABLE public.user_expertise_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID, -- Reference to auth.users if needed
    full_name TEXT NOT NULL,
    title TEXT,
    company TEXT,
    expertise_areas TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    bio TEXT,
    credentials TEXT,
    industries TEXT[] DEFAULT '{}',
    contact_email TEXT,
    notification_preferences JSONB DEFAULT '{"email": true, "in_app": true, "sms": false}',
    matching_threshold INTEGER DEFAULT 70 CHECK (matching_threshold >= 0 AND matching_threshold <= 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- HARO Matches table - stores matches between user profiles and HARO requests
CREATE TABLE public.haro_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    haro_request_id UUID REFERENCES public.haro_requests(id) ON DELETE CASCADE,
    user_expertise_profile_id UUID REFERENCES public.user_expertise_profiles(id) ON DELETE CASCADE,
    user_id UUID, -- Direct user reference
    match_confidence INTEGER DEFAULT 0 CHECK (match_confidence >= 0 AND match_confidence <= 100),
    match_reasons TEXT[] DEFAULT '{}',
    ai_generated_response TEXT,
    user_edited_response TEXT,
    final_response TEXT,
    response_status TEXT DEFAULT 'draft' CHECK (response_status IN ('draft', 'pending', 'submitted', 'approved', 'rejected')),
    submitted BOOLEAN DEFAULT false,
    submitted_at TIMESTAMPTZ,
    journalist_replied BOOLEAN DEFAULT false,
    journalist_reply_at TIMESTAMPTZ,
    coverage_secured BOOLEAN DEFAULT false,
    coverage_url TEXT,
    coverage_value NUMERIC DEFAULT 0,
    coverage_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- HARO Analytics table - stores analytics and performance metrics
CREATE TABLE public.haro_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID,
    date_period DATE NOT NULL,
    requests_matched INTEGER DEFAULT 0,
    responses_submitted INTEGER DEFAULT 0,
    journalist_replies INTEGER DEFAULT 0,
    coverage_secured INTEGER DEFAULT 0,
    total_coverage_value NUMERIC DEFAULT 0,
    average_match_confidence NUMERIC DEFAULT 0,
    success_rate NUMERIC DEFAULT 0,
    roi_score NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_haro_requests_tenant_id ON public.haro_requests(tenant_id);
CREATE INDEX idx_haro_requests_is_active ON public.haro_requests(is_active);
CREATE INDEX idx_haro_requests_deadline ON public.haro_requests(deadline);
CREATE INDEX idx_haro_requests_category ON public.haro_requests(category);
CREATE INDEX idx_haro_requests_keywords ON public.haro_requests USING GIN(keywords);
CREATE INDEX idx_haro_requests_industry_tags ON public.haro_requests USING GIN(industry_tags);

CREATE INDEX idx_user_expertise_profiles_tenant_id ON public.user_expertise_profiles(tenant_id);
CREATE INDEX idx_user_expertise_profiles_is_active ON public.user_expertise_profiles(is_active);
CREATE INDEX idx_user_expertise_profiles_keywords ON public.user_expertise_profiles USING GIN(keywords);
CREATE INDEX idx_user_expertise_profiles_industries ON public.user_expertise_profiles USING GIN(industries);

CREATE INDEX idx_haro_matches_tenant_id ON public.haro_matches(tenant_id);
CREATE INDEX idx_haro_matches_haro_request_id ON public.haro_matches(haro_request_id);
CREATE INDEX idx_haro_matches_user_expertise_profile_id ON public.haro_matches(user_expertise_profile_id);
CREATE INDEX idx_haro_matches_response_status ON public.haro_matches(response_status);
CREATE INDEX idx_haro_matches_coverage_secured ON public.haro_matches(coverage_secured);

CREATE INDEX idx_haro_analytics_tenant_id ON public.haro_analytics(tenant_id);
CREATE INDEX idx_haro_analytics_date_period ON public.haro_analytics(date_period);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_haro_requests_updated_at BEFORE UPDATE ON public.haro_requests FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_user_expertise_profiles_updated_at BEFORE UPDATE ON public.user_expertise_profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_haro_matches_updated_at BEFORE UPDATE ON public.haro_matches FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_haro_analytics_updated_at BEFORE UPDATE ON public.haro_analytics FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Insert sample HARO requests for testing
INSERT INTO public.haro_requests (
    tenant_id,
    subject,
    description,
    requirements,
    deadline,
    journalist_name,
    journalist_email,
    outlet,
    category,
    keywords,
    industry_tags,
    difficulty_score,
    opportunity_score
) VALUES 
(
    (SELECT id FROM public.tenants LIMIT 1),
    'Seeking Marketing Technology Experts',
    'Looking for marketing professionals who have implemented AI-powered marketing automation systems. Need specific examples of ROI improvements and implementation challenges.',
    'Must have 3+ years experience with marketing automation, specific metrics required',
    now() + interval '2 days',
    'Sarah Johnson',
    'sarah@marketingtech.com',
    'Marketing Technology Weekly',
    'Marketing',
    ARRAY['marketing automation', 'AI', 'ROI', 'technology'],
    ARRAY['Marketing', 'Technology'],
    65,
    85
),
(
    (SELECT id FROM public.tenants LIMIT 1),
    'Small Business Growth Stories',
    'Seeking small business owners who have scaled from $1M to $10M+ revenue. Looking for specific growth strategies and lessons learned.',
    'Revenue verification required, must be willing to share specific numbers',
    now() + interval '3 days',
    'Mike Chen',
    'mchen@bizgrowth.com',
    'Business Growth Magazine',
    'Business',
    ARRAY['small business', 'growth', 'scaling', 'revenue'],
    ARRAY['Business', 'Entrepreneurship'],
    75,
    90
),
(
    (SELECT id FROM public.tenants LIMIT 1),
    'Digital Transformation Case Studies',
    'Looking for enterprise executives who led successful digital transformation initiatives. Need before/after metrics and key challenges overcome.',
    'C-level or VP level only, enterprise companies with 1000+ employees',
    now() + interval '1 day',
    'Lisa Rodriguez',
    'lrodriguez@enterprise.com',
    'Enterprise Tech Today',
    'Technology',
    ARRAY['digital transformation', 'enterprise', 'technology', 'leadership'],
    ARRAY['Technology', 'Enterprise'],
    80,
    95
);

-- Enable Row Level Security
ALTER TABLE public.haro_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_expertise_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.haro_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.haro_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view HARO requests for their tenant" ON public.haro_requests
    FOR SELECT USING (tenant_id = (SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert HARO requests for their tenant" ON public.haro_requests
    FOR INSERT WITH CHECK (tenant_id = (SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update HARO requests for their tenant" ON public.haro_requests
    FOR UPDATE USING (tenant_id = (SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view expertise profiles for their tenant" ON public.user_expertise_profiles
    FOR SELECT USING (tenant_id = (SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their expertise profiles" ON public.user_expertise_profiles
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view HARO matches for their tenant" ON public.haro_matches
    FOR SELECT USING (tenant_id = (SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage HARO matches for their tenant" ON public.haro_matches
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view analytics for their tenant" ON public.haro_analytics
    FOR SELECT USING (tenant_id = (SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage analytics for their tenant" ON public.haro_analytics
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()));