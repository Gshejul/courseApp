import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const auth = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
}

export const courses = {
  getAll: () => api.get('/courses'),
  getById: (id: string) => api.get(`/courses/${id}`),
  create: (data: FormData) => api.post('/courses', data),
  update: (id: string, data: FormData) => api.put(`/courses/${id}`, data),
  enroll: (id: string) => api.post(`/courses/${id}/enroll`),
  rate: (id: string, data: { rating: number; review: string }) =>
    api.post(`/courses/${id}/rate`, data),
}

export const users = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getPurchasedCourses: () => api.get('/users/purchased-courses'),
  getCreatedCourses: () => api.get('/users/created-courses'),
}

export default api
