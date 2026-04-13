import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearStoredUser, getStoredUser } from '../lib/storage.js'
import { resolveAssetUrl } from '../lib/url.js'

function Field({ label, value }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 break-words text-sm font-semibold text-slate-900">
        {value || '-'}
      </div>
    </div>
  )
}

export function UserProfilePage() {
  const navigate = useNavigate()
  const user = useMemo(() => getStoredUser(), [])
  const avatarUrl = resolveAssetUrl(user?.avatar_url)

  function logout() {
    clearStoredUser()
    navigate('/')
    window.location.reload()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-2xl border bg-slate-50">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || 'avatar'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm font-semibold text-slate-600">
                  {(user?.name || user?.email || '?').slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-slate-500">Tài khoản</div>
              <div className="mt-1 text-xl font-semibold text-slate-900">
                {user?.name || 'User'}
              </div>
              <div className="mt-1 text-sm text-slate-600">{user?.email}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 hover:bg-rose-100"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="ID" value={user?.id} />
        <Field label="Role" value={user?.role} />
        <Field label="Email" value={user?.email} />
        <Field label="Avatar URL" value={user?.avatar_url} />
      </div>
    </div>
  )
}

