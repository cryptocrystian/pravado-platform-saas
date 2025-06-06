
import React from 'react';
import { ROICalculator } from '@/components/ROICalculator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, DollarSign, Clock, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ROICalculatorPage() {
  const navigate = useNavigate();

  const valueProps = [
    {
      icon: DollarSign,
      title: "Tool Consolidation Savings",
      description: "Replace 8-12 separate marketing tools with one integrated platform",
      savings: "Save $2,000-$8,000/month"
    },
    {
      icon: Clock,
      title: "Team Efficiency Gains",
      description: "40% average productivity improvement through automation",
      savings: "Save 15-20 hours/week/person"
    },
    {
      icon: TrendingUp,
      title: "Revenue Impact",
      description: "15% average marketing ROI improvement through better coordination",
      savings: "Additional $50K-$500K/year"
    },
    {
      icon: Target,
      title: "Implementation Speed",
      description: "30-day quick start vs 6-month traditional implementations",
      savings: "Faster time to value"
    }
  ];

  return (
    <div className="min-h-screen bg-soft-gray">
      {/* Header */}
      <div className="bg-white border-b border-border-gray">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-professional-gray">ROI Calculator</h1>
                <p className="text-gray-500">Calculate your PRAVADO investment return</p>
              </div>
            </div>
            <Button 
              className="bg-pravado-purple hover:bg-pravado-purple/90"
              onClick={() => navigate('/auth?mode=signup')}
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>

      {/* Value Props Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-professional-gray mb-4">
            Calculate Your Marketing Operations ROI
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See exactly how much PRAVADO can save your company and accelerate your growth.
            Most mid-market companies see 3.2x ROI within 90 days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {valueProps.map((prop, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-pravado-purple/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <prop.icon className="w-6 h-6 text-pravado-purple" />
                </div>
                <CardTitle className="text-lg">{prop.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3">{prop.description}</p>
                <div className="font-semibold text-pravado-orange">{prop.savings}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ROI Calculator Component */}
        <ROICalculator />

        {/* Additional Value Section */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-pravado-purple/5 to-pravado-orange/5">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-professional-gray mb-4">
                  Beyond the Numbers: Strategic Value
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  While ROI is important, PRAVADO delivers strategic advantages that compound over time
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-pravado-crimson rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Strategic Alignment</h4>
                  <p className="text-sm text-gray-600">
                    Content, PR, and SEO work together instead of competing for resources
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-pravado-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Scalable Growth</h4>
                  <p className="text-sm text-gray-600">
                    AUTOMATE methodology proven to scale companies from $5M to $50M+
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-enterprise-blue rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Future-Ready</h4>
                  <p className="text-sm text-gray-600">
                    AI-powered platform that evolves with your business and market changes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-pravado-purple to-pravado-crimson text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to See These Results?</h3>
              <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
                Start your 30-day quick start and experience the PRAVADO difference. 
                Most companies see positive ROI within 60 days.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg"
                  className="bg-white text-pravado-purple hover:bg-gray-100 px-8 py-3"
                  onClick={() => navigate('/auth?mode=signup')}
                >
                  Start 30-Day Quick Start
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-pravado-purple px-8 py-3"
                  onClick={() => navigate('/demo')}
                >
                  See Interactive Demo
                </Button>
              </div>
              
              <div className="mt-6 flex justify-center space-x-8 text-sm text-blue-100">
                <span>✓ 30-Day Money-Back Guarantee</span>
                <span>✓ No Setup Fees</span>
                <span>✓ Cancel Anytime</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
