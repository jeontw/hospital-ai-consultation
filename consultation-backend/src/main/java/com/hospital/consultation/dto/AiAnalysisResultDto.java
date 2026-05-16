package com.hospital.consultation.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiAnalysisResultDto {
    private String symptoms;
    private String riskLevel;
    private String keywords;
}