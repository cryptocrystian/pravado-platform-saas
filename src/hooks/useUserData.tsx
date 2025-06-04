
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useUserProfile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useUserTenant() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userTenant', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (!profile) return null;
      
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', profile.tenant_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useDashboardMetrics() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboardMetrics', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Get user's tenant ID first
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (!profile) return null;
      
      const tenantId = profile.tenant_id;
      
      // Fetch all metrics in parallel
      const [
        { count: campaignsCount },
        { count: contentCount },
        { count: keywordsCount },
        { data: teamMembers }
      ] = await Promise.all([
        supabase.from('pr_campaigns').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
        supabase.from('content_pieces').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
        supabase.from('seo_keywords').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
        supabase.from('user_profiles').select('full_name, role').eq('tenant_id', tenantId)
      ]);
      
      return {
        activeCampaigns: campaignsCount || 0,
        contentPieces: contentCount || 0,
        seoKeywords: keywordsCount || 0,
        teamMembers: teamMembers?.length || 0,
      };
    },
    enabled: !!user,
  });
}

export function useAutomateProgress() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['automateProgress', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Get user's tenant ID first
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (!profile) return null;
      
      const { data, error } = await supabase
        .from('automate_progress')
        .select('*')
        .eq('tenant_id', profile.tenant_id)
        .order('step_index');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
