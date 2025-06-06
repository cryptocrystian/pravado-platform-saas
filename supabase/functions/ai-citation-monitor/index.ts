
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { aiPlatformService } from '../_shared/ai-platform-service.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CitationQuery {
  tenant_id: string
  query_text: string
  target_keywords: string[]
  platforms: string[]
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
      case 'monitor_single_query':
        return await handleSingleQuery(supabase, data as CitationQuery)
      
      case 'monitor_all_active':
        return await handleAllActiveQueries(supabase)
      
      case 'create_monitoring_job':
        return await createMonitoringJob(supabase, data)
      
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('AI Citation Monitor Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function handleSingleQuery(supabase: any, query: CitationQuery) {
  console.log('Starting AI citation monitoring for:', query.query_text)
  
  const results = []
  
  for (const platform of query.platforms) {
    try {
      console.log(`Querying ${platform} for citations...`)
      
      const platformResult = await aiPlatformService.queryPlatform({
        query: query.query_text,
        platform: platform as any,
        keywords: query.target_keywords
      })

      // Analyze response for citations and sentiment
      const analysis = await analyzeCitationResponse(
        platformResult.response,
        query.target_keywords
      )

      // Store result in database
      const { data: citationResult, error } = await supabase
        .from('ai_citation_results')
        .insert({
          tenant_id: query.tenant_id,
          platform: platform,
          model_used: platformResult.model,
          response_text: platformResult.response,
          citations_found: analysis.citations,
          sentiment_score: analysis.sentiment,
          confidence_score: analysis.confidence,
          context_relevance: analysis.relevance,
          query_timestamp: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error(`Error storing citation result for ${platform}:`, error)
        continue
      }

      results.push(citationResult)
      
      // Update analytics
      await updateCitationAnalytics(supabase, query.tenant_id, platform, analysis)
      
    } catch (error) {
      console.error(`Error querying ${platform}:`, error)
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      results,
      total_citations: results.reduce((sum, r) => sum + r.citations_found.length, 0)
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleAllActiveQueries(supabase: any) {
  console.log('Processing all active citation queries...')
  
  // Get all active queries
  const { data: queries, error } = await supabase
    .from('ai_citation_queries')
    .select('*')
    .eq('status', 'active')

  if (error) {
    throw new Error(`Failed to fetch active queries: ${error.message}`)
  }

  const allResults = []
  
  for (const query of queries) {
    try {
      const queryResults = await handleSingleQuery(supabase, {
        tenant_id: query.tenant_id,
        query_text: query.query_text,
        target_keywords: query.target_keywords,
        platforms: query.platforms
      })

      // Update last executed timestamp
      await supabase
        .from('ai_citation_queries')
        .update({ last_executed_at: new Date().toISOString() })
        .eq('id', query.id)

      const resultData = await queryResults.json()
      allResults.push({
        query_id: query.id,
        ...resultData
      })
      
    } catch (error) {
      console.error(`Error processing query ${query.id}:`, error)
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      processed_queries: allResults.length,
      total_citations: allResults.reduce((sum, r) => sum + (r.total_citations || 0), 0),
      results: allResults
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createMonitoringJob(supabase: any, jobData: any) {
  const { data: job, error } = await supabase
    .from('background_jobs')
    .insert({
      tenant_id: jobData.tenant_id,
      job_type: 'citation_monitoring',
      job_data: jobData,
      scheduled_at: jobData.scheduled_at || new Date().toISOString(),
      priority: jobData.priority || 1
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create monitoring job: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ success: true, job }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function analyzeCitationResponse(response: string, keywords: string[]) {
  // Simple citation detection algorithm
  const citations = []
  const lowercaseResponse = response.toLowerCase()
  
  for (const keyword of keywords) {
    const lowercaseKeyword = keyword.toLowerCase()
    if (lowercaseResponse.includes(lowercaseKeyword)) {
      citations.push(keyword)
    }
  }

  // Basic sentiment analysis
  const positiveWords = ['excellent', 'great', 'good', 'helpful', 'useful', 'valuable', 'innovative']
  const negativeWords = ['poor', 'bad', 'terrible', 'useless', 'ineffective', 'problematic']
  
  let sentiment = 0
  positiveWords.forEach(word => {
    if (lowercaseResponse.includes(word)) sentiment += 0.1
  })
  negativeWords.forEach(word => {
    if (lowercaseResponse.includes(word)) sentiment -= 0.1
  })
  
  // Normalize sentiment between -1 and 1
  sentiment = Math.max(-1, Math.min(1, sentiment))

  return {
    citations,
    sentiment,
    confidence: citations.length > 0 ? 0.8 : 0.2,
    relevance: citations.length / keywords.length
  }
}

async function updateCitationAnalytics(supabase: any, tenantId: string, platform: string, analysis: any) {
  const today = new Date().toISOString().split('T')[0]
  
  const { data: existing } = await supabase
    .from('citation_analytics')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('platform', platform)
    .eq('date_recorded', today)
    .single()

  if (existing) {
    // Update existing record
    await supabase
      .from('citation_analytics')
      .update({
        total_queries: existing.total_queries + 1,
        citations_found: existing.citations_found + analysis.citations.length,
        positive_mentions: existing.positive_mentions + (analysis.sentiment > 0 ? 1 : 0),
        neutral_mentions: existing.neutral_mentions + (analysis.sentiment === 0 ? 1 : 0),
        negative_mentions: existing.negative_mentions + (analysis.sentiment < 0 ? 1 : 0),
        avg_sentiment_score: (existing.avg_sentiment_score + analysis.sentiment) / 2,
        avg_confidence_score: (existing.avg_confidence_score + analysis.confidence) / 2
      })
      .eq('id', existing.id)
  } else {
    // Create new record
    await supabase
      .from('citation_analytics')
      .insert({
        tenant_id: tenantId,
        platform,
        date_recorded: today,
        total_queries: 1,
        citations_found: analysis.citations.length,
        positive_mentions: analysis.sentiment > 0 ? 1 : 0,
        neutral_mentions: analysis.sentiment === 0 ? 1 : 0,
        negative_mentions: analysis.sentiment < 0 ? 1 : 0,
        avg_sentiment_score: analysis.sentiment,
        avg_confidence_score: analysis.confidence
      })
  }
}
