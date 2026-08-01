package com.hms.hospitalManagementSystem.patient.service;

import com.hms.hospitalManagementSystem.common.realtime.RealtimeService;
import com.hms.hospitalManagementSystem.patient.dto.PatientRequest;
import com.hms.hospitalManagementSystem.patient.dto.PatientResponse;
import com.hms.hospitalManagementSystem.patient.model.Patient;
import com.hms.hospitalManagementSystem.patient.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final RealtimeService realtimeService;

    @Autowired
    public PatientService(PatientRepository patientRepository, RealtimeService realtimeService) {
        this.patientRepository = patientRepository;
        this.realtimeService = realtimeService;
    }

    public PatientResponse createPatient(PatientRequest request) {
        String patientId = generatePatientId();
        
        LocalDate admissionDate = request.getAdmissionDate();
        if (admissionDate == null) {
            admissionDate = LocalDate.now();
        }

        Patient patient = Patient.builder()
                .patientId(patientId)
                .name(request.getName())
                .age(request.getAge())
                .gender(request.getGender())
                .bloodGroup(request.getBloodGroup())
                .contact(request.getContact())
                .admissionDate(admissionDate)
                .problem(request.getProblem())
                .status(request.getStatus())
                .build();

        Patient saved = patientRepository.save(patient);
        
        // Notify frontend subscribers
        realtimeService.broadcast("patients", "created");

        return toResponse(saved);
    }

    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PatientResponse getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with ID: " + id));
        return toResponse(patient);
    }

    public PatientResponse updatePatient(Long id, PatientRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with ID: " + id));

        patient.setName(request.getName());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setContact(request.getContact());
        if (request.getAdmissionDate() != null) {
            patient.setAdmissionDate(request.getAdmissionDate());
        }
        patient.setProblem(request.getProblem());
        patient.setStatus(request.getStatus());

        Patient saved = patientRepository.save(patient);

        // Notify frontend subscribers
        realtimeService.broadcast("patients", "updated");

        return toResponse(saved);
    }

    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with ID: " + id));
        patientRepository.delete(patient);

        // Notify frontend subscribers
        realtimeService.broadcast("patients", "deleted");
    }

    private String generatePatientId() {
        String code;
        do {
            int randomNum = (int) (Math.random() * 90000) + 10000;
            code = "PAT-" + randomNum;
        } while (patientRepository.existsByPatientId(code));
        return code;
    }

    private PatientResponse toResponse(Patient patient) {
        PatientResponse response = new PatientResponse();
        response.setId(patient.getId());
        response.setPatientId(patient.getPatientId());
        response.setName(patient.getName());
        response.setAge(patient.getAge());
        response.setGender(patient.getGender());
        response.setBloodGroup(patient.getBloodGroup());
        response.setContact(patient.getContact());
        response.setAdmissionDate(patient.getAdmissionDate());
        response.setProblem(patient.getProblem());
        response.setStatus(patient.getStatus());
        return response;
    }
}
