
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Zap, 
  Settings, 
  Database, 
  Globe,
  Users,
  BarChart3,
  Mail
} from 'lucide-react';

interface TroubleshootingItem {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  solution: string[];
  relatedArticles: string[];
}

const troubleshootingItems: TroubleshootingItem[] = [
  {
    id: '1',
    title: 'Campaign not tracking properly',
    description: 'Analytics data is missing or incomplete for your campaign',
    severity: 'high',
    category: 'Analytics',
    solution: [
      'Verify tracking codes are properly installed',
      'Check if ad blockers are interfering with tracking',
      'Ensure UTM parameters are correctly formatted',
      'Review campaign settings for proper attribution windows',
      'Contact support if data is still missing after 24 hours'
    ],
    relatedArticles: ['Analytics Setup Guide', 'UTM Parameter Guide']
  },
  {
    id: '2',
    title: 'Login issues or authentication errors',
    description: 'Unable to access your account or experiencing login problems',
    severity: 'high',
    category: 'Account',
    solution: [
      'Clear your browser cache and cookies',
      'Try logging in from an incognito/private window',
      'Reset your password using the forgot password link',
      'Check if your account has been suspended',
      'Ensure you\'re using the correct email address',
      'Try a different browser or device'
    ],
    relatedArticles: ['Account Security Guide', 'Password Reset Help']
  },
  {
    id: '3',
    title: 'Dashboard loading slowly',
    description: 'Pages take a long time to load or appear unresponsive',
    severity: 'medium',
    category: 'Performance',
    solution: [
      'Check your internet connection speed',
      'Close unnecessary browser tabs',
      'Clear browser cache and refresh the page',
      'Try accessing from a different browser',
      'Disable browser extensions temporarily',
      'Check our status page for any ongoing issues'
    ],
    relatedArticles: ['Performance Optimization', 'System Requirements']
  },
  {
    id: '4',
    title: 'Email integration not working',
    description: 'Emails not sending or receiving from integrated email platforms',
    severity: 'medium',
    category: 'Integrations',
    solution: [
      'Verify API credentials are correct and up to date',
      'Check if email service provider is experiencing issues',
      'Review integration permissions and scopes',
      'Test connection with a simple email send',
      'Check spam/junk folders for test emails',
      'Re-authenticate the integration if needed'
    ],
    relatedArticles: ['Email Integration Guide', 'API Configuration']
  },
  {
    id: '5',
    title: 'Team member permissions not updating',
    description: 'Changes to user roles or permissions are not taking effect',
    severity: 'low',
    category: 'Team Management',
    solution: [
      'Ask team member to log out and log back in',
      'Clear browser cache and refresh the page',
      'Verify permission changes were saved properly',
      'Check if user has multiple accounts',
      'Allow up to 10 minutes for changes to propagate',
      'Contact support if permissions still not working'
    ],
    relatedArticles: ['Team Management Guide', 'User Permissions Overview']
  }
];

const commonIssues = [
  {
    icon: <Zap className="w-5 h-5 text-yellow-600" />,
    title: 'Platform Performance',
    description: 'Slow loading, timeouts, connectivity issues',
    quickFix: 'Clear cache, check connection, try different browser'
  },
  {
    icon: <Database className="w-5 h-5 text-blue-600" />,
    title: 'Data Sync Issues',
    description: 'Missing data, incorrect metrics, sync delays',
    quickFix: 'Refresh page, check integrations, wait for sync cycle'
  },
  {
    icon: <Settings className="w-5 h-5 text-gray-600" />,
    title: 'Configuration Problems',
    description: 'Settings not saving, features not working',
    quickFix: 'Verify permissions, check required fields, save again'
  },
  {
    icon: <Globe className="w-5 h-5 text-green-600" />,
    title: 'Integration Errors',
    description: 'Third-party connections failing',
    quickFix: 'Re-authenticate, check API limits, verify credentials'
  }
];

export function TroubleshootingGuide() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? troubleshootingItems 
    : troubleshootingItems.filter(item => item.category === selectedCategory);

  const categories = ['all', 'Analytics', 'Account', 'Performance', 'Integrations', 'Team Management'];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-professional-gray">Troubleshooting Guide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Quick solutions to common issues and step-by-step troubleshooting guides.
        </p>
      </div>

      {/* Quick Fixes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-pravado-orange" />
            <span>Common Issues & Quick Fixes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {commonIssues.map((issue, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  {issue.icon}
                  <h3 className="font-medium text-sm">{issue.title}</h3>
                </div>
                <p className="text-xs text-gray-600 mb-2">{issue.description}</p>
                <p className="text-xs font-medium text-pravado-purple">{issue.quickFix}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category === 'all' ? 'All Issues' : category}
          </Button>
        ))}
      </div>

      {/* Troubleshooting Items */}
      <Tabs defaultValue="detailed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="detailed">Detailed Solutions</TabsTrigger>
          <TabsTrigger value="quick">Quick Reference</TabsTrigger>
        </TabsList>

        <TabsContent value="detailed">
          <div className="space-y-4">
            {filteredItems.map(item => (
              <Card key={item.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getSeverityIcon(item.severity)}
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{item.category}</Badge>
                      <Badge className={getSeverityColor(item.severity)}>
                        {item.severity}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-professional-gray">Solution Steps:</h4>
                      <ol className="space-y-2">
                        {item.solution.map((step, index) => (
                          <li key={index} className="flex items-start space-x-3 text-sm">
                            <span className="bg-pravado-purple text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    {item.relatedArticles.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-professional-gray">Related Articles:</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.relatedArticles.map((article, index) => (
                            <Button key={index} variant="outline" size="sm" className="text-xs">
                              {article}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quick">
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible>
                {filteredItems.map(item => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center space-x-3">
                        <Badge className={getSeverityColor(item.severity)} variant="outline">
                          {item.severity}
                        </Badge>
                        <span>{item.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="bg-soft-gray p-3 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Quick Fix:</h5>
                          <p className="text-sm">{item.solution[0]}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contact Support */}
      <Card className="bg-soft-gray border-pravado-purple/20">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-pravado-orange mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Still experiencing issues?</h3>
          <p className="text-gray-600 mb-4">
            If these solutions don't resolve your problem, our support team is ready to help.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </Button>
            <Button className="bg-pravado-purple hover:bg-pravado-purple/90">
              Live Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
