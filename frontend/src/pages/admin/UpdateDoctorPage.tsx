import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import { DoctorUpdateRequest, DoctorHospitalCreateRequest, LOCATION_TYPE, DoctorResponse } from '@/types';
import { toast } from '@/hooks/use-toast';

const initialForm: DoctorUpdateRequest = {
  id: 0,
  name: '',
  specialties: [],
  phoneNumber: '',
  email: '',
  departmentName: '',
  location: {
    locationType: LOCATION_TYPE.DOCTOR,
    address: '',
    thana: '',
    po: '',
    city: '',
    postalCode: null,
    zoneId: null,
  },
  doctorHospitals: [],
};

const UpdateDoctorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [hospitalInput, setHospitalInput] = useState({ hospitalId: '', appointmentFee: '', weeklySchedules: '', appointmentTimes: '' });

  useEffect(() => {
    if (id) {
      apiClient.getDoctorById(id).then((data: DoctorResponse) => {
        setForm({
          id: data.id,
          name: data.name,
          specialties: data.specialties,
          phoneNumber: data.phoneNumber,
          email: data.email,
          departmentName: data.departmentResponse?.name || '',
          location: data.locationResponse || initialForm.location,
          doctorHospitals: data.doctorHospitals?.map((dh) => ({
            hospitalId: dh.hospitalId,
            appointmentFee: dh.appointmentFee,
            weeklySchedules: dh.weeklySchedules,
            appointmentTimes: dh.appointmentTimes,
          })) || [],
        });
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      setForm({
        ...form,
        location: {
          ...form.location!,
          [name.replace('location.', '')]: value,
        },
      });
    } else if (name === 'specialties') {
      setForm({ ...form, specialties: value.split(',').map((s) => s.trim()) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleHospitalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHospitalInput({ ...hospitalInput, [e.target.name]: e.target.value });
  };

  const handleAddHospital = () => {
    setForm({
      ...form,
      doctorHospitals: [
        ...form.doctorHospitals!,
        {
          hospitalId: Number(hospitalInput.hospitalId),
          appointmentFee: hospitalInput.appointmentFee ? Number(hospitalInput.appointmentFee) : undefined,
          weeklySchedules: hospitalInput.weeklySchedules ? hospitalInput.weeklySchedules.split(',').map((s) => s.trim()) : undefined,
          appointmentTimes: hospitalInput.appointmentTimes ? hospitalInput.appointmentTimes.split(',').map((s) => s.trim()) : undefined,
        },
      ],
    });
    setHospitalInput({ hospitalId: '', appointmentFee: '', weeklySchedules: '', appointmentTimes: '' });
  };

  const handleDeleteHospital = (idx: number) => {
    setForm({
      ...form,
      doctorHospitals: form.doctorHospitals?.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.updateDoctor(form);
      toast({ title: 'Doctor updated successfully!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Doctor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1">Specialties (comma separated)</label>
          <input name="specialties" value={form.specialties?.join(', ') || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Phone Number</label>
          <input name="phoneNumber" value={form.phoneNumber || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input name="email" value={form.email || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Department Name</label>
          <input name="departmentName" value={form.departmentName || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <fieldset className="border p-4 rounded">
          <legend className="font-semibold">Location</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Address</label>
              <input name="location.address" value={form.location?.address || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1">Thana</label>
              <input name="location.thana" value={form.location?.thana || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1">Post Office</label>
              <input name="location.po" value={form.location?.po || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1">City</label>
              <input name="location.city" value={form.location?.city || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1">Postal Code</label>
              <input name="location.postalCode" type="number" value={form.location?.postalCode ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1">Zone ID</label>
              <input name="location.zoneId" type="number" value={form.location?.zoneId ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>
        </fieldset>
        {/* Doctor Hospitals Section */}
        <fieldset className="border p-4 rounded">
          <legend className="font-semibold">Doctor Hospitals</legend>
          <div className="grid grid-cols-4 gap-2 mb-2">
            <input name="hospitalId" value={hospitalInput.hospitalId} onChange={handleHospitalInputChange} placeholder="Hospital ID" className="border rounded px-2 py-1" />
            <input name="appointmentFee" value={hospitalInput.appointmentFee} onChange={handleHospitalInputChange} placeholder="Fee" className="border rounded px-2 py-1" />
            <input name="weeklySchedules" value={hospitalInput.weeklySchedules} onChange={handleHospitalInputChange} placeholder="Schedules (comma)" className="border rounded px-2 py-1" />
            <input name="appointmentTimes" value={hospitalInput.appointmentTimes} onChange={handleHospitalInputChange} placeholder="Times (comma)" className="border rounded px-2 py-1" />
          </div>
          <button type="button" onClick={handleAddHospital} className="bg-green-600 text-white px-4 py-1 rounded mb-2">Add Hospital</button>
          <ul>
            {form.doctorHospitals?.map((dh, idx) => (
              <li key={idx} className="text-sm flex items-center gap-2">Hospital ID: {dh.hospitalId}, Fee: {dh.appointmentFee}, Schedules: {dh.weeklySchedules?.join(', ')}, Times: {dh.appointmentTimes?.join(', ')}
                <button type="button" onClick={() => handleDeleteHospital(idx)} className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded" disabled={loading}>
          {loading ? 'Updating...' : 'Update Doctor'}
        </button>
      </form>
    </div>
  );
};

export default UpdateDoctorPage; 