function ConsultationForm({
  patients,
  selectedPatientId,
  setSelectedPatientId,
  setAudioFile,
  addConsultation,
  fileInputRef
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">상담 등록</h2>

      <div className="flex flex-col gap-3">
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">환자 선택</option>

          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name} / {patient.phone}
            </option>
          ))}
        </select>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files[0])}
          className="border p-2 rounded"
        />

        <button
          onClick={addConsultation}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          상담 등록
        </button>
      </div>
    </div>
  )
}

export default ConsultationForm