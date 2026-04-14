import { http } from '../lib/http.js'

export async function fetchDashboardStats() {
  const res = await http.get('/api/dashboard')
  return res.data?.data ?? null
}

