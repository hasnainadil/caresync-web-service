# Test Controller V1 API Documentation

## Overview
The Test Controller V1 provides REST API endpoints for managing medical tests in the CareSync platform. This controller handles CRUD operations and search functionality for medical tests offered by hospitals.

**Base URL:** `/test/v1`

---

## Endpoints

### 1. Get All Tests
**GET** `/test/v1/all`

Retrieves all available medical tests in the system.

**Response:**
- **Status Code:** 200 OK
- **Content Type:** application/json
- **Body:** Array of TestResponse objects

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Complete Blood Count",
    "types": ["BLOOD", "GENERAL"],
    "price": 50.00,
    "hospitalResponse": {
      "id": 1,
      "name": "City General Hospital",
      "phoneNumber": "+1234567890",
      "website": "https://citygeneral.com",
      "types": ["GENERAL"],
      "icus": 10,
      "costRange": "MEDIUM",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "locationResponse": {
        "id": 1,
        "division": "New York",
        "district": "Manhattan",
        "upazila": "Downtown"
      }
    }
  }
]
```

---

### 2. Get Test by ID
**GET** `/test/v1/id/{id}`

Retrieves a specific medical test by its unique identifier.

**Path Parameters:**
- `id` (Long) - The unique identifier of the test

**Response:**
- **Status Code:** 200 OK
- **Content Type:** application/json
- **Body:** TestResponse object

**Example Request:**
```
GET /test/v1/id/1
```

**Example Response:**
```json
{
  "id": 1,
  "name": "Complete Blood Count",
  "types": ["BLOOD", "GENERAL"],
  "price": 50.00,
  "hospitalResponse": {
    "id": 1,
    "name": "City General Hospital",
    "phoneNumber": "+1234567890",
    "website": "https://citygeneral.com",
    "types": ["GENERAL"],
    "icus": 10,
    "costRange": "MEDIUM",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "locationResponse": {
      "id": 1,
      "division": "New York",
      "district": "Manhattan",
      "upazila": "Downtown"
    }
  }
}
```

---

### 3. Get Tests by Type
**GET** `/test/v1/type/{type}`

Retrieves all medical tests of a specific type.

**Path Parameters:**
- `type` (TEST_TYPE) - The type of medical test

**Available Test Types:**
- BLOOD
- HEART
- BRAIN
- LUNG
- EYE
- BONE
- SKIN
- GENERAL
- LIVER
- KIDNEY

**Response:**
- **Status Code:** 200 OK
- **Content Type:** application/json
- **Body:** Array of TestResponse objects

**Example Request:**
```
GET /test/v1/type/BLOOD
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Complete Blood Count",
    "types": ["BLOOD", "GENERAL"],
    "price": 50.00,
    "hospitalResponse": {
      "id": 1,
      "name": "City General Hospital",
      "phoneNumber": "+1234567890",
      "website": "https://citygeneral.com",
      "types": ["GENERAL"],
      "icus": 10,
      "costRange": "MEDIUM",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "locationResponse": {
        "id": 1,
        "division": "New York",
        "district": "Manhattan",
        "upazila": "Downtown"
      }
    }
  }
]
```

---

### 4. Get Tests by Hospital
**GET** `/test/v1/hospital/{hospitalId}`

Retrieves all medical tests offered by a specific hospital.

**Path Parameters:**
- `hospitalId` (Long) - The unique identifier of the hospital

**Response:**
- **Status Code:** 200 OK
- **Content Type:** application/json
- **Body:** Array of TestResponse objects

**Example Request:**
```
GET /test/v1/hospital/1
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Complete Blood Count",
    "types": ["BLOOD", "GENERAL"],
    "price": 50.00,
    "hospitalResponse": {
      "id": 1,
      "name": "City General Hospital",
      "phoneNumber": "+1234567890",
      "website": "https://citygeneral.com",
      "types": ["GENERAL"],
      "icus": 10,
      "costRange": "MEDIUM",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "locationResponse": {
        "id": 1,
        "division": "New York",
        "district": "Manhattan",
        "upazila": "Downtown"
      }
    }
  }
]
```

---

### 5. Add New Test
**POST** `/test/v1/add`

Creates a new medical test in the system.

**Request Body:**
- **Content Type:** application/json
- **Body:** TestAddRequest object

**TestAddRequest Schema:**
```json
{
  "userId": "string (required) - ID of the user creating the test",
  "name": "string (required) - Name of the medical test",
  "types": ["array of TEST_TYPE (required) - Types of the medical test"],
  "hospitalId": "number (required) - ID of the hospital offering this test",
  "price": "number (required) - Price of the test in decimal format"
}
```

**Response:**
- **Status Code:** 201 Created
- **Content Type:** application/json
- **Body:** TestResponse object

**Example Request:**
```json
{
  "userId": "user123",
  "name": "Cardiac Stress Test",
  "types": ["HEART", "GENERAL"],
  "hospitalId": 1,
  "price": 250.00
}
```

**Example Response:**
```json
{
  "id": 2,
  "name": "Cardiac Stress Test",
  "types": ["HEART", "GENERAL"],
  "price": 250.00,
  "hospitalResponse": {
    "id": 1,
    "name": "City General Hospital",
    "phoneNumber": "+1234567890",
    "website": "https://citygeneral.com",
    "types": ["GENERAL"],
    "icus": 10,
    "costRange": "MEDIUM",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "locationResponse": {
      "id": 1,
      "division": "New York",
      "district": "Manhattan",
      "upazila": "Downtown"
    }
  }
}
```

---

### 6. Update Test
**PUT** `/test/v1/update`

Updates an existing medical test.

**Request Body:**
- **Content Type:** application/json
- **Body:** TestUpdateRequest object

**TestUpdateRequest Schema:**
```json
{
  "id": "number (required) - ID of the test to update",
  "userId": "string (required) - ID of the user updating the test",
  "name": "string (required) - Updated name of the medical test",
  "types": ["array of TEST_TYPE (required) - Updated types of the medical test"],
  "price": "number (required) - Updated price of the test in decimal format"
}
```

**Response:**
- **Status Code:** 200 OK
- **Content Type:** application/json
- **Body:** TestResponse object

**Example Request:**
```json
{
  "id": 1,
  "userId": "user123",
  "name": "Complete Blood Count (Updated)",
  "types": ["BLOOD", "GENERAL"],
  "price": 55.00
}
```

**Example Response:**
```json
{
  "id": 1,
  "name": "Complete Blood Count (Updated)",
  "types": ["BLOOD", "GENERAL"],
  "price": 55.00,
  "hospitalResponse": {
    "id": 1,
    "name": "City General Hospital",
    "phoneNumber": "+1234567890",
    "website": "https://citygeneral.com",
    "types": ["GENERAL"],
    "icus": 10,
    "costRange": "MEDIUM",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "locationResponse": {
      "id": 1,
      "division": "New York",
      "district": "Manhattan",
      "upazila": "Downtown"
    }
  }
}
```

---

### 7. Delete Test
**DELETE** `/test/v1/delete/{id}`

Deletes a medical test from the system.

**Path Parameters:**
- `id` (Long) - The unique identifier of the test to delete

**Query Parameters:**
- `userId` (String) - The ID of the user performing the deletion

**Response:**
- **Status Code:** 204 No Content
- **Body:** Empty

**Example Request:**
```
DELETE /test/v1/delete/1?userId=user123
```

---

### 8. Search Tests
**POST** `/test/v1/search`

Searches for medical tests based on various criteria.

**Request Body:**
- **Content Type:** application/json
- **Body:** TestSearchRequest object

**TestSearchRequest Schema:**
```json
{
  "name": "string (optional) - Name or partial name of the test to search for",
  "types": ["array of TEST_TYPE (optional) - Types of tests to search for"],
  "minPrice": "number (optional) - Minimum price filter",
  "maxPrice": "number (optional) - Maximum price filter",
  "zoneId": "number (optional) - Zone ID to filter tests by location"
}
```

**Response:**
- **Status Code:** 200 OK
- **Content Type:** application/json
- **Body:** Array of TestResponse objects

**Example Request:**
```json
{
  "name": "blood",
  "types": ["BLOOD"],
  "minPrice": 40.00,
  "maxPrice": 100.00,
  "zoneId": 1
}
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Complete Blood Count",
    "types": ["BLOOD", "GENERAL"],
    "price": 50.00,
    "hospitalResponse": {
      "id": 1,
      "name": "City General Hospital",
      "phoneNumber": "+1234567890",
      "website": "https://citygeneral.com",
      "types": ["GENERAL"],
      "icus": 10,
      "costRange": "MEDIUM",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "locationResponse": {
        "id": 1,
        "division": "New York",
        "district": "Manhattan",
        "upazila": "Downtown"
      }
    }
  }
]
```

---

## Data Models

### TestResponse
```json
{
  "id": "number - Unique identifier of the test",
  "name": "string - Name of the medical test",
  "types": ["array of TEST_TYPE - Types of the medical test"],
  "price": "number - Price of the test in decimal format",
  "hospitalResponse": "HospitalResponse object - Details of the hospital offering this test"
}
```

### HospitalResponse
```json
{
  "id": "number - Unique identifier of the hospital",
  "name": "string - Name of the hospital",
  "phoneNumber": "string - Contact phone number",
  "website": "string - Hospital website URL",
  "types": ["array of HOSPITAL_TYPE - Types of the hospital"],
  "icus": "number - Number of ICU units",
  "costRange": "COST_RANGE - Cost range indicator",
  "latitude": "number - Geographic latitude",
  "longitude": "number - Geographic longitude",
  "locationResponse": "LocationResponse object - Location details"
}
```

### TEST_TYPE Enum Values
- `BLOOD` - Blood-related tests
- `HEART` - Cardiac tests
- `BRAIN` - Neurological tests
- `LUNG` - Pulmonary tests
- `EYE` - Ophthalmological tests
- `BONE` - Orthopedic tests
- `SKIN` - Dermatological tests
- `GENERAL` - General medical tests
- `LIVER` - Hepatic tests
- `KIDNEY` - Renal tests

---

## Error Handling

The API follows standard HTTP status codes:

- **200 OK** - Successful GET, PUT requests
- **201 Created** - Successful POST requests
- **204 No Content** - Successful DELETE requests
- **400 Bad Request** - Invalid request data or validation errors
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server-side errors

## Authentication & Authorization

All endpoints require proper authentication. Ensure that the `userId` parameter in requests corresponds to an authenticated user with appropriate permissions.

## Notes

1. All price values are in decimal format with two decimal places.
2. The `types` field is an array, allowing tests to be categorized under multiple types.
3. The search functionality supports partial matching and filtering by multiple criteria.
4. Hospital information is embedded in test responses for convenience.
5. Test deletion requires a userId parameter for audit purposes.
