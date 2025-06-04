
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useUserTenant } from '@/hooks/useUserData';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useCreateContent } from '@/hooks/useContent';
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
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Plus, FileText, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content_body: z.string().optional(),
  content_type: z.enum(['article', 'social_post', 'video', 'infographic', 'podcast', 'email', 'blog_post']),
  campaign_id: z.string().optional(),
  scheduled_date: z.date().optional(),
  target_platforms: z.array(z.string()).min(1, 'Select at least one platform'),
  ai_optimized: z.boolean().default(false),
  status: z.enum(['draft', 'scheduled', 'published']).default('draft'),
});

type ContentFormData = z.infer<typeof contentSchema>;

const contentTypeOptions = [
  { value: 'article', label: 'Article' },
  { value: 'social_post', label: 'Social Media Post' },
  { value: 'video', label: 'Video' },
  { value: 'infographic', label: 'Infographic' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'email', label: 'Email' },
  { value: 'blog_post', label: 'Blog Post' },
];

const platformOptions = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'blog', label: 'Blog/Website' },
  { value: 'email', label: 'Email Newsletter' },
];

interface CreateContentModalProps {
  onContentCreated?: () => void;
  selectedDate?: Date;
  defaultCampaignId?: string;
}

export function CreateContentModal({ onContentCreated, selectedDate, defaultCampaignId }: CreateContentModalProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { data: userTenant } = useUserTenant();
  const { data: campaigns } = useCampaigns();
  const createContent = useCreateContent();

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: '',
      content_body: '',
      content_type: 'article',
      campaign_id: defaultCampaignId || '',
      scheduled_date: selectedDate,
      target_platforms: ['blog'],
      ai_optimized: false,
      status: 'draft',
    },
  });

  const onSubmit = async (data: ContentFormData) => {
    if (!userTenant?.id || !user?.id) return;

    try {
      await createContent.mutateAsync({
        title: data.title,
        content_body: data.content_body || null,
        content_type: data.content_type,
        campaign_id: data.campaign_id || null,
        scheduled_date: data.scheduled_date?.toISOString() || null,
        target_platforms: data.target_platforms,
        ai_optimized: data.ai_optimized,
        status: data.status,
        created_by: user.id,
        tenant_id: userTenant.id,
      });

      form.reset();
      setOpen(false);
      onContentCreated?.();
    } catch (error) {
      console.error('Error creating content:', error);
    }
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    const currentPlatforms = form.getValues('target_platforms');
    if (checked) {
      form.setValue('target_platforms', [...currentPlatforms, platform]);
    } else {
      form.setValue('target_platforms', currentPlatforms.filter(p => p !== platform));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-enterprise-blue hover:bg-enterprise-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Create New Content
          </DialogTitle>
          <DialogDescription>
            Create engaging content for your marketing campaigns across multiple platforms.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter content title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="content_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contentTypeOptions.map((option) => (
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

                <FormField
                  control={form.control}
                  name="campaign_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select campaign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">No Campaign</SelectItem>
                          {campaigns?.map((campaign) => (
                            <SelectItem key={campaign.id} value={campaign.id}>
                              {campaign.name}
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
                name="content_body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Body</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your content here..."
                        className="resize-none"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="target_platforms"
                render={() => (
                  <FormItem>
                    <FormLabel>Target Platforms *</FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {platformOptions.map((platform) => (
                        <div key={platform.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={platform.value}
                            checked={form.watch('target_platforms').includes(platform.value)}
                            onCheckedChange={(checked) => 
                              handlePlatformChange(platform.value, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={platform.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {platform.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scheduled_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Scheduled Date (Optional)</FormLabel>
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
                                <span>Pick date</span>
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ai_optimized"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center">
                        <Sparkles className="h-4 w-4 mr-1 text-pravado-purple" />
                        AI Optimized Content
                      </FormLabel>
                      <p className="text-xs text-gray-600">
                        Optimize this content using AI for better engagement
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="flex-shrink-0 border-t pt-4 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={createContent.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={createContent.isPending}
          >
            {createContent.isPending ? "Creating..." : "Create Content"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
