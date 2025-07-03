
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  Target, 
  Plus, 
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
  Brain
} from 'lucide-react';
import { useEnhancedSEOKeywords } from '@/hooks/useSEOData';
import { useKeywordSuggestions } from '@/hooks/useSEOKeywords';

interface KeywordResearchDashboardProps {
  projectId?: string | null;
  automateProgress: number;
}

export function KeywordResearchDashboard({ projectId, automateProgress }: KeywordResearchDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: keywords = [] } = useEnhancedSEOKeywords(projectId || undefined);
  const { data: keywordOpportunities = [], isLoading: opportunitiesLoading } = useKeywordSuggestions(projectId || undefined);

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'text-green-600';
    if (difficulty < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 30) return 'Easy';
    if (difficulty < 60) return 'Medium';
    return 'Hard';
  };

  const getOpportunityColor = (opportunity: number) => {
    if (opportunity > 80) return 'text-green-600';
    if (opportunity > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPositionChange = () => {
    const changes = [1, -2, 3, 0, -1];
    return changes[Math.floor(Math.random() * changes.length)];
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header with AUTOMATE Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-professional-gray">Keyword Research & Tracking</h2>
          <p className="text-gray-600">Target & Strategy methodology for keyword optimization</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-pravado-purple" />
            <span className="text-sm text-pravado-purple font-medium">
              Target & Strategy: {automateProgress}%
            </span>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Keywords
          </Button>
        </div>
      </div>

      {/* AUTOMATE Progress */}
      <Card className="bg-gradient-to-r from-pravado-purple/10 to-enterprise-blue/10 border-l-4 border-l-pravado-purple">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-professional-gray">Target & Strategy Progress</span>
            <span className="text-sm text-pravado-purple font-bold">{automateProgress}%</span>
          </div>
          <Progress value={automateProgress} className="h-2 mb-2" />
          <div className="text-xs text-gray-600">
            Keyword research and targeting strategy within AUTOMATE methodology
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Target className="h-8 w-8 text-enterprise-blue" />
              <div className="text-2xl font-bold text-enterprise-blue">{keywords.length}</div>
            </div>
            <h3 className="text-lg font-semibold text-professional-gray mt-2">Tracked Keywords</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-pravado-orange" />
              <div className="text-2xl font-bold text-pravado-orange">23</div>
            </div>
            <h3 className="text-lg font-semibold text-professional-gray mt-2">Avg. Position</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <BarChart3 className="h-8 w-8 text-pravado-purple" />
              <div className="text-2xl font-bold text-pravado-purple">8</div>
            </div>
            <h3 className="text-lg font-semibold text-professional-gray mt-2">Top 10 Rankings</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Search className="h-8 w-8 text-green-600" />
              <div className="text-2xl font-bold text-green-600">145K</div>
            </div>
            <h3 className="text-lg font-semibold text-professional-gray mt-2">Est. Traffic</h3>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tracked" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tracked">Tracked Keywords</TabsTrigger>
          <TabsTrigger value="research">Keyword Research</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="tracked" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywords.length > 0 ? (
                  keywords.map((keyword) => (
                    <div key={keyword.id} className="flex items-center justify-between p-4 bg-soft-gray rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-professional-gray">{keyword.keyword}</div>
                        <div className="text-sm text-gray-600">
                          Volume: {keyword.search_volume || 0} | CPC: ${keyword.cpc || '0.00'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-bold text-lg">{keyword.ranking_position || '-'}</div>
                          <div className="text-xs text-gray-600">Position</div>
                        </div>
                        <div className="flex items-center">
                          {getChangeIcon(getPositionChange())}
                        </div>
                        <Badge className={getDifficultyColor(30)}>
                          {getDifficultyLabel(30)}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No keywords tracked yet. Add keywords to start monitoring your rankings.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Research Tool</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter seed keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    Research
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {opportunitiesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-enterprise-blue mx-auto mb-4"></div>
                      <p className="text-gray-500">Finding keyword opportunities...</p>
                    </div>
                  ) : keywordOpportunities.length === 0 ? (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No keyword opportunities found</h4>
                      <p className="text-gray-500">Start by adding seed keywords to generate opportunities.</p>
                    </div>
                  ) : (
                    keywordOpportunities.map((kw, index) => (
                      <div key={kw.id || index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-soft-gray transition-colors">
                        <div className="flex-1">
                          <div className="font-medium text-professional-gray">{kw.keyword}</div>
                          <div className="text-sm text-gray-600">
                            Monthly Volume: {kw.search_volume?.toLocaleString() || 'N/A'} | CPC: ${kw.cpc?.toFixed(2) || 'N/A'}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className={`font-bold ${getDifficultyColor(kw.keyword_difficulty || 0)}`}>{kw.keyword_difficulty || 0}</div>
                            <div className="text-xs text-gray-600">Difficulty</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-bold ${getOpportunityColor(kw.opportunity_score || 0)}`}>{kw.opportunity_score || 0}</div>
                            <div className="text-xs text-gray-600">Opportunity</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3 mr-1" />
                          Track
                        </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Quick Wins</h4>
                      <p className="text-sm text-green-700 mb-2">Keywords ranking 11-20 that could reach top 10</p>
                      <div className="text-2xl font-bold text-green-800">12</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Growth Opportunities</h4>
                      <p className="text-sm text-blue-700 mb-2">High-volume keywords with potential</p>
                      <div className="text-2xl font-bold text-blue-800">8</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-3">
                  {opportunitiesLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Loading quick wins...</p>
                    </div>
                  ) : keywordOpportunities.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No quick wins available yet</p>
                    </div>
                  ) : (
                    keywordOpportunities
                      .filter(kw => (kw.opportunity_score || 0) >= 80)
                      .slice(0, 3)
                      .map((kw, index) => (
                        <div key={kw.id || index} className="p-4 border border-green-200 rounded-lg bg-green-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-professional-gray">{kw.keyword}</div>
                              <div className="text-sm text-gray-600">
                                Opportunity Score: <span className="font-bold text-green-600">{kw.opportunity_score || 0}</span>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Quick Win</Badge>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
