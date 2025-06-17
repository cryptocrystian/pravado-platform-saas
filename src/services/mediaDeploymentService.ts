import { mediaDiscoveryService } from './mediaDiscoveryService'
import { TOP_TECH_BUSINESS_OUTLETS, TargetOutlet, getOutletsByPriority, getOutletsByDifficulty } from '@/data/topMediaOutlets'

export interface DeploymentConfig {
  tenant_id: string
  batch_size: number
  delay_between_batches: number
  priority_order: ('tier_1' | 'tier_2' | 'tier_3')[]
  difficulty_preference: ('easy' | 'medium' | 'hard')[]
  max_concurrent_jobs: number
  auto_verify: boolean
  auto_categorize: boolean
  enable_monitoring: boolean
}

export interface DeploymentProgress {
  total_outlets: number
  completed_outlets: number
  failed_outlets: number
  active_jobs: number
  total_contacts_discovered: number
  total_contacts_verified: number
  total_contacts_categorized: number
  estimated_completion_time: string
  current_phase: 'scraping' | 'verification' | 'categorization' | 'monitoring' | 'completed'
  phase_progress: number
  start_time: string
  last_update: string
  errors: string[]
  warnings: string[]
}

export interface DeploymentResult {
  deployment_id: string
  success: boolean
  total_contacts_discovered: number
  outlets_processed: number
  outlets_failed: string[]
  processing_time_minutes: number
  next_steps: string[]
}

class MediaDeploymentService {
  private activeDeployments = new Map<string, DeploymentProgress>()
  private deploymentCallbacks = new Map<string, (progress: DeploymentProgress) => void>()

  /**
   * Deploy the complete media database scraping system
   */
  async deployMediaDatabase(config: DeploymentConfig, onProgress?: (progress: DeploymentProgress) => void): Promise<string> {
    const deploymentId = this.generateDeploymentId()
    
    console.log(`🚀 Starting media database deployment: ${deploymentId}`)
    console.log(`📊 Target: ${TOP_TECH_BUSINESS_OUTLETS.length} outlets, estimated ${this.calculateTotalContacts()} contacts`)

    // Initialize deployment tracking
    const progress: DeploymentProgress = {
      total_outlets: TOP_TECH_BUSINESS_OUTLETS.length,
      completed_outlets: 0,
      failed_outlets: 0,
      active_jobs: 0,
      total_contacts_discovered: 0,
      total_contacts_verified: 0,
      total_contacts_categorized: 0,
      estimated_completion_time: this.calculateEstimatedCompletion(config),
      current_phase: 'scraping',
      phase_progress: 0,
      start_time: new Date().toISOString(),
      last_update: new Date().toISOString(),
      errors: [],
      warnings: []
    }

    this.activeDeployments.set(deploymentId, progress)
    if (onProgress) {
      this.deploymentCallbacks.set(deploymentId, onProgress)
    }

    // Start deployment process asynchronously
    this.executeDeployment(deploymentId, config).catch(error => {
      console.error(`Deployment ${deploymentId} failed:`, error)
      progress.errors.push(`Deployment failed: ${error.message}`)
      this.updateProgress(deploymentId, progress)
    })

    return deploymentId
  }

  /**
   * Execute the complete deployment process
   */
  private async executeDeployment(deploymentId: string, config: DeploymentConfig): Promise<void> {
    const progress = this.activeDeployments.get(deploymentId)!

    try {
      // Phase 1: Prioritized Outlet Scraping
      console.log(`📡 Phase 1: Starting outlet scraping`)
      progress.current_phase = 'scraping'
      this.updateProgress(deploymentId, progress)

      const scrapingResults = await this.executePhasedScraping(deploymentId, config)
      progress.total_contacts_discovered = scrapingResults.total_contacts
      progress.completed_outlets = scrapingResults.successful_outlets
      progress.failed_outlets = scrapingResults.failed_outlets

      // Phase 2: Contact Verification (if enabled)
      if (config.auto_verify && progress.total_contacts_discovered > 0) {
        console.log(`🔍 Phase 2: Starting contact verification`)
        progress.current_phase = 'verification'
        progress.phase_progress = 0
        this.updateProgress(deploymentId, progress)

        const verificationResults = await this.executeContactVerification(deploymentId, config)
        progress.total_contacts_verified = verificationResults.verified_count
      }

      // Phase 3: AI Categorization (if enabled)
      if (config.auto_categorize && progress.total_contacts_verified > 0) {
        console.log(`🧠 Phase 3: Starting AI categorization`)
        progress.current_phase = 'categorization'
        progress.phase_progress = 0
        this.updateProgress(deploymentId, progress)

        const categorizationResults = await this.executeContactCategorization(deploymentId, config)
        progress.total_contacts_categorized = categorizationResults.categorized_count
      }

      // Phase 4: Enable Monitoring (if enabled)
      if (config.enable_monitoring) {
        console.log(`📊 Phase 4: Enabling real-time monitoring`)
        progress.current_phase = 'monitoring'
        progress.phase_progress = 0
        this.updateProgress(deploymentId, progress)

        await this.enableRealTimeMonitoring(deploymentId, config)
      }

      // Deployment completed
      progress.current_phase = 'completed'
      progress.phase_progress = 100
      progress.last_update = new Date().toISOString()
      this.updateProgress(deploymentId, progress)

      console.log(`✅ Deployment ${deploymentId} completed successfully!`)
      console.log(`📈 Results: ${progress.total_contacts_discovered} contacts discovered, ${progress.total_contacts_verified} verified, ${progress.total_contacts_categorized} categorized`)

    } catch (error) {
      progress.errors.push(`Deployment error: ${error.message}`)
      progress.current_phase = 'completed'
      this.updateProgress(deploymentId, progress)
      throw error
    }
  }

  /**
   * Execute phased scraping with prioritization
   */
  private async executePhasedScraping(deploymentId: string, config: DeploymentConfig): Promise<{
    total_contacts: number
    successful_outlets: number
    failed_outlets: number
  }> {
    const progress = this.activeDeployments.get(deploymentId)!
    let totalContacts = 0
    let successfulOutlets = 0
    let failedOutlets = 0

    // Process outlets by priority order
    for (const priority of config.priority_order) {
      console.log(`🎯 Processing ${priority} outlets`)
      
      const priorityOutlets = getOutletsByPriority(priority)
      const sortedOutlets = this.sortOutletsByDifficulty(priorityOutlets, config.difficulty_preference)

      // Process in batches
      for (let i = 0; i < sortedOutlets.length; i += config.batch_size) {
        const batch = sortedOutlets.slice(i, i + config.batch_size)
        
        try {
          const batchResults = await this.processBatch(batch, config)
          
          // Update progress
          totalContacts += batchResults.total_contacts
          successfulOutlets += batchResults.successful_outlets
          failedOutlets += batchResults.failed_outlets

          progress.total_contacts_discovered = totalContacts
          progress.completed_outlets = successfulOutlets
          progress.failed_outlets = failedOutlets
          progress.phase_progress = Math.round((successfulOutlets + failedOutlets) / progress.total_outlets * 100)
          progress.last_update = new Date().toISOString()
          
          this.updateProgress(deploymentId, progress)

          console.log(`✅ Batch completed: ${batchResults.successful_outlets} successful, ${batchResults.failed_outlets} failed, ${batchResults.total_contacts} contacts`)

          // Delay between batches
          if (i + config.batch_size < sortedOutlets.length) {
            console.log(`⏱️ Waiting ${config.delay_between_batches}ms before next batch...`)
            await this.delay(config.delay_between_batches)
          }

        } catch (error) {
          console.error(`❌ Batch processing failed:`, error)
          progress.errors.push(`Batch processing failed: ${error.message}`)
          failedOutlets += batch.length
        }
      }
    }

    return { total_contacts: totalContacts, successful_outlets: successfulOutlets, failed_outlets: failedOutlets }
  }

  /**
   * Process a batch of outlets
   */
  private async processBatch(outlets: TargetOutlet[], config: DeploymentConfig): Promise<{
    total_contacts: number
    successful_outlets: number
    failed_outlets: number
  }> {
    const jobPromises = outlets.map(async (outlet) => {
      try {
        console.log(`🔄 Scraping ${outlet.name} (${outlet.website})`)
        
        const jobId = await mediaDiscoveryService.scrapeOutletContacts({
          outlet_url: outlet.website,
          tenant_id: config.tenant_id
        })

        // Wait for completion
        const job = await mediaDiscoveryService.waitForJobCompletion(jobId, 300000) // 5 min timeout
        
        if (job.status === 'completed' && job.result) {
          console.log(`✅ ${outlet.name}: Found ${job.result.contacts_found?.length || 0} contacts`)
          return {
            success: true,
            outlet: outlet.name,
            contacts: job.result.contacts_found?.length || 0
          }
        } else {
          console.log(`❌ ${outlet.name}: Scraping failed - ${job.error || 'Unknown error'}`)
          return {
            success: false,
            outlet: outlet.name,
            contacts: 0,
            error: job.error
          }
        }

      } catch (error) {
        console.log(`❌ ${outlet.name}: Exception - ${error.message}`)
        return {
          success: false,
          outlet: outlet.name,
          contacts: 0,
          error: error.message
        }
      }
    })

    const results = await Promise.all(jobPromises)
    
    const totalContacts = results.reduce((sum, result) => sum + result.contacts, 0)
    const successfulOutlets = results.filter(result => result.success).length
    const failedOutlets = results.filter(result => !result.success).length

    return { total_contacts: totalContacts, successful_outlets: successfulOutlets, failed_outlets: failedOutlets }
  }

  /**
   * Execute contact verification phase
   */
  private async executeContactVerification(deploymentId: string, config: DeploymentConfig): Promise<{
    verified_count: number
  }> {
    console.log(`🔍 Starting contact verification phase`)
    
    // Get all discovered contacts
    const contacts = await mediaDiscoveryService.getDiscoveredContacts(config.tenant_id, {
      verification_status: 'pending',
      limit: 1000
    })

    if (contacts.length === 0) {
      console.log(`⚠️ No contacts found for verification`)
      return { verified_count: 0 }
    }

    console.log(`📝 Verifying ${contacts.length} contacts`)

    // Process in smaller batches for verification
    const verificationBatchSize = 20
    let verifiedCount = 0

    for (let i = 0; i < contacts.length; i += verificationBatchSize) {
      const batch = contacts.slice(i, i + verificationBatchSize)
      const contactIds = batch.map(contact => contact.id)

      try {
        const jobId = await mediaDiscoveryService.verifyContacts({
          contact_ids: contactIds,
          tenant_id: config.tenant_id
        })

        const job = await mediaDiscoveryService.waitForJobCompletion(jobId, 600000) // 10 min timeout
        
        if (job.status === 'completed' && job.result) {
          verifiedCount += job.result.summary?.successful_verifications || 0
          console.log(`✅ Verified batch: ${job.result.summary?.successful_verifications || 0} contacts`)
        }

        // Update progress
        const progress = this.activeDeployments.get(deploymentId)!
        progress.total_contacts_verified = verifiedCount
        progress.phase_progress = Math.round(((i + verificationBatchSize) / contacts.length) * 100)
        progress.last_update = new Date().toISOString()
        this.updateProgress(deploymentId, progress)

        // Brief delay between verification batches
        await this.delay(5000)

      } catch (error) {
        console.error(`❌ Verification batch failed:`, error)
        const progress = this.activeDeployments.get(deploymentId)!
        progress.errors.push(`Verification batch failed: ${error.message}`)
        this.updateProgress(deploymentId, progress)
      }
    }

    return { verified_count: verifiedCount }
  }

  /**
   * Execute contact categorization phase
   */
  private async executeContactCategorization(deploymentId: string, config: DeploymentConfig): Promise<{
    categorized_count: number
  }> {
    console.log(`🧠 Starting AI categorization phase`)
    
    // Get verified contacts
    const contacts = await mediaDiscoveryService.getDiscoveredContacts(config.tenant_id, {
      verification_status: 'verified',
      limit: 1000
    })

    if (contacts.length === 0) {
      console.log(`⚠️ No verified contacts found for categorization`)
      return { categorized_count: 0 }
    }

    console.log(`🎯 Categorizing ${contacts.length} contacts`)

    // Process in smaller batches for AI categorization
    const categorizationBatchSize = 10
    let categorizedCount = 0

    for (let i = 0; i < contacts.length; i += categorizationBatchSize) {
      const batch = contacts.slice(i, i + categorizationBatchSize)
      const contactIds = batch.map(contact => contact.id)

      try {
        const jobId = await mediaDiscoveryService.categorizeContacts({
          contact_ids: contactIds,
          tenant_id: config.tenant_id
        })

        const job = await mediaDiscoveryService.waitForJobCompletion(jobId, 900000) // 15 min timeout
        
        if (job.status === 'completed' && job.result) {
          categorizedCount += job.result.summary?.successful_categorizations || 0
          console.log(`✅ Categorized batch: ${job.result.summary?.successful_categorizations || 0} contacts`)
        }

        // Update progress
        const progress = this.activeDeployments.get(deploymentId)!
        progress.total_contacts_categorized = categorizedCount
        progress.phase_progress = Math.round(((i + categorizationBatchSize) / contacts.length) * 100)
        progress.last_update = new Date().toISOString()
        this.updateProgress(deploymentId, progress)

        // Longer delay between AI processing batches
        await this.delay(10000)

      } catch (error) {
        console.error(`❌ Categorization batch failed:`, error)
        const progress = this.activeDeployments.get(deploymentId)!
        progress.errors.push(`Categorization batch failed: ${error.message}`)
        this.updateProgress(deploymentId, progress)
      }
    }

    return { categorized_count: categorizedCount }
  }

  /**
   * Enable real-time monitoring
   */
  private async enableRealTimeMonitoring(deploymentId: string, config: DeploymentConfig): Promise<void> {
    try {
      console.log(`📊 Enabling real-time monitoring`)
      
      const jobId = await mediaDiscoveryService.startMonitoring(config.tenant_id)
      const job = await mediaDiscoveryService.waitForJobCompletion(jobId, 120000) // 2 min timeout
      
      if (job.status === 'completed') {
        console.log(`✅ Real-time monitoring enabled for ${job.result?.monitored_contacts || 0} contacts`)
      }

      const progress = this.activeDeployments.get(deploymentId)!
      progress.phase_progress = 100
      progress.last_update = new Date().toISOString()
      this.updateProgress(deploymentId, progress)

    } catch (error) {
      console.error(`❌ Failed to enable monitoring:`, error)
      const progress = this.activeDeployments.get(deploymentId)!
      progress.warnings.push(`Failed to enable monitoring: ${error.message}`)
      this.updateProgress(deploymentId, progress)
    }
  }

  /**
   * Get deployment progress
   */
  getDeploymentProgress(deploymentId: string): DeploymentProgress | null {
    return this.activeDeployments.get(deploymentId) || null
  }

  /**
   * Get deployment statistics
   */
  async getDeploymentStatistics(tenantId: string) {
    try {
      const stats = await mediaDiscoveryService.getDiscoveryStatistics(tenantId)
      
      return {
        ...stats,
        deployment_coverage: {
          total_target_outlets: TOP_TECH_BUSINESS_OUTLETS.length,
          estimated_target_contacts: this.calculateTotalContacts(),
          actual_contacts_discovered: stats.total_contacts,
          coverage_percentage: Math.round((stats.total_contacts / this.calculateTotalContacts()) * 100)
        }
      }
    } catch (error) {
      console.error('Error getting deployment statistics:', error)
      throw error
    }
  }

  /**
   * Quick start deployment with recommended settings
   */
  async quickStartDeployment(tenantId: string, onProgress?: (progress: DeploymentProgress) => void): Promise<string> {
    console.log(`🚀 Starting Quick Start deployment for world-class media database`)
    
    const quickConfig: DeploymentConfig = {
      tenant_id: tenantId,
      batch_size: 3, // Conservative batch size
      delay_between_batches: 15000, // 15 second delays
      priority_order: ['tier_1', 'tier_2', 'tier_3'],
      difficulty_preference: ['easy', 'medium', 'hard'],
      max_concurrent_jobs: 3,
      auto_verify: true,
      auto_categorize: true,
      enable_monitoring: true
    }

    return await this.deployMediaDatabase(quickConfig, onProgress)
  }

  /**
   * Aggressive deployment for maximum speed
   */
  async aggressiveDeployment(tenantId: string, onProgress?: (progress: DeploymentProgress) => void): Promise<string> {
    console.log(`🏃‍♂️ Starting Aggressive deployment for rapid database building`)
    
    const aggressiveConfig: DeploymentConfig = {
      tenant_id: tenantId,
      batch_size: 5, // Larger batches
      delay_between_batches: 5000, // Shorter delays
      priority_order: ['tier_1', 'tier_2', 'tier_3'],
      difficulty_preference: ['easy', 'medium', 'hard'],
      max_concurrent_jobs: 5,
      auto_verify: false, // Skip verification for speed
      auto_categorize: false, // Skip categorization for speed
      enable_monitoring: false
    }

    return await this.deployMediaDatabase(aggressiveConfig, onProgress)
  }

  /**
   * Premium deployment with full AI processing
   */
  async premiumDeployment(tenantId: string, onProgress?: (progress: DeploymentProgress) => void): Promise<string> {
    console.log(`💎 Starting Premium deployment with full AI intelligence`)
    
    const premiumConfig: DeploymentConfig = {
      tenant_id: tenantId,
      batch_size: 2, // Smaller batches for quality
      delay_between_batches: 20000, // Longer delays for reliability
      priority_order: ['tier_1', 'tier_2', 'tier_3'],
      difficulty_preference: ['easy', 'medium', 'hard'],
      max_concurrent_jobs: 2,
      auto_verify: true,
      auto_categorize: true,
      enable_monitoring: true
    }

    return await this.deployMediaDatabase(premiumConfig, onProgress)
  }

  private sortOutletsByDifficulty(outlets: TargetOutlet[], preference: ('easy' | 'medium' | 'hard')[]): TargetOutlet[] {
    return outlets.sort((a, b) => {
      const aIndex = preference.indexOf(a.scraping_difficulty)
      const bIndex = preference.indexOf(b.scraping_difficulty)
      return aIndex - bIndex
    })
  }

  private calculateTotalContacts(): number {
    return TOP_TECH_BUSINESS_OUTLETS.reduce((total, outlet) => total + outlet.estimated_staff, 0)
  }

  private calculateEstimatedCompletion(config: DeploymentConfig): string {
    const totalOutlets = TOP_TECH_BUSINESS_OUTLETS.length
    const batchCount = Math.ceil(totalOutlets / config.batch_size)
    const scrapingTimeMs = batchCount * (config.delay_between_batches + 60000) // 1 min per batch + delays
    
    let totalTimeMs = scrapingTimeMs
    
    if (config.auto_verify) {
      totalTimeMs += 900000 // 15 minutes for verification
    }
    
    if (config.auto_categorize) {
      totalTimeMs += 1800000 // 30 minutes for categorization
    }
    
    const completionTime = new Date(Date.now() + totalTimeMs)
    return completionTime.toISOString()
  }

  private updateProgress(deploymentId: string, progress: DeploymentProgress): void {
    progress.last_update = new Date().toISOString()
    this.activeDeployments.set(deploymentId, progress)
    
    const callback = this.deploymentCallbacks.get(deploymentId)
    if (callback) {
      callback(progress)
    }
  }

  private generateDeploymentId(): string {
    return `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const mediaDeploymentService = new MediaDeploymentService()