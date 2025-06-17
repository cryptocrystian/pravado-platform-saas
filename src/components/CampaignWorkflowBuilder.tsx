import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  ArrowRight, 
  ArrowDown,
  MessageSquare, 
  Newspaper, 
  Search, 
  Play,
  Pause,
  Settings,
  Trash2,
  Copy,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'content_creation' | 'pr_outreach' | 'seo_optimization' | 'social_promotion' | 'review' | 'approval';
  pillar: 'content' | 'pr' | 'seo' | 'multi';
  description: string;
  assignee?: string;
  duration_hours: number;
  depends_on: string[];
  auto_execute: boolean;
  conditions?: any[];
}

interface CampaignWorkflow {
  id?: string;
  name: string;
  description: string;
  workflow_type: string;
  steps: WorkflowStep[];
  is_automated: boolean;
  requires_approval: boolean;
  trigger_conditions: any[];
}

interface CampaignWorkflowBuilderProps {
  campaignId: string;
  onWorkflowSave?: (workflow: CampaignWorkflow) => void;
}

const CampaignWorkflowBuilder: React.FC<CampaignWorkflowBuilderProps> = ({
  campaignId,
  onWorkflowSave
}) => {
  const [workflow, setWorkflow] = useState<CampaignWorkflow>({
    name: '',
    description: '',
    workflow_type: 'integrated_launch',
    steps: [],
    is_automated: false,
    requires_approval: true,
    trigger_conditions: []
  });

  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [showStepDialog, setShowStepDialog] = useState(false);

  const workflowTemplates = [
    {
      name: 'Content to PR Pipeline',
      type: 'content_to_pr',
      description: 'Automatically create PR content from published articles',
      steps: [
        {
          id: '1',
          name: 'Content Publication',
          type: 'content_creation' as const,
          pillar: 'content' as const,
          description: 'Publish blog post or article',
          duration_hours: 2,
          depends_on: [],
          auto_execute: false
        },
        {
          id: '2',
          name: 'Generate Press Angle',
          type: 'pr_outreach' as const,
          pillar: 'pr' as const,
          description: 'Create press release angle from content',
          duration_hours: 1,
          depends_on: ['1'],
          auto_execute: true
        },
        {
          id: '3',
          name: 'SEO Content Optimization',
          type: 'seo_optimization' as const,
          pillar: 'seo' as const,
          description: 'Optimize content for search engines',
          duration_hours: 1,
          depends_on: ['1'],
          auto_execute: true
        }
      ]
    },
    {
      name: 'Integrated Launch',
      type: 'integrated_launch',
      description: 'Coordinate product launch across all pillars',
      steps: [
        {
          id: '1',
          name: 'Pre-Launch Content',
          type: 'content_creation' as const,
          pillar: 'content' as const,
          description: 'Create teaser content and landing pages',
          duration_hours: 8,
          depends_on: [],
          auto_execute: false
        },
        {
          id: '2',
          name: 'SEO Preparation',
          type: 'seo_optimization' as const,
          pillar: 'seo' as const,
          description: 'Optimize pages and prepare keyword strategy',
          duration_hours: 4,
          depends_on: ['1'],
          auto_execute: false
        },
        {
          id: '3',
          name: 'Press Release Creation',
          type: 'pr_outreach' as const,
          pillar: 'pr' as const,
          description: 'Draft and approve press release',
          duration_hours: 6,
          depends_on: ['1'],
          auto_execute: false
        },
        {
          id: '4',
          name: 'Coordinated Launch',
          type: 'social_promotion' as const,
          pillar: 'multi' as const,
          description: 'Execute launch across all channels',
          duration_hours: 2,
          depends_on: ['1', '2', '3'],
          auto_execute: false
        }
      ]
    }
  ];

  const stepTypes = [
    { value: 'content_creation', label: 'Content Creation', icon: MessageSquare, pillar: 'content' },
    { value: 'pr_outreach', label: 'PR Outreach', icon: Newspaper, pillar: 'pr' },
    { value: 'seo_optimization', label: 'SEO Optimization', icon: Search, pillar: 'seo' },
    { value: 'social_promotion', label: 'Social Promotion', icon: MessageSquare, pillar: 'multi' },
    { value: 'review', label: 'Review', icon: CheckCircle, pillar: 'multi' },
    { value: 'approval', label: 'Approval', icon: CheckCircle, pillar: 'multi' }
  ];

  const pillarColors = {
    content: 'text-enterprise-blue border-enterprise-blue',
    pr: 'text-pravado-orange border-pravado-orange',
    seo: 'text-pravado-purple border-pravado-purple',
    multi: 'text-gray-600 border-gray-400'
  };

  const handleLoadTemplate = (template: any) => {
    setWorkflow({
      ...workflow,
      name: template.name,
      description: template.description,
      workflow_type: template.type,
      steps: template.steps.map((step: any) => ({
        ...step,
        auto_execute: step.auto_execute || false
      }))
    });
  };

  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      name: '',
      type: 'content_creation',
      pillar: 'content',
      description: '',
      duration_hours: 1,
      depends_on: [],
      auto_execute: false
    };
    setEditingStep(newStep);
    setShowStepDialog(true);
  };

  const handleEditStep = (step: WorkflowStep) => {
    setEditingStep({ ...step });
    setShowStepDialog(true);
  };

  const handleSaveStep = () => {
    if (!editingStep) return;

    const stepIndex = workflow.steps.findIndex(s => s.id === editingStep.id);
    if (stepIndex >= 0) {
      // Update existing step
      const updatedSteps = [...workflow.steps];
      updatedSteps[stepIndex] = editingStep;
      setWorkflow({ ...workflow, steps: updatedSteps });
    } else {
      // Add new step
      setWorkflow({ 
        ...workflow, 
        steps: [...workflow.steps, editingStep] 
      });
    }

    setEditingStep(null);
    setShowStepDialog(false);
  };

  const handleDeleteStep = (stepId: string) => {
    const updatedSteps = workflow.steps.filter(s => s.id !== stepId);
    // Remove dependencies to this step
    const cleanedSteps = updatedSteps.map(step => ({
      ...step,
      depends_on: step.depends_on.filter(dep => dep !== stepId)
    }));
    setWorkflow({ ...workflow, steps: cleanedSteps });
  };

  const handleSaveWorkflow = () => {
    if (!workflow.name.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    if (workflow.steps.length === 0) {
      alert('Please add at least one step');
      return;
    }

    onWorkflowSave?.(workflow);
  };

  const getStepIcon = (type: string) => {
    const stepType = stepTypes.find(st => st.value === type);
    return stepType?.icon || MessageSquare;
  };

  const calculateWorkflowDuration = () => {
    // Simple calculation - sum of all step durations
    return workflow.steps.reduce((total, step) => total + step.duration_hours, 0);
  };

  const getDependentSteps = (stepId: string) => {
    return workflow.steps.filter(step => step.depends_on.includes(stepId));
  };

  return (
    <div className="space-y-6">
      {/* Workflow Info */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Workflow Configuration</h3>
            <div className="flex space-x-2">
              <Select
                value=""
                onValueChange={(value) => {
                  const template = workflowTemplates.find(t => t.type === value);
                  if (template) handleLoadTemplate(template);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Load Template" />
                </SelectTrigger>
                <SelectContent>
                  {workflowTemplates.map(template => (
                    <SelectItem key={template.type} value={template.type}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input
                id="workflow-name"
                value={workflow.name}
                onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                placeholder="My Campaign Workflow"
              />
            </div>
            <div>
              <Label htmlFor="workflow-type">Workflow Type</Label>
              <Select
                value={workflow.workflow_type}
                onValueChange={(value) => setWorkflow({ ...workflow, workflow_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="integrated_launch">Integrated Launch</SelectItem>
                  <SelectItem value="content_to_pr">Content to PR</SelectItem>
                  <SelectItem value="pr_to_seo">PR to SEO</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="workflow-description">Description</Label>
            <Textarea
              id="workflow-description"
              value={workflow.description}
              onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
              placeholder="Describe what this workflow does..."
            />
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={workflow.is_automated}
                onChange={(e) => setWorkflow({ ...workflow, is_automated: e.target.checked })}
              />
              <span className="text-sm">Automated execution</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={workflow.requires_approval}
                onChange={(e) => setWorkflow({ ...workflow, requires_approval: e.target.checked })}
              />
              <span className="text-sm">Requires approval</span>
            </label>
          </div>

          {workflow.steps.length > 0 && (
            <div className="text-sm text-gray-600">
              Total estimated duration: {calculateWorkflowDuration()} hours
            </div>
          )}
        </div>
      </Card>

      {/* Workflow Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Workflow Steps</h3>
          <Button onClick={handleAddStep}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>

        {workflow.steps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No steps defined. Add a step or load a template to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {workflow.steps.map((step, index) => {
              const StepIcon = getStepIcon(step.type);
              const dependentSteps = getDependentSteps(step.id);
              
              return (
                <div key={step.id} className="flex items-start space-x-4">
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-8 h-8 bg-enterprise-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>

                  {/* Step Card */}
                  <Card className={`flex-1 p-4 border-l-4 ${pillarColors[step.pillar]}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <StepIcon className={`h-5 w-5 ${pillarColors[step.pillar].split(' ')[0]}`} />
                        <span className="font-medium">{step.name || 'Untitled Step'}</span>
                        <Badge variant="outline" className="text-xs">
                          {step.pillar}
                        </Badge>
                        {step.auto_execute && (
                          <Badge variant="secondary" className="text-xs">
                            Auto
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditStep(step)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteStep(step.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{step.duration_hours}h</span>
                      </div>
                      {step.depends_on.length > 0 && (
                        <div>
                          Depends on: {step.depends_on.join(', ')}
                        </div>
                      )}
                      {dependentSteps.length > 0 && (
                        <div>
                          Blocks: {dependentSteps.map(s => s.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Arrow to next step */}
                  {index < workflow.steps.length - 1 && (
                    <div className="flex-shrink-0 pt-4">
                      <ArrowDown className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Save Workflow */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSaveWorkflow}>
          Save Workflow
        </Button>
      </div>

      {/* Step Edit Dialog */}
      <Dialog open={showStepDialog} onOpenChange={setShowStepDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingStep?.name ? 'Edit Step' : 'Add New Step'}
            </DialogTitle>
          </DialogHeader>
          
          {editingStep && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="step-name">Step Name</Label>
                <Input
                  id="step-name"
                  value={editingStep.name}
                  onChange={(e) => setEditingStep({ ...editingStep, name: e.target.value })}
                  placeholder="Content Creation"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="step-type">Step Type</Label>
                  <Select
                    value={editingStep.type}
                    onValueChange={(value: any) => {
                      const stepType = stepTypes.find(st => st.value === value);
                      setEditingStep({
                        ...editingStep,
                        type: value,
                        pillar: stepType?.pillar as any || 'content'
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stepTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="step-duration">Duration (hours)</Label>
                  <Input
                    id="step-duration"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={editingStep.duration_hours}
                    onChange={(e) => setEditingStep({ 
                      ...editingStep, 
                      duration_hours: Number(e.target.value) 
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="step-description">Description</Label>
                <Textarea
                  id="step-description"
                  value={editingStep.description}
                  onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
                  placeholder="What does this step do?"
                />
              </div>

              <div>
                <Label htmlFor="step-dependencies">Dependencies</Label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (!editingStep.depends_on.includes(value)) {
                      setEditingStep({
                        ...editingStep,
                        depends_on: [...editingStep.depends_on, value]
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add dependency" />
                  </SelectTrigger>
                  <SelectContent>
                    {workflow.steps
                      .filter(s => s.id !== editingStep.id)
                      .map(step => (
                        <SelectItem key={step.id} value={step.id}>
                          {step.name || `Step ${step.id}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                
                {editingStep.depends_on.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editingStep.depends_on.map(depId => {
                      const depStep = workflow.steps.find(s => s.id === depId);
                      return (
                        <Badge
                          key={depId}
                          variant="secondary"
                          className="text-xs cursor-pointer"
                          onClick={() => setEditingStep({
                            ...editingStep,
                            depends_on: editingStep.depends_on.filter(id => id !== depId)
                          })}
                        >
                          {depStep?.name || depId} ×
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto-execute"
                  checked={editingStep.auto_execute}
                  onChange={(e) => setEditingStep({ 
                    ...editingStep, 
                    auto_execute: e.target.checked 
                  })}
                />
                <Label htmlFor="auto-execute">Auto-execute this step</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowStepDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveStep}>
                  Save Step
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignWorkflowBuilder;