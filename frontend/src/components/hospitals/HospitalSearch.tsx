import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Select from 'react-select';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { HospitalSearchCriteria, HOSPITAL_TYPE, COST_RANGE, TEST_TYPE } from '@/types';

interface HospitalSearchProps {
  onSearch: (filters: HospitalSearchCriteria) => void;
  isLoading?: boolean;
}

interface OptionType {
  value: string;
  label: string;
}

const HospitalSearch: React.FC<HospitalSearchProps> = ({ onSearch, isLoading }) => {
  const [filters, setFilters] = useState<HospitalSearchCriteria>({
    costRange: undefined,
    zoneId: undefined,
    types: undefined,
  });

  // Options for react-select
  const hospitalTypeOptions: OptionType[] = [
    { value: HOSPITAL_TYPE.PUBLIC, label: 'Public' },
    { value: HOSPITAL_TYPE.PRIVATE, label: 'Private' },
    { value: HOSPITAL_TYPE.GENERAL, label: 'General' },
    { value: HOSPITAL_TYPE.SPECIALIZED, label: 'Specialized' },
    { value: HOSPITAL_TYPE.CHILDREN, label: 'Children' },
    { value: HOSPITAL_TYPE.MATERNITY, label: 'Maternity' },
    { value: HOSPITAL_TYPE.RESEARCH, label: 'Research' },
    { value: HOSPITAL_TYPE.REHABILITATION, label: 'Rehabilitation' },
  ];

  const costRangeOptions: OptionType[] = [
    { value: COST_RANGE.VERY_LOW, label: 'Very Low' },
    { value: COST_RANGE.LOW, label: 'Low' },
    { value: COST_RANGE.MODERATE, label: 'Moderate' },
    { value: COST_RANGE.HIGH, label: 'High' },
    { value: COST_RANGE.VERY_HIGH, label: 'Very High' },
  ];

  const testOptions: OptionType[] = [
    { value: TEST_TYPE.BLOOD, label: 'Blood Test' },
    { value: TEST_TYPE.HEART, label: 'Heart Test' },
    { value: TEST_TYPE.BRAIN, label: 'Brain Test' },
    { value: TEST_TYPE.LUNG, label: 'Lung Test' },
    { value: TEST_TYPE.EYE, label: 'Eye Test' },
    { value: TEST_TYPE.BONE, label: 'Bone Test' },
    { value: TEST_TYPE.SKIN, label: 'Skin Test' },
    { value: TEST_TYPE.GENERAL, label: 'General Test' },
    { value: TEST_TYPE.LIVER, label: 'Liver Test' },
    { value: TEST_TYPE.KIDNEY, label: 'Kidney Test' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleCostRangeChange = (selectedOption: OptionType | null) => {
    setFilters({
      ...filters,
      costRange: selectedOption ? (selectedOption.value as COST_RANGE) : undefined,
    });
  };

  const handleZoneIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      zoneId: value ? parseInt(value) : undefined,
    });
  };

  const handleTypeChange = (selectedOptions: OptionType[] | null) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value as HOSPITAL_TYPE) : [];
    setFilters({
      ...filters,
      types: selectedValues.length > 0 ? selectedValues : undefined,
    });
  };

  const handleTestChange = (selectedOption: OptionType | null) => {

    setFilters({
      ...filters,
      test: selectedOption ? (selectedOption.value as TEST_TYPE) : undefined,
    });
  };

  // Convert current values to react-select format
  const selectedCostRangeOption = filters.costRange ? costRangeOptions.find(option => option.value === filters.costRange) : null;
  const selectedTypeOptions = filters.types ? filters.types.map(type => ({
    value: type,
    label: hospitalTypeOptions.find(option => option.value === type)?.label || type
  })) : [];
  const selectedTestOption = filters.test ? testOptions.find(option => option.value === filters.test) : null;

  return (
    <Card className="mb-8 shadow-md rounded-2xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* <div className="space-y-2">
              <Label htmlFor="zoneId">Zone ID</Label>
              <Input
                id="zoneId"
                name="zoneId"
                type="number"
                min={1}
                value={filters.zoneId ?? ""}
                onChange={handleZoneIdChange}
                placeholder="Enter zone ID..."
                disabled={isLoading}
              />
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="type">Hospital Type</Label>
              <Select
                isMulti
                options={hospitalTypeOptions}
                value={selectedTypeOptions}
                onChange={handleTypeChange}
                placeholder="Select types..."
                isDisabled={isLoading}
                isClearable
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costRange">Cost Range</Label>
              <Select
                options={costRangeOptions}
                value={selectedCostRangeOption}
                onChange={handleCostRangeChange}
                placeholder="Select cost range..."
                isDisabled={isLoading}
                isClearable
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="test">Test</Label>
              <Select
                options={testOptions}
                value={selectedTestOption}
                onChange={handleTestChange}
                isDisabled={isLoading}
                isClearable
              />
            </div> */}
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
