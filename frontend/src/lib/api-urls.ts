import { Search } from "lucide-react";

// const API_BASE_URL = {
//   "location-service": "http://localhost:8083",
//   "auth-service": "http://localhost:8081",
//   "data-service": "http://localhost:8082",
//   "feedback-service": "http://localhost:8084",
// };

const API_BASE_URL = {
  "location-service": "https://services.caresync.district12.xyz/location",
  "auth-service": "https://services.caresync.district12.xyz/auth",
  "data-service": "https://services.caresync.district12.xyz/data",
  "feedback-service": "https://services.caresync.district12.xyz/feedback",
};

// const API_BASE_URL = {
//   "location-service": "http://location-service:8083",
//   "auth-service": "http://auth-service:8081",
//   "data-service": "http://data-service:8082",
//   "feedback-service": "http://feedback-service:8084",
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
    deleteHospitalById: (id: string, userId: string) =>
      `${API_BASE_URL["data-service"]}/hospital/v1/delete/${id}/${userId}`,
    getHospitalsByZone: (zoneId: number) =>
      `${API_BASE_URL["data-service"]}/hospital/v1/zone/${zoneId}`,
    getHospitalsByType: (type: string) =>
      `${API_BASE_URL["data-service"]}/hospital/v1/type/${type}`,
    getHospitalsByCostRange: (costRange: string) =>
      `${API_BASE_URL["data-service"]}/hospital/v1/cost-range/${costRange}`,
    // --- Test Endpoints ---
    getAllTests: `${API_BASE_URL["data-service"]}/test/v1/all`,
    getTestById: (id: string | number) =>
      `${API_BASE_URL["data-service"]}/test/v1/id/${id}`,
    getTestsByType: (type: string) =>
      `${API_BASE_URL["data-service"]}/test/v1/type/${type}`,
    getTestsByHospital: (hospitalId: string | number) =>
      `${API_BASE_URL["data-service"]}/test/v1/hospital/${hospitalId}`,
    addTest: `${API_BASE_URL["data-service"]}/test/v1/add`,
    updateTest: `${API_BASE_URL["data-service"]}/test/v1/update`,
    deleteTestById: (id: string | number, userId: string) =>
      `${API_BASE_URL["data-service"]}/test/v1/delete/${id}?userId=${userId}`,
    searchTests: `${API_BASE_URL["data-service"]}/test/v1/search`,
    // --- Doctor Endpoints ---
    doctorServiceHealthCheck: `${API_BASE_URL["data-service"]}/doctor/v1/test`,
    getAllDoctors: `${API_BASE_URL["data-service"]}/doctor/v1/all`,
    getDoctorById: (id: string | number) =>
      `${API_BASE_URL["data-service"]}/doctor/v1/id/${id}`,
    getDoctorsByHospital: (hospitalId: string | number) =>
      `${API_BASE_URL["data-service"]}/doctor/v1/hospital/${hospitalId}`,
    getHospitalsByDoctor: (doctorId: string | number) =>
      `${API_BASE_URL["data-service"]}/doctor/v1/${doctorId}/hospitals`,
    registerDoctor: `${API_BASE_URL["data-service"]}/doctor/v1/register`,
    updateDoctor: `${API_BASE_URL["data-service"]}/doctor/v1/update`,
    deleteDoctorById: (id: string | number, userId: string) =>
      `${API_BASE_URL["data-service"]}/doctor/v1/delete/${id}?userId=${userId}`,
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
    verifyAdmin: (userId: string) =>
      `${API_BASE_URL["auth-service"]}/user/v1/verify-admin/${userId}`,
  },
  feedback_service: {
    getDoctorFeedbacks: (doctorId: string | number) =>
      `${API_BASE_URL["feedback-service"]}/feedback/v1/doctor/${doctorId}`,
    getHospitalFeedbacks: (hospitalId: string | number) =>
      `${API_BASE_URL["feedback-service"]}/feedback/v1/hospital/${hospitalId}`,
    getUserFeedbacks: (userId: string) =>
      `${API_BASE_URL["feedback-service"]}/feedback/v1/user/${userId}`,
    addFeedback: `${API_BASE_URL["feedback-service"]}/feedback/v1`,
    updateFeedback: (id: string | number) =>
      `${API_BASE_URL["feedback-service"]}/feedback/v1/${id}`,
    deleteFeedbackById: (feedbackId: string | number, userId: string) =>
      `${API_BASE_URL["feedback-service"]}/feedback/v1/${feedbackId}?userId=${userId}`,
  },
};

export { API_BASE_URL, API_URLS };
