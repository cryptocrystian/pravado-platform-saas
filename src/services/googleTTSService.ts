
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
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async synthesizeSpeech(text: string, config: TTSConfig = { voiceType: 'female', speed: 1.0, pitch: 0 }): Promise<string> {
    const voiceName = config.voiceType === 'male' 
      ? 'en-US-Neural2-D' 
      : 'en-US-Neural2-F';

    try {
      const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text: this.preprocessText(text) },
          voice: {
            languageCode: 'en-US',
            name: voiceName,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: config.speed,
            pitch: config.pitch,
            sampleRateHertz: 24000,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.statusText}`);
      }

      const data = await response.json();
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
    
    return await this.synthesizeSpeech(fullText, { voiceType: 'female', speed: 1.0, pitch: 0 });
  }
}
