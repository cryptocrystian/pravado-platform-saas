
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardContent } from '@/components/DashboardContent';

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-soft-gray">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-4 border-b border-border-gray bg-white">
            <SidebarTrigger />
          </div>
          <DashboardContent />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
