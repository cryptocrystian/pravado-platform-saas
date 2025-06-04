
import React from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { PodcastSyndicationDashboard } from '@/components/PodcastSyndicationDashboard';

const PodcastSyndication = () => {
  return (
    <BaseLayout title="Podcast Syndication" breadcrumb="Podcast Syndication">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-professional-gray mb-2">
              Podcast Syndication
            </h1>
            <p className="text-gray-600">
              Automatically convert press releases to podcasts and distribute across 34+ platforms
            </p>
          </div>

          <PodcastSyndicationDashboard />
        </div>
      </div>
    </BaseLayout>
  );
};

export default PodcastSyndication;
