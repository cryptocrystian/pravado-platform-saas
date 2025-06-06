
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Target, 
  Users, 
  TrendingUp,
  Lightbulb,
  Building,
  Globe,
  CheckCircle,
  Clock
} from 'lucide-react';

interface SmartAutomateGuidanceProps {
  companySize: 'startup' | 'small' | 'medium' | 'enterprise';
  industry: string;
  currentStep: string;
  completionRate: number;
}

export function SmartAutomateGuidance({ 
  companySize, 
  industry, 
  currentStep, 
  completionRate 
}: SmartAutomateGuidanceProps) {
  const [activeTab, setActiveTab] = useState('guidance');

  const getPersonalizedGuidance = () => {
    const baseGuidance = {
      startup: {
        priority: "Focus on foundational steps first",
        resources: "Lean methodology implementation",
        timeline: "6-8 weeks for full implementation"
      },
      small: {
        priority: "Balance speed with thoroughness",
        resources: "Moderate resource allocation",
        timeline: "8-10 weeks for full implementation"
      },
      medium: {
        priority: "Comprehensive cross-team implementation",
        resources: "Dedicated methodology team",
        timeline: "10-12 weeks for full implementation"
      },
      enterprise: {
        priority: "Systematic rollout across departments",
        resources: "Full methodology center of excellence",
        timeline: "12-16 weeks for full implementation"
      }
    };

    return baseGuidance[companySize];
  };

  const getIndustrySpecificTips = () => {
    const industryTips: Record<string, string[]> = {
      technology: [
        "Emphasize technical content in Assess & Audit",
        "Focus on developer community engagement in PR",
        "Prioritize technical SEO optimization"
      ],
      healthcare: [
        "Ensure regulatory compliance in all content",
        "Focus on trust-building in PR activities",
        "Optimize for health-related search terms"
      ],
      finance: [
        "Emphasize data security and compliance",
        "Build thought leadership through PR",
        "Focus on local SEO for branch locations"
      ],
      default: [
        "Follow standard AUTOMATE progression",
        "Adapt methodology to your specific market",
        "Focus on customer-centric content strategy"
      ]
    };

    return industryTips[industry.toLowerCase()] || industryTips.default;
  };

  const getNextStepRecommendations = () => {
    const stepRecommendations: Record<string, any> = {
      "Assess & Audit": {
        focus: "Data Collection & Analysis",
        activities: [
          "Complete competitive analysis across all channels",
          "Audit current content performance",
          "Analyze existing PR and SEO efforts"
        ],
        success_metrics: ["Audit completion score", "Competitive gap identification", "Baseline metrics established"]
      },
      "Target & Strategy": {
        focus: "Strategic Planning & Goal Setting",
        activities: [
          "Define unified content strategy",
          "Establish PR campaign framework", 
          "Create SEO keyword strategy"
        ],
        success_metrics: ["Strategy alignment score", "Goal clarity index", "Resource allocation plan"]
      },
      "Optimize Systems": {
        focus: "Process & Technology Enhancement",
        activities: [
          "Implement content workflow automation",
          "Set up PR monitoring systems",
          "Deploy SEO optimization tools"
        ],
        success_metrics: ["Process efficiency gain", "Tool adoption rate", "Workflow completion time"]
      }
    };

    return stepRecommendations[currentStep] || stepRecommendations["Assess & Audit"];
  };

  const guidance = getPersonalizedGuidance();
  const industryTips = getIndustrySpecificTips();
  const nextSteps = getNextStepRecommendations();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-pravado-purple/10 to-enterprise-blue/10 border-l-4 border-l-pravado-purple">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-pravado-purple" />
            <span>Smart AUTOMATE Guidance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-enterprise-blue" />
              <span className="text-sm">Company Size: <strong className="capitalize">{companySize}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-pravado-orange" />
              <span className="text-sm">Industry: <strong>{industry}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm">Current Focus: <strong>{currentStep}</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="guidance">Personalized Plan</TabsTrigger>
          <TabsTrigger value="industry">Industry Tips</TabsTrigger>
          <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="guidance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-pravado-purple" />
                <span>Personalized Implementation Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Priority Focus</h3>
                  <p className="text-sm text-blue-800">{guidance.priority}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Resource Strategy</h3>
                  <p className="text-sm text-green-800">{guidance.resources}</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Timeline</h3>
                  <p className="text-sm text-purple-800">{guidance.timeline}</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Implementation Roadmap for {companySize} Companies</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Week 1-2: Complete Assess & Audit foundation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm">Week 3-4: Establish Target & Strategy framework</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">Week 5-6: Implement Optimize Systems processes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="industry" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-pravado-orange" />
                <span>Industry-Specific Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {industryTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Lightbulb className="w-5 h-5 text-pravado-orange mt-0.5" />
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="next-steps" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-enterprise-blue" />
                <span>Current Step: {nextSteps.focus}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Priority Activities</h3>
                <div className="space-y-2">
                  {nextSteps.activities.map((activity: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pravado-purple rounded-full"></div>
                      <span className="text-sm">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Success Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {nextSteps.success_metrics.map((metric: string, index: number) => (
                    <div key={index} className="p-3 bg-soft-gray rounded-lg text-center">
                      <div className="text-sm font-medium">{metric}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Workflow Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">AI Recommendation</h3>
                <p className="text-sm text-green-800">
                  Based on your {companySize} company profile and {industry} industry focus, 
                  prioritizing cross-pillar integration will yield 23% faster methodology completion.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Quick Wins</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Automate content approval workflows</li>
                    <li>• Set up PR monitoring alerts</li>
                    <li>• Implement SEO tracking dashboard</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Long-term Optimizations</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Cross-pillar collaboration sessions</li>
                    <li>• Unified performance attribution</li>
                    <li>• AI-powered content optimization</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
