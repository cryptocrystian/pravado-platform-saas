
import React from 'react';
import { Card } from '@/components/ui/card';

export function DashboardContent() {
  return (
    <div className="p-6 bg-soft-gray">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-professional-gray mb-2">Welcome to PRAVADO</h1>
        <p className="text-gray-600">Your Marketing Operating System Dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-pravado-crimson bg-white shadow-sm border border-border-gray">
          <h3 className="text-lg font-semibold text-professional-gray mb-2">Content Marketing</h3>
          <p className="text-gray-600 text-sm">Manage your content strategy and campaigns</p>
          <div className="mt-4 text-2xl font-bold text-pravado-crimson">24</div>
          <p className="text-xs text-gray-500">Active campaigns</p>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-pravado-orange bg-white shadow-sm border border-border-gray">
          <h3 className="text-lg font-semibold text-professional-gray mb-2">Public Relations</h3>
          <p className="text-gray-600 text-sm">Track your PR campaigns and media coverage</p>
          <div className="mt-4 text-2xl font-bold text-pravado-orange">12</div>
          <p className="text-xs text-gray-500">Media mentions</p>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-enterprise-blue bg-white shadow-sm border border-border-gray">
          <h3 className="text-lg font-semibold text-professional-gray mb-2">SEO Intelligence</h3>
          <p className="text-gray-600 text-sm">Monitor your search engine performance</p>
          <div className="mt-4 text-2xl font-bold text-enterprise-blue">87%</div>
          <p className="text-xs text-gray-500">SEO score</p>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-pravado-purple bg-white shadow-sm border border-border-gray">
          <h3 className="text-lg font-semibold text-professional-gray mb-2">Analytics Overview</h3>
          <p className="text-gray-600 text-sm">Track your marketing performance metrics</p>
          <div className="mt-4 text-2xl font-bold text-pravado-purple">+23%</div>
          <p className="text-xs text-gray-500">Growth this month</p>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-pravado-orange bg-white shadow-sm border border-border-gray">
          <h3 className="text-lg font-semibold text-professional-gray mb-2">Lead Generation</h3>
          <p className="text-gray-600 text-sm">Monitor your lead pipeline and conversion</p>
          <div className="mt-4 text-2xl font-bold text-pravado-orange">156</div>
          <p className="text-xs text-gray-500">New leads this week</p>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-enterprise-blue bg-white shadow-sm border border-border-gray">
          <h3 className="text-lg font-semibold text-professional-gray mb-2">Campaign ROI</h3>
          <p className="text-gray-600 text-sm">Track return on marketing investment</p>
          <div className="mt-4 text-2xl font-bold text-enterprise-blue">3.2x</div>
          <p className="text-xs text-gray-500">Average ROI</p>
        </Card>
      </div>
    </div>
  );
}
