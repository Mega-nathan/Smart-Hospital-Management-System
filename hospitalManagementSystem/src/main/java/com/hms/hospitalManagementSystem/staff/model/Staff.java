package com.hms.hospitalManagementSystem.staff.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import com.hms.hospitalManagementSystem.department.model.Department;

@Entity
@Table(name = "staff_members")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String staffId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String role; // Nurse, Technician, Support, etc.

    private String department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department departmentEntity;

    private String shift; // Morning, Evening, Night

    @Column(nullable = false)
    private String status; // Active, Off Duty

    public Staff() {
    }

    public Staff(Long id, String staffId, String name, String role, String department, Department departmentEntity, String shift, String status) {
        this.id = id;
        this.staffId = staffId;
        this.name = name;
        this.role = role;
        this.department = department;
        this.departmentEntity = departmentEntity;
        this.shift = shift;
        this.status = status;
    }

    // Builder pattern helper
    public static StaffBuilder builder() {
        return new StaffBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Department getDepartmentEntity() {
        return departmentEntity;
    }

    public void setDepartmentEntity(Department departmentEntity) {
        this.departmentEntity = departmentEntity;
    }

    public String getShift() {
        return shift;
    }

    public void setShift(String shift) {
        this.shift = shift;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public static class StaffBuilder {
        private Long id;
        private String staffId;
        private String name;
        private String role;
        private String department;
        private Department departmentEntity;
        private String shift;
        private String status;

        public StaffBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public StaffBuilder staffId(String staffId) {
            this.staffId = staffId;
            return this;
        }

        public StaffBuilder name(String name) {
            this.name = name;
            return this;
        }

        public StaffBuilder role(String role) {
            this.role = role;
            return this;
        }

        public StaffBuilder department(String department) {
            this.department = department;
            return this;
        }

        public StaffBuilder departmentEntity(Department departmentEntity) {
            this.departmentEntity = departmentEntity;
            return this;
        }

        public StaffBuilder shift(String shift) {
            this.shift = shift;
            return this;
        }

        public StaffBuilder status(String status) {
            this.status = status;
            return this;
        }

        public Staff build() {
            return new Staff(id, staffId, name, role, department, departmentEntity, shift, status);
        }
    }
}
