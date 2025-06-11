export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
}

export interface HospitalLocation {
  id: number;
  locationType: 'HOSPITAL';
  address: string;
  thana: string;
  po: string;
  city: string;
  postalCode: number;
  zoneId: number;
}

export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  rating: number;
  website?: string;
  location: string;
  type: 'public' | 'private' | 'Public' | 'Private';
  icus?: number;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  phone_number: string;
  email?: string;
  location?: string;
  department?: {
    id: number;
    name: string;
  };
}

export interface Department {
  id: number;
  name: string;
  description: string;
  head_doctor_name: string;
  contact_number: string;
  beds: number;
  available_days?: string[];
}

export interface DiagnosticTest {
  id: number;
  name: string;
  description: string;
  cost: number;
  availability: string;
}

export interface Rating {
  id: number;
  user_id: string;
  user_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export interface Appointment {
  id: number;
  doctor_name: string;
  hospital_name: string;
  appointment_time: string;
  status: string;
}

export interface SearchFilters {
  location?: string;
  type?: string;
  min_rating?: number;
  query?: string;
  doctor_name?: string;
  department_name?: string;
  test_name?: string;
  sort_by?: string;
}
