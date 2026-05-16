function ConsultationDetail({ selectedConsultation, getRiskColor }) {
  if (!selectedConsultation) {
    return null
  }

  return (
    <div className="mt-6 rounded border p-4 shadow">
      <h2 className="mb-4 text-xl font-bold">상담 상세 정보</h2>

      <p>
        <strong>환자명:</strong>{' '}
        {selectedConsultation.patient?.name || '환자 정보 없음'}
      </p>

      <p>
        <strong>전화번호:</strong>{' '}
        {selectedConsultation.patient?.phone || '전화번호 없음'}
      </p>

      <p className="mt-3">
        <strong>상담 내용:</strong>
      </p>
      <p className="rounded bg-gray-100 p-3">
        {selectedConsultation.originalText}
      </p>

      <p className="mt-3">
        <strong>AI 요약:</strong>
      </p>
      <p className="rounded bg-gray-100 p-3">
        {selectedConsultation.summary || '요약 없음'}
      </p>

      {selectedConsultation.aiAnalysis && (
        <div className="mt-3">
          <p>
            <strong>증상:</strong> {selectedConsultation.aiAnalysis.symptoms}
          </p>

          <p>
            <strong>키워드:</strong> {selectedConsultation.aiAnalysis.keywords}
          </p>

          <div className="mt-2">
            <strong>위험도:</strong>{' '}
            <span
              className={`inline-block rounded-full border px-3 py-1 text-sm font-bold ${
                getRiskColor(selectedConsultation.aiAnalysis?.riskLevel)
              }`}
            >
              {selectedConsultation.aiAnalysis?.riskLevel || '분석 없음'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsultationDetail