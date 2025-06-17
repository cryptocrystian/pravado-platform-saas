import { useState, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { useUserTenant } from './useUserData'
import { mediaDiscoveryService, DiscoveryJob } from '@/services/mediaDiscoveryService'

export interface UseMediaDiscoveryResult {
  // Scraping functions
  scrapeOutlet: (outletUrl: string) => Promise<string>
  batchScrapeOutlets: (outletUrls: string[]) => Promise<string[]>
  
  // Verification functions
  verifyContacts: (contactIds: string[]) => Promise<string>
  
  // Categorization functions
  categorizeContacts: (contactIds: string[]) => Promise<string>
  
  // Monitoring functions
  startMonitoring: () => Promise<string>
  
  // Job management
  getJobStatus: (jobId: string) => DiscoveryJob | null
  waitForJob: (jobId: string) => Promise<DiscoveryJob>
  
  // Data queries
  discoveredContacts: any[]
  monitoringAlerts: any[]
  discoveryStats: any
  
  // Loading states
  isScrapingOutlet: boolean
  isVerifyingContacts: boolean
  isCategorizingContacts: boolean
  isStartingMonitoring: boolean
  
  // Refresh functions
  refreshDiscoveredContacts: () => void
  refreshMonitoringAlerts: () => void
  refreshStats: () => void
}

interface UseMediaDiscoveryOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  contactFilters?: {
    verification_status?: string
    beat?: string
    confidence_threshold?: number
  }
  alertFilters?: {
    alert_type?: string
    severity?: string
    since?: string
  }
}

export function useMediaDiscovery(options: UseMediaDiscoveryOptions = {}): UseMediaDiscoveryResult {
  const { data: userTenant } = useUserTenant()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [activeJobs, setActiveJobs] = useState<Set<string>>(new Set())

  // Query for discovered contacts
  const { data: discoveredContacts = [], refetch: refreshDiscoveredContacts } = useQuery({
    queryKey: ['discovered-contacts', userTenant?.id, options.contactFilters],
    queryFn: async () => {
      if (!userTenant?.id) return []
      return await mediaDiscoveryService.getDiscoveredContacts(userTenant.id, {
        ...options.contactFilters,
        limit: 100
      })
    },
    enabled: !!userTenant?.id,
    refetchInterval: options.autoRefresh ? (options.refreshInterval || 30000) : false,
  })

  // Query for monitoring alerts
  const { data: monitoringAlerts = [], refetch: refreshMonitoringAlerts } = useQuery({
    queryKey: ['monitoring-alerts', userTenant?.id, options.alertFilters],
    queryFn: async () => {
      if (!userTenant?.id) return []
      return await mediaDiscoveryService.getMonitoringAlerts(userTenant.id, {
        ...options.alertFilters,
        limit: 50
      })
    },
    enabled: !!userTenant?.id,
    refetchInterval: options.autoRefresh ? (options.refreshInterval || 60000) : false,
  })

  // Query for discovery statistics
  const { data: discoveryStats, refetch: refreshStats } = useQuery({
    queryKey: ['discovery-stats', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return null
      return await mediaDiscoveryService.getDiscoveryStatistics(userTenant.id)
    },
    enabled: !!userTenant?.id,
    refetchInterval: options.autoRefresh ? (options.refreshInterval || 120000) : false,
  })

  // Outlet scraping mutation
  const scrapingMutation = useMutation({
    mutationFn: async (outletUrl: string) => {
      if (!userTenant?.id) throw new Error('No tenant ID available')
      return await mediaDiscoveryService.scrapeOutletContacts({
        outlet_url: outletUrl,
        tenant_id: userTenant.id
      })
    },
    onSuccess: (jobId) => {
      setActiveJobs(prev => new Set([...prev, jobId]))
      toast({
        title: "Scraping Started",
        description: "Contact discovery is running in the background. You'll be notified when complete.",
      })
      
      // Poll for job completion
      pollJobCompletion(jobId, 'scraping')
    },
    onError: (error) => {
      toast({
        title: "Scraping Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Contact verification mutation
  const verificationMutation = useMutation({
    mutationFn: async (contactIds: string[]) => {
      if (!userTenant?.id) throw new Error('No tenant ID available')
      return await mediaDiscoveryService.verifyContacts({
        contact_ids: contactIds,
        tenant_id: userTenant.id
      })
    },
    onSuccess: (jobId) => {
      setActiveJobs(prev => new Set([...prev, jobId]))
      toast({
        title: "Verification Started",
        description: "Contact verification is running in the background.",
      })
      
      pollJobCompletion(jobId, 'verification')
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Contact categorization mutation
  const categorizationMutation = useMutation({
    mutationFn: async (contactIds: string[]) => {
      if (!userTenant?.id) throw new Error('No tenant ID available')
      return await mediaDiscoveryService.categorizeContacts({
        contact_ids: contactIds,
        tenant_id: userTenant.id
      })
    },
    onSuccess: (jobId) => {
      setActiveJobs(prev => new Set([...prev, jobId]))
      toast({
        title: "Categorization Started",
        description: "AI categorization is analyzing your contacts.",
      })
      
      pollJobCompletion(jobId, 'categorization')
    },
    onError: (error) => {
      toast({
        title: "Categorization Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Monitoring mutation
  const monitoringMutation = useMutation({
    mutationFn: async () => {
      if (!userTenant?.id) throw new Error('No tenant ID available')
      return await mediaDiscoveryService.startMonitoring(userTenant.id)
    },
    onSuccess: (jobId) => {
      setActiveJobs(prev => new Set([...prev, jobId]))
      toast({
        title: "Monitoring Started",
        description: "Real-time contact monitoring is now active.",
      })
      
      pollJobCompletion(jobId, 'monitoring')
    },
    onError: (error) => {
      toast({
        title: "Monitoring Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Job completion polling
  const pollJobCompletion = useCallback(async (jobId: string, jobType: string) => {
    try {
      const job = await mediaDiscoveryService.waitForJobCompletion(jobId, 300000) // 5 min timeout
      
      setActiveJobs(prev => {
        const newSet = new Set(prev)
        newSet.delete(jobId)
        return newSet
      })

      // Show completion notification
      toast({
        title: `${jobType.charAt(0).toUpperCase() + jobType.slice(1)} Complete`,
        description: getJobCompletionMessage(job, jobType),
      })

      // Refresh relevant data
      refreshDiscoveredContacts()
      refreshMonitoringAlerts()
      refreshStats()
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['discovered-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['monitoring-alerts'] })
      queryClient.invalidateQueries({ queryKey: ['discovery-stats'] })

    } catch (error) {
      setActiveJobs(prev => {
        const newSet = new Set(prev)
        newSet.delete(jobId)
        return newSet
      })

      toast({
        title: `${jobType.charAt(0).toUpperCase() + jobType.slice(1)} Failed`,
        description: error.message,
        variant: "destructive",
      })
    }
  }, [toast, refreshDiscoveredContacts, refreshMonitoringAlerts, refreshStats, queryClient])

  // Batch scraping function
  const batchScrapeOutlets = useCallback(async (outletUrls: string[]): Promise<string[]> => {
    if (!userTenant?.id) throw new Error('No tenant ID available')
    
    toast({
      title: "Batch Scraping Started",
      description: `Processing ${outletUrls.length} outlets. This may take several minutes.`,
    })

    try {
      const jobIds = await mediaDiscoveryService.batchScrapeOutlets(outletUrls, userTenant.id)
      
      // Track all batch jobs
      setActiveJobs(prev => new Set([...prev, ...jobIds]))
      
      // Poll each job for completion
      jobIds.forEach(jobId => {
        if (jobId) pollJobCompletion(jobId, 'batch-scraping')
      })

      return jobIds

    } catch (error) {
      toast({
        title: "Batch Scraping Failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }, [userTenant?.id, toast, pollJobCompletion])

  // Helper function to get job completion message
  const getJobCompletionMessage = (job: DiscoveryJob, jobType: string): string => {
    if (!job.result) return 'Job completed successfully'

    switch (jobType) {
      case 'scraping':
        return `Found ${job.result.contacts_found?.length || 0} contacts from ${job.result.outlet_name}`
      case 'verification':
        return `Verified ${job.result.summary?.successful_verifications || 0} contacts`
      case 'categorization':
        return `Categorized ${job.result.summary?.successful_categorizations || 0} contacts`
      case 'monitoring':
        return `Monitoring ${job.result.monitored_contacts || 0} contacts`
      default:
        return 'Job completed successfully'
    }
  }

  // Job status getter
  const getJobStatus = useCallback((jobId: string): DiscoveryJob | null => {
    return mediaDiscoveryService.getJobStatus(jobId)
  }, [])

  // Job waiter
  const waitForJob = useCallback(async (jobId: string): Promise<DiscoveryJob> => {
    return await mediaDiscoveryService.waitForJobCompletion(jobId)
  }, [])

  return {
    // Functions
    scrapeOutlet: scrapingMutation.mutateAsync,
    batchScrapeOutlets,
    verifyContacts: verificationMutation.mutateAsync,
    categorizeContacts: categorizationMutation.mutateAsync,
    startMonitoring: monitoringMutation.mutateAsync,
    
    // Job management
    getJobStatus,
    waitForJob,
    
    // Data
    discoveredContacts,
    monitoringAlerts,
    discoveryStats,
    
    // Loading states
    isScrapingOutlet: scrapingMutation.isPending,
    isVerifyingContacts: verificationMutation.isPending,
    isCategorizingContacts: categorizationMutation.isPending,
    isStartingMonitoring: monitoringMutation.isPending,
    
    // Refresh functions
    refreshDiscoveredContacts,
    refreshMonitoringAlerts,
    refreshStats,
  }
}