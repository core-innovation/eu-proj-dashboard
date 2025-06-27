import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ProjectCardSkeleton() {
  return (
    <Card className="h-full bg-card/80 backdrop-blur-sm border-2 animate-pulse">
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-muted to-muted/70" />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-muted rounded shrink-0" />
              <div className="h-6 bg-muted rounded w-32" />
            </div>
            <div className="space-y-1">
              <div className="h-4 bg-muted/70 rounded w-full" />
              <div className="h-4 bg-muted/70 rounded w-3/4" />
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <div className="h-6 w-16 bg-muted/70 rounded" />
            <div className="h-4 w-4 bg-muted/70 rounded self-end" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Summary skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-muted/70 rounded w-full" />
          <div className="h-3 bg-muted/70 rounded w-5/6" />
          <div className="h-3 bg-muted/70 rounded w-4/5" />
        </div>
        
        {/* Info sections skeleton */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
            <div className="h-4 w-4 bg-muted rounded shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-muted/70 rounded w-20" />
              <div className="h-4 bg-muted rounded w-32" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
            <div className="h-4 w-4 bg-muted rounded shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-muted/70 rounded w-16" />
              <div className="h-4 bg-muted rounded w-24" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
              <div className="h-4 w-4 bg-muted rounded shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-muted/70 rounded w-12" />
                <div className="h-3 bg-muted rounded w-16" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
              <div className="h-4 w-4 bg-muted rounded shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-muted/70 rounded w-14" />
                <div className="h-4 bg-muted rounded w-6" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Badges skeleton */}
        <div className="flex gap-2 pt-3 border-t border-muted/50">
          <div className="h-6 w-24 bg-muted/70 rounded-full" />
          <div className="h-6 w-20 bg-muted/70 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectCardsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
}
