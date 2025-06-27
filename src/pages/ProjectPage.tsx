import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Euro, Users, Package, Loader2, AlertCircle, ChevronDown, ChevronUp, Clock, Target, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/mode-toggle';
import { ProjectNavigation } from '@/components/Navigation';
import { ProjectTimeline, MilestoneGrid } from '@/components/ProjectTimeline';
import { DeliverablesTimeline } from '@/components/DeliverablesTimeline';
import { ParticipantMap } from '@/components/ParticipantMap';
import { useProject } from '@/hooks/useProjectData';

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, loading, error } = useProject(projectId);
  
  // Collapsible sections state - all collapsed by default
  const [workPackagesOpen, setWorkPackagesOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [deliverablesOpen, setDeliverablesOpen] = useState(false);
  const [milestonesOpen, setMilestonesOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  
  // Individual work package states
  const [expandedWorkPackages, setExpandedWorkPackages] = useState<Set<number>>(new Set());
  
  // Navigation functions
  const navigateToSection = (sectionType: string) => {
    switch (sectionType) {
      case 'workpackages':
        setWorkPackagesOpen(true);
        setTimeout(() => document.getElementById('workpackages-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
        break;
      case 'timeline':
        setTimelineOpen(true);
        setTimeout(() => document.getElementById('timeline-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
        break;
      case 'deliverables':
        setDeliverablesOpen(true);
        setTimeout(() => document.getElementById('deliverables-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
        break;
      case 'milestones':
        setMilestonesOpen(true);
        setTimeout(() => document.getElementById('milestones-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
        break;
      case 'map':
        setMapOpen(true);
        setTimeout(() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
        break;
      case 'participants':
        setParticipantsOpen(true);
        setTimeout(() => document.getElementById('participants-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
        break;
    }
  };
  
  const toggleWorkPackage = (wpNo: number) => {
    const newExpanded = new Set(expandedWorkPackages);
    if (newExpanded.has(wpNo)) {
      newExpanded.delete(wpNo);
    } else {
      newExpanded.add(wpNo);
    }
    setExpandedWorkPackages(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-muted-foreground">Loading project...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Link to="/">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <ModeToggle />
            </div>
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex items-center gap-3 text-destructive text-lg">
                <AlertCircle className="h-8 w-8" />
                <span>Error: {error || 'Project not found'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatAmount = (amount: string) => {
    return amount.replace('€', '').replace(',', '.');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Navigation Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <ProjectNavigation 
              projectAcronym={project.projectInfo.acronym}
              projectId={projectId}
            />
            <div className="flex items-center gap-2">
              {/* Quick Navigation Shortcuts */}
              <div className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToSection('map')}
                  className="gap-1 h-8 text-xs"
                >
                  <MapPin className="h-3 w-3" />
                  Map
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToSection('workpackages')}
                  className="gap-1 h-8 text-xs"
                >
                  <Package className="h-3 w-3" />
                  Work Packages
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToSection('timeline')}
                  className="gap-1 h-8 text-xs"
                >
                  <Clock className="h-3 w-3" />
                  Timeline
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToSection('deliverables')}
                  className="gap-1 h-8 text-xs"
                >
                  <FileText className="h-3 w-3" />
                  Deliverables
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToSection('milestones')}
                  className="gap-1 h-8 text-xs"
                >
                  <Target className="h-3 w-3" />
                  Milestones
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToSection('participants')}
                  className="gap-1 h-8 text-xs"
                >
                  <Users className="h-3 w-3" />
                  Partners
                </Button>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Back Button */}
        <div className="flex">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Project Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-primary">
                {project.projectInfo.acronym}
              </h1>
              <p className="text-xl text-muted-foreground">{project.projectInfo.title}</p>
            </div>
            <Badge variant="outline" className="text-sm">
              {project.projectInfo.grantType}
            </Badge>
          </div>
          
          <div className="bg-card/60 backdrop-blur-sm border rounded-2xl p-6">
            <p className="text-lg leading-relaxed">{project.projectInfo.summary}</p>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card/80 backdrop-blur-sm border-2 rounded-lg p-4">
            <div className="pb-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <Euro className="h-4 w-4 text-accent-foreground" />
                Budget
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatAmount(project.projectInfo.maxAmount)}</div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm border-2 rounded-lg p-4">
            <div className="pb-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Duration
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{project.projectInfo.duration}</div>
              <p className="text-xs text-muted-foreground">
                {project.projectInfo.startDate} - {project.projectInfo.endDate}
              </p>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm border-2 rounded-lg p-4">
            <div className="pb-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary-foreground" />
                Partners
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{project.participants.length}</div>
              <p className="text-xs text-muted-foreground">Organizations</p>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm border-2 rounded-lg p-4">
            <div className="pb-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Coordinator
              </div>
            </div>
            <div>
              <div className="text-sm font-bold">{project.participants[0]?.shortName}</div>
              <p className="text-xs text-muted-foreground">{project.projectInfo.coordinator.location}</p>
            </div>
          </div>
        </div>

        {/* Participant Map Section */}
        <section id="map-section" className="mb-8">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setMapOpen(!mapOpen)}
              className="w-full flex justify-between items-center p-6 text-left hover:bg-muted/20 transition-colors focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">Participant Map</h2>
                  <p className="text-sm text-muted-foreground">
                    Geographic distribution of project partners
                  </p>
                </div>
              </div>
              {mapOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            {mapOpen && (
              <div className="border-t bg-card p-6">
                <ParticipantMap project={project} />
              </div>
            )}
          </div>
        </section>

        {/* Work Packages Section */}
        <section id="workpackages-section" className="mb-8">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setWorkPackagesOpen(!workPackagesOpen)}
              className="w-full flex justify-between items-center p-6 text-left hover:bg-muted/20 transition-colors focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">Work Packages</h2>
                  <p className="text-sm text-muted-foreground">
                    {project.workPackagesWithTasks.length} work packages organizing project activities
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {project.workPackagesWithTasks.length}
                </Badge>
                {workPackagesOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </button>
            
            {workPackagesOpen && (
              <div className="border-t bg-card p-6">
                <div className="grid gap-4">
                  {project.workPackagesWithTasks.map((wp) => (
                    <div key={wp.no} className="border rounded-xl overflow-hidden bg-muted/20">
                      <button
                        onClick={() => toggleWorkPackage(wp.no)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors focus:outline-none"
                      >
                        <div className="flex items-start justify-between w-full">
                          <div>
                            <h4 className="font-semibold text-primary">WP{wp.no}: {wp.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Led by {wp.leader} • Month {wp.start}-{wp.end}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge variant="secondary">{wp.tasks.length} tasks</Badge>
                            {expandedWorkPackages.has(wp.no) ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </button>
                      
                      {expandedWorkPackages.has(wp.no) && (
                        <div className="border-t bg-card/60 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {wp.tasks.map((task) => (
                              <div key={task.id} className="text-sm bg-background/60 rounded-lg p-3 border hover:border-primary/30 transition-colors">
                                <div className="font-medium text-primary">{task.id}</div>
                                <div className="text-muted-foreground line-clamp-2">{task.title}</div>
                                <div className="text-xs text-muted-foreground mt-1">Led by {task.leader}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Project Timeline Section */}
        <section id="timeline-section" className="mb-8">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setTimelineOpen(!timelineOpen)}
              className="w-full flex justify-between items-center p-6 text-left hover:bg-muted/20 transition-colors focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">Project Timeline</h2>
                  <p className="text-sm text-muted-foreground">
                    Visual timeline of project milestones and progress
                  </p>
                </div>
              </div>
              {timelineOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            {timelineOpen && (
              <div className="border-t bg-card p-6">
                <ProjectTimeline project={project} />
              </div>
            )}
          </div>
        </section>

        {/* Deliverables Section */}
        <section id="deliverables-section" className="mb-8">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setDeliverablesOpen(!deliverablesOpen)}
              className="w-full flex justify-between items-center p-6 text-left hover:bg-muted/20 transition-colors focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">Deliverables Timeline</h2>
                  <p className="text-sm text-muted-foreground">
                    Schedule of project deliverables and reports
                  </p>
                </div>
              </div>
              {deliverablesOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            {deliverablesOpen && (
              <div className="border-t bg-card p-6">
                <DeliverablesTimeline project={project} />
              </div>
            )}
          </div>
        </section>

        {/* Milestones Section */}
        <section id="milestones-section" className="mb-8">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setMilestonesOpen(!milestonesOpen)}
              className="w-full flex justify-between items-center p-6 text-left hover:bg-muted/20 transition-colors focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">Milestones Grid</h2>
                  <p className="text-sm text-muted-foreground">
                    Key project milestones and achievements
                  </p>
                </div>
              </div>
              {milestonesOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            {milestonesOpen && (
              <div className="border-t bg-card p-6">
                <MilestoneGrid project={project} />
              </div>
            )}
          </div>
        </section>

        {/* Participants Section */}
        <section id="participants-section" className="mb-8">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setParticipantsOpen(!participantsOpen)}
              className="w-full flex justify-between items-center p-6 text-left hover:bg-muted/20 transition-colors focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-secondary-foreground" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">Project Partners</h2>
                  <p className="text-sm text-muted-foreground">
                    {project.participants.length} organizations participating in this project
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {project.participants.length}
                </Badge>
                {participantsOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </button>
            
            {participantsOpen && (
              <div className="border-t bg-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.participants.map((participant) => (
                    <div key={participant.no} className="border rounded-xl p-4 space-y-2 bg-muted/30 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <Badge variant={participant.role === 'Coordinator' ? 'default' : 'secondary'}>
                          {participant.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">{participant.countryCode}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary">{participant.shortName}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {participant.legalName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{participant.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
