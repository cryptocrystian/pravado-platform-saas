
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
    <Sidebar className="border-r border-border-gray">
      <SidebarHeader className="bg-accent text-white p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-pravado-crimson rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">PRAVADO</h2>
            <p className="text-xs text-gray-200">Marketing Operating System</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-professional-gray">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a 
                      href={item.url} 
                      onClick={() => setActiveItem(item.title)}
                      className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                        activeItem === item.title 
                          ? 'bg-enterprise-blue text-white' 
                          : 'hover:bg-soft-gray text-professional-gray'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="bg-white p-4 border-t border-border-gray">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-soft-gray rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-professional-gray" />
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
