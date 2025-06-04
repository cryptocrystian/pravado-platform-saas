
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardContent } from '@/components/DashboardContent';
import { DashboardHeader } from '@/components/DashboardHeader';

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-soft-gray">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <DashboardHeader />
          <DashboardContent />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
