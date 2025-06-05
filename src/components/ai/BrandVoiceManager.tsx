
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Plus, Mic, TrendingUp, Settings } from 'lucide-react';
import { useBrandVoiceProfiles, useCreateBrandVoice } from '@/hooks/useAIContent';

const brandVoiceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  sample_content: z.string().min(100, 'Sample content must be at least 100 characters'),
});

type BrandVoiceFormData = z.infer<typeof brandVoiceSchema>;

export function BrandVoiceManager() {
  const [open, setOpen] = useState(false);
  
  const { data: brandVoiceProfiles = [] } = useBrandVoiceProfiles();
  const createBrandVoice = useCreateBrandVoice();

  const form = useForm<BrandVoiceFormData>({
    resolver: zodResolver(brandVoiceSchema),
    defaultValues: {
      name: '',
      description: '',
      sample_content: '',
    },
  });

  const onSubmit = async (data: BrandVoiceFormData) => {
    try {
      await createBrandVoice.mutateAsync({
        ...data,
        tone_settings: {
          tone: 'professional',
          style: 'data_driven',
          personality: 'approachable',
          complexity: 'college'
        },
        training_status: 'pending'
      });
      
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating brand voice:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'training': return 'bg-yellow-500';
      case 'pending': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'completed': return 100;
      case 'training': return 60;
      case 'pending': return 20;
      case 'failed': return 0;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Brand Voice Management</h2>
          <p className="text-gray-600">
            Create and manage AI-powered brand voice profiles for consistent content generation
          </p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pravado-purple hover:bg-pravado-purple/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Brand Voice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Mic className="h-5 w-5 mr-2 text-pravado-purple" />
                Create Brand Voice Profile
              </DialogTitle>
              <DialogDescription>
                Upload sample content to train AI on your brand's unique voice and style
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PRAVADO Official Voice" {...field} />
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
                        <Input placeholder="Brief description of this voice profile" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sample_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sample Content *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste sample content that represents your brand voice (minimum 100 characters)"
                          className="resize-none h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500">
                        {field.value.length}/100 characters minimum
                      </p>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={createBrandVoice.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createBrandVoice.isPending}
                    className="bg-pravado-purple hover:bg-pravado-purple/90"
                  >
                    {createBrandVoice.isPending ? "Creating..." : "Create Profile"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="profiles" className="w-full">
        <TabsList>
          <TabsTrigger value="profiles">Voice Profiles</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-4">
          {brandVoiceProfiles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Brand Voice Profiles</h3>
                <p className="text-gray-600 text-center mb-4">
                  Create your first brand voice profile to get started with AI content generation
                </p>
                <Button 
                  onClick={() => setOpen(true)}
                  className="bg-pravado-purple hover:bg-pravado-purple/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Brand Voice
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brandVoiceProfiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{profile.name}</CardTitle>
                      <Badge 
                        className={`${getStatusColor(profile.training_status)} text-white`}
                      >
                        {profile.training_status}
                      </Badge>
                    </div>
                    <CardDescription>{profile.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Training Progress</span>
                        <span>{getStatusProgress(profile.training_status)}%</span>
                      </div>
                      <Progress value={getStatusProgress(profile.training_status)} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Performance Score</span>
                        <div className="font-semibold">{(profile.performance_score * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Usage Count</span>
                        <div className="font-semibold">{profile.usage_count || 0}</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Brand Voice Performance Analytics</CardTitle>
              <CardDescription>
                Track how your brand voice profiles perform across different content types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Brand Voice Settings</CardTitle>
              <CardDescription>
                Configure global settings for brand voice training and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Settings panel coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
