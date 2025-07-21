import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import { DoctorResponse } from '@/types';
import { Mail, Phone } from 'lucide-react';

const UpdateDoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.getAllDoctors().then((data) => {
      setDoctors(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading doctors...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Select a Doctor to Update</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="relative border border-blue-300 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
            onClick={() => navigate(`/admin/update-doctor/${doc.id}`)}
          >
            {/* Decorative SVG shapes for right side effect */}
            <svg className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-32 h-32 opacity-10 pointer-events-none" viewBox="0 0 100 100" fill="none">
              <circle cx="70" cy="50" r="40" fill="#3B82F6" />
            </svg>
            <svg className="absolute right-0 bottom-0 w-16 h-16 opacity-5 pointer-events-none" viewBox="0 0 100 100" fill="none">
              <circle cx="80" cy="80" r="30" fill="#60A5FA" />
            </svg>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-base text-blue-900 truncate max-w-[60%]">{doc.name}</span>
              {doc.departmentResponse && (
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold ml-1 whitespace-nowrap">
                  {doc.departmentResponse.name}
                </span>
              )}
            </div>
            {doc.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {doc.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 mt-3">
              {/* Phone */}
              <div className="flex items-center gap-1 min-w-0 p-1 bg-green-50 rounded-3xl font-semibold px-3">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="truncate max-w-[90px]" title={doc.phoneNumber}>{doc.phoneNumber}</span>
              </div>
              {/* Divider */}
              <span className="text-gray-300">&bull;</span>
              {/* Email */}
              <div className="flex items-center gap-1 min-w-0 p-1 bg-blue-50 rounded-3xl font-semibold px-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="" title={doc.email}>{doc.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {doctors.length === 0 && (
        <div className="text-center py-12 text-gray-500">No doctors found.</div>
      )}
    </div>
  );
};

export default UpdateDoctorList; 