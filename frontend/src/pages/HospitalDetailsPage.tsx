import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hospital, Doctor, Department, DiagnosticTest, Rating } from '@/types';
import { apiClient } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { MapPin, Phone, Star, Globe, User, Calendar } from 'lucide-react';
import RatingForm from '@/components/ratings/RatingForm';
import BookAppointmentDialog from '@/components/appointments/BookAppointmentDialog';
import { useAuth } from '@/contexts/AuthContext';

const HospitalDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      loadHospitalData();
    }
  }, [id]);

  const loadHospitalData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      // Load hospital details
      const hospitalResponse = await apiClient.getHospital(id);
      setHospital(hospitalResponse.data as Hospital);

      // Load related data
      const [doctorsRes, departmentsRes, testsRes, ratingsRes] = await Promise.all([
        apiClient.getHospitalDoctors(id),
        apiClient.getHospitalDepartments(id),
        apiClient.getHospitalTests(id),
        apiClient.getHospitalRatings(id)
      ]);

      setDoctors((doctorsRes.data as Doctor[]) || []);
      setDepartments((departmentsRes.data as Department[]) || []);
      setTests((testsRes.data as DiagnosticTest[]) || []);
      setRatings((ratingsRes.data as Rating[]) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load hospital details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const handleRatingAdded = () => {
    if (id) {
      // Reload ratings after adding a new one
      apiClient.getHospitalRatings(id).then(response => {
        setRatings((response.data as Rating[]) || []);
      });
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
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{hospital.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{hospital.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{hospital.phone_number}</span>
                </div>
                {hospital.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-xl font-semibold">{hospital.rating}</span>
              </div>
              <Badge variant="secondary">{hospital.type}</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{hospital.icus || 0}</div>
              <div className="text-sm text-gray-600">ICU Beds</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{doctors.length}</div>
              <div className="text-sm text-gray-600">Doctors</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{departments.length}</div>
              <div className="text-sm text-gray-600">Departments</div>
            </div>
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="doctors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <Card key={doctor.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{doctor.phone_number}</span>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Link to={`/doctors/${doctor.id}`}>
                          <Button variant="outline" size="sm">
                            <User className="h-4 w-4 mr-1" />
                            View Profile
                          </Button>
                        </Link>
                        <Button size="sm" onClick={() => handleBookAppointment(doctor)}>
                          <Calendar className="h-4 w-4 mr-1" />
                          Book
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((department) => (
                <Card key={department.id}>
                  <CardHeader>
                    <CardTitle>{department.name}</CardTitle>
                    <CardDescription>{department.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div><strong>Head Doctor:</strong> {department.head_doctor_name}</div>
                      <div><strong>Contact:</strong> {department.contact_number}</div>
                      <div><strong>Beds:</strong> {department.beds}</div>
                      {department.available_days && (
                        <div><strong>Available:</strong> {department.available_days.join(', ')}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map((test) => (
                <Card key={test.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-green-600">৳{test.cost}</div>
                      <Badge variant={test.availability === 'available' ? 'default' : 'secondary'}>
                        {test.availability}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <RatingForm hospitalId={hospital.id} onRatingAdded={handleRatingAdded} />
            
            <div className="space-y-4">
              {ratings.map((rating) => (
                <Card key={rating.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold">{rating.user_name}</div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-500">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </div>
                        {user && rating.user_id === user.id && (
                          <RatingForm
                            hospitalId={hospital.id}
                            onRatingAdded={handleRatingAdded}
                            existingRating={rating}
                          />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700">{rating.review_text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {showBooking && selectedDoctor && (
          <BookAppointmentDialog
            doctor={selectedDoctor}
            hospital={hospital}
            isOpen={showBooking}
            onClose={() => setShowBooking(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default HospitalDetailsPage;
