
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/MetricCard';
import { MetricCardSkeleton } from '@/components/MetricCardSkeleton';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, FileText, Target, Clock } from 'lucide-react';

export function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    {
      title: "Active Campaigns",
      value: "0",
      icon: TrendingUp,
      description: "Running marketing campaigns",
      accentColor: "#c3073f", // PRAVADO crimson
      trend: 'neutral' as const
    },
    {
      title: "Content Pieces",
      value: "0",
      icon: FileText,
      description: "Published content assets",
      accentColor: "#059669", // Success green
      trend: 'neutral' as const
    },
    {
      title: "SEO Keywords",
      value: "0",
      icon: Target,
      description: "Tracked search terms",
      accentColor: "#1e40af", // Enterprise blue
      trend: 'neutral' as const
    },
    {
      title: "Team Members",
      value: "1",
      icon: Users,
      description: "Active platform users",
      accentColor: "#6f2dbd", // PRAVADO purple
      trend: 'up' as const
    }
  ];

  const recentActivities = [
    "Platform setup completed",
    "Welcome to PRAVADO Marketing OS",
    "Dashboard configured successfully"
  ];

  return (
    <div className="flex-1 bg-soft-gray min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-accent to-enterprise-blue text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="animate-fade-in">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">Welcome back, Sarah!</h1>
              <p className="text-lg text-blue-100">Ready to accelerate your marketing success?</p>
            </div>
            <div className="mt-6 lg:mt-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <Button 
                className="bg-white text-enterprise-blue hover:bg-gray-100 transition-all duration-200 hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-enterprise-blue"
                onClick={() => console.log('Create campaign')}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Performance Metrics */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-professional-gray mb-6 animate-fade-in">Performance Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, index) => (
                  <MetricCardSkeleton key={index} />
                ))
              ) : (
                // Actual metric cards
                metrics.map((metric, index) => (
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
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="p-6 bg-white border border-border-gray hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in">
              <h3 className="text-lg font-semibold text-professional-gray mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-blue-50 hover:border-enterprise-blue transition-all duration-200 focus:ring-2 focus:ring-enterprise-blue focus:ring-offset-2"
                  onClick={() => console.log('Create campaign')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Campaign
                </Button>
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
              </div>
            </Card>

            {/* Getting Started */}
            <Card className="p-6 bg-white border border-border-gray hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h3 className="text-lg font-semibold text-professional-gray mb-4">Getting Started</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 transition-all duration-200 hover:bg-soft-gray p-2 rounded-md cursor-pointer">
                  <div className="w-3 h-3 bg-pravado-orange rounded-full animate-pulse"></div>
                  <span className="text-sm text-professional-gray">Set up your first campaign</span>
                </div>
                <div className="flex items-center space-x-3 transition-all duration-200 hover:bg-soft-gray p-2 rounded-md cursor-pointer">
                  <div className="w-3 h-3 bg-border-gray rounded-full"></div>
                  <span className="text-sm text-professional-gray">Invite team members</span>
                </div>
                <div className="flex items-center space-x-3 transition-all duration-200 hover:bg-soft-gray p-2 rounded-md cursor-pointer">
                  <div className="w-3 h-3 bg-border-gray rounded-full"></div>
                  <span className="text-sm text-professional-gray">Configure analytics</span>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 bg-white border border-border-gray hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-enterprise-blue" />
                <h3 className="text-lg font-semibold text-professional-gray">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-3 transition-all duration-200 hover:bg-soft-gray p-2 rounded-md cursor-pointer"
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <div className="w-2 h-2 bg-enterprise-blue rounded-full mt-2 animate-pulse"></div>
                    <span className="text-sm text-professional-gray">{activity}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
