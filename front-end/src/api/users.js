import { http } from '../lib/http.js'

export async function fetchUsers() {
  const res = await http.get('/api/users')
  return res.data?.data ?? []
}

export async function createUser(payload) {
  const res = await http.post('/api/users', payload)
  return res.data?.data ?? null
}

export async function updateUser(id, payload) {
  const res = await http.put(`/api/users/${id}`, payload)
  return res.data?.data ?? null
}

export async function deleteUser(id) {
  const res = await http.delete(`/api/users/${id}`)
  return res.data?.data ?? null
}

