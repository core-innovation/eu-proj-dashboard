import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface NavigationProps {
  items?: BreadcrumbItem[];
}

export function Navigation({ items = [] }: NavigationProps) {
  const location = useLocation();

  // Auto-generate breadcrumb items based on current path if not provided
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    if (items.length > 0) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/' }
    ];

    if (pathSegments.length > 0) {
      // Handle project pages
      if (pathSegments[0] === 'project' && pathSegments[1]) {
        breadcrumbs.push({
          label: `Project: ${pathSegments[1].toUpperCase()}`,
          href: `/project/${pathSegments[1]}`
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2 px-2">
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </Button>
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link to={item.href}>
              <Button variant="ghost" size="sm" className="px-2">
                {item.label}
              </Button>
            </Link>
          ) : (
            <span className={index === breadcrumbItems.length - 1 ? 'text-foreground font-medium' : ''}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Helper component for project-specific navigation
interface ProjectNavigationProps {
  projectAcronym: string;
  projectId?: string;
}

export function ProjectNavigation({ projectAcronym }: ProjectNavigationProps) {
  const items: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/' },
    { label: projectAcronym }
  ];

  return <Navigation items={items} />;
}
