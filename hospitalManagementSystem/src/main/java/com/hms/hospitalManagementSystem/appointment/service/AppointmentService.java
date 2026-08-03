package com.hms.hospitalManagementSystem.appointment.service;

import com.hms.hospitalManagementSystem.appointment.dto.AppointmentRequest;
import com.hms.hospitalManagementSystem.appointment.dto.AppointmentResponse;
import com.hms.hospitalManagementSystem.appointment.model.Appointment;
import com.hms.hospitalManagementSystem.appointment.repository.AppointmentRepository;
import com.hms.hospitalManagementSystem.doctor.model.Doctor;
import com.hms.hospitalManagementSystem.doctor.repository.DoctorRepository;
import com.hms.hospitalManagementSystem.common.email.EmailService;
import com.hms.hospitalManagementSystem.common.realtime.RealtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final RealtimeService realtimeService;
    private final EmailService emailService;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            RealtimeService realtimeService,
            EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.realtimeService = realtimeService;
        this.emailService = emailService;
    }

    public AppointmentResponse createAppointment(AppointmentRequest request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + request.getDoctorId()));

        Appointment appointment = new Appointment();
        appointment.setPatientName(request.getPatientName());
        appointment.setPatientPhone(request.getPatientPhone());
        appointment.setPatientEmail(request.getPatientEmail());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setTimeSlot(request.getTimeSlot());
        appointment.setConsultationType(request.getConsultationType());
        appointment.setNotes(request.getNotes());
        appointment.setStatus("PENDING");
        appointment.setDoctor(doctor);

        Appointment saved = appointmentRepository.save(appointment);

        // SSE Real-Time broadcast trigger
        realtimeService.broadcast("appointments", "created");

        return mapToResponse(saved);
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found with ID: " + id));

        appointment.setStatus(status.toUpperCase());
        Appointment updated = appointmentRepository.save(appointment);

        // Send confirmation email to the patient if approved
        if (status.equalsIgnoreCase("APPROVED")) {
            emailService.sendAppointmentConfirmationEmail(updated);
        }

        // SSE Real-Time broadcast trigger
        realtimeService.broadcast("appointments", "updated");

        return mapToResponse(updated);
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        AppointmentResponse res = new AppointmentResponse();
        res.setId(appointment.getId());
        res.setPatientName(appointment.getPatientName());
        res.setPatientPhone(appointment.getPatientPhone());
        res.setPatientEmail(appointment.getPatientEmail());
        res.setAppointmentDate(appointment.getAppointmentDate());
        res.setTimeSlot(appointment.getTimeSlot());
        res.setConsultationType(appointment.getConsultationType());
        res.setNotes(appointment.getNotes());
        res.setStatus(appointment.getStatus());

        if (appointment.getDoctor() != null) {
            res.setDoctorId(appointment.getDoctor().getId());
            res.setDoctorName(appointment.getDoctor().getFullName());
            res.setDoctorSpecialization(appointment.getDoctor().getSpecialization());
        }
        return res;
    }
}
