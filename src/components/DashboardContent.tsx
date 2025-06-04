
import React from 'react';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/MetricCard';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, FileText, Target, Clock } from 'lucide-react';

export function DashboardContent() {
  const metrics = [
    {
      title: "Active Campaigns",
      value: "0",
      icon: TrendingUp,
      description: "Running marketing campaigns",
      accentColor: "#c3073f" // PRAVADO crimson
    },
    {
      title: "Content Pieces",
      value: "0",
      icon: FileText,
      description: "Published content assets",
      accentColor: "#059669" // Success green
    },
    {
      title: "SEO Keywords",
      value: "0",
      icon: Target,
      description: "Tracked search terms",
      accentColor: "#1e40af" // Enterprise blue
    },
    {
      title: "Team Members",
      value: "1",
      icon: Users,
      description: "Active platform users",
      accentColor: "#6f2dbd" // PRAVADO purple
    }
  ];

  const recentActivities = [
    "Platform setup completed",
    "Welcome to PRAVADO Marketing OS",
    "Dashboard configured successfully"
  ];

  return (
    <div className="flex-1 bg-soft-gray">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-accent to-enterprise-blue text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">Welcome back, Sarah!</h1>
              <p className="text-lg text-blue-100">Ready to accelerate your marketing success?</p>
            </div>
            <div className="mt-6 lg:mt-0">
              <Button className="bg-white text-enterprise-blue hover:bg-gray-100">
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
            <h2 className="text-2xl font-bold text-professional-gray mb-6">Performance Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <MetricCard 
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  icon={metric.icon}
                  description={metric.description}
                  accentColor={metric.accentColor}
                />
              ))}
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="p-6 bg-white border border-border-gray hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold text-professional-gray mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-enterprise-blue">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Campaign
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-enterprise-blue">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Content Asset
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-enterprise-blue">
                  <Target className="h-4 w-4 mr-2" />
                  Set SEO Goals
                </Button>
              </div>
            </Card>

            {/* Getting Started */}
            <Card className="p-6 bg-white border border-border-gray hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold text-professional-gray mb-4">Getting Started</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pravado-orange rounded-full"></div>
                  <span className="text-sm text-professional-gray">Set up your first campaign</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-border-gray rounded-full"></div>
                  <span className="text-sm text-professional-gray">Invite team members</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-border-gray rounded-full"></div>
                  <span className="text-sm text-professional-gray">Configure analytics</span>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 bg-white border border-border-gray hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-enterprise-blue" />
                <h3 className="text-lg font-semibold text-professional-gray">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-enterprise-blue rounded-full mt-2"></div>
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
