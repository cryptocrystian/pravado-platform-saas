
import React from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerSuccessTracking } from '@/components/CustomerSuccessTracking';
import { UserBehaviorAnalytics } from '@/components/UserBehaviorAnalytics';

const CustomerSuccess = () => {
  return (
    <BaseLayout title="Customer Success" breadcrumb="Customer Management">
      <div className="p-6">
        <Tabs defaultValue="tracking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tracking">Success Tracking</TabsTrigger>
            <TabsTrigger value="analytics">User Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracking">
            <CustomerSuccessTracking />
          </TabsContent>
          
          <TabsContent value="analytics">
            <UserBehaviorAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
};

export default CustomerSuccess;
