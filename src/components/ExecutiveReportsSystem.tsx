import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Download,
  Share2,
  Calendar,
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
  PieChart,
  Users,
  Clock,
  Settings,
  Plus,
  Eye,
  Mail,
  Presentation,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { enterpriseAnalyticsService, ExecutiveReport } from '@/services/enterpriseAnalyticsService';
import { useAuth } from '@/contexts/AuthContext';

interface ExecutiveReportsSystemProps {
  tenantId: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  type: 'executive_summary' | 'roi_analysis' | 'pillar_performance' | 'client_presentation';
  description: string;
  icon: any;
  features: string[];
  audience: string;
}

const ExecutiveReportsSystem: React.FC<ExecutiveReportsSystemProps> = ({ tenantId }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ExecutiveReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [newReport, setNewReport] = useState({
    report_type: 'executive_summary' as const,
    period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    period_end: new Date().toISOString().split('T')[0],
    client_id: '',
    custom_metrics: [] as string[]
  });

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'executive_summary',
      name: 'Executive Summary',
      type: 'executive_summary',
      description: 'High-level overview for C-suite executives',
      icon: Presentation,
      features: ['KPI Dashboard', 'ROI Analysis', 'Key Insights', 'Recommendations'],
      audience: 'C-Suite, Board Members'
    },
    {
      id: 'roi_analysis',
      name: 'ROI Deep Dive',
      type: 'roi_analysis',
      description: 'Detailed return on investment analysis',
      icon: DollarSign,
      features: ['Attribution Modeling', 'Cost Analysis', 'Revenue Tracking', 'Efficiency Metrics'],
      audience: 'Marketing Directors, CFOs'
    },
    {
      id: 'pillar_performance',
      name: 'Pillar Performance',
      type: 'pillar_performance',
      description: 'Content, PR, and SEO performance breakdown',
      icon: BarChart3,
      features: ['Individual Pillar Metrics', 'Cross-Pillar Analysis', 'Optimization Areas'],
      audience: 'Marketing Teams, Department Heads'
    },
    {
      id: 'client_presentation',
      name: 'Client Presentation',
      type: 'client_presentation',
      description: 'White-labeled reports for client meetings',
      icon: Users,
      features: ['Custom Branding', 'Executive Summary', 'Performance Highlights', 'Next Steps'],
      audience: 'Clients, Stakeholders'
    }
  ];

  useEffect(() => {
    loadReports();
  }, [tenantId]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would fetch from the database
      // For now, we'll simulate some sample reports
      const sampleReports: ExecutiveReport[] = [
        {
          id: '1',
          tenant_id: tenantId,
          report_name: 'Q4 Executive Summary',
          report_type: 'executive_summary',
          period_start: '2024-10-01',
          period_end: '2024-12-31',
          status: 'published',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          auto_generated: false
        },
        {
          id: '2',
          tenant_id: tenantId,
          report_name: 'Monthly ROI Analysis - December',
          report_type: 'roi_analysis',
          period_start: '2024-12-01',
          period_end: '2024-12-31',
          status: 'draft',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          auto_generated: true
        }
      ];
      setReports(sampleReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!tenantId) return;

    try {
      setGeneratingReport(true);
      const report = await enterpriseAnalyticsService.generateExecutiveReport(tenantId, newReport);
      setReports([report, ...reports]);
      setShowCreateDialog(false);
      setNewReport({
        report_type: 'executive_summary',
        period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        period_end: new Date().toISOString().split('T')[0],
        client_id: '',
        custom_metrics: []
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleExportReport = async (reportId: string, format: 'pdf' | 'excel' | 'powerpoint') => {
    // Simulate export functionality
    console.log(`Exporting report ${reportId} as ${format}`);
    alert(`Report exported as ${format.toUpperCase()}. Download will begin shortly.`);
  };

  const handleShareReport = (reportId: string) => {
    // Generate shareable link
    const shareUrl = `${window.location.origin}/reports/shared/${reportId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportTypeIcon = (type: string) => {
    const template = reportTemplates.find(t => t.type === type);
    return template?.icon || FileText;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-professional-gray">Executive Reports</h2>
          <p className="text-gray-600">Generate comprehensive reports for stakeholders and clients</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Report Type Selection */}
              <div>
                <Label className="text-base font-medium">Report Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  {reportTemplates.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <Card
                        key={template.id}
                        className={`p-4 cursor-pointer transition-all ${
                          newReport.report_type === template.type
                            ? 'border-enterprise-blue bg-blue-50'
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => setNewReport({ ...newReport, report_type: template.type })}
                      >
                        <div className="flex items-start space-x-3">
                          <IconComponent className="h-6 w-6 text-enterprise-blue mt-1" />
                          <div className="flex-1">
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                {template.audience}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newReport.period_start}
                    onChange={(e) => setNewReport({ ...newReport, period_start: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newReport.period_end}
                    onChange={(e) => setNewReport({ ...newReport, period_end: e.target.value })}
                  />
                </div>
              </div>

              {/* Client Selection (for client presentations) */}
              {newReport.report_type === 'client_presentation' && (
                <div>
                  <Label htmlFor="client-id">Client</Label>
                  <Select value={newReport.client_id} onValueChange={(value) => setNewReport({ ...newReport, client_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client1">Acme Corporation</SelectItem>
                      <SelectItem value="client2">TechStart Inc.</SelectItem>
                      <SelectItem value="client3">Global Ventures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Features Preview */}
              <div>
                <Label className="text-base font-medium">Report Features</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    {reportTemplates.find(t => t.type === newReport.report_type)?.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateReport} disabled={generatingReport}>
                  {generatingReport ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-enterprise-blue/10 rounded-lg">
              <FileText className="h-6 w-6 text-enterprise-blue" />
            </div>
            <div>
              <div className="text-2xl font-bold">{reports.length}</div>
              <div className="text-sm text-gray-600">Total Reports</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{reports.filter(r => r.status === 'published').length}</div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{reports.filter(r => r.status === 'draft').length}</div>
              <div className="text-sm text-gray-600">Drafts</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{reports.filter(r => r.auto_generated).length}</div>
              <div className="text-sm text-gray-600">Auto-Generated</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Reports</h3>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading reports...
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
              <p className="text-gray-600 mb-6">Generate your first executive report to get started</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Report
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => {
                const IconComponent = getReportTypeIcon(report.report_type);
                return (
                  <Card key={report.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{report.report_name}</h3>
                          <p className="text-gray-600 capitalize">{report.report_type.replace('_', ' ')}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{formatDate(report.period_start)} - {formatDate(report.period_end)}</span>
                            <span>•</span>
                            <span>Created {formatDate(report.created_at || '')}</span>
                            {report.auto_generated && (
                              <>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs">Auto-generated</Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(report.status || 'draft')}>
                          {report.status || 'draft'}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShareReport(report.id || '')}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Select>
                            <SelectTrigger className="w-auto">
                              <Download className="h-4 w-4" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pdf" onClick={() => handleExportReport(report.id || '', 'pdf')}>
                                Export as PDF
                              </SelectItem>
                              <SelectItem value="excel" onClick={() => handleExportReport(report.id || '', 'excel')}>
                                Export as Excel
                              </SelectItem>
                              <SelectItem value="powerpoint" onClick={() => handleExportReport(report.id || '', 'powerpoint')}>
                                Export as PowerPoint
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Report Templates */}
      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Available Report Types</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTemplates.map((template) => {
              const IconComponent = template.icon;
              return (
                <Card key={template.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-enterprise-blue/10 rounded-lg">
                      <IconComponent className="h-8 w-8 text-enterprise-blue" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{template.name}</h3>
                      <p className="text-gray-600 mt-1">{template.description}</p>
                      <div className="mt-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">Features:</div>
                        <div className="flex flex-wrap gap-2">
                          {template.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3">
                        <Badge variant="secondary" className="text-xs">
                          {template.audience}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExecutiveReportsSystem;