import axios from 'axios';

// Altere a baseURL conforme necessário para seu ambiente
export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Exemplos de funções para alunos (CRUD)
export const createStudent = async (student: { name: string; email: string; registration: string }) => {
  return api.post('/students', student);
};

export const getStudents = async () => {
  return api.get('/students');
};

export const updateStudent = async (id: string, student: { name: string; email: string; registration: string }) => {
  return api.put(`/students/${id}`, student);
};

export const deleteStudent = async (id: string) => {
  return api.delete(`/students/${id}`);
};
