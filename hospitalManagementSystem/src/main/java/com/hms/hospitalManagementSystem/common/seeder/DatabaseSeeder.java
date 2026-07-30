package com.hms.hospitalManagementSystem.common.seeder;

import com.hms.hospitalManagementSystem.admin.model.Admin;
import com.hms.hospitalManagementSystem.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DatabaseSeeder(AdminRepository adminRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!adminRepository.existsByUsername("admin")) {
            Admin defaultAdmin = Admin.builder()
                    .username("admin")
                    .email("admin@hms.com")
                    .password(passwordEncoder.encode("1234@#admin"))
                    .role("ROLE_ADMIN")
                    .build();
            adminRepository.save(defaultAdmin);
            System.out.println("Default admin user seeded successfully!");
        }
    }
}
