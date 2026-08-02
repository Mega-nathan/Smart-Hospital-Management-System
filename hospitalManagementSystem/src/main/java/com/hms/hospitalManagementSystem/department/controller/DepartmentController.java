package com.hms.hospitalManagementSystem.department.controller;

import com.hms.hospitalManagementSystem.department.dto.BedResponse;
import com.hms.hospitalManagementSystem.department.dto.DepartmentRequest;
import com.hms.hospitalManagementSystem.department.dto.DepartmentResponse;
import com.hms.hospitalManagementSystem.department.dto.PatientBedHistoryResponse;
import com.hms.hospitalManagementSystem.department.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DepartmentController {

    private final DepartmentService departmentService;

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // Public endpoint to retrieve the department hierarchy
    @GetMapping("/hms-public/departments")
    public ResponseEntity<List<DepartmentResponse>> getPublicDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartmentsTree());
    }

    // Admin endpoints
    @GetMapping("/hms-admin/departments")
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartmentsTree());
    }

    @GetMapping("/hms-admin/departments/{id}")
    public ResponseEntity<DepartmentResponse> getDepartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getDepartmentById(id));
    }

    @PostMapping("/hms-admin/departments")
    public ResponseEntity<DepartmentResponse> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse response = departmentService.createDepartment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/hms-admin/departments/{id}")
    public ResponseEntity<DepartmentResponse> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(departmentService.updateDepartment(id, request));
    }

    @DeleteMapping("/hms-admin/departments/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/hms-admin/departments/{id}/beds")
    public ResponseEntity<List<BedResponse>> getBedsByDepartmentId(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getBedsByDepartmentId(id));
    }

    @GetMapping("/hms-admin/departments/beds/history")
    public ResponseEntity<List<PatientBedHistoryResponse>> getPatientBedHistory() {
        return ResponseEntity.ok(departmentService.getPatientBedHistory());
    }
}
