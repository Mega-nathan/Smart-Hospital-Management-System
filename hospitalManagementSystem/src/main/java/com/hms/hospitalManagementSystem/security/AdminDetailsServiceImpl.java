package com.hms.hospitalManagementSystem.security;

import com.hms.hospitalManagementSystem.admin.model.Admin;
import com.hms.hospitalManagementSystem.admin.repository.AdminRepository;
import com.hms.hospitalManagementSystem.doctor.model.Doctor;
import com.hms.hospitalManagementSystem.doctor.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class AdminDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // First try to find in AdminRepository
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return new User(
                    admin.getUsername(),
                    admin.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(admin.getRole()))
            );
        }

        // If not found, try to find in DoctorRepository by email or doctorId
        Optional<Doctor> doctorOpt = doctorRepository.findByEmail(username);
        if (doctorOpt.isEmpty()) {
            doctorOpt = doctorRepository.findByDoctorId(username);
        }

        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            return new User(
                    doctor.getEmail(),
                    doctor.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(doctor.getRole()))
            );
        }

        throw new UsernameNotFoundException("User not found with username/email/id: " + username);
    }
}

