import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  BarChart3, 
  Activity,
  PenTool,
  Megaphone,
  Search,
  Settings,
  Users,
  TrendingUp,
  Zap,
  Sparkles,
  Home,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface EnterpriseNavigationProps {
  userRole: string;
  userName: string;
}

export const EnterpriseNavigation: React.FC<EnterpriseNavigationProps> = ({ userRole, userName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationSections = [
    {
      title: 'Command Center',
      items: [
        {
          id: 'command-center',
          label: 'Intelligence Dashboard',
          icon: Brain,
          path: '/enterprise/command-center',
          badge: 'LIVE',
          description: 'Real-time AI marketing intelligence'
        }
      ]
    },
    {
      title: 'Revolutionary AI Features',
      items: [
        {
          id: 'citemind',
          label: 'CiteMind™ Engine',
          icon: Target,
          path: '/enterprise/citemind',
          badge: 'REVOLUTIONARY',
          description: 'AI citation tracking across 34+ platforms'
        },
        {
          id: 'geo-optimization',
          label: 'GEO Optimization',
          icon: BarChart3,
          path: '/enterprise/geo',
          badge: 'INDUSTRY FIRST',
          description: 'Generative Engine Optimization'
        },
        {
          id: 'autonomous-ai',
          label: 'Autonomous AI',
          icon: Activity,
          path: '/enterprise/autonomous',
          badge: 'SELF-OPTIMIZING',
          description: 'Self-optimizing campaign intelligence'
        }
      ]
    },
    {
      title: 'Marketing Pillars',
      items: [
        {
          id: 'content-marketing',
          label: 'Content Marketing',
          icon: PenTool,
          path: '/enterprise/content',
          badge: 'AI-POWERED',
          description: 'AI-driven content strategy & optimization'
        },
        {
          id: 'public-relations',
          label: 'Public Relations',
          icon: Megaphone,
          path: '/enterprise/pr',
          badge: '34K+ CONTACTS',
          description: 'Media database & relationship management'
        },
        {
          id: 'seo-intelligence',
          label: 'SEO Intelligence',
          icon: Search,
          path: '/enterprise/seo',
          badge: 'TECHNICAL SEO',
          description: 'Advanced SEO automation & monitoring'
        }
      ]
    },
    {
      title: 'Enterprise Features',
      items: [
        {
          id: 'unified-campaigns',
          label: 'Unified Campaigns',
          icon: TrendingUp,
          path: '/enterprise/campaigns',
          badge: 'CROSS-PILLAR',
          description: 'Integrated marketing campaigns'
        },
        {
          id: 'team-collaboration',
          label: 'Team Management',
          icon: Users,
          path: '/enterprise/team',
          badge: '14 ROLES',
          description: 'Role-based team collaboration'
        },
        {
          id: 'enterprise-settings',
          label: 'Enterprise Settings',
          icon: Settings,
          path: '/enterprise/settings',
          badge: 'ENTERPRISE',
          description: 'Advanced configuration & security'
        }
      ]
    }
  ];

  const getBadgeColor = (badgeText: string) => {
    switch (badgeText) {
      case 'REVOLUTIONARY': return 'bg-purple-500 text-white';
      case 'INDUSTRY FIRST': return 'bg-blue-500 text-white';
      case 'SELF-OPTIMIZING': return 'bg-emerald-500 text-white';
      case 'LIVE': return 'bg-green-500 text-white';
      case 'AI-POWERED': return 'bg-teal-500 text-white';
      case '34K+ CONTACTS': return 'bg-orange-500 text-white';
      case 'TECHNICAL SEO': return 'bg-indigo-500 text-white';
      case 'CROSS-PILLAR': return 'bg-cyan-500 text-white';
      case '14 ROLES': return 'bg-pink-500 text-white';
      case 'ENTERPRISE': return 'bg-slate-700 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white dark:bg-slate-800 shadow-lg"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`
        fixed left-0 top-0 h-full w-80 bg-slate-900 text-white z-40 transform transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* PRAVADO Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
              <div>
                <h1 className="text-xl font-bold">PRAVADO</h1>
                <p className="text-xs text-slate-400">AI Marketing Operating System</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-slate-800 rounded-lg">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-slate-400">{userRole}</p>
            <Badge variant="secondary" className="mt-2 bg-purple-600 text-white text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              REVOLUTIONARY
            </Badge>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const IconComponent = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.path)}
                      className={`
                        w-full text-left p-3 rounded-lg transition-all duration-200 group
                        ${active 
                          ? 'bg-slate-800 text-white border border-purple-500/30' 
                          : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <IconComponent className={`w-5 h-5 mt-0.5 ${
                            active ? 'text-purple-400' : 'text-slate-400 group-hover:text-white'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{item.label}</span>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs px-2 py-0.5 ${getBadgeColor(item.badge)}`}
                              >
                                {item.badge}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-400 group-hover:text-slate-300">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          active ? 'text-purple-400' : 'text-slate-500'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-700">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-white" />
              <p className="text-sm font-semibold text-white">AI Status: Active</p>
            </div>
            <p className="text-xs text-purple-100">
              Revolutionary AI features operational
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default EnterpriseNavigation;