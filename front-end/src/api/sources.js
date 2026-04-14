import { http } from '../lib/http.js'

export async function fetchSources() {
  const res = await http.get('/api/sources')
  return res.data?.data ?? []
}

export async function createSource(payload) {
  const res = await http.post('/api/sources', payload)
  return res.data?.data ?? null
}

export async function updateSource(id, payload) {
  const res = await http.put(`/api/sources/${id}`, payload)
  return res.data?.data ?? null
}

export async function deleteSource(id) {
  const res = await http.delete(`/api/sources/${id}`)
  return res.data?.data ?? null
}

