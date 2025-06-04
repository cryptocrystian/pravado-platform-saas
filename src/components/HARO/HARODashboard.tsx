
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHARORequests, useHAROMatches, useUserExpertiseProfile } from '@/hooks/useHARO';
import { HAROOpportunityCard } from './HAROOpportunityCard';
import { HAROResponseModal } from './HAROResponseModal';
import { ExpertiseProfileSetup } from './ExpertiseProfileSetup';
import { HAROAnalyticsCard } from './HAROAnalyticsCard';
import { Search, Filter, Brain, Target, Clock, TrendingUp } from 'lucide-react';
import { format, isAfter, differenceInHours } from 'date-fns';

export function HARODashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  const { data: haroRequests, isLoading: requestsLoading } = useHARORequests();
  const { data: haroMatches, isLoading: matchesLoading } = useHAROMatches();
  const { data: expertiseProfile } = useUserExpertiseProfile();

  const highConfidenceMatches = haroMatches?.filter(match => match.match_confidence >= 90) || [];
  const totalMatches = haroMatches?.length || 0;
  const submittedResponses = haroMatches?.filter(match => match.submitted).length || 0;
  const coverageSecured = haroMatches?.filter(match => match.coverage_secured).length || 0;

  const filteredRequests = haroRequests?.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) || [];

  const getUrgencyLevel = (deadline?: string) => {
    if (!deadline) return 'medium';
    const hoursUntilDeadline = differenceInHours(new Date(deadline), new Date());
    if (hoursUntilDeadline <= 12) return 'high';
    if (hoursUntilDeadline <= 24) return 'medium';
    return 'low';
  };

  if (!expertiseProfile) {
    return <ExpertiseProfileSetup />;
  }

  return (
    <div className="space-y-6">
      {/* HARO Intelligence Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-professional-gray mb-2">HARO Intelligence</h1>
          <p className="text-gray-600">AI-powered opportunity matching and response generation</p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <Badge variant="outline" className="bg-pravado-purple/10 text-pravado-purple border-pravado-purple">
            <Brain className="h-4 w-4 mr-1" />
            AI-Powered
          </Badge>
          <Button onClick={() => window.location.reload()}>
            <Target className="h-4 w-4 mr-2" />
            Refresh Opportunities
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <HAROAnalyticsCard
          title="High-Confidence Matches"
          value={highConfidenceMatches.length.toString()}
          icon={Target}
          description="90%+ match confidence"
          accentColor="#c3073f"
        />
        <HAROAnalyticsCard
          title="Total Opportunities"
          value={totalMatches.toString()}
          icon={Brain}
          description="AI-matched this month"
          accentColor="#6f2dbd"
        />
        <HAROAnalyticsCard
          title="Responses Submitted"
          value={submittedResponses.toString()}
          icon={Clock}
          description="Awaiting journalist replies"
          accentColor="#1e40af"
        />
        <HAROAnalyticsCard
          title="Coverage Secured"
          value={coverageSecured.toString()}
          icon={TrendingUp}
          description="Successful placements"
          accentColor="#059669"
        />
      </div>

      {/* Search and Filters */}
      <Card className="p-6 bg-white border border-border-gray">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search HARO opportunities by keywords, outlet, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Matches</SelectItem>
                <SelectItem value="high">90%+ Match</SelectItem>
                <SelectItem value="medium">70-89% Match</SelectItem>
                <SelectItem value="low">50-69% Match</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* HARO Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requestsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ))
        ) : (
          filteredRequests.map((request) => (
            <HAROOpportunityCard
              key={request.id}
              request={request}
              urgencyLevel={getUrgencyLevel(request.deadline)}
              onGenerateResponse={() => setSelectedRequest(request)}
            />
          ))
        )}
      </div>

      {/* Response Generation Modal */}
      {selectedRequest && (
        <HAROResponseModal
          request={selectedRequest}
          expertiseProfile={expertiseProfile}
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}
