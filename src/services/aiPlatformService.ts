
import { supabase } from '@/integrations/supabase/client';

export interface AIQuery {
  query: string;
  platform: 'openai' | 'anthropic' | 'perplexity' | 'gemini' | 'huggingface';
  model?: string;
  keywords: string[];
}

export interface CitationResult {
  platform: string;
  model?: string;
  query: string;
  response: string;
  mentions: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  timestamp: string;
}

class AIPlatformService {
  private readonly models = {
    openai: ['gpt-4o-mini', 'gpt-4o'],
    anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
    perplexity: ['llama-3.1-sonar-small-128k-online', 'llama-3.1-sonar-large-128k-online'],
    gemini: ['gemini-pro', 'gemini-pro-vision'],
    huggingface: ['meta-llama/Llama-2-70b-chat-hf', 'mistralai/Mistral-7B-Instruct-v0.1', 'codellama/CodeLlama-34b-Instruct-hf']
  };

  async queryPlatform(query: AIQuery): Promise<CitationResult> {
    try {
      console.log(`Querying ${query.platform} with: ${query.query}`);
      
      const { data, error } = await supabase.functions.invoke(`query-${query.platform}`, {
        body: {
          query: query.query,
          model: query.model || this.getDefaultModel(query.platform),
          keywords: query.keywords
        }
      });

      if (error) {
        throw new Error(`${query.platform} query error: ${error.message}`);
      }

      console.log(`${query.platform} query completed successfully`);
      return data;
    } catch (error) {
      console.error(`Error querying ${query.platform}:`, error);
      throw error;
    }
  }

  private getDefaultModel(platform: keyof typeof this.models): string {
    return this.models[platform][0];
  }

  async queryAllPlatforms(query: string, keywords: string[]): Promise<CitationResult[]> {
    const platforms = Object.keys(this.models) as Array<keyof typeof this.models>;
    const results: CitationResult[] = [];
    
    console.log('Starting queries across all platforms for:', query);
    
    // Query platforms in parallel for better performance
    const promises = platforms.map(async (platform) => {
      try {
        const result = await this.queryPlatform({
          query,
          platform,
          keywords
        });
        
        if (result.mentions.length > 0) {
          return result;
        }
        return null;
      } catch (error) {
        console.error(`Failed to query ${platform}:`, error);
        return null;
      }
    });

    const platformResults = await Promise.all(promises);
    
    // Filter out null results
    platformResults.forEach(result => {
      if (result) {
        results.push(result);
      }
    });

    console.log(`Completed queries across all platforms. Found ${results.length} results with mentions.`);
    return results;
  }

  getAvailableModels(platform: keyof typeof this.models): string[] {
    return this.models[platform] || [];
  }

  getAllPlatforms(): string[] {
    return Object.keys(this.models);
  }
}

export const aiPlatformService = new AIPlatformService();
