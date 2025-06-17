-- Create comprehensive Row Level Security (RLS) policies for PR module tables
-- This ensures proper tenant isolation and data security

-- First, ensure we have the helper function for getting user tenant IDs
-- This function should already exist based on the existing schema, but we'll create it if not

CREATE OR REPLACE FUNCTION get_user_tenant_ids(user_uuid UUID)
RETURNS TABLE(tenant_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT up.tenant_id
    FROM user_profiles up
    WHERE up.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_user_tenant_ids(UUID) TO authenticated;

-- Additional RLS policies for existing tables that might be missing them

-- Ensure RLS is enabled on all core tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE pr_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_syndications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_platform_citations ENABLE ROW LEVEL SECURITY;

-- Create missing RLS policies for existing tables if they don't exist

-- Tenants table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tenants' AND policyname = 'tenants_user_access'
    ) THEN
        CREATE POLICY tenants_user_access ON tenants
            FOR ALL
            USING (
                id IN (SELECT get_user_tenant_ids(auth.uid()))
                OR parent_agency_id IN (SELECT get_user_tenant_ids(auth.uid()))
            )
            WITH CHECK (
                id IN (SELECT get_user_tenant_ids(auth.uid()))
                OR parent_agency_id IN (SELECT get_user_tenant_ids(auth.uid()))
            );
    END IF;
END $$;

-- User profiles policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' AND policyname = 'user_profiles_own_access'
    ) THEN
        CREATE POLICY user_profiles_own_access ON user_profiles
            FOR ALL
            USING (
                id = auth.uid() 
                OR tenant_id IN (SELECT get_user_tenant_ids(auth.uid()))
            )
            WITH CHECK (
                id = auth.uid() 
                OR tenant_id IN (SELECT get_user_tenant_ids(auth.uid()))
            );
    END IF;
END $$;

-- Campaigns table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'campaigns' AND policyname = 'campaigns_tenant_isolation'
    ) THEN
        CREATE POLICY campaigns_tenant_isolation ON campaigns
            FOR ALL
            USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
            WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));
    END IF;
END $$;

-- Content pieces table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'content_pieces' AND policyname = 'content_pieces_tenant_isolation'
    ) THEN
        CREATE POLICY content_pieces_tenant_isolation ON content_pieces
            FOR ALL
            USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
            WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));
    END IF;
END $$;

-- Press releases table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'press_releases' AND policyname = 'press_releases_tenant_isolation'
    ) THEN
        CREATE POLICY press_releases_tenant_isolation ON press_releases
            FOR ALL
            USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
            WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));
    END IF;
END $$;

-- PR campaigns table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'pr_campaigns' AND policyname = 'pr_campaigns_tenant_isolation'
    ) THEN
        CREATE POLICY pr_campaigns_tenant_isolation ON pr_campaigns
            FOR ALL
            USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
            WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));
    END IF;
END $$;

-- SEO keywords table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'seo_keywords' AND policyname = 'seo_keywords_tenant_isolation'
    ) THEN
        CREATE POLICY seo_keywords_tenant_isolation ON seo_keywords
            FOR ALL
            USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
            WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));
    END IF;
END $$;

-- Podcast syndications table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'podcast_syndications' AND policyname = 'podcast_syndications_tenant_isolation'
    ) THEN
        CREATE POLICY podcast_syndications_tenant_isolation ON podcast_syndications
            FOR ALL
            USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
            WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));
    END IF;
END $$;

-- AI platform citations table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'ai_platform_citations' AND policyname = 'ai_platform_citations_tenant_isolation'
    ) THEN
        CREATE POLICY ai_platform_citations_tenant_isolation ON ai_platform_citations
            FOR ALL
            USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
            WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));
    END IF;
END $$;

-- Automate frameworks table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'automate_frameworks' AND policyname = 'automate_frameworks_tenant_isolation'
    ) THEN
        CREATE POLICY automate_frameworks_tenant_isolation ON automate_frameworks
            FOR ALL
            USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
            WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));
    END IF;
END $$;

-- Automate progress table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'automate_progress' AND policyname = 'automate_progress_tenant_isolation'
    ) THEN
        CREATE POLICY automate_progress_tenant_isolation ON automate_progress
            FOR ALL
            USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
            WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));
    END IF;
END $$;

-- Automate methodology campaigns table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'automate_methodology_campaigns' AND policyname = 'automate_methodology_campaigns_tenant_isolation'
    ) THEN
        CREATE POLICY automate_methodology_campaigns_tenant_isolation ON automate_methodology_campaigns
            FOR ALL
            USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
            WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));
    END IF;
END $$;

-- Automate step progress table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'automate_step_progress' AND policyname = 'automate_step_progress_tenant_isolation'
    ) THEN
        CREATE POLICY automate_step_progress_tenant_isolation ON automate_step_progress
            FOR ALL
            USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
            WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));
    END IF;
END $$;

-- Automate audit scores table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'automate_audit_scores' AND policyname = 'automate_audit_scores_tenant_isolation'
    ) THEN
        CREATE POLICY automate_audit_scores_tenant_isolation ON automate_audit_scores
            FOR ALL
            USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())))
            WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));
    END IF;
END $$;

-- Role-based access policies for different user types
-- These provide more granular access control based on user roles

-- Function to get current user role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT up.role
        FROM user_profiles up
        WHERE up.id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_current_user_role() TO authenticated;

-- Advanced RLS policy for sensitive operations (admin only)
CREATE POLICY journalist_contacts_admin_full_access ON journalist_contacts
    FOR ALL
    USING (
        get_current_user_role() IN ('admin', 'super_admin')
        AND tenant_id IN (SELECT get_user_tenant_ids(auth.uid()))
    );

-- Advanced RLS policy for editor access (can edit but not delete)
CREATE POLICY journalist_contacts_editor_access ON journalist_contacts
    FOR SELECT, INSERT, UPDATE
    USING (
        get_current_user_role() IN ('editor', 'manager', 'admin', 'super_admin')
        AND tenant_id IN (SELECT get_user_tenant_ids(auth.uid()))
    );

-- Advanced RLS policy for viewer access (read only)
CREATE POLICY journalist_contacts_viewer_access ON journalist_contacts
    FOR SELECT
    USING (
        get_current_user_role() IN ('viewer', 'editor', 'manager', 'admin', 'super_admin')
        AND tenant_id IN (SELECT get_user_tenant_ids(auth.uid()))
    );

-- Similar role-based policies for media outlets
CREATE POLICY media_outlets_admin_full_access ON media_outlets
    FOR ALL
    USING (
        get_current_user_role() IN ('admin', 'super_admin')
        AND tenant_id IN (SELECT get_user_tenant_ids(auth.uid()))
    );

CREATE POLICY media_outlets_editor_access ON media_outlets
    FOR SELECT, INSERT, UPDATE
    USING (
        get_current_user_role() IN ('editor', 'manager', 'admin', 'super_admin')
        AND tenant_id IN (SELECT get_user_tenant_ids(auth.uid()))
    );

-- Outreach policies - users can see their own outreach and team outreach
CREATE POLICY journalist_outreach_creator_and_team_access ON journalist_outreach
    FOR ALL
    USING (
        (created_by = auth.uid() OR get_current_user_role() IN ('manager', 'admin', 'super_admin'))
        AND tenant_id IN (SELECT get_user_tenant_ids(auth.uid()))
    );

-- Security function to log RLS policy violations
CREATE OR REPLACE FUNCTION log_rls_violation(
    table_name TEXT,
    operation TEXT,
    user_id UUID,
    tenant_id UUID
) RETURNS VOID AS $$
BEGIN
    -- Log RLS violations for security monitoring
    INSERT INTO security_logs (
        event_type,
        table_name,
        operation,
        user_id,
        tenant_id,
        created_at
    ) VALUES (
        'rls_violation',
        table_name,
        operation,
        user_id,
        tenant_id,
        NOW()
    ) ON CONFLICT DO NOTHING; -- Ignore if security_logs table doesn't exist
EXCEPTION WHEN OTHERS THEN
    -- Silently fail if security_logs table doesn't exist
    NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant appropriate permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Ensure RLS is enforced for all users including service_role
ALTER ROLE service_role SET row_security = on;

-- Add comments for documentation
COMMENT ON FUNCTION get_user_tenant_ids(UUID) IS 'Returns all tenant IDs that a user has access to';
COMMENT ON FUNCTION get_current_user_role() IS 'Returns the role of the currently authenticated user';
COMMENT ON FUNCTION log_rls_violation(TEXT, TEXT, UUID, UUID) IS 'Logs RLS policy violations for security monitoring';