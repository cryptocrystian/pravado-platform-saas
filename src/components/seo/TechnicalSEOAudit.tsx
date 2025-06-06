
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Zap, 
  Smartphone, 
  Search, 
  AlertTriangle,
  CheckCircle,
  Brain,
  BarChart3,
  Clock,
  Shield,
  Link,
  Settings
} from 'lucide-react';
import { useSEOAudits } from '@/hooks/useSEOData';

interface TechnicalSEOAuditProps {
  projectId: string | null;
  automateProgress: number;
}

export function TechnicalSEOAudit({ projectId, automateProgress }: TechnicalSEOAuditProps) {
  const [activeAuditTab, setActiveAuditTab] = useState('overview');
  const { data: audits = [] } = useSEOAudits(projectId || undefined);

  // Mock technical audit data
  const mockAuditData = {
    overall_score: 78,
    core_web_vitals_score: 72,
    mobile_score: 85,
    technical_score: 69,
    content_score: 82,
    last_audit: '2024-01-15T10:30:00Z',
    issues: {
      critical: 3,
      warning: 8,
      notice: 12
    },
    core_web_vitals: {
      lcp: { value: 2.8, status: 'good', threshold: 2.5 },
      fid: { value: 85, status: 'needs_improvement', threshold: 100 },
      cls: { value: 0.12, status: 'needs_improvement', threshold: 0.1 }
    },
    technical_issues: [
      {
        type: 'critical',
        category: 'Core Web Vitals',
        issue: 'Large Contentful Paint needs improvement',
        description: 'LCP of 2.8s exceeds recommended 2.5s threshold',
        pages_affected: 15,
        automate_step: 'Optimize Systems',
        recommendation: 'Optimize image loading and server response times'
      },
      {
        type: 'warning',
        category: 'Mobile Usability',
        issue: 'Text too small to read on mobile',
        description: 'Several pages have text smaller than 12px on mobile',
        pages_affected: 8,
        automate_step: 'Optimize Systems',
        recommendation: 'Increase font size to minimum 14px for mobile readability'
      },
      {
        type: 'notice',
        category: 'Schema Markup',
        issue: 'Missing structured data',
        description: 'Pages lack relevant schema markup for better search visibility',
        pages_affected: 23,
        automate_step: 'Optimize Systems',
        recommendation: 'Implement relevant schema markup (Article, Organization, etc.)'
      }
    ],
    pages_crawled: 45,
    crawl_errors: 2,
    broken_links: 5,
    redirect_chains: 3
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const getVitalStatus = (status: string) => {
    switch (status) {
      case 'good': return { color: 'text-green-600', bg: 'bg-green-100', label: 'Good' };
      case 'needs_improvement': return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Needs Work' };
      default: return { color: 'text-red-600', bg: 'bg-red-100', label: 'Poor' };
    }
  };

  return (
    <div className="space-y-6">
      {/* AUTOMATE Integration Header */}
      <Card className="bg-gradient-to-r from-green-500/10 to-pravado-purple/10 border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-professional-gray">Assess & Audit: Technical SEO Analysis</h3>
                <p className="text-sm text-gray-600">Comprehensive technical website analysis and optimization</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{automateProgress}%</div>
              <div className="text-sm text-gray-600">AUTOMATE Progress</div>
            </div>
          </div>
          <Progress value={automateProgress} className="h-2 mt-3" />
        </CardContent>
      </Card>

      {/* Audit Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(mockAuditData.overall_score)}`}>
              {mockAuditData.overall_score}
            </div>
            <div className="text-sm font-medium text-gray-600">Overall Score</div>
            <div className={`text-xs px-2 py-1 rounded mt-2 ${getScoreBgColor(mockAuditData.overall_score)}`}>
              {mockAuditData.overall_score >= 80 ? 'Excellent' : 
               mockAuditData.overall_score >= 60 ? 'Good' : 'Needs Improvement'}
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Zap className="w-8 h-8 mx-auto mb-2 text-pravado-orange" />
            <div className={`text-xl font-bold mb-1 ${getScoreColor(mockAuditData.core_web_vitals_score)}`}>
              {mockAuditData.core_web_vitals_score}
            </div>
            <div className="text-sm font-medium text-gray-600">Core Web Vitals</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Smartphone className="w-8 h-8 mx-auto mb-2 text-enterprise-blue" />
            <div className={`text-xl font-bold mb-1 ${getScoreColor(mockAuditData.mobile_score)}`}>
              {mockAuditData.mobile_score}
            </div>
            <div className="text-sm font-medium text-gray-600">Mobile Friendly</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Settings className="w-8 h-8 mx-auto mb-2 text-pravado-purple" />
            <div className={`text-xl font-bold mb-1 ${getScoreColor(mockAuditData.technical_score)}`}>
              {mockAuditData.technical_score}
            </div>
            <div className="text-sm font-medium text-gray-600">Technical Health</div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Actions */}
      <div className="flex flex-wrap gap-3">
        <Button>
          <Globe className="w-4 h-4 mr-2" />
          Run Full Audit
        </Button>
        <Button variant="outline">
          <Zap className="w-4 h-4 mr-2" />
          Check Core Web Vitals
        </Button>
        <Button variant="outline">
          <Smartphone className="w-4 h-4 mr-2" />
          Mobile Usability Test
        </Button>
        <Button variant="outline">
          <Search className="w-4 h-4 mr-2" />
          Schema Markup Check
        </Button>
      </div>

      <Tabs value={activeAuditTab} onValueChange={setActiveAuditTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="core-vitals">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="technical">Technical Issues</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          <TabsTrigger value="crawl">Crawl Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-enterprise-blue" />
                  <span>Audit Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pages Crawled</span>
                    <span className="font-medium">{mockAuditData.pages_crawled}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical Issues</span>
                    <Badge className="bg-red-100 text-red-800">{mockAuditData.issues.critical}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Warnings</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{mockAuditData.issues.warning}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notices</span>
                    <Badge className="bg-blue-100 text-blue-800">{mockAuditData.issues.notice}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Audit</span>
                    <span className="text-sm text-gray-600">Jan 15, 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-pravado-purple" />
                  <span>AUTOMATE Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-green-900 text-sm">Priority 1: Core Web Vitals</div>
                    <div className="text-sm text-green-700">Optimize LCP to advance Optimize Systems step</div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-blue-900 text-sm">Priority 2: Mobile Optimization</div>
                    <div className="text-sm text-blue-700">Improve mobile usability scores</div>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="font-medium text-purple-900 text-sm">Priority 3: Schema Markup</div>
                    <div className="text-sm text-purple-700">Implement structured data for better visibility</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="core-vitals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-pravado-orange" />
                <span>Core Web Vitals Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(mockAuditData.core_web_vitals).map(([metric, data]) => {
                  const status = getVitalStatus(data.status);
                  return (
                    <div key={metric} className="text-center">
                      <div className="mb-3">
                        <div className="text-lg font-semibold uppercase text-gray-600">{metric}</div>
                        <div className="text-sm text-gray-500">
                          {metric === 'lcp' ? 'Largest Contentful Paint' :
                           metric === 'fid' ? 'First Input Delay' : 'Cumulative Layout Shift'}
                        </div>
                      </div>
                      <div className={`text-3xl font-bold mb-2 ${status.color}`}>
                        {data.value}{metric === 'lcp' ? 's' : metric === 'fid' ? 'ms' : ''}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.bg}`}>
                        {status.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Threshold: {data.threshold}{metric === 'lcp' ? 's' : metric === 'fid' ? 'ms' : ''}
                      </div>
                      
                      <div className="mt-4">
                        <Button size="sm" variant="outline" className="w-full">
                          Optimize {metric.toUpperCase()}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-pravado-purple" />
                <span>Technical Issues</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAuditData.technical_issues.map((issue, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getIssueIcon(issue.type)}
                        <h3 className="font-semibold text-professional-gray">{issue.issue}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-pravado-purple/10 text-pravado-purple">
                          {issue.automate_step}
                        </Badge>
                        <Badge className={`${
                          issue.type === 'critical' ? 'bg-red-100 text-red-800' :
                          issue.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {issue.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{issue.pages_affected}</span> pages affected
                      </div>
                      <Button size="sm">
                        View Details
                      </Button>
                    </div>
                    
                    <div className="mt-3 p-3 bg-soft-gray rounded">
                      <div className="text-sm font-medium text-gray-700 mb-1">Recommendation:</div>
                      <div className="text-sm text-gray-600">{issue.recommendation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-enterprise-blue" />
                <span>Mobile Usability</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Mobile Usability Analysis</h3>
                <p className="text-gray-500 mb-6">
                  Comprehensive mobile-friendliness testing and optimization recommendations
                </p>
                <Button>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Run Mobile Audit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crawl" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-green-600" />
                <span>Crawl Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-soft-gray rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">{mockAuditData.pages_crawled}</div>
                  <div className="text-sm text-gray-600">Pages Successfully Crawled</div>
                </div>
                <div className="text-center p-4 bg-soft-gray rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-2">{mockAuditData.crawl_errors}</div>
                  <div className="text-sm text-gray-600">Crawl Errors</div>
                </div>
                <div className="text-center p-4 bg-soft-gray rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">{mockAuditData.broken_links}</div>
                  <div className="text-sm text-gray-600">Broken Links</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
