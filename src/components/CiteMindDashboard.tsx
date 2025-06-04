
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle, Clock, TrendingUp, Users, Radio } from 'lucide-react';

const CiteMindDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 py-8 border-b border-gray-200">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-pravado-purple rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-professional-gray">CiteMind™</h1>
        </div>
        <h2 className="text-xl text-slate-600 font-medium">The Complete AI-Indexing & Podcast Syndication Engine</h2>
        <p className="text-gray-500 max-w-3xl mx-auto">
          Our proprietary engine that powers AI citations and podcast distribution across 34+ platforms
        </p>
      </div>

      {/* Two Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI-Indexing Intelligence Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-professional-gray flex items-center space-x-2">
            <Brain className="h-6 w-6 text-pravado-purple" />
            <span>AI-Indexing Intelligence</span>
          </h3>

          {/* Performance Metrics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-pravado-purple">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Citation Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pravado-purple">87/100</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-pravado-purple">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">AI Platforms Monitored</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pravado-purple">5</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-pravado-purple">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Citations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pravado-purple">23</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-pravado-purple">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Authority Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pravado-purple">94%</div>
              </CardContent>
            </Card>
          </div>

          {/* AI Platform Status */}
          <Card className="border-l-4 border-l-pravado-purple">
            <CardHeader>
              <CardTitle className="text-lg text-professional-gray">AI Platform Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">ChatGPT</span>
                <Badge className="bg-green-100 text-green-800">Active citations detected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Claude</span>
                <Badge className="bg-blue-100 text-blue-800">Authority signals strong</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Perplexity</span>
                <Badge className="bg-orange-100 text-orange-800">Optimization in progress</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Gemini</span>
                <Badge className="bg-green-100 text-green-800">Monitoring active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">GPT-4</span>
                <Badge className="bg-purple-100 text-purple-800">High citation probability</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Podcast Syndication Network Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-professional-gray flex items-center space-x-2">
            <Radio className="h-6 w-6 text-pravado-purple" />
            <span>Podcast Syndication Network</span>
          </h3>

          {/* Syndication Metrics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-pravado-purple">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pravado-purple">34</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-pravado-purple">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Syndications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pravado-purple">18</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-pravado-purple">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pravado-purple">12,847</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-pravado-purple">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pravado-purple">78%</div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Distribution Status */}
          <Card className="border-l-4 border-l-pravado-purple">
            <CardHeader>
              <CardTitle className="text-lg text-professional-gray">Platform Distribution Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Apple Podcasts</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Spotify</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Google Podcasts</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Amazon Music</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4 border-pravado-purple text-pravado-purple hover:bg-pravado-purple hover:text-white"
              >
                View All 34 Platforms
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Unified Analytics Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-professional-gray flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-pravado-purple" />
          <span>Unified Analytics</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart Placeholder */}
          <Card className="border-l-4 border-l-pravado-purple">
            <CardHeader>
              <CardTitle className="text-lg text-professional-gray">Combined Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <TrendingUp className="h-12 w-12 text-pravado-purple mx-auto" />
                  <p className="text-gray-500">AI Citations + Podcast Performance Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="border-l-4 border-l-pravado-purple">
            <CardHeader>
              <CardTitle className="text-lg text-professional-gray">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Brain className="h-5 w-5 text-pravado-purple mt-0.5" />
                <div>
                  <p className="text-sm font-medium">New citation detected in ChatGPT</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Radio className="h-5 w-5 text-pravado-purple mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Podcast syndicated to 5 new platforms</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Brain className="h-5 w-5 text-pravado-purple mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Authority rating increased by 3%</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Radio className="h-5 w-5 text-pravado-purple mt-0.5" />
                <div>
                  <p className="text-sm font-medium">1,247 new podcast downloads</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ROI Metrics */}
        <Card className="border-l-4 border-l-pravado-purple">
          <CardHeader>
            <CardTitle className="text-lg text-professional-gray">Combined ROI Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-pravado-purple">342%</div>
                <p className="text-sm text-gray-600">Citation ROI</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pravado-purple">$47,230</div>
                <p className="text-sm text-gray-600">Podcast Revenue</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pravado-purple">89%</div>
                <p className="text-sm text-gray-600">Combined Efficiency</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pravado-purple">156K</div>
                <p className="text-sm text-gray-600">Total Reach</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CiteMindDashboard;
