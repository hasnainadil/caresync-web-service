import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { UserResponse } from "@/types";
import Layout from "@/components/Layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Mail, User as UserIcon, MapPin, Edit2, Save, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FEEDBACK_TARGET_TYPE, FeedbackResponse } from "@/types";
import { Trash2 } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const auth = useAuth();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activities, setActivities] = useState<FeedbackResponse[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [targetNames, setTargetNames] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const userIdToFetch = userId || auth.user.uid;
        const data = await apiClient.getUserById(userIdToFetch);
        setProfile(data);
        setForm({
          name: data.name,
          email: data.email,
          password: "",
        });
      } catch (err: any) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [auth.user, userId]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!profile) return;
      setActivitiesLoading(true);
      try {
        const feedbacks = await apiClient.getUserFeedbacks(profile.id);
        setActivities(feedbacks);
        // Fetch hospital/doctor names for each feedback
        const names: { [key: number]: string } = {};
        await Promise.all(
          feedbacks.map(async (fb) => {
            if (fb.targetType === FEEDBACK_TARGET_TYPE.HOSPITAL) {
              try {
                const h = await apiClient.getHospitalById(
                  fb.targetId.toString()
                );
                names[fb.id] = h.name;
              } catch {
                // Handle error
              }
            } else if (fb.targetType === FEEDBACK_TARGET_TYPE.DOCTOR) {
              try {
                const d = await apiClient.getDoctorById(fb.targetId);
                names[fb.id] = d.name;
              } catch {
                // Handle error
              }
            }
          })
        );
        setTargetNames(names);
      } catch (err) {
        // ignore
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchActivities();
  }, [profile]);

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
        passwordHash: form.password, // send as plain text, backend will hash
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

  const handleDeleteFeedback = async (feedbackId: number) => {
    if (!auth.user) return;
    await apiClient.deleteFeedbackById(feedbackId, auth.user.uid);
    setActivities((prev) => prev.filter((f) => f.id !== feedbackId));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  if (!profile)
    return (
      <div className="text-red-500 text-center mt-8">
        User not authenticated or profile not found.
      </div>
    );

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
            <CardTitle className="text-2xl font-bold text-blue-900">
              {displayName}
            </CardTitle>
            <CardDescription className="text-gray-600">
              User Profile
            </CardDescription>
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
                  {location && (
                    <div className="flex flex-wrap gap-2 translate-y-[2px]">
                      <Badge variant="secondary">{location.address}</Badge>
                      <Badge variant="secondary">Thana: {location.thana}</Badge>
                      <Badge variant="secondary">PO: {location.po}</Badge>
                      <Badge variant="secondary">City: {location.city}</Badge>
                      <Badge variant="secondary">
                        Postal: {location.postalCode}
                      </Badge>
                      <Badge variant="secondary">Zone: {location.zoneId}</Badge>
                    </div>
                  )}
                  {!location && (
                    <span className="text-gray-500">No location found</span>
                  )}
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mt-2"
              >
                <label className="font-semibold">
                  Name
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </label>
                <label className="font-semibold">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </label>
                <label className="font-semibold">
                  Password
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
                  <Button
                    type="submit"
                    variant="default"
                    disabled={loading}
                    className="flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <Separator className="mt-2" />
          <CardFooter className="flex justify-between translate-y-3">
            {auth.user.uid === profile.id && (
              <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    id="delete-account-button"
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your account? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        id="delete-account-confirm-button"
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {!editMode && auth.user.uid === profile.id && (
              <Button
                variant="secondary"
                onClick={handleEdit}
                className="flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      {/* Activities Section */}
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Activities</h2>
        {activitiesLoading ? (
          <div className="text-gray-500">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="text-gray-500">No feedbacks yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {activities.map((fb) => {
              const initials = (profile.name || profile.email || "U")
                .slice(0, 2)
                .toUpperCase();
              const dateStr = new Date(fb.createdAt).toLocaleDateString(
                undefined,
                { year: "numeric", month: "short", day: "numeric" }
              );
              const showReadMore = fb.comment && fb.comment.length > 120;
              const targetLabel =
                fb.targetType === FEEDBACK_TARGET_TYPE.HOSPITAL
                  ? "Hospital"
                  : "Doctor";
              return (
                <div
                  key={fb.id}
                  className="border-2 border-blue-200 rounded-lg shadow-lg bg-white p-5 space-y-2 relative"
                >
                  <div className="absolute top-2 right-2 text-gray-800 font-semibold text-sm md:text-base flex items-center gap-2">
                    <span>{dateStr}</span>
                    {auth.user.uid === profile.id && (
                      <button
                        className="ml-auto text-xs bg-red-50 text-red-500 px-2 py-1 rounded flex items-center gap-1 hover:bg-red-100"
                        onClick={() => handleDeleteFeedback(fb.id)}
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mb-1">
                    <div className="h-12 w-12 flex items-center justify-center bg-blue-500 text-white text-lg font-semibold rounded-full">
                      {initials}
                    </div>
                    <div>
                      <div className="text-gray-900 font-medium leading-tight">
                        {profile.name || profile.email}
                      </div>
                      <div className="text-xs text-black shadow-inner p-1 rounded-lg bg-blue-100 mt-[5px]">
                        {targetLabel}: {targetNames[fb.id] || fb.targetId}
                      </div>
                    </div>
                  </div>
                  <div className="flex text-yellow-500 text-2xl mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < fb.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-snug text-base">
                    {showReadMore
                      ? fb.comment.slice(0, 120) + "..."
                      : fb.comment}
                  </p>
                  {showReadMore && (
                    <div className="text-blue-500 font-medium cursor-pointer hover:underline">
                      Read more
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
