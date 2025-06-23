import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hospital } from '@/types';
import { MapPin, Navigation, Phone, Globe, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import RoutingMachine from './RoutingMachine';
import HospitalInfoSidebar from './HospitalInfoSidebar';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map resizing
const MapResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    const mapContainer = map.getContainer();
    resizeObserver.observe(mapContainer);
    return () => {
      resizeObserver.unobserve(mapContainer);
    };
  }, [map]);
  return null;
};

// Custom icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">🏥</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      background-color: #3b82f6;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface LocationMarkerProps {
  position: [number, number];
  hospitals: Hospital[];
  onHospitalClick: (hospital: Hospital) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, hospitals, onHospitalClick }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      // Delay resizing to ensure container is visible
      setTimeout(() => {
        map.invalidateSize();
        map.setView(position, 13);
      }, 200);
    }
  }, [position, map]);

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  return (
    <>
      {/* User location marker */}
      <Marker position={position} icon={userLocationIcon}>
        <Popup>
          <div className="text-center">
            <p className="font-semibold">Your Location</p>
            <p className="text-sm text-gray-600">
              {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </p>
          </div>
        </Popup>
      </Marker>

      {/* User location accuracy circle */}
      <Circle
        center={position}
        radius={100}
        pathOptions={{
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
        }}
      />

      {/* Hospital markers */}
      {hospitals.map((hospital) => (
        <Marker
          key={hospital.id}
          position={[hospital.latitude, hospital.longitude]}
          icon={createCustomIcon('#10b981')}
          eventHandlers={{
            click: () => onHospitalClick(hospital),
          }}
        >
          <Tooltip sticky>
            <div className="text-sm font-semibold">
              {hospital.types.join(', ')}<br />
              Cost: {hospital.costRange}
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
};

interface HospitalMapProps {
  hospitals: Hospital[];
  className?: string;
}

const HospitalMap: React.FC<HospitalMapProps> = ({ hospitals, className = '' }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [sortedHospitals, setSortedHospitals] = useState<Hospital[]>(hospitals);
  const [route, setRoute] = useState<{ start: [number, number]; end: [number, number] } | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const navigate = useNavigate();
  const mapRef = useRef<L.Map>(null);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Sort hospitals by distance when user location is available
  useEffect(() => {
    if (userLocation && hospitals.length > 0) {
      const hospitalsWithDistance = hospitals.map(hospital => ({
        ...hospital,
        distance: calculateDistance(
          userLocation[0],
          userLocation[1],
          hospital.latitude,
          hospital.longitude
        )
      }));

      const sorted = hospitalsWithDistance.sort((a, b) =>
        (a.distance || 0) - (b.distance || 0)
      );

      setSortedHospitals(sorted);
    } else {
      setSortedHospitals(hospitals);
    }
  }, [userLocation, hospitals]);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location');
          // Default to a fallback location (e.g., city center)
          setUserLocation([23.7937, 90.4066]); // Dhaka, Bangladesh
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser');
      setUserLocation([23.7937, 90.4066]); // Fallback location
    }
  }, []);

  const handleHospitalClick = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    if (userLocation) {
      setRoute({ start: userLocation, end: [hospital.latitude, hospital.longitude] });
      toast({
        title: "Route Calculated",
        description: `Showing directions to ${hospital.name}.`,
      });
    }
  };

  const handleCloseSidebar = () => {
    setSelectedHospital(null);
    setRoute(null);
  };

  const handleCenterOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo(userLocation, 13, {
        duration: 1.5
      });
      toast({
        title: "Map has been centered on your current position",
      });
    }
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  // Determine dynamic height for mobile view
  const mobileHeight = selectedHospital ? 'h-[1100px]' : 'h-[700px]';

  if (!userLocation) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
          {locationError && (
            <p className="text-sm text-red-500 mt-2">{locationError}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={` w-full rounded-lg flex flex-col md:flex-row flex-1 ${mobileHeight} md:h-[600px] ${className}`}>
      <div className='relative flex flex-col h-full w-full'>
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-[1000] space-y-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCenterOnUser}
            className="shadow-lg"
          >
            <MapPin className="w-4 h-4 mr-2" />
            My Location
          </Button>
        </div>

        {/* Map Stats */}
        <div className="absolute top-4 left-11 z-[1000]">
          <Card className="shadow-lg">
            <CardContent className="p-3">
              <div className="text-sm">
                <p className="font-semibold">{sortedHospitals.length} hospitals nearby</p>
                <p className="text-gray-600">Sorted by distance</p>
                {sortedHospitals.length > 0 && 'distance' in sortedHospitals[0] && (
                  <p className="text-xs text-blue-600">
                    Nearest: {formatDistance((sortedHospitals[0] as any).distance)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <MapContainer
          ref={mapRef}
          center={userLocation}
          zoom={13}
          className="h-[700px] md:h-[600px] w-full rounded-lg"
          zoomControl={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          boxZoom={true}
          keyboard={true}
          dragging={true}
          touchZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapResizeHandler />

          <LocationMarker
            position={userLocation}
            hospitals={sortedHospitals}
            onHospitalClick={handleHospitalClick}
          />

          {route && <RoutingMachine start={route.start} end={route.end} />}
        </MapContainer>
      </div>
      <HospitalInfoSidebar hospital={selectedHospital} onClose={handleCloseSidebar} />
    </div>
  );
};

export default HospitalMap; 