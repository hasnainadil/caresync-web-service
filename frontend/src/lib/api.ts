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
          accessToken: data.accessToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      );
      this.setToken(data.accessToken);
      return response.data;
    } catch (error) {
      console.error("Error in registerUser:");
      console.error(error);
      throw error;
    }
  }

  async userLoggedIn(userId: string) {
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
          Authorization: `Bearer ${token}`,
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
    const token = await this.getToken();
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
  }

  async deleteHospitalById(id: string): Promise<void> {
    const token = await this.getToken();
    await axios.delete(API_URLS.data_service.deleteHospitalById(id), {
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
}

export const apiClient = new ApiClient();
