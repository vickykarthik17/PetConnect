package com.example.petmanagement.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        // Set the secret key and expiration using reflection
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpiration", 3600000L); // 1 hour

        // Mock UserDetails
        userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("testuser");
    }

    @Test
    void generateTokenAndValidate() {
        // Generate token
        String token = jwtTokenProvider.generateToken(userDetails);
        
        // Assert token is not null or empty
        assertNotNull(token);
        assertFalse(token.isEmpty());

        // Validate token
        assertTrue(jwtTokenProvider.isTokenValid(token, userDetails));
    }

    @Test
    void extractUsername() {
        // Generate token
        String token = jwtTokenProvider.generateToken(userDetails);
        
        // Extract username
        String username = jwtTokenProvider.extractUsername(token);
        
        // Assert username matches
        assertEquals("testuser", username);
    }

    @Test
    void tokenExpiration() {
        // Set a very short expiration time (100ms)
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpiration", 100L);
        
        // Generate token
        String token = jwtTokenProvider.generateToken(userDetails);
        
        // Wait for token to expire
        try {
            Thread.sleep(200); // Wait longer than the expiration time
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Validate expired token
        boolean isValid = false;
        try {
            isValid = jwtTokenProvider.isTokenValid(token, userDetails);
        } catch (Exception e) {
            // Expected exception for expired token
            assertFalse(isValid);
            return;
        }
        // If no exception was thrown, the token should still be invalid
        assertFalse(isValid);
    }
} 