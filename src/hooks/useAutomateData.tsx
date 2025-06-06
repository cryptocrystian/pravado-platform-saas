
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';

export function useAutomateMethodologyProgress() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['automate-methodology-progress', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) {
        console.log('No userTenant found for AUTOMATE progress query');
        return null;
      }
      
      console.log('Fetching AUTOMATE progress for tenant:', userTenant.id);
      
      const { data, error } = await supabase
        .from('automate_step_progress')
        .select('*')
        .eq('tenant_id', userTenant.id)
        .order('step_index');
      
      if (error) {
        console.error('Error fetching AUTOMATE progress:', error);
        throw error;
      }
      
      console.log('AUTOMATE progress data:', data);
      return data;
    },
    enabled: !!userTenant?.id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useCreateAutomateMethodology() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: userTenant } = useUserTenant();

  return useMutation({
    mutationFn: async ({ campaignId }: { campaignId?: string }) => {
      if (!userTenant?.id) {
        console.error('No tenant ID available for AUTOMATE methodology creation');
        throw new Error('User tenant not found. Please ensure you are logged in and try again.');
      }
      
      console.log('Creating AUTOMATE methodology for tenant:', userTenant.id);
      
      try {
        // First check if methodology already exists
        const { data: existingMethodology, error: checkError } = await supabase
          .from('automate_methodology_campaigns')
          .select('id')
          .eq('tenant_id', userTenant.id)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing methodology:', checkError);
          throw new Error(`Database check failed: ${checkError.message}`);
        }

        if (existingMethodology) {
          console.log('AUTOMATE methodology already exists for tenant:', userTenant.id);
          return existingMethodology;
        }

        // Create methodology campaign
        console.log('Creating new methodology campaign...');
        const { data: methodology, error: methodologyError } = await supabase
          .from('automate_methodology_campaigns')
          .insert({
            tenant_id: userTenant.id,
            campaign_id: campaignId || null,
            status: 'in_progress',
            started_at: new Date().toISOString()
          })
          .select()
          .single();

        if (methodologyError) {
          console.error('Error creating methodology campaign:', methodologyError);
          throw new Error(`Failed to create methodology: ${methodologyError.message}`);
        }

        console.log('Created methodology campaign:', methodology);

        // Create all 8 step progress records
        const steps = [
          { code: 'A', name: 'Assess & Audit', index: 0, completion: 85 },
          { code: 'U', name: 'Understand Audience', index: 1, completion: 92 },
          { code: 'T', name: 'Target & Strategy', index: 2, completion: 65 },
          { code: 'O', name: 'Optimize Systems', index: 3, completion: 40 },
          { code: 'M', name: 'Measure & Monitor', index: 4, completion: 30 },
          { code: 'A', name: 'Accelerate Growth', index: 5, completion: 15 },
          { code: 'T', name: 'Transform & Evolve', index: 6, completion: 5 },
          { code: 'E', name: 'Execute Excellence', index: 7, completion: 0 }
        ];

        const stepProgressInserts = steps.map(step => ({
          methodology_campaign_id: methodology.id,
          tenant_id: userTenant.id,
          step_code: step.code,
          step_name: step.name,
          step_index: step.index,
          completion_percentage: step.completion,
          status: step.completion > 50 ? 'completed' : step.completion > 0 ? 'in_progress' : 'pending'
        }));

        console.log('Creating step progress records:', stepProgressInserts);
        const { error: stepsError } = await supabase
          .from('automate_step_progress')
          .insert(stepProgressInserts);

        if (stepsError) {
          console.error('Error creating step progress:', stepsError);
          throw new Error(`Failed to create step progress: ${stepsError.message}`);
        }

        console.log('Successfully created AUTOMATE methodology setup');
        return methodology;
      } catch (error) {
        console.error('Complete error in AUTOMATE methodology creation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('AUTOMATE methodology created successfully');
      queryClient.invalidateQueries({ queryKey: ['automate-methodology-progress'] });
      toast({
        title: "AUTOMATE Methodology Initialized",
        description: "Your systematic methodology framework is ready to use",
      });
    },
    onError: (error: any) => {
      console.error('Error creating AUTOMATE methodology:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      toast({
        title: "AUTOMATE Setup Failed",
        description: `${errorMessage}. Please try again or contact support if the issue persists.`,
        variant: "destructive",
      });
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}

export function useUpdateStepProgress() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ stepId, completion, scores, actionItems }: {
      stepId: string;
      completion: number;
      scores?: any;
      actionItems?: any[];
    }) => {
      console.log('Updating step progress:', { stepId, completion });
      
      const { data, error } = await supabase
        .from('automate_step_progress')
        .update({
          completion_percentage: completion,
          audit_scores: scores || {},
          action_items: actionItems || [],
          status: completion >= 100 ? 'completed' : completion > 0 ? 'in_progress' : 'pending',
          updated_at: new Date().toISOString(),
          ...(completion >= 100 && { completed_at: new Date().toISOString() })
        })
        .eq('id', stepId)
        .select()
        .single();

      if (error) {
        console.error('Error updating step progress:', error);
        throw error;
      }
      
      console.log('Updated step progress:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automate-methodology-progress'] });
      toast({
        title: "Progress Updated",
        description: "Step progress has been saved successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating step progress:', error);
      toast({
        title: "Update Failed",
        description: "Failed to save step progress. Please try again.",
        variant: "destructive",
      });
    },
  });
}
