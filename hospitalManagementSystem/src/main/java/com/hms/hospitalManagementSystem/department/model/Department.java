package com.hms.hospitalManagementSystem.department.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hms.hospitalManagementSystem.doctor.model.Doctor;
import com.hms.hospitalManagementSystem.patient.model.Patient;
import com.hms.hospitalManagementSystem.staff.model.Staff;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonIgnoreProperties({"subDepartments", "doctors", "patients", "staffs", "beds"})
    private Department parentDepartment;

    @OneToMany(mappedBy = "parentDepartment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"parentDepartment"})
    private List<Department> subDepartments = new ArrayList<>();

    @OneToMany(mappedBy = "department")
    private List<Doctor> doctors = new ArrayList<>();

    @OneToMany(mappedBy = "department")
    private List<Patient> patients = new ArrayList<>();

    @OneToMany(mappedBy = "department")
    private List<Staff> staffs = new ArrayList<>();

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bed> beds = new ArrayList<>();

    public Department() {
    }

    public Department(Long id, String name, Department parentDepartment) {
        this.id = id;
        this.name = name;
        this.parentDepartment = parentDepartment;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Department getParentDepartment() {
        return parentDepartment;
    }

    public void setParentDepartment(Department parentDepartment) {
        this.parentDepartment = parentDepartment;
    }

    public List<Department> getSubDepartments() {
        return subDepartments;
    }

    public void setSubDepartments(List<Department> subDepartments) {
        this.subDepartments = subDepartments;
    }

    public List<Doctor> getDoctors() {
        return doctors;
    }

    public void setDoctors(List<Doctor> doctors) {
        this.doctors = doctors;
    }

    public List<Patient> getPatients() {
        return patients;
    }

    public void setPatients(List<Patient> patients) {
        this.patients = patients;
    }

    public List<Staff> getStaffs() {
        return staffs;
    }

    public void setStaffs(List<Staff> staffs) {
        this.staffs = staffs;
    }

    public List<Bed> getBeds() {
        return beds;
    }

    public void setBeds(List<Bed> beds) {
        this.beds = beds;
    }

    public static DepartmentBuilder builder() {
        return new DepartmentBuilder();
    }

    public static class DepartmentBuilder {
        private Long id;
        private String name;
        private Department parentDepartment;

        DepartmentBuilder() {
        }

        public DepartmentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public DepartmentBuilder name(String name) {
            this.name = name;
            return this;
        }

        public DepartmentBuilder parentDepartment(Department parentDepartment) {
            this.parentDepartment = parentDepartment;
            return this;
        }

        public Department build() {
            return new Department(id, name, parentDepartment);
        }
    }
}
