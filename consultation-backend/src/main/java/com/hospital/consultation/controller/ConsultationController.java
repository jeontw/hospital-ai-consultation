package com.hospital.consultation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.consultation.dto.AiAnalysisResultDto;
import com.hospital.consultation.dto.ConsultationRequestDto;
import com.hospital.consultation.entity.AiAnalysis;
import com.hospital.consultation.entity.Consultation;
import com.hospital.consultation.entity.Patient;
import com.hospital.consultation.repository.AiAnalysisRepository;
import com.hospital.consultation.repository.ConsultationRepository;
import com.hospital.consultation.repository.PatientRepository;
import com.hospital.consultation.service.OpenAiService;
import com.hospital.consultation.service.OpenAiWhisperService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/consultations")
public class ConsultationController {

    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final OpenAiService openAiService;
    private final OpenAiWhisperService openAiWhisperService;
    private final AiAnalysisRepository aiAnalysisRepository;
    private final ObjectMapper objectMapper;

    @PostMapping("/{patientId}")
    public Consultation createConsultation(
            @PathVariable Long patientId,
            @RequestBody ConsultationRequestDto requestDto
    ) throws Exception {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("환자를 찾을 수 없습니다."));

        String originalText = requestDto.getOriginalText();

        String summary = openAiService.summarize(originalText);

        Consultation consultation = new Consultation();
        consultation.setPatient(patient);
        consultation.setOriginalText(originalText);
        consultation.setAudioPath(requestDto.getAudioPath());
        consultation.setSummary(summary);
        consultation.setCreatedAt(LocalDateTime.now());

        Consultation savedConsultation = consultationRepository.save(consultation);

        String analysisJson = openAiService.analyze(originalText);

        AiAnalysisResultDto result =
                objectMapper.readValue(analysisJson, AiAnalysisResultDto.class);

        AiAnalysis aiAnalysis = new AiAnalysis();
        aiAnalysis.setConsultation(savedConsultation);
        aiAnalysis.setSymptoms(result.getSymptoms());
        aiAnalysis.setRiskLevel(result.getRiskLevel());
        aiAnalysis.setKeywords(result.getKeywords());

        aiAnalysisRepository.save(aiAnalysis);

        return savedConsultation;
    }

    @GetMapping
    public List<Consultation> getConsultations() {
        return consultationRepository.findAll();
    }

    @GetMapping("/patient/{patientId}")
    public List<Consultation> getPatientConsultations(
            @PathVariable Long patientId
    ) {
        return consultationRepository.findByPatientId(patientId);
    }

    @GetMapping("/analysis")
    public List<AiAnalysis> getAiAnalyses() {
        return aiAnalysisRepository.findAll();
    }

    @PostMapping("/upload/{patientId}")
    public Consultation uploadConsultation(
            @PathVariable Long patientId,
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("환자를 찾을 수 없습니다."));

        String uploadDir = System.getProperty("user.dir") + "/uploads/";

        java.io.File directory = new java.io.File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        String filePath = uploadDir + fileName;

        file.transferTo(new java.io.File(filePath));

        String originalText =
                openAiWhisperService.transcribe(
                        new java.io.File(filePath)
                );

        String summary = openAiService.summarize(originalText);

        Consultation consultation = new Consultation();
        consultation.setPatient(patient);
        consultation.setOriginalText(originalText);
        consultation.setSummary(summary);
        consultation.setAudioPath("/uploads/" + fileName);
        consultation.setCreatedAt(LocalDateTime.now());

        Consultation savedConsultation = consultationRepository.save(consultation);

        String analysisJson = openAiService.analyze(originalText);

        AiAnalysisResultDto result =
                objectMapper.readValue(analysisJson, AiAnalysisResultDto.class);

        AiAnalysis aiAnalysis = new AiAnalysis();
        aiAnalysis.setConsultation(savedConsultation);
        aiAnalysis.setSymptoms(result.getSymptoms());
        aiAnalysis.setRiskLevel(result.getRiskLevel());
        aiAnalysis.setKeywords(result.getKeywords());

        aiAnalysisRepository.save(aiAnalysis);

        return savedConsultation;
    }

    @Transactional
    @PutMapping("/{consultationId}")
    public Consultation updateConsultation(
            @PathVariable Long consultationId,
            @RequestBody ConsultationRequestDto requestDto
    ) throws Exception {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("상담을 찾을 수 없습니다."));

        String originalText = requestDto.getOriginalText();

        consultation.setOriginalText(originalText);

        String summary = openAiService.summarize(originalText);
        consultation.setSummary(summary);

        Consultation savedConsultation = consultationRepository.save(consultation);

        AiAnalysis aiAnalysis = savedConsultation.getAiAnalysis();

        if (aiAnalysis == null) {
            aiAnalysis = new AiAnalysis();
            aiAnalysis.setConsultation(savedConsultation);
        }

        String analysisJson = openAiService.analyze(originalText);

        AiAnalysisResultDto result =
                objectMapper.readValue(analysisJson, AiAnalysisResultDto.class);

        aiAnalysis.setSymptoms(result.getSymptoms());
        aiAnalysis.setRiskLevel(result.getRiskLevel());
        aiAnalysis.setKeywords(result.getKeywords());

        aiAnalysisRepository.save(aiAnalysis);

        return savedConsultation;
    }

    @Transactional
    @DeleteMapping("/{consultationId}")
    public void deleteConsultation(
            @PathVariable Long consultationId
    ) {
        aiAnalysisRepository.deleteByConsultationId(consultationId);
        consultationRepository.deleteById(consultationId);
    }
}