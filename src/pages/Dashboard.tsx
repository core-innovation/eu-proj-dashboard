import { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectFilters, type SortOption, type FilterOption } from '@/components/ProjectFilters';
import { ProjectCardsGridSkeleton } from '@/components/LoadingSkeletons';
import { ModeToggle } from '@/components/mode-toggle';
import { NavigationHelp } from '@/components/NavigationHelp';
import { useProjectCards, useProjectSearch } from '@/hooks/useProjectData';
import type { ProjectCardData } from '@/types/project';

export function Dashboard() {
  const { cards, loading, error } = useProjectCards();
  const { results, loading: searchLoading, search, clearResults } = useProjectSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<ProjectCardData[]>([]);
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      search(query);
    } else {
      clearResults();
    }
  };

  // Determine which projects to display
  const getDisplayProjects = (): ProjectCardData[] => {
    if (searchQuery.trim()) {
      return results;
    }
    if (activeFilters.length > 0 || activeSort) {
      return filteredProjects;
    }
    return cards;
  };

  const displayProjects = getDisplayProjects();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-12">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-5xl font-bold text-primary">
                EU Projects Dashboard
              </h1>
              <p className="text-xl text-muted-foreground">
                Explore and discover EU-funded research projects
              </p>
            </div>
            <ModeToggle />
          </div>

          {/* Search Section Skeleton */}
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full max-w-2xl">
              <div className="h-14 bg-muted/60 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Loading Skeletons */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <div className="h-10 w-24 bg-muted/60 rounded animate-pulse" />
              <div className="h-10 w-24 bg-muted/60 rounded animate-pulse" />
              <div className="h-10 w-24 bg-muted/60 rounded animate-pulse" />
            </div>
            <ProjectCardsGridSkeleton count={6} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-destructive text-lg">
              <AlertCircle className="h-8 w-8" />
              <span>Error: {error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-5xl font-bold text-primary">
              EU Projects Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore and discover EU-funded research projects
            </p>
          </div>
          <ModeToggle />
        </div>
        
        {/* Search Section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search projects by title, acronym, or description..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-12 pr-12 h-14 text-lg shadow-lg border-2 focus:border-primary/50 bg-card/80 backdrop-blur-sm"
            />
            {searchLoading && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
          
          {/* Search Results Info */}
          {searchQuery.trim() && (
            <div className="text-sm text-muted-foreground bg-card/90 backdrop-blur-sm border-2 shadow-lg px-4 py-2 rounded-full">
              {results.length} {results.length === 1 ? 'result' : 'results'} for "{searchQuery}"
            </div>
          )}
        </div>

        {/* Filters and Sorting - Only show when not searching */}
        {!searchQuery.trim() && (
          <div className="bg-card/90 backdrop-blur-sm border-2 shadow-lg rounded-2xl p-6">
            <ProjectFilters
              projects={cards}
              onFilteredProjectsChange={setFilteredProjects}
              onSortChange={setActiveSort}
              onFiltersChange={setActiveFilters}
            />
          </div>
        )}

        {/* Projects Grid */}
        <div className="space-y-6">
          {displayProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-card/90 backdrop-blur-sm border-2 shadow-lg rounded-2xl p-12 mx-auto max-w-md">
                <p className="text-lg text-muted-foreground">
                  {searchQuery.trim() ? 'No projects found matching your search.' : 'No projects available.'}
                </p>
                {searchQuery.trim() && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search terms or browse all projects.
                  </p>
                )}
                {!searchQuery.trim() && (activeFilters.length > 0 || activeSort) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your filters or clearing them to see all projects.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {displayProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              
              {/* Footer Stats */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-card/90 backdrop-blur-sm border-2 shadow-lg rounded-full px-6 py-3">
                  <span className="text-sm font-medium">
                    Showing {displayProjects.length} of {cards.length} {displayProjects.length === 1 ? 'project' : 'projects'}
                    {searchQuery.trim() && ' (search results)'}
                    {!searchQuery.trim() && (activeFilters.length > 0 || activeSort) && ' (filtered)'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation Help - Always show at the bottom */}
        <NavigationHelp />
      </div>
    </div>
  );
}
