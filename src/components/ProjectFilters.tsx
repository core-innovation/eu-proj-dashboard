import { useState } from 'react';
import { Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ProjectCardData } from '@/types/project';

export type SortOption = {
  key: keyof ProjectCardData;
  label: string;
  direction: 'asc' | 'desc';
};

export type FilterOption = {
  key: string;
  label: string;
  value: string;
};

interface ProjectFiltersProps {
  projects: ProjectCardData[];
  onFilteredProjectsChange: (projects: ProjectCardData[]) => void;
  onSortChange: (sort: SortOption | null) => void;
  onFiltersChange: (filters: FilterOption[]) => void;
}

export function ProjectFilters({ 
  projects, 
  onFilteredProjectsChange, 
  onSortChange, 
  onFiltersChange 
}: ProjectFiltersProps) {
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);

  // Get unique values for filtering
  const getUniqueValues = (key: keyof ProjectCardData) => {
    return [...new Set(projects.map(p => String(p[key])))].filter(Boolean).sort();
  };

  const countries = getUniqueValues('country');
  const durations = getUniqueValues('duration');
  const coordinators = getUniqueValues('coordinator');
  
  // Create budget ranges
  const getBudgetRanges = () => {
    const ranges = [
      { label: '€0 - €5M', min: 0, max: 5000000 },
      { label: '€5M - €10M', min: 5000000, max: 10000000 },
      { label: '€10M - €15M', min: 10000000, max: 15000000 },
      { label: '€15M - €20M', min: 15000000, max: 20000000 },
      { label: '€20M+', min: 20000000, max: Infinity },
    ];
    
    // Return all ranges regardless of whether projects exist in them
    return ranges;
  };

  const budgetRanges = getBudgetRanges();

  // Sort options
  const sortOptions: Omit<SortOption, 'direction'>[] = [
    { key: 'acronym', label: 'Project Name' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'maxAmount', label: 'Budget' },
    { key: 'participantCount', label: 'Partners' },
    { key: 'deliverableCount', label: 'Deliverables' },
  ];

  const handleSort = (key: keyof ProjectCardData, label: string) => {
    const newDirection = activeSort?.key === key && activeSort?.direction === 'asc' ? 'desc' : 'asc';
    const newSort: SortOption = { key, label, direction: newDirection };
    setActiveSort(newSort);
    onSortChange(newSort);
    applyFiltersAndSort(activeFilters, newSort);
  };

  const handleFilter = (filterKey: string, value: string, label: string) => {
    const existingFilterIndex = activeFilters.findIndex(f => f.key === filterKey);
    let newFilters: FilterOption[];

    if (existingFilterIndex >= 0) {
      // Replace existing filter
      newFilters = [...activeFilters];
      newFilters[existingFilterIndex] = { key: filterKey, value, label };
    } else {
      // Add new filter
      newFilters = [...activeFilters, { key: filterKey, value, label }];
    }

    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
    applyFiltersAndSort(newFilters, activeSort);
  };

  const removeFilter = (filterKey: string) => {
    const newFilters = activeFilters.filter(f => f.key !== filterKey);
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
    applyFiltersAndSort(newFilters, activeSort);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setActiveSort(null);
    onFiltersChange([]);
    onSortChange(null);
    onFilteredProjectsChange(projects);
  };

  const applyFiltersAndSort = (filters: FilterOption[], sort: SortOption | null) => {
    let filteredProjects = [...projects];

    // Apply filters
    filters.forEach(filter => {
      filteredProjects = filteredProjects.filter(project => {
        switch (filter.key) {
          case 'country':
            return project.country === filter.value;
          case 'duration':
            return project.duration === filter.value;
          case 'coordinator':
            return project.coordinator === filter.value;
          case 'budget':
            const projectBudget = parseFloat(project.maxAmount.replace(/[€,]/g, ''));
            const [min, max] = filter.value.split('-').map(Number);
            return projectBudget >= min && (max === Infinity || projectBudget < max);
          case 'participantSize':
            const size = filter.value;
            const count = project.participantCount;
            if (size === 'small') return count <= 5;
            if (size === 'medium') return count > 5 && count <= 15;
            if (size === 'large') return count > 15;
            return true;
          default:
            return true;
        }
      });
    });

    // Apply sorting
    if (sort) {
      filteredProjects.sort((a, b) => {
        let aValue = a[sort.key];
        let bValue = b[sort.key];

        // Handle different data types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          // For budget, extract numeric value
          if (sort.key === 'maxAmount') {
            const aNum = parseFloat(aValue.replace(/[€,]/g, ''));
            const bNum = parseFloat(bValue.replace(/[€,]/g, ''));
            aValue = aNum;
            bValue = bNum;
          }
          // For dates
          else if (sort.key === 'startDate' || sort.key === 'endDate') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          }
        }

        if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    onFilteredProjectsChange(filteredProjects);
  };

  return (
    <div className="space-y-4">
      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Filter by Country */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Country
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-card/95 backdrop-blur-sm border-2 shadow-xl max-h-64 overflow-y-auto">
            <DropdownMenuLabel>Filter by Country</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {countries.map((country) => (
              <DropdownMenuItem
                key={country}
                onClick={() => handleFilter('country', country, `Country: ${country}`)}
              >
                {country}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter by Duration */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Duration
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-card/95 backdrop-blur-sm border-2 shadow-xl max-h-64 overflow-y-auto">
            <DropdownMenuLabel>Filter by Duration</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {durations.map((duration) => (
              <DropdownMenuItem
                key={duration}
                onClick={() => handleFilter('duration', duration, `Duration: ${duration}`)}
              >
                {duration}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter by Coordinator */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Coordinator
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-card/95 backdrop-blur-sm border-2 shadow-xl max-h-64 overflow-y-auto">
            <DropdownMenuLabel>Filter by Coordinator</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {coordinators.map((coordinator) => (
              <DropdownMenuItem
                key={coordinator}
                onClick={() => handleFilter('coordinator', coordinator, `Led by: ${coordinator}`)}
              >
                {coordinator}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter by Budget Range */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Budget
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-card/95 backdrop-blur-sm border-2 shadow-xl max-h-64 overflow-y-auto">
            <DropdownMenuLabel>Filter by Budget</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {budgetRanges.map((range) => (
              <DropdownMenuItem
                key={range.label}
                onClick={() => handleFilter('budget', `${range.min}-${range.max}`, `Budget: ${range.label}`)}
              >
                {range.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter by Project Size */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Team Size
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-card/95 backdrop-blur-sm border-2 shadow-xl max-h-64 overflow-y-auto">
            <DropdownMenuLabel>Filter by Team Size</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleFilter('participantSize', 'small', 'Size: Small (≤5 partners)')}
            >
              Small (≤5 partners)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilter('participantSize', 'medium', 'Size: Medium (6-15 partners)')}
            >
              Medium (6-15 partners)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilter('participantSize', 'large', 'Size: Large (15+ partners)')}
            >
              Large (15+ partners)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {activeSort?.direction === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-card/95 backdrop-blur-sm border-2 shadow-xl max-h-64 overflow-y-auto">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.key}
                onClick={() => handleSort(option.key, option.label)}
                className={activeSort?.key === option.key ? 'bg-accent text-accent-foreground' : ''}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{option.label}</span>
                  {activeSort?.key === option.key && (
                    activeSort.direction === 'asc' ? 
                      <SortAsc className="h-3 w-3" /> : 
                      <SortDesc className="h-3 w-3" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear All Filters */}
        {(activeFilters.length > 0 || activeSort) && (
          <Button variant="ghost" onClick={clearAllFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter.key} variant="secondary" className="gap-1">
              {filter.label}
              <button
                onClick={() => removeFilter(filter.key)}
                className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${filter.label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Active Sort Display */}
      {activeSort && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sorted by:</span>
          <Badge variant="outline" className="gap-1">
            {activeSort.label}
            {activeSort.direction === 'asc' ? (
              <SortAsc className="h-3 w-3" />
            ) : (
              <SortDesc className="h-3 w-3" />
            )}
          </Badge>
        </div>
      )}
    </div>
  );
}
