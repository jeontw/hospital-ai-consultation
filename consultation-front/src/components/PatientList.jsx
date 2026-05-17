import { useState } from "react";

function PatientList({
  patients,
  selectedViewPatientId,
  onSelectPatient,
  deletePatient,
  updatePatient,
}) {
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBirth, setEditBirth] = useState("");

  const startEdit = (patient) => {
    setEditingPatientId(patient.id);
    setEditName(patient.name || "");
    setEditPhone(patient.phone || "");
    setEditBirth(patient.birth || "");
  };

  const cancelEdit = () => {
    setEditingPatientId(null);
    setEditName("");
    setEditPhone("");
    setEditBirth("");
  };

  const saveEdit = (patientId) => {
    updatePatient(patientId, {
      name: editName,
      phone: editPhone,
      birth: editBirth,
    });

    cancelEdit();
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-4">
      <h2 className="text-2xl font-bold mb-4">환자 목록</h2>

      <button
        onClick={() => onSelectPatient("")}
        className="mb-4 bg-gray-500 text-white px-3 py-1 rounded"
      >
        전체 상담 보기
      </button>

      {patients.map((patient) => (
        <div
          key={patient.id}
          onClick={() => onSelectPatient(patient.id)}
          className={`border-b py-3 cursor-pointer hover:bg-gray-50 rounded px-2 ${
            String(selectedViewPatientId) === String(patient.id)
              ? "bg-blue-50"
              : ""
          }`}
        >
          {editingPatientId === patient.id ? (
            <div onClick={(e) => e.stopPropagation()} className="space-y-2">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="이름"
              />

              <input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="전화번호"
              />

              <input
                value={editBirth}
                onChange={(e) => setEditBirth(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="생년월일"
              />

              <button
                onClick={() => saveEdit(patient.id)}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                저장
              </button>

              <button
                onClick={cancelEdit}
                className="ml-2 bg-gray-500 text-white px-3 py-1 rounded text-sm"
              >
                취소
              </button>
            </div>
          ) : (
            <>
              <p className="font-semibold">{patient.name}</p>
              <p className="text-gray-500">{patient.phone}</p>
              <p className="text-gray-400 text-sm">
                생년월일: {patient.birth || "없음"}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(patient);
                }}
                className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm"
              >
                수정
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePatient(patient.id);
                }}
                className="mt-2 ml-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                삭제
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default PatientList;
