function ConsultationList({
  consultations,
  searchKeyword,
  setSearchKeyword,
  editingId,
  editText,
  setEditText,
  updateConsultation,
  deleteConsultation,
  setEditingId,
  setSelectedConsultation,
  getRiskColor,
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">상담 목록</h2>

      <input
        type="text"
        placeholder="환자명 또는 상담 내용 검색"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />

      {consultations.length === 0 && (
        <p className="text-gray-400">상담 기록이 없습니다.</p>
      )}

      {[...consultations]
        .filter((consultation) => {
          const patientName = consultation.patient?.name || "";
          const consultationText = consultation.originalText || "";

          return (
            patientName.includes(searchKeyword) ||
            consultationText.includes(searchKeyword)
          );
        })
        .sort((a, b) => b.id - a.id)
        .map((consultation) => (
          <div
            key={consultation.id}
            className="border-l-4 border-blue-400 pl-4 ml-2 py-4 relative"
          >
            <div className="absolute -left-[10px] top-6 w-4 h-4 bg-blue-500 rounded-full"></div>
            <p className="font-bold">
              {consultation.patient?.name || "환자 정보 없음"}
            </p>

            <p className="text-sm text-gray-400 mb-2">
              {new Date(consultation.createdAt).toLocaleString()}
            </p>

            {editingId === consultation.id ? (
              <div className="mt-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <button
                  onClick={() => updateConsultation(consultation.id)}
                  className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                >
                  저장
                </button>
              </div>
            ) : (
              <p className="mt-2">{consultation.originalText}</p>
            )}

            <p className="mt-2 text-blue-600">
              AI 요약: {consultation.summary}
            </p>

            <span
              className={`mt-2 inline-block rounded-full border px-3 py-1 text-sm font-bold ${getRiskColor(
                consultation.aiAnalysis?.riskLevel,
              )}`}
            >
              위험도: {consultation.aiAnalysis?.riskLevel || "분석 없음"}
            </span>

            <p className="mt-2 text-sm text-gray-500">
              음성 파일: {consultation.audioPath}
            </p>

            <button
              onClick={() => setSelectedConsultation(consultation)}
              className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
            >
              상세 보기
            </button>

            <button
              onClick={() => deleteConsultation(consultation.id)}
              className="mt-3 ml-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              삭제
            </button>

            <button
              onClick={() => {
                setEditingId(consultation.id);
                setEditText(consultation.originalText);
              }}
              className="mt-3 ml-2 bg-yellow-500 text-white px-3 py-1 rounded"
            >
              수정
            </button>

            {consultation.audioPath?.startsWith("/uploads/") && (
              <audio
                key={consultation.audioPath}
                controls
                className="mt-2 w-full"
                src={`http://localhost:8080${consultation.audioPath}`}
              />
            )}
          </div>
        ))}
    </div>
  );
}

export default ConsultationList;
