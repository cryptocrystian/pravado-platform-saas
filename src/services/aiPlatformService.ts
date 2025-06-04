
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
  private readonly endpoints = {
    openai: 'https://api.openai.com/v1/chat/completions',
    anthropic: 'https://api.anthropic.com/v1/messages',
    perplexity: 'https://api.perplexity.ai/chat/completions',
    gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    huggingface: 'https://api-inference.huggingface.co/models'
  };

  private readonly models = {
    openai: ['gpt-4o-mini', 'gpt-4o'],
    anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
    perplexity: ['llama-3.1-sonar-small-128k-online', 'llama-3.1-sonar-large-128k-online'],
    gemini: ['gemini-pro', 'gemini-pro-vision'],
    huggingface: ['meta-llama/Llama-2-70b-chat-hf', 'mistralai/Mistral-7B-Instruct-v0.1', 'codellama/CodeLlama-34b-Instruct-hf']
  };

  async queryPlatform(query: AIQuery): Promise<CitationResult> {
    try {
      switch (query.platform) {
        case 'openai':
          return await this.queryOpenAI(query);
        case 'anthropic':
          return await this.queryAnthropic(query);
        case 'perplexity':
          return await this.queryPerplexity(query);
        case 'gemini':
          return await this.queryGemini(query);
        case 'huggingface':
          return await this.queryHuggingFace(query);
        default:
          throw new Error(`Unsupported platform: ${query.platform}`);
      }
    } catch (error) {
      console.error(`Error querying ${query.platform}:`, error);
      throw error;
    }
  }

  private async queryOpenAI(query: AIQuery): Promise<CitationResult> {
    const response = await fetch('/api/ai-platforms/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: query.model || 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: query.query
          }
        ]
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    return {
      platform: 'openai',
      model: query.model || 'gpt-4o-mini',
      query: query.query,
      response: content,
      mentions: this.extractMentions(content, query.keywords),
      sentiment: this.analyzeSentiment(content, query.keywords),
      confidence: this.calculateConfidence(content, query.keywords),
      timestamp: new Date().toISOString()
    };
  }

  private async queryAnthropic(query: AIQuery): Promise<CitationResult> {
    const response = await fetch('/api/ai-platforms/anthropic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: query.model || 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'user',
            content: query.query
          }
        ]
      })
    });

    const data = await response.json();
    const content = data.content[0].text;
    
    return {
      platform: 'anthropic',
      model: query.model || 'claude-3-5-sonnet-20241022',
      query: query.query,
      response: content,
      mentions: this.extractMentions(content, query.keywords),
      sentiment: this.analyzeSentiment(content, query.keywords),
      confidence: this.calculateConfidence(content, query.keywords),
      timestamp: new Date().toISOString()
    };
  }

  private async queryPerplexity(query: AIQuery): Promise<CitationResult> {
    const response = await fetch('/api/ai-platforms/perplexity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: query.model || 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: query.query
          }
        ]
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    return {
      platform: 'perplexity',
      model: query.model || 'llama-3.1-sonar-small-128k-online',
      query: query.query,
      response: content,
      mentions: this.extractMentions(content, query.keywords),
      sentiment: this.analyzeSentiment(content, query.keywords),
      confidence: this.calculateConfidence(content, query.keywords),
      timestamp: new Date().toISOString()
    };
  }

  private async queryGemini(query: AIQuery): Promise<CitationResult> {
    const response = await fetch('/api/ai-platforms/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: query.query
          }]
        }]
      })
    });

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    return {
      platform: 'gemini',
      model: query.model || 'gemini-pro',
      query: query.query,
      response: content,
      mentions: this.extractMentions(content, query.keywords),
      sentiment: this.analyzeSentiment(content, query.keywords),
      confidence: this.calculateConfidence(content, query.keywords),
      timestamp: new Date().toISOString()
    };
  }

  private async queryHuggingFace(query: AIQuery): Promise<CitationResult> {
    const model = query.model || 'meta-llama/Llama-2-70b-chat-hf';
    const response = await fetch('/api/ai-platforms/huggingface', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        inputs: query.query,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7
        }
      })
    });

    const data = await response.json();
    const content = data[0].generated_text;
    
    return {
      platform: 'huggingface',
      model,
      query: query.query,
      response: content,
      mentions: this.extractMentions(content, query.keywords),
      sentiment: this.analyzeSentiment(content, query.keywords),
      confidence: this.calculateConfidence(content, query.keywords),
      timestamp: new Date().toISOString()
    };
  }

  private extractMentions(content: string, keywords: string[]): string[] {
    const mentions: string[] = [];
    const lowerContent = content.toLowerCase();
    
    keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      if (lowerContent.includes(lowerKeyword)) {
        // Extract sentences containing the keyword
        const sentences = content.split(/[.!?]+/);
        sentences.forEach(sentence => {
          if (sentence.toLowerCase().includes(lowerKeyword)) {
            mentions.push(sentence.trim());
          }
        });
      }
    });
    
    return mentions;
  }

  private analyzeSentiment(content: string, keywords: string[]): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['excellent', 'great', 'outstanding', 'best', 'amazing', 'perfect', 'love', 'recommend'];
    const negativeWords = ['terrible', 'bad', 'worst', 'awful', 'hate', 'poor', 'disappointing', 'avoid'];
    
    const lowerContent = content.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveWords.forEach(word => {
      if (lowerContent.includes(word)) positiveScore++;
    });
    
    negativeWords.forEach(word => {
      if (lowerContent.includes(word)) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  private calculateConfidence(content: string, keywords: string[]): number {
    const mentionCount = this.extractMentions(content, keywords).length;
    const contentLength = content.length;
    const keywordDensity = mentionCount / Math.max(contentLength / 100, 1);
    
    // Confidence based on mention frequency and context
    return Math.min(0.5 + (keywordDensity * 0.4), 0.95);
  }

  async queryAllPlatforms(query: string, keywords: string[]): Promise<CitationResult[]> {
    const platforms = Object.keys(this.endpoints) as Array<keyof typeof this.endpoints>;
    const results: CitationResult[] = [];
    
    for (const platform of platforms) {
      try {
        const result = await this.queryPlatform({
          query,
          platform,
          keywords
        });
        
        if (result.mentions.length > 0) {
          results.push(result);
        }
      } catch (error) {
        console.error(`Failed to query ${platform}:`, error);
      }
    }
    
    return results;
  }

  getAvailableModels(platform: keyof typeof this.models): string[] {
    return this.models[platform] || [];
  }

  getAllPlatforms(): string[] {
    return Object.keys(this.endpoints);
  }
}

export const aiPlatformService = new AIPlatformService();
