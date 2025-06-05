
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';
import { aiContentService, type ContentGenerationRequest, type BrandVoiceProfile } from '@/services/aiContentService';

export function useAIProviders() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['ai-providers', userTenant?.subscription_tier],
    queryFn: async () => {
      if (!userTenant?.subscription_tier) return [];
      return aiContentService.getAvailableProviders(userTenant.subscription_tier);
    },
    enabled: !!userTenant?.subscription_tier,
  });
}

export function useBrandVoiceProfiles() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['brand-voice-profiles', userTenant?.id],
    queryFn: () => aiContentService.getBrandVoiceProfiles(),
    enabled: !!userTenant?.id,
  });
}

export function useGenerateContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: ContentGenerationRequest) => 
      aiContentService.generateContent(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-usage-tracking'] });
      toast({
        title: "Content Generated",
        description: "Your AI-powered content has been created successfully",
      });
    },
    onError: (error) => {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useCreateBrandVoice() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (profile: Partial<BrandVoiceProfile>) => 
      aiContentService.createBrandVoiceProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-voice-profiles'] });
      toast({
        title: "Brand Voice Created",
        description: "Your brand voice profile has been created and is being analyzed",
      });
    },
    onError: (error) => {
      console.error('Error creating brand voice:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create brand voice profile",
        variant: "destructive",
      });
    },
  });
}

export function useAIUsageAnalytics() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['ai-usage-analytics', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return null;
      
      // This would be implemented with proper analytics queries
      return {
        monthly_usage: 1250,
        monthly_limit: 5000,
        cost_this_month: 42.50,
        avg_generation_time: 2800,
        favorite_provider: 'Claude 4',
        content_success_rate: 0.87
      };
    },
    enabled: !!userTenant?.id,
  });
}
