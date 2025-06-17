import { supabase } from '@/integrations/supabase/client'

export interface OutletScrapingRequest {
  outlet_url: string
  tenant_id: string
}

export interface ContactVerificationRequest {
  contact_ids: string[]
  tenant_id: string
}

export interface ContactCategorizationRequest {
  contact_ids: string[]
  tenant_id: string
}

export interface ScrapingResult {
  outlet_name: string
  outlet_url: string
  contacts_found: any[]
  scraping_metadata: {
    scraped_at: string
    pages_processed: number
    total_contacts: number
    success_rate: number
    scraping_method: string
  }
}

export interface VerificationResult {
  verified_contacts: any[]
  summary: {
    total_processed: number
    successful_verifications: number
    failed_verifications: number
    average_confidence_score: number
    verification_completed_at: string
  }
}

export interface CategorizationResult {
  processed_contacts: any[]
  summary: {
    total_processed: number
    successful_categorizations: number
    failed_categorizations: number
    beat_distribution: { [beat: string]: number }
    influence_distribution: { [tier: string]: number }
    processing_completed_at: string
  }
}

export interface MonitoringResult {
  monitoring_started: boolean
  monitored_contacts: number
}

export interface DiscoveryJob {
  id: string
  type: 'scraping' | 'verification' | 'categorization' | 'monitoring'
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  result?: any
  error?: string
  created_at: string
  completed_at?: string
}

class MediaDiscoveryService {
  private jobs = new Map<string, DiscoveryJob>()

  /**
   * Scrape journalist contacts from media outlet staff pages
   */
  async scrapeOutletContacts(request: OutletScrapingRequest): Promise<string> {
    const jobId = this.generateJobId()
    
    this.jobs.set(jobId, {
      id: jobId,
      type: 'scraping',
      status: 'pending',
      progress: 0,
      created_at: new Date().toISOString()
    })

    try {
      this.updateJobStatus(jobId, 'running', 10)

      const { data, error } = await supabase.functions.invoke('media-contact-discovery', {
        body: {
          action: 'scrape_outlet',
          outlet_url: request.outlet_url,
          tenant_id: request.tenant_id
        }
      })

      if (error) {
        throw new Error(`Scraping failed: ${error.message}`)
      }

      this.updateJobStatus(jobId, 'completed', 100, data)
      return jobId

    } catch (error) {
      this.updateJobStatus(jobId, 'failed', 0, undefined, error.message)
      throw error
    }
  }

  /**
   * Verify contact information using AI pipeline
   */
  async verifyContacts(request: ContactVerificationRequest): Promise<string> {
    const jobId = this.generateJobId()
    
    this.jobs.set(jobId, {
      id: jobId,
      type: 'verification',
      status: 'pending',
      progress: 0,
      created_at: new Date().toISOString()
    })

    try {
      this.updateJobStatus(jobId, 'running', 20)

      const { data, error } = await supabase.functions.invoke('media-contact-discovery', {
        body: {
          action: 'verify_contacts',
          contact_ids: request.contact_ids,
          tenant_id: request.tenant_id
        }
      })

      if (error) {
        throw new Error(`Verification failed: ${error.message}`)
      }

      this.updateJobStatus(jobId, 'completed', 100, data)
      return jobId

    } catch (error) {
      this.updateJobStatus(jobId, 'failed', 0, undefined, error.message)
      throw error
    }
  }

  /**
   * Categorize contacts using AI intelligence
   */
  async categorizeContacts(request: ContactCategorizationRequest): Promise<string> {
    const jobId = this.generateJobId()
    
    this.jobs.set(jobId, {
      id: jobId,
      type: 'categorization',
      status: 'pending',
      progress: 0,
      created_at: new Date().toISOString()
    })

    try {
      this.updateJobStatus(jobId, 'running', 30)

      const { data, error } = await supabase.functions.invoke('media-contact-discovery', {
        body: {
          action: 'categorize_contacts',
          contact_ids: request.contact_ids,
          tenant_id: request.tenant_id
        }
      })

      if (error) {
        throw new Error(`Categorization failed: ${error.message}`)
      }

      this.updateJobStatus(jobId, 'completed', 100, data)
      return jobId

    } catch (error) {
      this.updateJobStatus(jobId, 'failed', 0, undefined, error.message)
      throw error
    }
  }

  /**
   * Start real-time monitoring for contact updates
   */
  async startMonitoring(tenantId: string): Promise<string> {
    const jobId = this.generateJobId()
    
    this.jobs.set(jobId, {
      id: jobId,
      type: 'monitoring',
      status: 'pending',
      progress: 0,
      created_at: new Date().toISOString()
    })

    try {
      this.updateJobStatus(jobId, 'running', 50)

      const { data, error } = await supabase.functions.invoke('media-contact-discovery', {
        body: {
          action: 'monitor_updates',
          tenant_id: tenantId
        }
      })

      if (error) {
        throw new Error(`Monitoring failed: ${error.message}`)
      }

      this.updateJobStatus(jobId, 'completed', 100, data)
      return jobId

    } catch (error) {
      this.updateJobStatus(jobId, 'failed', 0, undefined, error.message)
      throw error
    }
  }

  /**
   * Get job status and result
   */
  getJobStatus(jobId: string): DiscoveryJob | null {
    return this.jobs.get(jobId) || null
  }

  /**
   * Wait for job completion
   */
  async waitForJobCompletion(jobId: string, timeoutMs: number = 300000): Promise<DiscoveryJob> {
    const startTime = Date.now()
    
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const job = this.jobs.get(jobId)
        
        if (!job) {
          clearInterval(checkInterval)
          reject(new Error('Job not found'))
          return
        }

        if (job.status === 'completed') {
          clearInterval(checkInterval)
          resolve(job)
          return
        }

        if (job.status === 'failed') {
          clearInterval(checkInterval)
          reject(new Error(job.error || 'Job failed'))
          return
        }

        if (Date.now() - startTime > timeoutMs) {
          clearInterval(checkInterval)
          reject(new Error('Job timeout'))
          return
        }
      }, 1000)
    })
  }

  /**
   * Batch process multiple outlets
   */
  async batchScrapeOutlets(outletUrls: string[], tenantId: string): Promise<string[]> {
    console.log(`Starting batch scraping for ${outletUrls.length} outlets`)
    
    const jobIds: string[] = []
    
    // Process outlets in batches to avoid overwhelming the system
    const batchSize = 3
    for (let i = 0; i < outletUrls.length; i += batchSize) {
      const batch = outletUrls.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (url) => {
        try {
          const jobId = await this.scrapeOutletContacts({ outlet_url: url, tenant_id: tenantId })
          return jobId
        } catch (error) {
          console.error(`Error scraping ${url}:`, error)
          return null
        }
      })

      const batchJobIds = await Promise.all(batchPromises)
      jobIds.push(...batchJobIds.filter(id => id !== null))

      // Wait between batches to respect rate limits
      if (i + batchSize < outletUrls.length) {
        await this.delay(5000)
      }
    }

    return jobIds
  }

  /**
   * Get all discovered contacts for a tenant
   */
  async getDiscoveredContacts(tenantId: string, filters?: {
    verification_status?: string
    beat?: string
    confidence_threshold?: number
    limit?: number
    offset?: number
  }) {
    try {
      let query = supabase
        .from('journalist_contacts')
        .select(`
          *,
          media_outlets (
            name,
            website,
            outlet_type,
            category
          )
        `)
        .eq('tenant_id', tenantId)
        .eq('data_source', 'automated_scraping')

      if (filters?.verification_status) {
        query = query.eq('verification_status', filters.verification_status)
      }

      if (filters?.beat) {
        query = query.eq('beat', filters.beat)
      }

      if (filters?.confidence_threshold) {
        query = query.gte('confidence_score', filters.confidence_threshold)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
      }

      const { data, error } = await query.order('confidence_score', { ascending: false })

      if (error) {
        throw new Error(`Error fetching contacts: ${error.message}`)
      }

      return data || []

    } catch (error) {
      console.error('Error getting discovered contacts:', error)
      throw error
    }
  }

  /**
   * Get monitoring alerts
   */
  async getMonitoringAlerts(tenantId: string, filters?: {
    alert_type?: string
    severity?: string
    since?: string
    limit?: number
  }) {
    try {
      let query = supabase
        .from('monitoring_alerts')
        .select('*')
        .eq('tenant_id', tenantId)

      if (filters?.alert_type) {
        query = query.eq('alert_type', filters.alert_type)
      }

      if (filters?.severity) {
        query = query.eq('alert_severity', filters.severity)
      }

      if (filters?.since) {
        query = query.gte('detected_at', filters.since)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query.order('detected_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching alerts: ${error.message}`)
      }

      return data || []

    } catch (error) {
      console.error('Error getting monitoring alerts:', error)
      throw error
    }
  }

  /**
   * Get discovery statistics
   */
  async getDiscoveryStatistics(tenantId: string) {
    try {
      const { data: contacts, error: contactsError } = await supabase
        .from('journalist_contacts')
        .select('verification_status, beat, confidence_score')
        .eq('tenant_id', tenantId)
        .eq('data_source', 'automated_scraping')

      if (contactsError) {
        throw new Error(`Error fetching statistics: ${contactsError.message}`)
      }

      const stats = {
        total_contacts: contacts?.length || 0,
        verified_contacts: contacts?.filter(c => c.verification_status === 'verified').length || 0,
        pending_verification: contacts?.filter(c => c.verification_status === 'pending').length || 0,
        high_confidence: contacts?.filter(c => c.confidence_score >= 80).length || 0,
        beat_distribution: {} as { [beat: string]: number },
        average_confidence: 0
      }

      // Calculate beat distribution
      contacts?.forEach(contact => {
        if (contact.beat) {
          stats.beat_distribution[contact.beat] = (stats.beat_distribution[contact.beat] || 0) + 1
        }
      })

      // Calculate average confidence
      if (contacts && contacts.length > 0) {
        stats.average_confidence = contacts.reduce((sum, c) => sum + (c.confidence_score || 0), 0) / contacts.length
      }

      return stats

    } catch (error) {
      console.error('Error getting discovery statistics:', error)
      throw error
    }
  }

  private updateJobStatus(jobId: string, status: DiscoveryJob['status'], progress: number, result?: any, error?: string) {
    const job = this.jobs.get(jobId)
    if (job) {
      job.status = status
      job.progress = progress
      if (result) job.result = result
      if (error) job.error = error
      if (status === 'completed' || status === 'failed') {
        job.completed_at = new Date().toISOString()
      }
      this.jobs.set(jobId, job)
    }
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const mediaDiscoveryService = new MediaDiscoveryService()