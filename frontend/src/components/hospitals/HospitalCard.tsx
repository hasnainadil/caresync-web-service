import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hospital } from '@/types';
import { MapPin, Building2, Hash } from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
  return (
    <Link to={`/hospitals/${hospital.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{hospital.name}</CardTitle>
            <div className="flex gap-1 flex-wrap">
              {hospital.types.map((type) => (
                <Badge key={type} variant="outline" className="w-fit">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                <span>Phone: {hospital.phoneNumber}</span>
              </div>
              <div className="flex items-center">
                <Hash className="h-4 w-4 mr-1" />
                <span>ICUs: {hospital.icus}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span>Cost: {hospital.costRange}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default HospitalCard;
