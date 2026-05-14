package com.hospital.consultation.controller;

import com.hospital.consultation.entity.Patient;
import com.hospital.consultation.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/patients")
public class PatientController {

    private final PatientRepository patientRepository;

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        patient.setCreatedAt(LocalDateTime.now());
        return patientRepository.save(patient);
    }

    @GetMapping
    public List<Patient> getPatients() {
        return patientRepository.findAll();
    }
}