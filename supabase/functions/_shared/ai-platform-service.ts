
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
    huggingface: ['meta-llama/Llama-2-70b-chat-hf', 'mistralai/Mistral-7B-Instruct-v0.1']
  };

  async queryPlatform(query: AIQuery): Promise<CitationResult> {
    const model = query.model || this.getDefaultModel(query.platform);
    console.log(`Querying ${query.platform} with model ${model}`);
    
    try {
      let response: string;
      
      switch (query.platform) {
        case 'openai':
          response = await this.queryOpenAI(query.query, model);
          break;
        case 'anthropic':
          response = await this.queryAnthropic(query.query, model);
          break;
        case 'perplexity':
          response = await this.queryPerplexity(query.query, model);
          break;
        case 'gemini':
          response = await this.queryGemini(query.query, model);
          break;
        case 'huggingface':
          response = await this.queryHuggingFace(query.query, model);
          break;
        default:
          throw new Error(`Unsupported platform: ${query.platform}`);
      }

      const mentions = this.findMentions(response, query.keywords);
      
      return {
        platform: query.platform,
        model,
        query: query.query,
        response,
        mentions,
        sentiment: this.analyzeSentiment(response, mentions),
        confidence: mentions.length > 0 ? 0.8 : 0.2,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error querying ${query.platform}:`, error);
      throw error;
    }
  }

  private async queryOpenAI(query: string, model: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'user', content: query }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async queryAnthropic(query: string, model: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1000,
        messages: [
          { role: 'user', content: query }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  }

  private async queryPerplexity(query: string, model: string): Promise<string> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'user', content: query }
        ],
        max_tokens: 1000,
        temperature: 0.2
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async queryGemini(query: string, model: string): Promise<string> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${Deno.env.get('GOOGLE_AI_API_KEY')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: query }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  private async queryHuggingFace(query: string, model: string): Promise<string> {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('HUGGING_FACE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: query,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || '';
  }

  private getDefaultModel(platform: keyof typeof this.models): string {
    return this.models[platform][0];
  }

  private findMentions(response: string, keywords: string[]): string[] {
    const mentions: string[] = [];
    const lowercaseResponse = response.toLowerCase();
    
    for (const keyword of keywords) {
      if (lowercaseResponse.includes(keyword.toLowerCase())) {
        mentions.push(keyword);
      }
    }
    
    return mentions;
  }

  private analyzeSentiment(response: string, mentions: string[]): 'positive' | 'neutral' | 'negative' {
    if (mentions.length === 0) return 'neutral';
    
    const positiveWords = ['excellent', 'great', 'good', 'helpful', 'useful', 'valuable', 'innovative', 'outstanding'];
    const negativeWords = ['poor', 'bad', 'terrible', 'useless', 'ineffective', 'problematic', 'disappointing'];
    
    const lowercaseResponse = response.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (lowercaseResponse.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowercaseResponse.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
}

export const aiPlatformService = new AIPlatformService();
