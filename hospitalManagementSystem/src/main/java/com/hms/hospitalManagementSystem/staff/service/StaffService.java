package com.hms.hospitalManagementSystem.staff.service;

import com.hms.hospitalManagementSystem.common.realtime.RealtimeService;
import com.hms.hospitalManagementSystem.staff.dto.StaffRequest;
import com.hms.hospitalManagementSystem.staff.dto.StaffResponse;
import com.hms.hospitalManagementSystem.staff.model.Staff;
import com.hms.hospitalManagementSystem.staff.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffService {

    private final StaffRepository staffRepository;
    private final RealtimeService realtimeService;

    @Autowired
    public StaffService(StaffRepository staffRepository, RealtimeService realtimeService) {
        this.staffRepository = staffRepository;
        this.realtimeService = realtimeService;
    }

    public StaffResponse createStaff(StaffRequest request) {
        String staffId = generateStaffId();
        
        Staff staff = Staff.builder()
                .staffId(staffId)
                .name(request.getName())
                .role(request.getRole())
                .department(request.getDepartment())
                .shift(request.getShift())
                .status(request.getStatus())
                .build();

        Staff saved = staffRepository.save(staff);
        
        // Notify frontend subscribers
        realtimeService.broadcast("staff", "created");

        return toResponse(saved);
    }

    public List<StaffResponse> getAllStaff() {
        return staffRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public StaffResponse getStaffById(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Staff member not found with ID: " + id));
        return toResponse(staff);
    }

    public StaffResponse updateStaff(Long id, StaffRequest request) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Staff member not found with ID: " + id));

        staff.setName(request.getName());
        staff.setRole(request.getRole());
        staff.setDepartment(request.getDepartment());
        staff.setShift(request.getShift());
        staff.setStatus(request.getStatus());

        Staff saved = staffRepository.save(staff);

        // Notify frontend subscribers
        realtimeService.broadcast("staff", "updated");

        return toResponse(saved);
    }

    public void deleteStaff(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Staff member not found with ID: " + id));
        staffRepository.delete(staff);

        // Notify frontend subscribers
        realtimeService.broadcast("staff", "deleted");
    }

    private String generateStaffId() {
        String code;
        do {
            int randomNum = (int) (Math.random() * 90000) + 10000;
            code = "STF-" + randomNum;
        } while (staffRepository.existsByStaffId(code));
        return code;
    }

    private StaffResponse toResponse(Staff staff) {
        StaffResponse response = new StaffResponse();
        response.setId(staff.getId());
        response.setStaffId(staff.getStaffId());
        response.setName(staff.getName());
        response.setRole(staff.getRole());
        response.setDepartment(staff.getDepartment());
        response.setShift(staff.getShift());
        response.setStatus(staff.getStatus());
        return response;
    }
}
