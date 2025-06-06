
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Brain, AlertTriangle } from 'lucide-react';

interface PerformanceMetrics {
  methodologyAdherence: number;
  campaignROI: number;
  performanceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface CampaignPerformanceCorrelationProps {
  campaignId: string;
  methodologyProgress: number;
}

export function CampaignPerformanceCorrelation({ 
  campaignId, 
  methodologyProgress 
}: CampaignPerformanceCorrelationProps) {
  // Calculate performance correlation based on methodology adherence
  const calculatePerformanceMetrics = (methodologyProgress: number): PerformanceMetrics => {
    const baseROI = 120; // Base ROI percentage
    const methodologyBonus = (methodologyProgress / 100) * 80; // Up to 80% bonus
    const campaignROI = baseROI + methodologyBonus;
    
    const performanceScore = Math.min(100, (methodologyProgress * 0.8) + (campaignROI * 0.2));
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (methodologyProgress < 40) riskLevel = 'high';
    else if (methodologyProgress < 70) riskLevel = 'medium';
    
    return {
      methodologyAdherence: methodologyProgress,
      campaignROI: Math.round(campaignROI),
      performanceScore: Math.round(performanceScore),
      riskLevel
    };
  };

  const metrics = calculatePerformanceMetrics(methodologyProgress);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    if (risk === 'high') return <AlertTriangle className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  return (
    <Card className="bg-white border-l-4 border-l-enterprise-blue">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg text-professional-gray">
          <TrendingUp className="w-5 h-5 text-enterprise-blue" />
          <span>Performance Correlation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-soft-gray rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-pravado-purple" />
              <span className="text-sm font-medium text-professional-gray">
                Methodology Adherence
              </span>
            </div>
            <p className="text-2xl font-bold text-pravado-purple">
              {metrics.methodologyAdherence}%
            </p>
            <Progress value={metrics.methodologyAdherence} className="mt-2 h-2" />
          </div>

          <div className="bg-soft-gray rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-enterprise-blue" />
              <span className="text-sm font-medium text-professional-gray">
                Projected ROI
              </span>
            </div>
            <p className="text-2xl font-bold text-enterprise-blue">
              {metrics.campaignROI}%
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Based on methodology completion
            </p>
          </div>
        </div>

        {/* Performance Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-professional-gray">Overall Performance Score</span>
            <span className="text-sm font-semibold text-enterprise-blue">
              {metrics.performanceScore}/100
            </span>
          </div>
          <Progress value={metrics.performanceScore} className="h-3" />
        </div>

        {/* Risk Assessment */}
        <div className="flex items-center justify-between p-4 bg-soft-gray rounded-lg">
          <div className="flex items-center space-x-2">
            {getRiskIcon(metrics.riskLevel)}
            <span className="font-medium text-professional-gray">Risk Level</span>
          </div>
          <Badge className={getRiskColor(metrics.riskLevel)}>
            {metrics.riskLevel} risk
          </Badge>
        </div>

        {/* Methodology Impact Insights */}
        <div className="space-y-3">
          <h4 className="font-medium text-professional-gray">Methodology Impact</h4>
          
          {metrics.methodologyAdherence < 60 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Low methodology adherence detected.</strong> Completing more AUTOMATE steps 
                could improve campaign ROI by up to {Math.round((100 - metrics.methodologyAdherence) * 0.8)}%.
              </p>
            </div>
          )}

          {metrics.methodologyAdherence >= 60 && metrics.methodologyAdherence < 85 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Good progress!</strong> Complete remaining AUTOMATE steps to maximize 
                campaign performance potential.
              </p>
            </div>
          )}

          {metrics.methodologyAdherence >= 85 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Excellent methodology adherence!</strong> Your campaign is positioned 
                for optimal performance with systematic execution.
              </p>
            </div>
          )}
        </div>

        {/* Benchmarking */}
        <div className="pt-4 border-t">
          <h4 className="font-medium text-professional-gray mb-3">Industry Benchmarks</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Campaign ROI</span>
              <span className="font-medium">142%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Top Quartile ROI</span>
              <span className="font-medium">185%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Your Projected ROI</span>
              <span className={`font-medium ${metrics.campaignROI >= 185 ? 'text-green-600' : 
                metrics.campaignROI >= 142 ? 'text-enterprise-blue' : 'text-red-600'}`}>
                {metrics.campaignROI}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
