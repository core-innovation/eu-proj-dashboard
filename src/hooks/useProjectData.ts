import { useState, useEffect } from 'react';
import type { EUProject, ProjectCardData } from '@/types/project';
import { DataLoader } from '@/utils/dataLoader';

export function useProjectCards() {
  const [cards, setCards] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCards = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectCards = await DataLoader.loadProjectCards();
        
        if (isMounted) {
          setCards(projectCards);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCards();

    return () => {
      isMounted = false;
    };
  }, []);

  return { cards, loading, error };
}

export function useProject(projectId: string | undefined) {
  const [project, setProject] = useState<EUProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      if (!projectId) {
        if (isMounted) {
          setProject(null);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const projectData = await DataLoader.loadProject(projectId);
        
        if (isMounted) {
          setProject(projectData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error occurred');
          setProject(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  return { project, loading, error };
}

export function useProjectSearch() {
  const [results, setResults] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const searchResults = await DataLoader.searchProjects(query);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return { results, loading, error, search, clearResults };
}
