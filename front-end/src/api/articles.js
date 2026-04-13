import { http } from '../lib/http.js'

export async function fetchArticles() {
  const res = await http.get('/api/articles')
  return res.data?.data ?? []
}

export async function fetchArticleById(id) {
  const res = await http.get(`/api/articles/${id}`)
  return res.data?.data ?? null
}

export async function createArticle(payload) {
  const res = await http.post('/api/articles', payload)
  return res.data?.data ?? null
}

export async function updateArticle(id, payload) {
  const res = await http.put(`/api/articles/${id}`, payload)
  return res.data?.data ?? null
}

export async function deleteArticle(id) {
  const res = await http.delete(`/api/articles/${id}`)
  return res.data?.data ?? null
}

