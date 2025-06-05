
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Wand2, Settings, Brain } from 'lucide-react';
import { useAIProviders, useBrandVoiceProfiles, useGenerateContent } from '@/hooks/useAIContent';
import { aiContentService } from '@/services/aiContentService';

const contentGenerationSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  content_type: z.enum(['blog_post', 'social_post', 'email', 'press_release', 'article']),
  ai_provider: z.string().min(1, 'Please select an AI provider'),
  model: z.string().min(1, 'Please select a model'),
  brand_voice_profile_id: z.string().optional(),
  tone: z.string().default('professional'),
  industry: z.string().optional(),
  audience_target: z.string().default('marketing_professionals'),
  seo_keywords: z.string().optional(),
  platform_optimization: z.string().optional(),
  word_count: z.number().min(50).max(5000).default(500),
  temperature: z.number().min(0).max(1).default(0.7),
});

type ContentGenerationFormData = z.infer<typeof contentGenerationSchema>;

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'technical', label: 'Technical' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'educational', label: 'Educational' },
  { value: 'inspirational', label: 'Inspirational' },
];

const audienceOptions = [
  { value: 'c_suite', label: 'C-Suite Executives' },
  { value: 'marketing_professionals', label: 'Marketing Professionals' },
  { value: 'small_business', label: 'Small Business Owners' },
  { value: 'technical', label: 'Technical Professionals' },
  { value: 'general_consumer', label: 'General Consumer' },
];

const platformOptions = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'blog', label: 'Blog/Website' },
  { value: 'email', label: 'Email Newsletter' },
];

interface AIContentGenerationModalProps {
  onContentGenerated?: (content: string) => void;
  trigger?: React.ReactNode;
}

export function AIContentGenerationModal({ onContentGenerated, trigger }: AIContentGenerationModalProps) {
  const [open, setOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');

  const { data: aiProviders = [] } = useAIProviders();
  const { data: brandVoiceProfiles = [] } = useBrandVoiceProfiles();
  const generateContent = useGenerateContent();

  const form = useForm<ContentGenerationFormData>({
    resolver: zodResolver(contentGenerationSchema),
    defaultValues: {
      content_type: 'blog_post',
      tone: 'professional',
      audience_target: 'marketing_professionals',
      word_count: 500,
      temperature: 0.7,
    },
  });

  const selectedProviderData = aiProviders.find(p => p.id === selectedProvider);

  const onSubmit = async (data: ContentGenerationFormData) => {
    try {
      setIsStreaming(true);
      setGeneratedContent('');

      // Convert keywords string to array
      const keywords = data.seo_keywords ? data.seo_keywords.split(',').map(k => k.trim()) : [];

      const request = {
        ...data,
        seo_keywords: keywords,
      };

      // Use streaming for real-time response
      await aiContentService.streamContent(request, (chunk) => {
        setGeneratedContent(prev => prev + chunk);
      });

      setIsStreaming(false);
    } catch (error) {
      console.error('Error generating content:', error);
      setIsStreaming(false);
    }
  };

  const handleUseContent = () => {
    if (generatedContent && onContentGenerated) {
      onContentGenerated(generatedContent);
      setOpen(false);
      setGeneratedContent('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-pravado-purple hover:bg-pravado-purple/90">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Content Generator
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-pravado-purple" />
            AI Content Generation Studio
          </DialogTitle>
          <DialogDescription>
            Create high-quality content using advanced AI with brand voice optimization
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="generate" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="optimize">Optimize</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              <div className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content Prompt *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the content you want to generate..."
                              className="resize-none h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="content_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="blog_post">Blog Post</SelectItem>
                                <SelectItem value="social_post">Social Media</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="press_release">Press Release</SelectItem>
                                <SelectItem value="article">Article</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="word_count"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Word Count</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="ai_provider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI Provider *</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedProvider(value);
                            }} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select AI provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {aiProviders.map((provider) => (
                                <SelectItem key={provider.id} value={provider.id}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{provider.name}</span>
                                    <Badge variant="secondary" className="ml-2">
                                      ${(provider.cost_per_token * 1000).toFixed(4)}/1K tokens
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedProviderData && (
                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select model" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedProviderData.models.map((model) => (
                                  <SelectItem key={model.name} value={model.name}>
                                    {model.name} (max: {model.max_tokens} tokens)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="tone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {toneOptions.map((option) => (
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
                        name="audience_target"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Audience</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {audienceOptions.map((option) => (
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
                      name="brand_voice_profile_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand Voice (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select brand voice" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Default Voice</SelectItem>
                              {brandVoiceProfiles.map((profile) => (
                                <SelectItem key={profile.id} value={profile.id}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{profile.name}</span>
                                    <Badge 
                                      variant={profile.training_status === 'completed' ? 'default' : 'secondary'}
                                      className="ml-2"
                                    >
                                      {profile.training_status}
                                    </Badge>
                                  </div>
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
                      name="seo_keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Keywords (comma-separated)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="marketing automation, AI content, digital marketing"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-pravado-purple hover:bg-pravado-purple/90"
                      disabled={generateContent.isPending || isStreaming}
                    >
                      {isStreaming ? (
                        <>
                          <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Generated Content</h3>
                  {generatedContent && (
                    <Button onClick={handleUseContent} size="sm">
                      Use This Content
                    </Button>
                  )}
                </div>
                
                <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-slate-50">
                  {isStreaming && (
                    <div className="flex items-center text-pravado-purple mb-2">
                      <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                      AI is generating your content...
                    </div>
                  )}
                  
                  {generatedContent ? (
                    <div className="whitespace-pre-wrap text-sm">
                      {generatedContent}
                    </div>
                  ) : !isStreaming ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Generated content will appear here
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="optimize">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Platform Optimization</h3>
              <p className="text-gray-600">
                Optimize your content for different platforms and audiences.
              </p>
              {/* Platform optimization interface would go here */}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI Usage Analytics</h3>
              <p className="text-gray-600">
                Track your AI usage, costs, and performance metrics.
              </p>
              {/* Analytics dashboard would go here */}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
