import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { Hospital, User, TestTube, Building2 } from 'lucide-react';
import { Hospital as HospitalType, Doctor, Department, DiagnosticTest } from '@/types';

const AdminDashboardPage: React.FC = () => {
  const [hospital, setHospital] = useState<HospitalType | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHospitalData();
  }, []);

  const loadHospitalData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would get the hospital ID from the admin's session
      const hospitalId = '1'; // Placeholder
      const [hospitalRes, doctorsRes, departmentsRes, testsRes] = await Promise.all([
        apiClient.getHospital(hospitalId),
        apiClient.getHospitalDoctors(hospitalId),
        apiClient.getHospitalDepartments(hospitalId),
        apiClient.getHospitalTests(hospitalId),
      ]);

      setHospital(hospitalRes.data);
      setDoctors(doctorsRes.data || []);
      setDepartments(departmentsRes.data || []);
      setTests(testsRes.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load hospital data.",
        variant: "destructive",
      });
      // If unauthorized, redirect to admin login
      navigate('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateHospital = async (data: Partial<HospitalType>) => {
    if (!hospital) return;

    try {
      await apiClient.updateHospital(hospital.id.toString(), data);
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

  // const handleAddDoctor = async (data: { doctor_id: number }) => {
  //   if (!hospital) return;

  //   try {
  //     await apiClient.addDoctorToHospital(hospital.id.toString(), data);
  //     toast({
  //       title: "Success",
  //       description: "Doctor added successfully.",
  //     });
  //     loadHospitalData();
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to add doctor.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // const handleAddTest = async (data: { test_id: number; cost: number }) => {
  //   if (!hospital) return;

  //   try {
  //     await apiClient.addTestToHospital(hospital.id.toString(), data);
  //     toast({
  //       title: "Success",
  //       description: "Test added successfully.",
  //     });
  //     loadHospitalData();
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to add test.",
  //       variant: "destructive",
  //     });
  //   }
  // };

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

  if (isLoading || !hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hospital Admin Dashboard</h1>
          <Button variant="outline" onClick={() => navigate('/admin/login')}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="hospital" className="space-y-8">
          <TabsList>
            <TabsTrigger value="hospital">Hospital Info</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
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
                    <Label>Address</Label>
                    <Input
                      defaultValue={hospital.address}
                      onChange={(e) => handleUpdateHospital({ address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      defaultValue={hospital.phone_number}
                      onChange={(e) => handleUpdateHospital({ phone_number: e.target.value })}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Doctor</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate('/admin/doctors/new')}>
                    Add Doctor
                  </Button>
                </CardContent>
              </Card>

              {doctors.map((doctor) => (
                <Card key={doctor.id}>
                  <CardHeader>
                    <CardTitle>{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>Email: {doctor.email}</div>
                      <div>Phone: {doctor.phone_number}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="departments">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate('/admin/departments/new')}>
                    Add Department
                  </Button>
                </CardContent>
              </Card>

              {departments.map((department) => (
                <Card key={department.id}>
                  <CardHeader>
                    <CardTitle>{department.name}</CardTitle>
                    <CardDescription>{department.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>Head Doctor: {department.head_doctor_name}</div>
                      <div>Contact: {department.contact_number}</div>
                      <div>Beds: {department.beds}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tests">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate('/admin/tests/new')}>
                    Add Test
                  </Button>
                </CardContent>
              </Card>

              {tests.map((test) => (
                <Card key={test.id}>
                  <CardHeader>
                    <CardTitle>{test.name}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>Cost: ৳{test.cost}</div>
                      <div>Status: {test.availability}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 