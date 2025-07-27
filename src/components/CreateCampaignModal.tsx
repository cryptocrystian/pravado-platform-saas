import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserTenant } from '@/hooks/useUserData';
import { useJournalistContacts, useJournalistAIRecommendations } from '@/hooks/useJournalists';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { JournalistCard } from '@/components/pr/JournalistCard';
import { 
  CalendarIcon, 
  Plus, 
  Target, 
  Users, 
  DollarSign, 
  Sparkles, 
  Brain,
  TrendingUp,
  Award,
  Shield,
  Globe,
  Filter,
  Search,
  CheckCircle2,
  Star,
  Clock,
  Zap
} from 'lucide-react';
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
  journalist_targeting: z.object({
    tier_preference: z.array(z.string()).optional(),
    min_relationship_score: z.number().optional(),
    min_authority_score: z.number().optional(),
    media_categories: z.array(z.string()).optional(),
    verification_required: z.boolean().optional(),
    beat_expertise: z.array(z.string()).optional(),
    selected_journalists: z.array(z.string()).optional(),
  }).optional(),
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
  const [selectedJournalists, setSelectedJournalists] = useState<string[]>([]);
  const [journalistFilters, setJournalistFilters] = useState({
    tier_preference: [],
    min_relationship_score: 70,
    min_authority_score: 60,
    media_categories: [],
    verification_required: true,
    beat_expertise: [],
  });
  const [activeJournalistTab, setActiveJournalistTab] = useState('recommendations');
  
  const { user } = useAuth();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  // Get journalist data
  const { data: allJournalists } = useJournalistContacts({
    verificationStatus: journalistFilters.verification_required ? 'verified' : undefined,
    minRelationshipScore: journalistFilters.min_relationship_score,
    minAuthorityScore: journalistFilters.min_authority_score,
    dynamicTier: journalistFilters.tier_preference.length > 0 ? journalistFilters.tier_preference[0] : undefined,
    mediaCategory: journalistFilters.media_categories.length > 0 ? journalistFilters.media_categories[0] : undefined,
    sortBy: 'relationship_score',
    sortOrder: 'desc'
  });

  // Get AI recommendations (simulate with campaign data)
  const { data: aiRecommendations } = useJournalistAIRecommendations();

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
      journalist_targeting: {
        tier_preference: ['platinum', 'gold'],
        min_relationship_score: 70,
        min_authority_score: 60,
        media_categories: [],
        verification_required: true,
        beat_expertise: [],
        selected_journalists: [],
      },
    },
  });

  const watchedAllocations = form.watch(['content_allocation', 'pr_allocation', 'seo_allocation']);
  const totalAllocation = watchedAllocations.reduce((sum, val) => sum + (val || 0), 0);

  const filteredJournalists = useMemo(() => {
    if (!allJournalists) return [];
    return allJournalists.slice(0, 50); // Limit for performance
  }, [allJournalists]);

  const selectedJournalistData = useMemo(() => {
    if (!allJournalists) return [];
    return allJournalists.filter(j => selectedJournalists.includes(j.id));
  }, [allJournalists, selectedJournalists]);

  const campaignStats = useMemo(() => {
    if (selectedJournalistData.length === 0) return null;
    
    const avgRelationshipScore = selectedJournalistData.reduce((sum, j) => sum + (j.relationship_score || 0), 0) / selectedJournalistData.length;
    const avgAuthorityScore = selectedJournalistData.reduce((sum, j) => sum + (j.authority_score || 0), 0) / selectedJournalistData.length;
    const avgSuccessProb = selectedJournalistData.reduce((sum, j) => sum + (j.pitch_success_probability || 0), 0) / selectedJournalistData.length;
    
    const tierDistribution = selectedJournalistData.reduce((acc, j) => {
      const tier = j.dynamic_tier || j.static_tier || 'bronze';
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      avgRelationshipScore: Math.round(avgRelationshipScore),
      avgAuthorityScore: Math.round(avgAuthorityScore),
      avgSuccessProb: Math.round(avgSuccessProb * 100),
      tierDistribution,
      totalReach: selectedJournalistData.length,
      verifiedCount: selectedJournalistData.filter(j => j.verification_status === 'verified').length,
    };
  }, [selectedJournalistData]);

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

  const handleJournalistSelect = (journalistId: string, selected: boolean) => {
    if (selected) {
      setSelectedJournalists(prev => [...prev, journalistId]);
    } else {
      setSelectedJournalists(prev => prev.filter(id => id !== journalistId));
    }
  };

  const applyAIRecommendations = () => {
    if (aiRecommendations) {
      const topRecommendations = aiRecommendations.slice(0, 10).map(j => j.id);
      setSelectedJournalists(topRecommendations);
      setActiveJournalistTab('selected');
    }
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
      // Create campaign
      const { data: campaignData, error: campaignError } = await supabase
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
          ai_intelligence: {
            journalist_targeting: {
              ...journalistFilters,
              selected_journalists: selectedJournalists,
              campaign_stats: campaignStats
            }
          },
          created_by: user.id,
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Create campaign-journalist relationships
      if (selectedJournalists.length > 0) {
        const campaignJournalistRelations = selectedJournalists.map(journalistId => ({
          campaign_id: campaignData.id,
          journalist_id: journalistId,
          tenant_id: userTenant.id,
          status: 'pending',
          predicted_success_rate: selectedJournalistData.find(j => j.id === journalistId)?.pitch_success_probability || 0.5,
          relationship_score_at_selection: selectedJournalistData.find(j => j.id === journalistId)?.relationship_score || 0,
          authority_score_at_selection: selectedJournalistData.find(j => j.id === journalistId)?.authority_score || 0,
        }));

        const { error: relationError } = await supabase
          .from('campaign_journalist_relationships')
          .insert(campaignJournalistRelations);

        if (relationError) {
          console.error('Error creating journalist relationships:', relationError);
          // Don't fail the entire campaign creation for this
        }
      }

      toast({
        title: "Success",
        description: `Campaign created successfully with ${selectedJournalists.length} targeted journalists!`,
      });

      form.reset();
      setMilestones([]);
      setSelectedJournalists([]);
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

  const JournalistTargetingSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">AI Journalist Targeting</h3>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Enhanced
          </Badge>
        </div>
        {campaignStats && (
          <Badge variant="outline" className="text-sm">
            {selectedJournalists.length} journalists selected
          </Badge>
        )}
      </div>

      {/* Campaign Intelligence Preview */}
      {campaignStats && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              Campaign Intelligence Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{campaignStats.avgRelationshipScore}</div>
              <div className="text-xs text-gray-600">Avg Relationship Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{campaignStats.avgAuthorityScore}</div>
              <div className="text-xs text-gray-600">Avg Authority Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{campaignStats.avgSuccessProb}%</div>
              <div className="text-xs text-gray-600">Success Probability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{campaignStats.verifiedCount}</div>
              <div className="text-xs text-gray-600">Verified Contacts</div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeJournalistTab} onValueChange={setActiveJournalistTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations" className="gap-2">
            <Brain className="h-4 w-4" />
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger value="browse" className="gap-2">
            <Search className="h-4 w-4" />
            Browse All
          </TabsTrigger>
          <TabsTrigger value="selected" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Selected ({selectedJournalists.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              AI-powered journalist recommendations based on relationship strength and authority
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={applyAIRecommendations}
              className="gap-2"
            >
              <Zap className="h-4 w-4" />
              Apply Top 10
            </Button>
          </div>
          
          <ScrollArea className="h-80">
            <div className="grid grid-cols-1 gap-3">
              {aiRecommendations?.slice(0, 20).map((journalist) => (
                <div key={journalist.id} className="relative">
                  <Checkbox
                    checked={selectedJournalists.includes(journalist.id)}
                    onCheckedChange={(checked) => handleJournalistSelect(journalist.id, checked as boolean)}
                    className="absolute top-2 left-2 z-10 bg-white"
                  />
                  <div className="ml-8">
                    <JournalistCard
                      journalist={journalist}
                      onContact={() => {}}
                      onViewDetails={() => {}}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        selectedJournalists.includes(journalist.id) && "ring-2 ring-purple-500"
                      )}
                    />
                  </div>
                  {(journalist as any).ai_recommendation_score && (
                    <Badge className="absolute top-2 right-2 bg-purple-100 text-purple-700">
                      AI Score: {Math.round((journalist as any).ai_recommendation_score)}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="browse" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Select
              value={journalistFilters.tier_preference[0] || ''}
              onValueChange={(value) => setJournalistFilters(prev => ({
                ...prev,
                tier_preference: value ? [value] : []
              }))}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tiers</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-1">
              <label className="text-xs text-gray-600">Relationship: {journalistFilters.min_relationship_score}</label>
              <Slider
                value={[journalistFilters.min_relationship_score]}
                onValueChange={([value]) => setJournalistFilters(prev => ({
                  ...prev,
                  min_relationship_score: value
                }))}
                max={100}
                step={5}
                className="h-2"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-600">Authority: {journalistFilters.min_authority_score}</label>
              <Slider
                value={[journalistFilters.min_authority_score]}
                onValueChange={([value]) => setJournalistFilters(prev => ({
                  ...prev,
                  min_authority_score: value
                }))}
                max={100}
                step={5}
                className="h-2"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified-only"
                checked={journalistFilters.verification_required}
                onCheckedChange={(checked) => setJournalistFilters(prev => ({
                  ...prev,
                  verification_required: checked as boolean
                }))}
              />
              <label htmlFor="verified-only" className="text-xs">Verified Only</label>
            </div>
          </div>

          <ScrollArea className="h-80">
            <div className="grid grid-cols-1 gap-3">
              {filteredJournalists.map((journalist) => (
                <div key={journalist.id} className="relative">
                  <Checkbox
                    checked={selectedJournalists.includes(journalist.id)}
                    onCheckedChange={(checked) => handleJournalistSelect(journalist.id, checked as boolean)}
                    className="absolute top-2 left-2 z-10 bg-white"
                  />
                  <div className="ml-8">
                    <JournalistCard
                      journalist={journalist}
                      onContact={() => {}}
                      onViewDetails={() => {}}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        selectedJournalists.includes(journalist.id) && "ring-2 ring-purple-500"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="selected" className="space-y-4">
          {selectedJournalists.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No journalists selected</h4>
              <p className="text-gray-600">Use AI Recommendations or Browse to select journalists for your campaign.</p>
            </div>
          ) : (
            <ScrollArea className="h-80">
              <div className="grid grid-cols-1 gap-3">
                {selectedJournalistData.map((journalist) => (
                  <div key={journalist.id} className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleJournalistSelect(journalist.id, false)}
                      className="absolute top-2 right-2 z-10 h-6 w-6 p-0 bg-white hover:bg-red-50"
                    >
                      ×
                    </Button>
                    <JournalistCard
                      journalist={journalist}
                      onContact={() => {}}
                      onViewDetails={() => {}}
                      className="ring-2 ring-purple-500"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-enterprise-blue hover:bg-enterprise-blue/90 gap-2">
          <Plus className="h-4 w-4" />
          Create AI Campaign
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 ml-1">
            <Sparkles className="h-3 w-3 mr-1" />
            Enhanced
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2">
            Create AI-Enhanced Campaign
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Brain className="h-3 w-3 mr-1" />
              Phase B: Journalist Intelligence
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Create campaigns with AI-powered journalist targeting and relationship intelligence for maximum impact.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-professional-gray flex items-center">
                  <Target className="h-5 w-5 mr-2 text-enterprise-blue" />
                  Campaign Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* AI Journalist Targeting Section */}
              <Separator />
              <JournalistTargetingSection />

              {/* Budget & Allocation */}
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-professional-gray flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-pravado-orange" />
                  Budget & Allocation
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Goals & Timeline */}
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-professional-gray flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-pravado-purple" />
                  Goals & Timeline
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    name="target_audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your target audience"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="flex-shrink-0 border-t pt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedJournalists.length > 0 && (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                {selectedJournalists.length} journalists targeted
                {campaignStats && (
                  <span className="text-purple-600 font-medium">
                    • {campaignStats.avgSuccessProb}% predicted success rate
                  </span>
                )}
              </span>
            )}
          </div>
          <div className="flex space-x-3">
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
              className="gap-2"
            >
              {isLoading ? "Creating..." : "Create AI Campaign"}
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}