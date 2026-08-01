package com.hms.hospitalManagementSystem.staff.dto;

import jakarta.validation.constraints.NotBlank;

public class StaffRequest {

    @NotBlank(message = "Staff member name is required")
    private String name;

    @NotBlank(message = "Staff role is required")
    private String role;

    private String department;

    @NotBlank(message = "Shift assignment is required")
    private String shift;

    @NotBlank(message = "Status is required")
    private String status;

    public StaffRequest() {
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
}
