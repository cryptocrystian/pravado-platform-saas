
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target,
  BarChart3,
  DollarSign,
  Award,
  AlertTriangle,
  CheckCircle,
  Download,
  Mail
} from 'lucide-react';

interface ExecutiveAISummariesProps {
  periodData: {
    period: string;
    automateScore: number;
    campaignResults: {
      totalCampaigns: number;
      successRate: number;
      averageROI: number;
    };
    teamMetrics: {
      productivity: number;
      adherence: number;
      collaboration: number;
    };
    businessImpact: {
      revenueImpact: string;
      leadGeneration: number;
      brandAwareness: number;
    };
  };
}

export function ExecutiveAISummaries({ periodData }: ExecutiveAISummariesProps) {
  const [reportType, setReportType] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly');

  const getExecutiveSummary = () => {
    return {
      headline: "AUTOMATE Methodology Drives 34% Performance Improvement",
      keyInsights: [
        "Systematic methodology approach yielding measurable ROI improvements",
        "Cross-pillar integration showing 23% efficiency gains",
        "Team productivity up 18% with structured workflow implementation"
      ],
      criticalMetrics: [
        {
          metric: "Campaign Success Rate",
          value: `${periodData.campaignResults.successRate}%`,
          trend: "+12%",
          impact: "High"
        },
        {
          metric: "Team AUTOMATE Adherence", 
          value: `${periodData.teamMetrics.adherence}%`,
          trend: "+8%",
          impact: "Medium"
        },
        {
          metric: "Cross-Pillar Synergy",
          value: "78%",
          trend: "+15%",
          impact: "High"
        }
      ],
      strategicRecommendations: [
        {
          priority: "High",
          recommendation: "Accelerate Transform & Evolve step completion for innovation breakthrough",
          businessImpact: "Potential 25% additional performance gain",
          timeline: "Next 30 days"
        },
        {
          priority: "Medium", 
          recommendation: "Implement advanced cross-pillar collaboration protocols",
          businessImpact: "15% efficiency improvement",
          timeline: "Next 60 days"
        }
      ],
      riskAssessment: [
        {
          risk: "Methodology adoption plateau",
          probability: "Low",
          mitigation: "Enhanced training and incentive programs"
        }
      ]
    };
  };

  const getROIAnalysis = () => {
    return {
      directROI: "+127%",
      indirectBenefits: [
        "18% reduction in campaign development time",
        "23% improvement in content quality scores", 
        "31% increase in PR placement success rate"
      ],
      competitiveAdvantage: "Organizations using AUTOMATE methodology show 2.3x better performance vs. traditional approaches"
    };
  };

  const executiveSummary = getExecutiveSummary();
  const roiAnalysis = getROIAnalysis();

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <Card className="bg-gradient-to-r from-pravado-navy to-enterprise-blue text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Executive AI Summary</h2>
              <p className="text-blue-100">AUTOMATE Methodology Performance Analysis - {periodData.period}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="secondary" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{periodData.automateScore}%</div>
              <div className="text-blue-200 text-sm">AUTOMATE Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{roiAnalysis.directROI}</div>
              <div className="text-blue-200 text-sm">ROI Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{periodData.campaignResults.successRate}%</div>
              <div className="text-blue-200 text-sm">Campaign Success</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">2.3x</div>
              <div className="text-blue-200 text-sm">vs Competition</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI-Generated Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-pravado-purple" />
            <span>AI-Generated Executive Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-bold text-green-900 mb-2">{executiveSummary.headline}</h3>
            <div className="space-y-2">
              {executiveSummary.keyInsights.map((insight, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {executiveSummary.criticalMetrics.map((metric, index) => (
              <Card key={index} className="border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <Badge className={metric.impact === 'High' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      {metric.impact}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-pravado-purple">{metric.value}</div>
                  <div className="text-sm text-green-600">{metric.trend} vs last period</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-enterprise-blue" />
            <span>C-Suite Strategic Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {executiveSummary.strategicRecommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Badge className={rec.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                    {rec.priority} Priority
                  </Badge>
                  <span className="font-semibold">{rec.recommendation}</span>
                </div>
                <span className="text-sm text-gray-600">{rec.timeline}</span>
              </div>
              <div className="text-sm text-green-600 font-medium">{rec.businessImpact}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Business Impact Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>ROI & Business Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{roiAnalysis.directROI}</div>
              <div className="text-sm text-green-800">Direct ROI from AUTOMATE Implementation</div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Indirect Benefits</h3>
              <div className="space-y-2">
                {roiAnalysis.indirectBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">{roiAnalysis.competitiveAdvantage}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-pravado-orange" />
              <span>Risk Assessment & Mitigation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {executiveSummary.riskAssessment.map((risk, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{risk.risk}</span>
                  <Badge className={risk.probability === 'Low' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {risk.probability} Risk
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">{risk.mitigation}</div>
              </div>
            ))}

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Overall Risk Level: LOW</h3>
              <p className="text-sm text-green-800">
                AUTOMATE methodology implementation shows strong adoption and positive outcomes 
                with minimal operational risks identified.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-pravado-purple" />
            <span>Predictive Performance Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-pravado-purple">+34%</div>
              <div className="text-sm text-gray-600">Predicted Q1 Performance</div>
              <Progress value={85} className="mt-2 h-2" />
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-enterprise-blue">+23%</div>
              <div className="text-sm text-gray-600">Team Efficiency Gain</div>
              <Progress value={78} className="mt-2 h-2" />
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-pravado-orange">+18%</div>
              <div className="text-sm text-gray-600">Revenue Attribution</div>
              <Progress value={72} className="mt-2 h-2" />
            </div>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">AI Prediction Confidence: 91%</h3>
            <p className="text-sm text-purple-800">
              Based on current AUTOMATE methodology adherence and performance trends, 
              we predict continued strong performance with accelerating returns on implementation investment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
