
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface MediaDatabaseFiltersProps {
  filters: {
    outlet: string;
    beat: string;
    location: string;
    relationshipScore: string;
  };
  onFiltersChange: (filters: any) => void;
  contacts: any[];
}

export function MediaDatabaseFilters({ filters, onFiltersChange, contacts }: MediaDatabaseFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      outlet: '',
      beat: '',
      location: '',
      relationshipScore: 'all'
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== 'all');

  // Get unique values for filter options
  const uniqueOutlets = [...new Set(contacts.map(c => c.outlet))].filter(Boolean);
  const uniqueBeats = [...new Set(contacts.map(c => c.beat))].filter(Boolean);
  const uniqueLocations = [...new Set(contacts.map(c => c.location))].filter(Boolean);

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => 
    value && value !== 'all'
  ).length;

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-professional-gray">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="outlet-filter">Media Outlet</Label>
          <Input
            id="outlet-filter"
            placeholder="Filter by outlet..."
            value={filters.outlet}
            onChange={(e) => updateFilter('outlet', e.target.value)}
          />
          {uniqueOutlets.length > 0 && (
            <div className="max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-1 mt-2">
                {uniqueOutlets.slice(0, 5).map((outlet) => (
                  <Button
                    key={outlet}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => updateFilter('outlet', outlet)}
                  >
                    {outlet}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="beat-filter">Beat/Specialty</Label>
          <Input
            id="beat-filter"
            placeholder="Filter by beat..."
            value={filters.beat}
            onChange={(e) => updateFilter('beat', e.target.value)}
          />
          {uniqueBeats.length > 0 && (
            <div className="max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-1 mt-2">
                {uniqueBeats.slice(0, 5).map((beat) => (
                  <Button
                    key={beat}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => updateFilter('beat', beat)}
                  >
                    {beat}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location-filter">Location</Label>
          <Input
            id="location-filter"
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
          {uniqueLocations.length > 0 && (
            <div className="max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-1 mt-2">
                {uniqueLocations.slice(0, 5).map((location) => (
                  <Button
                    key={location}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => updateFilter('location', location)}
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="score-filter">Relationship Score</Label>
          <Select value={filters.relationshipScore} onValueChange={(value) => updateFilter('relationshipScore', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All scores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="high">High (80-100)</SelectItem>
              <SelectItem value="medium">Medium (40-79)</SelectItem>
              <SelectItem value="low">Low (0-39)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border-gray">
          <div className="flex flex-wrap gap-2">
            {filters.outlet && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Outlet: {filters.outlet}
                <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('outlet', '')} />
              </Badge>
            )}
            {filters.beat && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Beat: {filters.beat}
                <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('beat', '')} />
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Location: {filters.location}
                <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('location', '')} />
              </Badge>
            )}
            {filters.relationshipScore !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Score: {filters.relationshipScore}
                <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('relationshipScore', 'all')} />
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
