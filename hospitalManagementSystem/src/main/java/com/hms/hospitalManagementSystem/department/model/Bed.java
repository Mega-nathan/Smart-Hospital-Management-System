package com.hms.hospitalManagementSystem.department.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hms.hospitalManagementSystem.patient.model.Patient;
import jakarta.persistence.*;

@Entity
@Table(name = "beds")
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String bedCode;

    @Column(nullable = false)
    private boolean isOccupied = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    @JsonIgnoreProperties({"beds", "doctors", "patients", "staffs", "subDepartments", "parentDepartment"})
    private Department department;

    @OneToOne(mappedBy = "currentBed", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"currentBed", "department"})
    private Patient currentPatient;

    public Bed() {
    }

    public Bed(Long id, String bedCode, boolean isOccupied, Department department) {
        this.id = id;
        this.bedCode = bedCode;
        this.isOccupied = isOccupied;
        this.department = department;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBedCode() {
        return bedCode;
    }

    public void setBedCode(String bedCode) {
        this.bedCode = bedCode;
    }

    public boolean isOccupied() {
        return isOccupied;
    }

    public void setOccupied(boolean occupied) {
        isOccupied = occupied;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Patient getCurrentPatient() {
        return currentPatient;
    }

    public void setCurrentPatient(Patient currentPatient) {
        this.currentPatient = currentPatient;
    }

    public static BedBuilder builder() {
        return new BedBuilder();
    }

    public static class BedBuilder {
        private Long id;
        private String bedCode;
        private boolean isOccupied;
        private Department department;

        BedBuilder() {
        }

        public BedBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BedBuilder bedCode(String bedCode) {
            this.bedCode = bedCode;
            return this;
        }

        public BedBuilder isOccupied(boolean isOccupied) {
            this.isOccupied = isOccupied;
            return this;
        }

        public BedBuilder department(Department department) {
            this.department = department;
            return this;
        }

        public Bed build() {
            return new Bed(id, bedCode, isOccupied, department);
        }
    }
}
