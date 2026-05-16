import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

function App() {
  const [patients, setPatients] = useState([])
  const [consultations, setConsultations] = useState([])

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [birth, setBirth] = useState('')

  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [selectedViewPatientId, setSelectedViewPatientId] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')

  const fileInputRef = useRef(null)

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/patients')
      console.log('환자 목록:', response.data)
      setPatients(response.data)
    } catch (error) {
      console.error('환자 조회 실패:', error)
    }
  }

  const fetchConsultations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/consultations')
      console.log('상담 목록:', response.data)
      setConsultations(response.data)
    } catch (error) {
      console.error('상담 조회 실패:', error)
    }
  }
  const fetchPatientConsultations = async (patientId) => {

    try {

      const response = await axios.get(
        `http://localhost:8080/consultations/patient/${patientId}`
      )

      setConsultations(response.data)

    } catch (error) {

      console.error('환자 상담 조회 실패:', error)

    }
  }

  useEffect(() => {
    fetchPatients()
    fetchConsultations()
  }, [])

  const addPatient = async () => {
    try {
      await axios.post('http://localhost:8080/patients', {
        name,
        phone,
        birth
      })

      alert('환자 등록 성공')

      setName('')
      setPhone('')
      setBirth('')

      fetchPatients()
    } catch (error) {
      console.error('환자 등록 실패:', error)
      alert('환자 등록 실패')
    }
  }

  const addConsultation = async () => {
    if (!selectedPatientId) {
      alert('환자를 선택하세요')
      return
    }

    if (!audioFile) {
      alert('음성 파일을 선택하세요')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', audioFile)

      await axios.post(
        `http://localhost:8080/consultations/upload/${selectedPatientId}`,
        formData
      )

      alert('상담 등록 성공')

      setSelectedPatientId('')
      setAudioFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      fetchConsultations()
    } catch (error) {
      console.error('상담 등록 실패:', error)
      alert('상담 등록 실패')
    }
  }
  const deleteConsultation = async (consultationId) => {
    const confirmDelete = confirm('정말 이 상담 기록을 삭제할까요?')

    if (!confirmDelete) {
      return
    }

    try {
      await axios.delete(
        `http://localhost:8080/consultations/${consultationId}`
      )

      alert('상담 삭제 완료')
      fetchConsultations()
    } catch (error) {
      console.error('상담 삭제 실패:', error)
      alert('상담 삭제 실패')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-8">
        병원 상담 관리 시스템
      </h1>

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

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">환자 목록</h2>

          {patients.map((patient) => (
            <div key={patient.id} className="border-b py-3">
              <p className="font-semibold">{patient.name}</p>
              <p className="text-gray-500">{patient.phone}</p>
            </div>
          ))}
        </div>

        <select
          value={selectedViewPatientId}
          onChange={(e) => {

            const patientId = e.target.value

            setSelectedViewPatientId(patientId)

            if (patientId === '') {
              fetchConsultations()
            } else {
              fetchPatientConsultations(patientId)
            }

          }}
          className="border p-2 rounded mb-4 w-full"
        >
          <option value="">전체 상담 보기</option>

          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
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

              const patientName =
                consultation.patient?.name || ''

              const consultationText =
                consultation.originalText || ''

              return (
                patientName.includes(searchKeyword) ||
                consultationText.includes(searchKeyword)
              )
            })
            .sort((a, b) => b.id - a.id)
            .map((consultation) => (
              <div key={consultation.id} className="border-b py-4">
                <p className="font-bold">
                  {consultation.patient?.name || '환자 정보 없음'}
                </p>
                <p className="text-sm text-gray-400">
                  상담 시간:
                  {' '}
                  {new Date(consultation.createdAt).toLocaleString()}
                </p>

                <p className="mt-2">
                  {consultation.originalText}
                </p>

                <p className="mt-2 text-blue-600">
                  AI 요약: {consultation.summary}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  음성 파일: {consultation.audioPath}
                </p>
                <button
                  onClick={() => deleteConsultation(consultation.id)}
                  className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
                >
                  삭제
                </button>
                {consultation.audioPath?.startsWith('/uploads/') && (
                  <audio
                    controls
                    className="mt-2 w-full"
                  >
                    <source
                      src={`http://localhost:8080${consultation.audioPath}`}
                      type="audio/mpeg"
                    />
                  </audio>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default App