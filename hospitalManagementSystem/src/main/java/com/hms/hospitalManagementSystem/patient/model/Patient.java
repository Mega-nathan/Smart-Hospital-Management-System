package com.hms.hospitalManagementSystem.patient.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import com.hms.hospitalManagementSystem.department.model.Department;
import com.hms.hospitalManagementSystem.department.model.Bed;
import java.time.LocalDate;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String patientId;

    @Column(nullable = false)
    private String name;

    private Integer age;

    private String gender;

    private String bloodGroup;

    private String contact;

    private LocalDate admissionDate;

    private String problem;

    @Column(nullable = false)
    private String status; // Admitted, Discharged, Under Observation

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_bed_id")
    private Bed currentBed;

    public Patient() {
    }

    public Patient(Long id, String patientId, String name, Integer age, String gender, String bloodGroup,
                   String contact, LocalDate admissionDate, String problem, String status, Department department, Bed currentBed) {
        this.id = id;
        this.patientId = patientId;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.contact = contact;
        this.admissionDate = admissionDate;
        this.problem = problem;
        this.status = status;
        this.department = department;
        this.currentBed = currentBed;
    }

    // Builder pattern helper
    public static PatientBuilder builder() {
        return new PatientBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    public String getProblem() {
        return problem;
    }

    public void setProblem(String problem) {
        this.problem = problem;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Bed getCurrentBed() {
        return currentBed;
    }

    public void setCurrentBed(Bed currentBed) {
        this.currentBed = currentBed;
    }

    public static class PatientBuilder {
        private Long id;
        private String patientId;
        private String name;
        private Integer age;
        private String gender;
        private String bloodGroup;
        private String contact;
        private LocalDate admissionDate;
        private String problem;
        private String status;
        private Department department;
        private Bed currentBed;

        public PatientBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PatientBuilder patientId(String patientId) {
            this.patientId = patientId;
            return this;
        }

        public PatientBuilder name(String name) {
            this.name = name;
            return this;
        }

        public PatientBuilder age(Integer age) {
            this.age = age;
            return this;
        }

        public PatientBuilder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public PatientBuilder bloodGroup(String bloodGroup) {
            this.bloodGroup = bloodGroup;
            return this;
        }

        public PatientBuilder contact(String contact) {
            this.contact = contact;
            return this;
        }

        public PatientBuilder admissionDate(LocalDate admissionDate) {
            this.admissionDate = admissionDate;
            return this;
        }

        public PatientBuilder problem(String problem) {
            this.problem = problem;
            return this;
        }

        public PatientBuilder status(String status) {
            this.status = status;
            return this;
        }

        public PatientBuilder department(Department department) {
            this.department = department;
            return this;
        }

        public PatientBuilder currentBed(Bed currentBed) {
            this.currentBed = currentBed;
            return this;
        }

        public Patient build() {
            return new Patient(id, patientId, name, age, gender, bloodGroup, contact, admissionDate, problem, status, department, currentBed);
        }
    }
}
