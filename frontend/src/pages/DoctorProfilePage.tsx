// DoctorProfilePage.tsx
// Doctor Profile Page: Shows doctor info and associated hospitals
// Usage: Route as /doctor/:id

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@/lib/api";
import { format } from "date-fns";
import { DoctorResponse, HospitalResponse } from "@/types";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, User as UserIcon, Stethoscope, MapPin, Hospital as HospitalIcon, Globe, ExternalLink } from "lucide-react";

const DoctorProfilePage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [doctor, setDoctor] = useState<DoctorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hospitalDetails, setHospitalDetails] = useState<Record<number, any>>({});

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      setLoading(true);
      setError(null);
      try {
        const doc = await apiClient.getDoctorById(doctorId);
        setDoctor(doc);
        // Fetch hospital details for each doctorHospital
        const uniqueHospitalIds = Array.from(new Set(doc.doctorHospitals.map(dh => dh.hospitalId)));
        const details: Record<number, any> = {};
        await Promise.all(
          uniqueHospitalIds.map(async (hid) => {
            try {
              const h = await apiClient.getHospitalById(hid.toString());
              details[hid] = h;
            } catch (e) {
              // fallback: just skip
            }
          })
        );
        setHospitalDetails(details);
      } catch (err: any) {
        setError("Failed to load doctor profile");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!doctor) return <div className="text-red-500 text-center mt-8">Doctor not found.</div>;

  const location = doctor.locationResponse;

  return (
    <Layout>
      <div className="flex flex-col items-center min-h-[60vh] py-8">
        <Card className="w-full max-w-2xl shadow-xl border-2 border-blue-100 rounded-2xl mb-8">
          <CardHeader className="flex flex-col items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-t-2xl">
            <Avatar className="h-20 w-20 mb-2 border-2 border-blue-300 shadow-md">
              <AvatarFallback>
                <UserIcon className="w-10 h-10 text-blue-400" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-bold text-blue-900">{doctor.name}</CardTitle>
            <CardDescription className="text-gray-600">Doctor Profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Email:</span>
              <span>{doctor.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-400" />
              <span className="font-medium">Phone:</span>
              <span>{doctor.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Specialties:</span>
              <div className="flex flex-wrap gap-2">
                {doctor.specialties.map((spec) => (
                  <Badge key={spec} variant="secondary">{spec}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HospitalIcon className="w-5 h-5 text-pink-400" />
              <span className="font-medium">Department:</span>
              <span>{doctor.departmentResponse?.name}</span>
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
                  <Badge variant="secondary">Postal: {location.postalCode}</Badge>
                  <Badge variant="secondary">Zone: {location.zoneId}</Badge>
                </div>
              )}
              {!location && <span className="text-gray-500">No location found</span>}
            </div>
          </CardContent>
        </Card>
        <Card className="w-full max-w-2xl shadow-lg border border-blue-100 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Associated Hospitals</CardTitle>
            <CardDescription className="text-gray-600">Hospitals where this doctor practices</CardDescription>
          </CardHeader>
          <CardContent>
            {doctor.doctorHospitals.length === 0 ? (
              <div className="text-gray-500">No hospitals found for this doctor.</div>
            ) : (
              <div className="flex flex-col gap-6">
                {doctor.doctorHospitals.map((dh) => {
                  const hospital = hospitalDetails[dh.hospitalId];
                  return (
                    <div
                      key={dh.hospitalId}
                      className="border border-blue-200 rounded-xl p-6 bg-blue-50/60 shadow-sm hover:shadow-lg transition-shadow duration-200 group relative overflow-hidden"
                    >
                      {/* Decorative background circle */}
                      <svg className="absolute -top-8 -left-8 w-32 h-32 opacity-10 group-hover:opacity-20 transition" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="50" fill="#3B82F6" />
                      </svg>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <HospitalIcon className="w-6 h-6 text-blue-600" />
                          <span className="text-xl font-bold text-blue-900 group-hover:text-blue-700 transition">{dh.hospitalName}</span>
                          {hospital && hospital.types && hospital.types.map((type: string) => (
                            <Badge key={type} className="ml-1 bg-purple-100 text-purple-700 border-none px-2 py-0.5 text-xs font-semibold uppercase tracking-wide hover:text-white">{type}</Badge>
                          ))}
                        </div>
                        {hospital ? (
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-700 text-sm mb-2">
                            <span className="flex items-center gap-1"><span className="font-medium">Phone:</span> {hospital.phoneNumber}</span>
                            {hospital.website && (
                              <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium hover:text-blue-800 flex items-center gap-1">
                                <Globe className="w-4 h-4" />
                                <span>Website</span>
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <span><span className="font-medium">Cost:</span> {hospital.costRange}</span>
                            <span><span className="font-medium">ICUs:</span> {hospital.icus}</span>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm mb-2">Loading hospital details...</div>
                        )}
                        {hospital && hospital.locationResponse && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="secondary">{hospital.locationResponse.address}</Badge>
                            <Badge variant="secondary">Thana: {hospital.locationResponse.thana}</Badge>
                            <Badge variant="secondary">City: {hospital.locationResponse.city}</Badge>
                          </div>
                        )}
                        <Separator className="my-3" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">Appointment Times:</span>
                            {dh.appointmentTimes.length ? dh.appointmentTimes.map((time: string) => (
                              <span key={time} className="text-gray-700">{format(new Date(time), "hh:mm a")}</span>
                            )) : <span className="text-gray-400">N/A</span>}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">Weekly Schedules:</span>
                            <span className="text-gray-700">{dh.weeklySchedules.length ? dh.weeklySchedules.join(", ") : <span className="text-gray-400">N/A</span>}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 flex items-center gap-1"><span className="text-blue-700">Appointment Fee:</span> <span className="text-lg font-bold text-blue-900">{dh.appointmentFee}</span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DoctorProfilePage; 