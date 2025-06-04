
import React, { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import Dashboard from './Dashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return <LoginForm onLogin={handleLogin} />;
};

export default Index;
