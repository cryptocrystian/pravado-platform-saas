
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit, 
  CheckCircle, 
  AlertTriangle, 
  Target,
  Search,
  FileText,
  Link,
  Lightbulb,
  Brain,
  Zap
} from 'lucide-react';
import { useContentOptimization } from '@/hooks/useSEOData';

interface SEOContentOptimizerProps {
  projectId?: string | null;
  automateProgress: number;
}

export function SEOContentOptimizer({ projectId, automateProgress }: SEOContentOptimizerProps) {
  const [contentText, setContentText] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { data: optimizations = [] } = useContentOptimization();

  const mockSEOAnalysis = {
    overall_score: 78,
    keyword_density: 2.3,
    readability_score: 85,
    title_optimization: 90,
    meta_description: 65,
    headings_structure: 82,
    internal_links: 45,
    image_optimization: 70,
    recommendations: [
      { type: 'error', title: 'Meta description too short', description: 'Increase to 150-160 characters', priority: 'high' },
      { type: 'warning', title: 'Add more internal links', description: 'Include 3-5 relevant internal links', priority: 'medium' },
      { type: 'success', title: 'Good keyword usage', description: 'Target keyword density is optimal', priority: 'low' },
      { type: 'warning', title: 'Missing alt text on images', description: 'Add descriptive alt text to 3 images', priority: 'medium' }
    ]
  };

  const mockContentSuggestions = [
    { section: 'Introduction', suggestion: 'Include target keyword in first 100 words', impact: 'high' },
    { section: 'Headers', suggestion: 'Use H2 tags with semantic variations', impact: 'medium' },
    { section: 'Content Length', suggestion: 'Expand to 1,200+ words for better ranking', impact: 'high' },
    { section: 'Related Topics', suggestion: 'Add sections on "automation benefits" and "implementation"', impact: 'medium' }
  ];

  const analyzeContent = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
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

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <Target className="w-4 h-4 text-yellow-600" />;
      default: return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with AUTOMATE Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-professional-gray">SEO Content Optimizer</h2>
          <p className="text-gray-600">Transform & Evolve methodology for content optimization</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-pravado-purple" />
          <span className="text-sm text-pravado-purple font-medium">
            Transform & Evolve: {automateProgress}%
          </span>
        </div>
      </div>

      {/* AUTOMATE Progress */}
      <Card className="bg-gradient-to-r from-pravado-purple/10 to-enterprise-blue/10 border-l-4 border-l-pravado-purple">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-professional-gray">Transform & Evolve Progress</span>
            <span className="text-sm text-pravado-purple font-bold">{automateProgress}%</span>
          </div>
          <Progress value={automateProgress} className="h-2 mb-2" />
          <div className="text-xs text-gray-600">
            Content transformation and evolution within AUTOMATE methodology
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="optimizer" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="optimizer">Content Optimizer</TabsTrigger>
          <TabsTrigger value="analysis">SEO Analysis</TabsTrigger>
          <TabsTrigger value="suggestions">Content Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="optimizer" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="w-5 h-5 text-enterprise-blue" />
                  <span>Content Editor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Target Keyword</label>
                  <Input
                    placeholder="Enter your target keyword..."
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Textarea
                    placeholder="Paste or write your content here..."
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    rows={12}
                    className="resize-none"
                  />
                </div>
                
                <Button 
                  onClick={analyzeContent} 
                  disabled={isAnalyzing || !contentText || !targetKeyword}
                  className="w-full"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'Analyzing Content...' : 'Analyze SEO Score'}
                </Button>
              </CardContent>
            </Card>

            {/* SEO Score Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-pravado-orange" />
                  <span>SEO Score Dashboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Overall Score */}
                <div className={`p-4 rounded-lg ${getScoreBgColor(mockSEOAnalysis.overall_score)} mb-6`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Overall SEO Score</span>
                    <div className={`text-2xl font-bold ${getScoreColor(mockSEOAnalysis.overall_score)}`}>
                      {mockSEOAnalysis.overall_score}
                    </div>
                  </div>
                  <Progress value={mockSEOAnalysis.overall_score} className="h-2" />
                </div>

                {/* Individual Scores */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Title Optimization</span>
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm font-bold ${getScoreColor(mockSEOAnalysis.title_optimization)}`}>
                        {mockSEOAnalysis.title_optimization}%
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Readability</span>
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm font-bold ${getScoreColor(mockSEOAnalysis.readability_score)}`}>
                        {mockSEOAnalysis.readability_score}%
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Keyword Density</span>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-bold text-green-600">
                        {mockSEOAnalysis.keyword_density}%
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Meta Description</span>
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm font-bold ${getScoreColor(mockSEOAnalysis.meta_description)}`}>
                        {mockSEOAnalysis.meta_description}%
                      </div>
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Internal Links</span>
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm font-bold ${getScoreColor(mockSEOAnalysis.internal_links)}`}>
                        {mockSEOAnalysis.internal_links}%
                      </div>
                      <AlertTriangle className="w-4 h-4 text-red-600" />
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
              <CardTitle>SEO Analysis & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSEOAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                    {getRecommendationIcon(rec.type)}
                    <div className="flex-1">
                      <div className="font-medium text-professional-gray">{rec.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{rec.description}</div>
                    </div>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">5</div>
                        <div className="text-xs text-green-700">Optimized Elements</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-600">3</div>
                        <div className="text-xs text-yellow-700">Needs Improvement</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Target className="w-6 h-6 text-red-600" />
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">1</div>
                        <div className="text-xs text-red-700">Critical Issues</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-pravado-orange" />
                  <span>Content Enhancement Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockContentSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-professional-gray">{suggestion.section}</span>
                        <Badge className={getImpactColor(suggestion.impact)}>
                          {suggestion.impact} impact
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">{suggestion.suggestion}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link className="w-5 h-5 text-enterprise-blue" />
                  <span>Internal Linking Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-blue-800">Marketing Automation Guide</div>
                    <div className="text-sm text-blue-600">Anchor: "complete marketing automation"</div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-blue-800">Campaign Management Best Practices</div>
                    <div className="text-sm text-blue-600">Anchor: "campaign optimization"</div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-blue-800">ROI Measurement Tools</div>
                    <div className="text-sm text-blue-600">Anchor: "measure marketing ROI"</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
