# Hospital Management System - API Endpoints Reference

This document contains a comprehensive reference of all available API endpoints in the backend, including HTTP methods, security/roles, request parameters, and descriptions.

---

## 🔑 Authentication Endpoints

### 1. Log In (Admin & Doctors)
* **Method**: `POST`
* **URL**: `/hms-admin/auth/login`
* **Auth Required**: None (Public)
* **Request Header**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "username": "admin_username_or_doctor_email_or_id",
    "password": "your_secret_password"
  }
  ```
* **Response Body**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "username": "johndoe@hospital.com",
    "role": "ROLE_DOCTOR"  
  }
  ```

### 2. Register Admin
* **Method**: `POST`
* **URL**: `/hms-admin/auth/register`
* **Auth Required**: `ROLE_ADMIN`
* **Request Header**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "username": "newadmin",
    "email": "newadmin@hospital.com",
    "password": "securepassword"
  }
  ```
* **Response Body**:
  ```json
  {
    "message": "Admin registered successfully",
    "username": "newadmin",
    "email": "newadmin@hospital.com",
    "role": "ROLE_ADMIN"
  }
  ```

---

## 📊 Admin Dashboard Endpoints

### 1. Get Dashboard Analytics & Statistics
* **Method**: `GET`
* **URL**: `/hms-admin/dashboard`
* **Auth Required**: `ROLE_ADMIN`
* **Response Body**:
  ```json
  {
    "status": "success",
    "role": "ROLE_ADMIN",
    "welcomeMessage": "Welcome to the Hospital Management System Admin Dashboard",
    "stats": {
      "totalDoctors": 12,
      "totalPatients": 148,
      "activeConsultations": 34,
      "departmentsCount": 6
    }
  }
  ```

---

## 🩺 Admin Doctor Management Endpoints (Requires `ROLE_ADMIN`)

### 1. Add Doctor (JSON)
* **Method**: `POST`
* **URL**: `/hms-admin/doctors`
* **Auth Required**: `ROLE_ADMIN`
* **Request Header**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "fullName": "Dr. John Smith",
    "email": "smith@hospital.com",
    "licenseNumber": "LIC-123456",
    "specialization": "Pediatrics",
    "yearsOfExperience": 5,
    "contactNumber": "9876543210",
    "departmentWardAssignment": "Pediatric Ward B",
    "departmentId": 4,             // Optional: ID of the assigned department entity
    "consultationFee": 100.0,
    "qualifications": ["MBBS", "MD"],
    "consultationTypes": ["In-Person"],
    "password": "DocPassword123"  // Optional: generated dynamically if omitted
  }
  ```

### 2. Add Doctor with Profile Image (Multipart Form)
* **Method**: `POST`
* **URL**: `/hms-admin/doctors`
* **Auth Required**: `ROLE_ADMIN`
* **Request Header**: `Content-Type: multipart/form-data`
* **Form Fields**:
  - `doctor`: JSON String matching the Doctor JSON request structure (Option 1 above, configured with content type `application/json`).
  - `image` (Optional): Profile image file.

### 3. List All Doctors
* **Method**: `GET`
* **URL**: `/hms-admin/doctors`
* **Auth Required**: `ROLE_ADMIN`
* **Response**: Returns a list of all doctor profiles.

### 4. Fetch Doctor By ID
* **Method**: `GET`
* **URL**: `/hms-admin/doctors/{id}`
* **Auth Required**: `ROLE_ADMIN`

### 5. Update Doctor Details (JSON)
* **Method**: `PUT`
* **URL**: `/hms-admin/doctors/{id}`
* **Auth Required**: `ROLE_ADMIN`
* **Request Header**: `Content-Type: application/json`
* **Request Body**: Full/partial fields of the doctor request (except credentials/role).

### 6. Update Doctor Details with Profile Image (Multipart Form)
* **Method**: `PUT`
* **URL**: `/hms-admin/doctors/{id}`
* **Auth Required**: `ROLE_ADMIN`
* **Request Header**: `Content-Type: multipart/form-data`
* **Form Fields**:
  - `doctor`: JSON String matching `DoctorRequest` structure.
  - `image` (Optional): Profile image file.

### 7. Upload Profile Image Only
* **Method**: `POST`
* **URL**: `/hms-admin/doctors/{id}/profile-image`
* **Auth Required**: `ROLE_ADMIN`
* **Request Header**: `Content-Type: multipart/form-data`
* **Form Fields**:
  - `image`: Image file.

### 8. Delete Doctor Profile
* **Method**: `DELETE`
* **URL**: `/hms-admin/doctors/{id}`
* **Auth Required**: `ROLE_ADMIN`

---

## 🥼 Doctor Self-Service Endpoints (Requires `ROLE_DOCTOR`)

These endpoints allow the currently logged-in doctor to interact with their own profile.

### 1. Get Logged-In Doctor Profile
* **Method**: `GET`
* **URL**: `/hms-doctor/profile`
* **Auth Required**: `ROLE_DOCTOR` (Resolves using the JWT email claim)
* **Response Body**:
  ```json
  {
    "id": 1,
    "doctorId": "DOC-12345",
    "fullName": "Dr. John Smith",
    "email": "smith@hospital.com",
    "specialization": "Pediatrics",
    "contactNumber": "9876543210",
    "role": "ROLE_DOCTOR"
    // ... other profile details
  }
  ```

### 2. Update Profile Details (JSON)
* **Method**: `PUT`
* **URL**: `/hms-doctor/profile`
* **Auth Required**: `ROLE_DOCTOR`
* **Request Header**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "contactNumber": "9998887776",  // Optional
    "password": "NewSecurePassword" // Optional
  }
  ```

### 3. Update Profile Details & Image (Multipart Form)
* **Method**: `PUT`
* **URL**: `/hms-doctor/profile`
* **Auth Required**: `ROLE_DOCTOR`
* **Request Header**: `Content-Type: multipart/form-data`
* **Form Fields**:
  - `contactNumber` (Optional): New contact number.
  - `password` (Optional): New password.
  - `image` (Optional): Profile image file.

---

## 👥 Patient Management Endpoints (Requires `ROLE_ADMIN`)

### 1. Add Patient
* **Method**: `POST`
* **URL**: `/hms-admin/patients`
* **Auth Required**: `ROLE_ADMIN`
* **Request Header**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "age": 28,
    "gender": "Female",
    "bloodGroup": "O+",
    "contact": "9876543211",
    "admissionDate": "2026-08-02",  // Optional: defaults to today if omitted
    "problem": "Acute Appendicitis",
    "status": "Admitted",           // "Admitted", "Discharged", "Under Observation"
    "departmentId": 5,              // Optional: ID of the assigned department entity
    "bedId": 2                      // Optional: ID of the allocated bed (Requires Admitted status)
  }
  ```

### 2. List All Patients
* **Method**: `GET`
* **URL**: `/hms-admin/patients`
* **Auth Required**: `ROLE_ADMIN`

### 3. Fetch Patient By ID
* **Method**: `GET`
* **URL**: `/hms-admin/patients/{id}`
* **Auth Required**: `ROLE_ADMIN`

### 4. Update Patient Details
* **Method**: `PUT`
* **URL**: `/hms-admin/patients/{id}`
* **Auth Required**: `ROLE_ADMIN`
* **Request Body**: Full/partial fields matching `PatientRequest`. Changing `status` to `"Discharged"` automatically releases the patient's occupied bed and archives the stay.

### 5. Delete Patient
* **Method**: `DELETE`
* **URL**: `/hms-admin/patients/{id}`
* **Auth Required**: `ROLE_ADMIN`

---

## 🧑‍🤝‍🧑 Staff Management Endpoints (Requires `ROLE_ADMIN`)

### 1. Add Staff Member
* **Method**: `POST`
* **URL**: `/hms-admin/staff`
* **Auth Required**: `ROLE_ADMIN`
* **Request Body**:
  ```json
  {
    "name": "Alice Johnson",
    "role": "Nurse",               // Nurse, Technician, Support, etc.
    "department": "Cardiology",    // Deprecated string reference
    "departmentId": 6,             // ID of the assigned department entity
    "shift": "Morning",            // Morning, Evening, Night
    "status": "Active"             // Active, Off Duty
  }
  ```

### 2. List All Staff Members
* **Method**: `GET`
* **URL**: `/hms-admin/staff`
* **Auth Required**: `ROLE_ADMIN`

### 3. Fetch Staff Member By ID
* **Method**: `GET`
* **URL**: `/hms-admin/staff/{id}`
* **Auth Required**: `ROLE_ADMIN`

### 4. Update Staff Member Details
* **Method**: `PUT`
* **URL**: `/hms-admin/staff/{id}`
* **Auth Required**: `ROLE_ADMIN`
* **Request Body**: Fields matching `StaffRequest`.

### 5. Delete Staff Member
* **Method**: `DELETE`
* **URL**: `/hms-admin/staff/{id}`
* **Auth Required**: `ROLE_ADMIN`

---

## 🏢 Department & Bed Management Endpoints

### 1. Get Department Hierarchy Tree (Public)
* **Method**: `GET`
* **URL**: `/hms-public/departments`
* **Auth Required**: None (Public)
* **Response Body**:
  ```json
  [
    {
      "id": 1,
      "name": "Clinical Departments",
      "parentId": null,
      "parentName": null,
      "subDepartments": [
        {
          "id": 4,
          "name": "General Medicine",
          "parentId": 1,
          "parentName": "Clinical Departments",
          "subDepartments": []
        }
        // ... other clinical sub-departments
      ]
    }
    // ... diagnostic and critical care categories
  ]
  ```

### 2. Get Department Hierarchy Tree (Admin)
* **Method**: `GET`
* **URL**: `/hms-admin/departments`
* **Auth Required**: `ROLE_ADMIN`

### 3. Fetch Department Details By ID
* **Method**: `GET`
* **URL**: `/hms-admin/departments/{id}`
* **Auth Required**: `ROLE_ADMIN`

### 4. Add Custom Department
* **Method**: `POST`
* **URL**: `/hms-admin/departments`
* **Auth Required**: `ROLE_ADMIN`
* **Request Body**:
  ```json
  {
    "name": "Neurology",
    "parentId": 1         // Optional: parent category/department ID
  }
  ```

### 5. Update Department
* **Method**: `PUT`
* **URL**: `/hms-admin/departments/{id}`
* **Auth Required**: `ROLE_ADMIN`
* **Request Body**:
  ```json
  {
    "name": "Neurology Unit A",
    "parentId": 1
  }
  ```

### 6. Delete Department
* **Method**: `DELETE`
* **URL**: `/hms-admin/departments/{id}`
* **Auth Required**: `ROLE_ADMIN`

### 7. Get Beds in a Department
* **Method**: `GET`
* **URL**: `/hms-admin/departments/{id}/beds`
* **Auth Required**: `ROLE_ADMIN`
* **Response Body**:
  ```json
  [
    {
      "id": 1,
      "bedCode": "BED-GM-1",
      "isOccupied": true,
      "departmentId": 4,
      "departmentName": "General Medicine"
    },
    {
      "id": 2,
      "bedCode": "BED-GM-2",
      "isOccupied": false,
      "departmentId": 4,
      "departmentName": "General Medicine"
    }
  ]
  ```

### 8. Get Patient Bed Admission History
* **Method**: `GET`
* **URL**: `/hms-admin/departments/beds/history`
* **Auth Required**: `ROLE_ADMIN`
* **Response Body**:
  ```json
  [
    {
      "id": 1,
      "patientId": "PAT-10842",
      "patientName": "Jane Doe",
      "bedCode": "BED-GM-1",
      "departmentName": "General Medicine",
      "admissionDateTime": "2026-08-02T10:00:00",
      "dischargeDateTime": "2026-08-02T10:50:00"
    }
  ]
  ```

---

## 📅 Appointment Management Endpoints

### 1. Book an Appointment (Public)
* **Method**: `POST`
* **URL**: `/hms-public/appointments`
* **Auth Required**: None (Public)
* **Request Header**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "patientName": "John Doe",
    "patientPhone": "9876543210",
    "patientEmail": "johndoe@example.com",
    "appointmentDate": "2026-08-05",
    "timeSlot": "10:00 AM - 11:30 AM",
    "consultationType": "In-Person",
    "notes": "Regular heart checkup.",
    "doctorId": 3
  }
  ```
* **Response Body**:
  ```json
  {
    "id": 12,
    "patientName": "John Doe",
    "patientPhone": "9876543210",
    "patientEmail": "johndoe@example.com",
    "appointmentDate": "2026-08-05",
    "timeSlot": "10:00 AM - 11:30 AM",
    "consultationType": "In-Person",
    "notes": "Regular heart checkup.",
    "doctorId": 3,
    "doctorName": "Dr. Sarah Smith",
    "status": "Pending"
  }
  ```

### 2. List All Appointments
* **Method**: `GET`
* **URL**: `/hms-admin/appointments`
* **Auth Required**: `ROLE_ADMIN`

### 3. List Appointments by Doctor
* **Method**: `GET`
* **URL**: `/hms-admin/appointments/doctor/{doctorId}`
* **Auth Required**: `ROLE_ADMIN`

### 4. Approve / Cancel an Appointment
* **Method**: `PUT`
* **URL**: `/hms-admin/appointments/{id}/status`
* **Auth Required**: `ROLE_ADMIN`
* **Query Parameters**:
  - `status` (String, Required): Target status (e.g., `Approved`, `Cancelled`)

---

## 🔔 Real-time Notifications Endpoint

### 1. Subscribe to Real-time Roster/Dashboard Stream (SSE)
* **Method**: `GET`
* **URL**: `/hms-admin/realtime/stream`
* **Auth Required**: `ROLE_ADMIN`
* **Response Header**: `Content-Type: text/event-stream`
* **Description**: Server-Sent Events (SSE) stream broadcasting real-time triggers for Doctor, Patient, and Staff updates.


