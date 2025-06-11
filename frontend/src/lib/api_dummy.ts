import { Appointment, Rating, Hospital, Doctor, Department, DiagnosticTest } from '@/types';

// Mock data
const mockHospitals: Hospital[] = [
  {
    id: 1,
    name: "City General Hospital",
    address: "123 Healthcare Ave",
    phone_number: "555-0123",
    website: "www.citygeneral.com",
    location: "Downtown",
    type: "public",
    icus: 15,
    rating: 4.5
  },
  {
    id: 2,
    name: "Private Care Center",
    address: "456 Medical Drive",
    phone_number: "555-0456",
    website: "www.privatecare.com",
    location: "Uptown",
    type: "private",
    icus: 10,
    rating: 4.8
  }
];

const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. John Smith",
    specialty: "Cardiology",
    phone_number: "555-1111",
    email: "john.smith@hospital.com"
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    specialty: "Neurology",
    phone_number: "555-2222",
    email: "sarah.johnson@hospital.com"
  }
];

const mockDepartments: Department[] = [
  {
    id: 1,
    name: "Cardiology",
    description: "Heart and cardiovascular care",
    head_doctor_name: "Dr. John Smith",
    contact_number: "555-3333",
    beds: 50,
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  {
    id: 2,
    name: "Neurology",
    description: "Brain and nervous system care",
    head_doctor_name: "Dr. Sarah Johnson",
    contact_number: "555-4444",
    beds: 40,
    available_days: ["Monday", "Wednesday", "Friday"]
  }
];

const mockTests: DiagnosticTest[] = [
  {
    id: 1,
    name: "Complete Blood Count",
    description: "Basic blood test panel",
    cost: 100,
    availability: "Monday-Friday"
  },
  {
    id: 2,
    name: "MRI Scan",
    description: "Magnetic resonance imaging",
    cost: 1200,
    availability: "Monday-Saturday"
  }
];

const mockRatings: Rating[] = [
  {
    id: 1,
    user_id: "user1",
    user_name: "John Doe",
    rating: 5,
    review_text: "Excellent service and care",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    user_id: "user2",
    user_name: "Jane Smith",
    rating: 4,
    review_text: "Good experience overall",
    created_at: new Date().toISOString()
  }
];

const mockAppointments: Appointment[] = [
  {
    id: 1,
    doctor_name: "Dr. John Smith",
    hospital_name: "City General Hospital",
    appointment_time: "2024-03-20T10:00:00Z",
    status: "confirmed"
  }
];

class DummyApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async register(data: { name: string; email: string; password: string; location: string }) {
    return {
      success: true,
      message: "Registration successful! Please check your email for OTP."
    };
  }

  async verifyOtp(data: { email: string; otp: string }) {
    return {
      success: true,
      message: "Email verified successfully!"
    };
  }

  async login(data: { email: string; password: string }) {
    const dummyToken = "dummy_jwt_token_123456789";
    this.setToken(dummyToken);
    return {
      success: true,
      token: dummyToken
    };
  }

  async searchHospitals(filters: any) {
    return {
      success: true,
      data: mockHospitals
    };
  }

  async getHospital(id: string) {
    const hospital = mockHospitals.find(h => h.id === parseInt(id));
    return {
      success: true,
      data: hospital
    };
  }

  async getHospitalDoctors(id: string) {
    return {
      success: true,
      data: mockDoctors
    };
  }

  async getHospitalDepartments(id: string) {
    return {
      success: true,
      data: mockDepartments
    };
  }

  async getHospitalTests(id: string) {
    return {
      success: true,
      data: mockTests
    };
  }

  async getHospitalRatings(id: string) {
    return {
      success: true,
      data: mockRatings
    };
  }

  async addHospitalRating(id: string, data: { rating: number; review_text: string }) {
    const newRating = {
      id: mockRatings.length + 1,
      hospital_id: parseInt(id),
      user_id: 1,
      ...data,
      created_at: new Date().toISOString()
    };
    return {
      success: true,
      data: newRating
    };
  }

  async updateRating(id: string, data: { rating: number; review_text: string }) {
    return {
      success: true,
      message: "Rating updated successfully"
    };
  }

  async deleteRating(id: string) {
    return {
      success: true,
      message: "Rating deleted successfully"
    };
  }

  async getDoctor(id: string) {
    const doctor = mockDoctors.find(d => d.id === parseInt(id));
    return {
      success: true,
      data: doctor
    };
  }

  async getDoctorHospitals(id: string) {
    return {
      success: true,
      data: mockHospitals
    };
  }

  async getAppointments() {
    return {
      success: true,
      data: mockAppointments
    };
  }

  async bookAppointment(data: { doctor_hospital_id: number; appointment_time: string }) {
    const newAppointment = {
      id: mockAppointments.length + 1,
      doctor_id: 1,
      hospital_id: 1,
      user_id: 1,
      appointment_time: data.appointment_time,
      status: "confirmed"
    };
    return {
      success: true,
      data: newAppointment
    };
  }

  async cancelAppointment(id: string) {
    return {
      success: true,
      message: "Appointment cancelled successfully"
    };
  }

  async adminLogin(data: { email: string; password: string }) {
    const dummyAdminToken = "dummy_admin_jwt_token_123456789";
    this.setToken(dummyAdminToken);
    return {
      success: true,
      token: dummyAdminToken
    };
  }

  async updateHospital(id: string, data: Partial<Hospital>) {
    return {
      success: true,
      message: "Hospital updated successfully"
    };
  }

  async addDoctorToHospital(hospitalId: string, data: any) {
    return {
      success: true,
      message: "Doctor added to hospital successfully"
    };
  }

  async requestNewDoctor(hospitalId: string, data: any) {
    return {
      success: true,
      message: "New doctor request submitted successfully"
    };
  }

  async addTestToHospital(hospitalId: string, data: any) {
    return {
      success: true,
      message: "Test added to hospital successfully"
    };
  }

  async requestNewTest(hospitalId: string, data: any) {
    return {
      success: true,
      message: "New test request submitted successfully"
    };
  }

  async updateTest(hospitalId: string, testId: string, data: any) {
    return {
      success: true,
      message: "Test updated successfully"
    };
  }

  async addDepartmentToHospital(hospitalId: string, data: any) {
    return {
      success: true,
      message: "Department added successfully"
    };
  }

  async requestNewDepartment(hospitalId: string, data: any) {
    return {
      success: true,
      message: "New department request submitted successfully"
    };
  }

  async updateDepartmentHead(hospitalId: string, departmentId: string, data: any) {
    return {
      success: true,
      message: "Department head updated successfully"
    };
  }
}

export const dummyApiClient = new DummyApiClient(); 