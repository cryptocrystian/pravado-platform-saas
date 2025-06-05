
import { supabase } from '@/integrations/supabase/client';

export interface AIProvider {
  id: string;
  name: string;
  provider_type: 'openai' | 'anthropic' | 'gemini';
  models: Array<{ name: string; max_tokens: number }>;
  capabilities: Record<string, boolean>;
  cost_per_token: number;
  is_active: boolean;
}

export interface BrandVoiceProfile {
  id: string;
  name: string;
  description: string;
  tone_settings: {
    tone: string;
    style: string;
    personality: string;
    complexity: string;
  };
  training_status: 'pending' | 'training' | 'completed' | 'failed';
  performance_score: number;
  usage_count?: number;
}

export interface ContentGenerationRequest {
  prompt: string;
  content_type: 'blog_post' | 'social_post' | 'email' | 'press_release' | 'article';
  ai_provider: string;
  model: string;
  brand_voice_profile_id?: string;
  tone: string;
  industry?: string;
  audience_target?: string;
  seo_keywords?: string[];
  platform_optimization?: string;
  word_count?: number;
  temperature?: number;
}

export interface ContentGenerationResponse {
  content: string;
  provider_used: string;
  model_used: string;
  generation_time_ms: number;
  token_usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  cost_calculation: number;
  suggestions?: string[];
}

// Mock data for AI providers until database is properly configured
const mockAIProviders: AIProvider[] = [
  {
    id: 'openai-gpt4o',
    name: 'OpenAI GPT-4o',
    provider_type: 'openai',
    models: [
      { name: 'gpt-4o', max_tokens: 4096 },
      { name: 'gpt-4o-mini', max_tokens: 4096 }
    ],
    capabilities: {
      content_generation: true,
      code_generation: true,
      analysis: true,
      translation: true
    },
    cost_per_token: 0.00003,
    is_active: true
  },
  {
    id: 'anthropic-claude4',
    name: 'Claude 4 Sonnet',
    provider_type: 'anthropic',
    models: [
      { name: 'claude-sonnet-4-20250514', max_tokens: 8192 },
      { name: 'claude-3-5-sonnet-20241022', max_tokens: 8192 }
    ],
    capabilities: {
      content_generation: true,
      analysis: true,
      reasoning: true,
      creative_writing: true
    },
    cost_per_token: 0.00003,
    is_active: true
  }
];

class AIContentService {
  async getAvailableProviders(userTier: string): Promise<AIProvider[]> {
    try {
      // Use mock data for now since the new tables aren't in the Supabase types yet
      const providers = mockAIProviders;

      // Filter providers based on user tier
      return providers.filter(provider => {
        if (userTier === 'content_only') {
          return provider.provider_type === 'openai';
        }
        if (userTier === 'content_pr') {
          return ['openai', 'anthropic'].includes(provider.provider_type);
        }
        return true; // full_platform and enterprise get all providers
      });
    } catch (error) {
      console.error('Error fetching AI providers:', error);
      return mockAIProviders;
    }
  }

  async getBrandVoiceProfiles(): Promise<BrandVoiceProfile[]> {
    try {
      // Return mock data for now since the new tables aren't in the Supabase types yet
      return [
        {
          id: 'default-voice',
          name: 'Default Brand Voice',
          description: 'Professional, approachable, and data-driven communication style',
          tone_settings: {
            tone: 'professional',
            style: 'data_driven',
            personality: 'approachable',
            complexity: 'college'
          },
          training_status: 'completed',
          performance_score: 0.85,
          usage_count: 15
        }
      ];
    } catch (error) {
      console.error('Error fetching brand voice profiles:', error);
      return [];
    }
  }

  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    try {
      console.log('Generating content with request:', request);
      
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: request
      });

      if (error) {
        throw new Error(`AI content generation error: ${error.message}`);
      }

      // Track usage analytics
      await this.trackUsage(request, data);

      console.log('Content generated successfully');
      return data;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  async streamContent(request: ContentGenerationRequest, onChunk: (chunk: string) => void): Promise<void> {
    try {
      const response = await fetch(`https://jszujkpqbzclmhfffrgt.supabase.co/functions/v1/ai-content-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify(request)
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming content:', error);
      throw error;
    }
  }

  async optimizeForPlatform(content: string, platform: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke('content-platform-optimizer', {
      body: { content, platform }
    });

    if (error) throw error;
    return data.optimized_content;
  }

  async analyzeBrandVoice(sampleContent: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('brand-voice-analyzer', {
      body: { content: sampleContent }
    });

    if (error) throw error;
    return data.analysis;
  }

  async createBrandVoiceProfile(profile: Partial<BrandVoiceProfile>): Promise<BrandVoiceProfile> {
    try {
      // Mock creation for now since the table isn't in the types yet
      const newProfile: BrandVoiceProfile = {
        id: 'new-voice-' + Date.now(),
        name: profile.name || 'New Voice',
        description: profile.description || '',
        tone_settings: profile.tone_settings || {
          tone: 'professional',
          style: 'data_driven',
          personality: 'approachable',
          complexity: 'college'
        },
        training_status: 'pending',
        performance_score: 0,
        usage_count: 0
      };

      console.log('Brand voice profile created:', newProfile);
      return newProfile;
    } catch (error) {
      console.error('Error creating brand voice profile:', error);
      throw error;
    }
  }

  private async trackUsage(request: ContentGenerationRequest, response: ContentGenerationResponse): Promise<void> {
    try {
      const { data: userTenant } = await supabase
        .from('user_profiles')
        .select('tenant_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (userTenant) {
        console.log('Tracking AI usage:', {
          tenant_id: userTenant.tenant_id,
          provider: response.provider_used,
          tokens: response.token_usage.total_tokens,
          cost: response.cost_calculation
        });
        // Mock tracking for now since the table isn't in the types yet
      }
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  }
}

export const aiContentService = new AIContentService();
