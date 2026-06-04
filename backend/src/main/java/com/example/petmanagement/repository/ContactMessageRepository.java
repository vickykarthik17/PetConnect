package com.example.petmanagement.repository;

import com.example.petmanagement.model.ContactMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends MongoRepository<ContactMessage, String> {
    List<ContactMessage> findByReadFalse();
    List<ContactMessage> findByEmail(String email);
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
}

