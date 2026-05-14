package com.hospital.consultation.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String originalText;

    private String summary;

    private String audioPath;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"consultations"})
    private Patient patient;

}