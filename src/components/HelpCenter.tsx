
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  BookOpen, 
  Video, 
  HelpCircle, 
  FileText, 
  Star,
  ChevronRight,
  PlayCircle,
  Clock,
  Users
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  readTime: number;
  popularity: number;
  lastUpdated: string;
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const helpArticles: Article[] = [
  {
    id: '1',
    title: 'Getting Started with PRAVADO',
    category: 'Getting Started',
    content: 'Learn the basics of setting up your PRAVADO account and understanding the AUTOMATE methodology.',
    tags: ['setup', 'basics', 'automate'],
    readTime: 5,
    popularity: 95,
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'AUTOMATE Methodology Overview',
    category: 'Methodology',
    content: 'Deep dive into the 7-step AUTOMATE process for systematic marketing success.',
    tags: ['automate', 'methodology', 'process'],
    readTime: 8,
    popularity: 88,
    lastUpdated: '2024-01-10'
  },
  {
    id: '3',
    title: 'Campaign Creation Best Practices',
    category: 'Campaigns',
    content: 'Learn how to create effective marketing campaigns using PRAVADO\'s tools.',
    tags: ['campaigns', 'best practices', 'marketing'],
    readTime: 6,
    popularity: 82,
    lastUpdated: '2024-01-12'
  },
  {
    id: '4',
    title: 'Analytics Dashboard Guide',
    category: 'Analytics',
    content: 'Understanding your marketing performance through PRAVADO\'s analytics.',
    tags: ['analytics', 'dashboard', 'metrics'],
    readTime: 7,
    popularity: 76,
    lastUpdated: '2024-01-08'
  },
  {
    id: '5',
    title: 'Team Collaboration Features',
    category: 'Collaboration',
    content: 'How to effectively collaborate with your team using PRAVADO.',
    tags: ['team', 'collaboration', 'sharing'],
    readTime: 4,
    popularity: 71,
    lastUpdated: '2024-01-05'
  }
];

const videoTutorials: VideoTutorial[] = [
  {
    id: '1',
    title: 'PRAVADO Platform Overview',
    description: 'Complete walkthrough of the PRAVADO platform and its key features',
    duration: '12:34',
    category: 'Getting Started',
    thumbnail: '/placeholder.svg',
    difficulty: 'Beginner'
  },
  {
    id: '2',
    title: 'Setting Up Your First Campaign',
    description: 'Step-by-step guide to creating your first marketing campaign',
    duration: '8:45',
    category: 'Campaigns',
    thumbnail: '/placeholder.svg',
    difficulty: 'Beginner'
  },
  {
    id: '3',
    title: 'Advanced Analytics and Reporting',
    description: 'Deep dive into analytics features and custom reporting',
    duration: '15:22',
    category: 'Analytics',
    thumbnail: '/placeholder.svg',
    difficulty: 'Advanced'
  },
  {
    id: '4',
    title: 'AUTOMATE Methodology in Practice',
    description: 'Real-world implementation of the AUTOMATE methodology',
    duration: '18:15',
    category: 'Methodology',
    thumbnail: '/placeholder.svg',
    difficulty: 'Intermediate'
  }
];

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I get started with PRAVADO?',
    answer: 'Start by completing the onboarding flow, then follow our 30-day quick start guide to implement the AUTOMATE methodology.',
    category: 'Getting Started'
  },
  {
    id: '2',
    question: 'What is the AUTOMATE methodology?',
    answer: 'AUTOMATE is our 7-step systematic approach to marketing: Assess, Understand, Target, Optimize, Measure, Accelerate, Transform, and Execute.',
    category: 'Methodology'
  },
  {
    id: '3',
    question: 'Can I integrate PRAVADO with other tools?',
    answer: 'Yes, PRAVADO integrates with popular tools like CRM systems, email platforms, and analytics tools. Check our integrations page for the full list.',
    category: 'Integrations'
  },
  {
    id: '4',
    question: 'How do I invite team members?',
    answer: 'Go to Settings > Team Management and click "Invite Team Member". You can set different permission levels for each user.',
    category: 'Team Management'
  },
  {
    id: '5',
    question: 'What support options are available?',
    answer: 'We offer email support, live chat during business hours, and comprehensive documentation. Premium plans include phone support.',
    category: 'Support'
  }
];

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredArticles = useMemo(() => {
    return helpArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredVideos = useMemo(() => {
    return videoTutorials.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ['all', 'Getting Started', 'Methodology', 'Campaigns', 'Analytics', 'Collaboration', 'Integrations', 'Team Management', 'Support'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-professional-gray">Help Center</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers, learn best practices, and master the PRAVADO platform with our comprehensive documentation.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search articles, videos, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-lg h-12"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="articles" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Articles</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center space-x-2">
            <Video className="w-4 h-4" />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4" />
            <span>FAQs</span>
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Guides</span>
          </TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No articles found matching your search.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map(article => (
                <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="mb-2">{article.category}</Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{article.popularity}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{article.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime} min read</span>
                        </div>
                        <span>Updated {article.lastUpdated}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          {filteredVideos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No videos found matching your search.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredVideos.map(video => (
                <Card key={video.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-t-lg">
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                    <Badge className={`absolute top-2 right-2 ${getDifficultyColor(video.difficulty)}`}>
                      {video.difficulty}
                    </Badge>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{video.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No FAQs found matching your search.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible>
                  {filteredFAQs.map(faq => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="text-xs">{faq.category}</Badge>
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Guides Tab */}
        <TabsContent value="guides">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'AUTOMATE Methodology Guide',
                description: 'Complete implementation guide for the 7-step AUTOMATE process',
                icon: <FileText className="w-8 h-8 text-pravado-purple" />,
                readTime: '25 min',
                difficulty: 'Intermediate'
              },
              {
                title: 'Campaign Planning Workbook',
                description: 'Step-by-step workbook for planning effective marketing campaigns',
                icon: <BookOpen className="w-8 h-8 text-pravado-orange" />,
                readTime: '15 min',
                difficulty: 'Beginner'
              },
              {
                title: 'Analytics Setup Guide',
                description: 'Configure tracking and measurement for maximum insights',
                icon: <Users className="w-8 h-8 text-enterprise-blue" />,
                readTime: '20 min',
                difficulty: 'Advanced'
              }
            ].map((guide, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    {guide.icon}
                    <Badge className={getDifficultyColor(guide.difficulty)}>
                      {guide.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{guide.readTime}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Contact Support */}
      <Card className="bg-soft-gray border-pravado-purple/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline">
              Contact Support
            </Button>
            <Button className="bg-pravado-purple hover:bg-pravado-purple/90">
              Schedule a Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
