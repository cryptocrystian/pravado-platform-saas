
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, DollarSign, Clock, TrendingUp, Zap, AlertTriangle } from 'lucide-react';
import { useAIUsageAnalytics } from '@/hooks/useAIContent';

export function AIUsageDashboard() {
  const { data: analytics } = useAIUsageAnalytics();

  if (!analytics) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[#1e293b]">AI Usage Analytics</h2>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Brain className="h-12 w-12 text-[#64748b] mx-auto mb-4" />
              <p className="text-[#475569]">Loading usage analytics...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const usagePercentage = (analytics.monthly_usage / analytics.monthly_limit) * 100;
  const isNearLimit = usagePercentage > 80;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b]">AI Usage Analytics</h2>
          <p className="text-[#475569]">
            Monitor your AI usage, costs, and performance metrics
          </p>
        </div>
        {isNearLimit && (
          <Button variant="outline" className="text-orange-600 border-orange-200">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1e293b]">{analytics.monthly_usage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              of {analytics.monthly_limit.toLocaleString()} requests
            </p>
            <Progress value={usagePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1e293b]">${analytics.cost_this_month}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Generation Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1e293b]">{(analytics.avg_generation_time / 1000).toFixed(1)}s</div>
            <p className="text-xs text-muted-foreground">
              -0.3s from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1e293b]">{(analytics.content_success_rate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Favorite AI Provider</CardTitle>
                <CardDescription>Most used provider this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-pravado-purple/10 rounded-lg">
                    <Brain className="h-6 w-6 text-pravado-purple" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#1e293b]">{analytics.favorite_provider}</div>
                    <p className="text-sm text-[#475569]">
                      Used in 65% of content generation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Breakdown</CardTitle>
                <CardDescription>By content type this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Blog Posts</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={45} className="w-20" />
                    <span className="text-sm text-[#475569]">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Social Media</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={35} className="w-20" />
                    <span className="text-sm text-[#475569]">35%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Content</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={20} className="w-20" />
                    <span className="text-sm text-[#475569]">20%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Claude 4</span>
                  <Badge className="bg-pravado-purple">Primary</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usage</span>
                  <span>65%</span>
                </div>
                <Progress value={65} />
                <div className="flex justify-between text-sm">
                  <span>Avg Response</span>
                  <span>2.1s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span>94%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>OpenAI GPT-4o</span>
                  <Badge variant="secondary">Secondary</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usage</span>
                  <span>30%</span>
                </div>
                <Progress value={30} />
                <div className="flex justify-between text-sm">
                  <span>Avg Response</span>
                  <span>1.8s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span>91%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Gemini Pro</span>
                  <Badge variant="outline">Backup</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usage</span>
                  <span>5%</span>
                </div>
                <Progress value={5} />
                <div className="flex justify-between text-sm">
                  <span>Avg Response</span>
                  <span>3.2s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span>88%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Track how your AI-generated content performs across different metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-[#64748b]">
                Performance analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of AI usage costs and optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-[#64748b]">
                Cost analysis dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
