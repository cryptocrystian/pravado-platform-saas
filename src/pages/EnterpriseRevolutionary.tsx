import React, { useState } from 'react';
import { EnterpriseLayout } from '@/components/enterprise/EnterpriseLayout';
import { CiteMindEngine } from '@/components/revolutionary/CiteMindEngine';
import { GEOOptimizationCenter } from '@/components/revolutionary/GEOOptimizationCenter';
import { AutonomousAI } from '@/components/revolutionary/AutonomousAI';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Target, BarChart3, Activity, Sparkles } from 'lucide-react';

const EnterpriseRevolutionary: React.FC = () => {
  const tenantId = "tenant-123";
  const userRole = "Marketing Director";
  
  return (
    <EnterpriseLayout userRole={userRole} userName="Executive User">
      <div className="space-y-6">
        {/* Revolutionary Features Header */}
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-teal-900 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Revolutionary AI Features</h1>
              <p className="text-blue-200">World's First AI Marketing Operating System</p>
            </div>
            <div className="flex space-x-2">
              <Badge variant="secondary" className="bg-purple-500 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                REVOLUTIONARY
              </Badge>
              <Badge variant="secondary" className="bg-blue-500 text-white">
                INDUSTRY LEADING
              </Badge>
            </div>
          </div>
        </div>

        {/* Revolutionary Features Tabs */}
        <Tabs defaultValue="citemind" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
            <TabsTrigger value="citemind" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>CiteMind™ Engine</span>
              <Badge variant="outline" className="ml-2 text-xs border-purple-500 text-purple-700">
                REVOLUTIONARY
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="geo" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>GEO Optimization</span>
              <Badge variant="outline" className="ml-2 text-xs border-blue-500 text-blue-700">
                INDUSTRY FIRST
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="autonomous" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Autonomous AI</span>
              <Badge variant="outline" className="ml-2 text-xs border-emerald-500 text-emerald-700">
                SELF-OPTIMIZING
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="citemind">
            <CiteMindEngine tenantId={tenantId} />
          </TabsContent>

          <TabsContent value="geo">
            <GEOOptimizationCenter tenantId={tenantId} />
          </TabsContent>

          <TabsContent value="autonomous">
            <AutonomousAI tenantId={tenantId} />
          </TabsContent>
        </Tabs>
      </div>
    </EnterpriseLayout>
  );
};

export default EnterpriseRevolutionary;