import { Package, Calendar, User, FileText, Eye, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { EUProject, Deliverable } from '@/types/project';

interface DeliverablesTimelineProps {
  project: EUProject;
}

export function DeliverablesTimeline({ project }: DeliverablesTimelineProps) {
  if (!project.deliverables || project.deliverables.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Deliverables Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No deliverables defined for this project.</p>
        </CardContent>
      </Card>
    );
  }

  const getPrivacyIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'public':
        return <Eye className="h-4 w-4 text-accent-foreground" />;
      case 'sensitive':
        return <Shield className="h-4 w-4 text-secondary-foreground" />;
      case 'classified':
        return <Shield className="h-4 w-4 text-destructive" />;
      default:
        return <Eye className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPrivacyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'public':
        return 'bg-accent text-accent-foreground';
      case 'sensitive':
        return 'bg-secondary text-secondary-foreground';
      case 'classified':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatMonth = (month: number, startDate: string) => {
    const projectStart = new Date(startDate);
    const deliveryDate = new Date(projectStart.getFullYear(), projectStart.getMonth() + month - 1, 1);
    return deliveryDate.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Sort deliverables by due month
  const sortedDeliverables = [...project.deliverables].sort((a, b) => a.due - b.due);
  
  // Get project duration for timeline scale
  const projectDurationMonths = parseInt(project.projectInfo.duration.split(' ')[0]);
  const maxMonth = Math.max(...sortedDeliverables.map(d => d.due), projectDurationMonths);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Deliverables Timeline ({project.deliverables.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timeline Header */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Project Start: {project.projectInfo.startDate}</span>
            <span>Duration: {project.projectInfo.duration}</span>
          </div>

          {/* Vertical Timeline */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20"></div>
            
            {/* Timeline items */}
            <div className="space-y-6">
              {sortedDeliverables.map((deliverable) => (
                <div key={deliverable.no} className="relative flex items-start gap-6">
                  {/* Timeline dot */}
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 shadow-lg flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-background"></div>
                      </div>
                    </div>
                    
                    {/* Month indicator */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full border">
                        M{deliverable.due}
                      </div>
                    </div>
                  </div>

                  {/* Deliverable card */}
                  <div className="flex-1 bg-card border-2 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg text-foreground mb-1">
                          D{deliverable.no}: {deliverable.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Month {deliverable.due} ({formatMonth(deliverable.due, project.projectInfo.startDate)})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{deliverable.leader}</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Work Package: WP{deliverable.wp}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <Badge variant="outline" className="text-sm">
                          {deliverable.type}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={`text-sm flex items-center gap-1 ${getPrivacyColor(deliverable.level)}`}
                        >
                          {getPrivacyIcon(deliverable.level)}
                          {deliverable.level}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Progress indicator based on month */}
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Timeline Position</span>
                        <span>{Math.round((deliverable.due / maxMonth) * 100)}% through project</span>
                      </div>
                      <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary/60 rounded-full transition-all"
                          style={{ width: `${(deliverable.due / maxMonth) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Legend */}
          <div className="flex items-center gap-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm text-muted-foreground">Deliverable Due Date</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Report</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Other Deliverable</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Grid view for deliverables (alternative layout)
interface DeliverablesGridProps {
  project: EUProject;
}

export function DeliverablesGrid({ project }: DeliverablesGridProps) {
  if (!project.deliverables || project.deliverables.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Deliverables Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No deliverables defined for this project.</p>
        </CardContent>
      </Card>
    );
  }

  // Group deliverables by type
  const deliverablesByType = project.deliverables.reduce((acc, deliverable) => {
    if (!acc[deliverable.type]) {
      acc[deliverable.type] = [];
    }
    acc[deliverable.type].push(deliverable);
    return acc;
  }, {} as Record<string, Deliverable[]>);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Deliverables by Type ({project.deliverables.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(deliverablesByType).map(([type, deliverables]) => (
            <div key={type}>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                {type} ({deliverables.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {deliverables.map((deliverable) => (
                  <div key={deliverable.no} className="p-3 bg-card/60 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-xs">D{deliverable.no}</h5>
                      <Badge variant="secondary" className="text-xs">
                        Month {deliverable.due}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {deliverable.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      WP{deliverable.wp} • {deliverable.leader}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
