import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { 
  HelpCircle, 
  Keyboard, 
  ChevronDown, 
  ChevronUp, 
  Eye,
  Info
} from 'lucide-react';

export function NavigationHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="w-80 bg-card/95 backdrop-blur-sm border-2 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Navigation Help</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="h-8 w-8 p-0"
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>
            <CardDescription>
              {isOpen ? 'Learn how to navigate project cards efficiently' : 'Click to see navigation shortcuts'}
            </CardDescription>
          </CardHeader>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Keyboard className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm mb-1">Keyboard Shortcuts</div>
                    <div className="text-xs text-muted-foreground">
                      <div className="mb-1">
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">D</kbd> - Toggle project details
                      </div>
                      <div className="text-xs">
                        Focus a project card first, then use shortcuts
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <ChevronDown className="h-4 w-4 text-secondary-foreground shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm mb-1">Collapsible Sections</div>
                    <div className="text-xs text-muted-foreground">
                      Click "Details" button or use keyboard shortcut to show/hide additional project information
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Eye className="h-4 w-4 text-accent-foreground shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm mb-1">Quick Actions</div>
                    <div className="text-xs text-muted-foreground">
                      Use "View" button for direct navigation or click anywhere else on the card
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm mb-1">Compact Design</div>
                    <div className="text-xs text-muted-foreground">
                      Essential info is always visible. Expand for coordinator details, timeline, and metrics
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-muted/50">
                <div className="text-xs text-muted-foreground text-center">
                  This help panel auto-hides after navigation
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
