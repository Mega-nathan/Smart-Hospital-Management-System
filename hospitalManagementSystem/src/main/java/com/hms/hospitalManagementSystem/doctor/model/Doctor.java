package com.hms.hospitalManagementSystem.doctor.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.util.List;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String doctorId;

    @Column(nullable = false)
    private String fullName;

    private String specialization;

    @ElementCollection
    @CollectionTable(name = "doctor_qualifications", joinColumns = @JoinColumn(name = "doctor_id"))
    @Column(name = "qualification")
    private List<String> qualifications;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    private Integer yearsOfExperience;

    private String contactNumber;

    @Column(nullable = false, unique = true)
    private String email;

    @ElementCollection
    @CollectionTable(name = "doctor_consultation_types", joinColumns = @JoinColumn(name = "doctor_id"))
    @Column(name = "consultation_type")
    private List<String> consultationTypes;

    private String departmentWardAssignment;

    @ElementCollection
    @CollectionTable(name = "doctor_availability", joinColumns = @JoinColumn(name = "doctor_id"))
    private List<AvailabilitySlot> availability;

    private Double consultationFee;

    // Login credentials / RBAC
    private String password;

    private String role;

    // Image upload (Profile Image Path)
    private String profileImagePath;

    public Doctor() {
    }

    public Doctor(Long id, String doctorId, String fullName, String specialization, List<String> qualifications,
                  String licenseNumber, Integer yearsOfExperience, String contactNumber, String email,
                  List<String> consultationTypes, String departmentWardAssignment, List<AvailabilitySlot> availability,
                  Double consultationFee, String password, String role, String profileImagePath) {
        this.id = id;
        this.doctorId = doctorId;
        this.fullName = fullName;
        this.specialization = specialization;
        this.qualifications = qualifications;
        this.licenseNumber = licenseNumber;
        this.yearsOfExperience = yearsOfExperience;
        this.contactNumber = contactNumber;
        this.email = email;
        this.consultationTypes = consultationTypes;
        this.departmentWardAssignment = departmentWardAssignment;
        this.availability = availability;
        this.consultationFee = consultationFee;
        this.password = password;
        this.role = role;
        this.profileImagePath = profileImagePath;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
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

    public List<AvailabilitySlot> getAvailability() {
        return availability;
    }

    public void setAvailability(List<AvailabilitySlot> availability) {
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getProfileImagePath() {
        return profileImagePath;
    }

    public void setProfileImagePath(String profileImagePath) {
        this.profileImagePath = profileImagePath;
    }

    public static DoctorBuilder builder() {
        return new DoctorBuilder();
    }

    public static class DoctorBuilder {
        private Long id;
        private String doctorId;
        private String fullName;
        private String specialization;
        private List<String> qualifications;
        private String licenseNumber;
        private Integer yearsOfExperience;
        private String contactNumber;
        private String email;
        private List<String> consultationTypes;
        private String departmentWardAssignment;
        private List<AvailabilitySlot> availability;
        private Double consultationFee;
        private String password;
        private String role;
        private String profileImagePath;

        DoctorBuilder() {
        }

        public DoctorBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public DoctorBuilder doctorId(String doctorId) {
            this.doctorId = doctorId;
            return this;
        }

        public DoctorBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public DoctorBuilder specialization(String specialization) {
            this.specialization = specialization;
            return this;
        }

        public DoctorBuilder qualifications(List<String> qualifications) {
            this.qualifications = qualifications;
            return this;
        }

        public DoctorBuilder licenseNumber(String licenseNumber) {
            this.licenseNumber = licenseNumber;
            return this;
        }

        public DoctorBuilder yearsOfExperience(Integer yearsOfExperience) {
            this.yearsOfExperience = yearsOfExperience;
            return this;
        }

        public DoctorBuilder contactNumber(String contactNumber) {
            this.contactNumber = contactNumber;
            return this;
        }

        public DoctorBuilder email(String email) {
            this.email = email;
            return this;
        }

        public DoctorBuilder consultationTypes(List<String> consultationTypes) {
            this.consultationTypes = consultationTypes;
            return this;
        }

        public DoctorBuilder departmentWardAssignment(String departmentWardAssignment) {
            this.departmentWardAssignment = departmentWardAssignment;
            return this;
        }

        public DoctorBuilder availability(List<AvailabilitySlot> availability) {
            this.availability = availability;
            return this;
        }

        public DoctorBuilder consultationFee(Double consultationFee) {
            this.consultationFee = consultationFee;
            return this;
        }

        public DoctorBuilder password(String password) {
            this.password = password;
            return this;
        }

        public DoctorBuilder role(String role) {
            this.role = role;
            return this;
        }

        public DoctorBuilder profileImagePath(String profileImagePath) {
            this.profileImagePath = profileImagePath;
            return this;
        }

        public Doctor build() {
            return new Doctor(id, doctorId, fullName, specialization, qualifications, licenseNumber,
                    yearsOfExperience, contactNumber, email, consultationTypes, departmentWardAssignment,
                    availability, consultationFee, password, role, profileImagePath);
        }
    }
}
