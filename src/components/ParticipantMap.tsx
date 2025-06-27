import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Building, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { EUProject, Participant } from '@/types/project';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface ParticipantMapProps {
  project: EUProject;
}

// Interactive Leaflet Map Component
function InteractiveMap({ participants }: { participants: Participant[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([50.0, 10.0], 4);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers for each participant
    participants.forEach(participant => {
      // Use a more precise default location if coordinates are missing
      const lat = participant.lat || getDefaultLatForCountry(participant.countryCode);
      const lon = participant.lon || getDefaultLonForCountry(participant.countryCode);
      
      if (lat && lon) {
        const marker = L.marker([lat, lon]).addTo(map);
        
        // Custom popup content
        const popupContent = `
          <div class="p-2">
            <div class="font-bold text-sm text-blue-700">${participant.shortName}</div>
            <div class="text-xs text-gray-600 mb-1">${participant.legalName}</div>
            <div class="text-xs text-gray-500">${participant.country}</div>
            <div class="mt-1">
              <span class="px-2 py-1 text-xs font-semibold rounded-full ${
                participant.role === 'Coordinator' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-green-100 text-green-700'
              }">
                ${participant.role}
              </span>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent);
      }
    });

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [participants]);

  return (
    <div 
      ref={mapRef} 
      className="h-96 w-full rounded-lg border border-border"
      style={{ minHeight: '400px' }}
    />
  );
}

// Helper function to get default coordinates for countries (simplified)
function getDefaultLatForCountry(countryCode: string): number {
  const coords: Record<string, number> = {
    'EL': 37.9838, 'NO': 63.4305, 'ES': 40.4168, 'IT': 41.9028,
    'BE': 51.2194, 'DE': 50.9317, 'FR': 46.6034, 'NL': 52.1326,
    'AT': 47.5162, 'CH': 46.8182, 'PT': 39.3999, 'SE': 60.1282,
    'FI': 61.9241, 'DK': 56.2639, 'PL': 51.9194, 'CZ': 49.8175,
    'HU': 47.1625, 'SK': 48.6690, 'SI': 46.1512, 'HR': 45.1000,
    'BG': 42.7339, 'RO': 45.9432, 'LT': 55.1694, 'LV': 56.8796,
    'EE': 58.5953, 'IE': 53.4129, 'CY': 35.1264, 'MT': 35.9375,
    'LU': 49.8153
  };
  return coords[countryCode] || 50.0;
}

function getDefaultLonForCountry(countryCode: string): number {
  const coords: Record<string, number> = {
    'EL': 23.7275, 'NO': 10.3951, 'ES': -3.7038, 'IT': 12.4964,
    'BE': 4.4025, 'DE': 13.3444, 'FR': 2.2137, 'NL': 5.2913,
    'AT': 14.5501, 'CH': 8.2275, 'PT': -8.2245, 'SE': 18.6435,
    'FI': 25.7482, 'DK': 9.5018, 'PL': 19.1451, 'CZ': 15.4730,
    'HU': 19.5033, 'SK': 19.6990, 'SI': 14.9955, 'HR': 15.2000,
    'BG': 25.4858, 'RO': 24.9668, 'LT': 25.2797, 'LV': 24.6032,
    'EE': 25.0136, 'IE': -8.2439, 'CY': 33.4299, 'MT': 14.3754,
    'LU': 6.1296
  };
  return coords[countryCode] || 10.0;
}

export function ParticipantMap({ project }: ParticipantMapProps) {
  if (!project.participants || project.participants.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            Participant Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No participants data available.</p>
        </CardContent>
      </Card>
    );
  }

  // Group participants by country
  const participantsByCountry = project.participants.reduce((acc, participant) => {
    if (!acc[participant.country]) {
      acc[participant.country] = [];
    }
    acc[participant.country].push(participant);
    return acc;
  }, {} as Record<string, Participant[]>);

  // Calculate country statistics
  const countryStats = Object.entries(participantsByCountry).map(([country, participants]) => ({
    country,
    countryCode: participants[0].countryCode,
    count: participants.length,
    hasCoordinator: participants.some(p => p.role === 'Coordinator'),
    participants
  }));

  // Sort by number of participants (descending)
  countryStats.sort((a, b) => b.count - a.count);

  const totalCountries = countryStats.length;
  const totalParticipants = project.participants.length;
  const coordinatorInfo = project.participants.find(p => p.role === 'Coordinator');

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          Participant Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Interactive Map */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Interactive Map
          </h4>
          <InteractiveMap participants={project.participants} />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {totalParticipants}
            </div>
            <div className="text-xs text-primary font-medium">
              Total Partners
            </div>
          </div>
          
          <div className="text-center p-3 bg-accent/20 rounded-lg">
            <div className="text-2xl font-bold text-accent-foreground">
              {totalCountries}
            </div>
            <div className="text-xs text-accent-foreground font-medium">
              Countries
            </div>
          </div>
          
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <div className="text-2xl font-bold text-secondary-foreground">
              {coordinatorInfo?.countryCode || 'N/A'}
            </div>
            <div className="text-xs text-secondary-foreground font-medium">
              Coordinator
            </div>
          </div>
          
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-muted-foreground">
              EU
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Region
            </div>
          </div>
        </div>

        {/* Country Distribution */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Distribution by Country
          </h4>
          
          <div className="space-y-3">
            {countryStats.map(({ country, countryCode, count, hasCoordinator, participants }) => (
              <div key={country} className="p-4 bg-card/60 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {countryCode}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">{country}</h5>
                      <p className="text-xs text-muted-foreground">
                        {count} {count === 1 ? 'participant' : 'participants'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {hasCoordinator && (
                      <Badge variant="default" className="text-xs">
                        Coordinator
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                </div>
                
                {/* Participants in this country */}
                <div className="space-y-2">
                  {participants.map((participant) => (
                    <div key={participant.no} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{participant.shortName}</span>
                          {participant.role === 'Coordinator' && (
                            <Badge variant="default" className="text-xs">
                              Lead
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {participant.legalName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for dashboard use
interface ParticipantSummaryProps {
  project: EUProject;
}

export function ParticipantSummary({ project }: ParticipantSummaryProps) {
  if (!project.participants || project.participants.length === 0) {
    return null;
  }

  const countries = [...new Set(project.participants.map(p => p.country))];
  const coordinator = project.participants.find(p => p.role === 'Coordinator');

  return (
    <div className="flex items-center gap-2 text-xs">
      <MapPin className="h-3 w-3 text-muted-foreground" />
      <span className="text-muted-foreground">
        {project.participants.length} partners from {countries.length} countries
        {coordinator && ` • Led by ${coordinator.countryCode}`}
      </span>
    </div>
  );
}
