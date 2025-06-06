
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Users,
  Brain,
  Lightbulb,
  Eye,
  Plus,
  Filter
} from 'lucide-react';
import { useEnhancedSEOKeywords, useSEOCompetitors } from '@/hooks/useSEOData';

interface KeywordResearchDashboardProps {
  projectId: string | null;
  automateProgress: number;
}

export function KeywordResearchDashboard({ projectId, automateProgress }: KeywordResearchDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const { data: keywords = [] } = useEnhancedSEOKeywords(projectId || undefined);
  const { data: competitors = [] } = useSEOCompetitors(projectId || undefined);

  // Mock keyword research data
  const mockKeywords = [
    {
      id: 1,
      keyword: 'digital marketing strategy',
      search_volume: 8100,
      keyword_difficulty: 65,
      cpc: 4.25,
      opportunity_score: 85,
      trend_direction: 'up',
      automate_step: 'Target & Strategy',
      competition_level: 'medium',
      content_gap_score: 78
    },
    {
      id: 2,
      keyword: 'SEO optimization tools',
      search_volume: 5400,
      keyword_difficulty: 72,
      cpc: 6.80,
      opportunity_score: 92,
      trend_direction: 'up',
      automate_step: 'Target & Strategy',
      competition_level: 'high',
      content_gap_score: 85
    },
    {
      id: 3,
      keyword: 'content marketing automation',
      search_volume: 3200,
      keyword_difficulty: 58,
      cpc: 3.95,
      opportunity_score: 76,
      trend_direction: 'stable',
      automate_step: 'Target & Strategy',
      competition_level: 'medium',
      content_gap_score: 65
    }
  ];

  const mockCompetitorKeywords = [
    {
      keyword: 'marketing automation platform',
      competitor: 'competitor1.com',
      their_position: 3,
      our_position: null,
      search_volume: 12000,
      opportunity: 'high'
    },
    {
      keyword: 'email marketing software',
      competitor: 'competitor2.com',
      their_position: 5,
      our_position: 15,
      search_volume: 18500,
      opportunity: 'medium'
    }
  ];

  const filteredKeywords = mockKeywords.filter(keyword => {
    const matchesSearch = keyword.keyword.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'high-opportunity' && keyword.opportunity_score >= 80) ||
      (selectedFilter === 'low-competition' && keyword.keyword_difficulty <= 60) ||
      (selectedFilter === 'trending' && keyword.trend_direction === 'up');
    
    return matchesSearch && matchesFilter;
  });

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 40) return 'text-green-600';
    if (difficulty <= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AUTOMATE Integration Header */}
      <Card className="bg-gradient-to-r from-enterprise-blue/10 to-pravado-purple/10 border-l-4 border-l-enterprise-blue">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-enterprise-blue" />
              <div>
                <h3 className="font-semibold text-professional-gray">Target & Strategy: Keyword Research</h3>
                <p className="text-sm text-gray-600">Strategic keyword discovery and competitive analysis</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-enterprise-blue">{automateProgress}%</div>
              <div className="text-sm text-gray-600">AUTOMATE Progress</div>
            </div>
          </div>
          <Progress value={automateProgress} className="h-2 mt-3" />
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
          >
            All Keywords
          </Button>
          <Button
            variant={selectedFilter === 'high-opportunity' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('high-opportunity')}
          >
            High Opportunity
          </Button>
          <Button
            variant={selectedFilter === 'low-competition' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('low-competition')}
          >
            Low Competition
          </Button>
          <Button
            variant={selectedFilter === 'trending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('trending')}
          >
            Trending
          </Button>
        </div>
      </div>

      <Tabs defaultValue="research" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="research">Keyword Research</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Gap</TabsTrigger>
          <TabsTrigger value="clusters">Keyword Clusters</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-enterprise-blue" />
                  <span>Keyword Research Results</span>
                </CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Keywords
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredKeywords.map((keyword) => (
                  <div key={keyword.id} className="border rounded-lg p-4 hover:bg-soft-gray transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-professional-gray">{keyword.keyword}</h3>
                        {getTrendIcon(keyword.trend_direction)}
                        <Badge className="bg-enterprise-blue/10 text-enterprise-blue">
                          {keyword.automate_step}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm font-medium">Opportunity Score</div>
                          <div className="text-lg font-bold text-pravado-purple">{keyword.opportunity_score}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Search Volume</div>
                        <div className="font-medium">{keyword.search_volume.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Difficulty</div>
                        <div className={`font-medium ${getDifficultyColor(keyword.keyword_difficulty)}`}>
                          {keyword.keyword_difficulty}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">CPC</div>
                        <div className="font-medium">${keyword.cpc}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Competition</div>
                        <div className="font-medium capitalize">{keyword.competition_level}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Content Gap</div>
                        <div className="font-medium">{keyword.content_gap_score}%</div>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Analyze SERP
                      </Button>
                      <Button size="sm" variant="outline">
                        <Target className="w-4 h-4 mr-2" />
                        Track Keyword
                      </Button>
                      <Button size="sm">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Content Ideas
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-pravado-orange" />
                <span>Competitor Keyword Gap Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCompetitorKeywords.map((keyword, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-professional-gray">{keyword.keyword}</h3>
                      <Badge className={`${
                        keyword.opportunity === 'high' ? 'bg-red-100 text-red-800' :
                        keyword.opportunity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {keyword.opportunity} opportunity
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Competitor</div>
                        <div className="font-medium">{keyword.competitor}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Their Position</div>
                        <div className="font-medium text-pravado-orange">#{keyword.their_position}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Our Position</div>
                        <div className="font-medium">
                          {keyword.our_position ? `#${keyword.our_position}` : 'Not ranking'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Search Volume</div>
                        <div className="font-medium">{keyword.search_volume.toLocaleString()}</div>
                      </div>
                    </div>
                    <Button size="sm" className="mt-3">
                      <Target className="w-4 h-4 mr-2" />
                      Target This Keyword
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clusters" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-pravado-purple" />
                <span>Keyword Clustering Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">AI-Powered Keyword Clustering</h3>
                <p className="text-gray-500 mb-6">
                  Advanced keyword clustering will help you identify content themes and optimization opportunities
                </p>
                <Button>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Keyword Clusters
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-pravado-orange" />
                <span>Keyword Opportunities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Low-Hanging Fruit</h3>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    15 keywords with low competition and high opportunity scores
                  </p>
                  <Button size="sm" variant="outline">View Keywords</Button>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Content Gap Opportunities</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    8 high-volume keywords where competitors have weak content
                  </p>
                  <Button size="sm" variant="outline">Analyze Gaps</Button>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Long-Tail Opportunities</h3>
                  </div>
                  <p className="text-sm text-purple-700 mb-3">
                    23 long-tail keywords with commercial intent and low competition
                  </p>
                  <Button size="sm" variant="outline">Explore Long-Tail</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
