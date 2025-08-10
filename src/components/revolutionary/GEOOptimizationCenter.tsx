import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Search, 
  Brain,
  Target,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Lightbulb,
  Rocket
} from 'lucide-react';

interface GEOOptimizationCenterProps {
  tenantId: string;
}

interface GEOMetric {
  platform: string;
  score: number;
  visibility: number;
  queries: number;
  trend: 'up' | 'down' | 'stable';
  optimization: string;
}

export const GEOOptimizationCenter: React.FC<GEOOptimizationCenterProps> = ({ tenantId }) => {
  const [overallGEOScore, setOverallGEOScore] = useState(67);
  const [aiVisibility, setAiVisibility] = useState(45);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Real-time score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOverallGEOScore(prev => Math.min(100, prev + Math.random() * 0.5));
      setAiVisibility(prev => Math.min(100, prev + Math.random() * 0.3));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const geoMetrics: GEOMetric[] = [
    {
      platform: 'ChatGPT',
      score: 72,
      visibility: 48,
      queries: 1247,
      trend: 'up',
      optimization: 'Excellent semantic structure'
    },
    {
      platform: 'Claude',
      score: 68,
      visibility: 44,
      queries: 983,
      trend: 'up',
      optimization: 'Strong contextual relevance'
    },
    {
      platform: 'Perplexity',
      score: 81,
      visibility: 52,
      queries: 756,
      trend: 'up',
      optimization: 'Outstanding citation quality'
    },
    {
      platform: 'Gemini',
      score: 59,
      visibility: 37,
      queries: 642,
      trend: 'stable',
      optimization: 'Needs authority building'
    }
  ];

  const handleOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* GEO Optimization Header */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-800 to-teal-900 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-8 h-8 text-purple-400 animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold">GEO Optimization Center</h1>
                <p className="text-purple-200 text-sm">Generative Engine Optimization - Industry First</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant="secondary" className="bg-purple-500 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                REVOLUTIONARY
              </Badge>
              <Badge variant="secondary" className="bg-blue-500 text-white">
                INDUSTRY FIRST
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-200">Optimization Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-lg font-semibold">ACTIVE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revolutionary GEO Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-6 h-6 text-purple-600" />
            <Badge variant="outline" className="text-xs border-purple-500">REVOLUTIONARY</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Overall GEO Score</p>
          <div className="flex items-end space-x-2 mb-2">
            <p className="text-3xl font-bold text-purple-600">{overallGEOScore.toFixed(1)}%</p>
            <p className="text-sm text-green-600 pb-1">+12% this month</p>
          </div>
          <Progress value={overallGEOScore} className="h-2" />
          <p className="text-xs text-slate-500 mt-2">Industry Average: 30-40%</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950">
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-6 h-6 text-blue-600" />
            <Badge variant="outline" className="text-xs border-blue-500">LIVE</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">AI Visibility Score</p>
          <div className="flex items-end space-x-2 mb-2">
            <p className="text-3xl font-bold text-blue-600">{aiVisibility.toFixed(1)}%</p>
            <p className="text-sm text-green-600 pb-1">+8% this week</p>
          </div>
          <Progress value={aiVisibility} className="h-2" />
          <p className="text-xs text-slate-500 mt-2">Competitor average: 20-25%</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950">
          <div className="flex items-center justify-between mb-4">
            <Search className="w-6 h-6 text-teal-600" />
            <Badge variant="outline" className="text-xs border-teal-500">TRACKED</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Query Coverage</p>
          <div className="flex items-end space-x-2 mb-2">
            <p className="text-3xl font-bold text-teal-600">3,628</p>
            <p className="text-sm text-green-600 pb-1">+247 today</p>
          </div>
          <p className="text-xs text-slate-500">Across 34+ AI platforms</p>
        </Card>
      </div>

      {/* Platform Performance Breakdown */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>AI Platform Performance</span>
          </h3>
          <Button 
            onClick={handleOptimization}
            disabled={isOptimizing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isOptimizing ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Optimize All
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {geoMetrics.map((metric, index) => (
            <div key={index} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{metric.platform}</span>
                  {metric.trend === 'up' && (
                    <Badge variant="outline" className="border-green-500 text-green-700 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Up
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-slate-500">{metric.queries} queries</span>
                  {metric.score > 70 && <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-500">GEO Score</span>
                    <span className="text-sm font-semibold">{metric.score}%</span>
                  </div>
                  <Progress value={metric.score} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-500">Visibility</span>
                    <span className="text-sm font-semibold">{metric.visibility}%</span>
                  </div>
                  <Progress value={metric.visibility} className="h-1.5" />
                </div>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                AI Insight: {metric.optimization}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Revolutionary AI Optimization Insights */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="w-5 h-5 text-purple-600 animate-pulse" />
          <h3 className="text-lg font-semibold">Revolutionary GEO Insights</h3>
          <Badge variant="outline" className="border-purple-500 text-purple-700">AI-POWERED</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm font-medium text-green-700">Optimization Success</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              Your content is ranking #1 for "AI marketing platforms" on Perplexity
            </p>
            <Badge variant="outline" className="text-xs border-green-500">67% above industry average</Badge>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <p className="text-sm font-medium text-blue-700">Strategic Opportunity</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              Semantic gap detected: "marketing automation ROI" - high opportunity
            </p>
            <Badge variant="outline" className="text-xs border-blue-500">Potential +34% visibility</Badge>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-purple-500" />
              <p className="text-sm font-medium text-purple-700">Competitive Intel</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              Competitor ABC dropping 23% in AI visibility - capture opportunity
            </p>
            <Badge variant="outline" className="text-xs border-purple-500">Action recommended</Badge>
          </div>
        </div>
      </Card>

      {/* GEO Performance Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">GEO Performance Trends</h3>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
          <div className="flex items-center justify-center h-40 text-slate-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-purple-400" />
              <p className="text-sm">GEO Performance Chart</p>
              <p className="text-xs">Real-time AI platform ranking trends</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GEOOptimizationCenter;