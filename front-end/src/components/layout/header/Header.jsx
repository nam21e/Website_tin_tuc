import { useMemo, useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'
import { useAsync } from '../../../hooks/useAsync.js'
import { fetchCategories } from '../../../api/categories.js'
import { clearStoredUser, getStoredUser } from '../../../lib/storage.js'
import { resolveAssetUrl } from '../../../lib/url.js'
import { Skeleton } from '../../ui/Skeleton.jsx'

function CategoryLink({ category, onClick }) {
  const label = category?.name || 'Chuyên mục'
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded px-3 py-2 text-left text-sm hover:bg-slate-100"
    >
      {label}
    </button>
  )
}

export function Header() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState(params.get('q') || '')
  const user = useMemo(() => getStoredUser(), [])
  const avatarUrl = resolveAssetUrl(user?.avatar_url)

  const { data: categories, loading: categoriesLoading } = useAsync(
    () => fetchCategories(),
    [],
  )

  function submitSearch(e) {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
    setMobileOpen(false)
  }

  function logout() {
    clearStoredUser()
    navigate('/')
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded p-2 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Mở menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="grid h-8 w-8 place-items-center rounded bg-slate-900 text-sm text-white">
              TT
            </div>
            <span className="hidden sm:block">Tin Tức</span>
          </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {categoriesLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-28" />
            </div>
          ) : (
            (categories || []).slice(0, 6).map((c) => (
              <NavLink
                key={c.id}
                to={`/search?category=${encodeURIComponent(c.id)}`}
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-sm hover:bg-slate-100 ${
                    isActive ? 'text-slate-900' : 'text-slate-600'
                  }`
                }
              >
                {c.name}
              </NavLink>
            ))
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <form
            onSubmit={submitSearch}
            className="hidden items-center gap-2 rounded-full border bg-white px-3 py-2 shadow-sm md:flex"
          >
            <Search size={16} className="text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-64 bg-transparent text-sm outline-none"
            />
          </form>

          <Link
            to={user ? '/admin' : '/auth?next=%2Fadmin'}
            className="hidden rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 md:inline-flex"
          >
            Admin
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/me"
                className="hidden items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm hover:bg-slate-50 md:inline-flex"
                title="Xem thông tin tài khoản"
              >
                <div className="h-7 w-7 overflow-hidden rounded-lg border bg-slate-50">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || 'avatar'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-xs font-semibold text-slate-600">
                      {(user?.name || user?.email || '?').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="max-w-40 truncate font-medium text-slate-700">
                  {user?.name || user?.email}
                </div>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t bg-white md:hidden">
          <div className="container-page py-3">
            <form
              onSubmit={submitSearch}
              className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm"
            >
              <Search size={16} className="text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </form>

            <div className="mt-3 grid gap-1">
              <Link
                to={user ? '/admin' : '/auth?next=%2Fadmin'}
                className="rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
              {user ? (
                <Link
                  to="/me"
                  className="rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                  onClick={() => setMobileOpen(false)}
                >
                  Tài khoản
                </Link>
              ) : null}
              {(categories || []).slice(0, 10).map((c) => (
                <CategoryLink
                  key={c.id}
                  category={c}
                  onClick={() => {
                    navigate(`/search?category=${encodeURIComponent(c.id)}`)
                    setMobileOpen(false)
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

