import React from 'react';
import { Hospital } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, X, Clock, Phone, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HospitalInfoSidebarProps {
  hospital: Hospital | null;
  onClose: () => void;
}

const HospitalInfoSidebar: React.FC<HospitalInfoSidebarProps> = ({ hospital, onClose }) => {
  const navigate = useNavigate();

  if (!hospital) {
    return null;
  }

  const handleViewDetails = () => {
    navigate(`/hospitals/${hospital.id}`);
  };

  return (
    <div className="top-0 right-0 h-full w-96 bg-white shadow-lg z-[1001] flex flex-col transform transition-transform duration-300 ease-in-out">
      <Card className="h-full flex flex-col border-none shadow-none rounded-none">
        <CardHeader className="flex flex-row items-start justify-between p-4 border-b">
          <CardTitle className="text-xl font-bold leading-snug">{hospital.name}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent className="p-4 space-y-4">
            <div className="flex gap-1 flex-wrap">
              {hospital.types.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 text-gray-300`}
                  />
                ))}
              </div>
              {/* No rating in new format, so just show types */}
            </div>
            <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{hospital.phoneNumber}</span>
                </div>
                {hospital.website && (
                    <div className="flex items-center gap-3 text-sm">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {hospital.website}
                        </a>
                    </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <span>Cost: {hospital.costRange}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span>Lat: {hospital.latitude}, Lng: {hospital.longitude}</span>
                </div>
            </div>
          </CardContent>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button onClick={handleViewDetails} className="w-full">
            View Full Details
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HospitalInfoSidebar; 