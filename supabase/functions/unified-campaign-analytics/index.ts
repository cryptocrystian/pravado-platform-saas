import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CampaignAnalyticsRequest {
  action: 'generate_insights' | 'track_attribution' | 'optimize_pillars' | 'predict_performance' | 'cross_pillar_sync'
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

    const { action, tenant_id, data } = await req.json() as CampaignAnalyticsRequest

    switch (action) {
      case 'generate_insights':
        return await generateCampaignInsights(supabase, tenant_id, data)
      
      case 'track_attribution':
        return await trackCrossPillarAttribution(supabase, tenant_id, data)
      
      case 'optimize_pillars':
        return await optimizePillarAllocation(supabase, tenant_id, data)
      
      case 'predict_performance':
        return await predictCampaignPerformance(supabase, tenant_id, data)
      
      case 'cross_pillar_sync':
        return await syncCrossPillarData(supabase, tenant_id, data)
      
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Campaign Analytics Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function generateCampaignInsights(supabase: any, tenantId: string, data: any) {
  console.log('🧠 Generating AI-powered campaign insights...')
  
  const { campaign_id } = data
  
  try {
    // Get campaign data
    const [campaignData, performanceData, attributionData, pillarData] = await Promise.all([
      getCampaignData(supabase, campaign_id),
      getPerformanceData(supabase, campaign_id),
      getAttributionData(supabase, campaign_id),
      getPillarData(supabase, campaign_id)
    ])
    
    const insights = []
    
    // Performance Analysis Insights
    if (performanceData.length > 0) {
      const latestPerf = performanceData[0]
      
      // ROI Analysis
      if (latestPerf.return_on_investment < 100) {
        insights.push({
          insight_type: 'performance_alert',
          insight_category: 'budget',
          title: 'Low ROI Alert',
          description: `Campaign ROI is below target at ${latestPerf.return_on_investment}%. Consider reallocating budget to higher-performing pillars.`,
          severity: latestPerf.return_on_investment < 50 ? 'high' : 'medium',
          confidence_score: 85,
          recommended_actions: [
            'Analyze top-performing content and replicate successful elements',
            'Increase budget allocation to SEO if organic traffic is strong',
            'Review PR strategy and target higher-authority outlets'
          ],
          affects_content: true,
          affects_pr: true,
          affects_seo: true,
          priority_score: 90
        })
      }
      
      // Conversion Rate Optimization
      const conversionRate = latestPerf.total_conversions / (latestPerf.total_clicks || 1) * 100
      if (conversionRate < 2) {
        insights.push({
          insight_type: 'optimization_suggestion',
          insight_category: 'conversion',
          title: 'Conversion Rate Optimization Needed',
          description: `Conversion rate is ${conversionRate.toFixed(2)}%. Cross-pillar content alignment could improve conversions.`,
          severity: 'medium',
          confidence_score: 78,
          recommended_actions: [
            'Align content messaging across all pillars',
            'Implement retargeting for PR-driven traffic',
            'Optimize SEO landing pages for conversion'
          ],
          affects_content: true,
          affects_pr: true,
          affects_seo: true,
          priority_score: 75
        })
      }
    }
    
    // Attribution Analysis Insights
    if (attributionData.length > 0) {
      const pillarAttribution = analyzePillarAttribution(attributionData)
      
      // Find underperforming pillars
      const totalWeight = pillarData.reduce((sum: number, p: any) => sum + p.pillar_weight, 0)
      pillarData.forEach((pillar: any) => {
        const expectedContribution = pillar.pillar_weight / totalWeight * 100
        const actualContribution = pillarAttribution[pillar.pillar_type] || 0
        
        if (actualContribution < expectedContribution * 0.7) {
          insights.push({
            insight_type: 'cross_pillar_opportunity',
            insight_category: 'pillar_performance',
            title: `${pillar.pillar_type.toUpperCase()} Pillar Underperforming`,
            description: `${pillar.pillar_type} pillar contributing ${actualContribution.toFixed(1)}% vs expected ${expectedContribution.toFixed(1)}%`,
            severity: 'medium',
            confidence_score: 82,
            recommended_actions: getPillarOptimizationActions(pillar.pillar_type),
            [`affects_${pillar.pillar_type}`]: true,
            priority_score: 80
          })
        }
      })
    }
    
    // Cross-Pillar Synergy Insights
    const synergyInsights = await analyzeCrossPillarSynergy(supabase, campaign_id, attributionData)
    insights.push(...synergyInsights)
    
    // Save insights to database
    const savedInsights = await Promise.all(
      insights.map(async (insight) => {
        const { data: savedInsight, error } = await supabase
          .from('campaign_insights')
          .insert({
            tenant_id: tenantId,
            unified_campaign_id: campaign_id,
            ...insight,
            data_sources: ['performance_data', 'attribution_data', 'pillar_data'],
            valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Valid for 7 days
          })
          .select()
          .single()
        
        if (error) {
          console.error('Error saving insight:', error)
          return null
        }
        
        return savedInsight
      })
    )
    
    const validInsights = savedInsights.filter(Boolean)
    
    return new Response(
      JSON.stringify({
        success: true,
        insights_generated: validInsights.length,
        insights: validInsights
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Insight generation error:', error)
    throw error
  }
}

async function trackCrossPillarAttribution(supabase: any, tenantId: string, data: any) {
  console.log('🔗 Tracking cross-pillar attribution...')
  
  const { 
    campaign_id, 
    user_id, 
    session_id, 
    touchpoint_type, 
    pillar_source, 
    source_data,
    interaction_data 
  } = data
  
  try {
    // Get existing attribution for this user/session
    const { data: existingAttribution } = await supabase
      .from('campaign_attribution')
      .select('*')
      .eq('unified_campaign_id', campaign_id)
      .eq(user_id ? 'user_id' : 'session_id', user_id || session_id)
      .order('journey_step', { ascending: false })
      .limit(1)
    
    const nextStep = existingAttribution.length > 0 ? existingAttribution[0].journey_step + 1 : 1
    
    // Calculate attribution weights based on position and timing
    const attributionWeights = calculateAttributionWeights(nextStep, existingAttribution)
    
    // Track the new touchpoint
    const { data: newAttribution, error } = await supabase
      .from('campaign_attribution')
      .insert({
        tenant_id: tenantId,
        unified_campaign_id: campaign_id,
        session_id: session_id,
        user_id: user_id,
        journey_step: nextStep,
        touchpoint_type: touchpoint_type,
        pillar_source: pillar_source,
        source_content_id: source_data?.content_id,
        source_press_release_id: source_data?.press_release_id,
        source_keyword: source_data?.keyword,
        source_url: source_data?.url,
        referring_domain: source_data?.referring_domain,
        interaction_type: interaction_data?.type || 'view',
        interaction_value: interaction_data?.value || 1,
        time_spent_seconds: interaction_data?.time_spent,
        first_touch_attribution: attributionWeights.first_touch,
        last_touch_attribution: attributionWeights.last_touch,
        linear_attribution: attributionWeights.linear,
        time_decay_attribution: attributionWeights.time_decay,
        device_type: interaction_data?.device_type,
        traffic_source: interaction_data?.traffic_source,
        utm_source: interaction_data?.utm_source,
        utm_medium: interaction_data?.utm_medium,
        utm_campaign: interaction_data?.utm_campaign,
        is_conversion: interaction_data?.is_conversion || false,
        conversion_type: interaction_data?.conversion_type,
        conversion_value: interaction_data?.conversion_value
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Update attribution weights for previous touchpoints
    if (existingAttribution.length > 0) {
      await updatePreviousAttributionWeights(supabase, campaign_id, user_id || session_id, nextStep)
    }
    
    // If this is a conversion, update campaign performance
    if (interaction_data?.is_conversion) {
      await updateConversionMetrics(supabase, campaign_id, pillar_source, interaction_data.conversion_value)
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        attribution_id: newAttribution.id,
        journey_step: nextStep,
        attribution_weights: attributionWeights
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Attribution tracking error:', error)
    throw error
  }
}

async function optimizePillarAllocation(supabase: any, tenantId: string, data: any) {
  console.log('⚖️ Optimizing pillar allocation...')
  
  const { campaign_id } = data
  
  try {
    // Get current pillar performance
    const [performanceData, attributionData, pillarData] = await Promise.all([
      getPerformanceData(supabase, campaign_id),
      getAttributionData(supabase, campaign_id),
      getPillarData(supabase, campaign_id)
    ])
    
    if (performanceData.length === 0) {
      throw new Error('Insufficient performance data for optimization')
    }
    
    const latestPerf = performanceData[0]
    
    // Calculate pillar efficiency scores
    const pillarEfficiency = {
      content: calculatePillarEfficiency('content', latestPerf, attributionData, pillarData),
      pr: calculatePillarEfficiency('pr', latestPerf, attributionData, pillarData),
      seo: calculatePillarEfficiency('seo', latestPerf, attributionData, pillarData)
    }
    
    // Generate optimization recommendations
    const recommendations = generateAllocationRecommendations(pillarEfficiency, pillarData)
    
    // Calculate projected improvements
    const projectedImprovement = calculateProjectedImprovement(recommendations, latestPerf)
    
    return new Response(
      JSON.stringify({
        success: true,
        current_allocation: pillarData.reduce((acc: any, p: any) => {
          acc[p.pillar_type] = p.pillar_weight
          return acc
        }, {}),
        pillar_efficiency: pillarEfficiency,
        recommendations: recommendations,
        projected_improvement: projectedImprovement
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Pillar optimization error:', error)
    throw error
  }
}

async function predictCampaignPerformance(supabase: any, tenantId: string, data: any) {
  console.log('🔮 Predicting campaign performance...')
  
  const { campaign_id, prediction_days = 30 } = data
  
  try {
    // Get historical performance data
    const performanceData = await getPerformanceData(supabase, campaign_id, 'daily')
    
    if (performanceData.length < 7) {
      throw new Error('Insufficient historical data for prediction')
    }
    
    // Calculate trends for key metrics
    const trends = calculatePerformanceTrends(performanceData)
    
    // Generate predictions based on trends and seasonality
    const predictions = generatePerformancePredictions(trends, prediction_days)
    
    // Calculate confidence intervals
    const confidence = calculatePredictionConfidence(performanceData, trends)
    
    return new Response(
      JSON.stringify({
        success: true,
        prediction_period_days: prediction_days,
        trends: trends,
        predictions: predictions,
        confidence_score: confidence,
        recommendations: generatePredictionRecommendations(predictions, trends)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Performance prediction error:', error)
    throw error
  }
}

async function syncCrossPillarData(supabase: any, tenantId: string, data: any) {
  console.log('🔄 Syncing cross-pillar data...')
  
  const { campaign_id } = data
  
  try {
    // Get pillar data
    const pillars = await getPillarData(supabase, campaign_id)
    
    const syncResults = []
    
    for (const pillar of pillars) {
      let pillarData = null
      
      switch (pillar.pillar_type) {
        case 'content':
          if (pillar.content_campaign_id) {
            pillarData = await syncContentData(supabase, pillar.content_campaign_id)
          }
          break
        case 'pr':
          if (pillar.pr_campaign_id) {
            pillarData = await syncPRData(supabase, pillar.pr_campaign_id)
          }
          break
        case 'seo':
          if (pillar.seo_project_id) {
            pillarData = await syncSEOData(supabase, pillar.seo_project_id)
          }
          break
      }
      
      if (pillarData) {
        syncResults.push({
          pillar_type: pillar.pillar_type,
          pillar_id: pillar.id,
          synced_data: pillarData,
          last_sync: new Date().toISOString()
        })
        
        // Update pillar metrics
        await supabase
          .from('campaign_pillars')
          .update({
            target_metrics: pillarData.metrics,
            updated_at: new Date().toISOString()
          })
          .eq('id', pillar.id)
      }
    }
    
    // Update campaign performance with aggregated data
    await updateAggregatedPerformance(supabase, campaign_id, syncResults)
    
    return new Response(
      JSON.stringify({
        success: true,
        synced_pillars: syncResults.length,
        sync_results: syncResults,
        last_sync: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Cross-pillar sync error:', error)
    throw error
  }
}

// Helper functions
async function getCampaignData(supabase: any, campaignId: string) {
  const { data, error } = await supabase
    .from('unified_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single()
  
  if (error) throw error
  return data
}

async function getPerformanceData(supabase: any, campaignId: string, period = 'campaign_total') {
  const { data, error } = await supabase
    .from('campaign_performance')
    .select('*')
    .eq('unified_campaign_id', campaignId)
    .eq('reporting_period', period)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

async function getAttributionData(supabase: any, campaignId: string) {
  const { data, error } = await supabase
    .from('campaign_attribution')
    .select('*')
    .eq('unified_campaign_id', campaignId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

async function getPillarData(supabase: any, campaignId: string) {
  const { data, error } = await supabase
    .from('campaign_pillars')
    .select('*')
    .eq('unified_campaign_id', campaignId)
  
  if (error) throw error
  return data || []
}

function analyzePillarAttribution(attributionData: any[]) {
  const pillarContribution = { content: 0, pr: 0, seo: 0, direct: 0 }
  
  attributionData.forEach(attr => {
    pillarContribution[attr.pillar_source] += attr.linear_attribution || 0
  })
  
  const total = Object.values(pillarContribution).reduce((sum, val) => sum + val, 0)
  
  // Convert to percentages
  Object.keys(pillarContribution).forEach(pillar => {
    pillarContribution[pillar] = total > 0 ? (pillarContribution[pillar] / total) * 100 : 0
  })
  
  return pillarContribution
}

function getPillarOptimizationActions(pillarType: string) {
  const actions = {
    content: [
      'Review content performance and update underperforming pieces',
      'Increase content distribution across social channels',
      'Optimize content for search engines and user engagement'
    ],
    pr: [
      'Target higher-authority publications and journalists',
      'Improve press release content and newsworthiness',
      'Build stronger relationships with key media contacts'
    ],
    seo: [
      'Focus on high-opportunity keywords with better conversion potential',
      'Improve technical SEO and page speed optimization',
      'Build higher-quality backlinks from relevant domains'
    ]
  }
  
  return actions[pillarType] || []
}

async function analyzeCrossPillarSynergy(supabase: any, campaignId: string, attributionData: any[]) {
  const insights = []
  
  // Analyze multi-touch journeys
  const userJourneys = new Map()
  attributionData.forEach(attr => {
    if (!attr.user_id) return
    
    if (!userJourneys.has(attr.user_id)) {
      userJourneys.set(attr.user_id, [])
    }
    userJourneys.get(attr.user_id).push(attr)
  })
  
  // Find successful cross-pillar patterns
  const successfulPatterns = Array.from(userJourneys.values())
    .filter(journey => journey.some(touch => touch.is_conversion))
    .filter(journey => journey.length > 1)
  
  if (successfulPatterns.length > 0) {
    const commonPatterns = findCommonJourneyPatterns(successfulPatterns)
    
    insights.push({
      insight_type: 'cross_pillar_opportunity',
      insight_category: 'synergy',
      title: 'High-Converting Cross-Pillar Journey Identified',
      description: `${commonPatterns.length} common high-converting journey patterns found across pillars`,
      severity: 'medium',
      confidence_score: 88,
      recommended_actions: [
        'Replicate successful journey patterns in other campaigns',
        'Create coordinated content that guides users through optimal paths',
        'Set up retargeting campaigns for users following these patterns'
      ],
      affects_content: true,
      affects_pr: true,
      affects_seo: true,
      priority_score: 85,
      cross_pillar_impact: { patterns: commonPatterns }
    })
  }
  
  return insights
}

function calculateAttributionWeights(step: number, existingAttribution: any[]) {
  return {
    first_touch: step === 1 ? 100 : 0,
    last_touch: 100, // Will be updated when next touchpoint occurs
    linear: 100 / step, // Equal weight distributed
    time_decay: calculateTimeDecayWeight(step)
  }
}

function calculateTimeDecayWeight(step: number) {
  // More recent interactions get higher weight
  const decayRate = 0.7
  return 100 * Math.pow(decayRate, step - 1)
}

async function updatePreviousAttributionWeights(supabase: any, campaignId: string, userId: string, currentStep: number) {
  // Update last_touch_attribution for all previous steps to 0
  await supabase
    .from('campaign_attribution')
    .update({ last_touch_attribution: 0 })
    .eq('unified_campaign_id', campaignId)
    .eq('user_id', userId)
    .lt('journey_step', currentStep)
}

async function updateConversionMetrics(supabase: any, campaignId: string, pillarSource: string, conversionValue: number) {
  // Get latest performance record
  const { data: latestPerf } = await supabase
    .from('campaign_performance')
    .select('*')
    .eq('unified_campaign_id', campaignId)
    .eq('reporting_period', 'campaign_total')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (latestPerf) {
    const updates: any = {
      total_conversions: (latestPerf.total_conversions || 0) + 1
    }
    
    // Update pillar-specific conversions
    switch (pillarSource) {
      case 'content':
        updates.content_attributed_conversions = (latestPerf.content_attributed_conversions || 0) + 1
        break
      case 'pr':
        updates.pr_attributed_conversions = (latestPerf.pr_attributed_conversions || 0) + 1
        break
      case 'seo':
        updates.seo_attributed_conversions = (latestPerf.seo_attributed_conversions || 0) + 1
        break
    }
    
    await supabase
      .from('campaign_performance')
      .update(updates)
      .eq('id', latestPerf.id)
  }
}

function calculatePillarEfficiency(pillarType: string, performance: any, attribution: any[], pillars: any[]) {
  const pillar = pillars.find(p => p.pillar_type === pillarType)
  if (!pillar) return 0
  
  const weight = pillar.pillar_weight
  const budget = pillar.pillar_budget || 0
  
  let conversions = 0
  let spend = 0
  
  switch (pillarType) {
    case 'content':
      conversions = performance.content_attributed_conversions || 0
      spend = budget * 0.33 // Simplified budget allocation
      break
    case 'pr':
      conversions = performance.pr_attributed_conversions || 0
      spend = budget * 0.33
      break
    case 'seo':
      conversions = performance.seo_attributed_conversions || 0
      spend = budget * 0.34
      break
  }
  
  const efficiency = spend > 0 ? conversions / spend : 0
  return Math.round(efficiency * 1000) / 1000
}

function generateAllocationRecommendations(efficiency: any, pillars: any[]) {
  const totalWeight = pillars.reduce((sum, p) => sum + p.pillar_weight, 0)
  const avgEfficiency = Object.values(efficiency).reduce((sum: any, eff: any) => sum + eff, 0) / 3
  
  return Object.keys(efficiency).map(pillar => {
    const currentWeight = pillars.find(p => p.pillar_type === pillar)?.pillar_weight || 0
    const pillarEfficiency = efficiency[pillar]
    
    let recommendedChange = 0
    if (pillarEfficiency > avgEfficiency * 1.2) {
      recommendedChange = 5 // Increase by 5%
    } else if (pillarEfficiency < avgEfficiency * 0.8) {
      recommendedChange = -5 // Decrease by 5%
    }
    
    return {
      pillar: pillar,
      current_weight: currentWeight,
      recommended_weight: Math.max(10, Math.min(70, currentWeight + recommendedChange)),
      efficiency_score: pillarEfficiency,
      change_reason: pillarEfficiency > avgEfficiency ? 'High efficiency' : 'Low efficiency'
    }
  })
}

function calculateProjectedImprovement(recommendations: any[], currentPerformance: any) {
  // Simplified projection based on efficiency improvements
  const totalConversions = currentPerformance.total_conversions || 0
  const projectedIncrease = recommendations.reduce((sum, rec) => {
    const change = rec.recommended_weight - rec.current_weight
    return sum + (change * 0.01 * totalConversions * 0.1) // 10% improvement per 1% weight increase
  }, 0)
  
  return {
    current_conversions: totalConversions,
    projected_conversions: Math.round(totalConversions + projectedIncrease),
    improvement_percentage: totalConversions > 0 ? Math.round((projectedIncrease / totalConversions) * 100) : 0
  }
}

function calculatePerformanceTrends(performanceData: any[]) {
  if (performanceData.length < 2) return {}
  
  const metrics = ['total_conversions', 'total_clicks', 'total_impressions', 'cost_per_conversion']
  const trends: any = {}
  
  metrics.forEach(metric => {
    const values = performanceData.map(p => p[metric] || 0).reverse()
    const trend = calculateTrendDirection(values)
    trends[metric] = trend
  })
  
  return trends
}

function calculateTrendDirection(values: number[]) {
  if (values.length < 2) return { direction: 'stable', change: 0 }
  
  const recent = values.slice(-3).reduce((sum, val) => sum + val, 0) / 3
  const previous = values.slice(-6, -3).reduce((sum, val) => sum + val, 0) / 3
  
  const change = previous > 0 ? ((recent - previous) / previous) * 100 : 0
  
  return {
    direction: change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable',
    change: Math.round(change * 100) / 100
  }
}

function generatePerformancePredictions(trends: any, days: number) {
  const predictions: any = {}
  
  Object.keys(trends).forEach(metric => {
    const trend = trends[metric]
    const baseValue = 100 // Simplified base value
    
    let predictedValue = baseValue
    if (trend.direction === 'increasing') {
      predictedValue = baseValue * (1 + (trend.change / 100) * (days / 30))
    } else if (trend.direction === 'decreasing') {
      predictedValue = baseValue * (1 + (trend.change / 100) * (days / 30))
    }
    
    predictions[metric] = {
      predicted_value: Math.round(predictedValue),
      confidence: calculatePredictionConfidence([baseValue], trend),
      trend_direction: trend.direction
    }
  })
  
  return predictions
}

function calculatePredictionConfidence(historicalData: any[], trend: any) {
  // Simplified confidence calculation based on data consistency
  const dataPoints = historicalData.length
  const trendStrength = Math.abs(trend.change || 0)
  
  let confidence = 50 // Base confidence
  confidence += Math.min(dataPoints * 2, 30) // More data = higher confidence
  confidence += Math.min(trendStrength, 20) // Stronger trend = higher confidence
  
  return Math.min(95, Math.max(20, confidence))
}

function generatePredictionRecommendations(predictions: any, trends: any) {
  const recommendations = []
  
  Object.keys(predictions).forEach(metric => {
    const prediction = predictions[metric]
    
    if (prediction.trend_direction === 'decreasing') {
      recommendations.push(`${metric} is trending down - consider intervention strategies`)
    } else if (prediction.trend_direction === 'increasing') {
      recommendations.push(`${metric} is trending up - maintain current strategies`)
    }
  })
  
  return recommendations
}

async function syncContentData(supabase: any, campaignId: string) {
  const { data: contentPieces, error } = await supabase
    .from('content_pieces')
    .select('*')
    .eq('campaign_id', campaignId)
  
  if (error) throw error
  
  return {
    metrics: {
      total_pieces: contentPieces?.length || 0,
      total_views: contentPieces?.reduce((sum: number, piece: any) => sum + (piece.view_count || 0), 0) || 0,
      total_engagement: contentPieces?.reduce((sum: number, piece: any) => sum + (piece.like_count || 0) + (piece.share_count || 0), 0) || 0
    },
    data: contentPieces
  }
}

async function syncPRData(supabase: any, campaignId: string) {
  const { data: prCampaign, error } = await supabase
    .from('pr_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single()
  
  if (error) throw error
  
  return {
    metrics: {
      impressions: prCampaign?.impression_count || 0,
      reach: prCampaign?.reach_count || 0,
      engagement_rate: prCampaign?.engagement_rate || 0
    },
    data: prCampaign
  }
}

async function syncSEOData(supabase: any, projectId: string) {
  const [{ data: keywords }, { data: project }] = await Promise.all([
    supabase.from('seo_keywords').select('*').eq('project_id', projectId),
    supabase.from('seo_projects').select('*').eq('id', projectId).single()
  ])
  
  return {
    metrics: {
      total_keywords: keywords?.length || 0,
      avg_position: project?.avg_position || 0,
      organic_traffic: project?.organic_traffic_estimate || 0,
      visibility_score: project?.visibility_score || 0
    },
    data: { project, keywords }
  }
}

async function updateAggregatedPerformance(supabase: any, campaignId: string, syncResults: any[]) {
  const aggregatedMetrics = {
    total_impressions: 0,
    total_reach: 0,
    total_engagement: 0,
    content_views: 0,
    media_impressions: 0,
    organic_traffic: 0
  }
  
  syncResults.forEach(result => {
    const metrics = result.synced_data.metrics
    
    switch (result.pillar_type) {
      case 'content':
        aggregatedMetrics.content_views += metrics.total_views || 0
        aggregatedMetrics.total_engagement += metrics.total_engagement || 0
        break
      case 'pr':
        aggregatedMetrics.media_impressions += metrics.impressions || 0
        aggregatedMetrics.total_reach += metrics.reach || 0
        break
      case 'seo':
        aggregatedMetrics.organic_traffic += metrics.organic_traffic || 0
        break
    }
  })
  
  // Update or create performance record
  const { error } = await supabase
    .from('campaign_performance')
    .upsert({
      unified_campaign_id: campaignId,
      reporting_period: 'campaign_total',
      period_start: new Date().toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0],
      ...aggregatedMetrics
    })
  
  if (error) {
    console.error('Error updating aggregated performance:', error)
  }
}

function findCommonJourneyPatterns(journeys: any[][]) {
  // Simplified pattern finding - look for common pillar sequences
  const patterns = new Map()
  
  journeys.forEach(journey => {
    const sequence = journey.map(touch => touch.pillar_source).join('->')
    patterns.set(sequence, (patterns.get(sequence) || 0) + 1)
  })
  
  return Array.from(patterns.entries())
    .filter(([pattern, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pattern, count]) => ({ pattern, occurrences: count }))
}