
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';
import { aiContentService } from '@/services/aiContentService';

export function useAIAutomateAnalysis() {
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useQuery({
    queryKey: ['ai-automate-analysis', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return null;
      
      // Get AUTOMATE methodology progress
      const { data: progressData, error } = await supabase
        .from('automate_step_progress')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('step_index');
      
      if (error) throw error;

      // Generate AI analysis based on progress data
      const analysisPrompt = `Analyze this AUTOMATE methodology progress data and provide insights:
      
${progressData?.map(step => 
  `Step ${step.step_code} (${step.step_name}): ${step.completion_percentage}% complete, Status: ${step.status}`
).join('\n')}

Provide strategic insights, recommendations, and performance predictions.`;

      try {
        const aiAnalysis = await aiContentService.generateContent({
          prompt: analysisPrompt,
          content_type: 'article',
          ai_provider: 'openai-gpt4o',
          model: 'gpt-4o-mini',
          tone: 'professional',
          audience_target: 'business executives'
        });

        return {
          progressData,
          aiInsights: aiAnalysis.content,
          analysisTimestamp: new Date().toISOString()
        };
      } catch (aiError) {
        console.error('AI analysis failed:', aiError);
        return {
          progressData,
          aiInsights: null,
          analysisTimestamp: new Date().toISOString()
        };
      }
    },
    enabled: !!userTenant?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGenerateExecutiveReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async ({ 
      period, 
      includeROI = true, 
      includePredictions = true 
    }: {
      period: 'weekly' | 'monthly' | 'quarterly';
      includeROI?: boolean;
      includePredictions?: boolean;
    }) => {
      if (!userTenant?.id) throw new Error('No tenant ID');

      // Get campaign and methodology data
      const [campaignsResult, progressResult] = await Promise.all([
        supabase
          .from('campaigns')
          .select('*')
          .eq('tenant_id', userTenant.id)
          .gte('created_at', getDateRange(period)),
        
        supabase
          .from('automate_step_progress')
          .select('*')
          .eq('tenant_id', userTenant.id)
      ]);

      if (campaignsResult.error) throw campaignsResult.error;
      if (progressResult.error) throw progressResult.error;

      const reportPrompt = `Generate an executive summary report for ${period} period:

Campaign Data:
- Total campaigns: ${campaignsResult.data?.length || 0}
- Active campaigns: ${campaignsResult.data?.filter(c => c.status === 'active').length || 0}

AUTOMATE Progress:
${progressResult.data?.map(step => 
  `- ${step.step_name}: ${step.completion_percentage}% complete`
).join('\n')}

Generate a C-suite executive report including:
1. Executive summary with key metrics
2. Performance analysis and trends
3. Strategic recommendations
${includeROI ? '4. ROI analysis and business impact' : ''}
${includePredictions ? '5. Predictive insights for next period' : ''}`;

      const reportContent = await aiContentService.generateContent({
        prompt: reportPrompt,
        content_type: 'article',
        ai_provider: 'openai-gpt4o',
        model: 'gpt-4o-mini',
        tone: 'professional',
        audience_target: 'C-suite executives',
        word_count: 1200
      });

      // Store the generated report
      const { data: report, error: reportError } = await supabase
        .from('ai_generated_reports')
        .insert({
          tenant_id: userTenant.id,
          report_type: 'executive_summary',
          period,
          content: reportContent.content,
          generated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (reportError) throw reportError;

      return {
        report,
        campaigns: campaignsResult.data,
        progress: progressResult.data
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['executive-reports'] });
      toast({
        title: "Executive Report Generated",
        description: "AI-powered executive summary created successfully",
      });
    },
    onError: (error) => {
      console.error('Error generating executive report:', error);
      toast({
        title: "Report Generation Failed",
        description: "Failed to generate executive report",
        variant: "destructive",
      });
    },
  });
}

export function useAIRecommendations() {
  const { data: userTenant } = useUserTenant();

  return useQuery({
    queryKey: ['ai-recommendations', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return null;

      // Get current methodology state
      const { data: progressData } = await supabase
        .from('automate_step_progress')
        .select('*')
        .eq('tenant_id', userTenant.id);

      // Get recent campaign performance
      const { data: campaignData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const recommendationPrompt = `Based on this AUTOMATE methodology and campaign data, generate specific actionable recommendations:

Current Progress:
${progressData?.map(step => `${step.step_name}: ${step.completion_percentage}%`).join('\n')}

Recent Campaigns: ${campaignData?.length || 0}

Provide 5-7 specific, actionable recommendations with:
1. Priority level (High/Medium/Low)
2. Expected impact
3. Implementation timeline
4. Required resources`;

      try {
        const recommendations = await aiContentService.generateContent({
          prompt: recommendationPrompt,
          content_type: 'article',
          ai_provider: 'openai-gpt4o',
          model: 'gpt-4o-mini',
          tone: 'professional',
          audience_target: 'marketing managers'
        });

        return {
          recommendations: recommendations.content,
          generatedAt: new Date().toISOString(),
          progressData,
          campaignData
        };
      } catch (error) {
        console.error('Failed to generate AI recommendations:', error);
        return null;
      }
    },
    enabled: !!userTenant?.id,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Helper function to calculate date range
function getDateRange(period: 'weekly' | 'monthly' | 'quarterly'): string {
  const now = new Date();
  const daysBack = {
    weekly: 7,
    monthly: 30,
    quarterly: 90
  };
  
  const startDate = new Date(now.getTime() - (daysBack[period] * 24 * 60 * 60 * 1000));
  return startDate.toISOString();
}
