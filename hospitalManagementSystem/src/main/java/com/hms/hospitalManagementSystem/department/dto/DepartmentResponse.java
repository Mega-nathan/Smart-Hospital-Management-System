package com.hms.hospitalManagementSystem.department.dto;

import java.util.List;

public class DepartmentResponse {

    private Long id;
    private String name;
    private Long parentId;
    private String parentName;
    private List<DepartmentResponse> subDepartments;
    private List<BedResponse> beds;

    public DepartmentResponse() {
    }

    public DepartmentResponse(Long id, String name, Long parentId, String parentName, List<DepartmentResponse> subDepartments) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.parentName = parentName;
        this.subDepartments = subDepartments;
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

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public List<DepartmentResponse> getSubDepartments() {
        return subDepartments;
    }

    public void setSubDepartments(List<DepartmentResponse> subDepartments) {
        this.subDepartments = subDepartments;
    }

    public List<BedResponse> getBeds() {
        return beds;
    }

    public void setBeds(List<BedResponse> beds) {
        this.beds = beds;
    }
}
