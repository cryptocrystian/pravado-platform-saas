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
  BarChart3,
  FileText,
  Megaphone,
  Search,
  Shield,
  Globe,
  Brain
} from 'lucide-react';
import { PravadoLogo } from '@/components/PravadoLogo';

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

  const enterpriseMetrics = [
    { value: "500+", label: "Organizations trust our platform", icon: Users },
    { value: "3.2x", label: "Average ROI within 90 days", icon: TrendingUp },
    { value: "40%", label: "Operational efficiency gains", icon: Zap },
    { value: "Enterprise", label: "Security & compliance ready", icon: Shield }
  ];

  const platformAdvantages = [
    "Systematic marketing methodology proven at scale",
    "Integrated platform eliminates operational silos", 
    "AI-powered insights across all marketing functions",
    "Enterprise security with mid-market accessibility",
    "Rapid deployment with systematic onboarding",
    "Dedicated success management for operational excellence"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Enterprise Focused */}
      <div className="bg-gradient-to-br from-enterprise-blue via-pravado-navy to-pravado-purple text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="text-center">
            <div className="flex items-center justify-center mb-12">
              <PravadoLogo variant="hero" className="justify-center" />
            </div>
            
            <Badge className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3 mb-8 text-lg font-semibold">
              Systematic Marketing Excellence
            </Badge>
            
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
              Enterprise Marketing Operations Platform
            </h2>
            
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              The comprehensive operating system for marketing leaders to systematize, 
              optimize, and scale their operations with enterprise-grade capabilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="lg"
                className="bg-white text-enterprise-blue hover:bg-blue-50 font-semibold px-10 py-6 text-xl rounded-lg group transition-all duration-200"
                onClick={() => navigate('/auth?mode=signup')}
              >
                Start Enterprise Trial
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-enterprise-blue font-semibold px-10 py-6 text-xl rounded-lg transition-all duration-200"
                onClick={() => navigate('/auth?mode=signin')}
              >
                Sign In
              </Button>
            </div>

            {/* Enterprise Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {enterpriseMetrics.map((metric, index) => (
                <div key={index} className="text-center bg-white/10 rounded-lg p-6 backdrop-blur-sm border border-white/20">
                  <metric.icon className="w-6 h-6 text-white mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-blue-200 font-medium">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-professional-gray mb-6">
              Systematic Marketing Operations
            </h3>
            <p className="text-xl text-gray-600 mb-16 max-w-4xl mx-auto font-medium leading-relaxed">
              From content strategy to performance analytics, PRAVADO unifies all your 
              marketing operations in one sophisticated platform designed for operational excellence.
            </p>
          </div>

          {/* Three Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white border-l-4 border-l-pravado-purple p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-pravado-purple/10 rounded-lg flex items-center justify-center mb-6">
                <FileText className="text-pravado-purple w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-professional-gray mb-4">Content Operations</h4>
              <p className="text-gray-600 text-lg mb-6 font-medium">
                Strategic content planning, creation, and performance optimization
              </p>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Strategic content planning workflows</li>
                <li>• Cross-channel performance tracking</li>
                <li>• AI-enhanced content optimization</li>
              </ul>
            </Card>

            <Card className="bg-white border-l-4 border-l-pravado-orange p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-pravado-orange/10 rounded-lg flex items-center justify-center mb-6">
                <Megaphone className="text-pravado-orange w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-professional-gray mb-4">Public Relations</h4>
              <p className="text-gray-600 text-lg mb-6 font-medium">
                Media relationship management and strategic communications
              </p>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Strategic media outreach automation</li>
                <li>• Relationship management systems</li>
                <li>• Performance measurement and ROI</li>
              </ul>
            </Card>

            <Card className="bg-white border-l-4 border-l-enterprise-blue p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-enterprise-blue/10 rounded-lg flex items-center justify-center mb-6">
                <Search className="text-enterprise-blue w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-professional-gray mb-4">SEO Intelligence</h4>
              <p className="text-gray-600 text-lg mb-6 font-medium">
                Technical optimization and competitive intelligence
              </p>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Technical SEO automation</li>
                <li>• Competitive analysis systems</li>
                <li>• Performance attribution modeling</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Enterprise Value Proposition */}
      <div className="bg-soft-gray py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold text-professional-gray mb-8">
                Why Enterprise Leaders Choose PRAVADO
              </h3>
              <p className="text-xl text-gray-700 mb-8 font-medium">
                Transform from disparate marketing tools to systematic operational excellence. 
                PRAVADO provides the framework and technology for marketing leadership.
              </p>
              <div className="space-y-4">
                {platformAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 font-medium text-lg">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-white p-10 border-l-4 border-l-pravado-purple">
              <h4 className="text-2xl font-semibold mb-6 text-professional-gray">AUTOMATE Methodology</h4>
              <p className="text-gray-700 mb-6 font-medium">
                Our systematic approach to marketing operations excellence, 
                proven across hundreds of organizations worldwide.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-pravado-purple" />
                  <span className="font-semibold text-professional-gray">Systematic Implementation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-enterprise-blue" />
                  <span className="font-semibold text-professional-gray">Performance Measurement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-pravado-orange" />
                  <span className="font-semibold text-professional-gray">Operational Excellence</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Enterprise Social Proof */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-professional-gray mb-6">
              Trusted by Marketing Leaders
            </h3>
            <div className="flex justify-center space-x-12 opacity-60 mb-12">
              {['TechCorp', 'GrowthCo', 'ScaleTech', 'MarketLeader', 'InnovateInc'].map((company) => (
                <div key={company} className="text-gray-500 font-semibold text-xl">
                  {company}
                </div>
              ))}
            </div>
          </div>

          {/* Executive Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white p-8 border-l-4 border-l-pravado-purple">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-pravado-orange fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 font-medium text-lg leading-relaxed">
                "PRAVADO transformed our marketing operations from reactive to systematic. 
                The methodology approach is exceptional for enterprise environments."
              </p>
              <div>
                <div className="font-bold text-professional-gray text-lg">Sarah Chen</div>
                <div className="text-gray-600">VP Marketing, TechCorp</div>
              </div>
            </Card>

            <Card className="bg-white p-8 border-l-4 border-l-enterprise-blue">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-pravado-orange fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 font-medium text-lg leading-relaxed">
                "The operational efficiency gains are remarkable. PRAVADO provides the 
                systematic approach we needed for sustainable marketing excellence."
              </p>
              <div>
                <div className="font-bold text-professional-gray text-lg">Marcus Rodriguez</div>
                <div className="text-gray-600">CMO, GrowthCo</div>
              </div>
            </Card>

            <Card className="bg-white p-8 border-l-4 border-l-pravado-orange">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-pravado-orange fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 font-medium text-lg leading-relaxed">
                "Finally, a platform built for marketing leaders who understand the 
                importance of systematic operations and measurable outcomes."
              </p>
              <div>
                <div className="font-bold text-professional-gray text-lg">Jennifer Park</div>
                <div className="text-gray-600">Director Marketing, ScaleTech</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="bg-professional-gray py-20">
        <div className="max-w-5xl mx-auto px-4 text-center text-white">
          <h3 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready for Systematic Marketing Excellence?
          </h3>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Join marketing leaders who chose operational excellence over ad-hoc approaches.
            Experience the PRAVADO difference with our enterprise trial.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <Button 
              size="lg"
              className="bg-pravado-purple hover:bg-pravado-purple/90 px-10 py-6 text-xl font-semibold rounded-lg text-white"
              onClick={() => navigate('/auth?mode=signup')}
            >
              Start Enterprise Trial
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-professional-gray px-10 py-6 text-xl font-semibold rounded-lg"
              onClick={() => navigate('/demo')}
            >
              Schedule Demo
            </Button>
          </div>
          
          <div className="mt-12 flex justify-center space-x-12 text-lg text-gray-300 font-medium">
            <span>✓ Enterprise Security</span>
            <span>✓ Dedicated Success Management</span>
            <span>✓ Custom Implementation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
