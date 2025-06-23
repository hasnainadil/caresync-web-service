import { Appointment, Rating } from "@/types";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL, API_URLS } from "./api-urls";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  token?: string;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
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
// {
//   "userId": "user-3",
//   "accessToken": "accessToken",
//   "name": "John Doe",
//   "email": "hasn@gmail.com",
//   "password": "john@123",
//   "location": {
//     "locationType": "USER",
//     "address": "new address",
//     "thana": "kg",
//     "po": "kg",
//     "city": "Sylhet",
//     "postalCode": 1009,
//     "zoneId": 9
//   }
// }

interface Hospital {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  website?: string;
  location: string;
  type: "public" | "private";
  icus: number;
  rating: number;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  phone_number: string;
  email: string;
}

interface Department {
  id: number;
  name: string;
  description: string;
  head_doctor_name: string;
  contact_number: string;
  beds: number;
  available_days: string[];
}

interface DiagnosticTest {
  id: number;
  name: string;
  description: string;
  cost: number;
  availability: string;
}

interface HospitalListItem {
  id: number;
  name: string;
  phoneNumber: string;
  website?: string;
  types: string[];
  icus: number;
  location: string | null;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("auth_token");
  }
  private async request(
    serviceName: keyof typeof API_URLS,
    endpoint: string,
    options: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<any, any>> {
    const baseUrl = API_URLS[serviceName as keyof typeof API_URLS];
    const url = `${baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    console.log("Making request to:", url);
    console.log(options);
    console.log("Headers:", headers);
    const response = await axios(url, {
      ...options,
      headers: headers,
    });

    console.log("Response status:", response.status);
    return response;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }
  async register(data: {
    name: string;
    email: string;
    password: string;
    location: string;
  }) {
    return this.request("auth-service", "/auth/register", {
      method: "POST",
      data: JSON.stringify(data),
    });
  }

  async verifyOtp(data: { email: string; otp: string }) {
    return this.request("auth-service", "/auth/verify-otp", {
      method: "POST",
      data: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request("auth-service", "/auth/login", {
      method: "POST",
      data: JSON.stringify(data),
    });
  }
  async searchHospitals(filters: any) {
    const params = new URLSearchParams(filters).toString();
    return this.request("data-service", `/hospitals?${params}`);
  }

  async getHospital(id: string) {
    return this.request("data-service", `/hospitals/${id}`);
  }

  async getHospitalDoctors(id: string) {
    return this.request("data-service", `/hospitals/${id}/doctors`);
  }

  async getHospitalDepartments(id: string) {
    return this.request("data-service", `/hospitals/${id}/departments`);
  }

  async getHospitalTests(id: string) {
    return this.request("data-service", `/hospitals/${id}/tests`);
  }

  async getHospitalRatings(id: string) {
    return this.request("data-service", `/hospitals/${id}/ratings`);
  }
  async addHospitalRating(
    id: string,
    data: { rating: number; review_text: string }
  ) {
    return this.request("data-service", `/hospitals/${id}/ratings`, {
      method: "POST",
      data: JSON.stringify(data),
    });
  }

  async updateRating(
    id: string,
    data: { rating: number; review_text: string }
  ) {
    return this.request("data-service", `/ratings/${id}`, {
      method: "PUT",
      data: JSON.stringify(data),
    });
  }

  async deleteRating(id: string) {
    return this.request("data-service", `/ratings/${id}`, {
      method: "DELETE",
    });
  }
  async getDoctor(id: string) {
    return this.request("data-service", `/doctors/${id}`);
  }

  async getDoctorHospitals(id: string) {
    return this.request("data-service", `/doctors/${id}/hospitals`);
  }

  async getAppointments() {
    return this.request("data-service", "/appointments");
  }

  async bookAppointment(data: {
    doctor_hospital_id: number;
    appointment_time: string;
  }) {
    return this.request("data-service", "/appointments", {
      method: "POST",
      data: JSON.stringify(data),
    });
  }

  async cancelAppointment(id: string) {
    return this.request("data-service", `/appointments/${id}`, {
      method: "DELETE",
    });
  }
  async adminLogin(data: { email: string; password: string }) {
    return this.request("auth-service", "/hospital-admin/login", {
      method: "POST",
      data: JSON.stringify(data),
    });
  }

  // Admin API Methods
  async updateHospital(id: string, data: Partial<Hospital>) {
    return this.request("data-service", `/hospital-admin/hospitals/${id}`, {
      method: "PUT",
      data: JSON.stringify(data),
    });
  }
  async addDoctorToHospital(
    hospitalId: string,
    data: {
      doctor_id: number;
      appointment_time: string;
      weekly_schedule: string[];
      appointment_fee: number;
    }
  ) {
    return this.request(
      "data-service",
      `/hospital-admin/hospitals/${hospitalId}/doctors`,
      {
        method: "POST",
        data: JSON.stringify(data),
      }
    );
  }

  async requestNewDoctor(
    hospitalId: string,
    data: {
      name: string;
      specialty: string;
      phone_number: string;
      email: string;
      location: string;
    }
  ) {
    return this.request(
      "data-service",
      `/hospital-admin/hospitals/${hospitalId}/doctors/request`,
      {
        method: "POST",
        data: JSON.stringify(data),
      }
    );
  }
  async addTestToHospital(
    hospitalId: string,
    data: {
      test_id: number;
      cost: number;
      availability: string;
    }
  ) {
    return this.request(
      "data-service",
      `/hospital-admin/hospitals/${hospitalId}/tests`,
      {
        method: "POST",
        data: JSON.stringify(data),
      }
    );
  }

  async requestNewTest(
    hospitalId: string,
    data: { name: string; description: string }
  ) {
    return this.request(
      "data-service",
      `/hospital-admin/hospitals/${hospitalId}/tests/request`,
      {
        method: "POST",
        data: JSON.stringify(data),
      }
    );
  }

  async updateTest(
    hospitalId: string,
    testId: string,
    data: { cost: number; availability: string }
  ) {
    return this.request(
      "data-service",
      `/hospital-admin/hospitals/${hospitalId}/tests/${testId}`,
      {
        method: "PUT",
        data: JSON.stringify(data),
      }
    );
  }
  async addDepartmentToHospital(
    hospitalId: string,
    data: {
      department_id: number;
      head_doctor_id: number;
      contact_number: string;
      beds: number;
      available_days: string[];
    }
  ) {
    return this.request(
      "data-service",
      `/hospital-admin/hospitals/${hospitalId}/departments`,
      {
        method: "POST",
        data: JSON.stringify(data),
      }
    );
  }

  async requestNewDepartment(
    hospitalId: string,
    data: { name: string; description: string }
  ) {
    return this.request(
      "data-service",
      `/hospital-admin/hospitals/${hospitalId}/departments/request`,
      {
        method: "POST",
        data: JSON.stringify(data),
      }
    );
  }

  async updateDepartmentHead(
    hospitalId: string,
    departmentId: string,
    data: { head_doctor_id: number }
  ) {
    return this.request(
      "data-service",
      `/hospital-admin/hospitals/${hospitalId}/departments/${departmentId}/head`,
      {
        method: "PUT",
        data: JSON.stringify(data),
      }
    );
  }

  async registerUser(data: UserRegistration) {
    try {
      console.log("registerUser");
      const response = await axios.post(
        API_URLS.auth_service.registerUser,
        {
          userId: data.userId,
          name: data.name,
          email: data.email,
          password: data.password,
          location: {
            locationType: "USER",
            address: data.location.address,
            thana: data.location.thana,
            po: data.location.po,
            city: data.location.city,
            postalCode: data.location.postalCode,
            zoneId: data.location.zoneId,
          },
          accessToken: data.accessToken
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      );
      console.log("Response from /user/v1/test:");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error in registerUser:");
      console.error(error);
      throw error;
    }
  }

  async getAllHospitals(): Promise<Hospital[]> {
    const response = await axios.get(API_URLS.data_service.getAllHospitals);
    console.log(response);
    return response.data;
  }

  async getHospitalById(id: string): Promise<Hospital> {
    const response = await axios.get(API_URLS.data_service.getHospitalById(id));
    return response.data;
  }
}

export const apiClient = new ApiClient();
