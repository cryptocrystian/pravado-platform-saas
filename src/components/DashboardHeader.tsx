
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, Search, User } from 'lucide-react';
import { PravadoLogo } from '@/components/PravadoLogo';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardHeaderProps {
  title?: string;
  breadcrumb?: string;
}

export function DashboardHeader({ title = "Dashboard", breadcrumb }: DashboardHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="lg:hidden" />
          
          {/* Show clean icon-only logo on mobile when sidebar is collapsed */}
          {isMobile && (
            <div className="sm:hidden">
              <PravadoLogo variant="icon-only" />
            </div>
          )}
          
          <div className="hidden sm:block">
            <nav className="flex space-x-2 text-sm text-foreground-muted">
              <span>PRAVADO</span>
              <span>/</span>
              <span className="text-pravado-purple font-medium">{breadcrumb || title}</span>
            </nav>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5 text-foreground-muted" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-foreground-muted" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-pravado-purple rounded-full"></span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5 text-foreground-muted" />
          </Button>
        </div>
      </div>
    </header>
  );
}
