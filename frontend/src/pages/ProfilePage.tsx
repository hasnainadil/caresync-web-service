import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { UserResponse } from "@/types";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Mail, User as UserIcon, MapPin, Edit2, Save, X } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const auth = useAuth();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const userId = auth.user.uid;
        const data = await apiClient.getUserById(userId);
        setProfile(data);
        setForm({
          name: data.name,
          email: data.email,
          password: ""
        });
      } catch (err: any) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [auth.user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    if (profile) {
      setForm({ name: profile.name, email: profile.email, password: "" });
    }
    setEditMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user) return;
    setLoading(true);
    try {
      await apiClient.updateUser({
        id: auth.user.uid,
        name: form.name,
        email: form.email,
        passwordHash: form.password // send as plain text, backend will hash
      });
      toast.success("Profile updated successfully");
      setEditMode(false);
      // Refresh profile
      const data = await apiClient.getUserById(auth.user.uid);
      setProfile(data);
      setForm({ name: data.name, email: data.email, password: "" });
    } catch (err: any) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.user) return;
    setLoading(true);
    try {
      // 1. Delete from backend
      await apiClient.deeleteUserById(auth.user.uid);
      // 2. Delete from Firebase
      await deleteUser(auth.user);
      toast.success("Account deleted successfully");
      // 3. Log out and redirect
      await auth.logout();
      navigate("/");
    } catch (err: any) {
      console.log("error");
      console.log(err);
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!profile) return <div className="text-red-500 text-center mt-8">User not authenticated or profile not found.</div>;

  const location = profile.locationResponse;
  const avatarUrl = auth.user?.photoURL;
  const displayName = profile.name || auth.user?.displayName || profile.email;

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-xl shadow-xl border-2 border-blue-100 rounded-2xl">
          <CardHeader className="flex flex-col items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-t-2xl">
            <Avatar className="h-20 w-20 mb-2 border-2 border-blue-300 shadow-md">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={displayName} />
              ) : (
                <AvatarFallback>
                  <UserIcon className="w-10 h-10 text-blue-400" />
                </AvatarFallback>
              )}
            </Avatar>
            <CardTitle className="text-2xl font-bold text-blue-900">{displayName}</CardTitle>
            <CardDescription className="text-gray-600">User Profile</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {!editMode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">Email:</span>
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">Location:</span>
                  <div className="flex flex-wrap gap-2 translate-y-[2px]">
                    <Badge variant="secondary">{location.address}</Badge>
                    <Badge variant="secondary">Thana: {location.thana}</Badge>
                    <Badge variant="secondary">PO: {location.po}</Badge>
                    <Badge variant="secondary">City: {location.city}</Badge>
                    <Badge variant="secondary">Postal: {location.postalCode}</Badge>
                    <Badge variant="secondary">Zone: {location.zoneId}</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                <label className="font-semibold">Name
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </label>
                <label className="font-semibold">Email
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </label>
                <label className="font-semibold">Password
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    placeholder="Enter password"
                  />
                </label>
                <div className="flex gap-2 mt-2">
                  <Button type="submit" variant="default" disabled={loading} className="flex items-center gap-1">
                    <Save className="w-4 h-4" /> Save
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} className="flex items-center gap-1">
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <Separator className="mt-2" />
          <CardFooter className="flex justify-between translate-y-3">
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button id="delete-account-button" variant="destructive" onClick={() => setShowDeleteDialog(true)} className="flex items-center gap-1">
                  <X className="w-4 h-4" /> Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete your account? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button id="delete-account-confirm-button" variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
                      Delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {!editMode && (
              <Button variant="secondary" onClick={handleEdit} className="flex items-center gap-1">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage; 