import { Target, FileText } from 'lucide-react';

interface TimelineEvent {
  period: string;
  month: number;
  type: 'milestone' | 'report';
  description: string;
  leader?: string;
  wp?: number | string;
}

interface Milestone {
  no: number;
  name: string;
  wp: number | string;
  leader: string;
  due: number;
}

interface WorkPackage {
  no: number;
  title: string;
  leader: string;
  start: number;
  end: number;
}

interface ProjectData {
  projectInfo: {
    duration: string;
    startDate?: string;
    timelineEvents?: TimelineEvent[];
  };
  workPackagesWithTasks?: WorkPackage[];
  milestones?: Milestone[];
}

interface ProjectTimelineProps {
  project: ProjectData;
}

export function ProjectTimeline({ project }: ProjectTimelineProps) {
  const { projectInfo, workPackagesWithTasks = [], milestones = [] } = project;
  const { timelineEvents = [] } = projectInfo;
  
  // Extract duration in months (assuming format like "48 Months")
  const durationMatch = projectInfo.duration.match(/(\d+)/);
  const totalMonths = durationMatch ? parseInt(durationMatch[1]) : 48;
  
  // Calculate current month relative to project start
  const calculateCurrentMonth = () => {
    const projectStartDateStr = projectInfo.startDate;
    if (!projectStartDateStr) return null;
    
    // Parse the project start date (format: "1 January 2024")
    const projectStartDate = new Date(projectStartDateStr);
    const currentDate = new Date();
    
    // If the current date is before the project start, don't show the indicator
    if (currentDate < projectStartDate) return null;
    
    const yearDiff = currentDate.getFullYear() - projectStartDate.getFullYear();
    const monthDiff = currentDate.getMonth() - projectStartDate.getMonth();
    const currentMonth = (yearDiff * 12) + monthDiff + 1; // +1 because project months start from 1
    
    // Only show the current month line if we're within the project timeline
    return currentMonth > 0 && currentMonth <= totalMonths ? currentMonth : null;
  };
  
  const currentMonth = calculateCurrentMonth();
  
  // Create month markers (every 6 months for readability)
  const monthMarkers = [];
  for (let i = 0; i <= totalMonths; i += 6) {
    if (i === 0) i = 1; // Start from month 1
    monthMarkers.push(i);
  }
  
  // Calculate the width percentage for positioning
  const getPositionPercent = (month: number) => ((month - 1) / (totalMonths - 1)) * 100;
  const getWidthPercent = (start: number, end: number) => ((end - start + 1) / totalMonths) * 100;
  
  // Sort work packages by WP number (numerically, not alphabetically)
  const sortedWorkPackages = [...workPackagesWithTasks].sort((a, b) => a.no - b.no);
  
  // Get unique colors for different work package types/leaders
  const getWorkPackageColor = (wp: WorkPackage) => {
    const colorClasses = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500'
    ];
    return colorClasses[wp.no % colorClasses.length];
  };

  // Combine milestones and timeline events for the overlay
  const allEvents = [
    ...milestones.map(m => ({
      period: `M${m.no}`,
      month: m.due,
      type: 'milestone' as const,
      description: m.name,
      leader: m.leader,
      wp: m.wp
    })),
    ...timelineEvents
  ];

  // Smart positioning system to handle overlapping events
  const createEventPositions = (events: typeof allEvents) => {
    const sortedEvents = [...events].sort((a, b) => a.month - b.month);
    const positions: Array<{
      event: typeof allEvents[0];
      x: number;
      y: number;
      groupId: number;
      isGrouped: boolean;
    }> = [];

    let currentGroupId = 0;
    const OVERLAP_THRESHOLD = 3; // months
    const BASE_HEIGHT = 0;
    const STACK_HEIGHT = 25;

    sortedEvents.forEach((event) => {
      const x = getPositionPercent(event.month);
      
      // Find overlapping events (within threshold months)
      const overlappingEvents = positions.filter(pos => 
        Math.abs(pos.event.month - event.month) <= OVERLAP_THRESHOLD
      );

      if (overlappingEvents.length === 0) {
        // No overlap, place at base level
        positions.push({
          event,
          x,
          y: BASE_HEIGHT,
          groupId: currentGroupId++,
          isGrouped: false
        });
      } else {
        // Find the highest Y position in overlapping group
        const maxY = Math.max(...overlappingEvents.map(pos => pos.y));
        const groupId = overlappingEvents[0].groupId;
        
        // Stack above the highest overlapping event
        positions.push({
          event,
          x,
          y: maxY + STACK_HEIGHT,
          groupId,
          isGrouped: true
        });

        // Mark all events in this group as grouped
        overlappingEvents.forEach(pos => pos.isGrouped = true);
      }
    });

    return positions;
  };

  const eventPositions = createEventPositions(allEvents);
  
  // Group events by proximity for compact display
  const eventGroups = eventPositions.reduce((groups, pos) => {
    const groupKey = pos.groupId;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(pos);
    return groups;
  }, {} as Record<number, typeof eventPositions>);

  // Calculate the maximum height needed for the overlay
  const maxHeight = Math.max(60, ...eventPositions.map(pos => pos.y + 40));

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted/20 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-muted-foreground">Work Packages</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-green-600" />
          <span className="text-sm text-muted-foreground">Milestones</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-muted-foreground">Reports</span>
        </div>
        {currentMonth && (
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-4 bg-red-500"></div>
            <span className="text-sm text-muted-foreground">Current Progress (M{currentMonth})</span>
          </div>
        )}
      </div>
      
      {/* Timeline Container */}
      <div className="relative">
        {/* Month markers */}
        <div className="relative h-8 mb-4 border-b border-border">
          {monthMarkers.map(month => (
            <div
              key={month}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${getPositionPercent(month)}%` }}
            >
              <div className="w-px h-4 bg-border"></div>
              <span className="text-xs text-muted-foreground mt-1">M{month}</span>
            </div>
          ))}
        </div>
        
        {/* Work Packages */}
        <div className="space-y-3">
          {sortedWorkPackages.map((wp) => (
            <div key={wp.no} className="relative">
              <div className="flex items-center gap-4">
                {/* Work Package Info */}
                <div className="w-32 flex-shrink-0">
                  <div className="text-sm font-medium text-foreground">WP{wp.no}</div>
                  <div className="text-xs text-muted-foreground truncate" title={wp.leader}>
                    {wp.leader}
                  </div>
                </div>
                
                {/* Timeline Bar */}
                <div className="flex-1 relative h-8">
                  <div
                    className={`absolute top-1 h-6 ${getWorkPackageColor(wp)} rounded-md opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                    style={{
                      left: `${getPositionPercent(wp.start)}%`,
                      width: `${getWidthPercent(wp.start, wp.end)}%`,
                      minWidth: '24px'
                    }}
                    title={`WP${wp.no}: ${wp.title} | Leader: ${wp.leader} | Duration: Month ${wp.start} - ${wp.end} (${wp.end - wp.start + 1} months)`}
                  >
                    <div className="px-2 py-1 text-xs text-white font-medium truncate">
                      M{wp.start}-{wp.end}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Current Month Indicator */}
        {currentMonth && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 opacity-80 z-20 pointer-events-none"
            style={{ left: `calc(${getPositionPercent(currentMonth)}% + 128px)` }}
            title={`Current Progress: Month ${currentMonth} of ${totalMonths}`}
          >
            {/* Current month label */}
            <div className="absolute top-0 left-1 transform -translate-y-full">
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-md">
                Progress: M{currentMonth}
              </div>
              {/* Arrow pointing down */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
            </div>
          </div>
        )}
        
        {/* Milestones and Events Overlay */}
        <div className="relative mt-4" style={{ height: `${maxHeight}px` }}>
          {/* Connection lines for grouped events */}
          {Object.values(eventGroups).map((group) => {
            if (group.length <= 1) return null;
            
            const minX = Math.min(...group.map(pos => pos.x));
            const maxX = Math.max(...group.map(pos => pos.x));
            const minY = Math.min(...group.map(pos => pos.y));
            
            // Only draw connection line if events span more than 2 months
            if (maxX - minX > 8) {
              return (
                <div
                  key={`group-${group[0].groupId}`}
                  className="absolute border-t border-dashed border-muted-foreground/30"
                  style={{
                    left: `${minX}%`,
                    width: `${maxX - minX}%`,
                    top: `${minY - 5}px`,
                    height: '1px'
                  }}
                />
              );
            }
            return null;
          })}
          
          {/* Event markers */}
          {eventPositions.map((position, index) => (
            <div
              key={`${position.event.type}-${index}`}
              className="absolute flex flex-col items-center cursor-pointer group"
              style={{ 
                left: `${position.x}%`,
                top: `${position.y}px`,
                transform: 'translateX(-50%)',
                zIndex: position.isGrouped ? 10 : 5
              }}
              title={`${position.event.period} (Month ${position.event.month}): ${position.event.description}${position.event.leader ? ` | Leader: ${position.event.leader}` : ''}`}
            >
              {/* Event icon */}
              <div className={`relative ${position.isGrouped ? 'ring-2 ring-background' : ''}`}>
                {position.event.type === 'milestone' ? (
                  <Target className="w-4 h-4 text-green-600 group-hover:text-green-700 drop-shadow-sm" />
                ) : (
                  <FileText className="w-4 h-4 text-blue-600 group-hover:text-blue-700 drop-shadow-sm" />
                )}
              </div>
              
              {/* Connection line to timeline */}
              <div 
                className="w-px bg-current opacity-20 group-hover:opacity-40"
                style={{ height: `${Math.max(8, 45 - position.y)}px` }}
              ></div>
              
              {/* Event label */}
              <div className="text-xs text-center leading-tight mt-1 bg-background/80 px-1 rounded border border-border/50 shadow-sm">
                <div className="font-medium text-foreground">
                  {position.event.period}
                </div>
                {position.event.leader && (
                  <div className="text-muted-foreground text-xs">
                    {position.event.leader}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Project Summary */}
      <div className="mt-6 p-4 bg-muted/20 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-foreground">Total Duration:</span>
            <span className="ml-2 text-muted-foreground">{totalMonths} months</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Work Packages:</span>
            <span className="ml-2 text-muted-foreground">{workPackagesWithTasks.length}</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Milestones:</span>
            <span className="ml-2 text-muted-foreground">{milestones.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple milestone grid for backwards compatibility
export function MilestoneGrid({ project }: ProjectTimelineProps) {
  const { milestones = [] } = project;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {milestones.map((milestone) => (
        <div key={milestone.no} className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-foreground">M{milestone.no}</h3>
          </div>
          <h4 className="font-medium text-foreground mb-2">{milestone.name}</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Led by <span className="font-medium">{milestone.leader}</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-muted px-2 py-1 rounded">
              Month {milestone.due}
            </span>
            <span className="text-xs bg-muted px-2 py-1 rounded">
              WP {milestone.wp}
            </span>
            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              Milestone
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
