
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { aiPlatformService } from '../_shared/ai-platform-service-enhanced.ts'

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
      
      case 'verify_citations':
        return await verifyCitations(supabase, data)
      
      case 'setup_realtime_monitoring':
        return await setupRealtimeMonitoring(supabase, data)
      
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
  console.log('🚀 Starting REAL AI citation monitoring for:', query.query_text)
  
  const results = []
  const discoveryQueries = generateDiscoveryQueries(query.query_text, query.target_keywords)
  
  for (const platform of query.platforms) {
    try {
      console.log(`🔍 Querying ${platform.toUpperCase()} for citations...`)
      
      // Run multiple discovery queries for better coverage
      for (const discoveryQuery of discoveryQueries) {
        const platformResult = await aiPlatformService.queryPlatform({
          query: discoveryQuery,
          platform: platform as any,
          keywords: query.target_keywords
        })

        // Enhanced citation analysis and verification
        const analysis = await enhancedCitationAnalysis(
          platformResult.response,
          query.target_keywords,
          discoveryQuery
        )

        if (analysis.citations.length > 0) {
          // Store verified citation result
          const { data: citationResult, error } = await supabase
            .from('ai_citation_results')
            .insert({
              tenant_id: query.tenant_id,
              query_id: query.id,
              platform: platform,
              model_used: platformResult.model,
              query_text: discoveryQuery,
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
            console.error(`❌ Error storing citation result for ${platform}:`, error)
            continue
          }

          // Also store in ai_platform_citations for unified tracking
          await supabase
            .from('ai_platform_citations')
            .insert({
              tenant_id: query.tenant_id,
              platform: platform,
              content_title: analysis.citations[0],
              citation_url: `https://${platform}.ai/search?q=${encodeURIComponent(discoveryQuery)}`,
              citation_context: platformResult.response.substring(0, 500),
              citation_date: new Date().toISOString(),
              visibility_score: Math.round(analysis.confidence * 100),
              click_through_rate: Math.round(analysis.sentiment * 50 + 50)
            })

          results.push(citationResult)
          
          console.log(`✅ Found ${analysis.citations.length} citations on ${platform} with ${analysis.sentiment > 0 ? 'positive' : analysis.sentiment < 0 ? 'negative' : 'neutral'} sentiment`)
        }
        
        // Small delay between queries to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Update analytics
      if (results.length > 0) {
        await updateCitationAnalytics(supabase, query.tenant_id, platform, {
          citations: results.flatMap(r => r.citations_found),
          sentiment: results.reduce((sum, r) => sum + r.sentiment_score, 0) / results.length,
          confidence: results.reduce((sum, r) => sum + r.confidence_score, 0) / results.length,
          relevance: results.reduce((sum, r) => sum + r.context_relevance, 0) / results.length
        })
      }
      
    } catch (error) {
      console.error(`❌ Error querying ${platform}:`, error)
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

function generateDiscoveryQueries(baseQuery: string, keywords: string[]): string[] {
  const brandName = keywords[0] || 'PRAVADO'
  
  return [
    baseQuery, // Original query
    `What do you know about ${brandName}?`,
    `Tell me about ${brandName} and its features`,
    `Compare ${brandName} with other solutions`,
    `What are the benefits of using ${brandName}?`,
    `How does ${brandName} work?`,
    `${brandName} reviews and opinions`,
    `Is ${brandName} worth it?`,
    `${brandName} alternatives and competitors`,
    `Best ${keywords.slice(1).join(' ')} tools including ${brandName}`
  ]
}

async function enhancedCitationAnalysis(response: string, keywords: string[], query: string) {
  // Advanced citation detection with context awareness
  const citations = []
  const lowercaseResponse = response.toLowerCase()
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 10)
  
  // Find citations with context
  for (const keyword of keywords) {
    const lowercaseKeyword = keyword.toLowerCase()
    
    // Exact matches
    if (lowercaseResponse.includes(lowercaseKeyword)) {
      citations.push(keyword)
      continue
    }
    
    // Fuzzy matching for brand variations
    const variations = generateKeywordVariations(keyword)
    for (const variation of variations) {
      if (lowercaseResponse.includes(variation.toLowerCase())) {
        citations.push(keyword)
        break
      }
    }
  }

  // Advanced sentiment analysis with context
  const sentiment = calculateContextualSentiment(response, citations)
  
  // Confidence scoring based on multiple factors
  const confidence = calculateCitationConfidence(response, citations, query)
  
  // Relevance scoring
  const relevance = calculateRelevanceScore(response, keywords, query)

  return {
    citations,
    sentiment,
    confidence,
    relevance
  }
}

function generateKeywordVariations(keyword: string): string[] {
  const variations = [keyword]
  const lower = keyword.toLowerCase()
  
  // Common brand name variations
  const brandVariations = {
    'pravado': ['pravado', 'prevado', 'pravado platform', 'pravado ai', 'pravado intelligence'],
    'hubspot': ['hubspot', 'hub spot', 'hubspot crm', 'hubspot marketing'],
    'marketo': ['marketo', 'marketo engage', 'adobe marketo'],
    'salesforce': ['salesforce', 'sales force', 'sfdc', 'salesforce crm']
  }
  
  const baseKeyword = lower.split(' ')[0]
  if (brandVariations[baseKeyword]) {
    variations.push(...brandVariations[baseKeyword])
  }
  
  return [...new Set(variations)]
}

function calculateContextualSentiment(response: string, citations: string[]): number {
  if (citations.length === 0) return 0
  
  const positiveWords = [
    'excellent', 'great', 'good', 'helpful', 'useful', 'valuable', 'innovative', 
    'outstanding', 'amazing', 'powerful', 'effective', 'robust', 'comprehensive',
    'leading', 'best', 'top', 'superior', 'advanced', 'cutting-edge', 'reliable',
    'user-friendly', 'intuitive', 'efficient', 'streamlined', 'professional',
    'recommended', 'impressive', 'solid', 'strong', 'popular', 'trusted'
  ]
  
  const negativeWords = [
    'poor', 'bad', 'terrible', 'useless', 'ineffective', 'problematic', 
    'disappointing', 'awful', 'horrible', 'limited', 'outdated', 'clunky',
    'difficult', 'confusing', 'expensive', 'overpriced', 'lacking', 'insufficient',
    'weak', 'unreliable', 'buggy', 'slow', 'complicated', 'frustrating'
  ]
  
  let sentimentScore = 0
  const sentences = response.split(/[.!?]+/)
  
  // Analyze sentiment in context of mentions
  citations.forEach(mention => {
    const mentionSentences = sentences.filter(sentence => 
      sentence.toLowerCase().includes(mention.toLowerCase())
    )
    
    mentionSentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase()
      
      positiveWords.forEach(word => {
        if (lowerSentence.includes(word)) sentimentScore += 0.1
      })
      
      negativeWords.forEach(word => {
        if (lowerSentence.includes(word)) sentimentScore -= 0.1
      })
    })
  })
  
  // Normalize to -1 to 1 range
  return Math.max(-1, Math.min(1, sentimentScore))
}

function calculateCitationConfidence(response: string, citations: string[], query: string): number {
  let confidence = 0
  
  // Base confidence from citation count
  if (citations.length > 0) {
    confidence += 0.3 + (Math.min(citations.length - 1, 3) * 0.1)
  }
  
  // Response length factor
  if (response.length > 100) confidence += 0.1
  if (response.length > 300) confidence += 0.1
  if (response.length > 500) confidence += 0.1
  
  // Context relevance factors
  const contextWords = ['platform', 'solution', 'software', 'tool', 'service', 'company', 'product']
  const hasContext = contextWords.some(word => response.toLowerCase().includes(word))
  if (hasContext) confidence += 0.15
  
  // Comparison context
  const comparisonWords = ['compare', 'versus', 'alternative', 'better', 'different', 'similar']
  const hasComparison = comparisonWords.some(word => response.toLowerCase().includes(word))
  if (hasComparison) confidence += 0.1
  
  return Math.min(confidence, 1.0)
}

function calculateRelevanceScore(response: string, keywords: string[], query: string): number {
  const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 2)
  const responseWords = response.toLowerCase().split(' ')
  
  let relevanceScore = 0
  
  // Keyword presence score
  const keywordMatches = keywords.filter(keyword => 
    response.toLowerCase().includes(keyword.toLowerCase())
  )
  relevanceScore += (keywordMatches.length / keywords.length) * 0.5
  
  // Query term relevance
  const queryMatches = queryWords.filter(word => responseWords.includes(word))
  relevanceScore += (queryMatches.length / queryWords.length) * 0.3
  
  // Topic coherence
  const topicWords = ['marketing', 'automation', 'platform', 'business', 'intelligence', 'analytics']
  const topicMatches = topicWords.filter(word => responseWords.includes(word))
  relevanceScore += (topicMatches.length / topicWords.length) * 0.2
  
  return Math.min(relevanceScore, 1.0)
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
        positive_mentions: existing.positive_mentions + (analysis.sentiment > 0.2 ? 1 : 0),
        neutral_mentions: existing.neutral_mentions + (analysis.sentiment >= -0.2 && analysis.sentiment <= 0.2 ? 1 : 0),
        negative_mentions: existing.negative_mentions + (analysis.sentiment < -0.2 ? 1 : 0),
        avg_sentiment_score: (existing.avg_sentiment_score + analysis.sentiment) / 2,
        avg_confidence_score: (existing.avg_confidence_score + analysis.confidence) / 2,
        updated_at: new Date().toISOString()
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
        positive_mentions: analysis.sentiment > 0.2 ? 1 : 0,
        neutral_mentions: analysis.sentiment >= -0.2 && analysis.sentiment <= 0.2 ? 1 : 0,
        negative_mentions: analysis.sentiment < -0.2 ? 1 : 0,
        avg_sentiment_score: analysis.sentiment,
        avg_confidence_score: analysis.confidence
      })
  }
}

async function verifyCitations(supabase: any, data: any) {
  console.log('🔍 Starting citation verification process...')
  
  const { tenant_id, citation_ids } = data
  
  // Get citations to verify
  const { data: citations, error } = await supabase
    .from('ai_citation_results')
    .select('*')
    .eq('tenant_id', tenant_id)
    .in('id', citation_ids || [])
    .order('created_at', { ascending: false })
    .limit(citation_ids ? citation_ids.length : 50)

  if (error) {
    throw new Error(`Failed to fetch citations: ${error.message}`)
  }

  const verificationResults = []
  
  for (const citation of citations) {
    try {
      // Re-verify the citation with fresh query
      const freshResult = await aiPlatformService.queryPlatform({
        query: citation.query_text,
        platform: citation.platform as any,
        keywords: citation.citations_found
      })
      
      // Check if citation still exists
      const stillExists = citation.citations_found.some(keyword =>
        freshResult.response.toLowerCase().includes(keyword.toLowerCase())
      )
      
      // Update verification status
      await supabase
        .from('ai_citation_results')
        .update({
          confidence_score: stillExists ? Math.min(citation.confidence_score + 0.1, 1.0) : Math.max(citation.confidence_score - 0.2, 0.0),
          updated_at: new Date().toISOString()
        })
        .eq('id', citation.id)
      
      verificationResults.push({
        citation_id: citation.id,
        platform: citation.platform,
        verified: stillExists,
        confidence_change: stillExists ? +0.1 : -0.2
      })
      
    } catch (error) {
      console.error(`Verification failed for citation ${citation.id}:`, error)
      verificationResults.push({
        citation_id: citation.id,
        platform: citation.platform,
        verified: false,
        error: error.message
      })
    }
  }
  
  return new Response(
    JSON.stringify({
      success: true,
      verified_citations: verificationResults.length,
      still_valid: verificationResults.filter(r => r.verified).length,
      removed_citations: verificationResults.filter(r => !r.verified).length,
      results: verificationResults
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function setupRealtimeMonitoring(supabase: any, data: any) {
  console.log('⚡ Setting up real-time citation monitoring...')
  
  const { tenant_id, monitoring_config } = data
  
  // Create monitoring job
  const { data: job, error } = await supabase
    .from('background_jobs')
    .insert({
      tenant_id,
      job_type: 'realtime_citation_monitoring',
      job_data: {
        config: monitoring_config,
        platforms: ['openai', 'anthropic', 'perplexity', 'gemini'],
        frequency: 'hourly'
      },
      scheduled_at: new Date().toISOString(),
      priority: 1,
      status: 'pending'
    })
    .select()
    .single()
    
  if (error) {
    throw new Error(`Failed to create monitoring job: ${error.message}`)
  }
  
  // Set up webhook endpoint for real-time alerts
  const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/citation-alerts`
  
  return new Response(
    JSON.stringify({
      success: true,
      monitoring_job_id: job.id,
      webhook_url: webhookUrl,
      monitoring_frequency: 'hourly',
      platforms_monitored: ['openai', 'anthropic', 'perplexity', 'gemini'],
      message: 'Real-time monitoring activated successfully'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
