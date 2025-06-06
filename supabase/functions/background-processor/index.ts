
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
      case 'process_next_job':
        return await processNextJob(supabase)
      
      case 'process_all_pending':
        return await processAllPendingJobs(supabase)
      
      case 'schedule_monitoring':
        return await scheduleMonitoringJobs(supabase, data)
      
      case 'cleanup_completed_jobs':
        return await cleanupCompletedJobs(supabase, data)
      
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Background Processor Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function processNextJob(supabase: any) {
  console.log('Processing next background job...')
  
  // Get the highest priority pending job
  const { data: job, error } = await supabase
    .from('background_jobs')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_at', new Date().toISOString())
    .order('priority', { ascending: false })
    .order('scheduled_at', { ascending: true })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No jobs found
      return new Response(
        JSON.stringify({ success: true, message: 'No pending jobs' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    throw new Error(`Failed to fetch next job: ${error.message}`)
  }

  // Mark job as running
  await supabase
    .from('background_jobs')
    .update({
      status: 'running',
      started_at: new Date().toISOString()
    })
    .eq('id', job.id)

  try {
    // Process the job based on type
    let result
    switch (job.job_type) {
      case 'citation_monitoring':
        result = await processCitationMonitoringJob(supabase, job)
        break
      case 'podcast_generation':
        result = await processPodcastGenerationJob(supabase, job)
        break
      case 'podcast_syndication':
        result = await processPodcastSyndicationJob(supabase, job)
        break
      case 'rss_update':
        result = await processRSSUpdateJob(supabase, job)
        break
      case 'analytics_processing':
        result = await processAnalyticsJob(supabase, job)
        break
      default:
        throw new Error(`Unknown job type: ${job.job_type}`)
    }

    // Mark job as completed
    await supabase
      .from('background_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: result
      })
      .eq('id', job.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        job_id: job.id,
        job_type: job.job_type,
        result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error(`Job ${job.id} failed:`, error)
    
    // Update job status to failed
    const retryCount = job.retry_count + 1
    const shouldRetry = retryCount < job.max_retries
    
    await supabase
      .from('background_jobs')
      .update({
        status: shouldRetry ? 'retry' : 'failed',
        retry_count: retryCount,
        error_message: error.message,
        updated_at: new Date().toISOString(),
        ...(shouldRetry && {
          scheduled_at: new Date(Date.now() + (retryCount * 60000)).toISOString() // Exponential backoff
        })
      })
      .eq('id', job.id)

    throw error
  }
}

async function processCitationMonitoringJob(supabase: any, job: any) {
  console.log('Processing citation monitoring job:', job.id)
  
  // Call the AI citation monitor function
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-citation-monitor`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: job.job_data.query_id ? 'monitor_single_query' : 'monitor_all_active',
      ...job.job_data
    })
  })

  if (!response.ok) {
    throw new Error(`Citation monitoring failed: ${response.statusText}`)
  }

  const result = await response.json()
  return { citations_found: result.total_citations, processed_queries: result.results?.length || 1 }
}

async function processPodcastGenerationJob(supabase: any, job: any) {
  console.log('Processing podcast generation job:', job.id)
  
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/podcast-generator`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'generate_episode',
      ...job.job_data
    })
  })

  if (!response.ok) {
    throw new Error(`Podcast generation failed: ${response.statusText}`)
  }

  const result = await response.json()
  return { episode_generated: true, episode_id: result.episode?.id }
}

async function processPodcastSyndicationJob(supabase: any, job: any) {
  console.log('Processing podcast syndication job:', job.id)
  
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/podcast-syndication`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'syndicate_episode',
      ...job.job_data
    })
  })

  if (!response.ok) {
    throw new Error(`Podcast syndication failed: ${response.statusText}`)
  }

  const result = await response.json()
  return { syndicated_platforms: result.successful_submissions }
}

async function processRSSUpdateJob(supabase: any, job: any) {
  console.log('Processing RSS update job:', job.id)
  
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/podcast-generator`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'generate_rss',
      ...job.job_data
    })
  })

  if (!response.ok) {
    throw new Error(`RSS update failed: ${response.statusText}`)
  }

  const result = await response.json()
  return { rss_updated: true, episode_count: result.episode_count }
}

async function processAnalyticsJob(supabase: any, job: any) {
  console.log('Processing analytics job:', job.id)
  
  // Update citation analytics
  await updateDailyAnalytics(supabase, job.job_data.tenant_id)
  
  return { analytics_updated: true }
}

async function processAllPendingJobs(supabase: any) {
  console.log('Processing all pending background jobs...')
  
  const results = []
  let processedCount = 0
  const maxJobs = 50 // Prevent infinite loops
  
  while (processedCount < maxJobs) {
    try {
      const result = await processNextJob(supabase)
      const data = await result.json()
      
      if (data.message === 'No pending jobs') {
        break
      }
      
      results.push(data)
      processedCount++
    } catch (error) {
      console.error('Error processing job:', error)
      processedCount++
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      processed_jobs: processedCount,
      results
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function scheduleMonitoringJobs(supabase: any, data: any) {
  console.log('Scheduling monitoring jobs for all tenants...')
  
  // Get all active tenants
  const { data: tenants, error } = await supabase
    .from('tenants')
    .select('id')

  if (error) {
    throw new Error(`Failed to fetch tenants: ${error.message}`)
  }

  const scheduledJobs = []
  
  for (const tenant of tenants) {
    // Schedule daily citation monitoring
    const citationJob = await supabase
      .from('background_jobs')
      .insert({
        tenant_id: tenant.id,
        job_type: 'citation_monitoring',
        job_data: { tenant_id: tenant.id },
        scheduled_at: data.scheduled_time || new Date().toISOString(),
        priority: 3
      })
      .select()
      .single()

    // Schedule daily analytics processing
    const analyticsJob = await supabase
      .from('background_jobs')
      .insert({
        tenant_id: tenant.id,
        job_type: 'analytics_processing',
        job_data: { tenant_id: tenant.id },
        scheduled_at: data.scheduled_time || new Date().toISOString(),
        priority: 1
      })
      .select()
      .single()

    scheduledJobs.push(citationJob.data, analyticsJob.data)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      scheduled_jobs: scheduledJobs.length,
      tenants_processed: tenants.length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function cleanupCompletedJobs(supabase: any, data: any) {
  const daysToKeep = data.days_to_keep || 7
  const cutoffDate = new Date(Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)).toISOString()
  
  const { data: deletedJobs, error } = await supabase
    .from('background_jobs')
    .delete()
    .eq('status', 'completed')
    .lt('completed_at', cutoffDate)

  if (error) {
    throw new Error(`Failed to cleanup jobs: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      deleted_jobs: deletedJobs?.length || 0
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateDailyAnalytics(supabase: any, tenantId: string) {
  const today = new Date().toISOString().split('T')[0]
  
  // Aggregate citation results for today
  const { data: todaysCitations, error } = await supabase
    .from('ai_citation_results')
    .select('platform, citations_found, sentiment_score, confidence_score')
    .eq('tenant_id', tenantId)
    .gte('query_timestamp', today)
    .lt('query_timestamp', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])

  if (error) {
    console.error('Failed to fetch citation results:', error)
    return
  }

  // Group by platform and update analytics
  const platformStats = todaysCitations.reduce((stats, citation) => {
    const platform = citation.platform
    if (!stats[platform]) {
      stats[platform] = {
        total_queries: 0,
        citations_found: 0,
        positive_mentions: 0,
        neutral_mentions: 0,
        negative_mentions: 0,
        sentiment_scores: [],
        confidence_scores: []
      }
    }
    
    stats[platform].total_queries++
    stats[platform].citations_found += citation.citations_found.length
    
    if (citation.sentiment_score > 0.1) stats[platform].positive_mentions++
    else if (citation.sentiment_score < -0.1) stats[platform].negative_mentions++
    else stats[platform].neutral_mentions++
    
    stats[platform].sentiment_scores.push(citation.sentiment_score)
    stats[platform].confidence_scores.push(citation.confidence_score)
    
    return stats
  }, {} as Record<string, any>)

  // Update or insert analytics records
  for (const [platform, stats] of Object.entries(platformStats)) {
    await supabase
      .from('citation_analytics')
      .upsert({
        tenant_id: tenantId,
        platform,
        date_recorded: today,
        total_queries: stats.total_queries,
        citations_found: stats.citations_found,
        positive_mentions: stats.positive_mentions,
        neutral_mentions: stats.neutral_mentions,
        negative_mentions: stats.negative_mentions,
        avg_sentiment_score: stats.sentiment_scores.reduce((a: number, b: number) => a + b, 0) / stats.sentiment_scores.length,
        avg_confidence_score: stats.confidence_scores.reduce((a: number, b: number) => a + b, 0) / stats.confidence_scores.length
      }, {
        onConflict: 'tenant_id,platform,date_recorded'
      })
  }
}
