import {
  Appointment,
  Rating,
  HOSPITAL_TYPE,
  COST_RANGE,
  LocationResponse,
  Hospital,
  HospitalSearchCriteria,
  UserRegistration,
  UserResponse,
  UpdateUserRequest,
  HospitalListItem,
  HospitalRegistrationRequest,
  TestResponse,
  TestAddRequest,
  TestUpdateRequest,
  TestSearchRequest,
  TEST_TYPE,
  HospitalResponse,
  DoctorResponse,
  DepartmentResponse,
  DoctorHospitalResponse,
  DoctorRegistrationRequest,
  DoctorUpdateRequest,
  FeedbackResponse,
  FeedbackCreateRequest,
  FeedbackUpdateRequest,
  FEEDBACK_TARGET_TYPE,
} from "@/types";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL, API_URLS } from "./api-urls";
import { auth } from "@/lib/firebase";

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

class ApiClient {
  setToken(token: string) {
    localStorage.setItem("auth_token", token);
  }

  private async getToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  async testAuthEndpoint(): Promise<any> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.auth_service.testEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async registerUser(data: UserRegistration) {
    try {
      console.log("registerUser");
      console.log(data);
      const accessToken = await this.getToken();
      console.log("accessToken", accessToken);

      const response = await axios.post(
        API_URLS.auth_service.registerUser,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      this.setToken(accessToken);
      return response.data;
    } catch (error) {
      console.error("Error in registerUser:");
      console.error(error);
      throw error;
    }
  }

  async userLoggedIn(userId: string) {
    console.log("userId", userId);
    try {
      const token = await this.getToken();
      const response = await axios.post(
        API_URLS.auth_service.login,
        {
          userId: userId,
          accessToken: token,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in userLoggedIn:");
      console.error(error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<UserResponse> {
    try {
      const token = await this.getToken();
      const response = await axios.get(
        API_URLS.auth_service.getUserById(userId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in getUserById:");
      console.error(error);
      throw error;
    }
  }

  async updateUser(data: UpdateUserRequest): Promise<UserResponse> {
    const token = await this.getToken();
    const response = await axios.put(
      API_URLS.auth_service.updateUser,
      {
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async deeleteUserById(userId: string): Promise<void> {
    const token = await this.getToken();
    await axios.delete(API_URLS.auth_service.deleteUserById(userId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getAllHospitals(): Promise<Hospital[]> {
    // const token = await this.getToken();
    // const response = await axios.get(API_URLS.data_service.getAllHospitals, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    const response = await axios.get(API_URLS.data_service.getAllHospitals);
    return response.data;
  }

  async getHospitalById(id: string): Promise<Hospital> {
    const token = await this.getToken();
    const response = await axios.get(
      API_URLS.data_service.getHospitalById(id),
      {
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async searchHospitalsByCriteria(
    criteria: HospitalSearchCriteria
  ): Promise<HospitalListItem[]> {
    try {
      const token = await this.getToken();
      const response = await axios.get(
        API_URLS.data_service.searchHospitalsByCriteria,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            costRange: criteria.costRange,
            zoneId: criteria.zoneId,
            types: criteria.types,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in searchHospitalsByCriteria:");
      console.error(error);
      throw error;
    }
  }

  async registerHospital(data: HospitalRegistrationRequest): Promise<Hospital> {
    try {
      const token = await this.getToken();
      delete data.id;
      const location = {
        locationType: "HOSPITAL" as const,
        ...data.location,
      };
      //  Remove the key id from the location
      delete location.id;
      const temp = {
        ...data,
        location: location,
      };
      console.log(temp);
      const response = await axios.post(
        API_URLS.data_service.registerHospital,
        {
          ...data,
          location: location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in registerHospital:");
      console.error(error);
      throw error;
    }
  }

  async updateHospital(data: HospitalRegistrationRequest): Promise<Hospital> {
    try {
      const token = await this.getToken();
      // console.log("endpoint", API_URLS.data_service.updateHospital);
      const response = await axios.put(
        API_URLS.data_service.updateHospital,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in updateHospital:");
      console.error(error);
      throw error;
    }
  }

  async deleteHospitalById(id: string, userId: string): Promise<void> {
    const token = await this.getToken();
    await axios.delete(API_URLS.data_service.deleteHospitalById(id, userId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getHospitalsByZone(zoneId: number): Promise<Hospital[]> {
    try {
      const token = await this.getToken();
      const response = await axios.get(
        API_URLS.data_service.getHospitalsByZone(zoneId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in getHospitalsByZone:");
      console.error(error);
      throw error;
    }
  }

  async getHospitalsByType(type: string): Promise<Hospital[]> {
    try {
      const token = await this.getToken();
      const response = await axios.get(
        API_URLS.data_service.getHospitalsByType(type),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in getHospitalsByType:");
      console.error(error);
      throw error;
    }
  }

  async getHospitalsByCostRange(costRange: string): Promise<Hospital[]> {
    try {
      const token = await this.getToken();
      const response = await axios.get(
        API_URLS.data_service.getHospitalsByCostRange(costRange),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in getHospitalsByCostRange:");
      console.error(error);
      throw error;
    }
  }

  async getAllLocations(): Promise<LocationResponse[]> {
    const token = await this.getToken();
    const response = await axios.get(
      API_URLS.location_service.getAllLocations,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async getAllHospitalLocations(): Promise<LocationResponse[]> {
    const token = await this.getToken();
    const response = await axios.get(
      API_URLS.location_service.getAllHospitalLocations,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async getAllUserLocations(): Promise<LocationResponse[]> {
    const token = await this.getToken();
    const response = await axios.get(
      API_URLS.location_service.getAllUserLocations,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async getAllDoctorLocations(): Promise<LocationResponse[]> {
    const token = await this.getToken();
    const response = await axios.get(
      API_URLS.location_service.getAllDoctorLocations,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async getLocationById(id: string): Promise<LocationResponse> {
    const token = await this.getToken();
    const response = await axios.get(
      API_URLS.location_service.getLocationById(id),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async saveNewLocation(location: LocationResponse): Promise<LocationResponse> {
    const token = await this.getToken();
    const response = await axios.post(
      API_URLS.location_service.saveNewLocation,
      location,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async updateLocation(location: LocationResponse): Promise<LocationResponse> {
    const token = await this.getToken();
    const response = await axios.put(
      API_URLS.location_service.updateLocation,
      location,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async deleteLocationById(id: string): Promise<void> {
    const token = await this.getToken();
    await axios.delete(API_URLS.location_service.deleteLocationById(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // --- Test Endpoints ---
  async getAllTests(): Promise<TestResponse[]> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.data_service.getAllTests, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getTestById(id: string | number): Promise<TestResponse> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.data_service.getTestById(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getTestsByType(type: TEST_TYPE): Promise<TestResponse[]> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.data_service.getTestsByType(type), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getTestsByHospital(hospitalId: string | number): Promise<TestResponse[]> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.data_service.getTestsByHospital(hospitalId), {
      // headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async addTest(data: TestAddRequest): Promise<TestResponse> {
    const token = await this.getToken();
    const response = await axios.post(
      API_URLS.data_service.addTest,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  async updateTest(data: TestUpdateRequest): Promise<TestResponse> {
    const token = await this.getToken();
    const response = await axios.put(
      API_URLS.data_service.updateTest,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  async deleteTestById(id: string | number, userId: string): Promise<void> {
    const token = await this.getToken();
    await axios.delete(API_URLS.data_service.deleteTestById(id, userId), {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async searchTests(criteria: TestSearchRequest): Promise<TestResponse[]> {
    const token = await this.getToken();
    const response = await axios.post(
      API_URLS.data_service.searchTests,
      criteria,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  // --- Doctor Endpoints ---
  async doctorServiceHealthCheck(): Promise<string> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.data_service.doctorServiceHealthCheck, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'text',
    });
    return response.data;
  }

  async getAllDoctors(): Promise<DoctorResponse[]> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.data_service.getAllDoctors, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getDoctorById(id: string | number): Promise<DoctorResponse> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.data_service.getDoctorById(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getDoctorsByHospital(hospitalId: string | number): Promise<DoctorResponse[]> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.data_service.getDoctorsByHospital(hospitalId), {
      // headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getHospitalsByDoctor(doctorId: string | number): Promise<HospitalResponse[]> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.data_service.getHospitalsByDoctor(doctorId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async registerDoctor(data: DoctorRegistrationRequest): Promise<DoctorResponse> {
    const token = await this.getToken();
    const response = await axios.post(
      API_URLS.data_service.registerDoctor,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  async updateDoctor(data: DoctorUpdateRequest): Promise<DoctorResponse> {
    const token = await this.getToken();
    const response = await axios.put(
      API_URLS.data_service.updateDoctor,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  async deleteDoctorById(id: string | number, userId: string): Promise<void> {
    const token = await this.getToken();
    await axios.delete(API_URLS.data_service.deleteDoctorById(id, userId), {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // --- Feedback Endpoints ---
  async getDoctorFeedbacks(doctorId: string | number): Promise<FeedbackResponse[]> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.feedback_service.getDoctorFeedbacks(doctorId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getHospitalFeedbacks(hospitalId: string | number): Promise<FeedbackResponse[]> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.feedback_service.getHospitalFeedbacks(hospitalId), {
      // headers: { Authorization: `Bearer ${token}` },
    });
    console.log("response", response.data);
    return response.data;
  }

  async getUserFeedbacks(userId: string): Promise<FeedbackResponse[]> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.feedback_service.getUserFeedbacks(userId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async addFeedback(data: FeedbackCreateRequest): Promise<FeedbackResponse> {
    const token = await this.getToken();
    const response = await axios.post(
      API_URLS.feedback_service.addFeedback,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  async updateFeedback(id: string | number, data: FeedbackUpdateRequest): Promise<FeedbackResponse> {
    const token = await this.getToken();
    const response = await axios.put(
      API_URLS.feedback_service.updateFeedback(id),
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  async deleteFeedbackById(feedbackId: string | number, userId: string): Promise<void> {
    const token = await this.getToken();
    await axios.delete(API_URLS.feedback_service.deleteFeedbackById(feedbackId, userId), {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // --- User/Admin Endpoints ---
  async verifyAdmin(userId: string): Promise<string> {
    const token = await this.getToken();
    const response = await axios.get(API_URLS.auth_service.verifyAdmin(userId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
