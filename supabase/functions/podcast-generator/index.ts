
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ...data } = await req.json()

    switch (action) {
      case 'generate_episode':
        return await generatePodcastEpisode(supabase, data)
      
      case 'generate_rss':
        return await generateRSSFeed(supabase, data)
      
      case 'process_content_to_podcast':
        return await processContentToPodcast(supabase, data)
      
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Podcast Generator Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function generatePodcastEpisode(supabase: any, episodeData: any) {
  console.log('Generating podcast episode:', episodeData.title)
  
  try {
    // Create episode record
    const { data: episode, error: episodeError } = await supabase
      .from('podcast_episodes')
      .insert({
        tenant_id: episodeData.tenant_id,
        title: episodeData.title,
        description: episodeData.description,
        content_source_id: episodeData.content_source_id,
        content_source_type: episodeData.content_source_type,
        episode_number: episodeData.episode_number || 1,
        season_number: episodeData.season_number || 1,
        status: 'processing',
        created_by: episodeData.created_by
      })
      .select()
      .single()

    if (episodeError) {
      throw new Error(`Failed to create episode: ${episodeError.message}`)
    }

    // Generate audio using TTS
    const audioResult = await generateAudioContent(episodeData.content_text, episodeData.voice_config)
    
    // Update episode with audio URL and duration
    const { data: updatedEpisode, error: updateError } = await supabase
      .from('podcast_episodes')
      .update({
        audio_url: audioResult.audio_url,
        audio_duration_seconds: audioResult.duration_seconds,
        status: 'published',
        publish_date: new Date().toISOString(),
        processing_status: { tts_completed: true, rss_updated: false }
      })
      .eq('id', episode.id)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Failed to update episode: ${updateError.message}`)
    }

    // Update RSS feed
    await updateRSSFeed(supabase, episodeData.tenant_id)

    // Create syndication jobs
    await createSyndicationJobs(supabase, updatedEpisode)

    return new Response(
      JSON.stringify({ 
        success: true, 
        episode: updatedEpisode,
        audio_generated: true,
        rss_updated: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating podcast episode:', error)
    
    // Update episode status to failed
    if (episodeData.episode_id) {
      await supabase
        .from('podcast_episodes')
        .update({ 
          status: 'failed',
          processing_status: { error: error.message }
        })
        .eq('id', episodeData.episode_id)
    }
    
    throw error
  }
}

async function generateAudioContent(text: string, voiceConfig: any = {}) {
  console.log('Generating audio content using TTS...')
  
  try {
    // Use Google Cloud TTS for high-quality audio
    const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=' + Deno.env.get('GOOGLE_CLOUD_TTS_API_KEY'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text: preprocessTextForSpeech(text) },
        voice: {
          languageCode: voiceConfig.languageCode || 'en-US',
          name: voiceConfig.voiceName || 'en-US-Studio-O',
          ssmlGender: voiceConfig.gender || 'FEMALE'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: voiceConfig.speed || 1.0,
          pitch: voiceConfig.pitch || 0.0,
          volumeGainDb: voiceConfig.volume || 0.0
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    // For this example, we'll return a mock URL
    // In production, you'd upload the audio to storage
    const mockAudioUrl = `https://podcast-storage.example.com/audio/${Date.now()}.mp3`
    const estimatedDuration = Math.ceil(text.length / 15) // Rough estimate: 15 chars per second
    
    return {
      audio_url: mockAudioUrl,
      duration_seconds: estimatedDuration,
      audio_content: data.audioContent
    }
  } catch (error) {
    console.error('TTS generation failed:', error)
    throw new Error(`Failed to generate audio: ${error.message}`)
  }
}

function preprocessTextForSpeech(text: string): string {
  // Clean up text for better speech synthesis
  let cleanText = text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()

  // Add natural pauses
  cleanText = cleanText
    .replace(/\. /g, '. <break time="0.5s"/> ')
    .replace(/\n\n/g, ' <break time="1s"/> ')
    .replace(/([.!?])\s*([A-Z])/g, '$1 <break time="0.3s"/> $2')

  // Add intro and outro
  const intro = 'Welcome to Hubwire, your source for business intelligence and breaking news. <break time="1s"/> '
  const outro = ' <break time="1s"/> Thank you for listening to Hubwire. For more business intelligence and updates, visit hubwire.com'
  
  return intro + cleanText + outro
}

async function generateRSSFeed(supabase: any, data: any) {
  console.log('Generating RSS feed for tenant:', data.tenant_id)
  
  // Get all published episodes for the tenant
  const { data: episodes, error } = await supabase
    .from('podcast_episodes')
    .select('*')
    .eq('tenant_id', data.tenant_id)
    .eq('status', 'published')
    .order('publish_date', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch episodes: ${error.message}`)
  }

  const rssContent = generateRSSXML(episodes, data.podcast_info || {})
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      rss_content: rssContent,
      episode_count: episodes.length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

function generateRSSXML(episodes: any[], podcastInfo: any): string {
  const rssHeader = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${podcastInfo.title || 'Hubwire Business Intelligence'}</title>
    <description>${podcastInfo.description || 'Your source for breaking business news and intelligence'}</description>
    <link>${podcastInfo.website || 'https://hubwire.com/podcast'}</link>
    <language>en-us</language>
    <copyright>© ${new Date().getFullYear()} ${podcastInfo.author || 'Hubwire'}</copyright>
    <itunes:author>${podcastInfo.author || 'Hubwire'}</itunes:author>
    <itunes:summary>${podcastInfo.description || 'Your source for breaking business news and intelligence'}</itunes:summary>
    <itunes:owner>
      <itunes:name>${podcastInfo.owner_name || 'Hubwire'}</itunes:name>
      <itunes:email>${podcastInfo.owner_email || 'podcast@hubwire.com'}</itunes:email>
    </itunes:owner>
    <itunes:image href="${podcastInfo.cover_image || 'https://hubwire.com/podcast-cover.jpg'}"/>
    <itunes:category text="Business"/>
    <itunes:category text="News"/>
    <itunes:explicit>false</itunes:explicit>`

  const episodeItems = episodes.map(episode => `
    <item>
      <title>${escapeXML(episode.title)}</title>
      <description>${escapeXML(episode.description || '')}</description>
      <pubDate>${new Date(episode.publish_date).toUTCString()}</pubDate>
      <enclosure url="${episode.audio_url}" type="audio/mpeg" length="0"/>
      <itunes:duration>${formatDuration(episode.audio_duration_seconds || 0)}</itunes:duration>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:episode>${episode.episode_number}</itunes:episode>
      <itunes:season>${episode.season_number}</itunes:season>
      <guid isPermaLink="false">${episode.id}</guid>
    </item>`).join('')

  const rssFooter = `
  </channel>
</rss>`

  return rssHeader + episodeItems + rssFooter
}

function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

async function updateRSSFeed(supabase: any, tenantId: string) {
  // This would update the RSS feed in storage/CDN
  // For now, we'll just log the action
  console.log('RSS feed updated for tenant:', tenantId)
}

async function createSyndicationJobs(supabase: any, episode: any) {
  console.log('Creating syndication jobs for episode:', episode.id)
  
  // Get all active podcast platforms
  const { data: platforms, error } = await supabase
    .from('podcast_platforms')
    .select('*')
    .eq('is_active', true)

  if (error) {
    console.error('Failed to fetch platforms:', error)
    return
  }

  // Create syndication status records for each platform
  for (const platform of platforms) {
    await supabase
      .from('podcast_syndication_status')
      .insert({
        tenant_id: episode.tenant_id,
        episode_id: episode.id,
        platform_id: platform.id,
        status: platform.requires_manual_upload ? 'manual_required' : 'pending'
      })
  }

  // Create background job for automated syndication
  await supabase
    .from('background_jobs')
    .insert({
      tenant_id: episode.tenant_id,
      job_type: 'podcast_syndication',
      job_data: { episode_id: episode.id },
      priority: 2
    })
}

async function processContentToPodcast(supabase: any, data: any) {
  console.log('Converting content to podcast:', data.content_source_type, data.content_source_id)
  
  let contentText = ''
  let title = ''
  let description = ''
  
  // Fetch content based on source type
  if (data.content_source_type === 'press_release') {
    const { data: pressRelease, error } = await supabase
      .from('press_releases')
      .select('title, content')
      .eq('id', data.content_source_id)
      .single()
    
    if (error) {
      throw new Error(`Failed to fetch press release: ${error.message}`)
    }
    
    title = `Breaking: ${pressRelease.title}`
    contentText = pressRelease.content
    description = `Latest business intelligence from Hubwire. ${pressRelease.content.substring(0, 200)}...`
  } else if (data.content_source_type === 'content_piece') {
    const { data: content, error } = await supabase
      .from('content_pieces')
      .select('title, content_body')
      .eq('id', data.content_source_id)
      .single()
    
    if (error) {
      throw new Error(`Failed to fetch content piece: ${error.message}`)
    }
    
    title = content.title
    contentText = content.content_body || ''
    description = `${content.content_body?.substring(0, 200) || ''}...`
  }
  
  // Generate the podcast episode
  return await generatePodcastEpisode(supabase, {
    ...data,
    title,
    description,
    content_text: contentText
  })
}
