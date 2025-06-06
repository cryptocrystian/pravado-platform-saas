
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  Users,
  MousePointer,
  Clock,
  TrendingUp,
  Target,
  Eye,
  ArrowRight,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UserSession {
  id: string;
  userId: string;
  duration: number;
  pageViews: number;
  features: string[];
  timestamp: Date;
  source: string;
  device: string;
}

interface FeatureUsage {
  feature: string;
  users: number;
  sessions: number;
  avgTime: number;
  adoption: number;
}

export function UserBehaviorAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, this would come from analytics service
  const sessionData = [
    { date: '2024-01-01', sessions: 45, users: 32, avgDuration: 12.5 },
    { date: '2024-01-02', sessions: 52, users: 38, avgDuration: 15.2 },
    { date: '2024-01-03', sessions: 48, users: 35, avgDuration: 11.8 },
    { date: '2024-01-04', sessions: 61, users: 42, avgDuration: 16.4 },
    { date: '2024-01-05', sessions: 58, users: 41, avgDuration: 14.7 },
    { date: '2024-01-06', sessions: 55, users: 39, avgDuration: 13.9 },
    { date: '2024-01-07', sessions: 67, users: 48, avgDuration: 18.2 }
  ];

  const featureUsageData: FeatureUsage[] = [
    { feature: 'Dashboard', users: 156, sessions: 432, avgTime: 8.5, adoption: 98 },
    { feature: 'AUTOMATE Hub', users: 124, sessions: 267, avgTime: 12.3, adoption: 78 },
    { feature: 'Campaign Creation', users: 98, sessions: 186, avgTime: 15.7, adoption: 62 },
    { feature: 'Analytics', users: 87, sessions: 203, avgTime: 9.4, adoption: 55 },
    { feature: 'Content Marketing', users: 76, sessions: 145, avgTime: 11.2, adoption: 48 },
    { feature: 'SEO Intelligence', users: 69, sessions: 134, avgTime: 13.8, adoption: 43 },
    { feature: 'Public Relations', users: 54, sessions: 98, avgTime: 10.6, adoption: 34 },
    { feature: 'Help Center', users: 43, sessions: 67, avgTime: 6.2, adoption: 27 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 68, color: '#1e40af' },
    { name: 'Mobile', value: 24, color: '#c3073f' },
    { name: 'Tablet', value: 8, color: '#ff6b35' }
  ];

  const userFlowData = [
    { step: 'Landing', users: 1000, dropoff: 0 },
    { step: 'Sign Up', users: 650, dropoff: 35 },
    { step: 'Onboarding', users: 520, dropoff: 20 },
    { step: 'First Campaign', users: 380, dropoff: 27 },
    { step: 'Active User', users: 290, dropoff: 24 }
  ];

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const exportData = () => {
    console.log('Exporting analytics data...');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-professional-gray">User Behavior Analytics</h1>
          <p className="text-gray-600 mt-2">Track user engagement and feature adoption across your platform</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex space-x-2">
        {['24h', '7d', '30d', '90d'].map(range => (
          <Button
            key={range}
            variant={timeRange === range ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-pravado-purple" />
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-green-600">+12% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <MousePointer className="w-8 h-8 text-pravado-orange" />
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold">3,456</p>
                <p className="text-xs text-green-600">+8% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-enterprise-blue" />
              <div>
                <p className="text-sm text-gray-600">Avg Session Duration</p>
                <p className="text-2xl font-bold">14.2m</p>
                <p className="text-xs text-green-600">+15% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Feature Adoption</p>
                <p className="text-2xl font-bold">68%</p>
                <p className="text-xs text-green-600">+5% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
          <TabsTrigger value="user-flow">User Flow</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Session Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-pravado-purple" />
                  <span>Session Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="#6f2dbd" 
                      fill="#6f2dbd" 
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-pravado-orange" />
                  <span>User Engagement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="avgDuration" 
                      stroke="#ff6b35" 
                      strokeWidth={3}
                      dot={{ fill: '#ff6b35', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureUsageData.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium">{feature.feature}</h4>
                        <Badge variant="outline">{feature.adoption}% adoption</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium text-pravado-purple">{feature.users}</span> users
                        </div>
                        <div>
                          <span className="font-medium text-pravado-orange">{feature.sessions}</span> sessions
                        </div>
                        <div>
                          <span className="font-medium text-enterprise-blue">{feature.avgTime}m</span> avg time
                        </div>
                      </div>
                    </div>
                    <div className="w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-pravado-purple h-2 rounded-full transition-all duration-300"
                          style={{ width: `${feature.adoption}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-flow">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowRight className="w-5 h-5 text-enterprise-blue" />
                <span>User Journey Flow</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userFlowData.map((step, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-24 text-right">
                      <div className="text-lg font-bold text-professional-gray">{step.users}</div>
                      <div className="text-xs text-gray-500">users</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-3 h-3 bg-pravado-purple rounded-full" />
                        <span className="font-medium">{step.step}</span>
                        {step.dropoff > 0 && (
                          <Badge variant="outline" className="text-red-600">
                            -{step.dropoff}% dropoff
                          </Badge>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-pravado-purple h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(step.users / userFlowData[0].users) * 100}%` }}
                        />
                      </div>
                    </div>
                    {index < userFlowData.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  {deviceData.map((device, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: device.color }}
                      />
                      <span className="text-sm">{device.name} ({device.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Browser Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { browser: 'Chrome', users: 68, performance: 95 },
                    { browser: 'Safari', users: 18, performance: 92 },
                    { browser: 'Firefox', users: 8, performance: 88 },
                    { browser: 'Edge', users: 6, performance: 90 }
                  ].map((browser, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{browser.browser}</span>
                        <Badge variant="outline">{browser.users}% users</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${browser.performance}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{browser.performance}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
