package com.example.petmanagement.repository;

import com.example.petmanagement.model.Pet;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PetRepository extends MongoRepository<Pet, String> {
    List<Pet> findByOwnerId(String ownerId);
    List<Pet> findBySpecies(String species);
    List<Pet> findByOwnerIdAndIsActive(String ownerId, boolean isActive);
} 