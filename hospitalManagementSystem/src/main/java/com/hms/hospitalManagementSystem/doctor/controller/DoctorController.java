package com.hms.hospitalManagementSystem.doctor.controller;

import com.hms.hospitalManagementSystem.doctor.dto.DoctorRequest;
import com.hms.hospitalManagementSystem.doctor.dto.DoctorResponse;
import com.hms.hospitalManagementSystem.doctor.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/hms-admin/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    @Autowired
    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DoctorResponse> createDoctorJson(@Valid @RequestBody DoctorRequest request) {
        DoctorResponse response = doctorService.createDoctor(request, null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DoctorResponse> createDoctorMultipart(
            @RequestPart("doctor") @Valid DoctorRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        DoctorResponse response = doctorService.createDoctor(request, imageFile);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponse> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DoctorResponse> updateDoctorJson(
            @PathVariable Long id,
            @Valid @RequestBody DoctorRequest request) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, request, null));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DoctorResponse> updateDoctorMultipart(
            @PathVariable Long id,
            @RequestPart("doctor") @Valid DoctorRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, request, imageFile));
    }

    @PostMapping("/{id}/profile-image")
    public ResponseEntity<DoctorResponse> uploadProfileImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok(doctorService.uploadProfileImage(id, imageFile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}
