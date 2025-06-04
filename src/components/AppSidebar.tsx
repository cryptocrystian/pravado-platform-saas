
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, Search, Activity, Settings, User, LogOut, Brain } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserData';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Content Marketing",
    url: "/content-marketing",
    icon: MessageSquare,
  },
  {
    title: "Public Relations",
    url: "/public-relations",
    icon: Users,
  },
  {
    title: "SEO Intelligence",
    url: "/seo-intelligence",
    icon: Search,
  },
  {
    title: "AI Citations",
    url: "/ai-citations",
    icon: Brain,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: Activity,
  },
  {
    title: "CiteMind™",
    url: "/citemind",
    icon: Brain,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { data: userProfile } = useUserProfile();

  const userName = userProfile?.full_name || user?.user_metadata?.full_name || 'User';
  const userRole = userProfile?.role || 'Marketing Professional';

  const handleSignOut = () => {
    signOut();
  };

  return (
    <Sidebar className="border-r border-border-gray shadow-lg">
      <SidebarHeader className="bg-accent text-white p-3 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-pravado-crimson rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">PRAVADO</h2>
            <p className="text-xs text-blue-100 opacity-90">Marketing Operating System</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-soft-gray">
        <SidebarGroup className="px-3 py-2">
          <SidebarGroupLabel className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2 px-2">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out group ${
                        location.pathname === item.url
                          ? item.title === 'CiteMind™' 
                            ? 'bg-pravado-purple text-white shadow-sm' 
                            : 'bg-enterprise-blue text-white shadow-sm'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <item.icon className={`h-4 w-4 transition-colors duration-200 ${
                        location.pathname === item.url 
                          ? 'text-white' 
                          : item.title === 'CiteMind™'
                            ? 'text-pravado-purple group-hover:text-pravado-purple'
                            : 'text-slate-500 group-hover:text-enterprise-blue'
                      }`} />
                      <span className={`font-medium text-sm ${
                        item.title === 'CiteMind™' ? 'font-semibold' : ''
                      }`}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="bg-soft-gray p-3 border-t border-border-gray">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-white shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-enterprise-blue to-pravado-purple rounded-full flex items-center justify-center shadow-sm">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-professional-gray truncate">{userName}</p>
              <p className="text-xs text-slate-500 truncate">{userRole}</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 py-2"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
