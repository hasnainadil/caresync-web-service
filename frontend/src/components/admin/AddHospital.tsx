import React, { useState } from "react";
import { HospitalRegistrationRequest, HOSPITAL_TYPE, COST_RANGE, LocationResponse } from "@/types";
import { apiClient } from "@/lib/api";
import { auth } from "@/lib/firebase";

interface AddHospitalSectionProps {
  onHospitalAdded?: () => void;
}

const defaultLocation : LocationResponse = {
  // id: null,
  locationType: "HOSPITAL",
  address: null,
  thana: null,
  po: null,
  city: null,
  postalCode: null,
  zoneId: null,
};


const initialState : HospitalRegistrationRequest = {
  name: "",
  phoneNumber: "",
  website: "",
  types: [],
  location: defaultLocation,
  costRange: COST_RANGE.MODERATE,
  icus: null,
  latitude: null,
  longitude: null,
};

const AddHospitalSection: React.FC<AddHospitalSectionProps> = ({ onHospitalAdded }) => {
  const [form, setForm] = useState<HospitalRegistrationRequest>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith("location.")) {
      const locField = name.split(".")[1];
      setForm((prev: HospitalRegistrationRequest) => ({
        ...prev,
        location: {
          ...prev.location,
          [locField]: value,
        },
      }));
    } else if (name === "types") {
      if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
        const checked = e.target.checked;
        const val = value as HOSPITAL_TYPE;
        setForm((prev: HospitalRegistrationRequest) => {
          const types = prev.types.includes(val)
            ? prev.types.filter((t: HOSPITAL_TYPE) => t !== val as HOSPITAL_TYPE)
            : [...prev.types, val];
          return { ...prev, types };
        });
      }
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      // Convert number fields
      const payload: HospitalRegistrationRequest = {
        ...form,
        icus: Number(form.icus),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        location: {
          ...form.location,
          postalCode: Number(form.location.postalCode),
          zoneId: Number(form.location.zoneId),
        },
      };
      await apiClient.registerHospital(payload);
      setSuccess("Hospital added successfully");
      setForm(initialState);
      onHospitalAdded?.();
    } catch (err: any) {
      setError("Failed to add hospital");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0001", padding: 24, marginBottom: 32, marginLeft: "auto", marginRight: "auto", width: "100%" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Add New Hospital</h2>
      <p style={{ color: '#555', marginBottom: 20 }}>Fill out the form below to add a new hospital to the system.</p>
      <form onSubmit={handleSubmit}>
        {/* Row 1: Name & Phone */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              placeholder="Enter hospital name"
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              name="phoneNumber"
              value={form.phoneNumber || ""}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
        </div>
        {/* Row 2: Website & Types */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              name="website"
              value={form.website || ""}
              onChange={handleChange}
              placeholder="Enter website (optional)"
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Hospital Types</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.values(HOSPITAL_TYPE).map((type) => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="checkbox"
                    name="types"
                    value={type}
                    checked={form.types.includes(type as HOSPITAL_TYPE)}
                    onChange={handleChange}
                  />
                  <span>{type.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        {/* Row 3: Cost Range & ICUs */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <select
              name="costRange"
              value={form.costRange || "" }
              onChange={handleChange}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            >
              {Object.values(COST_RANGE).map((cost) => (
                <option key={cost} value={cost}>{cost.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              name="icus"
              type="number"
              value={form.icus || ""}
              onChange={handleChange}
              placeholder="Number of ICUs"
              required
              min={0}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
        </div>
        {/* Row 4: Latitude & Longitude */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              name="latitude"
              type="number"
              value={form.latitude || ""}
              onChange={handleChange}
              placeholder="Latitude"
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              name="longitude"
              type="number"
              value={form.longitude || ""}
              onChange={handleChange}
              placeholder="Longitude"
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
        </div>
        {/* Row 5: Address & City */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              name="location.address"
              value={form.location?.address || ""}
              onChange={handleChange}
              placeholder="Address"
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              name="location.city"
              value={form.location?.city || ""}
              onChange={handleChange}
              placeholder="City"
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
        </div>
        {/* Row 6: Thana & PO */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              name="location.thana"
              value={form.location?.thana || ""}
              onChange={handleChange}
              placeholder="Thana"
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              name="location.po"
              value={form.location?.po || ""}
              onChange={handleChange}
              placeholder="Post Office"
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
        </div>
        {/* Row 7: Postal Code & Zone ID */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              name="location.postalCode"
              type="number"
              value={form.location?.postalCode || ""}
              onChange={handleChange}
              placeholder="Postal Code"
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              name="location.zoneId"
              type="number"
              value={form.location?.zoneId || ""}
              onChange={handleChange}
              placeholder="Zone ID"
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
        </div>
        <button type="submit" disabled={submitting} style={{ width: '100%', padding: 12, borderRadius: 4, background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}>
          {submitting ? "Adding..." : "Add Hospital"}
        </button>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 12 }}>{success}</div>}
      </form>
    </div>
  );
};

export default AddHospitalSection; 