package com.hms.hospitalManagementSystem.department.service;

import com.hms.hospitalManagementSystem.department.model.Bed;
import com.hms.hospitalManagementSystem.department.model.Department;
import com.hms.hospitalManagementSystem.department.repository.BedRepository;
import com.hms.hospitalManagementSystem.department.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DepartmentDataInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final BedRepository bedRepository;

    @Autowired
    public DepartmentDataInitializer(DepartmentRepository departmentRepository, BedRepository bedRepository) {
        this.departmentRepository = departmentRepository;
        this.bedRepository = bedRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Categories
        Department clinical = getOrCreateCategory("Clinical Departments");
        Department diagnostic = getOrCreateCategory("Diagnostic Departments");
        Department criticalCare = getOrCreateCategory("Critical Care Departments");

        // 2. Seed Sub-departments under Clinical Departments
        getOrCreateSubDepartment("General Medicine", clinical, "BED-GM");
        getOrCreateSubDepartment("General Surgery", clinical, "BED-GS");
        getOrCreateSubDepartment("Cardiology", clinical, "BED-CARD");
        getOrCreateSubDepartment("Pediatrics", clinical, "BED-PED");
        getOrCreateSubDepartment("Obstetrics & Gynecology", clinical, "BED-OBG");
        getOrCreateSubDepartment("ENT (Ear, Nose & Throat)", clinical, "BED-ENT");

        // 3. Seed Sub-departments under Diagnostic Departments
        getOrCreateSubDepartment("Laboratory", diagnostic, null);
        getOrCreateSubDepartment("Radiology", diagnostic, null);

        // 4. Seed Sub-departments under Critical Care Departments
        getOrCreateSubDepartment("Emergency Department", criticalCare, "BED-ER");
        getOrCreateSubDepartment("Intensive Care Unit (ICU)", criticalCare, "BED-ICU");
        getOrCreateSubDepartment("Operation Theatre (OT)", criticalCare, "BED-OT");
    }

    private Department getOrCreateCategory(String name) {
        return departmentRepository.findByName(name)
                .orElseGet(() -> departmentRepository.save(new Department(null, name, null)));
    }

    private Department getOrCreateSubDepartment(String name, Department parent, String bedPrefix) {
        Department dept = departmentRepository.findByName(name)
                .orElseGet(() -> departmentRepository.save(new Department(null, name, parent)));

        // If a bed prefix is supplied and no beds exist for this department, create 5 beds
        if (bedPrefix != null) {
            int existingBedsCount = bedRepository.findByDepartmentId(dept.getId()).size();
            if (existingBedsCount == 0) {
                for (int i = 1; i <= 5; i++) {
                    String bedCode = bedPrefix + "-" + i;
                    if (!bedRepository.existsByBedCode(bedCode)) {
                        bedRepository.save(new Bed(null, bedCode, false, dept));
                    }
                }
            }
        }

        return dept;
    }
}
