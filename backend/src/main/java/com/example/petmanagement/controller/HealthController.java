package com.example.petmanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping({"/health", "/ping"})
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }
} 