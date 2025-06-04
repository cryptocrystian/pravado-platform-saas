
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Professional',
      price: 99,
      description: 'Perfect for growing teams',
      features: [
        'Up to 50 team members',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'Security compliance'
      ],
      popular: false
    },
    {
      name: 'Enterprise',
      price: 299,
      description: 'For large organizations',
      features: [
        'Unlimited team members',
        'Advanced analytics & AI',
        'Dedicated success manager',
        'Custom integrations & API',
        'Enterprise security',
        'Custom training',
        'SLA guarantee'
      ],
      popular: true
    },
    {
      name: 'Custom',
      price: null,
      description: 'Tailored for your needs',
      features: [
        'Everything in Enterprise',
        'Custom development',
        'On-premise deployment',
        'White-label solution',
        'Custom compliance',
        'Dedicated infrastructure'
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Flexible pricing options designed to scale with your business needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-white shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center p-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  {plan.price ? (
                    <div>
                      <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-foreground">Custom</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 font-semibold ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90 text-white' 
                      : 'bg-white border-2 border-accent text-accent hover:bg-accent hover:text-white'
                  }`}
                >
                  {plan.price ? 'Start Free Trial' : 'Contact Sales'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All plans include 14-day free trial • No credit card required</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>✓ SOC 2 Compliant</span>
            <span>✓ 99.9% Uptime SLA</span>
            <span>✓ 24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
