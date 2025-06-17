import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { useUserTenant } from '@/hooks/useUserData'
import { useMediaDiscovery } from '@/hooks/useMediaDiscovery'
import { mediaDeploymentService, DeploymentProgress } from '@/services/mediaDeploymentService'
import { TOP_TECH_BUSINESS_OUTLETS, getOutletStatistics } from '@/data/topMediaOutlets'
import { 
  Play, Pause, RotateCcw, Database, TrendingUp, 
  Users, CheckCircle, AlertCircle, Clock, Zap,
  Globe, Target, Brain, Shield, Activity
} from 'lucide-react'

export function MediaDatabaseDashboard() {
  const { data: userTenant } = useUserTenant()
  const { toast } = useToast()
  const { discoveryStats, discoveredContacts, monitoringAlerts, refreshStats } = useMediaDiscovery({
    autoRefresh: true,
    refreshInterval: 30000
  })

  const [activeDeployment, setActiveDeployment] = useState<string | null>(null)
  const [deploymentProgress, setDeploymentProgress] = useState<DeploymentProgress | null>(null)
  const [deploymentHistory, setDeploymentHistory] = useState<any[]>([])
  const [isDeploying, setIsDeploying] = useState(false)

  // Auto-refresh deployment progress
  useEffect(() => {
    if (activeDeployment) {
      const interval = setInterval(() => {
        const progress = mediaDeploymentService.getDeploymentProgress(activeDeployment)
        if (progress) {
          setDeploymentProgress(progress)
          
          // Check if deployment completed
          if (progress.current_phase === 'completed') {
            setActiveDeployment(null)
            setIsDeploying(false)
            refreshStats()
            
            toast({
              title: "Database Deployment Complete! 🎉",
              description: `Successfully discovered ${progress.total_contacts_discovered} contacts from ${progress.completed_outlets} outlets`,
            })
          }
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [activeDeployment, refreshStats, toast])

  const startQuickDeployment = async () => {
    if (!userTenant?.id) {
      toast({
        title: "Error",
        description: "No tenant ID available",
        variant: "destructive",
      })
      return
    }

    try {
      setIsDeploying(true)
      
      const deploymentId = await mediaDeploymentService.quickStartDeployment(
        userTenant.id,
        (progress) => {
          setDeploymentProgress(progress)
        }
      )
      
      setActiveDeployment(deploymentId)
      
      toast({
        title: "Database Deployment Started! 🚀",
        description: "Building the world's most comprehensive media database. This will take 2-4 hours.",
      })

    } catch (error) {
      setIsDeploying(false)
      toast({
        title: "Deployment Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const startAggressiveDeployment = async () => {
    if (!userTenant?.id) return

    try {
      setIsDeploying(true)
      
      const deploymentId = await mediaDeploymentService.aggressiveDeployment(
        userTenant.id,
        (progress) => {
          setDeploymentProgress(progress)
        }
      )
      
      setActiveDeployment(deploymentId)
      
      toast({
        title: "Aggressive Deployment Started! 🏃‍♂️",
        description: "Rapid database building in progress. Verification and categorization skipped for speed.",
      })

    } catch (error) {
      setIsDeploying(false)
      toast({
        title: "Deployment Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const startPremiumDeployment = async () => {
    if (!userTenant?.id) return

    try {
      setIsDeploying(true)
      
      const deploymentId = await mediaDeploymentService.premiumDeployment(
        userTenant.id,
        (progress) => {
          setDeploymentProgress(progress)
        }
      )
      
      setActiveDeployment(deploymentId)
      
      toast({
        title: "Premium Deployment Started! 💎",
        description: "Full AI intelligence deployment with verification and categorization.",
      })

    } catch (error) {
      setIsDeploying(false)
      toast({
        title: "Deployment Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime)
    const now = new Date()
    const diffMs = now.getTime() - start.getTime()
    const minutes = Math.floor(diffMs / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'scraping': return <Database className="h-4 w-4" />
      case 'verification': return <Shield className="h-4 w-4" />
      case 'categorization': return <Brain className="h-4 w-4" />
      case 'monitoring': return <Activity className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const outletStats = getOutletStatistics()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Database Command Center</h1>
          <p className="text-muted-foreground">
            Build and manage the world's most comprehensive journalist database
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={startQuickDeployment}
            disabled={isDeploying}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Quick Start (Recommended)
          </Button>
          <Button 
            onClick={startAggressiveDeployment}
            disabled={isDeploying}
            variant="outline"
          >
            <Zap className="h-4 w-4 mr-2" />
            Aggressive Mode
          </Button>
          <Button 
            onClick={startPremiumDeployment}
            disabled={isDeploying}
            variant="outline"
          >
            <Target className="h-4 w-4 mr-2" />
            Premium Mode
          </Button>
        </div>
      </div>

      {/* Active Deployment Status */}
      {deploymentProgress && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getPhaseIcon(deploymentProgress.current_phase)}
                <CardTitle className="text-blue-800">
                  Deployment in Progress - {deploymentProgress.current_phase.replace('_', ' ').toUpperCase()}
                </CardTitle>
              </div>
              <Badge variant="secondary">
                {formatDuration(deploymentProgress.start_time)} elapsed
              </Badge>
            </div>
            <CardDescription className="text-blue-600">
              Phase {deploymentProgress.phase_progress}% complete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={deploymentProgress.phase_progress} className="w-full" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber(deploymentProgress.total_contacts_discovered)}
                </div>
                <div className="text-muted-foreground">Contacts Discovered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {deploymentProgress.completed_outlets}
                </div>
                <div className="text-muted-foreground">Outlets Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatNumber(deploymentProgress.total_contacts_verified)}
                </div>
                <div className="text-muted-foreground">Contacts Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatNumber(deploymentProgress.total_contacts_categorized)}
                </div>
                <div className="text-muted-foreground">Contacts Categorized</div>
              </div>
            </div>

            {deploymentProgress.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Deployment Errors ({deploymentProgress.errors.length})</AlertTitle>
                <AlertDescription>
                  {deploymentProgress.errors.slice(-3).map((error, index) => (
                    <div key={index} className="text-xs mt-1">{error}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(discoveryStats?.total_contacts || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Target: {formatNumber(outletStats.total_estimated_contacts)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Contacts</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber(discoveryStats?.verified_contacts || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {discoveryStats?.total_contacts ? 
                    Math.round((discoveryStats.verified_contacts / discoveryStats.total_contacts) * 100) : 0}% verified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Confidence</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(discoveryStats?.high_confidence || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  80%+ confidence score
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {discoveryStats?.average_confidence ? Math.round(discoveryStats.average_confidence) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Data quality score
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Beat Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Distribution by Beat</CardTitle>
              <CardDescription>
                Journalist specialization breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {discoveryStats?.beat_distribution && Object.entries(discoveryStats.beat_distribution).map(([beat, count]) => (
                  <div key={beat} className="text-center">
                    <div className="text-lg font-semibold">{count}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {beat.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          {/* Target Outlets */}
          <Card>
            <CardHeader>
              <CardTitle>Target Media Outlets</CardTitle>
              <CardDescription>
                {outletStats.total_outlets} premium outlets targeting {formatNumber(outletStats.total_estimated_contacts)} journalists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">By Category</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(outletStats.by_category).map(([category, count]) => (
                      <div key={category} className="flex justify-between">
                        <span className="capitalize">{category.replace('_', ' ')}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">By Priority</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(outletStats.by_priority).map(([priority, count]) => (
                      <div key={priority} className="flex justify-between">
                        <span className="capitalize">{priority.replace('_', ' ')}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">High-Value Targets</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Tier 1 Outlets</span>
                      <span className="font-medium">{outletStats.by_priority.tier_1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High Discovery Potential</span>
                      <span className="font-medium">{outletStats.high_value_outlets}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deployment Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Quick Start</CardTitle>
                <CardDescription>
                  Recommended for first-time deployment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <div>• 3 outlets per batch</div>
                  <div>• Full verification & AI categorization</div>
                  <div>• Real-time monitoring enabled</div>
                  <div>• Estimated time: 3-4 hours</div>
                </div>
                <Button 
                  onClick={startQuickDeployment}
                  disabled={isDeploying}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Quick Deployment
                </Button>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800">Aggressive Mode</CardTitle>
                <CardDescription>
                  Maximum speed, minimal processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <div>• 5 outlets per batch</div>
                  <div>• Skip verification & categorization</div>
                  <div>• Raw contact discovery only</div>
                  <div>• Estimated time: 1-2 hours</div>
                </div>
                <Button 
                  onClick={startAggressiveDeployment}
                  disabled={isDeploying}
                  variant="outline"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Start Aggressive Mode
                </Button>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800">Premium Mode</CardTitle>
                <CardDescription>
                  Maximum quality with full AI processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <div>• 2 outlets per batch</div>
                  <div>• Deep verification & analysis</div>
                  <div>• Advanced AI categorization</div>
                  <div>• Estimated time: 4-6 hours</div>
                </div>
                <Button 
                  onClick={startPremiumDeployment}
                  disabled={isDeploying}
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Start Premium Mode
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          {/* Recent Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Discovered Contacts</CardTitle>
              <CardDescription>
                Latest journalist contacts added to the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              {discoveredContacts.length > 0 ? (
                <div className="space-y-3">
                  {discoveredContacts.slice(0, 10).map((contact, index) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">
                          {contact.first_name} {contact.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contact.title} at {contact.outlet_name}
                        </div>
                        {contact.beat && (
                          <Badge variant="secondary" className="mt-1">
                            {contact.beat}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {contact.confidence_score}% confidence
                        </div>
                        <Badge 
                          variant={contact.verification_status === 'verified' ? 'default' : 'secondary'}
                        >
                          {contact.verification_status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No contacts discovered yet. Start a deployment to begin building your database.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          {/* Monitoring Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Monitoring Alerts</CardTitle>
              <CardDescription>
                Automatic updates on contact changes and opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {monitoringAlerts.length > 0 ? (
                <div className="space-y-3">
                  {monitoringAlerts.slice(0, 10).map((alert, index) => (
                    <Alert key={alert.id}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="capitalize">
                        {alert.alert_type.replace('_', ' ')} - {alert.alert_severity}
                      </AlertTitle>
                      <AlertDescription>
                        {alert.alert_message}
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.detected_at).toLocaleString()}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No monitoring alerts yet. Enable monitoring to track contact changes automatically.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}