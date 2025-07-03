import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, model = 'mistralai/Mixtral-8x7B-Instruct-v0.1', keywords } = await req.json();

    // Validate required parameters
    if (!query) {
      throw new Error('Query parameter is required');
    }

    if (!Deno.env.get('HUGGINGFACE_API_KEY')) {
      throw new Error('HuggingFace API key not configured');
    }

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('HUGGINGFACE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `<|system|>You are a helpful AI assistant analyzing content for citations and mentions.

<|user|>${query}

<|assistant|>`,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          top_k: 50,
          repetition_penalty: 1.1,
          do_sample: true
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HuggingFace API error: ${response.statusText}. ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data) || !data[0]?.generated_text) {
      throw new Error('Invalid response format from HuggingFace API');
    }

    const content = data[0].generated_text;
    
    return new Response(JSON.stringify({
      platform: 'huggingface',
      model,
      query,
      response: content,
      mentions: extractMentions(content, keywords || []),
      sentiment: analyzeSentiment(content),
      confidence: calculateConfidence(content, keywords || []),
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('HuggingFace query error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function extractMentions(content: string, keywords: string[]): string[] {
  if (!keywords.length) return [];
  
  const mentions: string[] = [];
  const lowerContent = content.toLowerCase();
  
  keywords.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerContent.includes(lowerKeyword)) {
      const sentences = content.split(/[.!?]+/);
      sentences.forEach(sentence => {
        if (sentence.toLowerCase().includes(lowerKeyword)) {
          mentions.push(sentence.trim());
        }
      });
    }
  });
  
  return [...new Set(mentions)]; // Remove duplicates
}

function analyzeSentiment(content: string): number {
  const positiveWords = ['excellent', 'great', 'outstanding', 'best', 'amazing', 'perfect', 'love', 'recommend', 'innovative', 'impressive'];
  const negativeWords = ['terrible', 'bad', 'worst', 'awful', 'hate', 'poor', 'disappointing', 'avoid', 'failure', 'useless'];
  
  const lowerContent = content.toLowerCase();
  let score = 0;
  let totalWords = 0;
  
  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) {
      score += matches.length;
      totalWords += matches.length;
    }
  });
  
  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) {
      score -= matches.length;
      totalWords += matches.length;
    }
  });
  
  // Normalize score between -1 and 1
  return totalWords > 0 ? score / totalWords : 0;
}

function calculateConfidence(content: string, keywords: string[]): number {
  if (!keywords.length) return 0.5; // Default confidence for no keywords
  
  const mentionCount = extractMentions(content, keywords).length;
  const contentLength = content.length;
  const keywordDensity = mentionCount / Math.max(contentLength / 100, 1);
  
  // Base confidence starts at 0.5 and is adjusted by keyword density
  const confidence = 0.5 + (keywordDensity * 0.4);
  
  // Ensure confidence is between 0 and 1
  return Math.min(Math.max(confidence, 0), 1);
}
