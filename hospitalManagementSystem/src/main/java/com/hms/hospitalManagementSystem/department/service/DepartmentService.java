package com.hms.hospitalManagementSystem.department.service;

import com.hms.hospitalManagementSystem.department.dto.BedResponse;
import com.hms.hospitalManagementSystem.department.dto.DepartmentRequest;
import com.hms.hospitalManagementSystem.department.dto.DepartmentResponse;
import com.hms.hospitalManagementSystem.department.dto.PatientBedHistoryResponse;
import com.hms.hospitalManagementSystem.department.model.Bed;
import com.hms.hospitalManagementSystem.department.model.Department;
import com.hms.hospitalManagementSystem.department.model.PatientBedHistory;
import com.hms.hospitalManagementSystem.department.repository.BedRepository;
import com.hms.hospitalManagementSystem.department.repository.DepartmentRepository;
import com.hms.hospitalManagementSystem.department.repository.PatientBedHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final BedRepository bedRepository;
    private final PatientBedHistoryRepository patientBedHistoryRepository;

    @Autowired
    public DepartmentService(DepartmentRepository departmentRepository,
                             BedRepository bedRepository,
                             PatientBedHistoryRepository patientBedHistoryRepository) {
        this.departmentRepository = departmentRepository;
        this.bedRepository = bedRepository;
        this.patientBedHistoryRepository = patientBedHistoryRepository;
    }

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.findByName(request.getName()).isPresent()) {
            throw new IllegalArgumentException("Department with name '" + request.getName() + "' already exists");
        }

        Department parent = null;
        if (request.getParentId() != null) {
            parent = departmentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent department not found with ID: " + request.getParentId()));
        }

        Department department = Department.builder()
                .name(request.getName())
                .parentDepartment(parent)
                .build();

        Department saved = departmentRepository.save(department);

        if (request.getTotalBeds() != null && request.getTotalBeds() > 0) {
            adjustBedCount(saved, request.getTotalBeds());
        }

        return toResponse(saved);
    }

    public List<DepartmentResponse> getAllDepartmentsTree() {
        List<Department> topLevel = departmentRepository.findByParentDepartmentIsNull();
        return topLevel.stream()
                .map(this::toResponseTree)
                .collect(Collectors.toList());
    }

    public List<DepartmentResponse> getAllDepartmentsFlat() {
        return departmentRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DepartmentResponse getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + id));
        return toResponse(department);
    }

    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + id));

        if (!department.getName().equalsIgnoreCase(request.getName()) && departmentRepository.findByName(request.getName()).isPresent()) {
            throw new IllegalArgumentException("Department with name '" + request.getName() + "' already exists");
        }

        department.setName(request.getName());

        if (request.getParentId() != null) {
            if (request.getParentId().equals(id)) {
                throw new IllegalArgumentException("A department cannot be its own parent");
            }
            Department parent = departmentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent department not found with ID: " + request.getParentId()));
            department.setParentDepartment(parent);
        } else {
            department.setParentDepartment(null);
        }

        if (request.getTotalBeds() != null && request.getTotalBeds() >= 0) {
            adjustBedCount(department, request.getTotalBeds());
        }

        Department saved = departmentRepository.save(department);
        return toResponse(saved);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + id));
        departmentRepository.delete(department);
    }

    public List<BedResponse> getBedsByDepartmentId(Long departmentId) {
        return bedRepository.findByDepartmentId(departmentId).stream()
                .map(this::toBedResponse)
                .collect(Collectors.toList());
    }

    public List<PatientBedHistoryResponse> getPatientBedHistory() {
        return patientBedHistoryRepository.findAll().stream()
                .map(this::toHistoryResponse)
                .collect(Collectors.toList());
    }

    private DepartmentResponse toResponse(Department dept) {
        if (dept == null) return null;
        DepartmentResponse response = new DepartmentResponse();
        response.setId(dept.getId());
        response.setName(dept.getName());
        if (dept.getParentDepartment() != null) {
            response.setParentId(dept.getParentDepartment().getId());
            response.setParentName(dept.getParentDepartment().getName());
        }
        if (dept.getBeds() != null) {
            response.setBeds(dept.getBeds().stream()
                    .map(this::toBedResponse)
                    .collect(Collectors.toList()));
        }
        return response;
    }

    private DepartmentResponse toResponseTree(Department dept) {
        if (dept == null) return null;
        DepartmentResponse response = toResponse(dept);
        if (dept.getSubDepartments() != null && !dept.getSubDepartments().isEmpty()) {
            response.setSubDepartments(dept.getSubDepartments().stream()
                    .map(this::toResponseTree)
                    .collect(Collectors.toList()));
        }
        return response;
    }

    private BedResponse toBedResponse(Bed bed) {
        if (bed == null) return null;
        BedResponse response = new BedResponse(
                bed.getId(),
                bed.getBedCode(),
                bed.isOccupied(),
                bed.getDepartment() != null ? bed.getDepartment().getId() : null,
                bed.getDepartment() != null ? bed.getDepartment().getName() : null
        );
        if (bed.getCurrentPatient() != null) {
            response.setPatientId(bed.getCurrentPatient().getId());
            response.setPatientName(bed.getCurrentPatient().getName());
            response.setPatientStatus(bed.getCurrentPatient().getStatus());
        }
        return response;
    }

    private PatientBedHistoryResponse toHistoryResponse(PatientBedHistory history) {
        if (history == null) return null;
        return new PatientBedHistoryResponse(
                history.getId(),
                history.getPatientId(),
                history.getPatientName(),
                history.getBedCode(),
                history.getDepartmentName(),
                history.getAdmissionDateTime(),
                history.getDischargeDateTime()
        );
    }

    private void adjustBedCount(Department dept, int targetCount) {
        List<Bed> existingBeds = bedRepository.findByDepartmentId(dept.getId());
        int currentCount = existingBeds.size();

        if (targetCount > currentCount) {
            // Determine prefix
            String prefix = "BED-" + dept.getName().toUpperCase().replaceAll("[^A-Z]", "");
            if (prefix.length() > 8) {
                prefix = prefix.substring(0, 8);
            }
            if (prefix.equals("BED-") || prefix.isEmpty()) {
                prefix = "BED-DEPT";
            }
            
            // Try to extract prefix from existing bed code
            if (currentCount > 0) {
                String sampleCode = existingBeds.get(0).getBedCode();
                int dashIndex = sampleCode.lastIndexOf("-");
                if (dashIndex > 0) {
                    prefix = sampleCode.substring(0, dashIndex);
                }
            }

            int countToAdd = targetCount - currentCount;
            int nextNumber = currentCount + 1;
            while (countToAdd > 0) {
                String bedCode = prefix + "-" + nextNumber;
                if (!bedRepository.existsByBedCode(bedCode)) {
                    bedRepository.save(new Bed(null, bedCode, false, dept));
                    countToAdd--;
                }
                nextNumber++;
            }
        } else if (targetCount < currentCount) {
            int countToRemove = currentCount - targetCount;
            // Iterate backwards and remove unoccupied beds
            for (int i = existingBeds.size() - 1; i >= 0 && countToRemove > 0; i--) {
                Bed bed = existingBeds.get(i);
                if (!bed.isOccupied()) {
                    bedRepository.delete(bed);
                    countToRemove--;
                }
            }
        }
    }
}
