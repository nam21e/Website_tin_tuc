import { http } from '../lib/http.js'

export async function register(payload) {
  const res = await http.post('/api/auth/register', payload)
  return res.data?.data ?? null
}

export async function login(payload) {
  const res = await http.post('/api/auth/login', payload)
  return res.data?.data ?? null
}

