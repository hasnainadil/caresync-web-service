import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Link } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';
import { deleteUser } from 'firebase/auth';
import { LOCATION_TYPE, ROLE } from '@/types';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    thana: '',
    po: '',
    city: '',
    postalCode: '',
    zoneId: '',
    role: ROLE.DEFAULT,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, register with Firebase
      const result = await signUp(formData.email, formData.password);
      if (result.user) {
        try {
          // Get the access token
          const accessToken = await result.user.getIdToken();
          // Register with backend
          await apiClient.registerUser({
            userId: result.user.uid,
            role: formData.role,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            location: {
              locationType: LOCATION_TYPE.USER,
              address: formData.address,
              thana: formData.thana,
              po: formData.po,
              city: formData.city,
              postalCode: parseInt(formData.postalCode),
              zoneId: parseInt(formData.zoneId),
            },
          });
          toast({
            title: "Registration successful!",
            description: "You can now log in to your account.",
          });
          navigate('/login');
        } catch (error) {
          // If backend registration fails, delete the Firebase user
          try {
            await deleteUser(result.user);
          } catch (deleteError) {
            console.error('Error deleting Firebase user:', deleteError);
          }

          toast({
            title: "Registration failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        console.log(result.error);
        toast({
          title: "Registration failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Join CareSync to find the best healthcare</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thana">Thana</Label>
                <Input
                  id="thana"
                  name="thana"
                  type="text"
                  required
                  value={formData.thana}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="po">Post Office</Label>
                <Input
                  id="po"
                  name="po"
                  type="text"
                  required
                  value={formData.po}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>            {/* Fourth Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  type="number"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zoneId">Zone ID</Label>
                <Input
                  id="zoneId"
                  name="zoneId"
                  type="number"
                  required
                  value={formData.zoneId}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Register as</Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value={ROLE.DEFAULT}>User</option>
                  {/* <option value={ROLE.ADMIN}>Admin</option> */}
                </select>
              </div>
            </div>
            <div className='flex justify-between align-middle'>
              <Link to="/login" className=' rounded-md text-black px-4 py-2 mt-6 flex gap-2'>
                <MoveLeft size={24} className='translate-y-[3px]' />
                Back to Login
              </Link>
              <Button type="submit" className="w-fit mt-6" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
