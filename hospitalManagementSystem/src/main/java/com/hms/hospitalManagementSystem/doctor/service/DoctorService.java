package com.hms.hospitalManagementSystem.doctor.service;

import com.hms.hospitalManagementSystem.doctor.dto.AvailabilitySlotDto;
import com.hms.hospitalManagementSystem.doctor.dto.DoctorRequest;
import com.hms.hospitalManagementSystem.doctor.dto.DoctorResponse;
import com.hms.hospitalManagementSystem.doctor.model.AvailabilitySlot;
import com.hms.hospitalManagementSystem.doctor.model.Doctor;
import com.hms.hospitalManagementSystem.doctor.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DoctorService(DoctorRepository doctorRepository,
                         FileStorageService fileStorageService,
                         @Lazy PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.fileStorageService = fileStorageService;
        this.passwordEncoder = passwordEncoder;
    }

    public DoctorResponse createDoctor(DoctorRequest request, MultipartFile imageFile) {
        if (doctorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }
        if (doctorRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new IllegalArgumentException("License number is already registered");
        }

        String rawPassword = request.getPassword();
        boolean passwordGenerated = false;
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            rawPassword = "Doc@" + ((int) (Math.random() * 900000) + 100000);
            passwordGenerated = true;
        }

        String profileImagePath = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            profileImagePath = fileStorageService.storeFile(imageFile);
        }

        Doctor doctor = Doctor.builder()
                .doctorId(generateDoctorId())
                .fullName(request.getFullName())
                .specialization(request.getSpecialization())
                .qualifications(request.getQualifications())
                .licenseNumber(request.getLicenseNumber())
                .yearsOfExperience(request.getYearsOfExperience())
                .contactNumber(request.getContactNumber())
                .email(request.getEmail())
                .consultationTypes(request.getConsultationTypes())
                .departmentWardAssignment(request.getDepartmentWardAssignment())
                .consultationFee(request.getConsultationFee())
                .password(passwordEncoder.encode(rawPassword))
                .role("ROLE_DOCTOR")
                .profileImagePath(profileImagePath)
                .build();

        if (request.getAvailability() != null) {
            doctor.setAvailability(request.getAvailability().stream()
                    .map(this::toEntity)
                    .collect(Collectors.toList()));
        }

        Doctor saved = doctorRepository.save(doctor);
        DoctorResponse response = toResponse(saved);
        if (passwordGenerated || request.getPassword() != null) {
            response.setTemporaryPassword(rawPassword);
        }
        return response;
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + id));
        return toResponse(doctor);
    }

    public DoctorResponse updateDoctor(Long id, DoctorRequest request, MultipartFile imageFile) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + id));

        if (!doctor.getEmail().equalsIgnoreCase(request.getEmail()) && doctorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }
        if (!doctor.getLicenseNumber().equalsIgnoreCase(request.getLicenseNumber()) && doctorRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new IllegalArgumentException("License number is already registered");
        }

        doctor.setFullName(request.getFullName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualifications(request.getQualifications());
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setYearsOfExperience(request.getYearsOfExperience());
        doctor.setContactNumber(request.getContactNumber());
        doctor.setEmail(request.getEmail());
        doctor.setConsultationTypes(request.getConsultationTypes());
        doctor.setDepartmentWardAssignment(request.getDepartmentWardAssignment());
        doctor.setConsultationFee(request.getConsultationFee());

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            doctor.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            String profileImagePath = fileStorageService.storeFile(imageFile);
            doctor.setProfileImagePath(profileImagePath);
        }

        if (request.getAvailability() != null) {
            doctor.setAvailability(request.getAvailability().stream()
                    .map(this::toEntity)
                    .collect(Collectors.toList()));
        }

        Doctor saved = doctorRepository.save(doctor);
        return toResponse(saved);
    }

    public DoctorResponse uploadProfileImage(Long id, MultipartFile imageFile) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + id));

        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }

        String profileImagePath = fileStorageService.storeFile(imageFile);
        doctor.setProfileImagePath(profileImagePath);
        Doctor saved = doctorRepository.save(doctor);
        return toResponse(saved);
    }

    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + id));
        doctorRepository.delete(doctor);
    }

    private String generateDoctorId() {
        String code;
        do {
            int randomNum = (int) (Math.random() * 90000) + 10000;
            code = "DOC-" + randomNum;
        } while (doctorRepository.findByDoctorId(code).isPresent());
        return code;
    }

    private AvailabilitySlot toEntity(AvailabilitySlotDto dto) {
        if (dto == null) return null;
        return new AvailabilitySlot(dto.getDayOfWeek(), dto.getStartTime(), dto.getEndTime());
    }

    private AvailabilitySlotDto toDto(AvailabilitySlot entity) {
        if (entity == null) return null;
        return new AvailabilitySlotDto(entity.getDayOfWeek(), entity.getStartTime(), entity.getEndTime());
    }

    private DoctorResponse toResponse(Doctor doctor) {
        if (doctor == null) return null;
        DoctorResponse response = new DoctorResponse();
        response.setId(doctor.getId());
        response.setDoctorId(doctor.getDoctorId());
        response.setFullName(doctor.getFullName());
        response.setSpecialization(doctor.getSpecialization());
        response.setQualifications(doctor.getQualifications());
        response.setLicenseNumber(doctor.getLicenseNumber());
        response.setYearsOfExperience(doctor.getYearsOfExperience());
        response.setContactNumber(doctor.getContactNumber());
        response.setEmail(doctor.getEmail());
        response.setConsultationTypes(doctor.getConsultationTypes());
        response.setDepartmentWardAssignment(doctor.getDepartmentWardAssignment());
        response.setConsultationFee(doctor.getConsultationFee());
        response.setRole(doctor.getRole());
        response.setProfileImagePath(doctor.getProfileImagePath());

        if (doctor.getAvailability() != null) {
            response.setAvailability(doctor.getAvailability().stream()
                    .map(this::toDto)
                    .collect(Collectors.toList()));
        }

        return response;
    }
}
