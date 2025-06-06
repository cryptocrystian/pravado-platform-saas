
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Zap,
  Shield,
  Smartphone,
  Search,
  Brain,
  Play
} from 'lucide-react';
import { useSEOAudits } from '@/hooks/useSEOData';

interface TechnicalSEOAuditProps {
  projectId?: string | null;
  automateProgress: number;
}

export function TechnicalSEOAudit({ projectId, automateProgress }: TechnicalSEOAuditProps) {
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const { data: audits = [] } = useSEOAudits(projectId || undefined);

  const mockAuditData = {
    overall_score: 78,
    core_web_vitals: {
      lcp: { score: 85, status: 'good', value: '2.1s' },
      fid: { score: 92, status: 'good', value: '45ms' },
      cls: { score: 76, status: 'needs_improvement', value: '0.08' }
    },
    technical_issues: [
      { type: 'error', title: 'Missing meta descriptions', count: 12, priority: 'high' },
      { type: 'warning', title: 'Large image files', count: 8, priority: 'medium' },
      { type: 'error', title: 'Broken internal links', count: 3, priority: 'high' },
      { type: 'warning', title: 'Missing alt text', count: 15, priority: 'medium' },
      { type: 'info', title: 'HTTP links (not HTTPS)', count: 5, priority: 'low' }
    ],
    site_health: {
      indexability: 94,
      crawlability: 88,
      mobile_friendly: 96,
      page_speed: 82,
      security: 98
    }
  };

  const runAudit = async () => {
    setIsRunningAudit(true);
    // Simulate audit process
    setTimeout(() => {
      setIsRunningAudit(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with AUTOMATE Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-professional-gray">Technical SEO Audit</h2>
          <p className="text-gray-600">Assess & Audit methodology for technical optimization</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-pravado-purple" />
            <span className="text-sm text-pravado-purple font-medium">
              Assess & Audit: {automateProgress}%
            </span>
          </div>
          <Button onClick={runAudit} disabled={isRunningAudit}>
            <Play className="h-4 w-4 mr-2" />
            {isRunningAudit ? 'Running Audit...' : 'Run New Audit'}
          </Button>
        </div>
      </div>

      {/* AUTOMATE Progress */}
      <Card className="bg-gradient-to-r from-pravado-purple/10 to-enterprise-blue/10 border-l-4 border-l-pravado-purple">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-professional-gray">Assess & Audit Progress</span>
            <span className="text-sm text-pravado-purple font-bold">{automateProgress}%</span>
          </div>
          <Progress value={automateProgress} className="h-2 mb-2" />
          <div className="text-xs text-gray-600">
            Technical assessment and audit within AUTOMATE methodology
          </div>
        </CardContent>
      </Card>

      {/* Overall Score */}
      <Card className="bg-gradient-to-r from-enterprise-blue/10 to-pravado-orange/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-professional-gray">Overall SEO Health Score</h3>
              <p className="text-gray-600">Based on technical SEO factors</p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(mockAuditData.overall_score)}`}>
                {mockAuditData.overall_score}
              </div>
              <div className="text-sm text-gray-600">out of 100</div>
            </div>
          </div>
          <Progress value={mockAuditData.overall_score} className="mt-4 h-3" />
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-pravado-orange" />
            <span>Core Web Vitals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${getScoreBgColor(mockAuditData.core_web_vitals.lcp.score)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">LCP (Loading)</span>
                <div className={`font-bold ${getScoreColor(mockAuditData.core_web_vitals.lcp.score)}`}>
                  {mockAuditData.core_web_vitals.lcp.value}
                </div>
              </div>
              <Progress value={mockAuditData.core_web_vitals.lcp.score} className="h-2" />
              <div className="text-xs text-gray-600 mt-1">
                Score: {mockAuditData.core_web_vitals.lcp.score}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${getScoreBgColor(mockAuditData.core_web_vitals.fid.score)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">FID (Interactivity)</span>
                <div className={`font-bold ${getScoreColor(mockAuditData.core_web_vitals.fid.score)}`}>
                  {mockAuditData.core_web_vitals.fid.value}
                </div>
              </div>
              <Progress value={mockAuditData.core_web_vitals.fid.score} className="h-2" />
              <div className="text-xs text-gray-600 mt-1">
                Score: {mockAuditData.core_web_vitals.fid.score}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${getScoreBgColor(mockAuditData.core_web_vitals.cls.score)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">CLS (Stability)</span>
                <div className={`font-bold ${getScoreColor(mockAuditData.core_web_vitals.cls.score)}`}>
                  {mockAuditData.core_web_vitals.cls.value}
                </div>
              </div>
              <Progress value={mockAuditData.core_web_vitals.cls.score} className="h-2" />
              <div className="text-xs text-gray-600 mt-1">
                Score: {mockAuditData.core_web_vitals.cls.score}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">Issues & Recommendations</TabsTrigger>
          <TabsTrigger value="health">Site Health</TabsTrigger>
          <TabsTrigger value="history">Audit History</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Issues & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAuditData.technical_issues.map((issue, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(issue.type)}
                      <div>
                        <div className="font-medium text-professional-gray">{issue.title}</div>
                        <div className="text-sm text-gray-600">{issue.count} instances found</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(issue.priority)}>
                        {issue.priority}
                      </Badge>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Search className="h-8 w-8 text-enterprise-blue" />
                  <div className={`text-2xl font-bold ${getScoreColor(mockAuditData.site_health.indexability)}`}>
                    {mockAuditData.site_health.indexability}%
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-professional-gray">Indexability</h3>
                <Progress value={mockAuditData.site_health.indexability} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Globe className="h-8 w-8 text-pravado-orange" />
                  <div className={`text-2xl font-bold ${getScoreColor(mockAuditData.site_health.crawlability)}`}>
                    {mockAuditData.site_health.crawlability}%
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-professional-gray">Crawlability</h3>
                <Progress value={mockAuditData.site_health.crawlability} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Smartphone className="h-8 w-8 text-pravado-purple" />
                  <div className={`text-2xl font-bold ${getScoreColor(mockAuditData.site_health.mobile_friendly)}`}>
                    {mockAuditData.site_health.mobile_friendly}%
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-professional-gray">Mobile-Friendly</h3>
                <Progress value={mockAuditData.site_health.mobile_friendly} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                  <div className={`text-2xl font-bold ${getScoreColor(mockAuditData.site_health.page_speed)}`}>
                    {mockAuditData.site_health.page_speed}%
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-professional-gray">Page Speed</h3>
                <Progress value={mockAuditData.site_health.page_speed} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div className={`text-2xl font-bold ${getScoreColor(mockAuditData.site_health.security)}`}>
                    {mockAuditData.site_health.security}%
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-professional-gray">Security</h3>
                <Progress value={mockAuditData.site_health.security} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audits.length > 0 ? (
                  audits.map((audit) => (
                    <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium text-professional-gray">{audit.audit_type}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(audit.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className={`text-lg font-bold ${getScoreColor(audit.overall_score)}`}>
                          {audit.overall_score}%
                        </div>
                        <Button size="sm" variant="outline">View Report</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No audit history yet. Run your first audit to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
