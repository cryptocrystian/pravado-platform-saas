
import React from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Shield, CreditCard, Users, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <BaseLayout title="Settings" breadcrumb="Settings">
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-professional-gray mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account and platform preferences</p>
          </div>

          {/* Settings Content */}
          <Card className="bg-white border border-border-gray">
            <Tabs defaultValue="profile" className="w-full">
              <div className="border-b border-border-gray">
                <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
                  <TabsTrigger value="profile" className="flex items-center space-x-2 px-6 py-4">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center space-x-2 px-6 py-4">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center space-x-2 px-6 py-4">
                    <Shield className="h-4 w-4" />
                    <span>Security</span>
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="flex items-center space-x-2 px-6 py-4">
                    <CreditCard className="h-4 w-4" />
                    <span>Billing</span>
                  </TabsTrigger>
                  <TabsTrigger value="team" className="flex items-center space-x-2 px-6 py-4">
                    <Users className="h-4 w-4" />
                    <span>Team</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="profile" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-professional-gray mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Sarah" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Johnson" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="sarah.johnson@company.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input id="title" defaultValue="Marketing Director" />
                      </div>
                    </div>
                    <Button className="mt-6">Save Changes</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-professional-gray">Notification Preferences</h3>
                  <p className="text-gray-600">Configure how and when you receive notifications</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border-gray rounded-lg">
                      <div>
                        <h4 className="font-medium text-professional-gray">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border-gray rounded-lg">
                      <div>
                        <h4 className="font-medium text-professional-gray">Campaign Alerts</h4>
                        <p className="text-sm text-gray-600">Get notified about campaign status changes</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-professional-gray">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border-gray rounded-lg">
                      <div>
                        <h4 className="font-medium text-professional-gray">Change Password</h4>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border-gray rounded-lg">
                      <div>
                        <h4 className="font-medium text-professional-gray">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="billing" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-professional-gray">Billing & Subscription</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-border-gray rounded-lg">
                      <h4 className="font-medium text-professional-gray mb-2">Current Plan</h4>
                      <p className="text-sm text-gray-600">Professional Plan - $99/month</p>
                      <Button variant="outline" size="sm" className="mt-2">Manage Subscription</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="team" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-professional-gray">Team Management</h3>
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      Invite Member
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border-gray rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-enterprise-blue rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">SJ</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-professional-gray">Sarah Johnson</h4>
                          <p className="text-sm text-gray-600">sarah.johnson@company.com</p>
                        </div>
                      </div>
                      <span className="text-sm text-enterprise-blue font-medium">Owner</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Settings;
