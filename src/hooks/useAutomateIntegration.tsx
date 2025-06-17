import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserData';
import { 
  automateMethodologyService, 
  AutomateStepProgress, 
  AutomateGuidedAction,
  AutomateMethodologyInsight,
  AUTOMATE_STEPS
} from '@/services/automateMethodologyService';

interface AutomateIntegrationConfig {
  currentPage?: string;
  campaignId?: string;
  enableAutoTracking?: boolean;
  relevantSteps?: string[]; // Step codes relevant to current context
  trackPageEvents?: boolean;
}

interface AutomateContextualGuidance {
  relevantSteps: AutomateStepProgress[];
  currentFocusStep: AutomateStepProgress | null;
  contextualActions: AutomateGuidedAction[];
  progressSuggestions: string[];
  relevanceScore: number; // How relevant AUTOMATE guidance is to current context
}

interface AutomateIntegrationHook {
  // Methodology State
  methodology: any;
  overallProgress: number;
  isInitialized: boolean;
  isLoading: boolean;
  
  // Contextual Guidance
  contextualGuidance: AutomateContextualGuidance | null;
  currentStep: AutomateStepProgress | null;
  nextRecommendedAction: AutomateGuidedAction | null;
  
  // Insights and Recommendations
  activeInsights: AutomateMethodologyInsight[];
  priorityRecommendations: any[];
  
  // Actions
  initializeMethodology: () => Promise<void>;
  updateStepProgress: (stepId: string, updates: any) => Promise<void>;
  completeAction: (actionId: string, notes?: string) => Promise<void>;
  trackPageInteraction: (pageAction: string, context?: any) => Promise<void>;
  getStepGuidance: (stepCode: string) => AutomateStepProgress | null;
  getRelevantActions: (limit?: number) => AutomateGuidedAction[];
  refreshGuidance: () => Promise<void>;
  
  // Utility Functions
  isStepRelevant: (stepCode: string) => boolean;
  getStepProgress: (stepCode: string) => number;
  getNextBestAction: () => string | null;
}

// Page-to-Step relevance mapping
const PAGE_STEP_RELEVANCE: { [page: string]: { [stepCode: string]: number } } = {
  'content-marketing': {
    'A': 9, 'U': 8, 'T': 10, 'O': 6, 'M': 7, 'E': 5
  },
  'public-relations': {
    'A': 8, 'U': 9, 'T': 10, 'O': 7, 'M': 8, 'E': 6
  },
  'seo-intelligence': {
    'A': 10, 'U': 7, 'T': 9, 'O': 8, 'M': 9, 'E': 6
  },
  'analytics': {
    'A': 6, 'U': 5, 'T': 7, 'O': 8, 'M': 10, 'E': 8
  },
  'campaigns': {
    'A': 7, 'U': 8, 'T': 10, 'O': 9, 'M': 8, 'E': 7
  },
  'dashboard': {
    'A': 8, 'U': 6, 'T': 7, 'O': 6, 'M': 9, 'E': 7
  }
};

// Action types that should trigger step progress
const TRACKABLE_ACTIONS: { [action: string]: { stepCodes: string[]; progressWeight: number } } = {
  'content_created': { stepCodes: ['T', 'O'], progressWeight: 5 },
  'content_published': { stepCodes: ['T', 'O', 'M'], progressWeight: 10 },
  'pr_campaign_launched': { stepCodes: ['T', 'O'], progressWeight: 15 },
  'seo_optimization_completed': { stepCodes: ['O', 'M'], progressWeight: 8 },
  'analytics_reviewed': { stepCodes: ['M', 'A'], progressWeight: 3 },
  'campaign_created': { stepCodes: ['T'], progressWeight: 12 },
  'audit_completed': { stepCodes: ['A'], progressWeight: 20 },
  'audience_research_done': { stepCodes: ['U'], progressWeight: 15 },
  'strategy_documented': { stepCodes: ['T'], progressWeight: 18 },
  'system_optimized': { stepCodes: ['O'], progressWeight: 12 },
  'metrics_configured': { stepCodes: ['M'], progressWeight: 10 },
  'growth_tactic_implemented': { stepCodes: ['A'], progressWeight: 8 }, // Second A
  'process_improved': { stepCodes: ['T'], progressWeight: 6 }, // Second T
  'excellence_standard_set': { stepCodes: ['E'], progressWeight: 10 }
};

export const useAutomateIntegration = (config: AutomateIntegrationConfig = {}): AutomateIntegrationHook => {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();
  
  // State
  const [methodology, setMethodology] = useState<any>(null);
  const [steps, setSteps] = useState<AutomateStepProgress[]>([]);
  const [currentStep, setCurrentStep] = useState<AutomateStepProgress | null>(null);
  const [contextualGuidance, setContextualGuidance] = useState<AutomateContextualGuidance | null>(null);
  const [activeInsights, setActiveInsights] = useState<AutomateMethodologyInsight[]>([]);
  const [guidedActions, setGuidedActions] = useState<AutomateGuidedAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const tenantId = userProfile?.tenant_id;

  // Load methodology data
  const loadMethodologyData = useCallback(async () => {
    if (!tenantId) return;

    try {
      setIsLoading(true);
      
      // Get methodology progress
      const progressData = await automateMethodologyService.getMethodologyProgress(
        tenantId, 
        config.campaignId
      );
      
      setMethodology(progressData.methodology);
      setSteps(progressData.steps);
      setCurrentStep(progressData.nextRecommendedStep);
      setIsInitialized(!!progressData.methodology);

      // Generate contextual guidance
      if (progressData.methodology && progressData.steps.length > 0) {
        const guidance = generateContextualGuidance(progressData.steps, config);
        setContextualGuidance(guidance);

        // Load insights
        const insights = await automateMethodologyService.getMethodologyInsights(
          progressData.methodology.id!,
          { status: 'new' }
        );
        setActiveInsights(insights);

        // Load guided actions for relevant steps
        if (guidance.currentFocusStep) {
          const actions = await automateMethodologyService.getGuidedActions(
            guidance.currentFocusStep.id!
          );
          setGuidedActions(actions);
        }
      }

    } catch (error) {
      console.error('Failed to load AUTOMATE methodology data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, config.campaignId, config.currentPage]);

  // Generate contextual guidance based on current page/context
  const generateContextualGuidance = useCallback((
    allSteps: AutomateStepProgress[], 
    config: AutomateIntegrationConfig
  ): AutomateContextualGuidance => {
    const { currentPage, relevantSteps } = config;
    
    let relevantStepsList: AutomateStepProgress[] = [];
    let relevanceScore = 5; // Default relevance

    if (currentPage && PAGE_STEP_RELEVANCE[currentPage]) {
      // Filter and sort steps by relevance to current page
      const pageRelevance = PAGE_STEP_RELEVANCE[currentPage];
      relevantStepsList = allSteps
        .filter(step => pageRelevance[step.step_code] >= 6) // Only include steps with relevance 6+
        .sort((a, b) => (pageRelevance[b.step_code] || 0) - (pageRelevance[a.step_code] || 0));
      
      // Calculate overall relevance score
      relevanceScore = Math.round(
        relevantStepsList.reduce((sum, step) => sum + (pageRelevance[step.step_code] || 0), 0) / 
        relevantStepsList.length
      );
    } else if (relevantSteps) {
      // Use explicitly provided relevant steps
      relevantStepsList = allSteps.filter(step => relevantSteps.includes(step.step_code));
      relevanceScore = 8; // High relevance when explicitly specified
    } else {
      // Use all steps with current step first
      relevantStepsList = allSteps;
      relevanceScore = 6; // Medium relevance when no context provided
    }

    // Find current focus step (next step that needs attention)
    const currentFocusStep = relevantStepsList.find(step => 
      step.status === 'in_progress' || step.status === 'pending'
    ) || null;

    // Generate progress suggestions
    const progressSuggestions = generateProgressSuggestions(relevantStepsList, currentPage);

    return {
      relevantSteps: relevantStepsList,
      currentFocusStep,
      contextualActions: [], // Will be populated separately
      progressSuggestions,
      relevanceScore
    };
  }, []);

  // Generate progress suggestions based on current state
  const generateProgressSuggestions = useCallback((
    steps: AutomateStepProgress[], 
    currentPage?: string
  ): string[] => {
    const suggestions: string[] = [];
    
    // Check for blocked steps
    const blockedSteps = steps.filter(step => step.status === 'blocked');
    if (blockedSteps.length > 0) {
      suggestions.push(`Resolve ${blockedSteps.length} blocked step(s) to maintain momentum`);
    }

    // Check for next logical step
    const nextPendingStep = steps.find(step => step.status === 'pending');
    if (nextPendingStep && currentPage) {
      const pageRelevance = PAGE_STEP_RELEVANCE[currentPage];
      if (pageRelevance && pageRelevance[nextPendingStep.step_code] >= 8) {
        suggestions.push(`Start "${nextPendingStep.step_name}" - highly relevant to current work`);
      }
    }

    // Check for incomplete in-progress steps
    const stuckSteps = steps.filter(step => 
      step.status === 'in_progress' && 
      step.completion_percentage < 50 &&
      step.started_at &&
      (Date.now() - new Date(step.started_at).getTime()) > (7 * 24 * 60 * 60 * 1000) // 7 days
    );
    
    if (stuckSteps.length > 0) {
      suggestions.push(`Review ${stuckSteps.length} step(s) with slow progress`);
    }

    // Page-specific suggestions
    if (currentPage === 'content-marketing') {
      const strategyStep = steps.find(s => s.step_code === 'T');
      if (strategyStep && strategyStep.completion_percentage < 80) {
        suggestions.push('Complete strategy planning before scaling content creation');
      }
    }

    if (currentPage === 'analytics') {
      const measureStep = steps.find(s => s.step_code === 'M');
      if (measureStep && measureStep.status === 'pending') {
        suggestions.push('Set up measurement framework to track methodology ROI');
      }
    }

    return suggestions.slice(0, 3); // Return top 3 suggestions
  }, []);

  // Initialize methodology
  const initializeMethodology = useCallback(async () => {
    if (!tenantId) return;

    try {
      await automateMethodologyService.initializeMethodology(tenantId, {
        campaignId: config.campaignId,
        methodologyOwner: user?.id,
        templateType: 'default'
      });
      
      await loadMethodologyData();
    } catch (error) {
      console.error('Failed to initialize AUTOMATE methodology:', error);
      throw error;
    }
  }, [tenantId, config.campaignId, user?.id, loadMethodologyData]);

  // Update step progress
  const updateStepProgress = useCallback(async (stepId: string, updates: any) => {
    try {
      await automateMethodologyService.updateStepProgress(stepId, updates);
      await loadMethodologyData();
    } catch (error) {
      console.error('Failed to update step progress:', error);
      throw error;
    }
  }, [loadMethodologyData]);

  // Complete action
  const completeAction = useCallback(async (actionId: string, notes?: string) => {
    try {
      await automateMethodologyService.updateGuidedAction(actionId, {
        status: 'completed',
        completion_notes: notes
      });
      
      await loadMethodologyData();
    } catch (error) {
      console.error('Failed to complete action:', error);
      throw error;
    }
  }, [loadMethodologyData]);

  // Track page interactions that should contribute to step progress
  const trackPageInteraction = useCallback(async (pageAction: string, context?: any) => {
    if (!config.enableAutoTracking || !tenantId || !methodology) return;

    const trackableAction = TRACKABLE_ACTIONS[pageAction];
    if (!trackableAction) return;

    try {
      // Update progress for relevant steps
      for (const stepCode of trackableAction.stepCodes) {
        const step = steps.find(s => s.step_code === stepCode);
        if (step && step.status !== 'completed') {
          const newProgress = Math.min(
            100, 
            step.completion_percentage + trackableAction.progressWeight
          );
          
          await automateMethodologyService.updateStepProgress(step.id!, {
            completion_percentage: newProgress,
            status: newProgress >= 100 ? 'completed' : 'in_progress'
          });
        }
      }

      // Refresh guidance after tracking
      await loadMethodologyData();
    } catch (error) {
      console.error('Failed to track page interaction:', error);
    }
  }, [config.enableAutoTracking, tenantId, methodology, steps, loadMethodologyData]);

  // Get step guidance
  const getStepGuidance = useCallback((stepCode: string): AutomateStepProgress | null => {
    return steps.find(step => step.step_code === stepCode) || null;
  }, [steps]);

  // Get relevant actions for current context
  const getRelevantActions = useCallback((limit: number = 3): AutomateGuidedAction[] => {
    if (!config.currentPage) return guidedActions.slice(0, limit);

    // Filter actions relevant to current page
    const pageCategory = getPageCategory(config.currentPage);
    const relevantActions = guidedActions.filter(action => 
      action.action_category === pageCategory ||
      action.related_platform_features?.includes(config.currentPage!) ||
      action.status === 'in_progress'
    );

    return relevantActions.slice(0, limit);
  }, [guidedActions, config.currentPage]);

  // Utility: Check if step is relevant to current context
  const isStepRelevant = useCallback((stepCode: string): boolean => {
    if (!config.currentPage) return true;
    
    const pageRelevance = PAGE_STEP_RELEVANCE[config.currentPage];
    return pageRelevance ? (pageRelevance[stepCode] || 0) >= 6 : true;
  }, [config.currentPage]);

  // Utility: Get step progress percentage
  const getStepProgress = useCallback((stepCode: string): number => {
    const step = steps.find(s => s.step_code === stepCode);
    return step ? step.completion_percentage : 0;
  }, [steps]);

  // Utility: Get next best action recommendation
  const getNextBestAction = useCallback((): string | null => {
    if (contextualGuidance?.progressSuggestions.length) {
      return contextualGuidance.progressSuggestions[0];
    }
    
    if (currentStep) {
      return `Continue with ${currentStep.step_name}`;
    }
    
    return null;
  }, [contextualGuidance, currentStep]);

  // Helper function to get page category
  const getPageCategory = (page: string): string => {
    const categoryMap: { [key: string]: string } = {
      'content-marketing': 'content',
      'public-relations': 'pr',
      'seo-intelligence': 'seo',
      'analytics': 'technical',
      'campaigns': 'strategy',
      'dashboard': 'strategy'
    };
    return categoryMap[page] || 'strategy';
  };

  // Load data on mount and when dependencies change
  useEffect(() => {
    if (tenantId) {
      loadMethodologyData();
    }
  }, [loadMethodologyData]);

  // Compute derived values
  const overallProgress = methodology?.overall_completion_percentage || 0;
  const nextRecommendedAction = getRelevantActions(1)[0] || null;
  const priorityRecommendations = contextualGuidance?.progressSuggestions.map(suggestion => ({
    title: suggestion,
    priority: 'high',
    type: 'methodology_guidance'
  })) || [];

  return {
    // Methodology State
    methodology,
    overallProgress,
    isInitialized,
    isLoading,
    
    // Contextual Guidance
    contextualGuidance,
    currentStep,
    nextRecommendedAction,
    
    // Insights and Recommendations
    activeInsights,
    priorityRecommendations,
    
    // Actions
    initializeMethodology,
    updateStepProgress,
    completeAction,
    trackPageInteraction,
    getStepGuidance,
    getRelevantActions,
    refreshGuidance: loadMethodologyData,
    
    // Utility Functions
    isStepRelevant,
    getStepProgress,
    getNextBestAction
  };
};

// Hook for tracking specific AUTOMATE actions
export const useAutomateActionTracking = (tenantId: string, enabled: boolean = true) => {
  const trackAction = useCallback(async (actionType: string, context?: any) => {
    if (!enabled || !tenantId) return;

    try {
      // This would integrate with the main AUTOMATE tracking system
      console.log('🎯 AUTOMATE Action Tracked:', { actionType, context, tenantId });
      
      // In a real implementation, this would call the tracking service
      // await automateMethodologyService.trackPageAction(tenantId, actionType, context);
    } catch (error) {
      console.error('Failed to track AUTOMATE action:', error);
    }
  }, [tenantId, enabled]);

  return { trackAction };
};