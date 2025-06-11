
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HospitalLocation } from '@/types';
import { MapPin, Building2, Hash } from 'lucide-react';

interface HospitalCardProps {
  hospital: HospitalLocation;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
  return (
    <Link to={`/hospitals/${hospital.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Hospital #{hospital.id}</CardTitle>
            <Badge variant="outline" className="w-fit">
              {hospital.locationType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start text-gray-600">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div>{hospital.address}</div>
                <div className="text-gray-500">
                  {hospital.thana}, {hospital.po}, {hospital.city}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                <span>Postal: {hospital.postalCode}</span>
              </div>
              <div className="flex items-center">
                <Hash className="h-4 w-4 mr-1" />
                <span>Zone: {hospital.zoneId}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default HospitalCard;
