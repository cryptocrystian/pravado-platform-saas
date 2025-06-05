
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentGenerationRequest {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: ContentGenerationRequest = await req.json();
    console.log('AI content generation request:', request);

    // Determine which AI provider to use
    let response;
    const startTime = Date.now();

    if (request.ai_provider === 'openai') {
      response = await generateWithOpenAI(request);
    } else if (request.ai_provider === 'anthropic') {
      response = await generateWithClaude(request);
    } else if (request.ai_provider === 'gemini') {
      response = await generateWithGemini(request);
    } else {
      throw new Error(`Unsupported AI provider: ${request.ai_provider}`);
    }

    const generationTime = Date.now() - startTime;

    const result = {
      content: response.content,
      provider_used: request.ai_provider,
      model_used: request.model,
      generation_time_ms: generationTime,
      token_usage: response.token_usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      cost_calculation: calculateCost(response.token_usage, request.ai_provider),
      suggestions: response.suggestions || []
    };

    console.log('Content generated successfully');
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-content-generator:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generateWithOpenAI(request: ContentGenerationRequest) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = buildSystemPrompt(request);
  const userPrompt = buildUserPrompt(request);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: request.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: Math.min(request.word_count ? request.word_count * 2 : 1000, 4000),
      temperature: request.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0].message.content,
    token_usage: data.usage,
    suggestions: []
  };
}

async function generateWithClaude(request: ContentGenerationRequest) {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  const systemPrompt = buildSystemPrompt(request);
  const userPrompt = buildUserPrompt(request);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: request.model || 'claude-3-5-sonnet-20241022',
      max_tokens: Math.min(request.word_count ? request.word_count * 2 : 1000, 4000),
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ],
      temperature: request.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    content: data.content[0].text,
    token_usage: {
      prompt_tokens: data.usage?.input_tokens || 0,
      completion_tokens: data.usage?.output_tokens || 0,
      total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
    },
    suggestions: []
  };
}

async function generateWithGemini(request: ContentGenerationRequest) {
  const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
  if (!GOOGLE_AI_API_KEY) {
    throw new Error('Google AI API key not configured');
  }

  const systemPrompt = buildSystemPrompt(request);
  const userPrompt = buildUserPrompt(request);
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${request.model || 'gemini-pro'}:generateContent?key=${GOOGLE_AI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        maxOutputTokens: Math.min(request.word_count ? request.word_count * 2 : 1000, 2048),
        temperature: request.temperature || 0.7
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    content: data.candidates[0].content.parts[0].text,
    token_usage: {
      prompt_tokens: 0, // Gemini doesn't provide token counts
      completion_tokens: 0,
      total_tokens: 0
    },
    suggestions: []
  };
}

function buildSystemPrompt(request: ContentGenerationRequest): string {
  let prompt = `You are an expert content creator specializing in ${request.content_type.replace('_', ' ')} creation. `;
  
  prompt += `Your writing style should be ${request.tone} and tailored for ${request.audience_target}. `;
  
  if (request.industry) {
    prompt += `Focus on the ${request.industry} industry. `;
  }
  
  if (request.brand_voice_profile_id) {
    prompt += `Follow the established brand voice guidelines for consistency. `;
  }
  
  prompt += `Create engaging, high-quality content that provides value to the reader. `;
  
  if (request.seo_keywords && request.seo_keywords.length > 0) {
    prompt += `Naturally incorporate these SEO keywords: ${request.seo_keywords.join(', ')}. `;
  }
  
  if (request.platform_optimization) {
    prompt += `Optimize the content for ${request.platform_optimization}. `;
  }
  
  return prompt;
}

function buildUserPrompt(request: ContentGenerationRequest): string {
  let prompt = request.prompt;
  
  if (request.word_count) {
    prompt += ` Target approximately ${request.word_count} words.`;
  }
  
  return prompt;
}

function calculateCost(tokenUsage: any, provider: string): number {
  if (!tokenUsage) return 0;
  
  const costs = {
    'openai': 0.00003, // per token
    'anthropic': 0.00003,
    'gemini': 0.00001
  };
  
  const costPerToken = costs[provider as keyof typeof costs] || 0;
  return tokenUsage.total_tokens * costPerToken;
}
