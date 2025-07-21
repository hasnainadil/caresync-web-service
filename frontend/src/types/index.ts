export interface User {
  id: string;
  name: string;
  email: string;
  locationResponse: LocationResponse;
}

export interface HospitalLocation {
  id: number;
  locationType: LOCATION_TYPE.HOSPITAL;
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

export enum LOCATION_TYPE {
  USER = "USER",
  DOCTOR = "DOCTOR",
  HOSPITAL = "HOSPITAL"
}

export interface LocationResponse {
  id?: number | null;
  locationType: LOCATION_TYPE | null;
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
  test?: TEST_TYPE;
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

export enum ROLE {
  DEFAULT = "DEFAULT",
  ADMIN = "ADMIN"
}



export interface Registration {
  userId: string;
  // accessToken
  name: string;
  email: string;
  password: string;
  location: {
    locationType: LOCATION_TYPE.USER;
    address: string;
    thana: string;
    po: string;
    city: string;
    postalCode: number;
    zoneId: number;
  };
}
export interface UserRegistration extends Registration {
  role: ROLE.DEFAULT;
}

export interface AdminRegistration extends Registration {
  role: ROLE.ADMIN;
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
  role: ROLE;
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
  userId: string;
}

// Alias for SearchFilters to maintain compatibility
export type SearchFilters = HospitalFilter;

// --- Test API Types ---
export enum TEST_TYPE {
  BLOOD = "BLOOD",
  HEART = "HEART",
  BRAIN = "BRAIN",
  LUNG = "LUNG",
  EYE = "EYE",
  BONE = "BONE",
  SKIN = "SKIN",
  GENERAL = "GENERAL",
  LIVER = "LIVER",
  KIDNEY = "KIDNEY"
}

export interface HospitalResponse {
  id: number;
  name: string;
  phoneNumber: string;
  website?: string;
  types: HOSPITAL_TYPE[];
  icus: number;
  costRange: COST_RANGE;
  latitude: number;
  longitude: number;
  locationResponse: LocationResponse;
}

export interface TestResponse {
  id: number;
  name: string;
  types: TEST_TYPE[];
  price: number;
  hospitalResponse: HospitalResponse;
}

export interface TestAddRequest {
  userId: string;
  name: string;
  types: TEST_TYPE[];
  hospitalId: number;
  price: number;
}

export interface TestUpdateRequest {
  id: number;
  userId: string;
  name: string;
  types: TEST_TYPE[];
  price: number;
}

export interface TestSearchRequest {
  name?: string;
  types?: TEST_TYPE[];
  minPrice?: number;
  maxPrice?: number;
  zoneId?: number;
}

// --- Doctor API Types ---
export interface DepartmentResponse {
  id: number;
  name: string;
  description: string;
}

export interface DoctorHospitalResponse {
  id: number;
  hospitalId: number;
  hospitalName: string;
  appointmentFee: number;
  weeklySchedules: string[];
  appointmentTimes: string[];
}

export interface DoctorResponse {
  id: number;
  name: string;
  specialties: string[];
  phoneNumber: string;
  email: string;
  departmentResponse: DepartmentResponse;
  locationResponse: LocationResponse;
  doctorHospitals: DoctorHospitalResponse[];
}

export interface DoctorHospitalCreateRequest {
  hospitalId: number;
  appointmentFee?: number;
  weeklySchedules?: string[];
  appointmentTimes?: string[];
}

export interface DoctorRegistrationRequest {
  userId?: string;
  name: string;
  specialties?: string[];
  phoneNumber?: string;
  email?: string;
  departmentName?: string;
  location: LocationResponse;
  doctorHospitals?: DoctorHospitalCreateRequest[];
}

export interface DoctorUpdateRequest {
  id: number;
  userId?: string;
  name?: string;
  specialties?: string[];
  phoneNumber?: string;
  email?: string;
  departmentName?: string;
  location?: LocationResponse;
  doctorHospitals?: DoctorHospitalCreateRequest[];
}

// --- Feedback API Types ---
export enum FEEDBACK_TARGET_TYPE {
  DOCTOR = "DOCTOR",
  HOSPITAL = "HOSPITAL"
}

export interface FeedbackResponse {
  id: number;
  userId: string;
  targetType: FEEDBACK_TARGET_TYPE;
  targetId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FeedbackCreateRequest {
  userId: string;
  targetType: FEEDBACK_TARGET_TYPE;
  targetId: number;
  rating: number;
  comment?: string;
}

export interface FeedbackUpdateRequest {
  userId: string;
  rating?: number;
  comment?: string;
}