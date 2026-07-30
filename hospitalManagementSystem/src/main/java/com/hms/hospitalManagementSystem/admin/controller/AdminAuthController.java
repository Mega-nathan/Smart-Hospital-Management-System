package com.hms.hospitalManagementSystem.admin.controller;

import com.hms.hospitalManagementSystem.admin.dto.AuthResponse;
import com.hms.hospitalManagementSystem.admin.dto.LoginRequest;
import com.hms.hospitalManagementSystem.admin.dto.RegisterRequest;
import com.hms.hospitalManagementSystem.admin.model.Admin;
import com.hms.hospitalManagementSystem.admin.service.AdminService;
import com.hms.hospitalManagementSystem.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/hms-admin/auth")
public class AdminAuthController {

    private final AuthenticationManager authenticationManager;
    private final AdminService adminService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Autowired
    public AdminAuthController(
            AuthenticationManager authenticationManager,
            AdminService adminService,
            JwtService jwtService,
            UserDetailsService userDetailsService
    ) {
        this.authenticationManager = authenticationManager;
        this.adminService = adminService;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        final String jwtToken = jwtService.generateToken(userDetails);
        
        String role = userDetails.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .findFirst()
                .orElse("ROLE_ADMIN");

        return ResponseEntity.ok(
                AuthResponse.builder()
                        .token(jwtToken)
                        .username(userDetails.getUsername())
                        .role(role)
                        .build()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        Admin registeredAdmin = adminService.registerAdmin(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Admin registered successfully");
        response.put("username", registeredAdmin.getUsername());
        response.put("email", registeredAdmin.getEmail());
        response.put("role", registeredAdmin.getRole());
        
        return ResponseEntity.ok(response);
    }
}
