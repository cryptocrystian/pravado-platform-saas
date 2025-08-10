import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Zap, 
  Search, 
  ExternalLink, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface CiteMindEngineProps {
  tenantId: string;
}

interface CitationData {
  id: string;
  platform: string;
  query: string;
  citations: number;
  authorityScore: number;
  trend: string;
  lastUpdated: string;
}

export const CiteMindEngine: React.FC<CiteMindEngineProps> = ({ tenantId }) => {
  const [citationData, setCitationData] = useState<CitationData[]>([]);
  const [isTracking, setIsTracking] = useState(true);
  const [totalCitations, setTotalCitations] = useState(2847);
  const [authorityScore, setAuthorityScore] = useState(89);

  // Mock real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalCitations(prev => prev + Math.floor(Math.random() * 3));
      setAuthorityScore(prev => Math.min(100, prev + Math.random() * 0.1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const mockCitationData: CitationData[] = [
    {
      id: '1',
      platform: 'ChatGPT',
      query: 'AI marketing platforms',
      citations: 847,
      authorityScore: 94,
      trend: 'up',
      lastUpdated: '2 min ago'
    },
    {
      id: '2', 
      platform: 'Claude',
      query: 'marketing automation tools',
      citations: 623,
      authorityScore: 87,
      trend: 'up',
      lastUpdated: '5 min ago'
    },
    {
      id: '3',
      platform: 'Perplexity',
      query: 'content marketing strategy',
      citations: 445,
      authorityScore: 92,
      trend: 'stable',
      lastUpdated: '8 min ago'
    },
    {
      id: '4',
      platform: 'Gemini',
      query: 'PR and SEO integration',
      citations: 324,
      authorityScore: 85,
      trend: 'up',
      lastUpdated: '12 min ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* CiteMind™ Engine Header */}
      <div className="bg-gradient-to-r from-blue-900 via-teal-800 to-cyan-900 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-teal-400 animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold">CiteMind™ Engine</h1>
                <p className="text-blue-200 text-sm">Revolutionary AI Citation Tracking System</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant="secondary" className="bg-teal-500 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                REVOLUTIONARY
              </Badge>
              <Badge variant="secondary" className="bg-blue-500 text-white">
                INDUSTRY FIRST
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">Tracking Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-lg font-semibold">ACTIVE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 text-teal-600" />
            <Badge variant="outline" className="text-xs">LIVE</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Citations</p>
          <p className="text-2xl font-bold text-teal-600">{totalCitations.toLocaleString()}</p>
          <p className="text-xs text-green-600">+127 today</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <Badge variant="outline" className="text-xs">LIVE</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Authority Score</p>
          <p className="text-2xl font-bold text-blue-600">{authorityScore.toFixed(1)}%</p>
          <p className="text-xs text-green-600">+2.3% this week</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <Badge variant="outline" className="text-xs">AI</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Platform Coverage</p>
          <p className="text-2xl font-bold text-purple-600">34+</p>
          <p className="text-xs text-blue-600">ChatGPT, Claude, Perplexity, Gemini...</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <Badge variant="outline" className="text-xs">TREND</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Weekly Growth</p>
          <p className="text-2xl font-bold text-emerald-600">+47%</p>
          <p className="text-xs text-green-600">Citations increasing</p>
        </Card>
      </div>

      {/* Platform Performance Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>AI Platform Performance</span>
          </h3>
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
            <Zap className="w-4 h-4 mr-2" />
            Track New Query
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-sm font-medium text-slate-600">Platform</th>
                <th className="text-left p-3 text-sm font-medium text-slate-600">Query</th>
                <th className="text-left p-3 text-sm font-medium text-slate-600">Citations</th>
                <th className="text-left p-3 text-sm font-medium text-slate-600">Authority Score</th>
                <th className="text-left p-3 text-sm font-medium text-slate-600">Trend</th>
                <th className="text-left p-3 text-sm font-medium text-slate-600">Last Updated</th>
                <th className="text-left p-3 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCitationData.map((row) => (
                <tr key={row.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{row.platform}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm">{row.query}</td>
                  <td className="p-3">
                    <span className="font-semibold text-teal-600">{row.citations}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-blue-600">{row.authorityScore}%</span>
                      {row.authorityScore > 90 && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                  </td>
                  <td className="p-3">
                    {row.trend === 'up' ? (
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Up
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-blue-500 text-blue-700">
                        Stable
                      </Badge>
                    )}
                  </td>
                  <td className="p-3 text-sm text-slate-500">{row.lastUpdated}</td>
                  <td className="p-3">
                    <Button size="sm" variant="outline" className="text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Insights Panel */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold">AI Intelligence Insights</h3>
          <Badge variant="outline" className="border-blue-500 text-blue-700">REVOLUTIONARY</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm font-medium text-green-700">Opportunity Detected</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              "AI marketing platforms" trending up 34% across all platforms. Recommend increasing content production.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <p className="text-sm font-medium text-blue-700">Strategic Insight</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Perplexity showing highest citation quality. Focus content optimization for this platform.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-purple-500" />
              <p className="text-sm font-medium text-purple-700">Competitive Alert</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Competitor XYZ losing citation share. Perfect timing to capture market position.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CiteMindEngine;