import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api_dummy';
import { Hospital, User, TestTube, Building2 } from 'lucide-react';
import { Hospital as HospitalType, Doctor, DiagnosticTest, Rating } from '@/types';
import Layout from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddDepartmentDialog from '@/components/admin/AddDepartmentDialog';
import AddTestDialog from '@/components/admin/AddTestDialog';
import EditTestDialog from '@/components/admin/EditTestDialog';
import AddHospitalSection from '@/components/admin/AddHospital';

const AdminDashboardPage: React.FC = () => {
  const { hospitalId: hospitalIdFromUrl } = useParams<{ hospitalId: string }>();
  // For now, we'll default to hospital '1' if no ID is in the URL.
  const hospitalId = hospitalIdFromUrl || '1';

  const [hospital, setHospital] = useState<HospitalType | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState([]);
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHospitalData();
  }, [hospitalId]);

  const loadHospitalData = async () => {
    if (!hospitalId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [
        hospitalRes,
        doctorsRes,
        testsRes,
        ratingsRes,
      ] = await Promise.all([
        apiClient.getHospital(hospitalId),
        apiClient.getHospitalDoctors(hospitalId),
        apiClient.getHospitalTests(hospitalId),
        apiClient.getHospitalRatings(hospitalId),
      ]);

      setHospital(hospitalRes.data);
      setDoctors(doctorsRes.data || []);
      setTests(testsRes.data || []);
      setRatings(ratingsRes.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load hospital data.",
        variant: "destructive",
      });
      // If unauthorized, redirect to admin login
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateHospital = async (data: Partial<HospitalType>) => {
    if (!hospital) return;
    try {
      await apiClient.updateHospital({ ...hospital, ...data });
      toast({
        title: "Success",
        description: "Hospital information updated successfully.",
      });
      loadHospitalData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update hospital information.",
        variant: "destructive",
      });
    }
  };

  const handleAddDepartment = async (data: { department_id: number }) => {
    if (!hospital) return;

    try {
      await apiClient.addDepartmentToHospital(hospital.id.toString(), {
        department_id: data.department_id,
        head_doctor_id: 0, // You'll need to get this from form input
        contact_number: "",
        beds: 0,
        available_days: []
      });
      toast({
        title: "Success",
        description: "Department added successfully.",
      });
      loadHospitalData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add department.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!hospital) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600">Could not load hospital data.</h2>
            <p className="text-gray-600 mt-2">
              Please ensure you are logged in with a valid administrator account.
            </p>
            <Button onClick={() => navigate('/admin/login')} className="mt-4">
              Go to Admin Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">


        <Tabs defaultValue="addHospital" className="space-y-8">
          <TabsList>
            {/* <TabsTrigger value="hospital">Hospital Info</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger> */}
            <TabsTrigger value="addHospital">Add Hospital</TabsTrigger>
          </TabsList>

          <TabsContent value="hospital">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Information</CardTitle>
                <CardDescription>Update your hospital's details</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hospital Name</Label>
                    <Input
                      defaultValue={hospital.name}
                      onChange={(e) => handleUpdateHospital({ name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      defaultValue={hospital.phoneNumber}
                      onChange={(e) => handleUpdateHospital({ phoneNumber: e.target.value })}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Doctors</CardTitle>
                  <CardDescription>
                    Manage the doctors at your hospital.
                  </CardDescription>
                </div>
                <Button onClick={() => navigate(`/admin/dashboard/${hospitalId}/add-doctor`)}>
                  Add Doctor
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctors.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.specialty}</TableCell>
                        <TableCell>{doc.phone_number}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Departments</CardTitle>
                  <CardDescription>
                    Manage your hospital's departments.
                  </CardDescription>
                </div>
                <AddDepartmentDialog hospitalId={hospitalId!} onDepartmentAdded={loadHospitalData} />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Head Doctor</TableHead>
                      <TableHead>Beds</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell>{dept.name}</TableCell>
                        <TableCell>{dept.head_doctor_name}</TableCell>
                        <TableCell>{dept.beds}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Diagnostic Tests</CardTitle>
                  <CardDescription>
                    Manage the tests available at your hospital.
                  </CardDescription>
                </div>
                <AddTestDialog hospitalId={hospitalId!} onTestAdded={loadHospitalData} />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell>{test.name}</TableCell>
                        <TableCell>${test.cost}</TableCell>
                        <TableCell>{test.availability}</TableCell>
                        <TableCell className="text-right">
                          <EditTestDialog
                            hospitalId={hospitalId!}
                            test={test}
                            onTestUpdated={loadHospitalData}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addHospital">
            <AddHospitalSection onHospitalAdded={loadHospitalData} />
          </TabsContent>
        </Tabs>

        {/* Ratings and Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle>Ratings and Reviews</CardTitle>
            <CardDescription>
              View patient feedback and ratings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ratings.map((rating) => (
                  <TableRow key={rating.id}>
                    <TableCell>{rating.user_name}</TableCell>
                    <TableCell>{rating.rating}/5</TableCell>
                    <TableCell>{rating.review_text}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage; 