import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Hospital } from '@/types';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import HospitalMap from '@/components/hospitals/HospitalMap';

const HospitalDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hospital, setHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    if (id) {
      const loadHospitalData = async () => {
        try {
          const hospitalResponse = await apiClient.getHospitalById(id);
          setHospital(hospitalResponse as unknown as Hospital);
        } catch (error) {
          setHospital(null);
        }
      };
      loadHospitalData();
    }
  }, [id]);

  if (!hospital) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Hospital Not Found</h1>
          <Link to="/hospitals">
            <Button>Back to Hospitals</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{hospital.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <span>Phone: {hospital.phoneNumber}</span>
                </div>
                {hospital.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Website
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <span>Cost: {hospital.costRange}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex gap-1 flex-wrap mb-2">
                {hospital.types.map((type) => (
                  <Badge key={type} variant="secondary">{type}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg shadow-inner">
              <div className="text-2xl font-bold text-blue-600">{hospital.icus}</div>
              <div className="text-sm text-gray-600">ICU Beds</div>
            </div>
          </div>
        </div>
        <HospitalMap hospitals={[hospital]} className="mt-6 h-[500px] flex flex-1 flex-row" />
      </div>
    </Layout>
  );
};

export default HospitalDetailsPage;
