package com.hms.hospitalManagementSystem.doctor.dto;

public class DoctorProfileUpdateRequest {
    private String contactNumber;
    private String password;

    public DoctorProfileUpdateRequest() {}

    public DoctorProfileUpdateRequest(String contactNumber, String password) {
        this.contactNumber = contactNumber;
        this.password = password;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
