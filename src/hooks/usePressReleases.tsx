
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';

export type MediaOutlet = {
  id: string;
  name: string;
  website: string;
  category: string;
  industry_focus: string[];
  geographic_focus: string[];
  circulation?: number;
  domain_authority?: number;
  is_premium: boolean;
  submission_email?: string;
  submission_guidelines?: string;
  turnaround_time?: string;
  is_active: boolean;
  created_at: string;
};

export function usePressReleases() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['press-releases', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('press_releases')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userTenant?.id,
  });
}

export function useMediaOutlets() {
  return useQuery({
    queryKey: ['media-outlets'],
    queryFn: async (): Promise<MediaOutlet[]> => {
      // TODO: Replace with actual Supabase query when types are available
      // const { data, error } = await supabase
      //   .from('media_outlets')
      //   .select('*')
      //   .eq('is_active', true)
      //   .order('domain_authority', { ascending: false });
      // if (error) throw error;
      // return data || [];

      // Mock media outlets data
      const mockOutlets: MediaOutlet[] = [
        {
          id: '1',
          name: 'MarketWatch',
          website: 'https://marketwatch.com',
          category: 'Financial',
          industry_focus: ['Finance', 'Business', 'Markets'],
          geographic_focus: ['US', 'Global'],
          circulation: 15000000,
          domain_authority: 92,
          is_premium: true,
          submission_email: 'news@marketwatch.com',
          turnaround_time: '2-4 hours',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'TechCrunch',
          website: 'https://techcrunch.com',
          category: 'Technology',
          industry_focus: ['Technology', 'Startups', 'Innovation'],
          geographic_focus: ['US', 'Global'],
          circulation: 12000000,
          domain_authority: 92,
          is_premium: true,
          submission_email: 'tips@techcrunch.com',
          turnaround_time: '1-2 hours',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Business Insider',
          website: 'https://businessinsider.com',
          category: 'Business',
          industry_focus: ['Business', 'Technology', 'Finance'],
          geographic_focus: ['US', 'Global'],
          circulation: 375000000,
          domain_authority: 91,
          is_premium: true,
          submission_email: 'news@businessinsider.com',
          turnaround_time: '1-3 hours',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
      
      return mockOutlets;
    },
  });
}

export function useCreatePressRelease() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (pressRelease: any) => {
      const { error } = await supabase
        .from('press_releases')
        .insert({
          ...pressRelease,
          tenant_id: userTenant?.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['press-releases'] });
      toast({
        title: "Success",
        description: "Press release created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating press release:', error);
      toast({
        title: "Error",
        description: "Failed to create press release",
        variant: "destructive",
      });
    },
  });
}
