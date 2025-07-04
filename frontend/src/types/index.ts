export interface User {
  id: string;
  name: string;
  email: string;
  locationResponse: LocationResponse;
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

export enum HOSPITAL_TYPE {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  GENERAL = "GENERAL",
  SPECIALIZED = "SPECIALIZED",
  CHILDREN = "CHILDREN",
  MATERNITY = "MATERNITY",
  RESEARCH = "RESEARCH",
  REHABILITATION = "REHABILITATION"
}

export enum COST_RANGE {
  VERY_LOW = "VERY_LOW",
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  VERY_HIGH = "VERY_HIGH"
}

export interface LocationResponse {
  id?: number | null;
  locationType: "USER" | "DOCTOR" | "HOSPITAL" | null;
  address: string | null;
  thana: string | null;
  po: string | null;
  city: string | null;
  postalCode: number | null;
  zoneId: number | null;
}

export interface Hospital {
  id: number;
  name: string;
  phoneNumber: string;
  website?: string;
  types: HOSPITAL_TYPE[];
  icus: number;
  costRange: COST_RANGE;
  latitude: number;
  longitude: number;
  locationResponse?: LocationResponse;
}

export interface HospitalSearchCriteria {
  costRange?: COST_RANGE;
  zoneId?: number;
  types?: HOSPITAL_TYPE[];
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

// Legacy interface for backward compatibility
export interface HospitalFilter{
  location?: string;
  type?: string;
  min_rating?: number;
  query?: string;
  doctor_name?: string;
  department_name?: string;
  test_name?: string;
  sort_by?: string;
}

export interface UserRegistration {
  userId: string;
  accessToken: string;
  name: string;
  email: string;
  password: string;
  location: {
    locationType: "USER";
    address: string;
    thana: string;
    po: string;
    city: string;
    postalCode: number;
    zoneId: number;
  };
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  phone_number: string;
  email: string;
}


export interface DiagnosticTest {
  id: number;
  name: string;
  description: string;
  cost: number;
  availability: string;
}

export interface HospitalListItem {
  id: number;
  name: string;
  phoneNumber: string;
  website?: string;
  types: string[];
  icus: number;
  location: string | null;
}

export interface UpdateUserRequest {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  locationResponse: LocationResponse;
}

export interface HospitalRegistrationRequest {
  id?: number | null;
  name: string | null;
  phoneNumber: string | null;
  website: string | null;
  types: HOSPITAL_TYPE[];
  location: LocationResponse | null;
  costRange: COST_RANGE | null;
  icus: number | null;
  latitude: number | null;
  longitude: number | null;
}

// Alias for SearchFilters to maintain compatibility
export type SearchFilters = HospitalFilter;