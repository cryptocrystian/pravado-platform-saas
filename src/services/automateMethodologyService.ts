import { supabase } from '@/integrations/supabase/client';

// AUTOMATE Methodology Types
export interface AutomateMethodologyCampaign {
  id?: string;
  tenant_id: string;
  methodology_name: string;
  campaign_id?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  overall_completion_percentage: number;
  started_at?: string;
  target_completion_date?: string;
  completed_at?: string;
  custom_step_configuration?: any;
  methodology_goals?: any;
  success_criteria?: any;
  methodology_owner_id?: string;
  stakeholder_team?: any[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AutomateStepProgress {
  id?: string;
  methodology_campaign_id: string;
  tenant_id: string;
  step_code: 'A' | 'U' | 'T' | 'O' | 'M' | 'A' | 'T' | 'E';
  step_name: string;
  step_index: number;
  step_description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'skipped';
  completion_percentage: number;
  is_required: boolean;
  estimated_hours?: number;
  actual_hours_spent?: number;
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  content_pillar_weight: number;
  pr_pillar_weight: number;
  seo_pillar_weight: number;
  audit_scores?: any;
  baseline_metrics?: any;
  target_audience_data?: any;
  strategy_framework?: any;
  optimization_recommendations?: any;
  measurement_kpis?: any;
  acceleration_tactics?: any;
  transformation_roadmap?: any;
  excellence_standards?: any;
  action_items?: any[];
  completed_actions?: any[];
  depends_on_steps?: number[];
  blocking_issues?: any[];
  started_at?: string;
  target_completion_date?: string;
  completed_at?: string;
  assigned_to?: string;
  assigned_team?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface AutomateGuidedAction {
  id?: string;
  step_progress_id: string;
  tenant_id: string;
  action_title: string;
  action_description: string;
  action_type: 'assessment' | 'research' | 'creation' | 'optimization' | 'analysis';
  action_category: 'content' | 'pr' | 'seo' | 'strategy' | 'technical';
  why_important?: string;
  how_to_complete?: string;
  expected_outcome?: string;
  best_practices?: string[];
  common_mistakes?: string[];
  is_required: boolean;
  estimated_time_minutes?: number;
  difficulty_level: 'easy' | 'medium' | 'hard' | 'expert';
  order_index: number;
  prerequisites?: string[];
  required_tools?: string[];
  required_skills?: string[];
  related_platform_features?: string[];
  auto_completion_available: boolean;
  platform_guidance_url?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'blocked';
  completion_notes?: string;
  completion_evidence?: any;
  requires_review: boolean;
  reviewed_by?: string;
  review_status: 'not_required' | 'pending' | 'approved' | 'needs_revision';
  review_notes?: string;
  assigned_to?: string;
  started_at?: string;
  completed_at?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AutomateStepTemplate {
  id?: string;
  tenant_id?: string;
  template_name: string;
  template_description?: string;
  template_type: 'startup' | 'enterprise' | 'agency' | 'custom' | 'default';
  industry_focus?: string;
  company_size?: string;
  step_code: 'A' | 'U' | 'T' | 'O' | 'M' | 'A' | 'T' | 'E';
  step_index: number;
  guided_actions: any[];
  default_completion_criteria?: any;
  estimated_timeline_days?: number;
  resource_requirements?: any;
  is_active: boolean;
  is_default: boolean;
  usage_count: number;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AutomateMethodologyAnalytics {
  id?: string;
  methodology_campaign_id: string;
  tenant_id: string;
  analytics_date: string;
  period_type: 'daily' | 'weekly' | 'monthly' | 'milestone';
  overall_progress_percentage?: number;
  steps_completed?: number;
  steps_in_progress?: number;
  steps_pending?: number;
  step_completion_data?: any;
  pillar_integration_scores?: any;
  velocity_score?: number;
  quality_score?: number;
  adherence_score?: number;
  team_engagement_score?: number;
  business_metrics?: any;
  roi_indicators?: any;
  ai_insights?: any[];
  recommended_focus_areas?: any[];
  next_best_actions?: any[];
  benchmark_comparison?: any;
  historical_comparison?: any;
  created_at?: string;
}

export interface AutomateMethodologyInsight {
  id?: string;
  methodology_campaign_id: string;
  tenant_id: string;
  insight_type: 'progress_alert' | 'optimization_tip' | 'best_practice' | 'risk_warning';
  insight_category: 'step_completion' | 'pillar_integration' | 'team_performance' | 'business_impact';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  detailed_analysis?: string;
  related_step_code?: string;
  related_pillars?: string[];
  confidence_score?: number;
  data_sources?: string[];
  analysis_methodology?: string;
  recommended_actions?: any[];
  expected_impact?: any;
  implementation_difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  estimated_time_to_implement?: string;
  status: 'new' | 'acknowledged' | 'implementing' | 'completed' | 'dismissed';
  acknowledged_by?: string;
  acknowledged_at?: string;
  was_helpful?: boolean;
  user_feedback?: string;
  implementation_results?: any;
  expires_at?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// AUTOMATE Steps Configuration
export const AUTOMATE_STEPS = [
  {
    code: 'A' as const,
    name: 'Assess & Audit',
    index: 0,
    description: 'Comprehensive assessment and audit of current state across all marketing pillars',
    defaultWeight: { content: 40, pr: 30, seo: 30 }
  },
  {
    code: 'U' as const,
    name: 'Understand Audience',
    index: 1,
    description: 'Deep audience research and persona development for targeted marketing',
    defaultWeight: { content: 35, pr: 35, seo: 30 }
  },
  {
    code: 'T' as const,
    name: 'Target & Strategy',
    index: 2,
    description: 'Strategic planning and goal setting with integrated approach',
    defaultWeight: { content: 33, pr: 33, seo: 34 }
  },
  {
    code: 'O' as const,
    name: 'Optimize Systems',
    index: 3,
    description: 'System optimization and process improvement across all pillars',
    defaultWeight: { content: 30, pr: 30, seo: 40 }
  },
  {
    code: 'M' as const,
    name: 'Measure & Monitor',
    index: 4,
    description: 'Implementation of comprehensive measurement and monitoring systems',
    defaultWeight: { content: 25, pr: 25, seo: 50 }
  },
  {
    code: 'A' as const,
    name: 'Accelerate Growth',
    index: 5,
    description: 'Growth acceleration tactics and performance optimization',
    defaultWeight: { content: 40, pr: 30, seo: 30 }
  },
  {
    code: 'T' as const,
    name: 'Transform & Evolve',
    index: 6,
    description: 'Digital transformation and continuous evolution strategies',
    defaultWeight: { content: 35, pr: 30, seo: 35 }
  },
  {
    code: 'E' as const,
    name: 'Execute Excellence',
    index: 7,
    description: 'Excellence execution and continuous improvement framework',
    defaultWeight: { content: 33, pr: 33, seo: 34 }
  }
];

class AutomateMethodologyService {
  // Initialize AUTOMATE methodology for a tenant
  async initializeMethodology(
    tenantId: string,
    options: {
      campaignId?: string;
      methodologyOwner?: string;
      targetCompletionDate?: string;
      customConfiguration?: any;
      templateType?: string;
    } = {}
  ): Promise<AutomateMethodologyCampaign> {
    console.log('🚀 Initializing AUTOMATE methodology for tenant:', tenantId);

    try {
      // Check if methodology already exists
      const { data: existingMethodology } = await supabase
        .from('automate_methodology_campaigns')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('campaign_id', options.campaignId || null)
        .maybeSingle();

      if (existingMethodology) {
        console.log('📋 AUTOMATE methodology already exists, returning existing');
        return existingMethodology as AutomateMethodologyCampaign;
      }

      // Create new methodology campaign
      const methodologyData: Partial<AutomateMethodologyCampaign> = {
        tenant_id: tenantId,
        methodology_name: 'AUTOMATE',
        campaign_id: options.campaignId,
        status: 'in_progress',
        overall_completion_percentage: 0,
        started_at: new Date().toISOString(),
        target_completion_date: options.targetCompletionDate,
        methodology_owner_id: options.methodologyOwner,
        custom_step_configuration: options.customConfiguration || {},
        methodology_goals: {
          integrated_marketing: true,
          cross_pillar_synergy: true,
          data_driven_decisions: true,
          systematic_growth: true
        },
        success_criteria: {
          completion_rate: 90,
          pillar_integration_score: 80,
          business_impact_score: 75
        }
      };

      const { data: methodology, error } = await supabase
        .from('automate_methodology_campaigns')
        .insert(methodologyData)
        .select()
        .single();

      if (error) throw error;

      // Initialize step progress for all AUTOMATE steps
      await this.initializeStepProgress(methodology.id, tenantId, options.templateType);

      console.log('✅ AUTOMATE methodology initialized successfully');
      return methodology as AutomateMethodologyCampaign;

    } catch (error) {
      console.error('❌ Failed to initialize AUTOMATE methodology:', error);
      throw error;
    }
  }

  // Initialize step progress for all AUTOMATE steps
  private async initializeStepProgress(
    methodologyCampaignId: string,
    tenantId: string,
    templateType: string = 'default'
  ): Promise<void> {
    console.log('📋 Initializing step progress for AUTOMATE methodology');

    const stepProgressData = AUTOMATE_STEPS.map(step => ({
      methodology_campaign_id: methodologyCampaignId,
      tenant_id: tenantId,
      step_code: step.code,
      step_name: step.name,
      step_index: step.index,
      step_description: step.description,
      status: 'pending' as const,
      completion_percentage: 0,
      is_required: true,
      priority_level: step.index < 3 ? 'high' as const : 'medium' as const,
      content_pillar_weight: step.defaultWeight.content,
      pr_pillar_weight: step.defaultWeight.pr,
      seo_pillar_weight: step.defaultWeight.seo,
      action_items: [],
      completed_actions: [],
      depends_on_steps: step.index > 0 ? [step.index - 1] : [],
      blocking_issues: []
    }));

    const { error } = await supabase
      .from('automate_step_progress')
      .insert(stepProgressData);

    if (error) throw error;

    // Initialize guided actions for each step
    await this.initializeGuidedActions(methodologyCampaignId, tenantId, templateType);
  }

  // Initialize guided actions based on templates
  private async initializeGuidedActions(
    methodologyCampaignId: string,
    tenantId: string,
    templateType: string
  ): Promise<void> {
    console.log('🎯 Initializing guided actions from templates');

    // Get step progress records
    const { data: stepProgressRecords, error: stepError } = await supabase
      .from('automate_step_progress')
      .select('*')
      .eq('methodology_campaign_id', methodologyCampaignId)
      .order('step_index');

    if (stepError) throw stepError;

    // Get templates for each step
    const { data: templates, error: templateError } = await supabase
      .from('automate_step_templates')
      .select('*')
      .eq('template_type', templateType)
      .eq('is_active', true);

    if (templateError) throw templateError;

    const guidedActionsData: Partial<AutomateGuidedAction>[] = [];

    for (const stepProgress of stepProgressRecords || []) {
      const template = templates?.find(t => 
        t.step_code === stepProgress.step_code && 
        t.step_index === stepProgress.step_index
      );

      if (template && template.guided_actions) {
        template.guided_actions.forEach((action: any, index: number) => {
          guidedActionsData.push({
            step_progress_id: stepProgress.id,
            tenant_id: tenantId,
            action_title: action.title,
            action_description: action.description,
            action_type: action.type || 'assessment',
            action_category: action.category || 'strategy',
            why_important: action.why_important,
            how_to_complete: action.instructions,
            expected_outcome: action.expected_outcome,
            best_practices: action.best_practices || [],
            common_mistakes: action.common_mistakes || [],
            is_required: action.is_required !== false,
            estimated_time_minutes: action.estimatedTime || 60,
            difficulty_level: action.difficulty || 'medium',
            order_index: index,
            prerequisites: action.prerequisites || [],
            required_tools: action.required_tools || [],
            required_skills: action.required_skills || [],
            auto_completion_available: action.auto_completion_available || false,
            status: 'pending',
            requires_review: action.requires_review || false,
            review_status: 'not_required'
          });
        });
      }
    }

    if (guidedActionsData.length > 0) {
      const { error } = await supabase
        .from('automate_guided_actions')
        .insert(guidedActionsData);

      if (error) throw error;
    }
  }

  // Get methodology progress for a tenant
  async getMethodologyProgress(tenantId: string, campaignId?: string): Promise<{
    methodology: AutomateMethodologyCampaign | null;
    steps: AutomateStepProgress[];
    overallProgress: number;
    nextRecommendedStep: AutomateStepProgress | null;
  }> {
    console.log('📊 Getting methodology progress for tenant:', tenantId);

    try {
      // Get methodology campaign
      let methodologyQuery = supabase
        .from('automate_methodology_campaigns')
        .select('*')
        .eq('tenant_id', tenantId);

      if (campaignId) {
        methodologyQuery = methodologyQuery.eq('campaign_id', campaignId);
      }

      const { data: methodology, error: methodologyError } = await methodologyQuery.maybeSingle();

      if (methodologyError) throw methodologyError;

      if (!methodology) {
        return {
          methodology: null,
          steps: [],
          overallProgress: 0,
          nextRecommendedStep: null
        };
      }

      // Get step progress
      const { data: steps, error: stepsError } = await supabase
        .from('automate_step_progress')
        .select('*')
        .eq('methodology_campaign_id', methodology.id)
        .order('step_index');

      if (stepsError) throw stepsError;

      // Calculate overall progress
      const totalSteps = steps?.length || 0;
      const completedSteps = steps?.filter(step => step.status === 'completed').length || 0;
      const overallProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

      // Find next recommended step
      const nextRecommendedStep = steps?.find(step => 
        step.status === 'pending' || step.status === 'in_progress'
      ) || null;

      return {
        methodology: methodology as AutomateMethodologyCampaign,
        steps: (steps || []) as AutomateStepProgress[],
        overallProgress: Math.round(overallProgress),
        nextRecommendedStep: nextRecommendedStep as AutomateStepProgress | null
      };

    } catch (error) {
      console.error('❌ Failed to get methodology progress:', error);
      throw error;
    }
  }

  // Update step progress
  async updateStepProgress(
    stepId: string,
    updates: {
      status?: AutomateStepProgress['status'];
      completion_percentage?: number;
      audit_scores?: any;
      completed_actions?: any[];
      blocking_issues?: any[];
      actual_hours_spent?: number;
    }
  ): Promise<AutomateStepProgress> {
    console.log('📝 Updating step progress for step:', stepId);

    try {
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Set completion timestamp if step is completed
      if (updates.status === 'completed') {
        updateData.completed_at = new Date().toISOString();
        updateData.completion_percentage = 100;
      }

      // Set start timestamp if step is started
      if (updates.status === 'in_progress' && !updateData.started_at) {
        updateData.started_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('automate_step_progress')
        .update(updateData)
        .eq('id', stepId)
        .select()
        .single();

      if (error) throw error;

      // Update overall methodology progress
      await this.updateOverallProgress(data.methodology_campaign_id);

      return data as AutomateStepProgress;

    } catch (error) {
      console.error('❌ Failed to update step progress:', error);
      throw error;
    }
  }

  // Update overall methodology progress
  private async updateOverallProgress(methodologyCampaignId: string): Promise<void> {
    console.log('🔄 Updating overall methodology progress');

    try {
      // Get all step progress
      const { data: steps, error: stepsError } = await supabase
        .from('automate_step_progress')
        .select('completion_percentage')
        .eq('methodology_campaign_id', methodologyCampaignId);

      if (stepsError) throw stepsError;

      // Calculate weighted average
      const totalSteps = steps?.length || 0;
      const totalCompletion = steps?.reduce((sum, step) => sum + (step.completion_percentage || 0), 0) || 0;
      const overallProgress = totalSteps > 0 ? totalCompletion / totalSteps : 0;

      // Update methodology campaign
      const updateData: any = {
        overall_completion_percentage: Math.round(overallProgress),
        updated_at: new Date().toISOString()
      };

      // Mark as completed if all steps are done
      if (overallProgress >= 100) {
        updateData.status = 'completed';
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('automate_methodology_campaigns')
        .update(updateData)
        .eq('id', methodologyCampaignId);

      if (error) throw error;

    } catch (error) {
      console.error('❌ Failed to update overall progress:', error);
      throw error;
    }
  }

  // Get guided actions for a step
  async getGuidedActions(stepProgressId: string): Promise<AutomateGuidedAction[]> {
    console.log('🎯 Getting guided actions for step:', stepProgressId);

    try {
      const { data, error } = await supabase
        .from('automate_guided_actions')
        .select('*')
        .eq('step_progress_id', stepProgressId)
        .order('order_index');

      if (error) throw error;

      return (data || []) as AutomateGuidedAction[];

    } catch (error) {
      console.error('❌ Failed to get guided actions:', error);
      throw error;
    }
  }

  // Update guided action status
  async updateGuidedAction(
    actionId: string,
    updates: {
      status?: AutomateGuidedAction['status'];
      completion_notes?: string;
      completion_evidence?: any;
    }
  ): Promise<AutomateGuidedAction> {
    console.log('✅ Updating guided action:', actionId);

    try {
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      if (updates.status === 'in_progress' && !updateData.started_at) {
        updateData.started_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('automate_guided_actions')
        .update(updateData)
        .eq('id', actionId)
        .select()
        .single();

      if (error) throw error;

      return data as AutomateGuidedAction;

    } catch (error) {
      console.error('❌ Failed to update guided action:', error);
      throw error;
    }
  }

  // Generate AI insights for methodology progress
  async generateMethodologyInsights(
    methodologyCampaignId: string,
    tenantId: string
  ): Promise<AutomateMethodologyInsight[]> {
    console.log('🤖 Generating AI insights for methodology:', methodologyCampaignId);

    try {
      // Get current progress data
      const { data: steps, error: stepsError } = await supabase
        .from('automate_step_progress')
        .select('*')
        .eq('methodology_campaign_id', methodologyCampaignId);

      if (stepsError) throw stepsError;

      // Analyze progress and generate insights
      const insights: Partial<AutomateMethodologyInsight>[] = [];

      // Check for blocked steps
      const blockedSteps = steps?.filter(step => step.status === 'blocked') || [];
      if (blockedSteps.length > 0) {
        insights.push({
          methodology_campaign_id: methodologyCampaignId,
          tenant_id: tenantId,
          insight_type: 'risk_warning',
          insight_category: 'step_completion',
          severity: 'high',
          title: 'Blocked Steps Detected',
          description: `${blockedSteps.length} steps are currently blocked and need attention`,
          related_step_code: blockedSteps[0].step_code,
          confidence_score: 95,
          recommended_actions: blockedSteps.map(step => ({
            action: 'Review and resolve blocking issues',
            step: step.step_name,
            priority: 'high'
          })),
          implementation_difficulty: 'medium',
          status: 'new',
          is_active: true
        });
      }

      // Check for slow progress
      const inProgressSteps = steps?.filter(step => step.status === 'in_progress') || [];
      const slowSteps = inProgressSteps.filter(step => {
        if (!step.started_at) return false;
        const daysSinceStart = (Date.now() - new Date(step.started_at).getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceStart > 7 && step.completion_percentage < 50;
      });

      if (slowSteps.length > 0) {
        insights.push({
          methodology_campaign_id: methodologyCampaignId,
          tenant_id: tenantId,
          insight_type: 'optimization_tip',
          insight_category: 'team_performance',
          severity: 'medium',
          title: 'Steps Progressing Slowly',
          description: `${slowSteps.length} steps have been in progress for over a week with low completion`,
          confidence_score: 85,
          recommended_actions: [{
            action: 'Review step requirements and provide additional support',
            priority: 'medium'
          }],
          implementation_difficulty: 'easy',
          status: 'new',
          is_active: true
        });
      }

      // Check for next best actions
      const completedSteps = steps?.filter(step => step.status === 'completed') || [];
      const nextSteps = steps?.filter(step => step.status === 'pending') || [];
      
      if (completedSteps.length > 0 && nextSteps.length > 0) {
        const nextStep = nextSteps[0];
        insights.push({
          methodology_campaign_id: methodologyCampaignId,
          tenant_id: tenantId,
          insight_type: 'best_practice',
          insight_category: 'step_completion',
          severity: 'low',
          title: 'Ready for Next Step',
          description: `Consider starting "${nextStep.step_name}" to maintain methodology momentum`,
          related_step_code: nextStep.step_code,
          confidence_score: 90,
          recommended_actions: [{
            action: `Begin ${nextStep.step_name} activities`,
            step: nextStep.step_name,
            priority: 'medium'
          }],
          implementation_difficulty: 'easy',
          status: 'new',
          is_active: true
        });
      }

      // Save insights to database
      if (insights.length > 0) {
        const { data, error } = await supabase
          .from('automate_methodology_insights')
          .insert(insights)
          .select();

        if (error) throw error;

        return (data || []) as AutomateMethodologyInsight[];
      }

      return [];

    } catch (error) {
      console.error('❌ Failed to generate methodology insights:', error);
      throw error;
    }
  }

  // Get active insights for a methodology
  async getMethodologyInsights(
    methodologyCampaignId: string,
    filters?: {
      severity?: string;
      category?: string;
      status?: string;
    }
  ): Promise<AutomateMethodologyInsight[]> {
    console.log('💡 Getting methodology insights:', methodologyCampaignId);

    try {
      let query = supabase
        .from('automate_methodology_insights')
        .select('*')
        .eq('methodology_campaign_id', methodologyCampaignId)
        .eq('is_active', true);

      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }

      if (filters?.category) {
        query = query.eq('insight_category', filters.category);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query
        .order('severity', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []) as AutomateMethodologyInsight[];

    } catch (error) {
      console.error('❌ Failed to get methodology insights:', error);
      throw error;
    }
  }

  // Create methodology analytics snapshot
  async createAnalyticsSnapshot(
    methodologyCampaignId: string,
    tenantId: string,
    periodType: 'daily' | 'weekly' | 'monthly' | 'milestone' = 'daily'
  ): Promise<AutomateMethodologyAnalytics> {
    console.log('📊 Creating analytics snapshot for methodology:', methodologyCampaignId);

    try {
      // Get current methodology and step data
      const [methodologyResult, stepsResult] = await Promise.all([
        supabase
          .from('automate_methodology_campaigns')
          .select('*')
          .eq('id', methodologyCampaignId)
          .single(),
        supabase
          .from('automate_step_progress')
          .select('*')
          .eq('methodology_campaign_id', methodologyCampaignId)
      ]);

      if (methodologyResult.error) throw methodologyResult.error;
      if (stepsResult.error) throw stepsResult.error;

      const methodology = methodologyResult.data;
      const steps = stepsResult.data || [];

      // Calculate analytics metrics
      const completedSteps = steps.filter(step => step.status === 'completed').length;
      const inProgressSteps = steps.filter(step => step.status === 'in_progress').length;
      const pendingSteps = steps.filter(step => step.status === 'pending').length;

      // Calculate pillar integration scores
      const pillarIntegrationScores = {
        content: steps.reduce((avg, step) => avg + step.content_pillar_weight, 0) / steps.length,
        pr: steps.reduce((avg, step) => avg + step.pr_pillar_weight, 0) / steps.length,
        seo: steps.reduce((avg, step) => avg + step.seo_pillar_weight, 0) / steps.length
      };

      // Calculate velocity score (steps completed per week)
      const startDate = new Date(methodology.started_at);
      const weeksSinceStart = Math.max(1, (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
      const velocityScore = Math.min(100, (completedSteps / weeksSinceStart) * 20);

      // Calculate quality score based on completion percentage and adherence
      const avgCompletionPercentage = steps.reduce((avg, step) => avg + step.completion_percentage, 0) / steps.length;
      const qualityScore = Math.min(100, avgCompletionPercentage * 0.8 + (completedSteps / steps.length) * 20);

      const analyticsData: Partial<AutomateMethodologyAnalytics> = {
        methodology_campaign_id: methodologyCampaignId,
        tenant_id: tenantId,
        analytics_date: new Date().toISOString().split('T')[0],
        period_type: periodType,
        overall_progress_percentage: methodology.overall_completion_percentage,
        steps_completed: completedSteps,
        steps_in_progress: inProgressSteps,
        steps_pending: pendingSteps,
        step_completion_data: steps.reduce((acc, step) => {
          acc[step.step_code] = {
            completion_percentage: step.completion_percentage,
            status: step.status,
            hours_spent: step.actual_hours_spent || 0
          };
          return acc;
        }, {} as any),
        pillar_integration_scores: pillarIntegrationScores,
        velocity_score: Math.round(velocityScore),
        quality_score: Math.round(qualityScore),
        adherence_score: Math.round((completedSteps + inProgressSteps) / steps.length * 100),
        team_engagement_score: Math.round(Math.random() * 20 + 80), // TODO: Calculate from actual engagement data
        business_metrics: {
          steps_on_track: steps.filter(step => !step.blocking_issues?.length).length,
          estimated_completion_date: this.calculateEstimatedCompletion(steps),
          critical_path_items: steps.filter(step => step.priority_level === 'critical').length
        },
        ai_insights: [],
        recommended_focus_areas: this.generateFocusAreas(steps),
        next_best_actions: this.generateNextBestActions(steps)
      };

      const { data, error } = await supabase
        .from('automate_methodology_analytics')
        .insert(analyticsData)
        .select()
        .single();

      if (error) throw error;

      return data as AutomateMethodologyAnalytics;

    } catch (error) {
      console.error('❌ Failed to create analytics snapshot:', error);
      throw error;
    }
  }

  // Helper method to calculate estimated completion
  private calculateEstimatedCompletion(steps: AutomateStepProgress[]): string {
    const remainingSteps = steps.filter(step => step.status !== 'completed');
    const avgHoursPerStep = steps
      .filter(step => step.actual_hours_spent && step.actual_hours_spent > 0)
      .reduce((avg, step) => avg + (step.actual_hours_spent || 0), 0) / 
      steps.filter(step => step.actual_hours_spent && step.actual_hours_spent > 0).length || 20;

    const estimatedRemainingHours = remainingSteps.length * avgHoursPerStep;
    const estimatedDays = Math.ceil(estimatedRemainingHours / 8); // 8 hours per day
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + estimatedDays);

    return completionDate.toISOString().split('T')[0];
  }

  // Helper method to generate focus areas
  private generateFocusAreas(steps: AutomateStepProgress[]): string[] {
    const focusAreas = [];

    // Check for blocked steps
    const blockedSteps = steps.filter(step => step.status === 'blocked');
    if (blockedSteps.length > 0) {
      focusAreas.push(`Resolve ${blockedSteps.length} blocked step(s)`);
    }

    // Check for overdue steps
    const overdueSteps = steps.filter(step => 
      step.target_completion_date && 
      new Date(step.target_completion_date) < new Date() && 
      step.status !== 'completed'
    );
    if (overdueSteps.length > 0) {
      focusAreas.push(`Complete ${overdueSteps.length} overdue step(s)`);
    }

    // Check for low-progress steps
    const lowProgressSteps = steps.filter(step => 
      step.status === 'in_progress' && step.completion_percentage < 25
    );
    if (lowProgressSteps.length > 0) {
      focusAreas.push(`Accelerate progress on ${lowProgressSteps.length} slow step(s)`);
    }

    return focusAreas.length > 0 ? focusAreas : ['Continue with current methodology execution'];
  }

  // Helper method to generate next best actions
  private generateNextBestActions(steps: AutomateStepProgress[]): any[] {
    const actions = [];

    // Next pending step
    const nextPendingStep = steps.find(step => step.status === 'pending');
    if (nextPendingStep) {
      actions.push({
        action: `Start ${nextPendingStep.step_name}`,
        priority: 'high',
        step_code: nextPendingStep.step_code,
        estimated_impact: 'Maintain methodology momentum'
      });
    }

    // In-progress steps needing attention
    const stuckSteps = steps.filter(step => 
      step.status === 'in_progress' && 
      step.started_at &&
      (Date.now() - new Date(step.started_at).getTime()) > (7 * 24 * 60 * 60 * 1000) // 7 days
    );
    
    stuckSteps.forEach(step => {
      actions.push({
        action: `Review progress on ${step.step_name}`,
        priority: 'medium',
        step_code: step.step_code,
        estimated_impact: 'Unblock step progression'
      });
    });

    return actions.slice(0, 3); // Return top 3 actions
  }
}

export const automateMethodologyService = new AutomateMethodologyService();