
import React from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { DashboardContent } from '@/components/DashboardContent';

const Dashboard = () => {
  return (
    <BaseLayout title="Dashboard">
      <DashboardContent />
    </BaseLayout>
  );
};

export default Dashboard;
