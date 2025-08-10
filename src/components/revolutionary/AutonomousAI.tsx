import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Brain, 
  Zap, 
  CheckCircle, 
  Clock, 
  Target,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Rocket,
  Settings,
  Play,
  Pause
} from 'lucide-react';

interface AutonomousAIProps {
  tenantId: string;
}

interface AutonomousAction {
  id: string;
  type: 'optimization' | 'budget_reallocation' | 'content_suggestion' | 'campaign_adjustment';
  title: string;
  description: string;
  confidence: number;
  impact: string;
  status: 'pending' | 'approved' | 'executing' | 'completed';
  roi_projection: string;
  created_at: string;
}

interface AIInsight {
  type: 'opportunity' | 'warning' | 'success';
  message: string;
  confidence: number;
  action_required: boolean;
}

export const AutonomousAI: React.FC<AutonomousAIProps> = ({ tenantId }) => {
  const [isActive, setIsActive] = useState(true);
  const [successRate, setSuccessRate] = useState(82);
  const [activeCampaigns, setActiveCampaigns] = useState(47);
  const [roiImprovement, setROIImprovement] = useState(96000);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSuccessRate(prev => Math.min(100, prev + Math.random() * 0.5));
      setActiveCampaigns(prev => prev + (Math.random() > 0.8 ? 1 : 0));
      setROIImprovement(prev => prev + Math.floor(Math.random() * 100));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const autonomousActions: AutonomousAction[] = [
    {
      id: '1',
      type: 'budget_reallocation',
      title: 'Budget Optimization Detected',
      description: 'Reallocate 15% PR budget to content marketing for Q2 based on performance trends',
      confidence: 94,
      impact: 'High',
      status: 'pending',
      roi_projection: '+$47K',
      created_at: '2 minutes ago'
    },
    {
      id: '2',
      type: 'optimization',
      title: 'Campaign Performance Enhancement',
      description: 'Adjust targeting parameters for "Enterprise Marketing" campaign - 23% improvement projected',
      confidence: 87,
      impact: 'Medium',
      status: 'executing',
      roi_projection: '+$23K',
      created_at: '8 minutes ago'
    },
    {
      id: '3',
      type: 'content_suggestion',
      title: 'Trending Topic Opportunity',
      description: 'Create content around "AI Marketing ROI" - TechCrunch coverage likely next week',
      confidence: 89,
      impact: 'High',
      status: 'pending',
      roi_projection: '+$31K',
      created_at: '12 minutes ago'
    },
    {
      id: '4',
      type: 'campaign_adjustment',
      title: 'Seasonal Campaign Optimization',
      description: 'Increase Q2 campaign intensity by 28% based on historical performance patterns',
      confidence: 76,
      impact: 'Medium',
      status: 'completed',
      roi_projection: '+$19K',
      created_at: '1 hour ago'
    }
  ];

  const aiInsights: AIInsight[] = [
    {
      type: 'opportunity',
      message: 'Competitor XYZ showing 34% decrease in ad spend - perfect timing to increase market share',
      confidence: 91,
      action_required: true
    },
    {
      type: 'success',
      message: 'Your autonomous budget reallocation last week resulted in 47% ROI improvement',
      confidence: 100,
      action_required: false
    },
    {
      type: 'warning',
      message: 'Campaign fatigue detected on "SaaS Marketing" - recommend creative refresh',
      confidence: 83,
      action_required: true
    }
  ];

  const handleApproveAction = (actionId: string) => {
    // Handle action approval
    console.log('Approving action:', actionId);
  };

  const handleRejectAction = (actionId: string) => {
    // Handle action rejection
    console.log('Rejecting action:', actionId);
  };

  return (
    <div className="space-y-6">
      {/* Autonomous AI Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-cyan-900 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-emerald-400 animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold">Autonomous AI Marketing</h1>
                <p className="text-emerald-200 text-sm">Self-Optimizing Campaign Intelligence</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant="secondary" className="bg-emerald-500 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                REVOLUTIONARY
              </Badge>
              <Badge variant="secondary" className="bg-cyan-500 text-white">
                SELF-OPTIMIZING
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsActive(!isActive)}
              className="border-white text-white hover:bg-white hover:text-emerald-900"
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause AI
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Activate AI
                </>
              )}
            </Button>
            <div className="text-right">
              <p className="text-sm text-emerald-200">AI Status</p>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <p className="text-lg font-semibold">{isActive ? 'ACTIVE' : 'PAUSED'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Autonomous AI Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 text-emerald-600" />
            <Badge variant="outline" className="text-xs border-emerald-500">LIVE</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Optimization Success Rate</p>
          <p className="text-2xl font-bold text-emerald-600">{successRate.toFixed(1)}%</p>
          <p className="text-xs text-green-600">+3.2% this week</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-6 h-6 text-cyan-600" />
            <Badge variant="outline" className="text-xs border-cyan-500">ACTIVE</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Campaigns</p>
          <p className="text-2xl font-bold text-cyan-600">{activeCampaigns}</p>
          <p className="text-xs text-green-600">+5 this month</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-teal-600" />
            <Badge variant="outline" className="text-xs border-teal-500">ROI</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">ROI Improvement</p>
          <p className="text-2xl font-bold text-teal-600">${(roiImprovement / 1000).toFixed(0)}K</p>
          <p className="text-xs text-green-600">+$12K this week</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <Badge variant="outline" className="text-xs border-blue-500">AI</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Predictions Made</p>
          <p className="text-2xl font-bold text-blue-600">2,847</p>
          <p className="text-xs text-blue-600">94.7% accuracy</p>
        </Card>
      </div>

      {/* Pending Autonomous Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Autonomous Actions Requiring Approval</span>
          </h3>
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            {autonomousActions.filter(a => a.status === 'pending').length} Pending
          </Badge>
        </div>

        <div className="space-y-4">
          {autonomousActions.map((action) => (
            <div key={action.id} className={`p-4 rounded-lg border ${
              action.status === 'pending' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950' :
              action.status === 'executing' ? 'border-blue-200 bg-blue-50 dark:bg-blue-950' :
              action.status === 'completed' ? 'border-green-200 bg-green-50 dark:bg-green-950' :
              'border-slate-200 bg-slate-50 dark:bg-slate-800'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {action.type === 'budget_reallocation' && <Target className="w-4 h-4 text-blue-600" />}
                      {action.type === 'optimization' && <Zap className="w-4 h-4 text-purple-600" />}
                      {action.type === 'content_suggestion' && <Sparkles className="w-4 h-4 text-emerald-600" />}
                      {action.type === 'campaign_adjustment' && <Settings className="w-4 h-4 text-orange-600" />}
                      <h4 className="font-medium">{action.title}</h4>
                    </div>
                    <Badge variant="outline" className={`text-xs ${
                      action.status === 'pending' ? 'border-yellow-500 text-yellow-700' :
                      action.status === 'executing' ? 'border-blue-500 text-blue-700' :
                      action.status === 'completed' ? 'border-green-500 text-green-700' :
                      'border-slate-500 text-slate-700'
                    }`}>
                      {action.status === 'executing' && <Activity className="w-3 h-3 mr-1 animate-spin" />}
                      {action.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {action.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {action.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{action.description}</p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="flex items-center space-x-1">
                      <Brain className="w-3 h-3" />
                      <span>Confidence: {action.confidence}%</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Impact: {action.impact}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-green-600">
                      <span>ROI: {action.roi_projection}</span>
                    </span>
                    <span className="text-slate-500">{action.created_at}</span>
                  </div>
                </div>
                {action.status === 'pending' && (
                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => handleApproveAction(action.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectAction(action.id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Intelligence Insights */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-emerald-600 animate-pulse" />
          <h3 className="text-lg font-semibold">AI Intelligence Insights</h3>
          <Badge variant="outline" className="border-emerald-500 text-emerald-700">REVOLUTIONARY</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((insight, index) => (
            <div key={index} className={`bg-white dark:bg-slate-800 p-4 rounded-lg border ${
              insight.type === 'opportunity' ? 'border-blue-200' :
              insight.type === 'success' ? 'border-green-200' : 'border-orange-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {insight.type === 'opportunity' && <Rocket className="w-4 h-4 text-blue-500" />}
                {insight.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                {insight.type === 'warning' && <AlertCircle className="w-4 h-4 text-orange-500" />}
                <p className={`text-sm font-medium ${
                  insight.type === 'opportunity' ? 'text-blue-700' :
                  insight.type === 'success' ? 'text-green-700' : 'text-orange-700'
                }`}>
                  {insight.type === 'opportunity' ? 'Market Opportunity' :
                   insight.type === 'success' ? 'Success Update' : 'Attention Required'}
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{insight.message}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {insight.confidence}% confidence
                </Badge>
                {insight.action_required && (
                  <Badge variant="outline" className="text-xs border-red-500 text-red-700">
                    Action Required
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AutonomousAI;