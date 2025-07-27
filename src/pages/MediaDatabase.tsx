import React, { useState, useMemo } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useJournalistContacts, useJournalistAnalytics, JournalistFilters } from '@/hooks/useJournalists';
import { JournalistCard } from '@/components/pr/JournalistCard';
import { ContactDetailModal } from '@/components/media/ContactDetailModal';
import { AddContactModal } from '@/components/media/AddContactModal';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  Upload,
  Settings,
  TrendingUp,
  Users,
  Award,
  Calendar,
  Sparkles,
  BarChart3,
  Target,
  Globe,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BookOpen,
  Clock,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const MediaDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(24);

  const [filters, setFilters] = useState<JournalistFilters>({
    searchTerm: '',
    verificationStatus: undefined,
    mediaCategory: undefined,
    dynamicTier: undefined,
    beatExpertiseLevel: undefined,
    minRelationshipScore: undefined,
    maxRelationshipScore: undefined,
    minAuthorityScore: undefined,
    maxAuthorityScore: undefined,
    sortBy: 'relationship_score',
    sortOrder: 'desc',
    hasRecentInteraction: false
  });

  const activeFilters = useMemo(() => ({
    ...filters,
    searchTerm: searchTerm
  }), [filters, searchTerm]);

  const { data: contacts, isLoading } = useJournalistContacts(activeFilters);
  const analyticsData = useJournalistAnalytics(activeFilters);

  const paginatedContacts = useMemo(() => {
    if (!contacts) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return contacts.slice(startIndex, startIndex + itemsPerPage);
  }, [contacts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil((contacts?.length || 0) / itemsPerPage);

  const handleContactSelect = (contactId: string, selected: boolean) => {
    if (selected) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts?.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts?.map(c => c.id) || []);
    }
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      verificationStatus: undefined,
      mediaCategory: undefined,
      dynamicTier: undefined,
      beatExpertiseLevel: undefined,
      minRelationshipScore: undefined,
      maxRelationshipScore: undefined,
      minAuthorityScore: undefined,
      maxAuthorityScore: undefined,
      sortBy: 'relationship_score',
      sortOrder: 'desc',
      hasRecentInteraction: false
    });
    setSearchTerm('');
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'top-tier':
        setFilters(prev => ({
          ...prev,
          dynamicTier: 'platinum',
          verificationStatus: 'verified',
          minRelationshipScore: 80
        }));
        break;
      case 'needs-verification':
        setFilters(prev => ({
          ...prev,
          verificationStatus: 'unverified',
          sortBy: 'authority_score',
          sortOrder: 'desc'
        }));
        break;
      case 'recent-contacts':
        setFilters(prev => ({
          ...prev,
          hasRecentInteraction: true,
          sortBy: 'last_contacted',
          sortOrder: 'desc'
        }));
        break;
      default:
        clearFilters();
    }
  };

  const AnalyticsCard = ({ title, value, change, icon: Icon, color = "blue" }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}% from last month
              </p>
            )}
          </div>
          <div className={`w-10 h-10 bg-${color}-500 rounded-lg flex items-center justify-center`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const FilterPanel = () => (
    <div className="space-y-6 p-6 bg-white border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Advanced Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Verification Status</label>
          <Select
            value={filters.verificationStatus || ''}
            onValueChange={(value) => setFilters(prev => ({ 
              ...prev, 
              verificationStatus: value as any || undefined 
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="needs_review">Needs Review</SelectItem>
              <SelectItem value="invalid">Invalid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Media Category</label>
          <Select
            value={filters.mediaCategory || ''}
            onValueChange={(value) => setFilters(prev => ({ 
              ...prev, 
              mediaCategory: value || undefined 
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              <SelectItem value="traditional_media">Traditional Media</SelectItem>
              <SelectItem value="digital_first">Digital First</SelectItem>
              <SelectItem value="podcast_audio">Podcast/Audio</SelectItem>
              <SelectItem value="creator_economy">Creator Economy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tier Classification</label>
          <Select
            value={filters.dynamicTier || ''}
            onValueChange={(value) => setFilters(prev => ({ 
              ...prev, 
              dynamicTier: value || undefined 
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All tiers</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Beat Expertise</label>
          <Select
            value={filters.beatExpertiseLevel || ''}
            onValueChange={(value) => setFilters(prev => ({ 
              ...prev, 
              beatExpertiseLevel: value as any || undefined 
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All levels</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="occasional">Occasional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Relationship Score: {filters.minRelationshipScore || 0} - {filters.maxRelationshipScore || 100}
          </label>
          <div className="px-2">
            <Slider
              value={[filters.minRelationshipScore || 0, filters.maxRelationshipScore || 100]}
              onValueChange={([min, max]) => setFilters(prev => ({
                ...prev,
                minRelationshipScore: min,
                maxRelationshipScore: max
              }))}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">
            Authority Score: {filters.minAuthorityScore || 0} - {filters.maxAuthorityScore || 100}
          </label>
          <div className="px-2">
            <Slider
              value={[filters.minAuthorityScore || 0, filters.maxAuthorityScore || 100]}
              onValueChange={([min, max]) => setFilters(prev => ({
                ...prev,
                minAuthorityScore: min,
                maxAuthorityScore: max
              }))}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="recent-interaction"
          checked={filters.hasRecentInteraction}
          onCheckedChange={(checked) => setFilters(prev => ({
            ...prev,
            hasRecentInteraction: checked as boolean
          }))}
        />
        <label
          htmlFor="recent-interaction"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Has recent interaction (last 30 days)
        </label>
      </div>
    </div>
  );

  const PresetButtons = () => (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => applyPreset('top-tier')}
      >
        <Sparkles className="h-4 w-4 mr-1" />
        Top Tier Only
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => applyPreset('needs-verification')}
      >
        <Shield className="h-4 w-4 mr-1" />
        Needs Verification
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => applyPreset('recent-contacts')}
      >
        <Clock className="h-4 w-4 mr-1" />
        Recent Contacts
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={clearFilters}
      >
        All Contacts
      </Button>
    </div>
  );

  return (
    <BaseLayout title="Media Database" breadcrumb="Media Database">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">AI-Powered Media Database</h1>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Enhanced
                </Badge>
              </div>
              <p className="text-gray-600">
                Intelligent journalist contact management with AI relationship scoring and tier classification
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export ({selectedContacts.length || contacts?.length || 0})
              </Button>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>

          {/* AI Analytics Summary */}
          {analyticsData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <AnalyticsCard
                title="Total Contacts"
                value={analyticsData.totalContacts.toLocaleString()}
                icon={Users}
                color="blue"
              />
              <AnalyticsCard
                title="Verified Contacts"
                value={`${analyticsData.verifiedContacts}/${analyticsData.totalContacts}`}
                icon={CheckCircle2}
                color="green"
              />
              <AnalyticsCard
                title="Avg Relationship Score"
                value={Math.round(analyticsData.averageRelationshipScore)}
                icon={TrendingUp}
                color="purple"
              />
              <AnalyticsCard
                title="Success Rate"
                value={`${Math.round(analyticsData.successfulPitchRate * 100)}%`}
                icon={Target}
                color="orange"
              />
            </div>
          )}

          {/* Search and Quick Actions */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search journalists, outlets, beats, expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onValueChange={(value) => {
                      const [sortBy, sortOrder] = value.split('-');
                      setFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder: sortOrder as any }));
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relationship_score-desc">Relationship Score (High)</SelectItem>
                      <SelectItem value="relationship_score-asc">Relationship Score (Low)</SelectItem>
                      <SelectItem value="authority_score-desc">Authority Score (High)</SelectItem>
                      <SelectItem value="authority_score-asc">Authority Score (Low)</SelectItem>
                      <SelectItem value="last_contacted-desc">Recently Contacted</SelectItem>
                      <SelectItem value="engagement_rate-desc">Engagement Rate</SelectItem>
                      <SelectItem value="response_rate-desc">Response Rate</SelectItem>
                    </SelectContent>
                  </Select>

                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Advanced Filters
                        {Object.values(filters).some(v => v !== undefined && v !== '' && v !== false) && (
                          <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                            Active
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Advanced Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterPanel />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div className="border-l border-gray-200 pl-2 flex items-center space-x-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filter Presets */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <PresetButtons />
                
                {selectedContacts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {selectedContacts.length} selected
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Bulk Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Export Selected
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contacts Display */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-2 w-3/4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : !contacts || contacts.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || Object.values(filters).some(f => f !== undefined && f !== '' && f !== false)
                  ? 'Try adjusting your search criteria or filters'
                  : 'Start building your AI-powered media database by adding journalist contacts'
                }
              </p>
              {!searchTerm && !Object.values(filters).some(f => f !== undefined && f !== '' && f !== false) && (
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Contact
                </Button>
              )}
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Showing {paginatedContacts.length} of {contacts.length} contacts</span>
                  {contacts.length > itemsPerPage && (
                    <span>• Page {currentPage} of {totalPages}</span>
                  )}
                </div>
                {contacts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedContacts.length === contacts.length}
                      onCheckedChange={handleSelectAll}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Select all visible</span>
                  </div>
                )}
              </div>

              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {paginatedContacts.map((contact) => (
                  <div key={contact.id} className="relative">
                    {viewMode === 'grid' && (
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={(checked) => handleContactSelect(contact.id, checked as boolean)}
                        className="absolute top-4 left-4 z-10 bg-white"
                      />
                    )}
                    <JournalistCard
                      journalist={contact}
                      onContact={(method) => console.log(`Contact ${contact.first_name} via ${method}`)}
                      onViewDetails={() => setSelectedContact(contact)}
                      className={selectedContacts.includes(contact.id) ? 'ring-2 ring-blue-500' : ''}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + Math.max(1, currentPage - 2);
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Modals */}
          {selectedContact && (
            <ContactDetailModal
              contact={selectedContact}
              isOpen={!!selectedContact}
              onClose={() => setSelectedContact(null)}
            />
          )}

          {showAddModal && (
            <AddContactModal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
            />
          )}
        </div>
      </div>
    </BaseLayout>
  );
};

export default MediaDatabase;