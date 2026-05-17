import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const getPatients = () => {
  return axios.get(`${BASE_URL}/patients`);
};

export const createPatient = (patient) => {
  return axios.post(`${BASE_URL}/patients`, patient);
};

export const deletePatientById = (patientId) => {
  return axios.delete(`${BASE_URL}/patients/${patientId}`);
};

export const updatePatientById = (patientId, patient) => {
  return axios.put(`${BASE_URL}/patients/${patientId}`, patient);
};
