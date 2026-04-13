import axios from 'axios'
import { getApiBaseUrl } from './env.js'

export const http = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Có lỗi xảy ra, vui lòng thử lại.'
    return Promise.reject(new Error(message))
  },
)

