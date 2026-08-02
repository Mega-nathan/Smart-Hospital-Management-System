package com.hms.hospitalManagementSystem.doctor.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.List;

public class DoctorRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String specialization;

    private List<String> qualifications;

    @NotBlank(message = "Medical registration/license number is required")
    private String licenseNumber;

    @PositiveOrZero(message = "Years of experience must be zero or positive")
    private Integer yearsOfExperience;

    private String contactNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    private List<String> consultationTypes;

    private String departmentWardAssignment;

    private Long departmentId;

    @Valid
    private List<AvailabilitySlotDto> availability;

    @PositiveOrZero(message = "Consultation fee must be zero or positive")
    private Double consultationFee;

    // Optional custom password
    private String password;

    public DoctorRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public List<String> getQualifications() {
        return qualifications;
    }

    public void setQualifications(List<String> qualifications) {
        this.qualifications = qualifications;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getConsultationTypes() {
        return consultationTypes;
    }

    public void setConsultationTypes(List<String> consultationTypes) {
        this.consultationTypes = consultationTypes;
    }

    public String getDepartmentWardAssignment() {
        return departmentWardAssignment;
    }

    public void setDepartmentWardAssignment(String departmentWardAssignment) {
        this.departmentWardAssignment = departmentWardAssignment;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public List<AvailabilitySlotDto> getAvailability() {
        return availability;
    }

    public void setAvailability(List<AvailabilitySlotDto> availability) {
        this.availability = availability;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
