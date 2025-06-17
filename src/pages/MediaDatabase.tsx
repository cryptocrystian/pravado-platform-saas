
import React, { useState } from 'react';
import { BaseLayout } from '@/components/BaseLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJournalistContacts } from '@/hooks/useJournalists';
import { ContactDetailModal } from '@/components/media/ContactDetailModal';
import { AddContactModal } from '@/components/media/AddContactModal';
import { MediaDatabaseFilters } from '@/components/media/MediaDatabaseFilters';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  Upload,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  TrendingUp
} from 'lucide-react';

const MediaDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    outlet: '',
    beat: '',
    location: '',
    relationshipScore: 'all'
  });

  const { data: contacts, isLoading } = useJournalistContacts();

  // Filter contacts based on search and filters
  const filteredContacts = contacts?.filter(contact => {
    const matchesSearch = !searchTerm || 
      `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.outlet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.beat.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOutlet = !filters.outlet || contact.outlet.toLowerCase().includes(filters.outlet.toLowerCase());
    const matchesBeat = !filters.beat || contact.beat.toLowerCase().includes(filters.beat.toLowerCase());
    const matchesLocation = !filters.location || contact.location?.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesScore = filters.relationshipScore === 'all' || 
      (filters.relationshipScore === 'high' && contact.relationship_score >= 80) ||
      (filters.relationshipScore === 'medium' && contact.relationship_score >= 40 && contact.relationship_score < 80) ||
      (filters.relationshipScore === 'low' && contact.relationship_score < 40);

    return matchesSearch && matchesOutlet && matchesBeat && matchesLocation && matchesScore;
  }) || [];

  const getRelationshipColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const ContactCard = ({ contact }) => (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setSelectedContact(contact)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-enterprise-blue text-white">
              {contact.first_name[0]}{contact.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-professional-gray">
              {contact.first_name} {contact.last_name}
            </h3>
            <p className="text-sm text-gray-600">{contact.title}</p>
          </div>
        </div>
        <Badge className={`text-xs ${getRelationshipColor(contact.relationship_score)}`}>
          {contact.relationship_score}/100
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <TrendingUp className="h-4 w-4 mr-2" />
          {contact.outlet}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Star className="h-4 w-4 mr-2" />
          {contact.beat}
        </div>
        {contact.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {contact.location}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border-gray">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Mail className="h-4 w-4" />
          </Button>
          {contact.phone && (
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {contact.interaction_count} interactions
        </div>
      </div>
    </Card>
  );

  const ContactListItem = ({ contact }) => (
    <Card 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedContact(contact)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-enterprise-blue text-white">
              {contact.first_name[0]}{contact.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="font-medium text-professional-gray">
                  {contact.first_name} {contact.last_name}
                </h4>
                <p className="text-sm text-gray-600">{contact.title}</p>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{contact.outlet}</p>
                <p className="text-xs text-gray-600">{contact.beat}</p>
              </div>
              {contact.location && (
                <div className="hidden lg:block">
                  <p className="text-sm text-gray-600">{contact.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={`text-xs ${getRelationshipColor(contact.relationship_score)}`}>
            {contact.relationship_score}/100
          </Badge>
          <div className="text-xs text-gray-500">
            {contact.interaction_count} interactions
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <BaseLayout title="Media Database" breadcrumb="Media Database">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-professional-gray mb-2">Media Database</h1>
              <p className="text-gray-600">Manage your journalist contacts and media relationships</p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-border-gray p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search contacts, outlets, beats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? 'bg-soft-gray' : ''}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div className="border-l border-border-gray pl-2 flex items-center space-x-1">
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
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <MediaDatabaseFilters 
              filters={filters}
              onFiltersChange={setFilters}
              contacts={contacts || []}
            />
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-professional-gray">{filteredContacts.length}</p>
                </div>
                <div className="w-10 h-10 bg-enterprise-blue rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High Value</p>
                  <p className="text-2xl font-bold text-professional-gray">
                    {filteredContacts.filter(c => c.relationship_score >= 80).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active This Month</p>
                  <p className="text-2xl font-bold text-professional-gray">
                    {filteredContacts.filter(c => c.last_contacted && 
                      new Date(c.last_contacted) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-pravado-orange rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold text-professional-gray">
                    {filteredContacts.length > 0 ? 
                      Math.round(filteredContacts.reduce((sum, c) => sum + c.relationship_score, 0) / filteredContacts.length) : 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-pravado-purple rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Contacts Display */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-enterprise-blue mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading contacts...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <Card className="p-12 text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-professional-gray mb-2">No contacts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || Object.values(filters).some(f => f && f !== 'all') 
                  ? 'Try adjusting your search or filters'
                  : 'Start building your media database by adding journalist contacts'
                }
              </p>
              {!searchTerm && !Object.values(filters).some(f => f && f !== 'all') && (
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Contact
                </Button>
              )}
            </Card>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {filteredContacts.map((contact) => 
                viewMode === 'grid' 
                  ? <ContactCard key={contact.id} contact={contact} />
                  : <ContactListItem key={contact.id} contact={contact} />
              )}
            </div>
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
