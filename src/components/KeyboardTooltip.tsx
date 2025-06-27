import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Keyboard } from 'lucide-react';

interface KeyboardTooltipProps {
  show: boolean;
  position: { x: number; y: number };
}

export function KeyboardTooltip({ show, position }: KeyboardTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed z-50 pointer-events-none transition-all duration-200 ${
        show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <Card className="bg-popover/95 backdrop-blur-sm border shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-xs text-popover-foreground">
            <Keyboard className="h-3 w-3" />
            <span>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">D</kbd> for details</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
