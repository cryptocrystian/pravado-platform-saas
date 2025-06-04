
import React from 'react';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/MetricCard';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, FileText, Target } from 'lucide-react';

export function DashboardContent() {
  const metrics = [
    {
      title: "Active Campaigns",
      value: "0",
      icon: TrendingUp,
      description: "Running marketing campaigns",
      color: "enterprise-blue"
    },
    {
      title: "Content Pieces",
      value: "0",
      icon: FileText,
      description: "Published content assets",
      color: "pravado-orange"
    },
    {
      title: "SEO Keywords",
      value: "0",
      icon: Target,
      description: "Tracked search terms",
      color: "pravado-purple"
    },
    {
      title: "Team Members",
      value: "1",
      icon: Users,
      description: "Active platform users",
      color: "enterprise-blue"
    }
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
                  color={metric.color}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border border-border-gray">
              <h3 className="text-lg font-semibold text-professional-gray mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Campaign
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Content Asset
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Set SEO Goals
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-border-gray">
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
          </div>
        </div>
      </div>
    </div>
  );
}
