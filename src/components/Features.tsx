
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Shield, Zap, Users, Globe, TrendingUp } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time insights and comprehensive reporting to drive data-driven decisions across your organization.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, SOC 2 compliance, and advanced threat protection to keep your data secure.'
    },
    {
      icon: Zap,
      title: 'Automation Engine',
      description: 'Streamline workflows and eliminate manual tasks with our intelligent automation platform.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Enhanced productivity tools that bring teams together and improve cross-functional communication.'
    },
    {
      icon: Globe,
      title: 'Global Scalability',
      description: 'Built to scale with your business across multiple regions and time zones seamlessly.'
    },
    {
      icon: TrendingUp,
      title: 'Growth Optimization',
      description: 'AI-powered recommendations and insights to accelerate your business growth and performance.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Features for Modern Enterprises
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to operate, scale, and succeed in today's competitive landscape.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up group">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-secondary group-hover:text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
