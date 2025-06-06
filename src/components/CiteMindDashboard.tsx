
import React from 'react';
import CiteMindRealTimeDashboard from '@/components/CiteMindRealTimeDashboard';

const CiteMindDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-border-gray pb-6">
        <h1 className="text-3xl font-bold text-professional-gray mb-2">
          CiteMind™ Intelligence Hub
        </h1>
        <p className="text-lg text-gray-600">
          Revolutionary AI citation monitoring and podcast syndication engine. 
          Track your content's presence across ChatGPT, Claude, Perplexity, and Gemini, 
          while automatically converting content into podcasts distributed across 34+ platforms.
        </p>
      </div>
      
      <CiteMindRealTimeDashboard />
    </div>
  );
};

export default CiteMindDashboard;
