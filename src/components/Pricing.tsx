
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check, Calculator, TrendingUp, Users } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: 199,
      description: 'Perfect for growing teams ready to scale',
      targetRevenue: '$5M - $10M Revenue',
      features: [
        'Up to 15 team members',
        'Core AUTOMATE methodology',
        'Essential marketing tools integration',
        'Basic analytics & reporting',
        'Email support',
        '30-day quick start onboarding'
      ],
      popular: false,
      savings: 'Save $3,000+ vs separate tools',
      timeToValue: '30 days to first results'
    },
    {
      name: 'Professional',
      price: 499,
      description: 'Scale from $5M to $25M with confidence',
      targetRevenue: '$10M - $25M Revenue',
      features: [
        'Up to 50 team members',
        'Full AUTOMATE methodology suite',
        'Advanced analytics & AI insights',
        'Custom integrations & workflows',
        'Priority support & success manager',
        'Industry-specific templates',
        'ROI tracking & attribution',
        'Team productivity metrics'
      ],
      popular: true,
      savings: 'Save $8,000+ vs separate tools',
      timeToValue: '21 days to measurable ROI'
    },
    {
      name: 'Growth',
      price: 999,
      description: 'Accelerate growth from $25M to $50M+',
      targetRevenue: '$25M - $50M Revenue',
      features: [
        'Up to 150 team members',
        'Advanced AUTOMATE with AI optimization',
        'Executive dashboard & growth metrics',
        'Custom development & white-label',
        'Dedicated success team',
        'Advanced automation & scaling tools',
        'Multi-location support',
        'Competitive intelligence',
        'Advanced revenue attribution'
      ],
      popular: false,
      savings: 'Save $15,000+ vs enterprise solutions',
      timeToValue: '14 days to scaled operations'
    },
    {
      name: 'Scale',
      price: 1499,
      description: 'Enterprise capabilities for $50M+ growth',
      targetRevenue: '$50M+ Revenue',
      features: [
        'Unlimited team members',
        'Custom AUTOMATE methodology',
        'AI-powered growth optimization',
        'Complete platform customization',
        'White-label & multi-tenant support',
        'Advanced compliance & security',
        'Custom training & workshops',
        'Dedicated infrastructure',
        'Strategic growth consulting'
      ],
      popular: false,
      savings: 'Save $25,000+ vs enterprise suites',
      timeToValue: '7 days to enterprise-level execution'
    }
  ];

  const valueComparisons = [
    {
      scenario: 'vs Buying Separate Tools',
      pravadoCost: '$499/mo',
      alternativeCost: '$2,800/mo',
      savings: '$2,301/mo',
      tools: 'CRM + Marketing Automation + Analytics + Content + SEO + PR tools'
    },
    {
      scenario: 'vs Agency + Tools',
      pravadoCost: '$999/mo',
      alternativeCost: '$8,500/mo',
      savings: '$7,501/mo',
      tools: 'Marketing agency retainer + tool stack + project management'
    },
    {
      scenario: 'vs Enterprise Suite',
      pravadoCost: '$1,499/mo',
      alternativeCost: '$4,200/mo',
      savings: '$2,701/mo',
      tools: 'HubSpot Enterprise + additional specialized tools'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Hero Messaging */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-pravado-purple/10 text-pravado-purple px-4 py-2 rounded-full mb-6">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">Enterprise Capabilities at Mid-Market Pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Scale from $5M to $50M+ with Systematic Marketing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get the marketing operating system that grows with you. Stop juggling point solutions and 
            start scaling with the integrated platform that mid-market leaders trust.
          </p>
          
          {/* ROI Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-2">3.2x ROI</div>
              <div className="text-sm text-green-700">Average return on investment within 90 days</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-2">40% Faster</div>
              <div className="text-sm text-blue-700">Time to market vs traditional approaches</div>
            </div>
            <div className="bg-pravado-orange/10 p-6 rounded-lg border border-pravado-orange/20">
              <div className="text-2xl font-bold text-pravado-orange mb-2">$150K+</div>
              <div className="text-sm text-pravado-orange">Average annual savings vs separate tools</div>
            </div>
          </div>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-white shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in ${
                plan.popular ? 'ring-2 ring-pravado-purple scale-105 border-pravado-purple' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-pravado-purple text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="text-sm text-pravado-purple font-medium mb-2">{plan.targetRevenue}</div>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                
                {/* Value Props */}
                <div className="space-y-2 text-sm">
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                    {plan.savings}
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    {plan.timeToValue}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-4 w-4 text-pravado-purple mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 font-semibold ${
                    plan.popular 
                      ? 'bg-pravado-purple hover:bg-pravado-purple/90 text-white' 
                      : 'bg-white border-2 border-enterprise-blue text-enterprise-blue hover:bg-enterprise-blue hover:text-white'
                  }`}
                >
                  Start 30-Day Quick Start
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Value Comparison Table */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Stop Overpaying for Scattered Solutions</h3>
            <p className="text-gray-600">See how PRAVADO compares to traditional approaches</p>
          </div>
          
          <div className="bg-soft-gray rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {valueComparisons.map((comparison, index) => (
                <Card key={index} className="bg-white">
                  <CardHeader className="pb-4">
                    <h4 className="font-semibold text-foreground">{comparison.scenario}</h4>
                    <p className="text-xs text-gray-500">{comparison.tools}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">PRAVADO:</span>
                      <span className="font-semibold text-pravado-purple">{comparison.pravadoCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Alternative:</span>
                      <span className="font-semibold text-gray-800">{comparison.alternativeCost}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-green-600">You Save:</span>
                        <span className="font-bold text-green-600">{comparison.savings}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-pravado-purple to-pravado-crimson rounded-lg p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Scale Your Marketing Operations?</h3>
            <p className="text-lg text-blue-100 mb-6">
              Join 500+ mid-market companies that chose systematic marketing over scattered tools
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button className="bg-white text-pravado-purple hover:bg-gray-100 px-8 py-3">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Your ROI
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-pravado-purple px-8 py-3">
                <Users className="w-4 h-4 mr-2" />
                View Success Stories
              </Button>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-500">
            <span>✓ 30-Day Money-Back Guarantee</span>
            <span>✓ No Setup Fees</span>
            <span>✓ Cancel Anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
