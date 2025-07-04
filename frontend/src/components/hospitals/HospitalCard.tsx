import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hospital, HOSPITAL_TYPE, COST_RANGE } from '@/types';
import { MapPin, Building2, Hash } from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
}

const formatHospitalType = (type: HOSPITAL_TYPE): string => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const formatCostRange = (costRange: COST_RANGE): string => {
  const costMap = {
    [COST_RANGE.VERY_LOW]: "Very Low",
    [COST_RANGE.LOW]: "Low",
    [COST_RANGE.MODERATE]: "Moderate",
    [COST_RANGE.HIGH]: "High",
    [COST_RANGE.VERY_HIGH]: "Very High"
  };
  return costMap[costRange] || costRange;
};

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
  return (
    <Link to={`/hospitals/${hospital.id}`} className="block h-full">
      <Card className="relative h-full border-l-8 border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-2xl hover:scale-[1.025] transition-all duration-200 cursor-pointer group overflow-hidden flex flex-col justify-between shadow-md">
        {/* Decorative background */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-30 pointer-events-none z-0" />
        <CardHeader className="z-10 relative pb-2 p-2">
          <div className="flex flex-col justify-between items-start">
            <div className="flex gap-1 flex-wrap justify-end w-full">
              {hospital.types.map((type) => (
                <Badge key={type} variant="outline" className="w-fit border-blue-300 bg-white text-blue-700 font-semibold px-2 py-1 shadow-inner">
                  {formatHospitalType(type)}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
              {hospital.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="z-10 relative pt-0 p-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4 mr-1 text-blue-400" />
                <span className="font-medium">Phone:</span>
                <span className="ml-1 text-gray-800">{hospital.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-1">
                <Hash className="h-4 w-4 mr-1 text-blue-400" />
                <span className="font-medium">ICUs:</span>
                <span className="ml-1 text-gray-800">{hospital.icus}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-blue-700">Cost:</span>
              <Badge variant="secondary" className="bg-white text-cyan-700 border-cyan-200 px-2 py-1 font-semibold shadow-inner text-sm">
                {formatCostRange(hospital.costRange)}
              </Badge>  
            </div>
            {hospital.locationResponse && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="font-medium">Location:</span>
                <span className="ml-1 text-gray-800">{hospital.locationResponse.city}, {hospital.locationResponse.thana}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default HospitalCard;
