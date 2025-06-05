
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
    const request = await req.json();
    console.log('AI streaming request:', request);

    // Create a readable stream for Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (request.ai_provider === 'openai') {
            await streamOpenAI(request, controller);
          } else if (request.ai_provider === 'anthropic') {
            await streamClaude(request, controller);
          } else {
            throw new Error(`Streaming not supported for ${request.ai_provider}`);
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        } finally {
          controller.enqueue('data: [DONE]\n\n');
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in ai-content-stream:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function streamOpenAI(request: any, controller: ReadableStreamDefaultController) {
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
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

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
          const content = parsed.choices?.[0]?.delta?.content;
          
          if (content) {
            controller.enqueue(`data: ${JSON.stringify({ content })}\n\n`);
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }
}

async function streamClaude(request: any, controller: ReadableStreamDefaultController) {
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
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

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
          
          if (parsed.type === 'content_block_delta') {
            const content = parsed.delta?.text;
            if (content) {
              controller.enqueue(`data: ${JSON.stringify({ content })}\n\n`);
            }
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }
}

function buildSystemPrompt(request: any): string {
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

function buildUserPrompt(request: any): string {
  let prompt = request.prompt;
  
  if (request.word_count) {
    prompt += ` Target approximately ${request.word_count} words.`;
  }
  
  return prompt;
}
