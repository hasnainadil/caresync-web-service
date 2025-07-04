import { Appointment, Rating, Hospital, Doctor, Department, DiagnosticTest, HospitalSearchCriteria, HOSPITAL_TYPE, COST_RANGE, LocationResponse } from '@/types';
import { UserRegistration, HospitalListItem } from './api';
import { mockDoctors, mockHospitals } from './data';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

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

  async searchHospitals(filters: HospitalSearchCriteria): Promise<{ success: boolean; data: Hospital[] }> {
    await delay(1500);
    
    let filteredHospitals = [...mockHospitals];
    
    // Filter by cost range
    if (filters.costRange) {
      filteredHospitals = filteredHospitals.filter(hospital => 
        hospital.costRange === COST_RANGE[filters.costRange as keyof typeof COST_RANGE]
      );
    }
    
    // Filter by zone
    if (filters.zoneId) {
      filteredHospitals = filteredHospitals.filter(hospital => 
        hospital.locationResponse?.zoneId === filters.zoneId
      );
    }
    
    // Filter by types
    if (filters.types && filters.types.length > 0) {
      filteredHospitals = filteredHospitals.filter(hospital => 
        filters.types!.some(type => hospital.types.includes(type))
      );
    }
    
    return {
      success: true,
      data: filteredHospitals
    };
  }

  async getHospital(id: string) {
    const hospital = mockHospitals.find(h => h.id === parseInt(id));
    if (!hospital) return {
      success: true,
      data: mockHospitals[0]
    }
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

  async updateHospital(data: any): Promise<Hospital> {
    await delay(1000);
    return {
      success: true,
      data: data
    } as any;
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
    console.log("Requesting new test for hospital:", hospitalId, data);
    return { success: true, message: "Request for new test submitted." };
  }

  async updateTest(hospitalId: string, testId: string, data: any) {
    await delay(1000);
    console.log("Updating test:", testId, "for hospital:", hospitalId, "with data:", data);
    return { success: true, message: "Test updated successfully." };
  }

  async addDepartmentToHospital(hospitalId: string, data: any) {
    await delay(1000);
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

  async registerUser(data: UserRegistration) {
    await delay(1000);
    return {
      success: true,
      message: "User registered successfully"
    };
  }

  async updateDepartmentHead(hospitalId: string, departmentId: string, data: any) {
    return {
      success: true,
      message: "Department head updated successfully"
    };
  }

  // Methods to match api.ts interface
  async testAuthEndpoint(): Promise<any> {
    await delay(500);
    return {
      success: true,
      message: "Test endpoint working"
    };
  }

  async userLoggedIn(userId: string) {
    await delay(500);
    return {
      success: true,
      message: "User logged in successfully"
    };
  }

  async getUserById(userId: string) {
    await delay(500);
    return {
      success: true,
      data: {
        id: userId,
        name: "John Doe",
        email: "john.doe@email.com",
        locationResponse: {
          id: 1,
          locationType: "USER" as const,
          address: "123 User Street",
          thana: "Dhanmondi",
          po: "Dhanmondi",
          city: "Dhaka",
          postalCode: 1205,
          zoneId: 1
        }
      }
    };
  }

  async updateUser(data: any) {
    await delay(500);
    return {
      success: true,
      data: {
        id: "user123",
        name: data.name || "Updated User",
        email: data.email || "updated@email.com",
        locationResponse: {
          id: 1,
          locationType: "USER" as const,
          address: data.address || "Updated Address",
          thana: "Updated Thana",
          po: "Updated PO",
          city: "Updated City",
          postalCode: 1234,
          zoneId: 1
        }
      }
    };
  }

  async deleteUserById(userId: string): Promise<void> {
    await delay(500);
    console.log(`User ${userId} deleted`);
  }

  async getAllHospitals(): Promise<Hospital[]> {
    await delay(2000);
    return mockHospitals;
  }

  async getHospitalById(id: string): Promise<Hospital> {
    await delay(1000);
    const hospital = mockHospitals.find(h => h.id === parseInt(id));
    if (!hospital) {
      return mockHospitals[0];
    }
    return hospital;
  }

  async searchHospitalsByCriteria(criteria: HospitalSearchCriteria): Promise<HospitalListItem[]> {
    await delay(1500);
    
    let filteredHospitals = [...mockHospitals];
    
    // Filter by cost range
    if (criteria.costRange) {
      filteredHospitals = filteredHospitals.filter(hospital => 
        hospital.costRange === COST_RANGE[criteria.costRange as keyof typeof COST_RANGE]
      );
    }
    
    // Filter by zone
    if (criteria.zoneId) {
      filteredHospitals = filteredHospitals.filter(hospital => 
        hospital.locationResponse?.zoneId === criteria.zoneId
      );
    }
    
    // Filter by types
    if (criteria.types && criteria.types.length > 0) {
      filteredHospitals = filteredHospitals.filter(hospital => 
        criteria.types!.some(type => hospital.types.includes(type))
      );
    }

    // Convert to HospitalListItem format
    return filteredHospitals.map(hospital => ({
      id: hospital.id,
      name: hospital.name,
      phoneNumber: hospital.phoneNumber,
      website: hospital.website,
      types: hospital.types.map(type => type.toString()),
      icus: hospital.icus,
      location: hospital.locationResponse ? `${hospital.locationResponse.city}, ${hospital.locationResponse.thana}` : null
    }));
  }

  async registerHospital(data: any): Promise<Hospital> {
    await delay(1000);
    return {
      id: Math.floor(Math.random() * 1000) + 100,
      ...data
    } as Hospital;
  }

  async deleteHospitalById(id: string): Promise<void> {
    await delay(500);
    console.log(`Hospital ${id} deleted`);
  }

  // Location service methods
  async getAllLocations(): Promise<LocationResponse[]> {
    await delay(1000);
    return mockHospitals.map(hospital => hospital.locationResponse!).filter(Boolean);
  }

  async getAllHospitalLocations(): Promise<LocationResponse[]> {
    await delay(1000);
    return mockHospitals.map(hospital => hospital.locationResponse!).filter(Boolean);
  }

  async getAllUserLocations(): Promise<LocationResponse[]> {
    await delay(1000);
    return [
      {
        id: 100,
        locationType: "USER",
        address: "123 User Street",
        thana: "Dhanmondi",
        po: "Dhanmondi",
        city: "Dhaka",
        postalCode: 1205,
        zoneId: 1
      }
    ];
  }

  async getAllDoctorLocations(): Promise<LocationResponse[]> {
    await delay(1000);
    return [
      {
        id: 200,
        locationType: "DOCTOR",
        address: "456 Doctor Ave",
        thana: "Gulshan",
        po: "Gulshan",
        city: "Dhaka",
        postalCode: 1212,
        zoneId: 1
      }
    ];
  }

  async getLocationById(id: string): Promise<LocationResponse> {
    await delay(500);
    const location = mockHospitals.find(h => h.locationResponse?.id === parseInt(id))?.locationResponse;
    if (location) {
      return location;
    }
    return {
      id: parseInt(id),
      locationType: "HOSPITAL",
      address: "Default Address",
      thana: "Default Thana",
      po: "Default PO",
      city: "Default City",
      postalCode: 1000,
      zoneId: 1
    };
  }

  async saveNewLocation(location: LocationResponse): Promise<LocationResponse> {
    await delay(500);
    return {
      ...location,
      id: Math.floor(Math.random() * 1000) + 1
    };
  }

  async updateLocation(location: LocationResponse): Promise<LocationResponse> {
    await delay(500);
    return location;
  }

  async deleteLocationById(id: string): Promise<void> {
    await delay(500);
    console.log(`Location ${id} deleted`);
  }
}

export const apiClient = new DummyApiClient();