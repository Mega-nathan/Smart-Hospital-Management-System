package com.hms.hospitalManagementSystem.department.repository;

import com.hms.hospitalManagementSystem.department.model.PatientBedHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientBedHistoryRepository extends JpaRepository<PatientBedHistory, Long> {
}
