import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  BarChart3, 
  Activity,
  Sparkles,
  Rocket,
  Zap,
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export const RevolutionaryShowcase: React.FC = () => {
  const navigate = useNavigate();

  const revolutionaryFeatures = [
    {
      title: 'CiteMind™ Engine',
      description: 'World\'s first AI citation tracking across 34+ platforms',
      icon: Target,
      badge: 'REVOLUTIONARY',
      badgeColor: 'bg-purple-500',
      stats: ['2,847 Citations Tracked', '89% Authority Score', '34+ AI Platforms'],
      path: '/enterprise/citemind'
    },
    {
      title: 'GEO Optimization',
      description: 'Industry-first Generative Engine Optimization',
      icon: BarChart3,
      badge: 'INDUSTRY FIRST',
      badgeColor: 'bg-blue-500',
      stats: ['67% GEO Score', '45% AI Visibility', '3,628 Queries'],
      path: '/enterprise/geo'
    },
    {
      title: 'Autonomous AI',
      description: 'Self-optimizing marketing intelligence system',
      icon: Activity,
      badge: 'SELF-OPTIMIZING',
      badgeColor: 'bg-emerald-500',
      stats: ['82% Success Rate', '47 Active Campaigns', '+$96K ROI'],
      path: '/enterprise/autonomous'
    }
  ];

  const enterpriseStats = [
    { label: 'Total Revenue', value: '$847K', change: '+23% MoM', color: 'text-green-600' },
    { label: 'Campaign ROI', value: '347%', change: '+45% QoQ', color: 'text-blue-600' },
    { label: 'Media Coverage', value: '1,284', change: '+67% MoM', color: 'text-purple-600' },
    { label: 'SEO Traffic', value: '847K', change: '+89% YoY', color: 'text-teal-600' },
    { label: 'AI Accuracy', value: '94.7%', change: '+2.3% MoM', color: 'text-orange-600' },
    { label: 'Cost Savings', value: '$96K', change: 'Annual ROI', color: 'text-indigo-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-blue-950 dark:to-teal-950">
      
      {/* Revolutionary Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-teal-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="w-12 h-12 text-purple-400 animate-pulse" />
              <Badge variant="secondary" className="bg-purple-500 text-white text-sm px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                REVOLUTIONARY AI PLATFORM
              </Badge>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              PRAVADO
            </h1>
            <p className="text-xl text-blue-200 mb-2">
              World's First AI Marketing Operating System
            </p>
            <p className="text-lg text-slate-300 mb-8">
              Revolutionary CiteMind™ • GEO Optimization • Autonomous AI Intelligence
            </p>
            
            {/* CTA Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => navigate('/enterprise/command-center')}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Launch Command Center
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => navigate('/enterprise/revolutionary')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3"
              >
                <Zap className="w-5 h-5 mr-2" />
                View Revolutionary Features
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Revolutionary Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Features Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Revolutionary AI Features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Industry-first capabilities with 2-3 year competitive advantage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {revolutionaryFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="p-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-700">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <Badge variant="secondary" className={`${feature.badgeColor} text-white mb-4`}>
                    {feature.badge}
                  </Badge>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">{feature.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {feature.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">{stat.split(' ').slice(0, -1).join(' ')}</span>
                        <span className="font-semibold text-blue-600">{stat.split(' ').pop()}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => navigate(feature.path)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Explore Feature
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Enterprise Performance Stats */}
        <Card className="p-8 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900 border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Enterprise Performance Metrics
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Real-time intelligence powering $96K annual ROI for Marketing Directors
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {enterpriseStats.map((stat, index) => (
              <div key={index} className="text-center bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color} mb-1`}>{stat.value}</p>
                <p className="text-xs text-green-600">{stat.change}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Revolutionary Value Proposition */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Revolutionary Market Position
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300">vs. HubSpot Marketing</h4>
                <p className="text-slate-600 dark:text-slate-400">✅ AI-first vs. basic automation</p>
                <p className="text-slate-600 dark:text-slate-400">✅ Cross-pillar intelligence</p>
                <p className="text-slate-600 dark:text-slate-400">✅ Revolutionary features</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300">vs. Salesforce Marketing</h4>
                <p className="text-slate-600 dark:text-slate-400">✅ Marketing-focused platform</p>
                <p className="text-slate-600 dark:text-slate-400">✅ Intuitive AI interface</p>
                <p className="text-slate-600 dark:text-slate-400">✅ 25% cheaper with more value</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-teal-700 dark:text-teal-300">vs. Tool Stack Combos</h4>
                <p className="text-slate-600 dark:text-slate-400">✅ Unified intelligence platform</p>
                <p className="text-slate-600 dark:text-slate-400">✅ Cross-platform attribution</p>
                <p className="text-slate-600 dark:text-slate-400">✅ 60% cost reduction</p>
              </div>
            </div>
            
            <div className="mt-8">
              <Button
                onClick={() => navigate('/enterprise/command-center')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Experience the Revolution
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RevolutionaryShowcase;