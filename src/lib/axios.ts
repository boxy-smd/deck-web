import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://deck-api.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
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
