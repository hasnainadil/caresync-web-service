# Hospital Management API Documentation

## Table of Contents
- [Authentication](#authentication)
- [Hospital Search & View](#hospital-search--view)
- [Doctor Information](#doctor-information)
- [Doctors Within Hospital](#doctors-within-hospital)
- [Diagnostic Tests](#diagnostic-tests)
- [Hospital Departments](#hospital-departments)
- [Hospital Ratings & Reviews](#hospital-ratings--reviews)
- [User Appointments](#user-appointments)
- [Hospital Admin Panel](#hospital-admin-panel)

## Authentication

### **1. POST `/auth/register`**

Registers a new user.

**Request Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "location": "Dhaka"
}
```

**Success Response – 201**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email."
}
```

**Error Response – 409**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "An account with this email already exists."
  }
}
```

### **2. POST `/auth/verify-otp`**

Verifies the OTP sent to a user's email.

**Request Body**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Success Response – 200**
```json
{
  "success": true,
  "message": "OTP verified successfully."
}
```

**Error Response – 400**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_OTP",
    "message": "OTP is incorrect or has expired."
  }
}
```

### **3. POST `/auth/login`**

Logs a user into the platform.

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response – 200**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

**Error Response – 401**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect."
  }
}
```

## Hospital Search & View

### **4. GET `/hospitals`**

Search or filter hospitals.

**Query Parameters**
```
?location=Dhaka&type=public&min_rating=4&query=heart&doctor_name=Ali&department_name=Cardiology&test_name=X-ray&sort_by=rating
```

**Success Response – 200**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Heart Care Hospital",
      "address": "123 Road, Dhaka",
      "phone_number": "01700000000",
      "rating": 4.7
    }
  ]
}
```

**Error Response – 500**
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "An unexpected error occurred during hospital search."
  }
}
```

### **5. GET `/hospitals/:id`**

Fetch full hospital details.

**Success Response – 200**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Heart Care Hospital",
    "address": "123 Road, Dhaka",
    "phone_number": "01700000000",
    "website": "https://heartcare.com",
    "location": "Dhaka",
    "type": "public",
    "icus": 20
  }
}
```

**Error Response – 404**
```json
{
  "success": false,
  "error": {
    "code": "HOSPITAL_NOT_FOUND",
    "message": "No hospital found with the given ID."
  }
}
```

## Doctor Information

### **6. GET `/doctors/:id`**

Get full doctor details.

**Success Response – 200**
```json
{
  "success": true,
  "data": {
    "id": 101,
    "name": "Dr. Ali Hossain",
    "specialty": "Cardiology",
    "phone_number": "01800000000",
    "email": "ali@care.com",
    "location": "Dhaka",
    "department": {
      "id": 5,
      "name": "Cardiology"
    }
  }
}
```

**Error Response – 404**
```json
{
  "success": false,
  "error": {
    "code": "DOCTOR_NOT_FOUND",
    "message": "Doctor not found with the provided ID."
  }
}
```

### **7. GET `/doctors/:id/hospitals`**

Get hospitals a doctor works at.

**Success Response – 200**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Heart Care Hospital",
      "address": "123 Road, Dhaka",
      "phone_number": "01700000000"
    }
  ]
}
```

## Doctors Within Hospital

### **8. GET `/hospitals/:id/doctors`**

List of doctors in a hospital.

**Success Response – 200**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "name": "Dr. Ali Hossain",
      "specialty": "Cardiology",
      "phone_number": "01800000000"
    }
  ]
}
```

## Diagnostic Tests

### **9. GET `/hospitals/:id/tests`**

Diagnostic tests available at a hospital.

**Success Response – 200**
```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "name": "X-Ray",
      "description": "Chest X-ray",
      "cost": 300,
      "availability": "available"
    }
  ]
}
```

## Hospital Departments

### **10. GET `/hospitals/:id/departments`**

Departments in a hospital.

**Success Response – 200**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "name": "Cardiology",
      "description": "Heart and blood vessels",
      "head_doctor_name": "Dr. Ali Hossain",
      "contact_number": "01800000000",
      "beds": 10,
      "available_days": ["Monday", "Wednesday", "Friday"]
    }
  ]
}
```

## Hospital Ratings & Reviews

### **11. GET `/hospitals/:id/ratings`**

Fetch all reviews for a hospital.

**Success Response – 200**
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "user_name": "John Doe",
      "rating": 5,
      "review_text": "Excellent care!",
      "created_at": "2025-05-01T10:00:00Z"
    }
  ]
}
```

### **12. POST `/hospitals/:id/ratings`**

Submit a new rating and review.

**Request Body**
```json
{
  "rating": 4,
  "review_text": "Helpful staff and clean facility."
}
```

**Success Response – 201**
```json
{
  "success": true,
  "message": "Rating submitted successfully."
}
```

**Error Response – 400**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Rating must be between 1 and 5."
  }
}
```

### **13. PUT `/ratings/:id`**

Update an existing review.

**Request Body**
```json
{
  "rating": 3,
  "review_text": "Updated after second visit."
}
```

**Success Response – 200**
```json
{
  "success": true,
  "message": "Rating updated successfully."
}
```

**Error Response – 403**
```json
{
  "success": false,
  "error": {
    "code": "NOT_AUTHORIZED",
    "message": "You are not allowed to update this review."
  }
}
```

### **14. DELETE `/ratings/:id`**

Delete a user's own review.

**Success Response – 200**
```json
{
  "success": true,
  "message": "Rating deleted successfully."
}
```

## User Appointments

### **15. GET `/appointments`**

Fetch logged-in user's appointments.

**Success Response – 200**
```json
{
  "success": true,
  "data": [
    {
      "id": 9,
      "doctor_name": "Dr. Ali Hossain",
      "hospital_name": "Heart Care Hospital",
      "appointment_time": "2025-05-10T15:00:00Z",
      "status": "booked"
    }
  ]
}
```

### **16. POST `/appointments`**

Book a new appointment.

**Request Body**
```json
{
  "doctor_hospital_id": 34,
  "appointment_time": "2025-05-10T15:00:00Z"
}
```

**Success Response – 201**
```json
{
  "success": true,
  "message": "Appointment booked successfully."
}
```

**Error Response – 409**
```json
{
  "success": false,
  "error": {
    "code": "TIME_SLOT_UNAVAILABLE",
    "message": "Selected appointment time is not available."
  }
}
```

### **17. DELETE `/appointments/:id`**

Cancel an appointment.

**Success Response – 200**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully."
}
```

## Hospital Admin Panel

### **18. POST `/hospital-admin/login`**

Admin login.

**Request Body**
```json
{
  "email": "admin@heartcare.com",
  "password": "AdminPass123!"
}
```

**Success Response – 200**
```json
{
  "success": true,
  "token": "admin.jwt.token"
}
```

### **19. PUT `/hospital-admin/hospitals/:id`**

Update hospital details.

**Request Body**
```json
{
  "name": "Updated Name",
  "address": "New Location",
  "phone_number": "01911111111",
  "website": "https://updated.com",
  "location": "Dhaka",
  "type": "private",
  "icus": 30
}
```

**Success Response – 200**
```json
{
  "success": true,
  "message": "Hospital information updated."
}
```

### **20. POST `/hospital-admin/hospitals/:id/doctors`**

Add existing doctor to hospital.

**Request Body**
```json
{
  "doctor_id": 102,
  "appointment_time": "2025-05-10T12:00:00Z",
  "weekly_schedule": ["Monday", "Wednesday"],
  "appointment_fee": 500
}
```

**Success Response – 201**
```json
{
  "success": true,
  "message": "Doctor added to hospital."
}
```

### **21. POST `/hospital-admin/hospitals/:id/doctors/request`**

Request to add a new doctor.

**Request Body**
```json
{
  "name": "Dr. Farzana Rahman",
  "specialty": "Neurology",
  "phone_number": "01700000001",
  "email": "farzana@neuro.com",
  "location": "Chittagong"
}
```

**Success Response – 202**
```json
{
  "success": true,
  "message": "Doctor request submitted for approval."
}
```

### **22. POST `/hospital-admin/hospitals/:id/tests`**

Add existing test to hospital.

**Request Body**
```json
{
  "test_id": 4,
  "cost": 350,
  "availability": "available"
}
```

**Success Response – 201**
```json
{
  "success": true,
  "message": "Test added to hospital successfully."
}
```

### **23. POST `/hospital-admin/hospitals/:id/tests/request`**

Request to add new test.

**Request Body**
```json
{
  "name": "MRI Scan",
  "description": "Brain and spinal imaging"
}
```

**Success Response – 202**
```json
{
  "success": true,
  "message": "Test request submitted for approval."
}
```

### **24. PUT `/hospital-admin/hospitals/:id/tests/:test_id`**

Update test availability or cost.

**Request Body**
```json
{
  "cost": 400,
  "availability": "not available"
}
```

**Success Response – 200**
```json
{
  "success": true,
  "message": "Test information updated successfully."
}
```

### **25. POST `/hospital-admin/hospitals/:id/departments`**

Add existing department to hospital.

**Request Body**
```json
{
  "department_id": 2,
  "head_doctor_id": 102,
  "contact_number": "01922222222",
  "beds": 15,
  "available_days": ["Sunday", "Tuesday"]
}
```

**Success Response – 201**
```json
{
  "success": true,
  "message": "Department added to hospital successfully."
}
```

### **26. POST `/hospital-admin/hospitals/:id/departments/request`**

Request to add a new department.

**Request Body**
```json
{
  "name": "Endocrinology",
  "description": "Hormonal disorders"
}
```

**Success Response – 202**
```json
{
  "success": true,
  "message": "Department request submitted for approval."
}
```

### **27. PUT `/hospital-admin/hospitals/:id/departments/:dept_id/head`**

Update department head.

**Request Body**
```json
{
  "head_doctor_id": 110
}
```

**Success Response – 200**
```json
{
  "success": true,
  "message": "Department head updated successfully."
}
```