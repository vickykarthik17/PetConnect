package com.petconnect.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petconnect.model.Pet;
import com.petconnect.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ObjectMapper objectMapper;

    public Pet convertJsonToPet(String petJson) throws Exception {
        return objectMapper.readValue(petJson, Pet.class);
    }

    public Pet registerPet(Pet pet, List<MultipartFile> images) {
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = fileStorageService.storeFiles(images);
            pet.setImageUrls(imageUrls);
        }
        return petRepository.save(pet);
    }

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public Pet getPetById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
    }

    public Pet updatePet(Long id, Pet petDetails) {
        Pet pet = getPetById(id);
        pet.setName(petDetails.getName());
        pet.setSpecies(petDetails.getSpecies());
        pet.setBreed(petDetails.getBreed());
        pet.setAge(petDetails.getAge());
        pet.setGender(petDetails.getGender());
        pet.setDescription(petDetails.getDescription());
        pet.setPrice(petDetails.getPrice());
        pet.setAvailable(petDetails.isAvailable());
        return petRepository.save(pet);
    }

    public void deletePet(Long id) {
        Pet pet = getPetById(id);
        if (pet.getImageUrls() != null) {
            pet.getImageUrls().forEach(fileStorageService::deleteFile);
        }
        petRepository.delete(pet);
    }
} 