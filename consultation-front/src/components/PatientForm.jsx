function PatientForm({
  name,
  phone,
  birth,
  setName,
  setPhone,
  setBirth,
  addPatient
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">환자 등록</h2>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="전화번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="date"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={addPatient}
          className="bg-blue-500 text-white px-4 rounded"
        >
          등록
        </button>
      </div>
    </div>
  )
}

export default PatientForm