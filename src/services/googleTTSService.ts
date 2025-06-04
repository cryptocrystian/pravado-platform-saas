
import { supabase } from '@/integrations/supabase/client';

interface TTSConfig {
  voiceType: 'male' | 'female';
  speed: number;
  pitch: number;
}

interface AudioSegment {
  text: string;
  voiceConfig?: TTSConfig;
}

export class GoogleTTSService {
  async synthesizeSpeech(text: string, config: TTSConfig = { voiceType: 'female', speed: 1.0, pitch: 0 }): Promise<string> {
    try {
      console.log('Starting TTS synthesis for text:', text.substring(0, 100) + '...');
      
      const { data, error } = await supabase.functions.invoke('google-tts', {
        body: {
          text: this.preprocessText(text),
          voiceConfig: config
        }
      });

      if (error) {
        throw new Error(`TTS synthesis error: ${error.message}`);
      }

      console.log('TTS synthesis completed successfully');
      return data.audioContent;
    } catch (error) {
      console.error('TTS synthesis error:', error);
      throw error;
    }
  }

  private preprocessText(text: string): string {
    // Remove HTML tags and formatting
    let cleanText = text.replace(/<[^>]*>/g, '');
    
    // Fix common abbreviations for better speech
    cleanText = cleanText.replace(/\bDr\./g, 'Doctor');
    cleanText = cleanText.replace(/\bMr\./g, 'Mister');
    cleanText = cleanText.replace(/\bMrs\./g, 'Missus');
    cleanText = cleanText.replace(/\bMs\./g, 'Miss');
    cleanText = cleanText.replace(/\bInc\./g, 'Incorporated');
    cleanText = cleanText.replace(/\bLLC\./g, 'Limited Liability Company');
    
    // Add pauses for better flow
    cleanText = cleanText.replace(/\. /g, '. <break time="0.5s"/> ');
    cleanText = cleanText.replace(/\n\n/g, ' <break time="1s"/> ');
    
    return cleanText;
  }

  async createPodcastEpisode(pressRelease: any): Promise<string> {
    const intro = "Welcome to Hubwire, your source for business intelligence and breaking news.";
    const outro = "Thank you for listening to Hubwire. For more business intelligence and updates, visit hubwire.com";
    
    const segments: AudioSegment[] = [
      { text: intro, voiceConfig: { voiceType: 'female', speed: 0.9, pitch: 0.2 } },
      { text: pressRelease.title, voiceConfig: { voiceType: 'male', speed: 0.8, pitch: 0 } },
      { text: pressRelease.content, voiceConfig: { voiceType: 'female', speed: 1.0, pitch: 0 } },
      { text: outro, voiceConfig: { voiceType: 'female', speed: 0.9, pitch: 0.2 } }
    ];

    // For now, we'll concatenate the text and synthesize as one
    // In production, you'd want to synthesize each segment separately and concatenate audio
    const fullText = segments.map(s => s.text).join(' ');
    
    console.log('Creating podcast episode for:', pressRelease.title);
    return await this.synthesizeSpeech(fullText, { voiceType: 'female', speed: 1.0, pitch: 0 });
  }
}
