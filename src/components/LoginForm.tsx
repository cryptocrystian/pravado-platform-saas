import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onLogin: () => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (user) {
      navigate('/dashboard', { replace: true });
    } else {
      // Otherwise redirect to auth page
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  // This component is now just a redirect handler
  return null;
}
