export interface ContactIntelligence {
  contact_id: string
  ai_categorization: {
    primary_beat: string
    secondary_beats: string[]
    confidence_score: number
    expertise_areas: string[]
    content_preferences: string[]
  }
  influence_analysis: {
    influence_tier: 'tier_1' | 'tier_2' | 'tier_3' | 'emerging'
    reach_estimate: number
    engagement_quality: 'high' | 'medium' | 'low'
    authority_indicators: string[]
  }
  geographic_analysis: {
    primary_coverage_area: string
    secondary_coverage_areas: string[]
    time_zone: string
    local_influence_score: number
  }
  communication_intelligence: {
    preferred_contact_method: string
    optimal_contact_times: string[]
    response_likelihood: number
    pitch_preferences: {
      preferred_length: 'short' | 'medium' | 'long'
      preferred_style: 'data-driven' | 'narrative' | 'exclusive' | 'breaking'
      embargo_comfort: boolean
      multimedia_preference: boolean
    }
  }
  content_format_analysis: {
    article_preference: boolean
    video_content: boolean
    podcast_participation: boolean
    social_media_focus: boolean
    newsletter_writing: boolean
    live_reporting: boolean
  }
  relationship_insights: {
    networking_score: number
    collaboration_likelihood: number
    follow_up_sensitivity: 'high' | 'medium' | 'low'
    exclusivity_preference: boolean
  }
}

export class ContactIntelligenceProcessor {
  private supabaseClient: any
  private openaiApiKey: string

  // Beat classification keywords
  private beatKeywords = {
    'technology': [
      'AI', 'artificial intelligence', 'machine learning', 'blockchain', 'cryptocurrency',
      'software', 'hardware', 'tech', 'startup', 'silicon valley', 'venture capital',
      'cybersecurity', 'cloud computing', 'data', 'digital transformation', 'SaaS'
    ],
    'business': [
      'finance', 'economy', 'markets', 'stocks', 'trading', 'investment', 'banking',
      'enterprise', 'corporate', 'M&A', 'IPO', 'earnings', 'revenue', 'profit',
      'business strategy', 'management', 'leadership', 'entrepreneurship'
    ],
    'healthcare': [
      'medicine', 'medical', 'health', 'pharmaceutical', 'biotech', 'clinical trials',
      'FDA', 'drug approval', 'healthcare policy', 'medical devices', 'telemedicine',
      'mental health', 'public health', 'epidemic', 'vaccine', 'treatment'
    ],
    'politics': [
      'government', 'congress', 'senate', 'house', 'politics', 'policy', 'legislation',
      'election', 'campaign', 'voting', 'democracy', 'republican', 'democrat',
      'white house', 'supreme court', 'federal', 'state government', 'local politics'
    ],
    'sports': [
      'football', 'basketball', 'baseball', 'soccer', 'tennis', 'golf', 'hockey',
      'olympics', 'championship', 'playoffs', 'athlete', 'coach', 'team', 'league',
      'sports business', 'broadcasting', 'fantasy sports', 'sports betting'
    ],
    'entertainment': [
      'movies', 'film', 'television', 'streaming', 'music', 'celebrity', 'hollywood',
      'awards', 'box office', 'concert', 'album', 'gaming', 'social media influencer',
      'content creator', 'media', 'broadcasting', 'production'
    ],
    'science': [
      'research', 'study', 'experiment', 'discovery', 'climate', 'environment',
      'space', 'NASA', 'physics', 'chemistry', 'biology', 'genetics', 'evolution',
      'renewable energy', 'sustainability', 'conservation', 'scientific breakthrough'
    ],
    'education': [
      'school', 'university', 'college', 'education policy', 'student', 'teacher',
      'curriculum', 'online learning', 'distance education', 'higher education',
      'K-12', 'academic', 'research university', 'education technology'
    ]
  }

  // Geographic indicators
  private geographicIndicators = {
    'northeast': ['new york', 'boston', 'philadelphia', 'washington dc', 'baltimore'],
    'southeast': ['atlanta', 'miami', 'charlotte', 'nashville', 'orlando'],
    'midwest': ['chicago', 'detroit', 'cleveland', 'milwaukee', 'minneapolis'],
    'southwest': ['dallas', 'houston', 'austin', 'phoenix', 'denver'],
    'west_coast': ['los angeles', 'san francisco', 'seattle', 'portland', 'san diego'],
    'international': ['london', 'toronto', 'sydney', 'mumbai', 'singapore']
  }

  constructor(supabaseClient: any) {
    this.supabaseClient = supabaseClient
    this.openaiApiKey = Deno.env.get('OPENAI_API_KEY') || ''
  }

  async categorizeContacts(contactIds: string[], tenantId: string): Promise<{ 
    processed_contacts: ContactIntelligence[], 
    summary: any 
  }> {
    console.log(`Starting AI categorization for ${contactIds.length} contacts`)
    
    const processedContacts: ContactIntelligence[] = []
    let successCount = 0
    let failureCount = 0

    // Process contacts in smaller batches for AI analysis
    const batchSize = 3
    for (let i = 0; i < contactIds.length; i += batchSize) {
      const batch = contactIds.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (contactId) => {
        try {
          const intelligence = await this.processContactIntelligence(contactId, tenantId)
          if (intelligence) {
            processedContacts.push(intelligence)
            successCount++
          } else {
            failureCount++
          }
        } catch (error) {
          console.error(`Intelligence processing failed for contact ${contactId}:`, error)
          failureCount++
        }
      })

      await Promise.all(batchPromises)
      
      // Rate limiting for AI API calls
      if (i + batchSize < contactIds.length) {
        await this.delay(3000)
      }
    }

    // Update database with intelligence insights
    await this.updateContactIntelligence(processedContacts, tenantId)

    const summary = {
      total_processed: contactIds.length,
      successful_categorizations: successCount,
      failed_categorizations: failureCount,
      beat_distribution: this.calculateBeatDistribution(processedContacts),
      influence_distribution: this.calculateInfluenceDistribution(processedContacts),
      processing_completed_at: new Date().toISOString()
    }

    console.log('Intelligence processing completed:', summary)
    return { processed_contacts: processedContacts, summary }
  }

  private async processContactIntelligence(contactId: string, tenantId: string): Promise<ContactIntelligence | null> {
    try {
      // Fetch contact with related outlet information
      const { data: contact } = await this.supabaseClient
        .from('journalist_contacts')
        .select(`
          *,
          media_outlets (
            name,
            website,
            outlet_type,
            category,
            domain_authority,
            monthly_visitors
          )
        `)
        .eq('id', contactId)
        .eq('tenant_id', tenantId)
        .single()

      if (!contact) {
        console.error(`Contact not found: ${contactId}`)
        return null
      }

      console.log(`Processing intelligence for: ${contact.first_name} ${contact.last_name}`)

      // Gather all available data for AI analysis
      const contextData = this.prepareContextData(contact)

      // Run AI categorization processes
      const [
        aiCategorization,
        influenceAnalysis,
        geographicAnalysis,
        communicationIntelligence,
        contentFormatAnalysis,
        relationshipInsights
      ] = await Promise.all([
        this.performAICategorization(contextData),
        this.analyzeInfluence(contact),
        this.analyzeGeography(contact),
        this.analyzeCommunicationPatterns(contact),
        this.analyzeContentFormats(contact),
        this.analyzeRelationshipFactors(contact)
      ])

      const intelligence: ContactIntelligence = {
        contact_id: contactId,
        ai_categorization: aiCategorization,
        influence_analysis: influenceAnalysis,
        geographic_analysis: geographicAnalysis,
        communication_intelligence: communicationIntelligence,
        content_format_analysis: contentFormatAnalysis,
        relationship_insights: relationshipInsights
      }

      return intelligence

    } catch (error) {
      console.error(`Error processing contact intelligence ${contactId}:`, error)
      return null
    }
  }

  private prepareContextData(contact: any): string {
    const contextParts: string[] = []
    
    contextParts.push(`Name: ${contact.first_name} ${contact.last_name}`)
    
    if (contact.title) {
      contextParts.push(`Title: ${contact.title}`)
    }
    
    if (contact.bio) {
      contextParts.push(`Bio: ${contact.bio}`)
    }
    
    if (contact.beat) {
      contextParts.push(`Beat: ${contact.beat}`)
    }
    
    if (contact.media_outlets) {
      contextParts.push(`Outlet: ${contact.media_outlets.name}`)
      contextParts.push(`Outlet Type: ${contact.media_outlets.outlet_type}`)
      if (contact.media_outlets.category) {
        contextParts.push(`Outlet Category: ${contact.media_outlets.category}`)
      }
    }
    
    if (contact.location) {
      contextParts.push(`Location: ${contact.location}`)
    }
    
    if (contact.secondary_beats && contact.secondary_beats.length > 0) {
      contextParts.push(`Secondary Beats: ${contact.secondary_beats.join(', ')}`)
    }
    
    return contextParts.join('\n')
  }

  private async performAICategorization(contextData: string): Promise<ContactIntelligence['ai_categorization']> {
    try {
      if (!this.openaiApiKey) {
        // Fallback to rule-based categorization
        return this.performRuleBasedCategorization(contextData)
      }

      const prompt = `
Analyze the following journalist profile and provide categorization insights:

${contextData}

Please analyze and provide:
1. Primary beat/specialty area
2. Secondary beats (if applicable)
3. Specific expertise areas
4. Content preferences based on background
5. Confidence score for the categorization (0-100)

Respond in JSON format:
{
  "primary_beat": "string",
  "secondary_beats": ["string"],
  "confidence_score": number,
  "expertise_areas": ["string"],
  "content_preferences": ["string"]
}
`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert media analyst who categorizes journalists based on their background and expertise.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = data.choices[0].message.content

      try {
        const parsedResponse = JSON.parse(aiResponse)
        return {
          primary_beat: parsedResponse.primary_beat || 'general',
          secondary_beats: parsedResponse.secondary_beats || [],
          confidence_score: parsedResponse.confidence_score || 50,
          expertise_areas: parsedResponse.expertise_areas || [],
          content_preferences: parsedResponse.content_preferences || []
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError)
        return this.performRuleBasedCategorization(contextData)
      }

    } catch (error) {
      console.error('AI categorization error:', error)
      return this.performRuleBasedCategorization(contextData)
    }
  }

  private performRuleBasedCategorization(contextData: string): ContactIntelligence['ai_categorization'] {
    const lowerContext = contextData.toLowerCase()
    
    let primaryBeat = 'general'
    const secondaryBeats: string[] = []
    let confidenceScore = 0

    // Find primary beat based on keyword matches
    for (const [beat, keywords] of Object.entries(this.beatKeywords)) {
      const matchCount = keywords.filter(keyword => 
        lowerContext.includes(keyword.toLowerCase())
      ).length

      if (matchCount > 0) {
        if (matchCount > confidenceScore) {
          if (primaryBeat !== 'general') {
            secondaryBeats.push(primaryBeat)
          }
          primaryBeat = beat
          confidenceScore = matchCount
        } else {
          secondaryBeats.push(beat)
        }
      }
    }

    // Calculate final confidence score
    const finalConfidence = Math.min((confidenceScore / 3) * 100, 100)

    return {
      primary_beat: primaryBeat,
      secondary_beats: secondaryBeats.slice(0, 3), // Limit to top 3
      confidence_score: finalConfidence,
      expertise_areas: this.extractExpertiseAreas(lowerContext),
      content_preferences: this.inferContentPreferences(lowerContext)
    }
  }

  private extractExpertiseAreas(context: string): string[] {
    const expertiseIndicators = [
      'startup', 'venture capital', 'IPO', 'M&A', 'blockchain', 'AI',
      'machine learning', 'cybersecurity', 'cloud computing', 'fintech',
      'biotech', 'pharmaceutical', 'medical devices', 'clinical trials',
      'renewable energy', 'climate change', 'sustainability', 'space',
      'elections', 'policy', 'regulation', 'international relations'
    ]

    return expertiseIndicators.filter(area => 
      context.includes(area.toLowerCase())
    ).slice(0, 5)
  }

  private inferContentPreferences(context: string): string[] {
    const preferences: string[] = []

    if (context.includes('data') || context.includes('research') || context.includes('study')) {
      preferences.push('data-driven stories')
    }

    if (context.includes('breaking') || context.includes('news') || context.includes('urgent')) {
      preferences.push('breaking news')
    }

    if (context.includes('analysis') || context.includes('opinion') || context.includes('commentary')) {
      preferences.push('analytical pieces')
    }

    if (context.includes('feature') || context.includes('profile') || context.includes('in-depth')) {
      preferences.push('feature stories')
    }

    if (context.includes('exclusive') || context.includes('scoop')) {
      preferences.push('exclusive content')
    }

    return preferences.slice(0, 3)
  }

  private async analyzeInfluence(contact: any): Promise<ContactIntelligence['influence_analysis']> {
    try {
      let influenceTier: 'tier_1' | 'tier_2' | 'tier_3' | 'emerging' = 'tier_3'
      let reachEstimate = 1000
      let engagementQuality: 'high' | 'medium' | 'low' = 'medium'
      const authorityIndicators: string[] = []

      // Analyze outlet influence
      if (contact.media_outlets) {
        const outlet = contact.media_outlets
        
        if (outlet.domain_authority >= 80 || outlet.monthly_visitors >= 10000000) {
          influenceTier = 'tier_1'
          reachEstimate = 100000
          engagementQuality = 'high'
          authorityIndicators.push('high_authority_outlet')
        } else if (outlet.domain_authority >= 60 || outlet.monthly_visitors >= 1000000) {
          influenceTier = 'tier_2'
          reachEstimate = 50000
          engagementQuality = 'medium'
          authorityIndicators.push('medium_authority_outlet')
        }
      }

      // Analyze title influence
      if (contact.title) {
        const influentialTitles = ['editor-in-chief', 'senior editor', 'chief correspondent', 'bureau chief']
        const title = contact.title.toLowerCase()
        
        if (influentialTitles.some(t => title.includes(t))) {
          if (influenceTier === 'tier_3') influenceTier = 'tier_2'
          authorityIndicators.push('senior_position')
        }
      }

      // Analyze social media influence
      if (contact.twitter_handle || contact.linkedin_url) {
        authorityIndicators.push('social_media_presence')
        reachEstimate *= 1.5
      }

      // Analyze experience indicators
      if (contact.interaction_count >= 10) {
        authorityIndicators.push('established_relationships')
      }

      if (contact.expertise_score >= 80) {
        authorityIndicators.push('subject_matter_expert')
        if (influenceTier === 'tier_3') influenceTier = 'tier_2'
      }

      return {
        influence_tier: influenceTier,
        reach_estimate: Math.floor(reachEstimate),
        engagement_quality: engagementQuality,
        authority_indicators: authorityIndicators
      }

    } catch (error) {
      console.error('Influence analysis error:', error)
      return {
        influence_tier: 'tier_3',
        reach_estimate: 1000,
        engagement_quality: 'medium',
        authority_indicators: []
      }
    }
  }

  private async analyzeGeography(contact: any): Promise<ContactIntelligence['geographic_analysis']> {
    try {
      let primaryCoverageArea = 'national'
      const secondaryCoverageAreas: string[] = []
      let timeZone = 'America/New_York' // Default
      let localInfluenceScore = 50

      if (contact.location) {
        const location = contact.location.toLowerCase()
        
        // Determine coverage area based on location
        for (const [region, cities] of Object.entries(this.geographicIndicators)) {
          if (cities.some(city => location.includes(city))) {
            primaryCoverageArea = region
            
            // Set timezone based on region
            switch (region) {
              case 'west_coast':
                timeZone = 'America/Los_Angeles'
                break
              case 'midwest':
                timeZone = 'America/Chicago'
                break
              case 'southwest':
                timeZone = 'America/Denver'
                break
              case 'international':
                timeZone = 'UTC'
                break
              default:
                timeZone = 'America/New_York'
            }
            
            break
          }
        }

        // Calculate local influence based on market size
        const majorMarkets = ['new york', 'los angeles', 'chicago', 'washington dc', 'san francisco']
        if (majorMarkets.some(market => location.includes(market))) {
          localInfluenceScore = 85
        } else {
          localInfluenceScore = 65
        }
      }

      // Analyze coverage areas from bio/beat
      if (contact.bio) {
        const bio = contact.bio.toLowerCase()
        if (bio.includes('international') || bio.includes('global')) {
          secondaryCoverageAreas.push('international')
        }
        if (bio.includes('national') || bio.includes('nationwide')) {
          secondaryCoverageAreas.push('national')
        }
        if (bio.includes('local') || bio.includes('regional')) {
          secondaryCoverageAreas.push('local')
        }
      }

      return {
        primary_coverage_area: primaryCoverageArea,
        secondary_coverage_areas: secondaryCoverageAreas,
        time_zone: timeZone,
        local_influence_score: localInfluenceScore
      }

    } catch (error) {
      console.error('Geographic analysis error:', error)
      return {
        primary_coverage_area: 'national',
        secondary_coverage_areas: [],
        time_zone: 'America/New_York',
        local_influence_score: 50
      }
    }
  }

  private async analyzeCommunicationPatterns(contact: any): Promise<ContactIntelligence['communication_intelligence']> {
    try {
      let preferredContactMethod = 'email'
      const optimalContactTimes: string[] = []
      let responseLikelihood = 50

      // Analyze response patterns
      if (contact.response_rate) {
        responseLikelihood = contact.response_rate
      }

      // Determine optimal contact times based on timezone and role
      if (contact.timezone) {
        // Morning is typically best for journalists
        optimalContactTimes.push('9:00-11:00 AM')
        optimalContactTimes.push('2:00-4:00 PM')
      } else {
        optimalContactTimes.push('morning', 'early_afternoon')
      }

      // Analyze communication preferences from past interactions
      const pitchPreferences = {
        preferred_length: 'medium' as const,
        preferred_style: 'data-driven' as const,
        embargo_comfort: true,
        multimedia_preference: false
      }

      // Adjust based on beat
      if (contact.beat === 'technology') {
        pitchPreferences.preferred_style = 'data-driven'
        pitchPreferences.multimedia_preference = true
      } else if (contact.beat === 'entertainment') {
        pitchPreferences.preferred_style = 'narrative'
        pitchPreferences.multimedia_preference = true
      } else if (contact.beat === 'politics') {
        pitchPreferences.preferred_style = 'breaking'
        pitchPreferences.embargo_comfort = false
      }

      // Adjust based on outlet type
      if (contact.media_outlets?.outlet_type === 'digital_native') {
        pitchPreferences.preferred_length = 'short'
        responseLikelihood += 10
      }

      return {
        preferred_contact_method: preferredContactMethod,
        optimal_contact_times: optimalContactTimes,
        response_likelihood: Math.min(responseLikelihood, 100),
        pitch_preferences: pitchPreferences
      }

    } catch (error) {
      console.error('Communication analysis error:', error)
      return {
        preferred_contact_method: 'email',
        optimal_contact_times: ['morning'],
        response_likelihood: 50,
        pitch_preferences: {
          preferred_length: 'medium',
          preferred_style: 'data-driven',
          embargo_comfort: true,
          multimedia_preference: false
        }
      }
    }
  }

  private async analyzeContentFormats(contact: any): Promise<ContactIntelligence['content_format_analysis']> {
    try {
      const analysis = {
        article_preference: true, // Default for most journalists
        video_content: false,
        podcast_participation: false,
        social_media_focus: false,
        newsletter_writing: false,
        live_reporting: false
      }

      // Analyze based on outlet type
      if (contact.media_outlets) {
        const outletType = contact.media_outlets.outlet_type
        
        switch (outletType) {
          case 'podcast':
            analysis.podcast_participation = true
            break
          case 'tv':
            analysis.video_content = true
            analysis.live_reporting = true
            break
          case 'digital_native':
            analysis.social_media_focus = true
            analysis.video_content = true
            break
          case 'newsletter':
            analysis.newsletter_writing = true
            break
        }
      }

      // Analyze based on title
      if (contact.title) {
        const title = contact.title.toLowerCase()
        
        if (title.includes('video') || title.includes('tv')) {
          analysis.video_content = true
        }
        
        if (title.includes('podcast') || title.includes('host')) {
          analysis.podcast_participation = true
        }
        
        if (title.includes('social') || title.includes('digital')) {
          analysis.social_media_focus = true
        }
        
        if (title.includes('live') || title.includes('breaking')) {
          analysis.live_reporting = true
        }
      }

      // Analyze social media presence
      if (contact.twitter_handle) {
        analysis.social_media_focus = true
      }

      return analysis

    } catch (error) {
      console.error('Content format analysis error:', error)
      return {
        article_preference: true,
        video_content: false,
        podcast_participation: false,
        social_media_focus: false,
        newsletter_writing: false,
        live_reporting: false
      }
    }
  }

  private async analyzeRelationshipFactors(contact: any): Promise<ContactIntelligence['relationship_insights']> {
    try {
      let networkingScore = 50
      let collaborationLikelihood = 50
      let followUpSensitivity: 'high' | 'medium' | 'low' = 'medium'
      let exclusivityPreference = false

      // Analyze networking score based on social presence
      if (contact.linkedin_url) networkingScore += 20
      if (contact.twitter_handle) networkingScore += 15

      // Analyze collaboration likelihood based on past interactions
      if (contact.interaction_count > 0) {
        const successRate = contact.successful_pitches / Math.max(contact.total_pitches, 1)
        collaborationLikelihood = Math.floor(successRate * 100)
      }

      // Analyze follow-up sensitivity based on response patterns
      if (contact.avg_response_time_hours) {
        if (contact.avg_response_time_hours <= 2) {
          followUpSensitivity = 'high'
        } else if (contact.avg_response_time_hours >= 48) {
          followUpSensitivity = 'low'
        }
      }

      // Analyze exclusivity preference based on beat and outlet
      if (contact.beat === 'technology' || contact.beat === 'business') {
        exclusivityPreference = true
      }

      if (contact.media_outlets?.outlet_type === 'wire_service') {
        exclusivityPreference = false // Wire services prefer broad access
      }

      return {
        networking_score: Math.min(networkingScore, 100),
        collaboration_likelihood: Math.min(collaborationLikelihood, 100),
        follow_up_sensitivity: followUpSensitivity,
        exclusivity_preference: exclusivityPreference
      }

    } catch (error) {
      console.error('Relationship analysis error:', error)
      return {
        networking_score: 50,
        collaboration_likelihood: 50,
        follow_up_sensitivity: 'medium',
        exclusivity_preference: false
      }
    }
  }

  private async updateContactIntelligence(intelligenceResults: ContactIntelligence[], tenantId: string): Promise<void> {
    try {
      for (const intelligence of intelligenceResults) {
        const updateData = {
          beat: intelligence.ai_categorization.primary_beat,
          secondary_beats: intelligence.ai_categorization.secondary_beats,
          expertise_score: intelligence.ai_categorization.confidence_score,
          preferred_contact_time: intelligence.communication_intelligence.optimal_contact_times[0],
          timezone: intelligence.geographic_analysis.time_zone,
          relationship_score: intelligence.relationship_insights.networking_score,
          
          // Store full intelligence data as JSONB
          ai_intelligence: {
            categorization: intelligence.ai_categorization,
            influence_analysis: intelligence.influence_analysis,
            geographic_analysis: intelligence.geographic_analysis,
            communication_intelligence: intelligence.communication_intelligence,
            content_format_analysis: intelligence.content_format_analysis,
            relationship_insights: intelligence.relationship_insights,
            last_processed_at: new Date().toISOString()
          }
        }

        await this.supabaseClient
          .from('journalist_contacts')
          .update(updateData)
          .eq('id', intelligence.contact_id)
          .eq('tenant_id', tenantId)
      }

      console.log(`Updated intelligence data for ${intelligenceResults.length} contacts`)

    } catch (error) {
      console.error('Error updating contact intelligence:', error)
    }
  }

  private calculateBeatDistribution(intelligenceResults: ContactIntelligence[]): any {
    const distribution: { [beat: string]: number } = {}
    
    for (const result of intelligenceResults) {
      const beat = result.ai_categorization.primary_beat
      distribution[beat] = (distribution[beat] || 0) + 1
    }
    
    return distribution
  }

  private calculateInfluenceDistribution(intelligenceResults: ContactIntelligence[]): any {
    const distribution: { [tier: string]: number } = {}
    
    for (const result of intelligenceResults) {
      const tier = result.influence_analysis.influence_tier
      distribution[tier] = (distribution[tier] || 0) + 1
    }
    
    return distribution
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}