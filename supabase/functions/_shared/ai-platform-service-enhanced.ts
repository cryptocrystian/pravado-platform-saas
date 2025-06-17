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

class EnhancedAIPlatformService {
  private readonly models = {
    openai: ['gpt-4o', 'gpt-4o-mini'],
    anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
    perplexity: ['llama-3.1-sonar-large-128k-online', 'llama-3.1-sonar-small-128k-online'],
    gemini: ['gemini-1.5-pro', 'gemini-1.5-flash'],
    huggingface: ['meta-llama/Llama-2-70b-chat-hf', 'mistralai/Mixtral-8x7B-Instruct-v0.1']
  };

  async queryPlatform(query: AIQuery): Promise<CitationResult> {
    const model = query.model || this.getDefaultModel(query.platform);
    console.log(`🤖 Querying ${query.platform.toUpperCase()} with model ${model}`);
    
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
      const sentiment = this.analyzeSentiment(response, mentions);
      const confidence = this.calculateConfidence(response, mentions, sentiment);
      
      console.log(`✅ ${query.platform}: Found ${mentions.length} mentions with ${sentiment} sentiment`);
      
      return {
        platform: query.platform,
        model,
        query: query.query,
        response,
        mentions,
        sentiment,
        confidence,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ Error querying ${query.platform}:`, error);
      throw error;
    }
  }

  async queryAllPlatforms(query: string, keywords: string[]): Promise<CitationResult[]> {
    const platforms = Object.keys(this.models) as Array<keyof typeof this.models>;
    const results: CitationResult[] = [];
    
    console.log('🚀 Starting REAL queries across all AI platforms for:', query);
    
    // Query platforms sequentially to avoid rate limits
    for (const platform of platforms) {
      try {
        console.log(`🔍 Querying ${platform.toUpperCase()}...`);
        
        const result = await this.queryPlatform({
          query,
          platform,
          keywords
        });
        
        // Always return results, even without mentions for transparency
        results.push(result);
        
        // Add delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to query ${platform}:`, error);
        
        // Add error result for transparency
        results.push({
          platform,
          model: this.getDefaultModel(platform),
          query,
          response: `Error: ${error.message}`,
          mentions: [],
          sentiment: 'neutral',
          confidence: 0,
          timestamp: new Date().toISOString()
        });
      }
    }

    const successfulResults = results.filter(r => r.mentions.length > 0);
    console.log(`✅ Completed queries across ${platforms.length} platforms. Found ${successfulResults.length} results with mentions.`);
    return results;
  }

  private async queryOpenAI(query: string, model: string): Promise<string> {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async queryAnthropic(query: string, model: string): Promise<string> {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
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
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  }

  private async queryPerplexity(query: string, model: string): Promise<string> {
    const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!apiKey) {
      throw new Error('Perplexity API key not configured');
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async queryGemini(query: string, model: string): Promise<string> {
    const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      throw new Error('Google AI API key not configured');
    }
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: query }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  private async queryHuggingFace(query: string, model: string): Promise<string> {
    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      throw new Error('HuggingFace API key not configured');
    }

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: query,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HuggingFace API error: ${response.statusText} - ${errorText}`);
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
      const lowercaseKeyword = keyword.toLowerCase();
      
      // Look for exact matches
      if (lowercaseResponse.includes(lowercaseKeyword)) {
        mentions.push(keyword);
        continue;
      }
      
      // Look for partial matches (for brand variations)
      const keywordParts = lowercaseKeyword.split(' ');
      if (keywordParts.length > 1) {
        const allPartsFound = keywordParts.every(part => 
          lowercaseResponse.includes(part)
        );
        if (allPartsFound) {
          mentions.push(keyword);
          continue;
        }
      }
      
      // Look for fuzzy matches (common misspellings)
      if (this.fuzzyMatch(lowercaseResponse, lowercaseKeyword)) {
        mentions.push(keyword);
      }
    }
    
    return mentions;
  }
  
  private fuzzyMatch(text: string, keyword: string): boolean {
    // Simple fuzzy matching for common brand name variations
    const variations = {
      'pravado': ['pravado', 'prevado', 'pravado platform', 'pravado ai'],
      'hubspot': ['hubspot', 'hub spot', 'hubspot crm'],
      'marketo': ['marketo', 'marketo engage'],
      'salesforce': ['salesforce', 'sales force', 'sfdc']
    };
    
    const baseKeyword = keyword.toLowerCase().split(' ')[0];
    const keywordVariations = variations[baseKeyword] || [keyword.toLowerCase()];
    
    return keywordVariations.some(variation => text.includes(variation));
  }

  private analyzeSentiment(response: string, mentions: string[]): 'positive' | 'neutral' | 'negative' {
    if (mentions.length === 0) return 'neutral';
    
    const positiveWords = [
      'excellent', 'great', 'good', 'helpful', 'useful', 'valuable', 'innovative', 
      'outstanding', 'amazing', 'powerful', 'effective', 'robust', 'comprehensive',
      'leading', 'best', 'top', 'superior', 'advanced', 'cutting-edge', 'reliable',
      'user-friendly', 'intuitive', 'efficient', 'streamlined', 'professional'
    ];
    
    const negativeWords = [
      'poor', 'bad', 'terrible', 'useless', 'ineffective', 'problematic', 
      'disappointing', 'awful', 'horrible', 'limited', 'outdated', 'clunky',
      'difficult', 'confusing', 'expensive', 'overpriced', 'lacking', 'insufficient'
    ];
    
    const lowercaseResponse = response.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;
    
    // Weight words based on proximity to mentions
    mentions.forEach(mention => {
      const mentionIndex = lowercaseResponse.indexOf(mention.toLowerCase());
      if (mentionIndex === -1) return;
      
      // Look for sentiment words within 100 characters of the mention
      const contextStart = Math.max(0, mentionIndex - 100);
      const contextEnd = Math.min(lowercaseResponse.length, mentionIndex + mention.length + 100);
      const context = lowercaseResponse.slice(contextStart, contextEnd);
      
      positiveWords.forEach(word => {
        if (context.includes(word)) {
          positiveScore += 1;
        }
      });
      
      negativeWords.forEach(word => {
        if (context.includes(word)) {
          negativeScore += 1;
        }
      });
    });
    
    // Also check for general sentiment in the full response
    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowercaseResponse.match(regex);
      if (matches) positiveScore += matches.length * 0.5;
    });
    
    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowercaseResponse.match(regex);
      if (matches) negativeScore += matches.length * 0.5;
    });
    
    if (positiveScore > negativeScore + 0.5) return 'positive';
    if (negativeScore > positiveScore + 0.5) return 'negative';
    return 'neutral';
  }
  
  private calculateConfidence(response: string, mentions: string[], sentiment: string): number {
    let confidence = 0;
    
    // Base confidence from mentions
    if (mentions.length > 0) {
      confidence += 0.3;
      
      // Additional confidence for multiple mentions
      confidence += Math.min(mentions.length - 1, 3) * 0.1;
    }
    
    // Confidence from response length (longer = more detailed)
    if (response.length > 100) confidence += 0.1;
    if (response.length > 300) confidence += 0.1;
    if (response.length > 500) confidence += 0.1;
    
    // Confidence from sentiment clarity
    if (sentiment !== 'neutral') confidence += 0.15;
    
    // Confidence from specific product/feature mentions
    const productTerms = ['platform', 'solution', 'software', 'tool', 'service', 'feature'];
    const hasProductTerms = productTerms.some(term => 
      response.toLowerCase().includes(term)
    );
    if (hasProductTerms) confidence += 0.1;
    
    // Confidence from comparison context
    const comparisonTerms = ['compare', 'versus', 'alternative', 'better', 'different'];
    const hasComparison = comparisonTerms.some(term => 
      response.toLowerCase().includes(term)
    );
    if (hasComparison) confidence += 0.05;
    
    return Math.min(confidence, 1.0);
  }

  getAvailableModels(platform: keyof typeof this.models): string[] {
    return this.models[platform] || [];
  }

  getAllPlatforms(): string[] {
    return Object.keys(this.models);
  }
}

export const aiPlatformService = new EnhancedAIPlatformService();