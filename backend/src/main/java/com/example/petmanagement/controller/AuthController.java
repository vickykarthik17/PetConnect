package com.example.petmanagement.controller;

import com.example.petmanagement.dto.AuthRequest;
import com.example.petmanagement.dto.RegisterRequest;
import com.example.petmanagement.model.User;
import com.example.petmanagement.security.JwtTokenProvider;
import com.example.petmanagement.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            logger.info("Login attempt for email: {}", request.getEmail());
            
            // Check if user exists first
            if (!userService.existsByEmail(request.getEmail())) {
                logger.warn("Login failed - user not found: {}", request.getEmail());
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid email or password",
                    "status", "error"
                ));
            }
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            String token = jwtTokenProvider.generateToken(authentication);
            User user = userService.findByEmail(request.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            response.put("status", "success");

            logger.info("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            logger.error("Invalid credentials for email: {}", request.getEmail());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid email or password",
                "status", "error"
            ));
        } catch (org.springframework.security.core.userdetails.UsernameNotFoundException e) {
            logger.error("User not found for email: {}", request.getEmail());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid email or password",
                "status", "error"
            ));
        } catch (Exception e) {
            logger.error("Login failed for email: " + request.getEmail(), e);
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Login failed: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            logger.info("Registration attempt for email: {}", request.getEmail());

            // Check if email exists
            if (userService.existsByEmail(request.getEmail())) {
                logger.warn("Registration failed - email already exists: {}", request.getEmail());
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Email already exists",
                    "status", "error"
                ));
            }

            // Create new user
            User user = new User();
            user.setEmail(request.getEmail());
            user.setUsername(request.getUsername());
            user.setPassword(request.getPassword());

            User savedUser = userService.registerUser(user);

            // Generate token
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            String token = jwtTokenProvider.generateToken(authentication);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", savedUser);
            response.put("status", "success");

            logger.info("Registration successful for email: {}", savedUser.getEmail());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Registration failed for email: " + request.getEmail(), e);
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Registration failed: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            if (jwtTokenProvider.validateToken(token)) {
                String email = jwtTokenProvider.extractUsername(token);
                User user = userService.findByEmail(email);

                return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "user", user,
                    "status", "success"
                ));
            }

            return ResponseEntity.badRequest().body(Map.of(
                "valid", false,
                "error", "Invalid token",
                "status", "error"
            ));
        } catch (Exception e) {
            logger.error("Token validation failed", e);
            return ResponseEntity.badRequest().body(Map.of(
                "valid", false,
                "error", "Token validation failed",
                "status", "error"
            ));
        }
    }
} 