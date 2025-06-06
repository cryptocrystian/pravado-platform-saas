
import React, { useState, useEffect } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Clock, AlertTriangle, BarChart3, FileText, Search, Cog, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAutomateMethodologyProgress, useUpdateStepProgress } from '@/hooks/useAutomateData';
import { useToast } from '@/hooks/use-toast';

const auditCategories = [
  {
    id: 'content_marketing',
    name: 'Content Marketing Audit',
    icon: FileText,
    color: 'bg-pravado-purple',
    subcategories: [
      {
        id: 'content_strategy',
        name: 'Content Strategy',
        questions: [
          'How well-defined is your content marketing strategy?',
          'How effectively are you targeting your audience with content?',
          'How consistent is your content publishing schedule?',
          'How well do you measure content performance?'
        ]
      },
      {
        id: 'content_quality',
        name: 'Content Quality & Production',
        questions: [
          'How high is the quality of your content?',
          'How efficient is your content production process?',
          'How well-optimized is your content for SEO?',
          'How engaging is your content for your audience?'
        ]
      }
    ]
  },
  {
    id: 'pr_media',
    name: 'PR & Media Audit',
    icon: BarChart3,
    color: 'bg-pravado-orange',
    subcategories: [
      {
        id: 'media_relations',
        name: 'Media Relations',
        questions: [
          'How strong are your media relationships?',
          'How effective is your press release distribution?',
          'How well do you manage crisis communications?',
          'How frequently do you get media coverage?'
        ]
      },
      {
        id: 'brand_reputation',
        name: 'Brand Reputation',
        questions: [
          'How positive is your online brand reputation?',
          'How well do you monitor brand mentions?',
          'How effectively do you respond to negative feedback?',
          'How consistent is your brand messaging across channels?'
        ]
      }
    ]
  },
  {
    id: 'seo_performance',
    name: 'SEO Performance Audit',
    icon: Search,
    color: 'bg-enterprise-blue',
    subcategories: [
      {
        id: 'technical_seo',
        name: 'Technical SEO',
        questions: [
          'How well-optimized is your website technically?',
          'How fast does your website load?',
          'How mobile-friendly is your website?',
          'How well-structured is your website architecture?'
        ]
      },
      {
        id: 'keyword_strategy',
        name: 'Keyword Strategy',
        questions: [
          'How well-researched are your target keywords?',
          'How effectively are you ranking for target keywords?',
          'How comprehensive is your keyword coverage?',
          'How well do you track keyword performance?'
        ]
      }
    ]
  },
  {
    id: 'tech_stack',
    name: 'Technology Stack Assessment',
    icon: Cog,
    color: 'bg-pravado-crimson',
    subcategories: [
      {
        id: 'marketing_tools',
        name: 'Marketing Tools & Platforms',
        questions: [
          'How well-integrated are your marketing tools?',
          'How effectively do you use marketing automation?',
          'How comprehensive is your analytics setup?',
          'How well do your tools support your workflow?'
        ]
      },
      {
        id: 'data_management',
        name: 'Data Management',
        questions: [
          'How well do you collect and organize data?',
          'How effectively do you analyze marketing data?',
          'How well do you protect customer data?',
          'How actionable are your data insights?'
        ]
      }
    ]
  }
];

export default function AssessAudit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: progressData } = useAutomateMethodologyProgress();
  const updateProgress = useUpdateStepProgress();

  const [scores, setScores] = useState<{[key: string]: number}>({});
  const [notes, setNotes] = useState<{[key: string]: string}>({});
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  // Find the Assess & Audit step data
  const assessAuditStep = progressData?.find(step => step.step_code === 'A' && step.step_index === 0);

  useEffect(() => {
    if (assessAuditStep?.audit_scores) {
      setScores(assessAuditStep.audit_scores as {[key: string]: number});
    }
  }, [assessAuditStep]);

  const handleScoreChange = (questionId: string, score: number) => {
    setScores(prev => ({ ...prev, [questionId]: score }));
  };

  const handleNotesChange = (questionId: string, note: string) => {
    setNotes(prev => ({ ...prev, [questionId]: note }));
  };

  const calculateCategoryScore = (categoryId: string) => {
    const category = auditCategories.find(c => c.id === categoryId);
    if (!category) return 0;

    let totalScore = 0;
    let questionCount = 0;

    category.subcategories.forEach(sub => {
      sub.questions.forEach((_, qIndex) => {
        const questionId = `${categoryId}_${sub.id}_${qIndex}`;
        if (scores[questionId]) {
          totalScore += scores[questionId];
          questionCount++;
        }
      });
    });

    return questionCount > 0 ? Math.round((totalScore / questionCount) * 10) : 0;
  };

  const calculateOverallScore = () => {
    const categoryScores = auditCategories.map(cat => calculateCategoryScore(cat.id));
    const validScores = categoryScores.filter(score => score > 0);
    return validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
  };

  const generateActionItems = () => {
    const actionItems: any[] = [];
    
    auditCategories.forEach(category => {
      const categoryScore = calculateCategoryScore(category.id);
      
      if (categoryScore < 60) {
        actionItems.push({
          category: category.name,
          priority: categoryScore < 40 ? 'critical' : 'high',
          action: `Improve ${category.name.toLowerCase()} - current score: ${categoryScore}%`,
          impact: 'High impact on overall marketing effectiveness'
        });
      }
      
      category.subcategories.forEach(sub => {
        let subScore = 0;
        let subQuestionCount = 0;
        
        sub.questions.forEach((_, qIndex) => {
          const questionId = `${category.id}_${sub.id}_${qIndex}`;
          if (scores[questionId]) {
            subScore += scores[questionId];
            subQuestionCount++;
          }
        });
        
        const avgSubScore = subQuestionCount > 0 ? (subScore / subQuestionCount) * 10 : 0;
        
        if (avgSubScore < 50 && avgSubScore > 0) {
          actionItems.push({
            category: category.name,
            subcategory: sub.name,
            priority: avgSubScore < 30 ? 'critical' : 'medium',
            action: `Focus on improving ${sub.name.toLowerCase()}`,
            impact: 'Medium impact on category performance'
          });
        }
      });
    });
    
    return actionItems;
  };

  const handleSaveProgress = async () => {
    if (!assessAuditStep?.id) {
      toast({
        title: "Error",
        description: "No step data found. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    const overallScore = calculateOverallScore();
    const actionItems = generateActionItems();

    try {
      await updateProgress.mutateAsync({
        stepId: assessAuditStep.id,
        completion: overallScore,
        scores: scores,
        actionItems: actionItems
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const overallScore = calculateOverallScore();

  return (
    <BaseLayout title="Assess & Audit" breadcrumb="AUTOMATE Methodology > Step 1">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-pravado-purple to-pravado-crimson rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold">A</span>
                </div>
                <Badge className="bg-white/20 text-white border-white/30">Step 1 of 8</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">Assess & Audit</h1>
              <p className="text-lg text-blue-100">
                Comprehensive analysis of your current marketing infrastructure and performance
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{overallScore}%</div>
              <div className="text-sm text-blue-100">Current Score</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/automate')}
            className="text-pravado-purple border-pravado-purple hover:bg-pravado-purple hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleSaveProgress}
              disabled={updateProgress.isPending}
              className="bg-pravado-purple hover:bg-pravado-purple/90 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateProgress.isPending ? 'Saving...' : 'Save Progress'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/automate/understand-audience')}
              className="text-pravado-purple border-pravado-purple hover:bg-pravado-purple hover:text-white"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {auditCategories.map((category) => {
            const Icon = category.icon;
            const categoryScore = calculateCategoryScore(category.id);
            
            return (
              <Card key={category.id} className="bg-white hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setCurrentStep(currentStep === category.id ? null : category.id)}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${category.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={getScoreBadgeColor(categoryScore)}>
                      {categoryScore}%
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-professional-gray">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={categoryScore} className="h-2" />
                  <p className="text-sm text-professional-gray mt-2">
                    {categoryScore >= 80 ? 'Excellent' : categoryScore >= 60 ? 'Good' : categoryScore >= 40 ? 'Needs Improvement' : 'Critical'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Assessment */}
        <div className="space-y-6">
          {auditCategories.map((category) => {
            const Icon = category.icon;
            const isExpanded = currentStep === category.id;
            
            return (
              <Card key={category.id} className="bg-white">
                <CardHeader 
                  className="cursor-pointer hover:bg-soft-gray transition-colors"
                  onClick={() => setCurrentStep(isExpanded ? null : category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${category.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-professional-gray">{category.name}</CardTitle>
                        <p className="text-sm text-professional-gray">
                          Score: <span className={getScoreColor(calculateCategoryScore(category.id))}>
                            {calculateCategoryScore(category.id)}%
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getScoreBadgeColor(calculateCategoryScore(category.id))}>
                        {calculateCategoryScore(category.id)}%
                      </Badge>
                      <Button variant="ghost" size="sm">
                        {isExpanded ? '−' : '+'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="space-y-6">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="space-y-4">
                        <h4 className="text-lg font-semibold text-professional-gray border-b pb-2">
                          {subcategory.name}
                        </h4>
                        
                        <div className="grid gap-4">
                          {subcategory.questions.map((question, qIndex) => {
                            const questionId = `${category.id}_${subcategory.id}_${qIndex}`;
                            const currentScore = scores[questionId] || 0;
                            
                            return (
                              <div key={qIndex} className="p-4 bg-soft-gray rounded-lg space-y-3">
                                <p className="font-medium text-professional-gray">{question}</p>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-professional-gray">Score (1-10)</span>
                                    <span className={`font-medium ${getScoreColor(currentScore * 10)}`}>
                                      {currentScore}/10
                                    </span>
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                                      <button
                                        key={score}
                                        onClick={() => handleScoreChange(questionId, score)}
                                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                                          currentScore >= score
                                            ? 'bg-pravado-purple text-white'
                                            : 'bg-white border border-gray-300 text-professional-gray hover:bg-gray-50'
                                        }`}
                                      >
                                        {score}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                
                                <Textarea
                                  placeholder="Add notes about this area..."
                                  value={notes[questionId] || ''}
                                  onChange={(e) => handleNotesChange(questionId, e.target.value)}
                                  className="mt-2"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Action Items Summary */}
        {overallScore > 0 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-professional-gray flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-pravado-orange" />
                Generated Action Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generateActionItems().slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-professional-gray">{item.action}</p>
                      <p className="text-sm text-professional-gray">{item.impact}</p>
                    </div>
                    <Badge className={
                      item.priority === 'critical' ? 'bg-red-100 text-red-800 border-red-200' :
                      item.priority === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                      'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }>
                      {item.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </BaseLayout>
  );
}
