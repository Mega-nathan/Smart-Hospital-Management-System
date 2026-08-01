package com.hms.hospitalManagementSystem.appointment.controller;

import com.hms.hospitalManagementSystem.appointment.dto.AppointmentRequest;
import com.hms.hospitalManagementSystem.appointment.dto.AppointmentResponse;
import com.hms.hospitalManagementSystem.appointment.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // Public Endpoint to Book an Appointment
    @PostMapping("/hms-public/appointments")
    public ResponseEntity<AppointmentResponse> bookAppointment(@RequestBody AppointmentRequest request) {
        AppointmentResponse response = appointmentService.createAppointment(request);
        return ResponseEntity.ok(response);
    }

    // Admin Endpoint to List All Appointments
    @GetMapping("/hms-admin/appointments")
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        List<AppointmentResponse> response = appointmentService.getAllAppointments();
        return ResponseEntity.ok(response);
    }

    // Admin Endpoint to List Appointments by Doctor
    @GetMapping("/hms-admin/appointments/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        List<AppointmentResponse> response = appointmentService.getAppointmentsByDoctor(doctorId);
        return ResponseEntity.ok(response);
    }

    // Admin Endpoint to Approve / Cancel an Appointment
    @PutMapping("/hms-admin/appointments/{id}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        AppointmentResponse response = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(response);
    }
}
