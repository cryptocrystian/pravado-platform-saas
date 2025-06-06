
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  TrendingUp, 
  Users, 
  Target, 
  ArrowRight,
  Quote,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuccessStory {
  company: string;
  industry: string;
  revenue: string;
  challenge: string;
  solution: string;
  results: {
    roi: string;
    growth: string;
    efficiency: string;
    savings: string;
  };
  testimonial: {
    quote: string;
    author: string;
    title: string;
  };
  timeline: string;
}

export default function SuccessStories() {
  const navigate = useNavigate();

  const successStories: SuccessStory[] = [
    {
      company: "TechScale Solutions",
      industry: "B2B Software",
      revenue: "$15M → $35M",
      challenge: "Scattered marketing tools, inconsistent messaging, no attribution visibility",
      solution: "Implemented PRAVADO's three-pillar integration with AUTOMATE methodology",
      results: {
        roi: "340%",
        growth: "+133%",
        efficiency: "+45%",
        savings: "$180K/year"
      },
      testimonial: {
        quote: "PRAVADO transformed our marketing operations. We went from chaos to systematic growth in 60 days.",
        author: "Sarah Chen",
        title: "VP Marketing"
      },
      timeline: "90 days to full ROI"
    },
    {
      company: "GrowthCorp Manufacturing",
      industry: "Industrial Manufacturing",
      revenue: "$25M → $45M",
      challenge: "Complex sales cycles, poor lead quality, disconnected marketing efforts",
      solution: "AI-powered lead scoring with integrated content-PR-SEO campaigns",
      results: {
        roi: "280%",
        growth: "+80%",
        efficiency: "+60%",
        savings: "$250K/year"
      },
      testimonial: {
        quote: "The AUTOMATE methodology gave us the framework to scale systematically. Game-changing.",
        author: "Marcus Rodriguez",
        title: "CMO"
      },
      timeline: "120 days to measurable impact"
    },
    {
      company: "InnovateHealth Services",
      industry: "Healthcare Technology",
      revenue: "$8M → $22M",
      challenge: "Regulatory compliance concerns, limited marketing resources, need for thought leadership",
      solution: "Compliance-ready content automation with PR relationship management",
      results: {
        roi: "420%",
        growth: "+175%",
        efficiency: "+50%",
        savings: "$120K/year"
      },
      testimonial: {
        quote: "PRAVADO helped us build authority in healthcare while staying compliant. Incredible platform.",
        author: "Dr. Jennifer Park",
        title: "Director of Marketing"
      },
      timeline: "75 days to first major wins"
    }
  ];

  const implementationMilestones = [
    { day: "Day 1-7", title: "Quick Start Setup", description: "Platform configuration and team onboarding" },
    { day: "Day 8-14", title: "AUTOMATE Training", description: "Methodology implementation and workflow setup" },
    { day: "Day 15-30", title: "First Campaign", description: "Launch integrated content-PR-SEO campaign" },
    { day: "Day 31-60", title: "Optimization", description: "AI insights and performance optimization" },
    { day: "Day 61-90", title: "Scale & Expand", description: "Full methodology deployment and scaling" }
  ];

  return (
    <div className="min-h-screen bg-soft-gray">
      {/* Header */}
      <div className="bg-gradient-to-r from-pravado-purple to-pravado-crimson text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Customer Success Stories</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              See how mid-market companies use PRAVADO to scale from $5M to $50M+ 
              with systematic marketing operations
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-blue-100">Companies Scaled</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">3.2x</div>
                <div className="text-sm text-blue-100">Average ROI</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">$50M+</div>
                <div className="text-sm text-blue-100">Total Savings</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">90</div>
                <div className="text-sm text-blue-100">Days to ROI</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Success Stories */}
        <div className="space-y-12">
          {successStories.map((story, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Company Info */}
                  <div className="bg-gradient-to-br from-pravado-purple/5 to-pravado-orange/5 p-8">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-pravado-crimson rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{story.company[0]}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{story.company}</h3>
                        <Badge variant="outline">{story.industry}</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-professional-gray mb-2">Revenue Growth</h4>
                        <div className="text-2xl font-bold text-green-600">{story.revenue}</div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-professional-gray mb-2">Timeline</h4>
                        <div className="text-sm text-gray-600">{story.timeline}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center bg-white rounded-lg p-3">
                          <div className="text-lg font-bold text-pravado-purple">{story.results.roi}</div>
                          <div className="text-xs text-gray-500">ROI</div>
                        </div>
                        <div className="text-center bg-white rounded-lg p-3">
                          <div className="text-lg font-bold text-pravado-orange">{story.results.efficiency}</div>
                          <div className="text-xs text-gray-500">Efficiency</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Challenge & Solution */}
                  <div className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-professional-gray mb-3 flex items-center">
                          <Target className="w-4 h-4 mr-2 text-red-500" />
                          Challenge
                        </h4>
                        <p className="text-gray-600 text-sm">{story.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-professional-gray mb-3 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                          PRAVADO Solution
                        </h4>
                        <p className="text-gray-600 text-sm">{story.solution}</p>
                      </div>
                      
                      <div className="bg-soft-gray p-4 rounded-lg">
                        <h4 className="font-semibold text-professional-gray mb-3">Key Results</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center">
                            <BarChart3 className="w-4 h-4 text-green-500 mr-2" />
                            <span>Growth: {story.results.growth}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-green-500 mr-2" />
                            <span>Savings: {story.results.savings}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="bg-white p-8 border-l-4 border-pravado-purple">
                    <Quote className="w-8 h-8 text-pravado-purple mb-4" />
                    <blockquote className="text-gray-700 mb-6 italic">
                      "{story.testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-professional-gray">{story.testimonial.author}</div>
                      <div className="text-sm text-gray-500">{story.testimonial.title}</div>
                      <div className="text-sm text-gray-500">{story.company}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Implementation Timeline */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-professional-gray mb-4">
              Your Path to Success
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow the proven PRAVADO implementation timeline that has helped 500+ companies scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {implementationMilestones.map((milestone, index) => (
              <Card key={index} className="text-center relative">
                <CardHeader>
                  <div className="w-12 h-12 bg-pravado-purple rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                    {index + 1}
                  </div>
                  <CardTitle className="text-sm">{milestone.day}</CardTitle>
                  <h4 className="font-semibold text-professional-gray">{milestone.title}</h4>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </CardContent>
                
                {index < implementationMilestones.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-3 w-6 h-6">
                    <ArrowRight className="w-6 h-6 text-pravado-purple" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20">
          <Card className="bg-gradient-to-r from-pravado-purple to-pravado-crimson text-white">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join 500+ mid-market companies scaling systematically with PRAVADO. 
                Your 30-day quick start begins today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-6">
                <Button 
                  size="lg"
                  className="bg-white text-pravado-purple hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                  onClick={() => navigate('/auth?mode=signup')}
                >
                  Start Your Success Story
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-pravado-purple px-8 py-4 text-lg font-semibold"
                  onClick={() => navigate('/demo')}
                >
                  See Platform Demo
                </Button>
              </div>
              
              <div className="mt-8 flex justify-center space-x-8 text-sm text-blue-100">
                <span>✓ 30-Day Money-Back Guarantee</span>
                <span>✓ Dedicated Success Team</span>
                <span>✓ Proven Methodology</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
