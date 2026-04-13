import { http } from '../lib/http.js'

export async function fetchCategories() {
  const res = await http.get('/api/categories')
  return res.data?.data ?? []
}

export async function createCategory(payload) {
  const res = await http.post('/api/categories', payload)
  return res.data?.data ?? null
}

export async function updateCategory(id, payload) {
  const res = await http.put(`/api/categories/${id}`, payload)
  return res.data?.data ?? null
}

export async function deleteCategory(id) {
  const res = await http.delete(`/api/categories/${id}`)
  return res.data?.data ?? null
}

