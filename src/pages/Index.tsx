
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
          <p className="mt-4 text-professional-gray">Loading PRAVADO...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-gray">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-accent to-enterprise-blue text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-pravado-crimson rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold">PRAVADO</h1>
                <p className="text-blue-100">Marketing Operating System</p>
              </div>
            </div>
            <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
              Accelerate Your Marketing Success
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              The complete platform for marketing executives to automate, optimize, and scale their operations with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-white text-enterprise-blue hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
                onClick={() => navigate('/auth?mode=signup')}
              >
                Get Started Free
              </Button>
              <Button 
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-enterprise-blue font-semibold px-8 py-3 text-lg transition-all duration-200"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-professional-gray mb-4">
            Everything You Need to Succeed
          </h3>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From content creation to PR campaigns, SEO optimization to analytics - 
            PRAVADO brings all your marketing tools together in one powerful platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-pravado-crimson rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">C</span>
            </div>
            <h4 className="font-semibold text-professional-gray mb-2">Content Marketing</h4>
            <p className="text-gray-500 text-sm">Create, manage, and optimize content that drives results</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-pravado-orange rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">P</span>
            </div>
            <h4 className="font-semibold text-professional-gray mb-2">Public Relations</h4>
            <p className="text-gray-500 text-sm">Build relationships and amplify your brand message</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-enterprise-blue rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">S</span>
            </div>
            <h4 className="font-semibold text-professional-gray mb-2">SEO Intelligence</h4>
            <p className="text-gray-500 text-sm">Dominate search rankings with AI-powered insights</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-pravado-purple rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">A</span>
            </div>
            <h4 className="font-semibold text-professional-gray mb-2">Analytics</h4>
            <p className="text-gray-500 text-sm">Make data-driven decisions with comprehensive reporting</p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-border-gray">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h3 className="text-2xl font-bold text-professional-gray mb-4">
            Ready to Transform Your Marketing?
          </h3>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Join thousands of marketing professionals who trust PRAVADO to accelerate their success.
          </p>
          <Button 
            size="lg"
            className="bg-enterprise-blue hover:bg-enterprise-blue/90 font-semibold px-8 py-3 text-lg"
            onClick={() => navigate('/auth?mode=signup')}
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
