package com.hospital.consultation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class AiAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symptoms;

    private String riskLevel;

    private String keywords;

    @OneToOne
    @JoinColumn(name = "consultation_id")
    private Consultation consultation;
}