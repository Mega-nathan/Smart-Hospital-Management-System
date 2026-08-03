package com.hms.hospitalManagementSystem.doctor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.hospitalManagementSystem.doctor.dto.DoctorProfileUpdateRequest;
import com.hms.hospitalManagementSystem.doctor.dto.DoctorResponse;
import com.hms.hospitalManagementSystem.doctor.service.DoctorService;
import com.hms.hospitalManagementSystem.appointment.service.AppointmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.security.Principal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class DoctorSelfControllerTest {

    private MockMvc mockMvc;
    private DoctorService doctorService;
    private AppointmentService appointmentService;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        doctorService = mock(DoctorService.class);
        appointmentService = mock(AppointmentService.class);
        DoctorSelfController controller = new DoctorSelfController(doctorService, appointmentService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void getProfile_authenticated_returnsProfile() throws Exception {
        DoctorResponse response = new DoctorResponse();
        response.setEmail("doctor@example.com");
        response.setFullName("Dr. House");
        response.setRole("ROLE_DOCTOR");

        when(doctorService.getDoctorByEmail("doctor@example.com")).thenReturn(response);

        Principal principal = mock(Principal.class);
        when(principal.getName()).thenReturn("doctor@example.com");

        mockMvc.perform(get("/hms-doctor/profile").principal(principal))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("doctor@example.com"))
                .andExpect(jsonPath("$.fullName").value("Dr. House"));
    }

    @Test
    public void updateProfile_validRequest_returnsUpdatedProfile() throws Exception {
        DoctorProfileUpdateRequest request = new DoctorProfileUpdateRequest("1234567890", "newPassword123");
        DoctorResponse response = new DoctorResponse();
        response.setEmail("doctor@example.com");
        response.setContactNumber("1234567890");

        when(doctorService.updateDoctorProfile(eq("doctor@example.com"), eq("1234567890"), eq("newPassword123"), any()))
                .thenReturn(response);

        Principal principal = mock(Principal.class);
        when(principal.getName()).thenReturn("doctor@example.com");

        mockMvc.perform(put("/hms-doctor/profile")
                        .principal(principal)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contactNumber").value("1234567890"));
    }
}
