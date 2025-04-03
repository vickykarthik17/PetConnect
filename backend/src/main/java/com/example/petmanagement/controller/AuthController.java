package com.example.petmanagement.controller;

import com.example.petmanagement.dto.AuthRequest;
import com.example.petmanagement.dto.AuthResponse;
import com.example.petmanagement.model.User;
import com.example.petmanagement.security.JwtTokenProvider;
import com.example.petmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(userDetails);
            User user = userService.findByUsername(userDetails.getUsername());

            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Check if username already exists
            if (userService.findByUsername(user.getUsername()) != null) {
                return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, "Username already exists"));
            }
            
            // Check if email already exists
            if (userService.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, "Email already exists"));
            }

            // Register the user
            User registeredUser = userService.registerUser(user);
            
            // Generate token for the new user
            String token = jwtTokenProvider.generateToken(registeredUser);
            
            return ResponseEntity.ok(new AuthResponse(token, registeredUser.getUsername(), registeredUser.getRole()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, e.getMessage()));
        }
    }
} 