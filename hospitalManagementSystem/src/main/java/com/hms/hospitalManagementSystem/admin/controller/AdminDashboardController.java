package com.hms.hospitalManagementSystem.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/hms-admin/dashboard")
public class AdminDashboardController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "success");
        data.put("role", "ROLE_ADMIN");
        data.put("welcomeMessage", "Welcome to the Hospital Management System Admin Dashboard");
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDoctors", 12);
        stats.put("totalPatients", 148);
        stats.put("activeConsultations", 34);
        stats.put("departmentsCount", 6);
        
        data.put("stats", stats);
        
        return ResponseEntity.ok(data);
    }
}
