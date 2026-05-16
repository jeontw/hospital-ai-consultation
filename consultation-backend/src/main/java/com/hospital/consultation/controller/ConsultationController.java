package com.hospital.consultation.controller;

import com.hospital.consultation.dto.ConsultationRequestDto;
import com.hospital.consultation.entity.AiAnalysis;
import com.hospital.consultation.entity.Consultation;
import com.hospital.consultation.entity.Patient;
import com.hospital.consultation.repository.AiAnalysisRepository;
import com.hospital.consultation.repository.ConsultationRepository;
import com.hospital.consultation.repository.PatientRepository;
import com.hospital.consultation.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/consultations")
public class ConsultationController {

    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final OpenAiService openAiService;
    private final AiAnalysisRepository aiAnalysisRepository;

    // 상담 등록
    @PostMapping("/{patientId}")
    public Consultation createConsultation(
            @PathVariable Long patientId,
            @RequestBody ConsultationRequestDto requestDto
    ) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("환자를 찾을 수 없습니다."));

        // 지금은 OpenAI 크레딧 없이 개발하기 위해 테스트 요약 사용
        String summary = "테스트 요약: 환자의 주요 상담 내용을 요약했습니다.";

        Consultation consultation = new Consultation();

        consultation.setPatient(patient);
        consultation.setOriginalText(requestDto.getOriginalText());
        consultation.setAudioPath(requestDto.getAudioPath());
        consultation.setSummary(summary);
        consultation.setCreatedAt(LocalDateTime.now());

        Consultation savedConsultation = consultationRepository.save(consultation);

        // 지금은 OpenAI 크레딧 없이 개발하기 위해 테스트 분석 사용
        String analysisText = "테스트 분석: 발열, 기침, 목 통증";

        AiAnalysis aiAnalysis = new AiAnalysis();

        aiAnalysis.setConsultation(savedConsultation);
        aiAnalysis.setSymptoms(analysisText);
        aiAnalysis.setRiskLevel("주의");
        aiAnalysis.setKeywords("발열, 기침, 목 통증");

        aiAnalysisRepository.save(aiAnalysis);

        return savedConsultation;
    }

    // 상담 전체 조회
    @GetMapping
    public List<Consultation> getConsultations() {
        return consultationRepository.findAll();
    }

    // 특정 환자의 상담 조회
    @GetMapping("/patient/{patientId}")
    public List<Consultation> getPatientConsultations(
            @PathVariable Long patientId
    ) {
        return consultationRepository.findByPatientId(patientId);
    }

    // AI 분석 결과 전체 조회
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

        // 파일 저장
        String uploadDir =
                System.getProperty("user.dir") + "/uploads/";

        java.io.File directory = new java.io.File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName =
                System.currentTimeMillis() + "_" + file.getOriginalFilename();

        String filePath = uploadDir + fileName;

        file.transferTo(new java.io.File(filePath));

        // Mock STT 결과
        String originalText =
                "환자가 열과 기침 증상을 호소하며 전화 상담을 진행함.";

        // Mock AI 요약
        String summary =
                "테스트 요약: 발열 및 기침 관련 상담.";

        Consultation consultation = new Consultation();

        consultation.setPatient(patient);
        consultation.setOriginalText(originalText);
        consultation.setSummary(summary);
        consultation.setAudioPath("/uploads/" + fileName);
        consultation.setCreatedAt(LocalDateTime.now());

        Consultation savedConsultation =
                consultationRepository.save(consultation);

        // Mock AI 분석
        AiAnalysis aiAnalysis = new AiAnalysis();

        aiAnalysis.setConsultation(savedConsultation);
        aiAnalysis.setSymptoms("발열, 기침");
        aiAnalysis.setRiskLevel("주의");
        aiAnalysis.setKeywords("발열, 기침");

        aiAnalysisRepository.save(aiAnalysis);

        return savedConsultation;
    }
    // 상담 수정
    @PutMapping("/{consultationId}")
    public Consultation updateConsultation(
            @PathVariable Long consultationId,
            @RequestBody ConsultationRequestDto requestDto
    ) {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("상담을 찾을 수 없습니다."));

        consultation.setOriginalText(requestDto.getOriginalText());

        String summary = "수정된 상담 요약: " + requestDto.getOriginalText();

        consultation.setSummary(summary);

        return consultationRepository.save(consultation);
    }
    // 상담 삭제
    @Transactional
    @DeleteMapping("/{consultationId}")
    public void deleteConsultation(
            @PathVariable Long consultationId
    ) {
        aiAnalysisRepository.deleteByConsultationId(consultationId);
        consultationRepository.deleteById(consultationId);
    }
}