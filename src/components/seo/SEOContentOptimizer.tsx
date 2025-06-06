
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  Brain,
  Link,
  Search,
  BarChart3,
  Eye,
  Zap
} from 'lucide-react';
import { useContentOptimization } from '@/hooks/useSEOData';

interface SEOContentOptimizerProps {
  projectId: string | null;
  automateProgress: number;
}

export function SEOContentOptimizer({ projectId, automateProgress }: SEOContentOptimizerProps) {
  const [selectedContent, setSelectedContent] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [contentText, setContentText] = useState('');
  
  const { data: optimizations = [] } = useContentOptimization();

  // Mock SEO analysis data
  const mockAnalysis = {
    overall_score: 78,
    title_score: 85,
    meta_description_score: 72,
    content_score: 80,
    internal_links_score: 65,
    keyword_density: 2.3,
    word_count: 1450,
    readability_score: 68,
    recommendations: [
      {
        type: 'critical',
        category: 'Title Optimization',
        issue: 'Target keyword not in title',
        suggestion: 'Include your target keyword "digital marketing strategy" in the title',
        automate_step: 'Transform & Evolve'
      },
      {
        type: 'warning',
        category: 'Content Structure',
        issue: 'Missing H2 headings',
        suggestion: 'Add H2 headings to improve content structure and keyword distribution',
        automate_step: 'Transform & Evolve'
      },
      {
        type: 'suggestion',
        category: 'Internal Linking',
        issue: 'Low internal link count',
        suggestion: 'Add 2-3 relevant internal links to related content',
        automate_step: 'Transform & Evolve'
      }
    ]
  };

  const mockContentGaps = [
    {
      keyword: 'digital marketing trends 2024',
      gap_score: 85,
      competitor_coverage: 'High',
      our_coverage: 'None',
      opportunity: 'Create comprehensive guide on 2024 digital marketing trends'
    },
    {
      keyword: 'marketing automation ROI',
      gap_score: 72,
      competitor_coverage: 'Medium',
      our_coverage: 'Partial',
      opportunity: 'Expand existing content with ROI calculation examples'
    }
  ];

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

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Lightbulb className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AUTOMATE Integration Header */}
      <Card className="bg-gradient-to-r from-pravado-purple/10 to-green-500/10 border-l-4 border-l-pravado-purple">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-pravado-purple" />
              <div>
                <h3 className="font-semibold text-professional-gray">Transform & Evolve: Content SEO Optimization</h3>
                <p className="text-sm text-gray-600">Real-time content optimization and SEO enhancement recommendations</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-pravado-purple">{automateProgress}%</div>
              <div className="text-sm text-gray-600">AUTOMATE Progress</div>
            </div>
          </div>
          <Progress value={automateProgress} className="h-2 mt-3" />
        </CardContent>
      </Card>

      <Tabs defaultValue="optimizer" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="optimizer">Content Optimizer</TabsTrigger>
          <TabsTrigger value="analysis">SEO Analysis</TabsTrigger>
          <TabsTrigger value="content-gaps">Content Gaps</TabsTrigger>
          <TabsTrigger value="templates">SEO Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="optimizer" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-enterprise-blue" />
                  <span>Content Optimization</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="target-keyword">Target Keyword</Label>
                  <Input
                    id="target-keyword"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    placeholder="Enter your target keyword..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="content-text">Content to Optimize</Label>
                  <Textarea
                    id="content-text"
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    placeholder="Paste your content here for real-time SEO analysis..."
                    rows={12}
                  />
                </div>
                
                <Button className="w-full">
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Content SEO
                </Button>
              </CardContent>
            </Card>

            {/* Real-time SEO Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-pravado-orange" />
                  <span>SEO Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(mockAnalysis.overall_score)}`}>
                    {mockAnalysis.overall_score}
                  </div>
                  <div className="text-sm text-gray-600">Overall SEO Score</div>
                  <div className={`text-xs px-2 py-1 rounded mt-2 ${getScoreBgColor(mockAnalysis.overall_score)}`}>
                    {mockAnalysis.overall_score >= 80 ? 'Excellent' : 
                     mockAnalysis.overall_score >= 60 ? 'Good' : 'Needs Improvement'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Title Optimization</span>
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm font-medium ${getScoreColor(mockAnalysis.title_score)}`}>
                        {mockAnalysis.title_score}%
                      </div>
                      <Progress value={mockAnalysis.title_score} className="w-20 h-2" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Meta Description</span>
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm font-medium ${getScoreColor(mockAnalysis.meta_description_score)}`}>
                        {mockAnalysis.meta_description_score}%
                      </div>
                      <Progress value={mockAnalysis.meta_description_score} className="w-20 h-2" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Content Quality</span>
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm font-medium ${getScoreColor(mockAnalysis.content_score)}`}>
                        {mockAnalysis.content_score}%
                      </div>
                      <Progress value={mockAnalysis.content_score} className="w-20 h-2" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Internal Links</span>
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm font-medium ${getScoreColor(mockAnalysis.internal_links_score)}`}>
                        {mockAnalysis.internal_links_score}%
                      </div>
                      <Progress value={mockAnalysis.internal_links_score} className="w-20 h-2" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-pravado-purple">{mockAnalysis.word_count}</div>
                      <div className="text-xs text-gray-600">Words</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-enterprise-blue">{mockAnalysis.keyword_density}%</div>
                      <div className="text-xs text-gray-600">Keyword Density</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-pravado-orange" />
                <span>SEO Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getRecommendationIcon(rec.type)}
                        <h3 className="font-semibold text-professional-gray">{rec.issue}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-pravado-purple/10 text-pravado-purple">
                          {rec.automate_step}
                        </Badge>
                        <Badge className={`${
                          rec.type === 'critical' ? 'bg-red-100 text-red-800' :
                          rec.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {rec.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{rec.suggestion}</p>
                    
                    <div className="flex space-x-2">
                      <Button size="sm">
                        <Zap className="w-4 h-4 mr-2" />
                        Apply Fix
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content-gaps" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-600" />
                <span>Content Gap Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockContentGaps.map((gap, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-professional-gray">{gap.keyword}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm font-medium">Gap Score</div>
                          <div className="text-lg font-bold text-red-600">{gap.gap_score}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Competitor Coverage</div>
                        <div className="font-medium">{gap.competitor_coverage}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Our Coverage</div>
                        <div className="font-medium">{gap.our_coverage}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Priority</div>
                        <Badge className={`${
                          gap.gap_score >= 80 ? 'bg-red-100 text-red-800' :
                          gap.gap_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {gap.gap_score >= 80 ? 'High' : gap.gap_score >= 60 ? 'Medium' : 'Low'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-soft-gray rounded mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">Opportunity:</div>
                      <div className="text-sm text-gray-600">{gap.opportunity}</div>
                    </div>
                    
                    <Button size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Create Content
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-pravado-purple" />
                <span>SEO-Optimized Content Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-center">
                    <FileText className="w-8 h-8 mx-auto mb-3 text-enterprise-blue" />
                    <h3 className="font-semibold mb-2">Blog Post Template</h3>
                    <p className="text-sm text-gray-600 mb-4">SEO-optimized blog post structure with proper heading hierarchy</p>
                    <Button size="sm" className="w-full">Use Template</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-center">
                    <Target className="w-8 h-8 mx-auto mb-3 text-pravado-orange" />
                    <h3 className="font-semibold mb-2">Landing Page Template</h3>
                    <p className="text-sm text-gray-600 mb-4">Conversion-focused landing page with SEO best practices</p>
                    <Button size="sm" className="w-full">Use Template</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-center">
                    <Search className="w-8 h-8 mx-auto mb-3 text-pravado-purple" />
                    <h3 className="font-semibold mb-2">Product Page Template</h3>
                    <p className="text-sm text-gray-600 mb-4">E-commerce product page optimized for search visibility</p>
                    <Button size="sm" className="w-full">Use Template</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
