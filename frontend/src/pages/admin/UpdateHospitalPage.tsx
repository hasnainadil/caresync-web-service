import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api";
import { HospitalRegistrationRequest, Hospital, HOSPITAL_TYPE, COST_RANGE } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import Layout from "@/components/Layout";

const UpdateHospitalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<HospitalRegistrationRequest | null>(null);

  useEffect(() => {
    const fetchHospital = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await apiClient.getHospitalById(id);
        setForm({
          id: data.id,
          name: data.name || "",
          phoneNumber: data.phoneNumber || "",
          website: data.website || "",
          types: data.types || [],
          location: data.locationResponse || {
            locationType: "HOSPITAL",
            address: "",
            thana: "",
            po: "",
            city: "",
            postalCode: null,
            zoneId: null,
          },
          costRange: data.costRange || null,
          icus: data.icus || null,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
        });
      } catch (err: any) {
        toast.error("Failed to load hospital data");
      } finally {
        setLoading(false);
      }
    };
    fetchHospital();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!form) return;
    const { name, value, type } = e.target;
    if (name.startsWith("location.")) {
      const locKey = name.replace("location.", "");
      setForm({
        ...form,
        location: {
          ...form.location,
          [locKey]: value,
        },
      });
    } else if (name === "types") {
      if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
        const checked = e.target.checked;
        const val = value as any;
        setForm((prev) => {
          if (!prev) return prev;
          const types = checked
            ? [...prev.types, val]
            : prev.types.filter((t) => t !== val);
          return { ...prev, types };
        });
      }
    } else if (["icus", "latitude", "longitude"].includes(name)) {
      setForm({ ...form, [name]: value === "" ? null : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    try {
      await apiClient.updateHospital(form);
      toast.success("Hospital updated successfully");
      navigate("/admin");
    } catch (err: any) {
      toast.error("Failed to update hospital");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !form) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-2xl shadow-xl border-2 border-blue-100 rounded-2xl">
          <CardHeader>
            <CardTitle>Update Hospital</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                placeholder="Hospital Name"
                required
              />
              <Input
                name="phoneNumber"
                value={form.phoneNumber || ""}
                onChange={handleChange}
                placeholder="Phone Number"
                required
              />
              <Input
                name="website"
                value={form.website || ""}
                onChange={handleChange}
                placeholder="Website"
              />
              <div className="flex flex-wrap gap-2">
                {Object.values(HOSPITAL_TYPE).map((type) => (
                  <label key={type} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="types"
                      value={type}
                      checked={form.types.includes(type)}
                      onChange={handleChange}
                    />
                    <span>{type.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
              <select
                name="costRange"
                value={form.costRange || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="" disabled>Select Cost Range</option>
                {Object.values(COST_RANGE).map((cost) => (
                  <option key={cost} value={cost}>{cost.replace(/_/g, ' ')}</option>
                ))}
              </select>
              <Input
                name="icus"
                type="number"
                value={form.icus ?? ""}
                onChange={handleChange}
                placeholder="Number of ICUs"
                min={0}
                required
              />
              <Input
                name="latitude"
                type="number"
                value={form.latitude ?? ""}
                onChange={handleChange}
                placeholder="Latitude"
                required
              />
              <Input
                name="longitude"
                type="number"
                value={form.longitude ?? ""}
                onChange={handleChange}
                placeholder="Longitude"
                required
              />
              <Input
                name="location.address"
                value={form.location?.address || ""}
                onChange={handleChange}
                placeholder="Address"
                required
              />
              <Input
                name="location.thana"
                value={form.location?.thana || ""}
                onChange={handleChange}
                placeholder="Thana"
                required
              />
              <Input
                name="location.po"
                value={form.location?.po || ""}
                onChange={handleChange}
                placeholder="Post Office"
                required
              />
              <Input
                name="location.city"
                value={form.location?.city || ""}
                onChange={handleChange}
                placeholder="City"
                required
              />
              <Input
                name="location.postalCode"
                type="number"
                value={form.location?.postalCode ?? ""}
                onChange={handleChange}
                placeholder="Postal Code"
                required
              />
              <Input
                name="location.zoneId"
                type="number"
                value={form.location?.zoneId ?? ""}
                onChange={handleChange}
                placeholder="Zone ID"
                required
              />
              <Button type="submit" disabled={loading} className="w-full">Update Hospital</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UpdateHospitalPage; 