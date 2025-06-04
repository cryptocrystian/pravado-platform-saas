
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
    const { query, model = 'gpt-4o-mini', keywords } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    return new Response(JSON.stringify({
      platform: 'openai',
      model,
      query,
      response: content,
      mentions: extractMentions(content, keywords),
      sentiment: analyzeSentiment(content, keywords),
      confidence: calculateConfidence(content, keywords),
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('OpenAI query error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function extractMentions(content: string, keywords: string[]): string[] {
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
  
  return mentions;
}

function analyzeSentiment(content: string, keywords: string[]): 'positive' | 'neutral' | 'negative' {
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

function calculateConfidence(content: string, keywords: string[]): number {
  const mentionCount = extractMentions(content, keywords).length;
  const contentLength = content.length;
  const keywordDensity = mentionCount / Math.max(contentLength / 100, 1);
  
  return Math.min(0.5 + (keywordDensity * 0.4), 0.95);
}
