package com.example.petmanagement.controller;

import com.example.petmanagement.model.Pet;
import com.example.petmanagement.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "http://localhost:5173")
public class PetController {

    @Autowired
    private PetService petService;

    @PostMapping
    public ResponseEntity<Pet> createPet(@RequestBody Pet pet) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        pet.setOwnerId(auth.getName());
        return ResponseEntity.ok(petService.createPet(pet));
    }

    @GetMapping
    public ResponseEntity<List<Pet>> getAllPets() {
        return ResponseEntity.ok(petService.getAllPets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable String id) {
        return petService.getPetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Pet>> getPetsByOwnerId(@PathVariable String ownerId) {
        return ResponseEntity.ok(petService.getPetsByOwnerId(ownerId));
    }

    @GetMapping("/species/{species}")
    public ResponseEntity<List<Pet>> getPetsBySpecies(@PathVariable String species) {
        return ResponseEntity.ok(petService.getPetsBySpecies(species));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable String id, @RequestBody Pet petDetails) {
        return ResponseEntity.ok(petService.updatePet(id, petDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable String id) {
        petService.deletePet(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/owner/{ownerId}/active")
    public ResponseEntity<List<Pet>> getActivePetsByOwnerId(@PathVariable String ownerId) {
        return ResponseEntity.ok(petService.getActivePetsByOwnerId(ownerId));
    }
} 