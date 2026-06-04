package com.example.petmanagement.service;

import com.example.petmanagement.model.Pet;
import com.example.petmanagement.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    public Pet createPet(Pet pet) {
        return petRepository.save(pet);
    }

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public Optional<Pet> getPetById(String id) {
        return petRepository.findById(id);
    }

    public List<Pet> getPetsByOwnerId(String ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    public List<Pet> getPetsBySpecies(String species) {
        return petRepository.findBySpecies(species);
    }

    public Pet updatePet(String id, Pet petDetails) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));
        
        pet.setName(petDetails.getName());
        pet.setSpecies(petDetails.getSpecies());
        pet.setBreed(petDetails.getBreed());
        pet.setBirthDate(petDetails.getBirthDate());
        pet.setDescription(petDetails.getDescription());
        pet.setImageUrl(petDetails.getImageUrl());
        pet.setActive(petDetails.isActive());
        
        return petRepository.save(pet);
    }

    public void deletePet(String id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));
        petRepository.delete(pet);
    }

    public List<Pet> getActivePetsByOwnerId(String ownerId) {
        return petRepository.findByOwnerIdAndIsActive(ownerId, true);
    }
} 