package com.hms.hospitalManagementSystem.doctor.repository;

import com.hms.hospitalManagementSystem.doctor.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByDoctorId(String doctorId);
    Optional<Doctor> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByLicenseNumber(String licenseNumber);
}
