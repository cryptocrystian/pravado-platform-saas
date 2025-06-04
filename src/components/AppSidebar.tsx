
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
    <Sidebar className="border-r border-border-gray shadow-sm">
      <SidebarHeader className="bg-accent text-white p-3 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-pravado-crimson rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">PRAVADO</h2>
            <p className="text-xs text-gray-200 opacity-90">Marketing Operating System</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-soft-gray">
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="text-professional-gray text-xs font-medium uppercase tracking-wide mb-2 px-2">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a 
                      href={item.url} 
                      onClick={() => setActiveItem(item.title)}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ease-in-out group ${
                        activeItem === item.title 
                          ? 'bg-enterprise-blue text-white shadow-sm' 
                          : 'hover:bg-white text-professional-gray hover:shadow-sm'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 transition-colors ${
                        activeItem === item.title ? 'text-white' : 'text-gray-500 group-hover:text-enterprise-blue'
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
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="w-10 h-10 bg-gradient-to-br from-enterprise-blue to-pravado-purple rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-professional-gray">Sarah Johnson</p>
            <p className="text-xs text-gray-500">Marketing Director</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
