import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { login, register } from '../api/auth.js'
import { setStoredUser } from '../lib/storage.js'

export function AuthPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    avatar_url: '',
    role: 'user',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const user =
        mode === 'login'
          ? await login({ email: form.email })
          : await register({
              name: form.name,
              email: form.email,
              avatar_url: form.avatar_url || null,
              role: form.role || 'user',
            })
      const next = params.get('next') || '/'
      const isGoingAdmin = typeof next === 'string' && next.startsWith('/admin')

      if (isGoingAdmin && user?.role !== 'admin') {
        throw new Error('Tài khoản này không có quyền admin.')
      }

      setStoredUser(user)
      navigate(next)
      window.location.reload()
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </h1>
          <button
            type="button"
            className="text-sm text-slate-600 hover:underline"
            onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}
          >
            {mode === 'login' ? 'Tạo tài khoản' : 'Đã có tài khoản?'}
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error.message}
          </div>
        ) : null}

        <form className="mt-5 space-y-4" onSubmit={submit}>
          {mode === 'register' ? (
            <>
              <div>
                <label className="text-sm text-slate-600">Tên</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-slate-600">Avatar URL (tuỳ chọn)</label>
                <input
                  value={form.avatar_url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, avatar_url: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm text-slate-600">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </>
          ) : null}

          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="you@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  )
}

