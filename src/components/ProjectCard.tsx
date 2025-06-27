import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { 
  MapPin, Users, Calendar, Euro, ArrowRight, Building2, 
  ChevronDown, ChevronUp, Info, DollarSign, Clock,
  Keyboard, Eye
} from 'lucide-react';
import type { ProjectCardData } from '@/types/project';

interface ProjectCardProps {
  project: ProjectCardData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null);

  const formatAmount = (amount: string) => {
    // Remove currency symbol and format for display
    return amount.replace('€', '').replace(',', '.');
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).getFullYear().toString();
    } catch {
      return dateStr;
    }
  };

  // Keyboard shortcuts - more robust handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!cardRef) return;
      
      // Check if this card is focused, hovered, or contains the active element
      const isCardActive = 
        cardRef.contains(document.activeElement) ||
        cardRef.matches(':hover') ||
        cardRef.querySelector(':hover');
      
      if (!isCardActive) return;
      
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setDetailsOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cardRef]);

  return (
    <div 
      ref={setCardRef}
      data-project-card 
      className="group"
      tabIndex={0}
      onFocus={() => {
        // Ensure the card can receive focus for keyboard navigation
      }}
    >
      <Card className="h-full bg-card/80 backdrop-blur-sm border-2 border-transparent hover:border-primary/20 focus-within:border-primary/40 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] relative overflow-hidden">
        {/* Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/70" />
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-primary shrink-0" />
                <CardTitle className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors truncate">
                  {project.acronym}
                </CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed line-clamp-2">
                {project.title}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Badge variant="outline" className="text-xs font-semibold">
                {project.duration}
              </Badge>
              {/* Keyboard shortcut hint */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                <Keyboard className="h-3 w-3" />
                <span>D</span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDetailsOpen(!detailsOpen);
                }}
                className="h-8 px-2 text-xs"
                aria-label={detailsOpen ? 'Hide project details' : 'Show project details'}
              >
                {detailsOpen ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Details
                  </>
                )}
              </Button>
              <Link to={`/project/${project.id}`}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-xs"
                  aria-label={`View ${project.acronym} project details`}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </Link>
            </div>
            <Link 
              to={`/project/${project.id}`} 
              className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
              aria-label={`Navigate to ${project.acronym} project`}
            >
              <ArrowRight className="h-4 w-4 text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200" />
            </Link>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Always visible summary */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
            {project.summary}
          </p>
          
          {/* Quick overview - always visible */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <Euro className="h-4 w-4 text-accent-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-muted-foreground block">Budget</span>
                <span className="font-bold text-sm">{formatAmount(project.maxAmount)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <Users className="h-4 w-4 text-secondary-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-muted-foreground block">Partners</span>
                <span className="font-bold text-sm">{project.participantCount}</span>
              </div>
            </div>
          </div>

          {/* Collapsible Details */}
          <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
            <CollapsibleContent className="space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-muted-foreground block">Coordinator</span>
                    <span className="font-medium text-sm truncate block">{project.country}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-muted-foreground block">Period</span>
                    <span className="font-medium text-sm block">
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-3 border-t border-muted/50">
                <Badge variant="secondary" className="text-xs font-medium hover:bg-secondary/80 transition-colors">
                  {project.deliverableCount} Deliverables
                </Badge>
                <Badge variant="secondary" className="text-xs font-medium hover:bg-secondary/80 transition-colors">
                  {project.milestoneCount} Milestones
                </Badge>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
