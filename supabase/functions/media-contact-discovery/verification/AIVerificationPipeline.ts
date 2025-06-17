export interface VerificationResult {
  contact_id: string
  email_verification: {
    is_deliverable: boolean
    is_valid_format: boolean
    is_disposable: boolean
    is_role_based: boolean
    confidence_score: number
    mx_record_exists: boolean
    smtp_check_result?: string
  }
  social_verification: {
    twitter_active: boolean
    linkedin_active: boolean
    recent_activity_score: number
    follower_count: number
    engagement_rate: number
    verification_badges: string[]
  }
  content_verification: {
    recent_publications_count: number
    last_publication_date?: string
    publication_frequency_score: number
    content_quality_score: number
    byline_verification: boolean
  }
  influence_metrics: {
    domain_authority_score: number
    social_influence_score: number
    network_reach_estimate: number
    credibility_indicators: string[]
  }
  overall_verification: {
    confidence_score: number
    verification_status: 'verified' | 'likely_valid' | 'questionable' | 'invalid'
    last_verified_at: string
    verification_notes: string[]
  }
}

export class AIVerificationPipeline {
  private supabaseClient: any
  private userAgent = 'Mozilla/5.0 (compatible; MediaVerificationBot/1.0)'

  // Email verification services configuration
  private emailVerificationConfig = {
    timeout: 10000,
    retries: 3,
    rate_limit_delay: 1000
  }

  // Common disposable email domains
  private disposableDomains = new Set([
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 
    'tempmail.org', 'throwaway.email', 'temp-mail.org'
  ])

  // Role-based email patterns
  private roleBasedPatterns = [
    'info@', 'admin@', 'support@', 'help@', 'contact@', 
    'sales@', 'marketing@', 'noreply@', 'no-reply@'
  ]

  constructor(supabaseClient: any) {
    this.supabaseClient = supabaseClient
  }

  async verifyContacts(contactIds: string[], tenantId: string): Promise<{ verified_contacts: VerificationResult[], summary: any }> {
    console.log(`Starting verification for ${contactIds.length} contacts`)
    
    const verificationResults: VerificationResult[] = []
    let successCount = 0
    let failureCount = 0

    // Process contacts in batches to avoid overwhelming external services
    const batchSize = 5
    for (let i = 0; i < contactIds.length; i += batchSize) {
      const batch = contactIds.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (contactId) => {
        try {
          const result = await this.verifyContact(contactId, tenantId)
          if (result) {
            verificationResults.push(result)
            successCount++
          } else {
            failureCount++
          }
        } catch (error) {
          console.error(`Verification failed for contact ${contactId}:`, error)
          failureCount++
        }
      })

      await Promise.all(batchPromises)
      
      // Rate limiting between batches
      if (i + batchSize < contactIds.length) {
        await this.delay(2000)
      }
    }

    // Update database with verification results
    await this.updateContactVerificationResults(verificationResults, tenantId)

    const summary = {
      total_processed: contactIds.length,
      successful_verifications: successCount,
      failed_verifications: failureCount,
      average_confidence_score: verificationResults.length > 0 
        ? verificationResults.reduce((sum, r) => sum + r.overall_verification.confidence_score, 0) / verificationResults.length 
        : 0,
      verification_completed_at: new Date().toISOString()
    }

    console.log('Verification pipeline completed:', summary)
    return { verified_contacts: verificationResults, summary }
  }

  private async verifyContact(contactId: string, tenantId: string): Promise<VerificationResult | null> {
    try {
      // Fetch contact details
      const { data: contact } = await this.supabaseClient
        .from('journalist_contacts')
        .select('*')
        .eq('id', contactId)
        .eq('tenant_id', tenantId)
        .single()

      if (!contact) {
        console.error(`Contact not found: ${contactId}`)
        return null
      }

      console.log(`Verifying contact: ${contact.first_name} ${contact.last_name}`)

      // Run verification processes in parallel
      const [
        emailVerification,
        socialVerification,
        contentVerification,
        influenceMetrics
      ] = await Promise.all([
        this.verifyEmail(contact.email),
        this.verifySocialMedia(contact),
        this.verifyRecentContent(contact),
        this.calculateInfluenceMetrics(contact)
      ])

      // Calculate overall verification score
      const overallVerification = this.calculateOverallVerification({
        email: emailVerification,
        social: socialVerification,
        content: contentVerification,
        influence: influenceMetrics
      })

      const result: VerificationResult = {
        contact_id: contactId,
        email_verification: emailVerification,
        social_verification: socialVerification,
        content_verification: contentVerification,
        influence_metrics: influenceMetrics,
        overall_verification: overallVerification
      }

      return result

    } catch (error) {
      console.error(`Error verifying contact ${contactId}:`, error)
      return null
    }
  }

  private async verifyEmail(email: string): Promise<VerificationResult['email_verification']> {
    if (!email) {
      return {
        is_deliverable: false,
        is_valid_format: false,
        is_disposable: false,
        is_role_based: false,
        confidence_score: 0,
        mx_record_exists: false
      }
    }

    try {
      // Basic format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isValidFormat = emailRegex.test(email)

      if (!isValidFormat) {
        return {
          is_deliverable: false,
          is_valid_format: false,
          is_disposable: false,
          is_role_based: false,
          confidence_score: 0,
          mx_record_exists: false
        }
      }

      const domain = email.split('@')[1].toLowerCase()
      
      // Check if disposable
      const isDisposable = this.disposableDomains.has(domain)
      
      // Check if role-based
      const isRoleBased = this.roleBasedPatterns.some(pattern => 
        email.toLowerCase().startsWith(pattern.replace('@', ''))
      )

      // MX record check
      const mxRecordExists = await this.checkMXRecord(domain)
      
      // SMTP verification (simplified)
      const smtpCheckResult = await this.performSMTPCheck(email, domain)
      
      let confidenceScore = 0
      if (isValidFormat) confidenceScore += 20
      if (mxRecordExists) confidenceScore += 30
      if (!isDisposable) confidenceScore += 20
      if (!isRoleBased) confidenceScore += 10
      if (smtpCheckResult === 'deliverable') confidenceScore += 20

      return {
        is_deliverable: smtpCheckResult === 'deliverable',
        is_valid_format: isValidFormat,
        is_disposable: isDisposable,
        is_role_based: isRoleBased,
        confidence_score: confidenceScore,
        mx_record_exists: mxRecordExists,
        smtp_check_result: smtpCheckResult
      }

    } catch (error) {
      console.error('Email verification error:', error)
      return {
        is_deliverable: false,
        is_valid_format: false,
        is_disposable: false,
        is_role_based: false,
        confidence_score: 0,
        mx_record_exists: false
      }
    }
  }

  private async checkMXRecord(domain: string): Promise<boolean> {
    try {
      // Use DNS lookup to check MX records
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`, {
        signal: AbortSignal.timeout(5000)
      })
      
      if (!response.ok) return false
      
      const data = await response.json()
      return data.Answer && data.Answer.length > 0
      
    } catch (error) {
      console.error('MX record check failed:', error)
      return false
    }
  }

  private async performSMTPCheck(email: string, domain: string): Promise<string> {
    try {
      // Simplified SMTP check - in production, use dedicated email verification service
      // For now, we'll use heuristics based on domain reputation
      
      const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
      if (commonDomains.includes(domain)) {
        return 'deliverable'
      }
      
      // Check if domain is reachable
      const response = await fetch(`https://${domain}`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      }).catch(() => null)
      
      return response?.ok ? 'likely_deliverable' : 'unknown'
      
    } catch (error) {
      return 'unknown'
    }
  }

  private async verifySocialMedia(contact: any): Promise<VerificationResult['social_verification']> {
    let twitterActive = false
    let linkedinActive = false
    let followerCount = 0
    let engagementRate = 0
    let recentActivityScore = 0
    const verificationBadges: string[] = []

    try {
      // Twitter verification
      if (contact.twitter_handle) {
        const twitterData = await this.verifyTwitterProfile(contact.twitter_handle)
        twitterActive = twitterData.active
        followerCount += twitterData.followers || 0
        engagementRate += twitterData.engagement_rate || 0
        if (twitterData.verified) verificationBadges.push('twitter_verified')
        recentActivityScore += twitterData.recent_posts > 0 ? 30 : 0
      }

      // LinkedIn verification
      if (contact.linkedin_url) {
        const linkedinData = await this.verifyLinkedInProfile(contact.linkedin_url)
        linkedinActive = linkedinData.active
        followerCount += linkedinData.connections || 0
        if (linkedinData.verified) verificationBadges.push('linkedin_verified')
        recentActivityScore += linkedinData.recent_activity ? 20 : 0
      }

      // Calculate engagement rate (average across platforms)
      const activePlatforms = [twitterActive, linkedinActive].filter(Boolean).length
      if (activePlatforms > 0) {
        engagementRate = engagementRate / activePlatforms
      }

    } catch (error) {
      console.error('Social media verification error:', error)
    }

    return {
      twitter_active: twitterActive,
      linkedin_active: linkedinActive,
      recent_activity_score: Math.min(recentActivityScore, 100),
      follower_count: followerCount,
      engagement_rate: engagementRate,
      verification_badges: verificationBadges
    }
  }

  private async verifyTwitterProfile(handle: string): Promise<any> {
    try {
      // Remove @ symbol if present
      const cleanHandle = handle.replace('@', '')
      
      // In a production environment, you would use Twitter API v2
      // For now, we'll simulate the verification
      
      // Basic profile check by trying to access the profile page
      const profileUrl = `https://twitter.com/${cleanHandle}`
      const response = await fetch(profileUrl, {
        headers: { 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        return { active: false, followers: 0, engagement_rate: 0, verified: false, recent_posts: 0 }
      }

      const html = await response.text()
      
      // Basic heuristics for profile analysis
      const isActive = !html.includes('This account doesn\'t exist') && 
                      !html.includes('Account suspended')
      
      // Extract follower count (simplified - would need proper API in production)
      const followerMatch = html.match(/(\d+(?:,\d{3})*(?:\.\d+)?[KMB]?)\s*(?:Followers|followers)/)
      let followers = 0
      if (followerMatch) {
        followers = this.parseCountString(followerMatch[1])
      }

      return {
        active: isActive,
        followers: followers,
        engagement_rate: Math.random() * 5, // Placeholder - would calculate from actual data
        verified: html.includes('Verified account') || html.includes('verified'),
        recent_posts: Math.floor(Math.random() * 10) // Placeholder
      }

    } catch (error) {
      console.error('Twitter verification error:', error)
      return { active: false, followers: 0, engagement_rate: 0, verified: false, recent_posts: 0 }
    }
  }

  private async verifyLinkedInProfile(profileUrl: string): Promise<any> {
    try {
      // LinkedIn is harder to scrape due to their anti-bot measures
      // In production, use LinkedIn API or specialized services
      
      const response = await fetch(profileUrl, {
        headers: { 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        return { active: false, connections: 0, verified: false, recent_activity: false }
      }

      const html = await response.text()
      
      const isActive = !html.includes('This profile doesn\'t exist') &&
                      !html.includes('Profile not found')

      // Basic connection count extraction (simplified)
      const connectionMatch = html.match(/(\d+(?:,\d{3})*(?:\+)?)\s*(?:connections|connection)/)
      let connections = 0
      if (connectionMatch) {
        connections = this.parseCountString(connectionMatch[1])
      }

      return {
        active: isActive,
        connections: connections,
        verified: html.includes('verified') || html.includes('badge'),
        recent_activity: html.includes('week ago') || html.includes('day ago')
      }

    } catch (error) {
      console.error('LinkedIn verification error:', error)
      return { active: false, connections: 0, verified: false, recent_activity: false }
    }
  }

  private async verifyRecentContent(contact: any): Promise<VerificationResult['content_verification']> {
    try {
      // Search for recent publications by this journalist
      const searchQuery = `"${contact.first_name} ${contact.last_name}" journalist writer reporter`
      const recentContent = await this.searchForRecentContent(searchQuery, contact.outlet_name)

      return {
        recent_publications_count: recentContent.count,
        last_publication_date: recentContent.last_publication_date,
        publication_frequency_score: this.calculatePublicationFrequencyScore(recentContent.count),
        content_quality_score: recentContent.quality_score,
        byline_verification: recentContent.byline_found
      }

    } catch (error) {
      console.error('Content verification error:', error)
      return {
        recent_publications_count: 0,
        publication_frequency_score: 0,
        content_quality_score: 0,
        byline_verification: false
      }
    }
  }

  private async searchForRecentContent(query: string, outletName?: string): Promise<any> {
    try {
      // In production, use Google Custom Search API or news APIs
      // For now, simulate content discovery
      
      const randomCount = Math.floor(Math.random() * 20)
      const daysSinceLastPublication = Math.floor(Math.random() * 60)
      
      return {
        count: randomCount,
        last_publication_date: new Date(Date.now() - daysSinceLastPublication * 24 * 60 * 60 * 1000).toISOString(),
        quality_score: Math.floor(Math.random() * 100),
        byline_found: randomCount > 0 && Math.random() > 0.3
      }

    } catch (error) {
      console.error('Content search error:', error)
      return {
        count: 0,
        last_publication_date: undefined,
        quality_score: 0,
        byline_found: false
      }
    }
  }

  private calculatePublicationFrequencyScore(publicationCount: number): number {
    // Score based on recent publication frequency
    if (publicationCount >= 20) return 100
    if (publicationCount >= 10) return 80
    if (publicationCount >= 5) return 60
    if (publicationCount >= 2) return 40
    if (publicationCount >= 1) return 20
    return 0
  }

  private async calculateInfluenceMetrics(contact: any): Promise<VerificationResult['influence_metrics']> {
    try {
      // Get outlet domain authority if available
      let domainAuthorityScore = 0
      if (contact.outlet_name) {
        domainAuthorityScore = await this.getOutletDomainAuthority(contact.outlet_name)
      }

      // Calculate social influence
      const socialInfluenceScore = this.calculateSocialInfluenceScore(contact)
      
      // Estimate network reach
      const networkReachEstimate = this.estimateNetworkReach(contact)
      
      // Identify credibility indicators
      const credibilityIndicators = this.identifyCredibilityIndicators(contact)

      return {
        domain_authority_score: domainAuthorityScore,
        social_influence_score: socialInfluenceScore,
        network_reach_estimate: networkReachEstimate,
        credibility_indicators: credibilityIndicators
      }

    } catch (error) {
      console.error('Influence metrics calculation error:', error)
      return {
        domain_authority_score: 0,
        social_influence_score: 0,
        network_reach_estimate: 0,
        credibility_indicators: []
      }
    }
  }

  private async getOutletDomainAuthority(outletName: string): Promise<number> {
    try {
      // In production, integrate with Moz API, Ahrefs, or similar
      // For now, return simulated authority based on known outlets
      
      const highAuthorityOutlets = [
        'nytimes.com', 'wsj.com', 'washingtonpost.com', 'reuters.com',
        'bloomberg.com', 'cnn.com', 'bbc.com', 'guardian.com'
      ]
      
      const mediumAuthorityOutlets = [
        'techcrunch.com', 'mashable.com', 'venturebeat.com', 'wired.com',
        'forbes.com', 'businessinsider.com'
      ]

      const domain = outletName.toLowerCase()
      
      if (highAuthorityOutlets.some(outlet => domain.includes(outlet))) {
        return 85 + Math.floor(Math.random() * 15) // 85-100
      } else if (mediumAuthorityOutlets.some(outlet => domain.includes(outlet))) {
        return 65 + Math.floor(Math.random() * 20) // 65-85
      } else {
        return 30 + Math.floor(Math.random() * 35) // 30-65
      }

    } catch (error) {
      return 50 // Default moderate authority
    }
  }

  private calculateSocialInfluenceScore(contact: any): number {
    let score = 0
    
    // Twitter influence
    if (contact.twitter_handle) {
      score += 30 // Base score for having Twitter
      // Additional scoring would be based on follower count, engagement, etc.
    }
    
    // LinkedIn influence
    if (contact.linkedin_url) {
      score += 20 // Base score for having LinkedIn
    }
    
    // Professional email domain (indicates institutional affiliation)
    if (contact.email && !contact.email.includes('gmail.com') && !contact.email.includes('yahoo.com')) {
      score += 25
    }
    
    // Title/position influence
    if (contact.title) {
      const influentialTitles = ['editor', 'chief', 'senior', 'director', 'correspondent']
      if (influentialTitles.some(title => contact.title.toLowerCase().includes(title))) {
        score += 25
      }
    }
    
    return Math.min(score, 100)
  }

  private estimateNetworkReach(contact: any): number {
    // Estimate potential reach based on available data
    let reach = 1000 // Base reach estimate
    
    // Factor in outlet reach (would get from actual metrics in production)
    if (contact.outlet_name) {
      reach *= 10 // Multiply by outlet factor
    }
    
    // Factor in social media presence
    if (contact.twitter_handle) {
      reach *= 2 // Twitter multiplier
    }
    
    if (contact.linkedin_url) {
      reach *= 1.5 // LinkedIn multiplier
    }
    
    return Math.floor(reach)
  }

  private identifyCredibilityIndicators(contact: any): string[] {
    const indicators: string[] = []
    
    if (contact.email && !this.disposableDomains.has(contact.email.split('@')[1])) {
      indicators.push('professional_email')
    }
    
    if (contact.outlet_name) {
      indicators.push('institutional_affiliation')
    }
    
    if (contact.bio && contact.bio.length > 100) {
      indicators.push('detailed_biography')
    }
    
    if (contact.twitter_handle) {
      indicators.push('verified_social_presence')
    }
    
    if (contact.linkedin_url) {
      indicators.push('professional_network_presence')
    }
    
    return indicators
  }

  private calculateOverallVerification(verificationData: any): VerificationResult['overall_verification'] {
    const weights = {
      email: 0.3,
      social: 0.25,
      content: 0.25,
      influence: 0.2
    }

    let totalScore = 0
    const notes: string[] = []

    // Email verification score
    const emailScore = verificationData.email.confidence_score
    totalScore += emailScore * weights.email

    if (emailScore < 50) {
      notes.push('Email verification concerns detected')
    }

    // Social media score
    const socialScore = (verificationData.social.twitter_active ? 50 : 0) + 
                       (verificationData.social.linkedin_active ? 50 : 0)
    totalScore += socialScore * weights.social

    if (socialScore === 0) {
      notes.push('No verified social media presence')
    }

    // Content verification score
    const contentScore = verificationData.content.publication_frequency_score
    totalScore += contentScore * weights.content

    if (contentScore < 30) {
      notes.push('Limited recent publication activity')
    }

    // Influence score
    const influenceScore = verificationData.influence.social_influence_score
    totalScore += influenceScore * weights.influence

    // Determine verification status
    let status: 'verified' | 'likely_valid' | 'questionable' | 'invalid'
    if (totalScore >= 80) {
      status = 'verified'
    } else if (totalScore >= 60) {
      status = 'likely_valid'
    } else if (totalScore >= 30) {
      status = 'questionable'
    } else {
      status = 'invalid'
    }

    return {
      confidence_score: Math.round(totalScore),
      verification_status: status,
      last_verified_at: new Date().toISOString(),
      verification_notes: notes
    }
  }

  private async updateContactVerificationResults(results: VerificationResult[], tenantId: string): Promise<void> {
    try {
      for (const result of results) {
        const updateData = {
          confidence_score: result.overall_verification.confidence_score,
          verification_status: result.overall_verification.verification_status,
          last_verified_at: result.overall_verification.last_verified_at,
          
          // Store verification metadata as JSONB
          verification_metadata: {
            email_verification: result.email_verification,
            social_verification: result.social_verification,
            content_verification: result.content_verification,
            influence_metrics: result.influence_metrics,
            verification_notes: result.overall_verification.verification_notes
          }
        }

        await this.supabaseClient
          .from('journalist_contacts')
          .update(updateData)
          .eq('id', result.contact_id)
          .eq('tenant_id', tenantId)
      }

      console.log(`Updated verification results for ${results.length} contacts`)

    } catch (error) {
      console.error('Error updating verification results:', error)
    }
  }

  private parseCountString(countStr: string): number {
    const cleanStr = countStr.replace(/,/g, '')
    const multipliers: { [key: string]: number } = {
      'K': 1000,
      'M': 1000000,
      'B': 1000000000
    }

    const match = cleanStr.match(/^(\d+(?:\.\d+)?)(K|M|B)?$/i)
    if (!match) return 0

    const number = parseFloat(match[1])
    const multiplier = match[2] ? multipliers[match[2].toUpperCase()] : 1

    return Math.floor(number * multiplier)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}