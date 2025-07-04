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
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AddDoctorPage from "./pages/admin/AddDoctorPage";
import TestPage from "./pages/test";
import ProfilePage from "@/pages/ProfilePage";

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
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/verify-otp" element={<VerifyOtpForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/admin/dashboard/:hospitalId" element={<AdminDashboardPage />} />
            <Route path="/admin/dashboard/:hospitalId/add-doctor" element={<AddDoctorPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
