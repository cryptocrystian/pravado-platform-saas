
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
    const { text, voiceConfig = { voiceType: 'female', speed: 1.0, pitch: 0 } } = await req.json();
    
    if (!text) {
      throw new Error('Text is required');
    }

    const voiceName = voiceConfig.voiceType === 'male' 
      ? 'en-US-Neural2-D' 
      : 'en-US-Neural2-F';

    const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GOOGLE_CLOUD_TTS_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: 'en-US',
          name: voiceName,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: voiceConfig.speed,
          pitch: voiceConfig.pitch,
          sampleRateHertz: 24000,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Google TTS API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({ audioContent: data.audioContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('TTS synthesis error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
