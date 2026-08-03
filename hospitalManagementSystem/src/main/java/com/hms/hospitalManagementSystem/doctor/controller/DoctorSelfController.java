package com.hms.hospitalManagementSystem.doctor.controller;

import com.hms.hospitalManagementSystem.doctor.dto.DoctorProfileUpdateRequest;
import com.hms.hospitalManagementSystem.doctor.dto.DoctorResponse;
import com.hms.hospitalManagementSystem.doctor.service.DoctorService;
import com.hms.hospitalManagementSystem.appointment.dto.AppointmentResponse;
import com.hms.hospitalManagementSystem.appointment.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/hms-doctor")
public class DoctorSelfController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;

    @Autowired
    public DoctorSelfController(DoctorService doctorService, AppointmentService appointmentService) {
        this.doctorService = doctorService;
        this.appointmentService = appointmentService;
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getDoctorAppointments(Principal principal) {
        String email = principal.getName();
        DoctorResponse doctor = doctorService.getDoctorByEmail(email);
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByDoctor(doctor.getId());
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            Principal principal,
            @PathVariable Long id,
            @RequestParam String status) {
        String email = principal.getName();
        DoctorResponse doctor = doctorService.getDoctorByEmail(email);
        
        // Safety check: ensure the appointment belongs to the logged-in doctor
        List<AppointmentResponse> doctorAppointments = appointmentService.getAppointmentsByDoctor(doctor.getId());
        boolean belongsToDoctor = doctorAppointments.stream().anyMatch(app -> app.getId().equals(id));
        if (!belongsToDoctor) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        AppointmentResponse response = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<DoctorResponse> getProfile(Principal principal) {
        String email = principal.getName();
        return ResponseEntity.ok(doctorService.getDoctorByEmail(email));
    }

    @PutMapping(value = "/profile", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DoctorResponse> updateProfileJson(
            Principal principal,
            @RequestBody DoctorProfileUpdateRequest request) {
        String email = principal.getName();
        DoctorResponse response = doctorService.updateDoctorProfile(
                email,
                request.getContactNumber(),
                request.getPassword(),
                null
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DoctorResponse> updateProfileMultipart(
            Principal principal,
            @RequestParam(value = "contactNumber", required = false) String contactNumber,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        String email = principal.getName();
        DoctorResponse response = doctorService.updateDoctorProfile(
                email,
                contactNumber,
                password,
                imageFile
        );
        return ResponseEntity.ok(response);
    }
}
