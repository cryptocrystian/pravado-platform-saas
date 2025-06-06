
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  Gift,
  Star,
  Award
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  tier: 'beta' | 'starter' | 'professional' | 'enterprise';
  healthScore: number;
  lastActivity: Date;
  onboardingProgress: number;
  successMilestones: string[];
  churnRisk: 'low' | 'medium' | 'high';
  nextAction: string;
  mrr: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  category: 'onboarding' | 'adoption' | 'expansion' | 'advocacy';
  completed: boolean;
  completedDate?: Date;
  impact: 'high' | 'medium' | 'low';
}

export function CustomerSuccessTracking() {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  // Mock customer data
  const customers: Customer[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'TechCorp Inc.',
      email: 'sarah@techcorp.com',
      tier: 'enterprise',
      healthScore: 92,
      lastActivity: new Date('2024-01-07'),
      onboardingProgress: 100,
      successMilestones: ['first_campaign', 'automate_completion', 'team_expansion'],
      churnRisk: 'low',
      nextAction: 'Upsell conversation - Advanced Analytics',
      mrr: 2500
    },
    {
      id: '2',
      name: 'Michael Chen',
      company: 'Growth Marketing Co.',
      email: 'michael@growthmarketing.com',
      tier: 'professional',
      healthScore: 78,
      lastActivity: new Date('2024-01-06'),
      onboardingProgress: 85,
      successMilestones: ['first_campaign', 'automate_completion'],
      churnRisk: 'medium',
      nextAction: 'Check-in call - feature adoption',
      mrr: 899
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      company: 'Startup Ventures',
      email: 'emily@startupventures.com',
      tier: 'beta',
      healthScore: 45,
      lastActivity: new Date('2024-01-02'),
      onboardingProgress: 40,
      successMilestones: [],
      churnRisk: 'high',
      nextAction: 'Urgent: Re-engagement campaign',
      mrr: 0
    }
  ];

  const milestones: Milestone[] = [
    {
      id: 'onboard_complete',
      title: 'Onboarding Completed',
      description: 'Finished initial setup and training',
      category: 'onboarding',
      completed: true,
      completedDate: new Date('2024-01-01'),
      impact: 'high'
    },
    {
      id: 'first_campaign',
      title: 'First Campaign Created',
      description: 'Successfully launched first marketing campaign',
      category: 'adoption',
      completed: true,
      completedDate: new Date('2024-01-03'),
      impact: 'high'
    },
    {
      id: 'automate_completion',
      title: 'AUTOMATE Methodology Completed',
      description: 'Finished all 8 steps of AUTOMATE methodology',
      category: 'adoption',
      completed: true,
      completedDate: new Date('2024-01-05'),
      impact: 'high'
    },
    {
      id: 'team_expansion',
      title: 'Team Member Added',
      description: 'Invited additional team members to platform',
      category: 'expansion',
      completed: false,
      impact: 'medium'
    },
    {
      id: 'referral_made',
      title: 'Referral Made',
      description: 'Referred another company to PRAVADO',
      category: 'advocacy',
      completed: false,
      impact: 'high'
    }
  ];

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'bg-pravado-purple text-white';
      case 'professional': return 'bg-pravado-orange text-white';
      case 'starter': return 'bg-enterprise-blue text-white';
      case 'beta': return 'bg-gray-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const averageHealthScore = customers.reduce((sum, customer) => sum + customer.healthScore, 0) / customers.length;
  const highRiskCustomers = customers.filter(c => c.churnRisk === 'high').length;
  const completedMilestones = milestones.filter(m => m.completed).length;
  const totalMrr = customers.reduce((sum, customer) => sum + customer.mrr, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-professional-gray">Customer Success Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor customer health, track milestones, and prevent churn</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Health Score</p>
                <p className={`text-2xl font-bold ${getHealthScoreColor(averageHealthScore)}`}>
                  {Math.round(averageHealthScore)}
                </p>
                <p className="text-xs text-green-600">+5 vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-red-600">{highRiskCustomers}</p>
                <p className="text-xs text-red-600">Require immediate attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-pravado-purple" />
              <div>
                <p className="text-sm text-gray-600">Milestones</p>
                <p className="text-2xl font-bold text-pravado-purple">{completedMilestones}/{milestones.length}</p>
                <p className="text-xs text-green-600">Overall completion rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-pravado-orange" />
              <div>
                <p className="text-sm text-gray-600">Total MRR</p>
                <p className="text-2xl font-bold text-pravado-orange">${totalMrr.toLocaleString()}</p>
                <p className="text-xs text-green-600">+12% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="customers">Customer Health</TabsTrigger>
          <TabsTrigger value="milestones">Success Milestones</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="celebrations">Celebrations</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.map(customer => (
                  <div 
                    key={customer.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => setSelectedCustomer(customer.id === selectedCustomer ? null : customer.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pravado-purple to-pravado-orange rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-medium text-professional-gray">{customer.name}</h4>
                        <p className="text-sm text-gray-600">{customer.company}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getTierColor(customer.tier)}>
                            {customer.tier}
                          </Badge>
                          <Badge className={getChurnRiskColor(customer.churnRisk)}>
                            {customer.churnRisk} risk
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600">Health Score:</span>
                        <span className={`text-lg font-bold ${getHealthScoreColor(customer.healthScore)}`}>
                          {customer.healthScore}
                        </span>
                      </div>
                      <div className="w-32">
                        <Progress value={customer.healthScore} className="h-2" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Onboarding: {customer.onboardingProgress}%
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-pravado-orange">
                        ${customer.mrr.toLocaleString()}/mo
                      </p>
                      <p className="text-xs text-gray-500">
                        Last active: {customer.lastActivity.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Success Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map(milestone => (
                    <div key={milestone.id} className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                        milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {milestone.completed ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-medium ${milestone.completed ? 'text-green-700' : 'text-gray-700'}`}>
                            {milestone.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {milestone.category}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              milestone.impact === 'high' ? 'border-red-300 text-red-600' :
                              milestone.impact === 'medium' ? 'border-yellow-300 text-yellow-600' :
                              'border-green-300 text-green-600'
                            }`}
                          >
                            {milestone.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                        {milestone.completedDate && (
                          <p className="text-xs text-green-600 mt-1">
                            Completed: {milestone.completedDate.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Milestone Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Onboarding Milestones</span>
                      <span className="text-sm text-gray-600">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Adoption Milestones</span>
                      <span className="text-sm text-gray-600">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Expansion Milestones</span>
                      <span className="text-sm text-gray-600">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Advocacy Milestones</span>
                      <span className="text-sm text-gray-600">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interventions">
          <Card>
            <CardHeader>
              <CardTitle>Required Interventions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.filter(c => c.churnRisk !== 'low').map(customer => (
                  <div key={customer.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className={`w-5 h-5 ${
                          customer.churnRisk === 'high' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                        <div>
                          <h4 className="font-medium">{customer.name} - {customer.company}</h4>
                          <p className="text-sm text-gray-600">{customer.nextAction}</p>
                        </div>
                      </div>
                      <Badge className={getChurnRiskColor(customer.churnRisk)}>
                        {customer.churnRisk} risk
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button size="sm" className="bg-pravado-purple hover:bg-pravado-purple/90">
                        <Phone className="w-4 h-4 mr-2" />
                        Schedule Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        In-App Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="celebrations">
          <Card>
            <CardHeader>
              <CardTitle>Success Celebrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.filter(c => c.successMilestones.length > 0).map(customer => (
                  <div key={customer.id} className="p-4 border border-gray-200 rounded-lg bg-green-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <div>
                          <h4 className="font-medium text-green-800">{customer.name} achieved milestones!</h4>
                          <p className="text-sm text-green-600">
                            Completed: {customer.successMilestones.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Gift className="w-4 h-4 mr-2" />
                          Send Reward
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule Check-in
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
