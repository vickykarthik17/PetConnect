package com.example.petmanagement.controller;

import com.example.petmanagement.dto.AuthRequest;
import com.example.petmanagement.dto.AuthResponse;
import com.example.petmanagement.model.User;
import com.example.petmanagement.security.JwtTokenProvider;
import com.example.petmanagement.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            logger.debug("Login attempt for user: {}", request.getUsername());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(userDetails);
            User user = userService.findByUsername(userDetails.getUsername());
            logger.debug("Login successful for user: {}", user.getUsername());

            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole()));
        } catch (Exception e) {
            logger.error("Login failed for user: {}", request.getUsername(), e);
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            logger.debug("Received registration request for user: {}", user.getUsername());
            logger.debug("Registration payload: username={}, email={}, role={}", 
                user.getUsername(), 
                user.getEmail(), 
                user.getRole()
            );
            
            // Check if username already exists
            try {
                if (userService.findByUsername(user.getUsername()) != null) {
                    logger.debug("Registration failed - username already exists: {}", user.getUsername());
                    return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, "Username already exists"));
                }
            } catch (UsernameNotFoundException e) {
                // This is actually good - it means the username is available
                logger.debug("Username is available: {}", user.getUsername());
            }
            
            // Check if email already exists
            try {
                if (userService.findByEmail(user.getEmail()) != null) {
                    logger.debug("Registration failed - email already exists: {}", user.getEmail());
                    return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, "Email already exists"));
                }
            } catch (Exception e) {
                // This is good - it means the email is available
                logger.debug("Email is available: {}", user.getEmail());
            }

            // Set default role if not provided
            if (user.getRole() == null || user.getRole().trim().isEmpty()) {
                user.setRole("USER");
                logger.debug("Setting default role 'USER' for new registration");
            }

            // Register the user
            User registeredUser = userService.registerUser(user);
            logger.debug("User registered successfully: {}", registeredUser.getUsername());
            
            // Generate token for the new user
            String token = jwtTokenProvider.generateToken(registeredUser);
            logger.debug("JWT token generated for new user: {}", registeredUser.getUsername());
            
            return ResponseEntity.ok(new AuthResponse(token, registeredUser.getUsername(), registeredUser.getRole()));
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", user.getUsername(), e);
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, e.getMessage()));
        }
    }

    @GetMapping("/test-db")
    public ResponseEntity<?> testDbConnection() {
        try {
            logger.debug("Testing database connection");
            long userCount = userService.getUserCount();
            logger.debug("Database connection successful. User count: {}", userCount);
            return ResponseEntity.ok("Database connection successful. User count: " + userCount);
        } catch (Exception e) {
            logger.error("Database connection test failed", e);
            return ResponseEntity.badRequest().body("Database connection failed: " + e.getMessage());
        }
    }
} 