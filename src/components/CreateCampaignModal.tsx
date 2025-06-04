
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserTenant } from '@/hooks/useUserData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { CalendarIcon, Plus, Target, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().optional(),
  campaign_type: z.enum(['content_only', 'pr_only', 'seo_only', 'content_pr', 'content_seo', 'pr_seo', 'integrated']),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  budget: z.string().optional(),
  goals: z.string().optional(),
  target_audience: z.string().optional(),
  roi_target: z.string().optional(),
  content_allocation: z.number().min(0).max(100),
  pr_allocation: z.number().min(0).max(100),
  seo_allocation: z.number().min(0).max(100),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

const campaignTypeOptions = [
  { value: 'content_only', label: 'Content Only' },
  { value: 'pr_only', label: 'PR Only' },
  { value: 'seo_only', label: 'SEO Only' },
  { value: 'content_pr', label: 'Content + PR' },
  { value: 'content_seo', label: 'Content + SEO' },
  { value: 'pr_seo', label: 'PR + SEO' },
  { value: 'integrated', label: 'Integrated (All Pillars)' },
];

interface CreateCampaignModalProps {
  onCampaignCreated?: () => void;
}

export function CreateCampaignModal({ onCampaignCreated }: CreateCampaignModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [milestones, setMilestones] = useState<Array<{title: string, date: Date | undefined, description: string}>>([]);
  const { user } = useAuth();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      description: '',
      campaign_type: 'content_only',
      budget: '',
      goals: '',
      target_audience: '',
      roi_target: '',
      content_allocation: 40,
      pr_allocation: 30,
      seo_allocation: 30,
    },
  });

  const watchedAllocations = form.watch(['content_allocation', 'pr_allocation', 'seo_allocation']);
  const totalAllocation = watchedAllocations.reduce((sum, val) => sum + (val || 0), 0);

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', date: undefined, description: '' }]);
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CampaignFormData) => {
    if (!userTenant?.id || !user?.id) {
      toast({
        title: "Error",
        description: "User authentication required",
        variant: "destructive",
      });
      return;
    }

    if (totalAllocation !== 100) {
      toast({
        title: "Error",
        description: "Budget allocation must total 100%",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('campaigns')
        .insert({
          tenant_id: userTenant.id,
          name: data.name,
          description: data.description || null,
          campaign_type: data.campaign_type,
          start_date: data.start_date?.toISOString() || null,
          end_date: data.end_date?.toISOString() || null,
          budget: data.budget ? parseFloat(data.budget) : null,
          goals: data.goals ? { description: data.goals, roi_target: data.roi_target } : {},
          target_audience: data.target_audience ? { description: data.target_audience } : {},
          budget_allocation: {
            content: data.content_allocation,
            pr: data.pr_allocation,
            seo: data.seo_allocation
          },
          milestones: milestones.filter(m => m.title && m.date).map(m => ({
            title: m.title,
            date: m.date?.toISOString(),
            description: m.description,
            completed: false
          })),
          created_by: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign created successfully!",
      });

      form.reset();
      setMilestones([]);
      setOpen(false);
      onCampaignCreated?.();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-enterprise-blue hover:bg-enterprise-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Set up a comprehensive marketing campaign with budget allocation and milestone planning.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-professional-gray flex items-center">
                  <Target className="h-5 w-5 mr-2 text-enterprise-blue" />
                  Campaign Details
                </h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter campaign name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your campaign objectives and approach"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="campaign_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select campaign type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {campaignTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Budget & Allocation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-professional-gray flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-pravado-orange" />
                  Budget & Allocation
                </h3>
                
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Budget ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          step="0.01"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="content_allocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Marketing: {field.value}%</FormLabel>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pr_allocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Public Relations: {field.value}%</FormLabel>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="seo_allocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Intelligence: {field.value}%</FormLabel>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className={`text-sm font-medium ${totalAllocation === 100 ? 'text-green-600' : 'text-red-600'}`}>
                  Total Allocation: {totalAllocation}% {totalAllocation !== 100 && '(Must equal 100%)'}
                </div>
              </div>

              {/* Timeline & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick start date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick end date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Goals & ROI */}
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goals & Objectives</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What are the key objectives for this campaign?"
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="target_audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your target audience"
                          className="resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roi_target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ROI Target (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="15" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Milestones */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-professional-gray flex items-center">
                    <Target className="h-5 w-5 mr-2 text-pravado-purple" />
                    Milestones
                  </h3>
                  <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </div>
                
                {milestones.map((milestone, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        placeholder="Milestone title"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                        className="flex-1 mr-2"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeMilestone(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !milestone.date && "text-muted-foreground"
                            )}
                          >
                            {milestone.date ? (
                              format(milestone.date, "PPP")
                            ) : (
                              <span>Pick date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={milestone.date}
                            onSelect={(date) => updateMilestone(index, 'date', date)}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        placeholder="Description"
                        value={milestone.description}
                        onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </Form>
        </div>

        <div className="flex-shrink-0 border-t pt-4 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isLoading || totalAllocation !== 100}
          >
            {isLoading ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
