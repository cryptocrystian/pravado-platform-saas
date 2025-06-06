
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  ArrowRight, 
  Target, 
  Users, 
  BarChart3, 
  Brain,
  CheckCircle,
  TrendingUp,
  Zap,
  Star,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function Demo() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [demoProgress, setDemoProgress] = useState(0);
  
  const demoSteps: DemoStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to PRAVADO Demo',
      description: 'Experience the power of integrated marketing operations',
      completed: true
    },
    {
      id: 'automate',
      title: 'AUTOMATE Methodology',
      description: 'See how our proven framework scales companies from $5M to $50M+',
      completed: currentStep >= 1
    },
    {
      id: 'integration',
      title: 'Three-Pillar Integration',
      description: 'Witness content, PR, and SEO working in perfect harmony',
      completed: currentStep >= 2
    },
    {
      id: 'campaigns',
      title: 'Campaign Management',
      description: 'Manage cross-pillar campaigns with unified data insights',
      completed: currentStep >= 3
    },
    {
      id: 'ai-insights',
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations that drive results',
      completed: currentStep >= 4
    },
    {
      id: 'results',
      title: 'Performance Dashboard',
      description: 'Track ROI and team productivity improvements',
      completed: currentStep >= 5
    }
  ];

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setDemoProgress(((currentStep + 1) / (demoSteps.length - 1)) * 100);
    }
  };

  const sampleMetrics = [
    { label: 'Content Performance', value: '+156%', change: 'up' },
    { label: 'PR Mentions', value: '+89%', change: 'up' },
    { label: 'SEO Rankings', value: '+234%', change: 'up' },
    { label: 'Team Efficiency', value: '+45%', change: 'up' }
  ];

  return (
    <div className="min-h-screen bg-soft-gray">
      {/* Header */}
      <div className="bg-white border-b border-border-gray">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-pravado-crimson rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-professional-gray">PRAVADO Demo</h1>
                <p className="text-gray-500">Interactive Product Experience</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Exit Demo
              </Button>
              <Button 
                className="bg-pravado-purple hover:bg-pravado-purple/90"
                onClick={() => navigate('/auth?mode=signup')}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Demo Progress</h3>
              <Badge className="bg-pravado-orange text-white">
                Step {currentStep + 1} of {demoSteps.length}
              </Badge>
            </div>
            <Progress value={demoProgress} className="h-3 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {demoSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`text-center p-2 rounded ${
                    step.completed ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  <div className="text-xs font-medium">{step.title}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Demo Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="w-5 h-5 text-pravado-purple" />
                  <span>{demoSteps[currentStep].title}</span>
                </CardTitle>
                <p className="text-gray-600">{demoSteps[currentStep].description}</p>
              </CardHeader>
              <CardContent>
                {/* Demo Step Content */}
                {currentStep === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-pravado-purple rounded-full flex items-center justify-center mx-auto mb-6">
                      <Star className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold mb-4">Welcome to the Future of Marketing Operations</h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      You're about to see how PRAVADO transforms marketing chaos into systematic growth. 
                      This 5-minute demo will show you why 500+ mid-market companies choose us.
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-pravado-purple">3.2x</div>
                        <div className="text-xs text-gray-500">Average ROI</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-pravado-orange">40%</div>
                        <div className="text-xs text-gray-500">Efficiency Gain</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-enterprise-blue">$150K+</div>
                        <div className="text-xs text-gray-500">Annual Savings</div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold">The AUTOMATE Methodology</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Assess', 'Unify', 'Target', 'Optimize', 'Measure', 'Adjust', 'Track', 'Expand'].map((step, index) => (
                        <div key={step} className="bg-soft-gray p-4 rounded-lg text-center">
                          <div className="w-8 h-8 bg-pravado-purple text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                            {step[0]}
                          </div>
                          <div className="text-sm font-medium">{step}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gradient-to-r from-pravado-purple/10 to-pravado-orange/10 p-6 rounded-lg">
                      <h5 className="font-semibold mb-2">Proven Results:</h5>
                      <p className="text-sm text-gray-600">
                        Companies using AUTOMATE see 40% faster growth, 60% better team efficiency, 
                        and 3.2x ROI within 90 days. It's the systematic approach that scales.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold">Three-Pillar Integration Demo</h4>
                    <Tabs defaultValue="content" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="pr">PR</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="content" className="bg-soft-gray p-6 rounded-lg">
                        <div className="flex items-center space-x-3 mb-4">
                          <Target className="w-8 h-8 text-pravado-crimson" />
                          <div>
                            <h5 className="font-semibold">Content Marketing</h5>
                            <p className="text-sm text-gray-600">AI-powered content creation and optimization</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>✓ Brand voice AI training</div>
                          <div>✓ Cross-pillar content planning</div>
                          <div>✓ Performance attribution</div>
                          <div>✓ SEO-optimized content</div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="pr" className="bg-soft-gray p-6 rounded-lg">
                        <div className="flex items-center space-x-3 mb-4">
                          <Users className="w-8 h-8 text-pravado-orange" />
                          <div>
                            <h5 className="font-semibold">Public Relations</h5>
                            <p className="text-sm text-gray-600">Automated outreach and relationship management</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>✓ AI citation monitoring</div>
                          <div>✓ Automated HARO responses</div>
                          <div>✓ Media contact scoring</div>
                          <div>✓ Content syndication</div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="seo" className="bg-soft-gray p-6 rounded-lg">
                        <div className="flex items-center space-x-3 mb-4">
                          <BarChart3 className="w-8 h-8 text-enterprise-blue" />
                          <div>
                            <h5 className="font-semibold">SEO Intelligence</h5>
                            <p className="text-sm text-gray-600">Technical optimization and competitive analysis</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>✓ Technical SEO automation</div>
                          <div>✓ Content-PR-SEO alignment</div>
                          <div>✓ Competitive gap analysis</div>
                          <div>✓ Performance tracking</div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold">Campaign Management Demo</h4>
                    <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-semibold">Sample Campaign: "Product Launch Q4"</h5>
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-pravado-crimson">12</div>
                            <div className="text-xs text-gray-600">Content Pieces</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-pravado-orange">8</div>
                            <div className="text-xs text-gray-600">PR Placements</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-enterprise-blue">156</div>
                            <div className="text-xs text-gray-600">Keywords Targeted</div>
                          </div>
                        </div>
                        <Progress value={75} className="h-2 mb-2" />
                        <div className="text-sm text-gray-600">Campaign Progress: 75% complete</div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold">AI-Powered Insights</h4>
                    <div className="space-y-4">
                      <Card className="bg-gradient-to-r from-pravado-purple/10 to-pravado-orange/10">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Brain className="w-8 h-8 text-pravado-purple" />
                            <div>
                              <h5 className="font-semibold">Smart Recommendation</h5>
                              <p className="text-sm text-gray-600">
                                AI suggests: "Repurpose your top-performing blog post into a press release. 
                                Based on current trends, this could generate 40% more backlinks."
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <TrendingUp className="w-8 h-8 text-enterprise-blue" />
                            <div>
                              <h5 className="font-semibold">Performance Alert</h5>
                              <p className="text-sm text-gray-600">
                                Your content marketing ROI increased 23% this month. 
                                The AI recommends scaling your "Industry Insights" series.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold">Performance Dashboard</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {sampleMetrics.map((metric, index) => (
                        <Card key={index} className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">{metric.value}</div>
                          <div className="text-sm text-gray-600">{metric.label}</div>
                          <div className="flex items-center justify-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg text-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h5 className="text-xl font-semibold mb-2">Demo Complete!</h5>
                      <p className="text-gray-600 mb-6">
                        You've seen how PRAVADO transforms marketing operations. 
                        Ready to experience this transformation for your company?
                      </p>
                      <div className="flex justify-center space-x-4">
                        <Button 
                          className="bg-pravado-purple hover:bg-pravado-purple/90"
                          onClick={() => navigate('/auth?mode=signup')}
                        >
                          Start 30-Day Quick Start
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => navigate('/roi-calculator')}
                        >
                          Calculate My ROI
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline" 
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  >
                    Previous
                  </Button>
                  <Button 
                    className="bg-pravado-purple hover:bg-pravado-purple/90"
                    disabled={currentStep === demoSteps.length - 1}
                    onClick={nextStep}
                  >
                    Next Step <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why PRAVADO?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Integrated vs scattered tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">AI-powered recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Proven AUTOMATE methodology</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Mid-market pricing</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ready to Start?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  See these results in your own marketing operations. 
                  Start your 30-day quick start today.
                </p>
                <Button 
                  className="w-full bg-pravado-purple hover:bg-pravado-purple/90 mb-3"
                  onClick={() => navigate('/auth?mode=signup')}
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/roi-calculator')}
                >
                  Calculate ROI First
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Questions?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Talk to our team about your specific needs and see a personalized demo.
                </p>
                <Button variant="outline" className="w-full">
                  Schedule Demo Call
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
