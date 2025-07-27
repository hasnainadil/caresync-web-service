import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import HomePage from "./pages/HomePage";
import HospitalsPage from "./pages/HospitalsPage";
import HospitalDetailsPage from "./pages/HospitalDetailsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import RegisterForm from "./components/auth/RegisterForm";
import VerifyOtpForm from "./components/auth/VerifyOtpForm";
import LoginForm from "./components/auth/LoginForm";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/test";
import ProfilePage from "@/pages/ProfilePage";
import DoctorProfilePage from "@/pages/DoctorProfilePage";
import DoctorsPage from "@/pages/DoctorsPage";
import AdminDashboardLayout from "./pages/admin/AdminDashboardLayout";
import AddHospitalPage from "./pages/admin/AddHospitalPage";
import UpdateHospitalPage from "./pages/admin/UpdateHospitalPage";
import AddDoctorPage from "./pages/admin/AddDoctorPage";
import UpdateDoctorPage from "./pages/admin/UpdateDoctorPage";
import UpdateHospitalList from "./pages/admin/UpdateHospitalList";
import UpdateDoctorList from "./pages/admin/UpdateDoctorList";
import RegisterFormAdmin from "./components/auth/RegisterAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/hospitals/:id" element={<HospitalDetailsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/register/admin" element={<RegisterFormAdmin />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/doctor/:doctorId" element={<DoctorProfilePage />} />
            <Route path="/test" element={<TestPage />} />
            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminDashboardLayout />}>
              <Route path="add-hospital" element={<AddHospitalPage />} />
              <Route path="update-hospital">
                <Route index element={<UpdateHospitalList />} />
                <Route path=":id" element={<UpdateHospitalPage />} />
              </Route>
              <Route path="add-doctor" element={<AddDoctorPage />} />
              <Route path="update-doctor">
                <Route index element={<UpdateDoctorList />} />
                <Route path=":id" element={<UpdateDoctorPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
