
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Code, TestTube, Database } from 'lucide-react';

export default function AITesting() {
  const isAITestingEnabled = import.meta.env.VITE_ENABLE_AI_TESTING === 'true';

  if (!isAITestingEnabled) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-professional-gray mb-2">Access Denied</h1>
          <p className="text-gray-500">AI Testing mode is not enabled.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-gray p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-pravado-purple to-enterprise-blue text-white p-8 rounded-lg shadow-lg mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <TestTube className="h-8 w-8" />
            <h1 className="text-3xl font-bold">AI Testing Environment</h1>
          </div>
          <p className="text-blue-100">Bypass authentication for AI tool testing and development</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Code className="h-8 w-8 text-enterprise-blue mb-4" />
            <h3 className="text-lg font-semibold text-professional-gray mb-2">API Testing</h3>
            <p className="text-gray-500 mb-4">Test API endpoints without authentication</p>
            <Button variant="outline" className="w-full">
              Access API Console
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Database className="h-8 w-8 text-pravado-purple mb-4" />
            <h3 className="text-lg font-semibold text-professional-gray mb-2">Database Access</h3>
            <p className="text-gray-500 mb-4">Direct database query interface</p>
            <Button variant="outline" className="w-full">
              Open Database
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Shield className="h-8 w-8 text-pravado-orange mb-4" />
            <h3 className="text-lg font-semibold text-professional-gray mb-2">Security Bypass</h3>
            <p className="text-gray-500 mb-4">Skip all authentication checks</p>
            <Button variant="outline" className="w-full">
              Enter System
            </Button>
          </Card>
        </div>

        <Card className="mt-8 p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Security Notice</h4>
              <p className="text-yellow-700 text-sm">
                This testing environment bypasses all security measures. Only use in development environments 
                and ensure VITE_ENABLE_AI_TESTING is disabled in production.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
