import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hospital } from '@/types';
import { apiClient } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { MapPin, Phone, Globe } from 'lucide-react';
import HospitalMap from '@/components/hospitals/HospitalMap';

const HospitalDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadHospitalData();
    }
  }, [id]);

  const loadHospitalData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      // Load hospital details using the real API
      const hospitalData = await apiClient.getHospitalById(id);
      setHospital(hospitalData);
    } catch (error) {
      console.error('Error loading hospital:', error);
      toast({
        title: "Error",
        description: "Failed to load hospital details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading hospital details...</div>
        </div>
      </Layout>
    );
  }

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
        {/* Hospital Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{hospital.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{hospital.phoneNumber}</span>
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
                {hospital.types?.map((type) => (
                  <Badge key={type} variant="secondary">{type}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg shadow-inner">
              <div className="text-2xl font-bold text-blue-600">{hospital.icus}</div>
              <div className="text-sm text-gray-600">ICU Beds</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg shadow-inner">
              <div className="text-2xl font-bold text-green-600">{hospital.costRange}</div>
              <div className="text-sm text-gray-600">Cost Range</div>
            </div>
          </div>
        </div>

        {/* Location Information */}
        {hospital.locationResponse && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Address:</strong> {hospital.locationResponse.address}</p>
                  <p><strong>Thana:</strong> {hospital.locationResponse.thana}</p>
                  <p><strong>PO:</strong> {hospital.locationResponse.po}</p>
                </div>
                <div>
                  <p><strong>City:</strong> {hospital.locationResponse.city}</p>
                  <p><strong>Postal Code:</strong> {hospital.locationResponse.postalCode}</p>
                  <p><strong>Zone ID:</strong> {hospital.locationResponse.zoneId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle>Hospital Location</CardTitle>
            <CardDescription>View the hospital on the map</CardDescription>
          </CardHeader>
          <CardContent>
            <HospitalMap hospitals={[hospital]} className="h-96" />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default HospitalDetailsPage;
