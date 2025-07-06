import { Search } from "lucide-react";

// const API_BASE_URL = {
//   "location-service": "http://localhost:8083",
//   "auth-service": "http://localhost:8081",
//   "data-service": "http://localhost:8082",
// };

const API_BASE_URL = {
  "location-service": "http://services.caresync.district12.xyz:8083",
  "auth-service": "http://services.caresync.district12.xyz:8081",
  "data-service": "http://services.caresync.district12.xyz:8082",
};

// const API_BASE_URL = {
//   "location-service": "http://location-service:8083",
//   "auth-service": "http://auth-service:8081",
//   "data-service": "http://data-service:8082",
// };

const API_URLS = {
  location_service: {
    getAllLocations: `${API_BASE_URL["location-service"]}/location/v1/all`,
    getAllHospitalLocations: `${API_BASE_URL["location-service"]}/location/v1/hospitals`,
    getAllUserLocations: `${API_BASE_URL["location-service"]}/location/v1/users`,
    getAllDoctorLocations: `${API_BASE_URL["location-service"]}/location/v1/doctors`,
    getLocationById: (id: string) =>
      `${API_BASE_URL["location-service"]}/location/v1/id/${id}`,
    saveNewLocation: `${API_BASE_URL["location-service"]}/location/v1/add`,
    updateLocation: `${API_BASE_URL["location-service"]}/location/v1/update`,
    deleteLocationById: (id: string) =>
      `${API_BASE_URL["location-service"]}/location/v1/delete/${id}`,
  },
  data_service: {
    getAllHospitals: `${API_BASE_URL["data-service"]}/hospital/v1/all`,
    getHospitalById: (id: string) =>
      `${API_BASE_URL["data-service"]}/hospital/v1/id/${id}`,
    searchHospitalsByCriteria: `${API_BASE_URL["data-service"]}/hospital/v1/search`,
    registerHospital: `${API_BASE_URL["data-service"]}/hospital/v1/register`,
    updateHospital: `${API_BASE_URL["data-service"]}/hospital/v1/update`,
    deleteHospitalById: (id: string) =>
      `${API_BASE_URL["data-service"]}/hospital/v1/delete/${id}`,
  },
  auth_service: {
    testEndpoint: `${API_BASE_URL["auth-service"]}/user/v1/test`,
    registerUser: `${API_BASE_URL["auth-service"]}/user/v1/register`,
    login: `${API_BASE_URL["auth-service"]}/user/v1/login`,
    getUserById: (userId: string) =>
      `${API_BASE_URL["auth-service"]}/user/v1/get/${userId}`,
    updateUser: `${API_BASE_URL["auth-service"]}/user/v1/update`,
    deleteUserById: (userId: string) =>
      `${API_BASE_URL["auth-service"]}/user/v1/delete/${userId}`,
  },
};

export { API_BASE_URL, API_URLS };
