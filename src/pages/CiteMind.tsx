
import React from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import CiteMindDashboard from '@/components/CiteMindDashboard';

const CiteMind = () => {
  return (
    <BaseLayout title="CiteMind™">
      <CiteMindDashboard />
    </BaseLayout>
  );
};

export default CiteMind;
