package com.example.petmanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("message", "PetConnect API is running");
        response.put("version", "1.0.0");
        response.put("endpoints", Map.of(
            "health", "/api/health",
            "ping", "/api/ping",
            "auth", "/api/auth/login and /api/auth/register"
        ));
        return ResponseEntity.ok(response);
    }
}

