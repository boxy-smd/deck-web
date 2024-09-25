import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://deck-api.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
  withCredentials: true,
})

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      return Promise.reject(error.response.data)
    }

    return Promise.reject(error)
  },
)
