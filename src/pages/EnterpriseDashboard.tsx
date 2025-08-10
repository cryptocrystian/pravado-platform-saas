import React from 'react';
import { EnterpriseLayout } from '@/components/enterprise/EnterpriseLayout';
import { MarketingIntelligenceCommandCenter } from '@/components/enterprise/MarketingIntelligenceCommandCenter';

interface EnterpriseDashboardProps {
  // Props will be passed from router/auth context
}

const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = () => {
  // In real implementation, these would come from auth context/props
  const tenantId = "tenant-123";
  const userRole = "Marketing Director";
  
  return (
    <EnterpriseLayout userRole={userRole} userName="Executive User">
      <MarketingIntelligenceCommandCenter 
        userRole={userRole} 
        tenantId={tenantId} 
      />
    </EnterpriseLayout>
  );
};

export default EnterpriseDashboard;