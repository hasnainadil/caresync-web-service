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

const API_URLS = {
  location_service: {
    // getAllHospitals: `${API_BASE_URL["location-service"]}/ho`,
  },
  data_service: {
    getAllHospitals: `${API_BASE_URL["data-service"]}/hospital/v1/all`,
    getHospitalById: (id: string) =>
      `${API_BASE_URL["data-service"]}/hospital/v1/id/${id}`,
  },
  auth_service: {
    registerUser: `${API_BASE_URL["auth-service"]}/user/v1/register`,
  },
};

export { API_BASE_URL, API_URLS };
