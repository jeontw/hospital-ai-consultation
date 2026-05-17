# AI 기반 병원 전화 상담 기록 관리 시스템

병원 전화 상담 내용을 음성 파일로 업로드하면 AI가 자동으로 텍스트 변환, 상담 요약, 위험도 분석, 환자별 상담 히스토리 관리를 수행하는 의료진 보조용 상담 기록 관리 시스템입니다.

본 프로젝트는 AI가 진단을 내리는 시스템이 아니라, 의료진이 환자 상담 내용을 빠르게 확인하고 기록을 관리할 수 있도록 돕는 업무 보조 시스템입니다.

---

## 주요 기능

### 환자 관리

- 환자 등록
- 환자 목록 조회
- 환자 정보 수정
- 환자 삭제
- 환자 선택 시 해당 환자의 상담 기록 조회

### 상담 관리

- 상담 음성 파일 업로드
- 상담 목록 조회
- 상담 상세 보기
- 상담 내용 수정
- 상담 기록 삭제
- 상담 삭제 시 서버에 저장된 음성 파일도 함께 삭제

### AI 기능

- Whisper API를 이용한 음성 파일 STT 변환
- GPT API를 이용한 상담 내용 요약
- 상담 내용 기반 주요 증상 추출
- 위험도 분석
- 키워드 추출
- 환자 과거 상담 기록 기반 AI 종합 인사이트 생성
- 다음 상담 시 확인하면 좋은 추천 질문 제공

### 음성 파일 처리

- m4a 파일 업로드 지원
- FFmpeg를 이용한 m4a → mp3 자동 변환
- 변환 후 원본 m4a 파일 자동 삭제
- 프론트엔드에서 mp3 음성 재생 지원

---

## 기술 스택

### Frontend

- React
- Vite
- Axios
- Tailwind CSS

### Backend

- Spring Boot
- Java
- Spring Data JPA
- MySQL

### AI / Audio

- OpenAI API
- Whisper API
- FFmpeg

---

## 프로젝트 구조

```txt
consultation-backend
 ├── controller
 ├── entity
 ├── repository
 ├── service
 └── config

consultation-frontend
 ├── api
 ├── components
 └── App.jsx
```
