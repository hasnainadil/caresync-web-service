import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import HospitalCard from '@/components/hospitals/HospitalCard';
import { Hospital } from '@/types';

const UpdateHospitalList: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.getAllHospitals().then((data) => {
      setHospitals(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading hospitals...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Select a Hospital to Update</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital) => (
          <div key={hospital.id} onClick={() => navigate(`/admin/update-hospital/${hospital.id}`)} className="cursor-pointer">
            <HospitalCard hospital={hospital} />
          </div>
        ))}
      </div>
      {hospitals.length === 0 && (
        <div className="text-center py-12 text-gray-500">No hospitals found.</div>
      )}
    </div>
  );
};

export default UpdateHospitalList; 