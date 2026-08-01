package com.hms.hospitalManagementSystem.doctor.controller;

import com.hms.hospitalManagementSystem.doctor.dto.DoctorProfileUpdateRequest;
import com.hms.hospitalManagementSystem.doctor.dto.DoctorResponse;
import com.hms.hospitalManagementSystem.doctor.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/hms-doctor")
public class DoctorSelfController {

    private final DoctorService doctorService;

    @Autowired
    public DoctorSelfController(DoctorService doctorService) {
        this.doctorService = doctorService;
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
