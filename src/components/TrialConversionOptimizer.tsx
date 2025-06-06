
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  TrendingUp, 
  Target, 
  Zap, 
  Star,
  ArrowRight,
  Gift,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';

interface TrialMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dayTarget: number;
  valueRealized: string;
}

interface ConversionIncentive {
  title: string;
  description: string;
  value: string;
  urgent: boolean;
  action: string;
}

export function TrialConversionOptimizer() {
  const [trialDay, setTrialDay] = useState(15); // Simulated trial day
  const [milestones, setMilestones] = useState<TrialMilestone[]>([
    {
      id: 'setup',
      title: 'Platform Setup Complete',
      description: 'Configure your first campaign with AUTOMATE methodology',
      completed: true,
      dayTarget: 3,
      valueRealized: 'Foundation for systematic growth'
    },
    {
      id: 'first-campaign',
      title: 'First Campaign Launched',
      description: 'Experience three-pillar integration in action',
      completed: true,
      dayTarget: 7,
      valueRealized: 'See content-PR-SEO working together'
    },
    {
      id: 'ai-insights',
      title: 'AI Insights Generated',
      description: 'Get your first AI-powered recommendations',
      completed: true,
      dayTarget: 10,
      valueRealized: 'Intelligent optimization suggestions'
    },
    {
      id: 'team-adoption',
      title: 'Team Adoption Milestone',
      description: 'Your team is actively using all three pillars',
      completed: trialDay >= 14,
      dayTarget: 14,
      valueRealized: '40% efficiency improvement visible'
    },
    {
      id: 'measurable-results',
      title: 'Measurable Results',
      description: 'Track performance improvements and ROI indicators',
      completed: trialDay >= 21,
      dayTarget: 21,
      valueRealized: 'Clear ROI path established'
    },
    {
      id: 'scale-ready',
      title: 'Scale-Ready Operations',
      description: 'Your marketing operations are systematically optimized',
      completed: trialDay >= 28,
      dayTarget: 28,
      valueRealized: 'Ready for exponential growth'
    }
  ]);

  const completedMilestones = milestones.filter(m => m.completed).length;
  const trialProgress = (trialDay / 30) * 100;
  const milestonesProgress = (completedMilestones / milestones.length) * 100;

  const conversionIncentives: ConversionIncentive[] = [
    {
      title: "Early Adopter Bonus",
      description: "Convert before day 20 and get 2 months free on your annual plan",
      value: "Save $998-$2,998",
      urgent: trialDay >= 15,
      action: "Claim Bonus"
    },
    {
      title: "Setup & Training Included",
      description: "Free dedicated onboarding and team training (normally $2,500)",
      value: "$2,500 value",
      urgent: false,
      action: "Get Training"
    },
    {
      title: "Success Guarantee",
      description: "If you don't see 20% efficiency improvement in 90 days, we'll refund everything",
      value: "Risk-free",
      urgent: false,
      action: "Learn More"
    }
  ];

  const valueAchieved = [
    { metric: "Campaign Performance", improvement: "+87%", icon: Target },
    { metric: "Team Efficiency", improvement: "+34%", icon: Users },
    { metric: "Content ROI", improvement: "+156%", icon: BarChart3 },
    { metric: "Lead Quality", improvement: "+67%", icon: TrendingUp }
  ];

  const urgencyFactors = [
    { icon: Clock, text: `${30 - trialDay} days left in trial` },
    { icon: Gift, text: "Early adopter bonuses expire soon" },
    { icon: TrendingUp, text: "Results compound with more time" }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Trial Progress Header */}
      <Card className="bg-gradient-to-r from-pravado-purple/10 to-pravado-orange/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-professional-gray">Your Trial Progress</h2>
              <p className="text-gray-600">You're making excellent progress! Here's what you've achieved:</p>
            </div>
            <Badge className="bg-pravado-orange text-white px-4 py-2 text-lg">
              Day {trialDay} of 30
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Trial Progress</span>
                <span className="text-sm text-gray-600">{Math.round(trialProgress)}%</span>
              </div>
              <Progress value={trialProgress} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Milestones Completed</span>
                <span className="text-sm text-gray-600">{completedMilestones}/{milestones.length}</span>
              </div>
              <Progress value={milestonesProgress} className="h-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {valueAchieved.map((achievement, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center">
                <achievement.icon className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-bold text-green-600">{achievement.improvement}</div>
                <div className="text-xs text-gray-600">{achievement.metric}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Milestone Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Implementation Milestones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div 
                key={milestone.id}
                className={`flex items-center space-x-4 p-4 rounded-lg ${
                  milestone.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  milestone.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {milestone.completed ? <CheckCircle className="w-5 h-5" /> : <span>{index + 1}</span>}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="font-semibold text-professional-gray">{milestone.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      Day {milestone.dayTarget}
                    </Badge>
                    {milestone.completed && (
                      <Badge className="bg-green-500 text-white text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                  <div className="text-xs text-green-600 font-medium">
                    ✓ {milestone.valueRealized}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Incentives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {conversionIncentives.map((incentive, index) => (
          <Card 
            key={index}
            className={`${
              incentive.urgent ? 'ring-2 ring-pravado-orange bg-gradient-to-br from-orange-50 to-red-50' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{incentive.title}</CardTitle>
                {incentive.urgent && (
                  <Badge className="bg-pravado-orange text-white animate-pulse">
                    Limited Time
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{incentive.description}</p>
              <div className="text-xl font-bold text-pravado-purple mb-4">{incentive.value}</div>
              <Button 
                className={`w-full ${
                  incentive.urgent 
                    ? 'bg-pravado-orange hover:bg-pravado-orange/90' 
                    : 'bg-pravado-purple hover:bg-pravado-purple/90'
                }`}
              >
                {incentive.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Urgency Indicators */}
      <Card className="bg-gradient-to-r from-pravado-crimson/10 to-pravado-orange/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Why Convert Now?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {urgencyFactors.map((factor, index) => (
              <div key={index} className="flex items-center space-x-3 text-center">
                <div className="w-10 h-10 bg-pravado-crimson rounded-full flex items-center justify-center mx-auto">
                  <factor.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{factor.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main CTA */}
      <Card className="bg-gradient-to-r from-pravado-purple to-pravado-crimson text-white">
        <CardContent className="p-8 text-center">
          <Zap className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Don't Lose This Momentum</h3>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            You've seen the results. Your team is productive. Your campaigns are performing. 
            Continue this success by converting to a full PRAVADO subscription.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{milestonesProgress.toFixed(0)}%</div>
              <div className="text-sm text-blue-100">Implementation Complete</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">+{Math.round((completedMilestones / milestones.length) * 45)}%</div>
              <div className="text-sm text-blue-100">Efficiency Gained</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg"
              className="bg-white text-pravado-purple hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Convert to Full Plan
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-pravado-purple px-8 py-4 text-lg font-semibold"
            >
              Talk to Success Team
            </Button>
          </div>
          
          <div className="mt-6 flex justify-center space-x-8 text-sm text-blue-100">
            <span>✓ Keep All Your Progress</span>
            <span>✓ Seamless Transition</span>
            <span>✓ Dedicated Support</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
