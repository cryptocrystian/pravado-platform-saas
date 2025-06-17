export interface MonitoringAlert {
  alert_id: string
  contact_id: string
  alert_type: 'job_change' | 'new_outlet' | 'contact_update' | 'social_activity' | 'content_published'
  alert_severity: 'low' | 'medium' | 'high' | 'critical'
  alert_message: string
  previous_value?: any
  new_value?: any
  detected_at: string
  confidence_score: number
  source: string
}

export interface MonitoringConfig {
  tenant_id: string
  enabled_alerts: string[]
  monitoring_frequency: 'hourly' | 'daily' | 'weekly'
  alert_thresholds: {
    job_change_confidence: number
    contact_update_confidence: number
    social_activity_threshold: number
  }
}

export class RealTimeMonitor {
  private supabaseClient: any
  private userAgent = 'Mozilla/5.0 (compatible; MediaMonitorBot/1.0)'

  constructor(supabaseClient: any) {
    this.supabaseClient = supabaseClient
  }

  async startMonitoring(tenantId: string): Promise<{ monitoring_started: boolean, monitored_contacts: number }> {
    console.log(`Starting real-time monitoring for tenant: ${tenantId}`)

    try {
      // Get monitoring configuration
      const config = await this.getMonitoringConfig(tenantId)
      
      // Get active contacts to monitor
      const { data: contacts } = await this.supabaseClient
        .from('journalist_contacts')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .eq('verification_status', 'verified')

      if (!contacts || contacts.length === 0) {
        return { monitoring_started: false, monitored_contacts: 0 }
      }

      // Schedule monitoring tasks
      const monitoringPromises = []

      if (config.enabled_alerts.includes('job_change')) {
        monitoringPromises.push(this.monitorJobChanges(contacts, config))
      }

      if (config.enabled_alerts.includes('contact_update')) {
        monitoringPromises.push(this.monitorContactUpdates(contacts, config))
      }

      if (config.enabled_alerts.includes('social_activity')) {
        monitoringPromises.push(this.monitorSocialActivity(contacts, config))
      }

      if (config.enabled_alerts.includes('content_published')) {
        monitoringPromises.push(this.monitorContentPublication(contacts, config))
      }

      if (config.enabled_alerts.includes('new_outlet')) {
        monitoringPromises.push(this.monitorNewOutlets(tenantId, config))
      }

      // Execute monitoring tasks
      const results = await Promise.allSettled(monitoringPromises)
      
      // Process and store alerts
      const allAlerts: MonitoringAlert[] = []
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          allAlerts.push(...result.value)
        }
      }

      // Store alerts in database
      if (allAlerts.length > 0) {
        await this.storeMonitoringAlerts(allAlerts, tenantId)
      }

      console.log(`Monitoring completed. Generated ${allAlerts.length} alerts for ${contacts.length} contacts`)

      return {
        monitoring_started: true,
        monitored_contacts: contacts.length
      }

    } catch (error) {
      console.error('Error in real-time monitoring:', error)
      throw error
    }
  }

  private async getMonitoringConfig(tenantId: string): Promise<MonitoringConfig> {
    try {
      // Try to get custom config from database
      const { data: config } = await this.supabaseClient
        .from('monitoring_configs')
        .select('*')
        .eq('tenant_id', tenantId)
        .single()

      if (config) {
        return config
      }

      // Default configuration
      return {
        tenant_id: tenantId,
        enabled_alerts: ['job_change', 'contact_update', 'social_activity', 'content_published'],
        monitoring_frequency: 'daily',
        alert_thresholds: {
          job_change_confidence: 70,
          contact_update_confidence: 60,
          social_activity_threshold: 5
        }
      }

    } catch (error) {
      console.error('Error getting monitoring config:', error)
      // Return default config
      return {
        tenant_id: tenantId,
        enabled_alerts: ['job_change', 'contact_update'],
        monitoring_frequency: 'daily',
        alert_thresholds: {
          job_change_confidence: 70,
          contact_update_confidence: 60,
          social_activity_threshold: 5
        }
      }
    }
  }

  private async monitorJobChanges(contacts: any[], config: MonitoringConfig): Promise<MonitoringAlert[]> {
    const alerts: MonitoringAlert[] = []

    try {
      console.log(`Monitoring job changes for ${contacts.length} contacts`)

      // Process contacts in batches
      const batchSize = 10
      for (let i = 0; i < contacts.length; i += batchSize) {
        const batch = contacts.slice(i, i + batchSize)

        const batchPromises = batch.map(async (contact) => {
          try {
            const jobChangeAlert = await this.checkForJobChange(contact, config)
            if (jobChangeAlert) {
              alerts.push(jobChangeAlert)
            }
          } catch (error) {
            console.error(`Error checking job change for ${contact.id}:`, error)
          }
        })

        await Promise.all(batchPromises)

        // Rate limiting
        if (i + batchSize < contacts.length) {
          await this.delay(2000)
        }
      }

    } catch (error) {
      console.error('Error monitoring job changes:', error)
    }

    return alerts
  }

  private async checkForJobChange(contact: any, config: MonitoringConfig): Promise<MonitoringAlert | null> {
    try {
      // Check LinkedIn for job updates
      if (contact.linkedin_url) {
        const linkedinData = await this.checkLinkedInJobUpdate(contact.linkedin_url)
        
        if (linkedinData.job_changed && linkedinData.confidence >= config.alert_thresholds.job_change_confidence) {
          return {
            alert_id: this.generateAlertId(),
            contact_id: contact.id,
            alert_type: 'job_change',
            alert_severity: 'high',
            alert_message: `${contact.first_name} ${contact.last_name} may have changed jobs to ${linkedinData.new_company}`,
            previous_value: contact.outlet_name,
            new_value: linkedinData.new_company,
            detected_at: new Date().toISOString(),
            confidence_score: linkedinData.confidence,
            source: 'linkedin_profile'
          }
        }
      }

      // Check Twitter bio for job updates
      if (contact.twitter_handle) {
        const twitterData = await this.checkTwitterBioUpdate(contact.twitter_handle)
        
        if (twitterData.bio_changed && twitterData.confidence >= config.alert_thresholds.job_change_confidence) {
          return {
            alert_id: this.generateAlertId(),
            contact_id: contact.id,
            alert_type: 'job_change',
            alert_severity: 'medium',
            alert_message: `${contact.first_name} ${contact.last_name} updated their Twitter bio, possible job change`,
            previous_value: contact.bio,
            new_value: twitterData.new_bio,
            detected_at: new Date().toISOString(),
            confidence_score: twitterData.confidence,
            source: 'twitter_bio'
          }
        }
      }

      return null

    } catch (error) {
      console.error('Error checking job change:', error)
      return null
    }
  }

  private async checkLinkedInJobUpdate(linkedinUrl: string): Promise<any> {
    try {
      const response = await fetch(linkedinUrl, {
        headers: { 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        return { job_changed: false, confidence: 0 }
      }

      const html = await response.text()
      
      // Look for recent job change indicators
      const recentJobIndicators = [
        'new position', 'joined', 'started at', 'excited to announce',
        'pleased to share', 'happy to join'
      ]

      const hasRecentJobIndicator = recentJobIndicators.some(indicator =>
        html.toLowerCase().includes(indicator)
      )

      // Extract current company from profile
      const companyMatch = html.match(/<span[^>]*class[^>]*company[^>]*>([^<]+)<\/span>/i)
      const newCompany = companyMatch ? companyMatch[1].trim() : null

      return {
        job_changed: hasRecentJobIndicator,
        new_company: newCompany,
        confidence: hasRecentJobIndicator ? 75 : 0
      }

    } catch (error) {
      console.error('LinkedIn job check error:', error)
      return { job_changed: false, confidence: 0 }
    }
  }

  private async checkTwitterBioUpdate(twitterHandle: string): Promise<any> {
    try {
      const cleanHandle = twitterHandle.replace('@', '')
      const profileUrl = `https://twitter.com/${cleanHandle}`

      const response = await fetch(profileUrl, {
        headers: { 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        return { bio_changed: false, confidence: 0 }
      }

      const html = await response.text()
      
      // Extract bio from profile (simplified)
      const bioMatch = html.match(/<div[^>]*data-testid="UserDescription"[^>]*>([^<]+)<\/div>/i)
      const currentBio = bioMatch ? bioMatch[1].trim() : null

      if (!currentBio) {
        return { bio_changed: false, confidence: 0 }
      }

      // Check for job change indicators in bio
      const jobChangeIndicators = [
        'now at', 'currently at', 'joined', 'new role', 'excited to be'
      ]

      const hasJobChangeIndicator = jobChangeIndicators.some(indicator =>
        currentBio.toLowerCase().includes(indicator)
      )

      return {
        bio_changed: hasJobChangeIndicator,
        new_bio: currentBio,
        confidence: hasJobChangeIndicator ? 65 : 0
      }

    } catch (error) {
      console.error('Twitter bio check error:', error)
      return { bio_changed: false, confidence: 0 }
    }
  }

  private async monitorContactUpdates(contacts: any[], config: MonitoringConfig): Promise<MonitoringAlert[]> {
    const alerts: MonitoringAlert[] = []

    try {
      console.log(`Monitoring contact updates for ${contacts.length} contacts`)

      for (const contact of contacts) {
        // Check if email is still valid
        if (contact.email) {
          const emailValid = await this.verifyEmailStillValid(contact.email)
          
          if (!emailValid) {
            alerts.push({
              alert_id: this.generateAlertId(),
              contact_id: contact.id,
              alert_type: 'contact_update',
              alert_severity: 'medium',
              alert_message: `Email for ${contact.first_name} ${contact.last_name} may no longer be valid`,
              previous_value: 'valid',
              new_value: 'invalid',
              detected_at: new Date().toISOString(),
              confidence_score: 80,
              source: 'email_verification'
            })
          }
        }

        // Rate limiting
        await this.delay(500)
      }

    } catch (error) {
      console.error('Error monitoring contact updates:', error)
    }

    return alerts
  }

  private async monitorSocialActivity(contacts: any[], config: MonitoringConfig): Promise<MonitoringAlert[]> {
    const alerts: MonitoringAlert[] = []

    try {
      console.log(`Monitoring social activity for ${contacts.length} contacts`)

      for (const contact of contacts) {
        if (contact.twitter_handle) {
          const activity = await this.checkTwitterActivity(contact.twitter_handle)
          
          if (activity.recent_posts >= config.alert_thresholds.social_activity_threshold) {
            alerts.push({
              alert_id: this.generateAlertId(),
              contact_id: contact.id,
              alert_type: 'social_activity',
              alert_severity: 'low',
              alert_message: `${contact.first_name} ${contact.last_name} has been active on Twitter (${activity.recent_posts} recent posts)`,
              new_value: activity.recent_posts,
              detected_at: new Date().toISOString(),
              confidence_score: 90,
              source: 'twitter_activity'
            })
          }
        }

        // Rate limiting
        await this.delay(1000)
      }

    } catch (error) {
      console.error('Error monitoring social activity:', error)
    }

    return alerts
  }

  private async monitorContentPublication(contacts: any[], config: MonitoringConfig): Promise<MonitoringAlert[]> {
    const alerts: MonitoringAlert[] = []

    try {
      console.log(`Monitoring content publication for ${contacts.length} contacts`)

      for (const contact of contacts) {
        const recentContent = await this.checkForRecentContent(contact)
        
        if (recentContent.found && recentContent.count > 0) {
          alerts.push({
            alert_id: this.generateAlertId(),
            contact_id: contact.id,
            alert_type: 'content_published',
            alert_severity: 'low',
            alert_message: `${contact.first_name} ${contact.last_name} published ${recentContent.count} new articles recently`,
            new_value: recentContent.latest_article,
            detected_at: new Date().toISOString(),
            confidence_score: recentContent.confidence,
            source: 'content_monitoring'
          })
        }

        // Rate limiting
        await this.delay(2000)
      }

    } catch (error) {
      console.error('Error monitoring content publication:', error)
    }

    return alerts
  }

  private async monitorNewOutlets(tenantId: string, config: MonitoringConfig): Promise<MonitoringAlert[]> {
    const alerts: MonitoringAlert[] = []

    try {
      console.log('Monitoring for new media outlets')

      // This would integrate with news directory APIs, press release distribution services, etc.
      // For now, simulate new outlet discovery
      
      const newOutlets = await this.discoverNewOutlets()
      
      for (const outlet of newOutlets) {
        alerts.push({
          alert_id: this.generateAlertId(),
          contact_id: 'new_outlet',
          alert_type: 'new_outlet',
          alert_severity: 'medium',
          alert_message: `New media outlet discovered: ${outlet.name}`,
          new_value: outlet,
          detected_at: new Date().toISOString(),
          confidence_score: outlet.confidence,
          source: 'outlet_discovery'
        })
      }

    } catch (error) {
      console.error('Error monitoring new outlets:', error)
    }

    return alerts
  }

  private async verifyEmailStillValid(email: string): Promise<boolean> {
    try {
      // Basic email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) return false

      const domain = email.split('@')[1]
      
      // Check MX record
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`, {
        signal: AbortSignal.timeout(5000)
      })
      
      if (!response.ok) return false
      
      const data = await response.json()
      return data.Answer && data.Answer.length > 0

    } catch (error) {
      return true // Assume valid if can't verify
    }
  }

  private async checkTwitterActivity(handle: string): Promise<any> {
    try {
      const cleanHandle = handle.replace('@', '')
      const profileUrl = `https://twitter.com/${cleanHandle}`

      const response = await fetch(profileUrl, {
        headers: { 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        return { recent_posts: 0 }
      }

      const html = await response.text()
      
      // Count recent posts (simplified - in production would use Twitter API)
      const tweetIndicators = html.match(/tweet.*?ago/gi) || []
      const recentPosts = tweetIndicators.filter(tweet => 
        tweet.includes('hour') || tweet.includes('day')
      ).length

      return { recent_posts: recentPosts }

    } catch (error) {
      return { recent_posts: 0 }
    }
  }

  private async checkForRecentContent(contact: any): Promise<any> {
    try {
      // Search for recent articles by this journalist
      const searchQuery = `"${contact.first_name} ${contact.last_name}" ${contact.outlet_name || ''}`
      
      // In production, use Google News API, Bing News API, or other news aggregators
      // For now, simulate content discovery
      const randomCount = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0
      
      return {
        found: randomCount > 0,
        count: randomCount,
        latest_article: randomCount > 0 ? `Recent article by ${contact.first_name} ${contact.last_name}` : null,
        confidence: randomCount > 0 ? 85 : 0
      }

    } catch (error) {
      return { found: false, count: 0, confidence: 0 }
    }
  }

  private async discoverNewOutlets(): Promise<any[]> {
    // In production, this would integrate with:
    // - Press release distribution networks
    // - News directory APIs
    // - Domain registration monitoring
    // - Social media platform APIs for new verified news accounts

    // Simulate new outlet discovery
    const outlets = []
    
    if (Math.random() > 0.8) {
      outlets.push({
        name: `TechNews${Math.floor(Math.random() * 1000)}`,
        website: `https://technews${Math.floor(Math.random() * 1000)}.com`,
        confidence: 75
      })
    }
    
    return outlets
  }

  private async storeMonitoringAlerts(alerts: MonitoringAlert[], tenantId: string): Promise<void> {
    try {
      const alertsToStore = alerts.map(alert => ({
        ...alert,
        tenant_id: tenantId,
        created_at: new Date().toISOString()
      }))

      // Store in monitoring_alerts table (would need to create this table)
      await this.supabaseClient
        .from('monitoring_alerts')
        .insert(alertsToStore)

      console.log(`Stored ${alerts.length} monitoring alerts`)

    } catch (error) {
      console.error('Error storing monitoring alerts:', error)
    }
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}