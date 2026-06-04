package com.example.petmanagement.controller;

import com.example.petmanagement.dto.ContactRequest;
import com.example.petmanagement.model.ContactMessage;
import com.example.petmanagement.repository.ContactMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class ContactController {
    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);
    
    private final ContactMessageRepository contactMessageRepository;
    private final MongoTemplate mongoTemplate;

    public ContactController(ContactMessageRepository contactMessageRepository, MongoTemplate mongoTemplate) {
        this.contactMessageRepository = contactMessageRepository;
        this.mongoTemplate = mongoTemplate;
        logger.info("ContactController initialized. Repository available: {}", contactMessageRepository != null);
    }

    @PostMapping
    public ResponseEntity<?> sendContactMessage(@RequestBody ContactRequest request) {
        try {
            logger.info("=== Contact form submission received ===");
            logger.info("From: {} ({})", request.getName(), request.getEmail());
            logger.info("Subject: {}", request.getSubject());
            
            // Validate required fields
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                logger.warn("Validation failed: Name is empty");
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Name is required",
                    "status", "error"
                ));
            }
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                logger.warn("Validation failed: Email is empty");
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Email is required",
                    "status", "error"
                ));
            }
            
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                logger.warn("Validation failed: Message is empty");
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Message is required",
                    "status", "error"
                ));
            }
            
            // Create contact message object
            ContactMessage contactMessage = new ContactMessage();
            contactMessage.setName(request.getName().trim());
            contactMessage.setEmail(request.getEmail().trim());
            contactMessage.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
            contactMessage.setSubject(request.getSubject() != null ? request.getSubject().trim() : null);
            contactMessage.setMessage(request.getMessage().trim());
            
            logger.info("Contact message object created. Attempting to save to MongoDB...");
            
            // Try saving using repository first, fallback to MongoTemplate
            ContactMessage savedMessage;
            try {
                if (contactMessageRepository != null) {
                    logger.info("Using ContactMessageRepository to save...");
                    savedMessage = contactMessageRepository.save(contactMessage);
                } else {
                    logger.warn("Repository is null, using MongoTemplate...");
                    savedMessage = mongoTemplate.save(contactMessage, "contact_messages");
                }
            } catch (Exception dbException) {
                logger.error("Database save failed, trying MongoTemplate directly...", dbException);
                savedMessage = mongoTemplate.save(contactMessage, "contact_messages");
            }
            
            logger.info("✅ Contact message saved successfully!");
            logger.info("Message ID: {}", savedMessage.getId());
            logger.info("Saved to collection: contact_messages");
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Message received successfully. We will get back to you soon.");
            response.put("status", "success");
            response.put("messageId", savedMessage.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error processing contact form:", e);
            logger.error("Error type: {}", e.getClass().getName());
            logger.error("Error message: {}", e.getMessage());
            if (e.getCause() != null) {
                logger.error("Cause: {}", e.getCause().getMessage());
            }
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to send message. Please try again later.");
            errorResponse.put("status", "error");
            errorResponse.put("details", e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<?> testConnection() {
        try {
            logger.info("Testing MongoDB connection for contact_messages...");
            
            long count = contactMessageRepository != null ? 
                contactMessageRepository.count() : 
                mongoTemplate.getCollection("contact_messages").countDocuments();
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "MongoDB connection is working");
            response.put("collection", "contact_messages");
            response.put("documentCount", count);
            response.put("repositoryAvailable", contactMessageRepository != null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("MongoDB connection test failed:", e);
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "MongoDB connection failed: " + e.getMessage()
            ));
        }
    }
    
    // Optional: Admin endpoint to retrieve messages (requires authentication)
    // Uncomment and secure this if you want to view messages from admin panel
    /*
    @GetMapping("/messages")
    public ResponseEntity<?> getAllMessages() {
        try {
            List<ContactMessage> messages = contactMessageRepository.findAllByOrderByCreatedAtDesc();
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            logger.error("Error fetching contact messages: ", e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch messages"));
        }
    }
    */
}

