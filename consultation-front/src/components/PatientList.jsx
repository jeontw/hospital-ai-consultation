function PatientList({ patients }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">환자 목록</h2>

      {patients.map((patient) => (
        <div key={patient.id} className="border-b py-3">
          <p className="font-semibold">{patient.name}</p>
          <p className="text-gray-500">{patient.phone}</p>
        </div>
      ))}
    </div>
  )
}

export default PatientList