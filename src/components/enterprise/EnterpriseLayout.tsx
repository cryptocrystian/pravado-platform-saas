import React from 'react';
import { EnterpriseNavigation } from './EnterpriseNavigation';

interface EnterpriseLayoutProps {
  children: React.ReactNode;
  userRole?: string;
  userName?: string;
}

export const EnterpriseLayout: React.FC<EnterpriseLayoutProps> = ({ 
  children, 
  userRole = "Marketing Director",
  userName = "Executive User" 
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <EnterpriseNavigation userRole={userRole} userName={userName} />
      
      {/* Main Content Area */}
      <div className="lg:ml-80 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default EnterpriseLayout;