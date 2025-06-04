
import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, Users, Search, Activity, Settings, User } from 'lucide-react';
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

const menuItems = [
  {
    title: "Dashboard",
    url: "#dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Content Marketing",
    url: "#content-marketing",
    icon: MessageSquare,
  },
  {
    title: "Public Relations",
    url: "#public-relations",
    icon: Users,
  },
  {
    title: "SEO Intelligence",
    url: "#seo-intelligence",
    icon: Search,
  },
  {
    title: "Analytics",
    url: "#analytics",
    icon: Activity,
  },
  {
    title: "Settings",
    url: "#settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <Sidebar className="border-r border-border-gray shadow-lg">
      <SidebarHeader className="bg-accent text-white p-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-pravado-crimson rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">PRAVADO</h2>
            <p className="text-xs text-blue-100 opacity-90">Marketing Operating System</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-soft-gray">
        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-4 px-3">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a 
                      href={item.url} 
                      onClick={() => setActiveItem(item.title)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group ${
                        activeItem === item.title 
                          ? 'bg-enterprise-blue text-white shadow-sm' 
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 transition-colors duration-200 ${
                        activeItem === item.title ? 'text-white' : 'text-slate-500 group-hover:text-enterprise-blue'
                      }`} />
                      <span className="font-medium text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="bg-soft-gray p-4 border-t border-border-gray">
        <div className="flex items-center space-x-3 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 bg-gradient-to-br from-enterprise-blue to-pravado-purple rounded-full flex items-center justify-center shadow-sm">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-professional-gray">Sarah Johnson</p>
            <p className="text-xs text-slate-500">Marketing Director</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
