package com.hms.hospitalManagementSystem.patient.service;

import com.hms.hospitalManagementSystem.common.realtime.RealtimeService;
import com.hms.hospitalManagementSystem.patient.dto.PatientRequest;
import com.hms.hospitalManagementSystem.patient.dto.PatientResponse;
import com.hms.hospitalManagementSystem.patient.model.Patient;
import com.hms.hospitalManagementSystem.patient.repository.PatientRepository;
import com.hms.hospitalManagementSystem.department.model.Department;
import com.hms.hospitalManagementSystem.department.model.Bed;
import com.hms.hospitalManagementSystem.department.model.PatientBedHistory;
import com.hms.hospitalManagementSystem.department.repository.DepartmentRepository;
import com.hms.hospitalManagementSystem.department.repository.BedRepository;
import com.hms.hospitalManagementSystem.department.repository.PatientBedHistoryRepository;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final RealtimeService realtimeService;
    private final DepartmentRepository departmentRepository;
    private final BedRepository bedRepository;
    private final PatientBedHistoryRepository patientBedHistoryRepository;

    @Autowired
    public PatientService(PatientRepository patientRepository,
                          RealtimeService realtimeService,
                          DepartmentRepository departmentRepository,
                          BedRepository bedRepository,
                          PatientBedHistoryRepository patientBedHistoryRepository) {
        this.patientRepository = patientRepository;
        this.realtimeService = realtimeService;
        this.departmentRepository = departmentRepository;
        this.bedRepository = bedRepository;
        this.patientBedHistoryRepository = patientBedHistoryRepository;
    }

    public PatientResponse createPatient(PatientRequest request) {
        String patientId = generatePatientId();
        
        LocalDate admissionDate = request.getAdmissionDate();
        if (admissionDate == null) {
            admissionDate = LocalDate.now();
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + request.getDepartmentId()));
        }

        Bed bed = null;
        if (request.getBedId() != null) {
            bed = bedRepository.findById(request.getBedId())
                    .orElseThrow(() -> new IllegalArgumentException("Bed not found with ID: " + request.getBedId()));
            if (bed.isOccupied()) {
                throw new IllegalArgumentException("Bed '" + bed.getBedCode() + "' is already occupied");
            }
            if (department != null && (bed.getDepartment() == null || !bed.getDepartment().getId().equals(department.getId()))) {
                throw new IllegalArgumentException("Bed '" + bed.getBedCode() + "' does not belong to department: " + department.getName());
            }
            bed.setOccupied(true);
            bedRepository.save(bed);
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
                .department(department)
                .currentBed(bed)
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

        String oldStatus = patient.getStatus();
        String newStatus = request.getStatus();

        patient.setName(request.getName());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setContact(request.getContact());
        if (request.getAdmissionDate() != null) {
            patient.setAdmissionDate(request.getAdmissionDate());
        }
        patient.setProblem(request.getProblem());
        patient.setStatus(newStatus);

        // Handle Department update
        Department department = patient.getDepartment();
        if (request.getDepartmentId() != null) {
            if (department == null || !department.getId().equals(request.getDepartmentId())) {
                department = departmentRepository.findById(request.getDepartmentId())
                        .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + request.getDepartmentId()));
                patient.setDepartment(department);
            }
        } else {
            patient.setDepartment(null);
            department = null;
        }

        // Handle Bed update / status transitions
        if ("Discharged".equalsIgnoreCase(newStatus) && !"Discharged".equalsIgnoreCase(oldStatus)) {
            // Discharge patient: free the bed and save to history
            if (patient.getCurrentBed() != null) {
                Bed oldBed = patient.getCurrentBed();
                
                // Create PatientBedHistory
                PatientBedHistory history = PatientBedHistory.builder()
                        .patientId(patient.getPatientId())
                        .patientName(patient.getName())
                        .bedCode(oldBed.getBedCode())
                        .departmentName(department != null ? department.getName() : "Unknown")
                        .admissionDateTime(patient.getAdmissionDate() != null ? patient.getAdmissionDate().atStartOfDay() : LocalDateTime.now())
                        .dischargeDateTime(LocalDateTime.now())
                        .build();
                patientBedHistoryRepository.save(history);

                // Free the bed
                oldBed.setOccupied(false);
                bedRepository.save(oldBed);
                patient.setCurrentBed(null);
            }
        } else {
            // If not discharged, check if bed assignment changed
            Long newBedId = request.getBedId();
            Bed currentBed = patient.getCurrentBed();
            if (newBedId != null) {
                if (currentBed == null || !currentBed.getId().equals(newBedId)) {
                    // Free old bed if exists
                    if (currentBed != null) {
                        currentBed.setOccupied(false);
                        bedRepository.save(currentBed);
                    }
                    
                    // Assign new bed
                    Bed newBed = bedRepository.findById(newBedId)
                            .orElseThrow(() -> new IllegalArgumentException("Bed not found with ID: " + newBedId));
                    if (newBed.isOccupied()) {
                        throw new IllegalArgumentException("Bed '" + newBed.getBedCode() + "' is already occupied");
                    }
                    if (department != null && (newBed.getDepartment() == null || !newBed.getDepartment().getId().equals(department.getId()))) {
                        throw new IllegalArgumentException("Bed '" + newBed.getBedCode() + "' does not belong to department: " + department.getName());
                    }
                    newBed.setOccupied(true);
                    bedRepository.save(newBed);
                    patient.setCurrentBed(newBed);
                }
            } else {
                // If bedId is null, free old bed if it existed
                if (currentBed != null) {
                    currentBed.setOccupied(false);
                    bedRepository.save(currentBed);
                    patient.setCurrentBed(null);
                }
            }
        }

        Patient saved = patientRepository.save(patient);

        // Notify frontend subscribers
        realtimeService.broadcast("patients", "updated");

        return toResponse(saved);
    }

    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with ID: " + id));

        if (patient.getCurrentBed() != null) {
            Bed bed = patient.getCurrentBed();
            bed.setOccupied(false);
            bedRepository.save(bed);
        }

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
        if (patient.getDepartment() != null) {
            response.setDepartmentId(patient.getDepartment().getId());
            response.setDepartmentName(patient.getDepartment().getName());
        }
        if (patient.getCurrentBed() != null) {
            response.setBedId(patient.getCurrentBed().getId());
            response.setBedCode(patient.getCurrentBed().getBedCode());
        }
        return response;
    }
}
