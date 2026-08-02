package com.hms.hospitalManagementSystem.department.dto;

import jakarta.validation.constraints.NotBlank;

public class DepartmentRequest {

    @NotBlank(message = "Department name is required")
    private String name;

    private Long parentId;

    private Integer totalBeds;

    public DepartmentRequest() {
    }

    public DepartmentRequest(String name, Long parentId, Integer totalBeds) {
        this.name = name;
        this.parentId = parentId;
        this.totalBeds = totalBeds;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Integer getTotalBeds() {
        return totalBeds;
    }

    public void setTotalBeds(Integer totalBeds) {
        this.totalBeds = totalBeds;
    }
}
