function Dashboard({
  totalPatients,
  totalConsultations,
  warningConsultations,
  recentConsultations
}) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-gray-500">전체 환자 수</p>
        <p className="text-3xl font-bold">{totalPatients}</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-gray-500">전체 상담 수</p>
        <p className="text-3xl font-bold">{totalConsultations}</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-gray-500">주의 상담 수</p>
        <p className="text-3xl font-bold text-yellow-600">
          {warningConsultations}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-gray-500">최근 7일 상담</p>
        <p className="text-3xl font-bold">{recentConsultations}</p>
      </div>
    </div>
  )
}

export default Dashboard