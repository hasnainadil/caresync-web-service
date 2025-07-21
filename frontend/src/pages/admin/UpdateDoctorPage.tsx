import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import { DoctorUpdateRequest, DoctorHospitalCreateRequest, LOCATION_TYPE, DoctorResponse } from '@/types';
import { toast } from '@/hooks/use-toast';

const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

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
  const [hospitalInput, setHospitalInput] = useState({
    hospitalId: '',
    appointmentFee: '',
    weeklySchedules: [] as string[],
    appointmentTimes: [''] as string[],
  });
  const [showHospitals, setShowHospitals] = useState(false);
  const [hospitals, setHospitals] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (id) {
      apiClient.getDoctorById(id).then((data: DoctorResponse) => {
        console.log("data from getDoctorById", data);
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
      console.log("form in updateDoctor", form);
      await apiClient.updateDoctor(
        {
          ...form,
          doctorHospitals: form.doctorHospitals?.length > 0 ? form.doctorHospitals : null,
          userId: "user-1",
        }
      );
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
        {/* <fieldset className="border p-4 rounded">
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
        </fieldset> */}
        {/* Doctor Hospitals Section */}
        {/* <fieldset className="border p-4 rounded">
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
              <li key={idx} className="text-sm flex items-center gap-2">Hospital ID: {dh.hospitalId}, Fee: {dh.appointmentFee}, Schedules: {dh.weeklySchedules?.join(', ')}, Times: {dh.appointmentTimes?.join(', ')}
                <button type="button" onClick={() => handleDeleteHospital(idx)} className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </li>
            ))}
          </ul>
        </fieldset> */}
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded" disabled={loading}>
          {loading ? 'Updating...' : 'Update Doctor'}
        </button>
      </form>
    </div>
  );
};

export default UpdateDoctorPage; 