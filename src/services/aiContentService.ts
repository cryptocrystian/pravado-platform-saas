
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

class AIContentService {
  async getAvailableProviders(userTier: string): Promise<AIProvider[]> {
    const { data, error } = await supabase
      .from('ai_providers')
      .select('*')
      .eq('is_active', true)
      .order('priority_order');

    if (error) throw error;

    // Filter providers based on user tier
    return data.filter(provider => {
      if (userTier === 'content_only') {
        return provider.provider_type === 'openai';
      }
      if (userTier === 'content_pr') {
        return ['openai', 'anthropic'].includes(provider.provider_type);
      }
      return true; // full_platform and enterprise get all providers
    });
  }

  async getBrandVoiceProfiles(): Promise<BrandVoiceProfile[]> {
    const { data, error } = await supabase
      .from('brand_voice_profiles')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
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
    const { data, error } = await supabase
      .from('brand_voice_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private async trackUsage(request: ContentGenerationRequest, response: ContentGenerationResponse): Promise<void> {
    try {
      const { data: userTenant } = await supabase
        .from('user_profiles')
        .select('tenant_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (userTenant) {
        await supabase.from('ai_usage_tracking').insert({
          tenant_id: userTenant.tenant_id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          subscription_tier: 'full_platform', // This should come from user profile
          ai_provider: response.provider_used,
          model_used: response.model_used,
          feature_used: 'content_generation',
          tokens_consumed: response.token_usage.total_tokens,
          cost_incurred: response.cost_calculation,
          response_time_ms: response.generation_time_ms,
          success: true
        });
      }
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  }
}

export const aiContentService = new AIContentService();
