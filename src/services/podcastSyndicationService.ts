
interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  publishDate: string;
  duration: number;
  pressReleaseId?: string;
}

interface SyndicationPlatform {
  name: string;
  apiEndpoint?: string;
  requiresManualUpload: boolean;
  status: 'connected' | 'pending' | 'error';
}

export class PodcastSyndicationService {
  private platforms: SyndicationPlatform[] = [
    { name: 'Spotify for Podcasters', requiresManualUpload: false, status: 'connected' },
    { name: 'Apple Podcasts', requiresManualUpload: false, status: 'connected' },
    { name: 'Google Podcasts', requiresManualUpload: false, status: 'connected' },
    { name: 'Amazon Music', requiresManualUpload: true, status: 'pending' },
    { name: 'iHeartRadio', requiresManualUpload: true, status: 'connected' },
    { name: 'Stitcher', requiresManualUpload: true, status: 'connected' },
    { name: 'TuneIn', requiresManualUpload: true, status: 'connected' },
    { name: 'Pandora', requiresManualUpload: true, status: 'pending' },
    // Add remaining 26+ platforms
  ];

  async generateRSSFeed(episodes: PodcastEpisode[]): Promise<string> {
    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Hubwire Business Intelligence</title>
    <description>Your source for breaking business news and intelligence</description>
    <link>https://hubwire.com/podcast</link>
    <language>en-us</language>
    <itunes:category text="Business"/>
    <itunes:category text="News"/>
    <itunes:author>Hubwire</itunes:author>
    <itunes:owner>
      <itunes:name>Hubwire</itunes:name>
      <itunes:email>podcast@hubwire.com</itunes:email>
    </itunes:owner>
    <itunes:image href="https://hubwire.com/podcast-cover.jpg"/>
    ${episodes.map(episode => this.generateEpisodeXML(episode)).join('\n')}
  </channel>
</rss>`;

    return rssContent;
  }

  private generateEpisodeXML(episode: PodcastEpisode): string {
    return `
    <item>
      <title>${this.escapeXML(episode.title)}</title>
      <description>${this.escapeXML(episode.description)}</description>
      <pubDate>${new Date(episode.publishDate).toUTCString()}</pubDate>
      <enclosure url="${episode.audioUrl}" type="audio/mpeg"/>
      <itunes:duration>${episode.duration}</itunes:duration>
      <guid>${episode.id}</guid>
    </item>`;
  }

  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async publishEpisode(episode: PodcastEpisode): Promise<{ platform: string; status: string; url?: string }[]> {
    const results = [];
    
    for (const platform of this.platforms) {
      try {
        if (platform.requiresManualUpload) {
          // For manual platforms, we just track the episode for reporting
          results.push({
            platform: platform.name,
            status: 'manual_upload_required',
            url: `https://dashboard.${platform.name.toLowerCase().replace(/\s+/g, '')}.com`
          });
        } else {
          // For automated platforms, we'd make API calls here
          // For now, simulating successful publication
          results.push({
            platform: platform.name,
            status: 'published',
            url: `https://${platform.name.toLowerCase().replace(/\s+/g, '')}.com/hubwire/${episode.id}`
          });
        }
      } catch (error) {
        results.push({
          platform: platform.name,
          status: 'error',
        });
      }
    }
    
    return results;
  }

  getSupportedPlatforms(): SyndicationPlatform[] {
    return this.platforms;
  }

  async getDistributionMetrics(episodeId: string) {
    // Mock metrics - in production, this would aggregate from platform APIs
    return {
      totalDownloads: 1250,
      platformBreakdown: {
        'Spotify': 485,
        'Apple Podcasts': 320,
        'Google Podcasts': 180,
        'Others': 265
      },
      geographicData: {
        'United States': 65,
        'Canada': 12,
        'United Kingdom': 8,
        'Others': 15
      }
    };
  }
}
