
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
        // Try cleanup function (optional - may not exist in older database versions)
        try {
          const { error: cleanupError } = await supabase.rpc('cleanup_automate_duplicates', {
            target_tenant_id: userTenant.id
          });

          if (cleanupError && !cleanupError.message.includes('function cleanup_automate_duplicates')) {
            console.warn('Cleanup function error (non-critical):', cleanupError);
          }
        } catch (cleanupErr) {
          console.log('Cleanup function not available, proceeding with manual checks');
        }

        // Check if methodology already exists - using maybeSingle to avoid JSON errors
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
          
          // Ensure step progress exists
          const { data: existingProgress } = await supabase
            .from('automate_step_progress')
            .select('id')
            .eq('tenant_id', userTenant.id)
            .limit(1);
          
          if (!existingProgress?.length) {
            console.log('No step progress found, creating step progress records...');
            await createStepProgress(userTenant.id, existingMethodology.id);
          }
          
          return existingMethodology;
        }

        // Create methodology campaign with conflict handling
        console.log('Creating new methodology campaign...');
        const { data: methodology, error: methodologyError } = await supabase
          .from('automate_methodology_campaigns')
          .insert({
            tenant_id: userTenant.id,
            campaign_id: campaignId || null,
            status: 'in_progress',
            started_at: new Date().toISOString(),
            methodology_name: 'AUTOMATE'
          })
          .select()
          .maybeSingle();

        if (methodologyError) {
          // If it's a unique constraint violation, try to fetch existing record
          if (methodologyError.code === '23505') {
            console.log('Methodology already exists due to constraint, fetching existing record...');
            const { data: existingAfterConflict, error: fetchError } = await supabase
              .from('automate_methodology_campaigns')
              .select('*')
              .eq('tenant_id', userTenant.id)
              .maybeSingle();
            
            if (fetchError) {
              throw new Error(`Failed to retrieve existing methodology: ${fetchError.message}`);
            }
            
            if (existingAfterConflict) {
              return existingAfterConflict;
            }
          }
          
          console.error('Error creating methodology campaign:', methodologyError);
          throw new Error(`Failed to create methodology: ${methodologyError.message}`);
        }

        if (!methodology) {
          throw new Error('Failed to create methodology campaign - no data returned');
        }

        console.log('Created methodology campaign:', methodology);

        // Create step progress records
        await createStepProgress(userTenant.id, methodology.id);

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
    retry: 1,
    retryDelay: 2000,
  });
}

// Helper function to create step progress records with better duplicate handling
async function createStepProgress(tenantId: string, methodologyId: string) {
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

  // Check existing steps more carefully
  const { data: existingSteps } = await supabase
    .from('automate_step_progress')
    .select('step_index, step_code')
    .eq('tenant_id', tenantId);

  const existingStepKeys = new Set(
    existingSteps?.map(s => `${s.step_code}-${s.step_index}`) || []
  );

  // Only create steps that don't already exist
  const stepsToCreate = steps.filter(step => 
    !existingStepKeys.has(`${step.code}-${step.index}`)
  );

  if (stepsToCreate.length === 0) {
    console.log('All step progress records already exist');
    return;
  }

  console.log(`Creating ${stepsToCreate.length} new step progress records`);

  // Create step progress records using upsert to handle conflicts gracefully
  const { error: upsertError } = await supabase
    .from('automate_step_progress')
    .upsert(
      stepsToCreate.map(step => ({
        methodology_campaign_id: methodologyId,
        tenant_id: tenantId,
        step_code: step.code,
        step_name: step.name,
        step_index: step.index,
        completion_percentage: step.completion,
        status: step.completion > 50 ? 'completed' : step.completion > 0 ? 'in_progress' : 'pending'
      })),
      { 
        onConflict: 'tenant_id,step_code,step_index',
        ignoreDuplicates: true 
      }
    );

  if (upsertError) {
    console.error('Error creating step progress records:', upsertError);
    throw new Error(`Failed to create step progress: ${upsertError.message}`);
  }
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
        .maybeSingle();

      if (error) {
        console.error('Error updating step progress:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Step progress record not found');
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
