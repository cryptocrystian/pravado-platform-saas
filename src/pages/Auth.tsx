
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

type AuthMode = 'signin' | 'signup' | 'reset';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for mode in URL params
  useEffect(() => {
    const urlMode = searchParams.get('mode') as AuthMode;
    if (urlMode && ['signin', 'signup', 'reset'].includes(urlMode)) {
      setMode(urlMode);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else if (mode === 'signup') {
        await signUp(email, password, fullName);
      } else if (mode === 'reset') {
        await resetPassword(email);
        setMode('signin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin': return 'Welcome Back';
      case 'signup': return 'Create Your Account';
      case 'reset': return 'Reset Password';
    }
  };

  const getSubmitText = () => {
    if (isLoading) {
      switch (mode) {
        case 'signin': return 'Signing In...';
        case 'signup': return 'Creating Account...';
        case 'reset': return 'Sending Reset Email...';
      }
    }
    switch (mode) {
      case 'signin': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'reset': return 'Send Reset Email';
    }
  };

  return (
    <div className="min-h-screen bg-soft-gray flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="bg-white rounded-lg shadow-lg p-8 border border-border-gray">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-pravado-crimson rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-professional-gray">PRAVADO</h1>
                <p className="text-sm text-gray-500">Marketing Operating System</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-professional-gray">{getTitle()}</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div>
                <Label htmlFor="fullName" className="text-professional-gray">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-professional-gray">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1"
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <Label htmlFor="password" className="text-professional-gray">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="mt-1"
                  minLength={6}
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-enterprise-blue hover:bg-enterprise-blue/90" 
              disabled={isLoading}
            >
              {getSubmitText()}
            </Button>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 space-y-4 text-center">
            {mode === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-sm text-enterprise-blue hover:underline"
                >
                  Forgot your password?
                </button>
                <div>
                  <span className="text-sm text-gray-500">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-sm text-enterprise-blue hover:underline"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <div>
                <span className="text-sm text-gray-500">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-sm text-enterprise-blue hover:underline"
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-sm text-enterprise-blue hover:underline"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
