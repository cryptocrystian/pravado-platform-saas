
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
    <div className="min-h-screen">
      {/* Hero Section with Blue Gradient Background */}
      <div className="bg-gradient-to-br from-pravado-navy via-enterprise-blue to-pravado-purple text-white min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 py-20 lg:py-28 text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-16 h-16 bg-pravado-crimson rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">P</span>
            </div>
            <div className="text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-white">PRAVADO</h1>
              <p className="text-blue-200 font-semibold text-xl">Marketing Operating System</p>
            </div>
          </div>
          
          <Badge className="bg-pravado-orange text-white px-6 py-3 mb-8 text-xl font-bold shadow-lg">
            Growth from $5M to $50M+
          </Badge>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
            Accelerate Your Marketing Success
          </h2>
          
          <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            The complete platform for marketing executives to automate, optimize, 
            and scale their operations with AI-powered insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg"
              className="bg-white text-enterprise-blue hover:bg-blue-50 font-bold px-10 py-6 text-xl rounded-xl shadow-lg group transition-all duration-200"
              onClick={() => navigate('/auth?mode=signup')}
            >
              Get Started Free
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-enterprise-blue font-bold px-10 py-6 text-xl rounded-xl transition-all duration-200"
              onClick={() => navigate('/auth?mode=signin')}
            >
              Sign In
            </Button>
          </div>

          {/* Success Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {successMetrics.map((metric, index) => (
              <div key={index} className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                <metric.icon className="w-8 h-8 text-pravado-orange mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm text-blue-200 font-medium">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Everything You Need Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-4xl lg:text-5xl font-bold text-professional-gray mb-6">
            Everything You Need to Succeed
          </h3>
          <p className="text-xl text-gray-600 mb-16 max-w-4xl mx-auto font-medium leading-relaxed">
            From content creation to PR campaigns, SEO optimization to analytics - 
            PRAVADO brings all your marketing tools together in one powerful platform.
          </p>

          {/* Three Pillar Integration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-pravado-crimson to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Target className="text-white w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-professional-gray mb-4">Content Marketing</h4>
              <p className="text-gray-600 text-lg mb-6 font-medium">
                AI-powered content creation, optimization, and performance tracking
              </p>
              <ul className="text-sm space-y-2 text-gray-700 text-left">
                <li>• Brand voice AI training</li>
                <li>• Cross-pillar content planning</li>
                <li>• Performance attribution</li>
              </ul>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-pravado-orange to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="text-white w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-professional-gray mb-4">Public Relations</h4>
              <p className="text-gray-600 text-lg mb-6 font-medium">
                Journalist outreach, HARO automation, and media relationship management
              </p>
              <ul className="text-sm space-y-2 text-gray-700 text-left">
                <li>• AI citation monitoring</li>
                <li>• Automated HARO responses</li>
                <li>• Media contact scoring</li>
              </ul>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-enterprise-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <BarChart3 className="text-white w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-professional-gray mb-4">SEO Intelligence</h4>
              <p className="text-gray-600 text-lg mb-6 font-medium">
                Technical audits, keyword optimization, and competitive intelligence
              </p>
              <ul className="text-sm space-y-2 text-gray-700 text-left">
                <li>• Technical SEO automation</li>
                <li>• Content-PR-SEO alignment</li>
                <li>• Competitive gap analysis</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-professional-gray mb-6">
              Why Mid-Market Leaders Choose PRAVADO
            </h3>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              Stop juggling 12+ marketing tools and start scaling systematically. 
              PRAVADO integrates everything into one powerful operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            <div>
              <h4 className="text-3xl font-bold text-professional-gray mb-8">
                Systematic Marketing vs Chaos
              </h4>
              <div className="space-y-4">
                {competitiveAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 font-medium text-lg">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="p-10 bg-gradient-to-br from-pravado-purple/5 to-pravado-orange/5 border-0 shadow-xl">
              <h5 className="text-2xl font-semibold mb-6 text-center text-professional-gray">Before vs After PRAVADO</h5>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h6 className="font-bold text-red-600 mb-4 text-lg">❌ Before</h6>
                  <ul className="space-y-3 text-gray-700">
                    <li>• 12+ disconnected tools</li>
                    <li>• Data in silos</li>
                    <li>• Manual reporting</li>
                    <li>• Reactive decisions</li>
                    <li>• Team inefficiency</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-bold text-green-600 mb-4 text-lg">✅ After</h6>
                  <ul className="space-y-3 text-gray-700">
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
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-professional-gray mb-6">
              Trusted by Mid-Market Leaders
            </h3>
            <div className="flex justify-center space-x-12 opacity-60 mb-12">
              {['TechCorp', 'GrowthCo', 'ScaleTech', 'MarketLeader', 'InnovateInc'].map((company) => (
                <div key={company} className="text-gray-500 font-semibold text-xl">
                  {company}
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 font-medium text-lg leading-relaxed">
                "PRAVADO helped us scale from $8M to $25M by eliminating our tool chaos. 
                The AUTOMATE methodology is brilliant."
              </p>
              <div>
                <div className="font-bold text-professional-gray text-lg">Sarah Chen</div>
                <div className="text-gray-600">VP Marketing, TechCorp</div>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 font-medium text-lg leading-relaxed">
                "ROI was clear within 60 days. We saved $180K annually vs our previous tool stack."
              </p>
              <div>
                <div className="font-bold text-professional-gray text-lg">Marcus Rodriguez</div>
                <div className="text-gray-600">CMO, GrowthCo</div>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 font-medium text-lg leading-relaxed">
                "The three-pillar integration is game-changing. Our team productivity increased 45%."
              </p>
              <div>
                <div className="font-bold text-professional-gray text-lg">Jennifer Park</div>
                <div className="text-gray-600">Director Marketing, ScaleTech</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pravado-purple via-pravado-crimson to-pravado-orange py-20">
        <div className="max-w-5xl mx-auto px-4 text-center text-white">
          <h3 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Scale from $5M to $50M+ Systematically?
          </h3>
          <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Join 500+ mid-market companies that chose systematic marketing over chaos.
            Start your 30-day quick start today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <Button 
              size="lg"
              className="bg-white text-pravado-purple hover:bg-blue-50 px-10 py-6 text-xl font-bold rounded-xl shadow-lg"
              onClick={() => navigate('/auth?mode=signup')}
            >
              Start 30-Day Quick Start
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-pravado-purple px-10 py-6 text-xl font-bold rounded-xl"
              onClick={() => navigate('/demo')}
            >
              Try Interactive Demo
            </Button>
          </div>
          
          <div className="mt-12 flex justify-center space-x-12 text-lg text-white/80 font-medium">
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
