import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface KeywordResearchRequest {
  action: 'keyword_research' | 'competitor_analysis' | 'technical_audit' | 'content_optimization' | 'serp_tracking'
  tenant_id: string
  data: any
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

    const { action, tenant_id, data } = await req.json() as KeywordResearchRequest

    switch (action) {
      case 'keyword_research':
        return await handleKeywordResearch(supabase, tenant_id, data)
      
      case 'competitor_analysis':
        return await handleCompetitorAnalysis(supabase, tenant_id, data)
      
      case 'technical_audit':
        return await handleTechnicalAudit(supabase, tenant_id, data)
      
      case 'content_optimization':
        return await handleContentOptimization(supabase, tenant_id, data)
      
      case 'serp_tracking':
        return await handleSerpTracking(supabase, tenant_id, data)
      
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('SEO Intelligence Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function handleKeywordResearch(supabase: any, tenantId: string, data: any) {
  console.log('🔍 Starting AI-powered keyword research...')
  
  const { seed_keywords, project_id, country = 'US', language = 'en' } = data
  
  try {
    // Generate keyword suggestions using multiple strategies
    const [semanticKeywords, questionBasedKeywords, competitorKeywords, longTailKeywords] = await Promise.all([
      generateSemanticKeywords(seed_keywords),
      generateQuestionBasedKeywords(seed_keywords),
      findCompetitorKeywords(seed_keywords),
      generateLongTailKeywords(seed_keywords)
    ])
    
    const allKeywords = [
      ...semanticKeywords,
      ...questionBasedKeywords,
      ...competitorKeywords,
      ...longTailKeywords
    ]
    
    // Enrich keywords with search data
    const enrichedKeywords = await enrichKeywordsWithData(allKeywords, country, language)
    
    // Score and prioritize keywords
    const scoredKeywords = await scoreKeywords(enrichedKeywords, seed_keywords)
    
    // Save keyword suggestions to database
    const suggestions = await Promise.all(
      scoredKeywords.map(async (keyword) => {
        const { data: suggestion, error } = await supabase
          .from('seo_keyword_suggestions')
          .insert({
            tenant_id: tenantId,
            project_id: project_id,
            keyword: keyword.keyword,
            search_volume: keyword.search_volume,
            keyword_difficulty: keyword.difficulty,
            cpc: keyword.cpc,
            competition_level: categorizeCompetition(keyword.difficulty),
            search_intent: keyword.search_intent,
            content_gap_score: keyword.content_gap_score,
            opportunity_score: keyword.opportunity_score,
            source: 'ai_analysis',
            related_to_keyword: seed_keywords[0]
          })
          .select()
          .single()
        
        if (error) {
          console.error('Error saving keyword suggestion:', error)
          return null
        }
        
        return suggestion
      })
    )
    
    const validSuggestions = suggestions.filter(Boolean)
    
    return new Response(
      JSON.stringify({
        success: true,
        total_keywords_found: allKeywords.length,
        high_opportunity_keywords: scoredKeywords.filter(k => k.opportunity_score >= 70).length,
        suggestions: validSuggestions.slice(0, 50) // Return top 50
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Keyword research error:', error)
    throw error
  }
}

async function handleCompetitorAnalysis(supabase: any, tenantId: string, data: any) {
  console.log('🎯 Starting competitor analysis...')
  
  const { project_id, competitors, target_domain } = data
  
  try {
    const competitorAnalyses = []
    
    for (const competitor of competitors) {
      console.log(`Analyzing competitor: ${competitor}`)
      
      // Analyze competitor metrics
      const metrics = await analyzeCompetitorMetrics(competitor)
      
      // Find keyword gaps
      const keywordGaps = await findKeywordGaps(target_domain, competitor)
      
      // Analyze content gaps
      const contentGaps = await analyzeContentGaps(target_domain, competitor)
      
      // Save competitor data
      const { data: competitorRecord, error } = await supabase
        .from('seo_competitors')
        .insert({
          tenant_id: tenantId,
          project_id: project_id,
          domain: competitor,
          name: extractDomainName(competitor),
          estimated_traffic: metrics.estimated_traffic,
          total_keywords: metrics.total_keywords,
          avg_position: metrics.avg_position,
          visibility_score: metrics.visibility_score,
          domain_authority: metrics.domain_authority,
          keyword_overlap_count: keywordGaps.overlap_count,
          content_gaps: contentGaps,
          opportunity_score: calculateOpportunityScore(metrics, keywordGaps),
          last_analyzed_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error saving competitor data:', error)
        continue
      }
      
      // Save keyword gaps
      await Promise.all(
        keywordGaps.keywords.map(async (gap: any) => {
          return supabase
            .from('competitor_keywords')
            .insert({
              tenant_id: tenantId,
              competitor_id: competitorRecord.id,
              keyword: gap.keyword,
              position: gap.position,
              search_volume: gap.search_volume,
              traffic_estimate: gap.traffic_estimate,
              url: gap.url,
              our_position: gap.our_position,
              opportunity_level: gap.opportunity_level
            })
        })
      )
      
      competitorAnalyses.push({
        competitor: competitor,
        metrics: metrics,
        keyword_gaps: keywordGaps.keywords.length,
        content_gaps: contentGaps.length,
        opportunity_score: calculateOpportunityScore(metrics, keywordGaps)
      })
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        competitors_analyzed: competitorAnalyses.length,
        total_opportunities: competitorAnalyses.reduce((sum, c) => sum + c.keyword_gaps, 0),
        analyses: competitorAnalyses
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Competitor analysis error:', error)
    throw error
  }
}

async function handleTechnicalAudit(supabase: any, tenantId: string, data: any) {
  console.log('🔧 Starting technical SEO audit...')
  
  const { project_id, url, audit_type = 'full' } = data
  
  try {
    // Start audit record
    const { data: auditRecord, error: auditError } = await supabase
      .from('seo_technical_audits')
      .insert({
        tenant_id: tenantId,
        project_id: project_id,
        audit_type: audit_type,
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (auditError) {
      throw new Error(`Failed to create audit record: ${auditError.message}`)
    }
    
    // Run various audit checks
    const [pageSpeedResults, crawlResults, structuralResults, accessibilityResults] = await Promise.all([
      runPageSpeedAudit(url),
      runCrawlAudit(url),
      runStructuralAudit(url),
      runAccessibilityAudit(url)
    ])
    
    // Calculate overall scores
    const overallScore = calculateOverallAuditScore(pageSpeedResults, crawlResults, structuralResults)
    const recommendations = generateAuditRecommendations(pageSpeedResults, crawlResults, structuralResults)
    
    // Update audit record with results
    await supabase
      .from('seo_technical_audits')
      .update({
        status: 'completed',
        largest_contentful_paint: pageSpeedResults.core_web_vitals.lcp,
        first_input_delay: pageSpeedResults.core_web_vitals.fid,
        cumulative_layout_shift: pageSpeedResults.core_web_vitals.cls,
        page_speed_score: pageSpeedResults.performance_score,
        mobile_usability_score: pageSpeedResults.mobile_score,
        crawl_errors: crawlResults.errors.length,
        broken_links: crawlResults.broken_links,
        missing_meta_descriptions: structuralResults.missing_meta_descriptions,
        duplicate_content_issues: structuralResults.duplicate_content,
        missing_alt_tags: structuralResults.missing_alt_tags,
        overall_score: overallScore,
        issues_critical: crawlResults.critical_issues.length + structuralResults.critical_issues.length,
        issues_warning: crawlResults.warning_issues.length + structuralResults.warning_issues.length,
        issues_notice: crawlResults.notice_issues.length + structuralResults.notice_issues.length,
        audit_results: {
          page_speed: pageSpeedResults,
          crawl: crawlResults,
          structural: structuralResults,
          accessibility: accessibilityResults
        },
        recommendations: recommendations,
        completed_at: new Date().toISOString()
      })
      .eq('id', auditRecord.id)
    
    return new Response(
      JSON.stringify({
        success: true,
        audit_id: auditRecord.id,
        overall_score: overallScore,
        critical_issues: crawlResults.critical_issues.length + structuralResults.critical_issues.length,
        recommendations_count: recommendations.length,
        core_web_vitals: pageSpeedResults.core_web_vitals
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Technical audit error:', error)
    throw error
  }
}

async function handleContentOptimization(supabase: any, tenantId: string, data: any) {
  console.log('📝 Starting content optimization analysis...')
  
  const { project_id, url, content, primary_keyword, secondary_keywords = [] } = data
  
  try {
    // Analyze content
    const contentAnalysis = await analyzeContentForSEO(content, primary_keyword, secondary_keywords)
    
    // Get competitor content analysis
    const competitorAnalysis = await analyzeCompetitorContent(primary_keyword)
    
    // Generate AI optimization suggestions
    const aiSuggestions = await generateContentOptimizationSuggestions(content, primary_keyword, competitorAnalysis)
    
    // Save optimization results
    const { data: optimizationRecord, error } = await supabase
      .from('seo_content_optimization')
      .insert({
        tenant_id: tenantId,
        project_id: project_id,
        url: url,
        title: extractTitleFromContent(content),
        meta_description: extractMetaDescription(content),
        content_text: content.substring(0, 5000), // Store first 5000 chars
        primary_keyword: primary_keyword,
        secondary_keywords: secondary_keywords,
        overall_score: contentAnalysis.overall_score,
        keyword_optimization_score: contentAnalysis.keyword_score,
        content_quality_score: contentAnalysis.quality_score,
        readability_score: contentAnalysis.readability_score,
        word_count: contentAnalysis.word_count,
        keyword_density: contentAnalysis.keyword_density,
        semantic_keywords: contentAnalysis.semantic_keywords,
        content_gaps: competitorAnalysis.content_gaps,
        optimization_suggestions: aiSuggestions,
        ai_generated_improvements: {
          title_suggestions: aiSuggestions.filter((s: any) => s.type === 'title'),
          content_suggestions: aiSuggestions.filter((s: any) => s.type === 'content'),
          structure_suggestions: aiSuggestions.filter((s: any) => s.type === 'structure')
        }
      })
      .select()
      .single()
    
    if (error) {
      throw new Error(`Failed to save optimization results: ${error.message}`)
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        optimization_id: optimizationRecord.id,
        overall_score: contentAnalysis.overall_score,
        word_count: contentAnalysis.word_count,
        keyword_density: contentAnalysis.keyword_density,
        suggestions_count: aiSuggestions.length,
        content_gaps: competitorAnalysis.content_gaps.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Content optimization error:', error)
    throw error
  }
}

async function handleSerpTracking(supabase: any, tenantId: string, data: any) {
  console.log('📊 Starting SERP tracking...')
  
  const { project_id, keywords, location = 'US', device = 'desktop' } = data
  
  try {
    const trackingResults = []
    
    for (const keywordData of keywords) {
      const { keyword_id, keyword } = keywordData
      
      // Get SERP results for keyword
      const serpResults = await getSerpResults(keyword, location, device)
      
      // Find our position in results
      const ourPosition = findOurPositionInSerp(serpResults, data.target_domain)
      
      // Check for SERP features
      const serpFeatures = analyzeSerpFeatures(serpResults)
      
      // Save tracking data
      const { data: trackingRecord, error } = await supabase
        .from('serp_tracking')
        .insert({
          tenant_id: tenantId,
          project_id: project_id,
          keyword_id: keyword_id,
          position: ourPosition.position || 0,
          previous_position: await getPreviousPosition(supabase, keyword_id),
          url: ourPosition.url,
          title: ourPosition.title,
          description: ourPosition.description,
          featured_snippet: serpFeatures.has_featured_snippet,
          local_pack: serpFeatures.has_local_pack,
          knowledge_panel: serpFeatures.has_knowledge_panel,
          image_pack: serpFeatures.has_image_pack,
          video_results: serpFeatures.has_video_results,
          search_engine: 'google',
          location: location,
          device: device,
          estimated_traffic: calculateEstimatedTraffic(ourPosition.position, keywordData.search_volume),
          click_through_rate: calculateCTR(ourPosition.position)
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error saving tracking data:', error)
        continue
      }
      
      // Save SERP features for opportunity analysis
      await saveSerpFeatures(supabase, tenantId, keyword_id, serpFeatures)
      
      trackingResults.push({
        keyword: keyword,
        position: ourPosition.position,
        change: ourPosition.position ? await getPositionChange(supabase, keyword_id, ourPosition.position) : 0,
        serp_features: Object.keys(serpFeatures).filter(key => serpFeatures[key])
      })
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        keywords_tracked: trackingResults.length,
        avg_position: trackingResults.reduce((sum, r) => sum + (r.position || 100), 0) / trackingResults.length,
        improved_positions: trackingResults.filter(r => r.change > 0).length,
        declined_positions: trackingResults.filter(r => r.change < 0).length,
        results: trackingResults
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('SERP tracking error:', error)
    throw error
  }
}

// Helper functions for keyword research
async function generateSemanticKeywords(seedKeywords: string[]) {
  // Generate semantically related keywords
  const semanticVariations = []
  
  for (const keyword of seedKeywords) {
    const variations = [
      `${keyword} guide`,
      `${keyword} tips`,
      `${keyword} best practices`,
      `${keyword} strategy`,
      `${keyword} tools`,
      `${keyword} software`,
      `${keyword} platform`,
      `${keyword} solution`,
      `how to ${keyword}`,
      `${keyword} for beginners`,
      `${keyword} vs alternatives`,
      `${keyword} pricing`,
      `${keyword} reviews`,
      `${keyword} comparison`
    ]
    
    semanticVariations.push(...variations)
  }
  
  return semanticVariations
}

async function generateQuestionBasedKeywords(seedKeywords: string[]) {
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which']
  const questions = []
  
  for (const keyword of seedKeywords) {
    for (const qWord of questionWords) {
      questions.push(`${qWord} is ${keyword}`)
      questions.push(`${qWord} ${keyword} works`)
      questions.push(`${qWord} to use ${keyword}`)
      questions.push(`${qWord} ${keyword} benefits`)
    }
  }
  
  return questions
}

async function findCompetitorKeywords(seedKeywords: string[]) {
  // Simulate competitor keyword discovery
  return seedKeywords.flatMap(keyword => [
    `${keyword} alternative`,
    `best ${keyword}`,
    `${keyword} competitor`,
    `${keyword} vs`,
    `top ${keyword}`
  ])
}

async function generateLongTailKeywords(seedKeywords: string[]) {
  const longTailModifiers = [
    'for small business',
    'for enterprise',
    'free trial',
    'pricing plans',
    'customer reviews',
    'implementation guide',
    'best features',
    'success stories'
  ]
  
  return seedKeywords.flatMap(keyword =>
    longTailModifiers.map(modifier => `${keyword} ${modifier}`)
  )
}

async function enrichKeywordsWithData(keywords: string[], country: string, language: string) {
  // Simulate keyword enrichment with search volume, difficulty, etc.
  return keywords.map(keyword => ({
    keyword,
    search_volume: Math.floor(Math.random() * 10000) + 100,
    difficulty: Math.floor(Math.random() * 80) + 20,
    cpc: Math.random() * 5 + 0.5,
    search_intent: detectSearchIntent(keyword),
    content_gap_score: Math.floor(Math.random() * 60) + 40,
    opportunity_score: 0 // Will be calculated
  }))
}

async function scoreKeywords(keywords: any[], seedKeywords: string[]) {
  return keywords.map(keyword => {
    // Calculate opportunity score based on multiple factors
    const volumeScore = Math.min(keyword.search_volume / 1000, 100)
    const difficultyPenalty = keyword.difficulty
    const relevanceBonus = seedKeywords.some(seed => 
      keyword.keyword.includes(seed.toLowerCase())
    ) ? 20 : 0
    
    keyword.opportunity_score = Math.max(0, Math.min(100, 
      volumeScore - difficultyPenalty + relevanceBonus + 30
    ))
    
    return keyword
  }).sort((a, b) => b.opportunity_score - a.opportunity_score)
}

function detectSearchIntent(keyword: string): string {
  const transactionalWords = ['buy', 'purchase', 'order', 'shop', 'price', 'cost', 'pricing']
  const informationalWords = ['what', 'how', 'why', 'guide', 'tutorial', 'tips', 'learn']
  const navigationalWords = ['login', 'sign in', 'homepage', 'contact', 'about']
  
  const lowerKeyword = keyword.toLowerCase()
  
  if (transactionalWords.some(word => lowerKeyword.includes(word))) {
    return 'transactional'
  }
  if (informationalWords.some(word => lowerKeyword.includes(word))) {
    return 'informational'
  }
  if (navigationalWords.some(word => lowerKeyword.includes(word))) {
    return 'navigational'
  }
  
  return 'commercial'
}

function categorizeCompetition(difficulty: number): string {
  if (difficulty <= 30) return 'low'
  if (difficulty <= 60) return 'medium'
  return 'high'
}

// Helper functions for competitor analysis
async function analyzeCompetitorMetrics(domain: string) {
  // Simulate competitor metrics analysis
  return {
    estimated_traffic: Math.floor(Math.random() * 100000) + 10000,
    total_keywords: Math.floor(Math.random() * 5000) + 1000,
    avg_position: Math.random() * 10 + 5,
    visibility_score: Math.floor(Math.random() * 40) + 60,
    domain_authority: Math.floor(Math.random() * 40) + 40
  }
}

async function findKeywordGaps(targetDomain: string, competitor: string) {
  // Simulate keyword gap analysis
  const gaps = [
    {
      keyword: 'marketing automation software',
      position: 3,
      search_volume: 8100,
      traffic_estimate: 1200,
      url: `https://${competitor}/marketing-automation`,
      our_position: null,
      opportunity_level: 'high'
    },
    {
      keyword: 'crm integration tools',
      position: 7,
      search_volume: 2900,
      traffic_estimate: 290,
      url: `https://${competitor}/crm-tools`,
      our_position: 15,
      opportunity_level: 'medium'
    }
  ]
  
  return {
    overlap_count: 150,
    keywords: gaps
  }
}

async function analyzeContentGaps(targetDomain: string, competitor: string) {
  return [
    'Email marketing automation guide',
    'Lead scoring best practices',
    'CRM data migration tutorial',
    'Marketing attribution modeling'
  ]
}

function calculateOpportunityScore(metrics: any, keywordGaps: any): number {
  const trafficWeight = Math.min(metrics.estimated_traffic / 100000, 1) * 30
  const keywordWeight = Math.min(keywordGaps.keywords?.length || 0 / 10, 1) * 40
  const visibilityWeight = (metrics.visibility_score / 100) * 30
  
  return Math.round(trafficWeight + keywordWeight + visibilityWeight)
}

function extractDomainName(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
}

// Helper functions for technical audit
async function runPageSpeedAudit(url: string) {
  // Simulate PageSpeed Insights results
  return {
    performance_score: Math.floor(Math.random() * 40) + 60,
    mobile_score: Math.floor(Math.random() * 30) + 70,
    core_web_vitals: {
      lcp: Math.random() * 3 + 1.5, // 1.5-4.5 seconds
      fid: Math.random() * 200 + 50, // 50-250 milliseconds
      cls: Math.random() * 0.2 + 0.05 // 0.05-0.25
    }
  }
}

async function runCrawlAudit(url: string) {
  return {
    errors: [],
    broken_links: Math.floor(Math.random() * 10),
    critical_issues: [],
    warning_issues: [],
    notice_issues: []
  }
}

async function runStructuralAudit(url: string) {
  return {
    missing_meta_descriptions: Math.floor(Math.random() * 5),
    duplicate_content: Math.floor(Math.random() * 3),
    missing_alt_tags: Math.floor(Math.random() * 15),
    critical_issues: [],
    warning_issues: [],
    notice_issues: []
  }
}

async function runAccessibilityAudit(url: string) {
  return {
    score: Math.floor(Math.random() * 30) + 70,
    issues: []
  }
}

function calculateOverallAuditScore(pageSpeed: any, crawl: any, structural: any): number {
  return Math.round((pageSpeed.performance_score + 
                   (100 - crawl.broken_links * 5) + 
                   (100 - structural.missing_meta_descriptions * 10)) / 3)
}

function generateAuditRecommendations(pageSpeed: any, crawl: any, structural: any): string[] {
  const recommendations = []
  
  if (pageSpeed.performance_score < 80) {
    recommendations.push('Optimize images and enable compression')
    recommendations.push('Minimize JavaScript and CSS files')
  }
  
  if (pageSpeed.core_web_vitals.lcp > 2.5) {
    recommendations.push('Improve Largest Contentful Paint by optimizing server response time')
  }
  
  if (structural.missing_meta_descriptions > 0) {
    recommendations.push('Add meta descriptions to pages missing them')
  }
  
  if (crawl.broken_links > 0) {
    recommendations.push('Fix broken internal and external links')
  }
  
  return recommendations
}

// Helper functions for content optimization
async function analyzeContentForSEO(content: string, primaryKeyword: string, secondaryKeywords: string[]) {
  const words = content.split(/\s+/)
  const wordCount = words.length
  
  // Calculate keyword density
  const primaryOccurrences = (content.toLowerCase().match(new RegExp(primaryKeyword.toLowerCase(), 'g')) || []).length
  const keywordDensity = (primaryOccurrences / wordCount) * 100
  
  // Calculate scores
  const keywordScore = calculateKeywordOptimizationScore(keywordDensity, primaryOccurrences)
  const qualityScore = calculateContentQualityScore(wordCount, content)
  const readabilityScore = calculateReadabilityScore(content)
  const overallScore = Math.round((keywordScore + qualityScore + readabilityScore) / 3)
  
  return {
    overall_score: overallScore,
    keyword_score: keywordScore,
    quality_score: qualityScore,
    readability_score: readabilityScore,
    word_count: wordCount,
    keyword_density: keywordDensity,
    semantic_keywords: extractSemanticKeywords(content, primaryKeyword)
  }
}

async function analyzeCompetitorContent(keyword: string) {
  // Simulate competitor content analysis
  return {
    content_gaps: [
      'Missing section on implementation best practices',
      'No comparison with alternatives',
      'Lacks pricing information',
      'Missing customer testimonials'
    ]
  }
}

async function generateContentOptimizationSuggestions(content: string, primaryKeyword: string, competitorAnalysis: any) {
  const suggestions = []
  
  const wordCount = content.split(/\s+/).length
  const keywordDensity = (content.toLowerCase().match(new RegExp(primaryKeyword.toLowerCase(), 'g')) || []).length / wordCount * 100
  
  if (keywordDensity < 0.5) {
    suggestions.push({
      type: 'keyword',
      priority: 'high',
      title: 'Increase keyword density',
      description: 'Include your target keyword more naturally in the content',
      implementation: 'Add the target keyword 2-3 more times throughout the content'
    })
  }
  
  if (wordCount < 300) {
    suggestions.push({
      type: 'content',
      priority: 'medium',
      title: 'Increase content length',
      description: 'Content should be at least 300 words for better SEO',
      implementation: 'Add more detailed information and examples'
    })
  }
  
  return suggestions
}

function calculateKeywordOptimizationScore(density: number, occurrences: number): number {
  if (density < 0.5) return 30
  if (density <= 2) return 100
  if (density <= 3) return 80
  return 40 // Over-optimization penalty
}

function calculateContentQualityScore(wordCount: number, content: string): number {
  let score = 50
  
  if (wordCount >= 300) score += 20
  if (wordCount >= 800) score += 20
  if (wordCount >= 1500) score += 10
  
  // Check for headings
  const headingCount = (content.match(/#+ /g) || []).length
  if (headingCount > 0) score += 10
  
  return Math.min(100, score)
}

function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const words = content.split(/\s+/).length
  
  if (sentences === 0) return 50
  
  const avgSentenceLength = words / sentences
  
  if (avgSentenceLength <= 20) return 100
  if (avgSentenceLength <= 25) return 80
  if (avgSentenceLength <= 30) return 60
  return 40
}

function extractSemanticKeywords(content: string, primaryKeyword: string): string[] {
  const words = content.toLowerCase().split(/\s+/)
  const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must'])
  
  const semanticKeywords = words
    .filter(word => word.length > 4 && !stopWords.has(word) && !primaryKeyword.toLowerCase().includes(word))
    .reduce((acc: { [key: string]: number }, word) => {
      acc[word] = (acc[word] || 0) + 1
      return acc
    }, {})
  
  return Object.entries(semanticKeywords)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)
}

function extractTitleFromContent(content: string): string {
  const titleMatch = content.match(/^# (.+)/m)
  return titleMatch ? titleMatch[1] : 'Untitled'
}

function extractMetaDescription(content: string): string {
  // Extract first paragraph as meta description
  const firstParagraph = content.split('\n\n')[0]
  return firstParagraph.substring(0, 160)
}

// Helper functions for SERP tracking
async function getSerpResults(keyword: string, location: string, device: string) {
  // Simulate SERP results
  return {
    results: [
      { position: 1, url: 'https://example.com', title: 'Example Title', description: 'Example description' },
      { position: 2, url: 'https://another.com', title: 'Another Title', description: 'Another description' }
    ],
    features: ['featured_snippet', 'local_pack']
  }
}

function findOurPositionInSerp(serpResults: any, targetDomain: string) {
  const ourResult = serpResults.results.find((result: any) => 
    result.url.includes(targetDomain.replace(/^https?:\/\//, '').replace(/^www\./, ''))
  )
  
  return ourResult || { position: null, url: null, title: null, description: null }
}

function analyzeSerpFeatures(serpResults: any) {
  const features = serpResults.features || []
  
  return {
    has_featured_snippet: features.includes('featured_snippet'),
    has_local_pack: features.includes('local_pack'),
    has_knowledge_panel: features.includes('knowledge_panel'),
    has_image_pack: features.includes('image_pack'),
    has_video_results: features.includes('video_results')
  }
}

async function getPreviousPosition(supabase: any, keywordId: string) {
  const { data } = await supabase
    .from('serp_tracking')
    .select('position')
    .eq('keyword_id', keywordId)
    .order('tracked_at', { ascending: false })
    .limit(1)
    .single()
  
  return data?.position || null
}

function calculateEstimatedTraffic(position: number, searchVolume: number): number {
  if (!position || position > 20) return 0
  
  // CTR by position (simplified)
  const ctrByPosition = [0, 0.28, 0.15, 0.11, 0.08, 0.07, 0.06, 0.05, 0.04, 0.04, 0.03]
  const ctr = ctrByPosition[position] || 0.01
  
  return Math.round(searchVolume * ctr)
}

function calculateCTR(position: number): number {
  if (!position || position > 20) return 0
  
  const ctrByPosition = [0, 28.5, 15.7, 11.0, 8.0, 7.2, 5.1, 4.4, 3.9, 3.5, 3.1]
  return ctrByPosition[position] || 1.0
}

async function saveSerpFeatures(supabase: any, tenantId: string, keywordId: string, features: any) {
  const featureTypes = Object.keys(features).filter(key => features[key])
  
  await Promise.all(
    featureTypes.map(featureType =>
      supabase
        .from('serp_features')
        .insert({
          tenant_id: tenantId,
          keyword_id: keywordId,
          feature_type: featureType.replace('has_', ''),
          position: 1, // Simplified
          our_content_eligible: false,
          optimization_opportunity: Math.floor(Math.random() * 60) + 40
        })
    )
  )
}

async function getPositionChange(supabase: any, keywordId: string, currentPosition: number) {
  const previousPosition = await getPreviousPosition(supabase, keywordId)
  if (!previousPosition) return 0
  
  return previousPosition - currentPosition // Positive = improvement
}