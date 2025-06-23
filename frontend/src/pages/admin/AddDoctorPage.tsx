import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api_dummy';
import { Department } from '@/types';
import Layout from '@/components/Layout';
import { useNavigate, useParams } from 'react-router-dom';

const doctorSchema = z.object({
  name: z.string().min(3, 'Doctor name must be at least 3 characters long'),
  email: z.string().email('Please enter a valid email'),
  phone_number: z.string().min(1, 'Phone number is required'),
  specialties: z.string().min(1, 'Please enter at least one specialty'),
  department_id: z.string().min(1, 'Please select a department'),
  appointment_fee: z.coerce.number().min(0, 'Fee must be a positive number'),
  weekly_schedule: z.string().min(1, 'Weekly schedule is required'),
});

const AddDoctorPage: React.FC = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);

  const form = useForm<z.infer<typeof doctorSchema>>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      specialties: '',
      department_id: '',
      appointment_fee: 0,
      weekly_schedule: 'Sun - Thu, 6pm - 9pm',
    },
  });

  useEffect(() => {
    if (hospitalId) {
      const fetchDepartments = async () => {
        try {
          const response = await apiClient.getHospitalDepartments(hospitalId);
          setDepartments(response.data);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Could not fetch departments for the hospital.',
            variant: 'destructive',
          });
        }
      };
      fetchDepartments();
    }
  }, [hospitalId]);

  const onSubmit = async (values: z.infer<typeof doctorSchema>) => {
    if (!hospitalId) return;

    const dataToSend = {
      ...values,
      specialties: values.specialties.split(',').map(s => s.trim()),
    };

    try {
      await apiClient.addDoctorToHospital(hospitalId, dataToSend);
      toast({
        title: 'Doctor Added',
        description: `Dr. ${values.name} has been successfully added.`,
      });
      navigate(`/admin/dashboard/${hospitalId}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add the new doctor. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Doctor</CardTitle>
            <CardDescription>
              Enter the details for the new doctor and their schedule at this hospital.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dr. Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 01xxxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialties"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialties</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Cardiology, Pediatrics (comma-separated)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={String(dept.id)}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appointment_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Fee</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weekly_schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekly Schedule</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the doctor's weekly availability and hours."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end pt-4 space-x-2">
                   <Button variant="outline" type="button" onClick={() => navigate(`/admin/dashboard/${hospitalId}`)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Doctor'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddDoctorPage; 