package com.hms.hospitalManagementSystem.department.repository;

import com.hms.hospitalManagementSystem.department.model.Bed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    List<Bed> findByDepartmentId(Long departmentId);
    Optional<Bed> findByBedCode(String bedCode);
    boolean existsByBedCode(String bedCode);
}
