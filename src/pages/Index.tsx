
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Target, 
  Zap, 
  CheckCircle,
  Star,
  PlayCircle,
  Calculator,
  BarChart3
} from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-professional-gray font-medium">Loading PRAVADO...</p>
        </div>
      </div>
    );
  }

  const successMetrics = [
    { value: "3.2x", label: "Average ROI within 90 days", icon: TrendingUp },
    { value: "40%", label: "Faster time to market", icon: Zap },
    { value: "$150K+", label: "Annual savings vs separate tools", icon: BarChart3 },
    { value: "500+", label: "Mid-market companies trust us", icon: Users }
  ];

  const competitiveAdvantages = [
    "AUTOMATE methodology proven to scale from $5M to $50M+",
    "Integrated platform eliminates tool chaos and data silos", 
    "AI-powered insights across all marketing pillars",
    "Mid-market pricing with enterprise capabilities",
    "30-day implementation vs 6-month traditional rollouts",
    "Dedicated success team for systematic growth"
  ];

  return (
    <div className="min-h-screen bg-soft-gray">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pravado-navy to-enterprise-blue text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-pravado-crimson rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white">PRAVADO</h1>
                <p className="text-blue-100 font-semibold text-lg">Marketing Operating System</p>
              </div>
            </div>
            
            <Badge className="bg-pravado-orange text-white px-4 py-2 mb-6 text-lg font-semibold">
              Growth from $5M to $50M+
            </Badge>
            
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight text-white">
              Stop Marketing Chaos.<br />
              <span className="text-pravado-orange">Start Systematic Growth.</span>
            </h2>
            
            <p className="text-xl text-blue-50 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              The only marketing operating system that integrates content, PR, and SEO into one 
              powerful platform. Scale systematically with the AUTOMATE methodology trusted by 
              500+ mid-market leaders.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg"
                className="bg-white text-enterprise-blue hover:bg-gray-100 font-semibold px-8 py-4 text-lg group"
                onClick={() => navigate('/auth?mode=signup')}
              >
                Start 30-Day Quick Start
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-enterprise-blue font-semibold px-8 py-4 text-lg transition-all duration-200 group"
                onClick={() => navigate('/demo')}
              >
                <PlayCircle className="mr-2 w-5 h-5" />
                Try Interactive Demo
              </Button>
              
              <Button 
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
                onClick={() => navigate('/roi-calculator')}
              >
                <Calculator className="mr-2 w-5 h-5" />
                Calculate ROI
              </Button>
            </div>

            {/* Success Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {successMetrics.map((metric, index) => (
                <div key={index} className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <metric.icon className="w-6 h-6 text-pravado-orange mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className="text-sm text-blue-100 font-medium">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-professional-gray mb-4">
            Why Mid-Market Leaders Choose PRAVADO
          </h3>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto font-medium">
            Stop juggling 12+ marketing tools and start scaling systematically. 
            PRAVADO integrates everything into one powerful operating system.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h4 className="text-2xl font-bold text-professional-gray mb-6">
              Systematic Marketing vs Chaos
            </h4>
            <div className="space-y-4">
              {competitiveAdvantages.map((advantage, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{advantage}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Card className="p-8 bg-gradient-to-br from-pravado-purple/5 to-pravado-orange/5">
            <h5 className="text-xl font-semibold mb-4 text-center text-professional-gray">Before vs After PRAVADO</h5>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h6 className="font-semibold text-red-600 mb-3">❌ Before</h6>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>• 12+ disconnected tools</li>
                  <li>• Data in silos</li>
                  <li>• Manual reporting</li>
                  <li>• Reactive decisions</li>
                  <li>• Team inefficiency</li>
                </ul>
              </div>
              <div>
                <h6 className="font-semibold text-green-600 mb-3">✅ After</h6>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>• One integrated platform</li>
                  <li>• Unified data insights</li>
                  <li>• Automated reporting</li>
                  <li>• AI-powered decisions</li>
                  <li>• 40% efficiency gain</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Three Pillar Integration */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-professional-gray mb-4">
            Three-Pillar Integration That Actually Works
          </h3>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto font-medium">
            Unlike scattered point solutions, PRAVADO unifies content, PR, and SEO 
            with shared data and coordinated campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow group">
            <div className="w-16 h-16 bg-pravado-crimson rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Target className="text-white w-8 h-8" />
            </div>
            <h4 className="font-semibold text-professional-gray mb-3">Content Marketing</h4>
            <p className="text-gray-700 text-sm mb-4 font-medium">
              AI-powered content creation, optimization, and performance tracking
            </p>
            <ul className="text-xs space-y-1 text-gray-600">
              <li>• Brand voice AI training</li>
              <li>• Cross-pillar content planning</li>
              <li>• Performance attribution</li>
            </ul>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow group">
            <div className="w-16 h-16 bg-pravado-orange rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users className="text-white w-8 h-8" />
            </div>
            <h4 className="font-semibold text-professional-gray mb-3">Public Relations</h4>
            <p className="text-gray-700 text-sm mb-4 font-medium">
              Journalist outreach, HARO automation, and media relationship management
            </p>
            <ul className="text-xs space-y-1 text-gray-600">
              <li>• AI citation monitoring</li>
              <li>• Automated HARO responses</li>
              <li>• Media contact scoring</li>
            </ul>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow group">
            <div className="w-16 h-16 bg-enterprise-blue rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="text-white w-8 h-8" />
            </div>
            <h4 className="font-semibold text-professional-gray mb-3">SEO Intelligence</h4>
            <p className="text-gray-700 text-sm mb-4 font-medium">
              Technical audits, keyword optimization, and competitive intelligence
            </p>
            <ul className="text-xs space-y-1 text-gray-600">
              <li>• Technical SEO automation</li>
              <li>• Content-PR-SEO alignment</li>
              <li>• Competitive gap analysis</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-white border-t border-border-gray">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-professional-gray mb-4">
              Trusted by Mid-Market Leaders
            </h3>
            <div className="flex justify-center space-x-8 opacity-60 mb-8">
              {['TechCorp', 'GrowthCo', 'ScaleTech', 'MarketLeader', 'InnovateInc'].map((company) => (
                <div key={company} className="text-gray-500 font-semibold text-lg">
                  {company}
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 font-medium">
                "PRAVADO helped us scale from $8M to $25M by eliminating our tool chaos. 
                The AUTOMATE methodology is brilliant."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-professional-gray">Sarah Chen</div>
                <div className="text-gray-600">VP Marketing, TechCorp</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 font-medium">
                "ROI was clear within 60 days. We saved $180K annually vs our previous tool stack."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-professional-gray">Marcus Rodriguez</div>
                <div className="text-gray-600">CMO, GrowthCo</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 font-medium">
                "The three-pillar integration is game-changing. Our team productivity increased 45%."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-professional-gray">Jennifer Park</div>
                <div className="text-gray-600">Director Marketing, ScaleTech</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pravado-purple to-pravado-crimson">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Scale from $5M to $50M+ Systematically?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-medium">
            Join 500+ mid-market companies that chose systematic marketing over chaos.
            Start your 30-day quick start today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-6">
            <Button 
              size="lg"
              className="bg-white text-pravado-purple hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={() => navigate('/auth?mode=signup')}
            >
              Start 30-Day Quick Start
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-pravado-purple px-8 py-4 text-lg font-semibold"
              onClick={() => navigate('/demo')}
            >
              Try Interactive Demo
            </Button>
          </div>
          
          <div className="mt-8 flex justify-center space-x-8 text-sm text-blue-100 font-medium">
            <span>✓ 30-Day Money-Back Guarantee</span>
            <span>✓ No Setup Fees</span>
            <span>✓ Cancel Anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
