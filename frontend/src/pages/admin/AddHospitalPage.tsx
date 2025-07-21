import React, { useState } from 'react';
import { apiClient } from '@/lib/api';
import { HOSPITAL_TYPE, COST_RANGE, HospitalRegistrationRequest, LOCATION_TYPE } from '@/types';
import { toast } from '@/hooks/use-toast';
import Select from 'react-select';

const initialForm: Omit<HospitalRegistrationRequest, 'id'> = {
  name: '',
  phoneNumber: '',
  website: '',
  types: [],
  location: {
    locationType: LOCATION_TYPE.HOSPITAL,
    address: '',
    thana: '',
    po: '',
    city: '',
    postalCode: null,
    zoneId: null,
  },
  costRange: null,
  icus: null,
  latitude: null,
  longitude: null,
  userId: "user-1"
};

const AddHospitalPage: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

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
    } else if (name === 'types') {
      const options = (e.target as HTMLSelectElement).selectedOptions;
      setForm({ ...form, types: Array.from(options).map((o) => o.value as HOSPITAL_TYPE) });
    } else if (name === 'costRange') {
      setForm({ ...form, costRange: value as COST_RANGE });
    } else if (name === 'icus' || name === 'latitude' || name === 'longitude') {
      setForm({ ...form, [name]: value ? Number(value) : null });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.registerHospital(form as HospitalRegistrationRequest);
      toast({ title: 'Hospital added successfully!' });
      setForm(initialForm);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Hospital</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input name="name" value={form.name || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1">Phone Number</label>
          <input name="phoneNumber" value={form.phoneNumber || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1">Website</label>
          <input name="website" value={form.website || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Types</label>
          <Select
            name="types"
            options={Object.values(HOSPITAL_TYPE).map((type) => ({ value: type, label: type }))}
            isMulti
            value={form.types.map((type) => ({ value: type, label: type }))}
            onChange={(selectedOptions) => setForm({ ...form, types: selectedOptions.map((option) => option.value) })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">ICUs</label>
          <input name="icus" type="number" value={form.icus ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1">Cost Range</label>
          <select name="costRange" value={form.costRange ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Select</option>
            {Object.values(COST_RANGE).map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Latitude</label>
            <input name="latitude" type="number" value={form.latitude ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1">Longitude</label>
            <input name="longitude" type="number" value={form.longitude ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
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
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded" disabled={loading}>
          {loading ? 'Adding...' : 'Add Hospital'}
        </button>
      </form>
    </div>
  );
};

export default AddHospitalPage; 