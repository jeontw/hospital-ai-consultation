import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

export const getPatients = () => {
  return axios.get(`${BASE_URL}/patients`)
}

export const createPatient = (patient) => {
  return axios.post(`${BASE_URL}/patients`, patient)
}