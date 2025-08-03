
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';

interface BaseLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumb?: string;
}

export function BaseLayout({ children, title, breadcrumb }: BaseLayoutProps) {
  return (
    <SidebarProvider>
      <div 
        className="min-h-screen flex w-full bg-background" 
        style={{ 
          backgroundColor: '#111827 !important',
          color: '#f9fafb !important'
        }}
      >
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <DashboardHeader title={title} breadcrumb={breadcrumb} />
          <div 
            className="flex-1 bg-background"
            style={{ 
              backgroundColor: '#111827 !important',
              color: '#f9fafb !important'
            }}
          >
            {children}
          </div>
        </main>
        <PerformanceMonitor />
      </div>
    </SidebarProvider>
  );
}
