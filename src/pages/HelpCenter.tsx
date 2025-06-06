
import React from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { HelpCenter as HelpCenterComponent } from '@/components/HelpCenter';

const HelpCenter = () => {
  return (
    <BaseLayout title="Help Center" breadcrumb="Support">
      <div className="p-6">
        <HelpCenterComponent />
      </div>
    </BaseLayout>
  );
};

export default HelpCenter;
