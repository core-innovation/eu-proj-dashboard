import type { EUProject, ProjectCardData } from '@/types/project';

export class DataLoader {
  private static projectsCache: Map<string, EUProject> = new Map();
  private static projectCardsCache: ProjectCardData[] | null = null;

  /**
   * Get the base URL for data files, handling both web and Electron environments
   */
  private static getDataBaseUrl(): string {
    // Check if we're in Electron
    if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
      // In Electron, construct path relative to the HTML file location
      const baseHref = window.location.href;
      const basePath = baseHref.substring(0, baseHref.lastIndexOf('/'));
      return `${basePath}/eu-data`;
    }
    // In web browser, use absolute path
    return '/eu-data';
  }

  /**
   * Load a specific project by its filename (without .json extension)
   */
  static async loadProject(projectId: string): Promise<EUProject> {
    if (this.projectsCache.has(projectId)) {
      return this.projectsCache.get(projectId)!;
    }

    try {
      const baseUrl = this.getDataBaseUrl();
      const response = await fetch(`${baseUrl}/${projectId}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load project ${projectId}: ${response.statusText}`);
      }
      
      const project: EUProject = await response.json();
      this.projectsCache.set(projectId, project);
      return project;
    } catch (error) {
      console.error(`Error loading project ${projectId}:`, error);
      throw new Error(`Failed to load project data for ${projectId}`);
    }
  }

  /**
   * Load all available projects and return card data
   * Always performs fresh discovery on app reload
   */
  static async loadProjectCards(): Promise<ProjectCardData[]> {
    // Don't use cache on initial load to ensure fresh data
    if (this.projectCardsCache) {
      return this.projectCardsCache;
    }

    try {
      // Get the list of available projects using manifest or discovery
      const projectIds = await this.getProjectList();
      
      if (projectIds.length === 0) {
        console.warn('No projects found! Check that project files exist in /public/eu-data/');
        return [];
      }
      
      const cards: ProjectCardData[] = [];
      
      for (const projectId of projectIds) {
        try {
          const project = await this.loadProject(projectId);
          const card = this.convertToCardData(projectId, project);
          cards.push(card);
        } catch (error) {
          console.warn(`Skipping project ${projectId}:`, error);
        }
      }

      // Sort cards by project acronym for consistent ordering
      cards.sort((a, b) => a.acronym.localeCompare(b.acronym));

      console.log(`Successfully loaded ${cards.length} projects from ${projectIds.length} discovered files`);
      this.projectCardsCache = cards;
      return cards;
    } catch (error) {
      console.error('Error loading project cards:', error);
      throw new Error('Failed to load project cards');
    }
  }

  /**
   * Convert full project data to card data
   */
  private static convertToCardData(projectId: string, project: EUProject): ProjectCardData {
    return {
      id: projectId,
      acronym: project.projectInfo.acronym,
      title: project.projectInfo.title,
      summary: project.projectInfo.summary,
      coordinator: project.projectInfo.coordinator.name,
      country: project.projectInfo.coordinator.location,
      maxAmount: project.projectInfo.maxAmount,
      duration: project.projectInfo.duration,
      startDate: project.projectInfo.startDate,
      endDate: project.projectInfo.endDate,
      participantCount: project.participants.length,
      deliverableCount: project.deliverables.length,
      milestoneCount: project.milestones.length,
    };
  }

  /**
   * Search projects by title, acronym, or summary
   */
  static async searchProjects(query: string): Promise<ProjectCardData[]> {
    const cards = await this.loadProjectCards();
    const lowerQuery = query.toLowerCase();
    
    return cards.filter(card => 
      card.acronym.toLowerCase().includes(lowerQuery) ||
      card.title.toLowerCase().includes(lowerQuery) ||
      card.summary.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Attempt to dynamically discover available project files
   * Uses an aggressive brute-force approach to find JSON files
   */
  private static async discoverProjectFiles(): Promise<string[]> {
    const availableProjects: string[] = [];

    // Strategy 1: Try to load a comprehensive list of potential project names
    // This includes known projects plus common naming patterns
    const potentialProjects = [
      // Known existing projects
      'alchemy', 'ambiance', 'cardimed', 'dacapo', 'dexplore', 'elexia', 
      'glas-a-fuels', 'inperso', 'maestro', 'mastermine', 'modular', 'terravision',
      'reuman', 'trineflex', // Recently added
      
      // Common EU project prefixes and patterns
      'ai', 'bio', 'cyber', 'digital', 'energy', 'future', 'green', 'health',
      'innovation', 'smart', 'tech', 'urban', 'vision', 'water', 'zero',
      'horizon', 'marie', 'erc', 'fet', 'sme', 'eic', 'eureka', 'cost',
      
      // Systematic discovery - try common project name patterns
      'project1', 'project2', 'project3', 'project4', 'project5',
      'test', 'demo', 'sample', 'example', 'pilot', 'prototype',
      
      // Single letter combinations for unknown projects
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      
      // Common two-letter combinations
      'ab', 'ac', 'ad', 'ag', 'ai', 'al', 'am', 'an', 'ap', 'ar', 'as', 'at',
      'ba', 'be', 'bi', 'bo', 'ca', 'co', 'da', 'de', 'di', 'do', 'dr',
      'ec', 'ed', 'el', 'em', 'en', 'er', 'es', 'et', 'eu', 'ex',
      'fa', 'fi', 'fo', 'ga', 'ge', 'gi', 'go', 'gr', 'ha', 'he', 'hi', 'ho',
      'id', 'in', 'io', 'ir', 'it', 'la', 'le', 'li', 'lo', 'ma', 'me', 'mi', 'mo',
      'na', 'ne', 'ni', 'no', 'ob', 'of', 'on', 'op', 'or', 'pa', 'pe', 'pi', 'po', 'pr',
      'qu', 'ra', 're', 'ri', 'ro', 'ru', 'sa', 'se', 'si', 'so', 'st', 'su',
      'ta', 'te', 'th', 'ti', 'to', 'tr', 'tu', 'un', 'up', 'ur', 'us',
      'va', 've', 'vi', 'vo', 'wa', 'we', 'wi', 'wo', 'xe', 'yo', 'ze'
    ];

    console.log('Starting aggressive project discovery...');
    
    // Test each potential project to see if it exists
    const batchSize = 10; // Process in batches to avoid overwhelming the server
    const baseUrl = this.getDataBaseUrl();
    
    for (let i = 0; i < potentialProjects.length; i += batchSize) {
      const batch = potentialProjects.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (projectId) => {
        try {
          const response = await fetch(`${baseUrl}/${projectId}.json`, { 
            method: 'HEAD',
            cache: 'no-cache' 
          });
          if (response.ok) {
            availableProjects.push(projectId);
            console.log(`✓ Found project: ${projectId}`);
          }
        } catch (error) {
          // Project file doesn't exist, skip silently
        }
      }));
      
      // Small delay between batches to be nice to the server
      if (i + batchSize < potentialProjects.length) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    console.log(`Discovered ${availableProjects.length} available projects:`, availableProjects);
    return availableProjects.sort();
  }

  /**
   * Try to load project list from a manifest file, with fallback to discovery
   * Always reloads manifest to catch new projects
   */
  private static async getProjectList(): Promise<string[]> {
    try {
      // Always try to load fresh manifest (no cache)
      const baseUrl = this.getDataBaseUrl();
      const manifestResponse = await fetch(`${baseUrl}/projects-manifest.json`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        if (Array.isArray(manifest.projects) && manifest.projects.length > 0) {
          console.log('Loaded projects from fresh manifest:', manifest.projects);
          
          // Verify each project in the manifest actually exists
          const verifiedProjects: string[] = [];
          for (const projectId of manifest.projects) {
            try {
              const response = await fetch(`${baseUrl}/${projectId}.json`, { 
                method: 'HEAD',
                cache: 'no-cache' 
              });
              if (response.ok) {
                verifiedProjects.push(projectId);
              }
            } catch (error) {
              console.warn(`Project ${projectId} listed in manifest but not found`);
            }
          }
          
          console.log(`Verified ${verifiedProjects.length} projects from manifest`);
          return verifiedProjects;
        }
      }
    } catch (error) {
      console.debug('No manifest file found or error loading manifest, using discovery method');
    }

    // Fallback to discovery method
    return this.discoverProjectFiles();
  }

  /**
   * Clear all caches (useful for development)
   */
  static clearCache(): void {
    this.projectsCache.clear();
    this.projectCardsCache = null;
    console.log('DataLoader cache cleared');
  }

  /**
   * Force reload of all project data (clears cache and reloads)
   */
  static async forceReload(): Promise<ProjectCardData[]> {
    this.clearCache();
    return this.loadProjectCards();
  }

  /**
   * Get a list of all available project files for debugging/admin purposes
   */
  static async getAvailableProjects(): Promise<string[]> {
    try {
      const manifest = await this.getProjectList();
      return manifest;
    } catch (error) {
      console.error('Failed to get available projects:', error);
      return [];
    }
  }

  /**
   * Generate a manifest file content based on discovered projects
   * Useful for creating/updating the projects-manifest.json file
   */
  static async generateManifest(): Promise<string> {
    try {
      const discoveredProjects = await this.discoverProjectFiles();
      const manifest = {
        projects: discoveredProjects.sort(),
        lastUpdated: new Date().toISOString().split('T')[0],
        description: "Auto-generated manifest file listing all available EU project data files",
        generatedBy: "DataLoader.generateManifest()",
        totalProjects: discoveredProjects.length
      };
      
      console.log('Generated manifest for', discoveredProjects.length, 'projects');
      return JSON.stringify(manifest, null, 2);
    } catch (error) {
      console.error('Failed to generate manifest:', error);
      throw error;
    }
  }
}

// Utility function for development: Call this in browser console to update manifest
// DataLoader.generateAndLogManifest().then(manifest => console.log('Copy this to projects-manifest.json:', manifest))
declare global {
  interface Window {
    DataLoader: typeof DataLoader;
  }
}

// Make DataLoader available globally in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.DataLoader = DataLoader;
}
