
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { HospitalSearchCriteria, HOSPITAL_TYPE, COST_RANGE } from '@/types';

interface HospitalSearchProps {
  onSearch: (filters: HospitalSearchCriteria) => void;
  isLoading?: boolean;
}

const HospitalSearch: React.FC<HospitalSearchProps> = ({ onSearch, isLoading }) => {
  const [filters, setFilters] = useState<HospitalSearchCriteria>({
    costRange: undefined,
    zoneId: undefined,
    types: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleCostRangeChange = (value: string) => {
    setFilters({
      ...filters,
      costRange: value as COST_RANGE,
    });
  };

  const handleZoneChange = (value: string) => {
    setFilters({
      ...filters,
      zoneId: value ? parseInt(value) : undefined,
    });
  };

  const handleTypeChange = (value: string) => {
    setFilters({
      ...filters,
      types: value ? [value as HOSPITAL_TYPE] : undefined,
    });
  };

  return (
    <Card className="mb-8 shadow-md rounded-2xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zone">Zone</Label>
              <Select onValueChange={handleZoneChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Zone 1 - Dhaka</SelectItem>
                  <SelectItem value="2">Zone 2 - Chittagong</SelectItem>
                  <SelectItem value="3">Zone 3 - Sylhet</SelectItem>
                  <SelectItem value="4">Zone 4 - Rajshahi</SelectItem>
                  <SelectItem value="5">Zone 5 - Khulna</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Hospital Type</Label>
              <Select onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={HOSPITAL_TYPE.PUBLIC}>Public</SelectItem>
                  <SelectItem value={HOSPITAL_TYPE.PRIVATE}>Private</SelectItem>
                  <SelectItem value={HOSPITAL_TYPE.GENERAL}>General</SelectItem>
                  <SelectItem value={HOSPITAL_TYPE.SPECIALIZED}>Specialized</SelectItem>
                  <SelectItem value={HOSPITAL_TYPE.CHILDREN}>Children</SelectItem>
                  <SelectItem value={HOSPITAL_TYPE.MATERNITY}>Maternity</SelectItem>
                  <SelectItem value={HOSPITAL_TYPE.RESEARCH}>Research</SelectItem>
                  <SelectItem value={HOSPITAL_TYPE.REHABILITATION}>Rehabilitation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="costRange">Cost Range</Label>
              <Select onValueChange={handleCostRangeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cost range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={COST_RANGE.VERY_LOW}>Very Low</SelectItem>
                  <SelectItem value={COST_RANGE.LOW}>Low</SelectItem>
                  <SelectItem value={COST_RANGE.MODERATE}>Moderate</SelectItem>
                  <SelectItem value={COST_RANGE.HIGH}>High</SelectItem>
                  <SelectItem value={COST_RANGE.VERY_HIGH}>Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto active:scale-95" disabled={isLoading}>
            <Search className="mr-2 h-4 w-4" />
            {isLoading ? 'Searching...' : 'Search Hospitals'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HospitalSearch;
