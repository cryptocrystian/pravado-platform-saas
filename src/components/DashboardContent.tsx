
import React from 'react';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/MetricCard';
import { Button } from '@/components/ui/button';
import { CreateCampaignModal } from '@/components/CreateCampaignModal';
import { LoadingOptimizer } from '@/components/LoadingOptimizer';
import { MobileOptimizer } from '@/components/MobileOptimizer';
import { UserFeedback, QuickFeedback } from '@/components/UserFeedback';
import { TrendingUp, FileText, Target, Clock, ArrowRight, Brain, AlertTriangle, Home, BarChart3, Users, Settings } from 'lucide-react';
import { useUserProfile, useDashboardMetrics, useUserTenant } from '@/hooks/useUserData';
import { useCampaignMetrics, useCampaigns } from '@/hooks/useCampaigns';
import { useAutomateMethodologyProgress } from '@/hooks/useAutomateData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export function DashboardContent() {
  const { user } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: userTenant, isLoading: tenantLoading } = useUserTenant();
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: campaignMetrics, isLoading: campaignMetricsLoading } = useCampaignMetrics();
  const { data: campaigns, isLoading: campaignsLoading, refetch: refetchCampaigns } = useCampaigns();
  const { data: methodologyProgress } = useAutomateMethodologyProgress();

  const isLoading = profileLoading || tenantLoading || metricsLoading || campaignMetricsLoading;

  const userName = userProfile?.full_name || user?.user_metadata?.full_name || 'User';
  const workspaceName = userTenant?.name || 'Your Workspace';

  const recentCampaigns = campaigns?.slice(0, 3) || [];

  // Calculate AUTOMATE methodology metrics
  const overallMethodologyProgress = methodologyProgress?.length > 0 
    ? Math.round(methodologyProgress.reduce((acc, step) => acc + (step.completion_percentage || 0), 0) / methodologyProgress.length) 
    : 0;
  
  const lowAdherenceCampaigns = campaigns?.filter(campaign => {
    // For demonstration, assume campaigns with methodology progress < 60%
    return overallMethodologyProgress < 60;
  }) || [];

  const metricsData = [
    {
      title: "Active Campaigns",
      value: campaignMetrics?.active?.toString() || "0",
      icon: TrendingUp,
      description: "Running marketing campaigns",
      accentColor: "#c3073f", // PRAVADO crimson
      trend: (campaignMetrics?.active || 0) > 0 ? 'up' as const : 'neutral' as const
    },
    {
      title: "AUTOMATE Progress",
      value: `${overallMethodologyProgress}%`,
      icon: Brain,
      description: "Methodology completion",
      accentColor: "#6f2dbd", // PRAVADO purple
      trend: overallMethodologyProgress > 50 ? 'up' as const : 'neutral' as const
    },
    {
      title: "Content Pieces",
      value: metrics?.contentPieces?.toString() || "0",
      icon: FileText,
      description: "Published content assets",
      accentColor: "#059669", // Success green
      trend: (metrics?.contentPieces || 0) > 0 ? 'up' as const : 'neutral' as const
    },
    {
      title: "SEO Keywords",
      value: metrics?.seoKeywords?.toString() || "0",
      icon: Target,
      description: "Tracked search terms",
      accentColor: "#1e40af", // Enterprise blue
      trend: (metrics?.seoKeywords || 0) > 0 ? 'up' as const : 'neutral' as const
    }
  ];

  const getRecentActivities = () => {
    const activities = ["Platform setup completed"];
    
    if (userProfile) {
      activities.push(`Welcome to ${workspaceName}!`);
    }
    
    if (userTenant) {
      activities.push("Dashboard configured successfully");
    }

    // Add AUTOMATE methodology activities
    if (overallMethodologyProgress > 0) {
      activities.push(`AUTOMATE methodology: ${overallMethodologyProgress}% complete`);
    }

    // Add recent campaign activities
    if (recentCampaigns.length > 0) {
      activities.push(`Latest campaign: ${recentCampaigns[0].name}`);
    }
    
    return activities;
  };

  // Mobile navigation items
  const mobileNavItems = [
    { label: 'Dashboard', href: '/', icon: <Home className="w-5 h-5" />, active: true },
    { label: 'Campaigns', href: '/campaigns', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'AUTOMATE', href: '/automate', icon: <Brain className="w-5 h-5" /> },
    { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <MobileOptimizer>
      <div className="flex-1 bg-soft-gray min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-accent to-enterprise-blue text-white p-4 lg:p-8 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <MobileOptimizer
              mobileLayout={
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
                  <p className="text-sm text-blue-100 mb-4">{userName}</p>
                  <CreateCampaignModal onCampaignCreated={refetchCampaigns} />
                </div>
              }
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="animate-fade-in">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    Welcome back, {userName}!
                  </h1>
                  <p className="text-lg text-blue-100">Ready to accelerate your marketing success?</p>
                  {workspaceName && (
                    <p className="text-sm text-blue-200 mt-1">Working in: {workspaceName}</p>
                  )}
                </div>
                <div className="mt-6 lg:mt-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <CreateCampaignModal onCampaignCreated={refetchCampaigns} />
                </div>
              </div>
            </MobileOptimizer>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Performance Metrics */}
            <div className="mb-8">
              <h2 className="text-xl lg:text-2xl font-bold text-professional-gray mb-4 lg:mb-6 animate-fade-in">
                Performance Overview
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {isLoading ? (
                  <LoadingOptimizer type="card" count={4} />
                ) : (
                  metricsData.map((metric, index) => (
                    <div 
                      key={index} 
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <MetricCard 
                        title={metric.title}
                        value={metric.value}
                        icon={metric.icon}
                        description={metric.description}
                        accentColor={metric.accentColor}
                        trend={metric.trend}
                      />
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4">
                <QuickFeedback context="performance-metrics" />
              </div>
            </div>

            {/* AUTOMATE Methodology Alert */}
            {lowAdherenceCampaigns.length > 0 && (
              <Card className="mb-8 border-l-4 border-l-yellow-500 bg-yellow-50">
                <div className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-yellow-800">
                      Methodology Adherence Alert
                    </h3>
                  </div>
                  <p className="text-yellow-700 mt-2 text-sm lg:text-base">
                    {lowAdherenceCampaigns.length} campaign(s) have low AUTOMATE methodology adherence (&lt; 60%). 
                    Complete methodology steps to improve campaign performance.
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <Link to="/automate">
                      <Button size="sm" className="w-full sm:w-auto bg-pravado-purple hover:bg-pravado-purple/90 text-white">
                        View AUTOMATE Hub
                      </Button>
                    </Link>
                    <Link to="/campaigns">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Review Campaigns
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            {/* Three Column Layout - Mobile Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Quick Actions */}
              <Card className="p-4 lg:p-6 bg-white border border-border-gray hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in">
                <h3 className="text-lg font-semibold text-professional-gray mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <div className="w-full">
                    <CreateCampaignModal onCampaignCreated={refetchCampaigns} />
                  </div>
                  <Link to="/automate">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-purple-50 hover:border-pravado-purple transition-all duration-200 focus:ring-2 focus:ring-pravado-purple focus:ring-offset-2"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Continue AUTOMATE Steps
                    </Button>
                  </Link>
                  <MobileOptimizer hideOnMobile>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-blue-50 hover:border-enterprise-blue transition-all duration-200 focus:ring-2 focus:ring-enterprise-blue focus:ring-offset-2"
                      onClick={() => console.log('Add content')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Add Content Asset
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-blue-50 hover:border-enterprise-blue transition-all duration-200 focus:ring-2 focus:ring-enterprise-blue focus:ring-offset-2"
                      onClick={() => console.log('Set SEO goals')}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Set SEO Goals
                    </Button>
                  </MobileOptimizer>
                </div>
              </Card>

              {/* Recent Campaigns with AUTOMATE Status */}
              <Card className="p-4 lg:p-6 bg-white border border-border-gray hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-professional-gray">Recent Campaigns</h3>
                  <Link to="/campaigns">
                    <Button variant="ghost" size="sm" className="text-enterprise-blue hover:text-enterprise-blue/80">
                      <span className="hidden sm:inline">View All</span>
                      <ArrowRight className="h-4 w-4 sm:ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {campaignsLoading ? (
                    <LoadingOptimizer type="list" count={3} />
                  ) : recentCampaigns.length > 0 ? (
                    recentCampaigns.map((campaign, index) => (
                      <div 
                        key={campaign.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-soft-gray hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-professional-gray truncate">{campaign.name}</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-xs text-gray-500 truncate">{campaign.campaign_type.replace('_', ' ')}</p>
                            <span className="text-xs text-pravado-purple">• AUTOMATE: {overallMethodologyProgress}%</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1 ml-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                            campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {campaign.status}
                          </div>
                          {overallMethodologyProgress < 60 && (
                            <Brain className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-3">No campaigns created yet</p>
                      <CreateCampaignModal onCampaignCreated={refetchCampaigns} />
                    </div>
                  )}
                </div>
              </Card>

              {/* Recent Activity with AUTOMATE Integration */}
              <Card className="p-4 lg:p-6 bg-white border border-border-gray hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-enterprise-blue" />
                  <h3 className="text-lg font-semibold text-professional-gray">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  {getRecentActivities().map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-start space-x-3 transition-all duration-200 hover:bg-soft-gray p-2 rounded-md cursor-pointer"
                      style={{ animationDelay: `${(index + 3) * 100}ms` }}
                    >
                      <div className="w-2 h-2 bg-enterprise-blue rounded-full mt-2 animate-pulse flex-shrink-0"></div>
                      <span className="text-sm text-professional-gray">{activity}</span>
                    </div>
                  ))}
                  
                  {/* AUTOMATE Next Steps */}
                  {overallMethodologyProgress < 100 && (
                    <div className="mt-4 p-3 bg-pravado-purple/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-pravado-purple flex-shrink-0" />
                        <span className="text-sm font-medium text-pravado-purple">
                          Continue AUTOMATE methodology
                        </span>
                      </div>
                      <Link to="/automate">
                        <Button size="sm" variant="outline" className="mt-2 w-full sm:w-auto text-pravado-purple border-pravado-purple hover:bg-pravado-purple hover:text-white">
                          View Next Steps
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileOptimizer showOnlyMobile>
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
            <div className="grid grid-cols-5 h-16">
              {mobileNavItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`flex flex-col items-center justify-center text-xs font-medium transition-colors active:bg-gray-100 ${
                    item.active 
                      ? 'text-pravado-purple bg-pravado-purple/5' 
                      : 'text-gray-600 hover:text-pravado-purple'
                  }`}
                >
                  <div className="w-5 h-5 mb-1">
                    {item.icon}
                  </div>
                  <span className="truncate max-w-full px-1">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </MobileOptimizer>

        {/* Feedback Component */}
        <UserFeedback />
      </div>
    </MobileOptimizer>
  );
}
alert('TEST - Can you see this?');
