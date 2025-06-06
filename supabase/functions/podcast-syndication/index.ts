
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
      case 'syndicate_episode':
        return await syndicateEpisode(supabase, data)
      
      case 'syndicate_all_pending':
        return await syndicateAllPending(supabase)
      
      case 'check_syndication_status':
        return await checkSyndicationStatus(supabase, data)
      
      case 'retry_failed_syndications':
        return await retryFailedSyndications(supabase, data)
      
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Podcast Syndication Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function syndicateEpisode(supabase: any, data: any) {
  console.log('Starting syndication for episode:', data.episode_id)
  
  // Get episode details
  const { data: episode, error: episodeError } = await supabase
    .from('podcast_episodes')
    .select('*')
    .eq('id', data.episode_id)
    .single()

  if (episodeError) {
    throw new Error(`Failed to fetch episode: ${episodeError.message}`)
  }

  // Get pending syndications for this episode
  const { data: syndications, error: syndicationError } = await supabase
    .from('podcast_syndication_status')
    .select(`
      *,
      podcast_platforms (
        name,
        api_endpoint,
        requires_manual_upload,
        platform_specific_config
      )
    `)
    .eq('episode_id', data.episode_id)
    .in('status', ['pending', 'failed'])

  if (syndicationError) {
    throw new Error(`Failed to fetch syndications: ${syndicationError.message}`)
  }

  const results = []
  
  for (const syndication of syndications) {
    const platform = syndication.podcast_platforms
    
    try {
      console.log(`Syndicating to ${platform.name}...`)
      
      if (platform.requires_manual_upload) {
        // For manual platforms, just update status and provide instructions
        const result = await handleManualSyndication(supabase, syndication, episode)
        results.push(result)
      } else {
        // For automated platforms, attempt API submission
        const result = await handleAutomatedSyndication(supabase, syndication, episode, platform)
        results.push(result)
      }
    } catch (error) {
      console.error(`Failed to syndicate to ${platform.name}:`, error)
      
      // Update syndication status to failed
      await supabase
        .from('podcast_syndication_status')
        .update({
          status: 'failed',
          error_message: error.message,
          retry_count: syndication.retry_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', syndication.id)
      
      results.push({
        platform: platform.name,
        status: 'failed',
        error: error.message
      })
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      episode_id: data.episode_id,
      syndication_results: results,
      total_platforms: results.length,
      successful_submissions: results.filter(r => r.status === 'submitted' || r.status === 'manual_ready').length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleManualSyndication(supabase: any, syndication: any, episode: any) {
  console.log(`Preparing manual syndication for ${syndication.podcast_platforms.name}`)
  
  // Generate submission package
  const submissionPackage = {
    episode_title: episode.title,
    episode_description: episode.description,
    audio_url: episode.audio_url,
    duration: episode.audio_duration_seconds,
    publish_date: episode.publish_date,
    episode_number: episode.episode_number,
    season_number: episode.season_number,
    submission_instructions: `Please manually submit this episode to ${syndication.podcast_platforms.name}`,
    platform_url: syndication.podcast_platforms.platform_specific_config?.manual_submission_url
  }
  
  // Update syndication status
  await supabase
    .from('podcast_syndication_status')
    .update({
      status: 'manual_required',
      metadata: { submission_package: submissionPackage },
      updated_at: new Date().toISOString()
    })
    .eq('id', syndication.id)
  
  return {
    platform: syndication.podcast_platforms.name,
    status: 'manual_ready',
    submission_package: submissionPackage
  }
}

async function handleAutomatedSyndication(supabase: any, syndication: any, episode: any, platform: any) {
  console.log(`Attempting automated syndication to ${platform.name}`)
  
  let result
  
  switch (platform.name.toLowerCase()) {
    case 'spotify for podcasters':
      result = await syndicateToSpotify(episode, platform)
      break
    case 'apple podcasts':
      result = await syndicateToApple(episode, platform)
      break
    case 'google podcasts':
      result = await syndicateToGoogle(episode, platform)
      break
    default:
      // Generic RSS-based syndication
      result = await syndicateViaRSS(episode, platform)
  }
  
  // Update syndication status
  await supabase
    .from('podcast_syndication_status')
    .update({
      status: result.status,
      platform_episode_id: result.platform_episode_id,
      platform_url: result.platform_url,
      submission_date: new Date().toISOString(),
      published_date: result.published_date,
      metadata: result.metadata,
      updated_at: new Date().toISOString()
    })
    .eq('id', syndication.id)
  
  return {
    platform: platform.name,
    ...result
  }
}

async function syndicateToSpotify(episode: any, platform: any) {
  // Spotify for Podcasters API integration would go here
  // For now, simulate successful submission
  console.log('Submitting to Spotify for Podcasters...')
  
  // In production, you'd use Spotify's Podcast API
  return {
    status: 'submitted',
    platform_episode_id: `spotify_${Date.now()}`,
    platform_url: `https://open.spotify.com/episode/${Date.now()}`,
    metadata: { submission_method: 'api', api_version: 'v1' }
  }
}

async function syndicateToApple(episode: any, platform: any) {
  // Apple Podcasts Connect API integration would go here
  console.log('Submitting to Apple Podcasts...')
  
  // Apple uses RSS-based submission primarily
  return {
    status: 'submitted',
    platform_episode_id: `apple_${Date.now()}`,
    platform_url: `https://podcasts.apple.com/podcast/${Date.now()}`,
    metadata: { submission_method: 'rss', rss_updated: true }
  }
}

async function syndicateToGoogle(episode: any, platform: any) {
  // Google Podcasts Manager API integration would go here
  console.log('Submitting to Google Podcasts...')
  
  return {
    status: 'submitted',
    platform_episode_id: `google_${Date.now()}`,
    platform_url: `https://podcasts.google.com/feed/${Date.now()}`,
    metadata: { submission_method: 'google_podcasts_manager' }
  }
}

async function syndicateViaRSS(episode: any, platform: any) {
  // Generic RSS-based syndication
  console.log(`Submitting to ${platform.name} via RSS...`)
  
  return {
    status: 'submitted',
    platform_episode_id: `rss_${Date.now()}`,
    metadata: { submission_method: 'rss_discovery' }
  }
}

async function syndicateAllPending(supabase: any) {
  console.log('Processing all pending syndications...')
  
  // Get all pending syndications
  const { data: pendingSyndications, error } = await supabase
    .from('podcast_syndication_status')
    .select(`
      *,
      podcast_episodes (*),
      podcast_platforms (*)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch pending syndications: ${error.message}`)
  }

  const results = []
  
  // Group by episode to process efficiently
  const episodeGroups = pendingSyndications.reduce((groups, syndication) => {
    const episodeId = syndication.episode_id
    if (!groups[episodeId]) {
      groups[episodeId] = []
    }
    groups[episodeId].push(syndication)
    return groups
  }, {} as Record<string, any[]>)

  for (const [episodeId, syndications] of Object.entries(episodeGroups)) {
    try {
      const episodeResult = await syndicateEpisode(supabase, { episode_id: episodeId })
      const resultData = await episodeResult.json()
      results.push(resultData)
    } catch (error) {
      console.error(`Failed to process episode ${episodeId}:`, error)
      results.push({
        episode_id: episodeId,
        error: error.message,
        syndication_results: []
      })
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      processed_episodes: results.length,
      total_syndications: results.reduce((sum, r) => sum + (r.syndication_results?.length || 0), 0),
      successful_syndications: results.reduce((sum, r) => 
        sum + (r.syndication_results?.filter((s: any) => s.status === 'submitted' || s.status === 'manual_ready').length || 0), 0
      ),
      results
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function checkSyndicationStatus(supabase: any, data: any) {
  console.log('Checking syndication status for episode:', data.episode_id)
  
  const { data: syndications, error } = await supabase
    .from('podcast_syndication_status')
    .select(`
      *,
      podcast_platforms (name, requires_manual_upload)
    `)
    .eq('episode_id', data.episode_id)

  if (error) {
    throw new Error(`Failed to fetch syndication status: ${error.message}`)
  }

  const statusSummary = {
    total_platforms: syndications.length,
    submitted: syndications.filter(s => s.status === 'submitted').length,
    published: syndications.filter(s => s.status === 'published').length,
    manual_required: syndications.filter(s => s.status === 'manual_required').length,
    failed: syndications.filter(s => s.status === 'failed').length,
    pending: syndications.filter(s => s.status === 'pending').length
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      episode_id: data.episode_id,
      status_summary: statusSummary,
      detailed_status: syndications
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function retryFailedSyndications(supabase: any, data: any) {
  console.log('Retrying failed syndications...')
  
  const maxRetries = data.max_retries || 3
  
  // Get failed syndications that haven't exceeded retry limit
  const { data: failedSyndications, error } = await supabase
    .from('podcast_syndication_status')
    .select('*')
    .eq('status', 'failed')
    .lt('retry_count', maxRetries)

  if (error) {
    throw new Error(`Failed to fetch failed syndications: ${error.message}`)
  }

  // Reset failed syndications to pending for retry
  const episodeIds = [...new Set(failedSyndications.map(s => s.episode_id))]
  
  await supabase
    .from('podcast_syndication_status')
    .update({ 
      status: 'pending',
      error_message: null,
      updated_at: new Date().toISOString()
    })
    .in('id', failedSyndications.map(s => s.id))

  // Process the retries
  const retryResults = []
  for (const episodeId of episodeIds) {
    try {
      const result = await syndicateEpisode(supabase, { episode_id: episodeId })
      const resultData = await result.json()
      retryResults.push(resultData)
    } catch (error) {
      console.error(`Retry failed for episode ${episodeId}:`, error)
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      retried_episodes: episodeIds.length,
      retry_results: retryResults
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
