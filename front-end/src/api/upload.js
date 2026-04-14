import { http } from '../lib/http.js'

export async function uploadImage(file) {
  const form = new FormData()
  form.append('image', file)
  const res = await http.post('/api/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data?.data ?? null
}

