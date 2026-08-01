package com.hms.hospitalManagementSystem.staff.repository;

import com.hms.hospitalManagementSystem.staff.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByStaffId(String staffId);
    boolean existsByStaffId(String staffId);
}
