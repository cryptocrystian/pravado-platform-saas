
import React from 'react';
import { LayoutDashboard, MessageSquare, Users, Search, Activity, Settings } from 'lucide-react';
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
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="bg-accent text-white p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
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
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md transition-colors">
                      <item.icon className="h-5 w-5 text-accent" />
                      <span className="font-medium text-gray-700">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
