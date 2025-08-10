import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Zap, Target, BarChart3, Activity } from 'lucide-react';

interface CommandCenterProps {
  userRole: string;
  tenantId: string;
}

export const MarketingIntelligenceCommandCenter: React.FC<CommandCenterProps> = ({ userRole, tenantId }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Revolutionary AI Header */}
      <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-teal-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-8 h-8 text-teal-400 animate-pulse" />
                <div>
                  <h1 className="text-2xl font-bold">PRAVADO Intelligence Command Center</h1>
                  <p className="text-slate-300 text-sm">Revolutionary AI Marketing Operating System</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-teal-500 text-white">
                <Zap className="w-3 h-3 mr-1" />
                REVOLUTIONARY
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-300">AI Status</p>
                <p className="text-lg font-semibold text-teal-400">ACTIVE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive KPI Dashboard - 13+ Metrics Visible */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Revolutionary AI Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CiteMind™ Engine */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950 border-teal-200 dark:border-teal-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-teal-600" />
                <h3 className="text-lg font-semibold">CiteMind™ Engine</h3>
              </div>
              <Badge variant="outline" className="border-teal-500 text-teal-700 bg-teal-50">
                REVOLUTIONARY
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">AI Citations Tracked</span>
                <span className="text-xl font-bold text-teal-600">2,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Authority Score</span>
                <span className="text-xl font-bold text-blue-600">89%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Platform Coverage</span>
                <span className="text-xl font-bold text-slate-800 dark:text-slate-200">34+</span>
              </div>
            </div>
          </Card>

          {/* GEO Optimization */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold">GEO Optimization</h3>
              </div>
              <Badge variant="outline" className="border-purple-500 text-purple-700 bg-purple-50">
                INDUSTRY FIRST
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">GEO Score</span>
                <span className="text-xl font-bold text-purple-600">67%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">AI Visibility</span>
                <span className="text-xl font-bold text-blue-600">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Query Coverage</span>
                <span className="text-xl font-bold text-slate-800 dark:text-slate-200">1,234</span>
              </div>
            </div>
          </Card>

          {/* Autonomous AI */}
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950 dark:to-cyan-950 border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-semibold">Autonomous AI</h3>
              </div>
              <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50">
                SELF-OPTIMIZING
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Optimization Success</span>
                <span className="text-xl font-bold text-emerald-600">82%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Active Campaigns</span>
                <span className="text-xl font-bold text-cyan-600">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">ROI Improvement</span>
                <span className="text-xl font-bold text-slate-800 dark:text-slate-200">+$96K</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Executive KPI Grid - Enterprise Information Density */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          
          <Card className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Revenue</p>
              <p className="text-lg font-bold text-green-600">$847K</p>
              <p className="text-xs text-green-500">+23% MoM</p>
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Campaign ROI</p>
              <p className="text-lg font-bold text-blue-600">347%</p>
              <p className="text-xs text-blue-500">+45% QoQ</p>
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Media Coverage</p>
              <p className="text-lg font-bold text-purple-600">1,284</p>
              <p className="text-xs text-purple-500">+67% MoM</p>
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">SEO Traffic</p>
              <p className="text-lg font-bold text-teal-600">847K</p>
              <p className="text-xs text-teal-500">+89% YoY</p>
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Content Pieces</p>
              <p className="text-lg font-bold text-orange-600">2,847</p>
              <p className="text-xs text-orange-500">+34% MoM</p>
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Team Efficiency</p>
              <p className="text-lg font-bold text-indigo-600">94%</p>
              <p className="text-xs text-indigo-500">+12% MoM</p>
            </div>
          </Card>
        </div>

        {/* Additional Enterprise KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <p className="text-xs text-slate-500">Brand Mentions</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">47,284</p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <p className="text-xs text-slate-500">Backlinks</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">12,847</p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <p className="text-xs text-slate-500">Social Reach</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">2.4M</p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <p className="text-xs text-slate-500">Journalist Contacts</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">34,847</p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <p className="text-xs text-slate-500">Response Rate</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">67%</p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <p className="text-xs text-slate-500">Cost Savings</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">$96K</p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <p className="text-xs text-slate-500">AI Accuracy</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">94.7%</p>
          </div>
        </div>

        {/* Real-Time AI Insights */}
        <Card className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-5 h-5 text-blue-600 animate-pulse" />
            <h3 className="text-lg font-semibold">AI Intelligence Insights</h3>
            <Badge variant="outline" className="border-blue-500 text-blue-700">LIVE</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-600">Trending Opportunity</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">"TechCrunch likely to cover AI marketing trends next week - 89% confidence"</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
              <p className="text-sm font-medium text-emerald-600">Optimization Suggestion</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">"Increase PR budget by 15% for Q2 - projected +$47K ROI"</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
              <p className="text-sm font-medium text-purple-600">Competitive Intel</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">"Competitor X showing 34% drop in AI visibility - opportunity window open"</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MarketingIntelligenceCommandCenter;