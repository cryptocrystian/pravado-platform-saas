
import React from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BetaUserApplication } from '@/components/BetaUserApplication';
import { BetaOnboardingFlow } from '@/components/BetaOnboardingFlow';

const BetaProgram = () => {
  return (
    <BaseLayout title="Beta Program" breadcrumb="Beta Access">
      <div className="p-6">
        <Tabs defaultValue="application" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="application">Apply for Beta</TabsTrigger>
            <TabsTrigger value="onboarding">Beta Onboarding</TabsTrigger>
          </TabsList>
          
          <TabsContent value="application">
            <BetaUserApplication />
          </TabsContent>
          
          <TabsContent value="onboarding">
            <BetaOnboardingFlow />
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
};

export default BetaProgram;
