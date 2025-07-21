import React, { useState } from 'react';
import { apiClient } from '@/lib/api';
import { DoctorRegistrationRequest, LOCATION_TYPE } from '@/types';
import { toast } from '@/hooks/use-toast';

const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const initialForm: DoctorRegistrationRequest = {
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

const AddDoctorPage: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [hospitalInput, setHospitalInput] = useState({
    hospitalId: '',
    appointmentFee: '',
    weeklySchedules: [] as string[],
    appointmentTimes: [''] as string[],
  });
  const [showHospitals, setShowHospitals] = useState(false);
  const [hospitals, setHospitals] = useState<{ id: number; name: string }[]>([]);

  // Fetch all hospitals when needed
  const fetchHospitals = async () => {
    const data = await apiClient.getAllHospitals();
    setHospitals(data.map((h: any) => ({ id: h.id, name: h.name })));
    setShowHospitals(true);
  };

  // Handle weeklySchedules (checkboxes)
  const handleScheduleChange = (day: string) => {
    setHospitalInput((prev) => ({
      ...prev,
      weeklySchedules: prev.weeklySchedules.includes(day)
        ? prev.weeklySchedules.filter(d => d !== day)
        : [...prev.weeklySchedules, day]
    }));
  };

  // Handle appointmentTimes (add/remove)
  const handleTimeChange = (idx: number, value: string) => {
    const updated = [...hospitalInput.appointmentTimes];
    updated[idx] = value;
    setHospitalInput({ ...hospitalInput, appointmentTimes: updated });
  };
  const addTime = () => setHospitalInput({
    ...hospitalInput,
    appointmentTimes: [...hospitalInput.appointmentTimes, '']
  });
  const removeTime = (idx: number) => setHospitalInput({
    ...hospitalInput,
    appointmentTimes: hospitalInput.appointmentTimes.filter((_, i) => i !== idx)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      setForm({
        ...form,
        location: {
          ...form.location,
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
          weeklySchedules: hospitalInput.weeklySchedules,
          appointmentTimes: hospitalInput.appointmentTimes.filter(Boolean),
        },
      ],
    });
    setHospitalInput({ hospitalId: '', appointmentFee: '', weeklySchedules: [], appointmentTimes: [''] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.registerDoctor({
        ...form,
        doctorHospitals: null,
        userId: "user-1",
      });
      toast({ title: 'Doctor added successfully!' });
      setForm(initialForm);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Doctor</h1>
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
              <input name="location.address" value={form.location.address || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1">Thana</label>
              <input name="location.thana" value={form.location.thana || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1">Post Office</label>
              <input name="location.po" value={form.location.po || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1">City</label>
              <input name="location.city" value={form.location.city || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1">Postal Code</label>
              <input name="location.postalCode" type="number" value={form.location.postalCode ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1">Zone ID</label>
              <input name="location.zoneId" type="number" value={form.location.zoneId ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>
        </fieldset>
        {/* Doctor Hospitals Section */}
        <fieldset className="border p-4 rounded">
          <legend className="font-semibold">Doctor Hospitals</legend>
          <div className="grid grid-cols-4 gap-2 mb-2">
            <input name="hospitalId" value={hospitalInput.hospitalId} onChange={handleHospitalInputChange} placeholder="Hospital ID" className="border rounded px-2 py-1" />
            <input name="appointmentFee" value={hospitalInput.appointmentFee} onChange={handleHospitalInputChange} placeholder="Fee" className="border rounded px-2 py-1" />
            <div>
              <label className="block font-semibold mb-1">Schedules</label>
              <div className="flex flex-wrap gap-1">
                {daysOfWeek.map(day => (
                  <label key={day} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={hospitalInput.weeklySchedules.includes(day)}
                      onChange={() => handleScheduleChange(day)}
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Appointment Times</label>
              {hospitalInput.appointmentTimes.map((time, idx) => (
                <div key={idx} className="flex items-center gap-1 mb-1">
                  <input
                    type="time"
                    value={time}
                    onChange={e => handleTimeChange(idx, e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <button type="button" onClick={() => removeTime(idx)} className="text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addTime} className="text-blue-500 mt-1">Add Time</button>
            </div>
          </div>
          <button type="button" onClick={handleAddHospital} className="bg-green-600 text-white px-4 py-1 rounded mb-2">Add Hospital</button>
          <button type="button" onClick={fetchHospitals} className="ml-2 bg-blue-500 text-white px-4 py-1 rounded mb-2">Show All Hospitals</button>
          {showHospitals && (
            <div className="mt-2 p-2 border rounded bg-gray-50 max-h-48 overflow-y-auto">
              <h4 className="font-semibold mb-1">All Hospitals</h4>
              <ul>
                {hospitals.map(h => (
                  <li key={h.id} className="text-sm">{h.id}: {h.name}</li>
                ))}
              </ul>
            </div>
          )}
          <ul>
            {form.doctorHospitals?.map((dh, idx) => (
              <li key={idx} className="text-sm">Hospital ID: {dh.hospitalId}, Fee: {dh.appointmentFee}, Schedules: {dh.weeklySchedules?.join(', ')}, Times: {dh.appointmentTimes?.join(', ')}</li>
            ))}
          </ul>
        </fieldset>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded" disabled={loading}>
          {loading ? 'Adding...' : 'Add Doctor'}
        </button>
      </form>
    </div>
  );
};

export default AddDoctorPage; 