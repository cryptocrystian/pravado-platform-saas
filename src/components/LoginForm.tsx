
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-pravado-crimson rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-professional-gray">PRAVADO</h2>
          <p className="mt-2 text-sm text-gray-600">Marketing Operating System</p>
          <p className="mt-4 text-lg text-professional-gray">Sign in to your account</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-professional-gray">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-border-gray rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-enterprise-blue focus:border-enterprise-blue"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-professional-gray">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-border-gray rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-enterprise-blue focus:border-enterprise-blue"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-enterprise-blue focus:ring-enterprise-blue border-border-gray rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-professional-gray">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-enterprise-blue hover:text-enterprise-blue/90">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-enterprise-blue hover:bg-enterprise-blue/90 text-white py-2 px-4 rounded-md font-medium"
            >
              Sign in to PRAVADO
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
