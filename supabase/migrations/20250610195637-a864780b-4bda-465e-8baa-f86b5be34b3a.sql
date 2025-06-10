
-- Create tables for the complete media database system

-- Media outlets table
CREATE TABLE public.media_outlets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website TEXT,
  category TEXT NOT NULL,
  industry_focus TEXT[] DEFAULT '{}',
  geographic_focus TEXT[] DEFAULT '{}',
  circulation INTEGER,
  domain_authority INTEGER,
  is_premium BOOLEAN DEFAULT false,
  submission_email TEXT,
  submission_guidelines TEXT,
  turnaround_time TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Journalist contacts table
CREATE TABLE public.journalist_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  outlet TEXT NOT NULL,
  beat TEXT NOT NULL,
  location TEXT,
  title TEXT,
  bio TEXT,
  twitter_handle TEXT,
  linkedin_url TEXT,
  relationship_score INTEGER DEFAULT 0,
  interaction_count INTEGER DEFAULT 0,
  last_contacted TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Media relationships table for tracking interactions
CREATE TABLE public.media_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  journalist_id UUID REFERENCES public.journalist_contacts(id) ON DELETE CASCADE,
  outlet_id UUID REFERENCES public.media_outlets(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  strength_score INTEGER DEFAULT 50,
  last_interaction TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Email outreach campaigns
CREATE TABLE public.email_outreach (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  subject_line TEXT NOT NULL,
  email_body TEXT NOT NULL,
  target_audience JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  scheduled_date TIMESTAMP WITH TIME ZONE,
  sent_count INTEGER DEFAULT 0,
  open_rate NUMERIC DEFAULT 0,
  response_rate NUMERIC DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Journalist outreach tracking
CREATE TABLE public.journalist_outreach (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  journalist_id UUID REFERENCES public.journalist_contacts(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  press_release_id UUID REFERENCES public.press_releases(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  outreach_type TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  opened_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  reply_sentiment TEXT,
  follow_up_scheduled TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Media coverage tracking
CREATE TABLE public.media_coverage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  outlet_id UUID REFERENCES public.media_outlets(id) ON DELETE SET NULL,
  journalist_id UUID REFERENCES public.journalist_contacts(id) ON DELETE SET NULL,
  press_release_id UUID REFERENCES public.press_releases(id) ON DELETE SET NULL,
  article_title TEXT NOT NULL,
  article_url TEXT,
  publication_date TIMESTAMP WITH TIME ZONE,
  sentiment_score NUMERIC DEFAULT 0,
  reach_estimate INTEGER DEFAULT 0,
  media_value NUMERIC DEFAULT 0,
  mentions_count INTEGER DEFAULT 1,
  share_count INTEGER DEFAULT 0,
  engagement_score NUMERIC DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.media_outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journalist_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journalist_outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_coverage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their tenant's media outlets" ON public.media_outlets
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can insert media outlets for their tenant" ON public.media_outlets
  FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update their tenant's media outlets" ON public.media_outlets
  FOR UPDATE USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can delete their tenant's media outlets" ON public.media_outlets
  FOR DELETE USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can view their tenant's journalist contacts" ON public.journalist_contacts
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can insert journalist contacts for their tenant" ON public.journalist_contacts
  FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update their tenant's journalist contacts" ON public.journalist_contacts
  FOR UPDATE USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can delete their tenant's journalist contacts" ON public.journalist_contacts
  FOR DELETE USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can view their tenant's media relationships" ON public.media_relationships
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can insert media relationships for their tenant" ON public.media_relationships
  FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update their tenant's media relationships" ON public.media_relationships
  FOR UPDATE USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can delete their tenant's media relationships" ON public.media_relationships
  FOR DELETE USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can view their tenant's email outreach" ON public.email_outreach
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can insert email outreach for their tenant" ON public.email_outreach
  FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update their tenant's email outreach" ON public.email_outreach
  FOR UPDATE USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can delete their tenant's email outreach" ON public.email_outreach
  FOR DELETE USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can view their tenant's journalist outreach" ON public.journalist_outreach
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can insert journalist outreach for their tenant" ON public.journalist_outreach
  FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update their tenant's journalist outreach" ON public.journalist_outreach
  FOR UPDATE USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can delete their tenant's journalist outreach" ON public.journalist_outreach
  FOR DELETE USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can view their tenant's media coverage" ON public.media_coverage
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can insert media coverage for their tenant" ON public.media_coverage
  FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update their tenant's media coverage" ON public.media_coverage
  FOR UPDATE USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can delete their tenant's media coverage" ON public.media_coverage
  FOR DELETE USING (tenant_id = get_current_user_tenant_id());

-- Create indexes for performance
CREATE INDEX idx_media_outlets_tenant_id ON public.media_outlets(tenant_id);
CREATE INDEX idx_media_outlets_category ON public.media_outlets(category);
CREATE INDEX idx_media_outlets_domain_authority ON public.media_outlets(domain_authority DESC);
CREATE INDEX idx_media_outlets_active ON public.media_outlets(is_active, is_premium);

CREATE INDEX idx_journalist_contacts_tenant_id ON public.journalist_contacts(tenant_id);
CREATE INDEX idx_journalist_contacts_outlet ON public.journalist_contacts(outlet);
CREATE INDEX idx_journalist_contacts_beat ON public.journalist_contacts(beat);
CREATE INDEX idx_journalist_contacts_email ON public.journalist_contacts(email);
CREATE INDEX idx_journalist_contacts_relationship_score ON public.journalist_contacts(relationship_score DESC);

CREATE INDEX idx_media_relationships_tenant_id ON public.media_relationships(tenant_id);
CREATE INDEX idx_media_relationships_journalist_id ON public.media_relationships(journalist_id);
CREATE INDEX idx_media_relationships_outlet_id ON public.media_relationships(outlet_id);

CREATE INDEX idx_email_outreach_tenant_id ON public.email_outreach(tenant_id);
CREATE INDEX idx_email_outreach_status ON public.email_outreach(status);
CREATE INDEX idx_email_outreach_scheduled_date ON public.email_outreach(scheduled_date);

CREATE INDEX idx_journalist_outreach_tenant_id ON public.journalist_outreach(tenant_id);
CREATE INDEX idx_journalist_outreach_journalist_id ON public.journalist_outreach(journalist_id);
CREATE INDEX idx_journalist_outreach_status ON public.journalist_outreach(status);
CREATE INDEX idx_journalist_outreach_sent_at ON public.journalist_outreach(sent_at DESC);

CREATE INDEX idx_media_coverage_tenant_id ON public.media_coverage(tenant_id);
CREATE INDEX idx_media_coverage_outlet_id ON public.media_coverage(outlet_id);
CREATE INDEX idx_media_coverage_publication_date ON public.media_coverage(publication_date DESC);
CREATE INDEX idx_media_coverage_media_value ON public.media_coverage(media_value DESC);
