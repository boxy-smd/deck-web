import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://deck-api.onrender.com',
})
