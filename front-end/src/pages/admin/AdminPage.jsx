import { useMemo, useState } from 'react'
import { BarChart3, FileText, Folder, Globe, Users } from 'lucide-react'
import { fetchDashboardStats } from '../../api/dashboard.js'
import {
  createArticle,
  deleteArticle,
  fetchArticles,
  updateArticle,
} from '../../api/articles.js'
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../../api/categories.js'
import {
  createSource,
  deleteSource,
  fetchSources,
  updateSource,
} from '../../api/sources.js'
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from '../../api/users.js'
import { uploadImage } from '../../api/upload.js'
import { useAsync } from '../../hooks/useAsync.js'
import { resolveAssetUrl } from '../../lib/url.js'
import { Skeleton } from '../../components/ui/Skeleton.jsx'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'categories', label: 'Categories', icon: Folder },
  { id: 'sources', label: 'Sources', icon: Globe },
  { id: 'users', label: 'Users', icon: Users },
]

function TabButton({ active, icon, children, onClick }) {
  const Icon = icon
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
        active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      <Icon size={16} />
      {children}
    </button>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs font-medium text-slate-600">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  )
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 ${props.className || ''}`}
    />
  )
}

function SelectInput(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 ${props.className || ''}`}
    />
  )
}

function SectionCard({ title, actions, children }) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

function DangerButton(props) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 hover:bg-rose-100 disabled:opacity-60 ${props.className || ''}`}
    />
  )
}

function PrimaryButton(props) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 ${props.className || ''}`}
    />
  )
}

function GhostButton(props) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-lg border bg-white px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-60 ${props.className || ''}`}
    />
  )
}

function ErrorBox({ error }) {
  if (!error) return null
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
      {error.message}
    </div>
  )
}

function DashboardTab() {
  const { data, loading, error, run } = useAsync(() => fetchDashboardStats(), [])
  return (
    <SectionCard
      title="Thống kê"
      actions={<GhostButton onClick={run}>Làm mới</GhostButton>}
    >
      <ErrorBox error={error} />
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Users', value: data?.users ?? 0 },
            { label: 'Articles', value: data?.articles ?? 0 },
            { label: 'Categories', value: data?.categories ?? 0 },
            { label: 'Sources', value: data?.sources ?? 0 },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border bg-slate-50 p-4"
            >
              <div className="text-xs text-slate-500">{item.label}</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}

function ArticlesTab() {
  const {
    data: articles,
    loading,
    error,
    run: reload,
  } = useAsync(() => fetchArticles(), [])
  const { data: categories } = useAsync(() => fetchCategories(), [])
  const { data: sources } = useAsync(() => fetchSources(), [])
  const { data: users } = useAsync(() => fetchUsers(), [])

  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    id: '',
    title: '',
    slug: '',
    content: '',
    thumbnail: '',
    category_id: '',
    source_id: '',
    author_id: '',
    views: 0,
    is_published: true,
  })
  const [localError, setLocalError] = useState(null)

  const isEdit = Boolean(form.id)

  function reset() {
    setForm({
      id: '',
      title: '',
      slug: '',
      content: '',
      thumbnail: '',
      category_id: '',
      source_id: '',
      author_id: '',
      views: 0,
      is_published: true,
    })
  }

  async function save() {
    setBusy(true)
    setLocalError(null)
    try {
      const payload = {
        title: form.title,
        slug: form.slug || null,
        content: form.content || null,
        thumbnail: form.thumbnail || null,
        category_id: form.category_id ? Number(form.category_id) : null,
        source_id: form.source_id ? Number(form.source_id) : null,
        author_id: form.author_id ? Number(form.author_id) : null,
        views: Number(form.views || 0),
        is_published: Boolean(form.is_published),
      }
      if (isEdit) {
        await updateArticle(form.id, payload)
      } else {
        await createArticle(payload)
      }
      await reload()
      reset()
    } catch (e) {
      setLocalError(e)
    } finally {
      setBusy(false)
    }
  }

  async function remove(id) {
    if (!confirm('Xóa bài viết này?')) return
    setBusy(true)
    setLocalError(null)
    try {
      await deleteArticle(id)
      await reload()
    } catch (e) {
      setLocalError(e)
    } finally {
      setBusy(false)
    }
  }

  async function handleUpload(file) {
    setBusy(true)
    setLocalError(null)
    try {
      const data = await uploadImage(file)
      setForm((f) => ({ ...f, thumbnail: data?.path || '' }))
    } catch (e) {
      setLocalError(e)
    } finally {
      setBusy(false)
    }
  }

  const previewUrl = resolveAssetUrl(form.thumbnail)

  return (
    <div className="space-y-6">
      <SectionCard
        title={isEdit ? `Sửa bài viết #${form.id}` : 'Tạo bài viết'}
        actions={
          <>
            {isEdit ? <GhostButton onClick={reset}>Hủy sửa</GhostButton> : null}
            <PrimaryButton onClick={save} disabled={busy || !form.title}>
              {busy ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
            </PrimaryButton>
          </>
        }
      >
        <ErrorBox error={localError} />
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <Field label="Title *">
            <TextInput
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Tiêu đề bài viết"
            />
          </Field>
          <Field label="Slug">
            <TextInput
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="slug-tuy-chinh"
            />
          </Field>

          <Field label="Category">
            <SelectInput
              value={form.category_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, category_id: e.target.value }))
              }
            >
              <option value="">-- None --</option>
              {(categories || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Source">
            <SelectInput
              value={form.source_id}
              onChange={(e) => setForm((f) => ({ ...f, source_id: e.target.value }))}
            >
              <option value="">-- None --</option>
              {(sources || []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Author">
            <SelectInput
              value={form.author_id}
              onChange={(e) => setForm((f) => ({ ...f, author_id: e.target.value }))}
            >
              <option value="">-- None --</option>
              {(users || []).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Views">
            <TextInput
              type="number"
              value={form.views}
              onChange={(e) => setForm((f) => ({ ...f, views: e.target.value }))}
              min="0"
            />
          </Field>

          <Field label="Published">
            <SelectInput
              value={String(form.is_published)}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_published: e.target.value === 'true' }))
              }
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </SelectInput>
          </Field>

          <Field label="Thumbnail (upload)">
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file)
              }}
              className="w-full text-sm"
            />
            <div className="mt-2">
              <TextInput
                value={form.thumbnail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, thumbnail: e.target.value }))
                }
                placeholder="/uploads/xxx.jpg"
              />
            </div>
            {previewUrl ? (
              <div className="mt-3 overflow-hidden rounded-xl border bg-slate-50">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-40 w-full object-cover"
                />
              </div>
            ) : null}
          </Field>

          <div className="lg:col-span-2">
            <Field label="Content">
              <textarea
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                className="h-44 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Nội dung..."
              />
            </Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Danh sách bài viết"
        actions={<GhostButton onClick={reload}>Làm mới</GhostButton>}
      >
        <ErrorBox error={error} />
        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Views</th>
                  <th className="px-3 py-2">Published</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {(articles || []).map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-3 py-2">{a.id}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        className="line-clamp-1 text-left font-medium text-slate-900 hover:underline"
                        onClick={() =>
                          setForm({
                            id: a.id,
                            title: a.title || '',
                            slug: a.slug || '',
                            content: a.content || '',
                            thumbnail: a.thumbnail || '',
                            category_id: a.category_id ?? '',
                            source_id: a.source_id ?? '',
                            author_id: a.author_id ?? '',
                            views: a.views ?? 0,
                            is_published: a.is_published ?? true,
                          })
                        }
                      >
                        {a.title}
                      </button>
                    </td>
                    <td className="px-3 py-2">{a.views ?? 0}</td>
                    <td className="px-3 py-2">{String(a.is_published)}</td>
                    <td className="px-3 py-2 text-right">
                      <DangerButton onClick={() => remove(a.id)} disabled={busy}>
                        Xóa
                      </DangerButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  )
}

function SimpleCrudTab({
  title,
  fetchAll,
  createOne,
  updateOne,
  deleteOne,
  fields,
}) {
  const { data, loading, error, run: reload } = useAsync(() => fetchAll(), [])
  const [busy, setBusy] = useState(false)
  const [localError, setLocalError] = useState(null)
  const [form, setForm] = useState({ id: '' })

  const isEdit = Boolean(form.id)

  function reset() {
    setForm({ id: '' })
  }

  async function save() {
    setBusy(true)
    setLocalError(null)
    try {
      const payload = {}
      fields.forEach((f) => {
        payload[f.key] = form[f.key] === '' ? null : form[f.key]
      })
      if (isEdit) await updateOne(form.id, payload)
      else await createOne(payload)
      await reload()
      reset()
    } catch (e) {
      setLocalError(e)
    } finally {
      setBusy(false)
    }
  }

  async function remove(id) {
    if (!confirm('Xóa mục này?')) return
    setBusy(true)
    setLocalError(null)
    try {
      await deleteOne(id)
      await reload()
    } catch (e) {
      setLocalError(e)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title={isEdit ? `Sửa #${form.id}` : `Tạo ${title}`}
        actions={
          <>
            {isEdit ? <GhostButton onClick={reset}>Hủy sửa</GhostButton> : null}
            <PrimaryButton onClick={save} disabled={busy}>
              {busy ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
            </PrimaryButton>
          </>
        }
      >
        <ErrorBox error={localError} />
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <Field key={f.key} label={f.label}>
              <TextInput
                value={form[f.key] ?? ''}
                onChange={(e) =>
                  setForm((x) => ({ ...x, [f.key]: e.target.value }))
                }
                placeholder={f.placeholder || ''}
              />
            </Field>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={`Danh sách ${title}`}
        actions={<GhostButton onClick={reload}>Làm mới</GhostButton>}
      >
        <ErrorBox error={error} />
        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  {fields.map((f) => (
                    <th key={f.key} className="px-3 py-2">
                      {f.label}
                    </th>
                  ))}
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {(data || []).map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-3 py-2">{item.id}</td>
                    {fields.map((f) => (
                      <td key={f.key} className="px-3 py-2">
                        <button
                          type="button"
                          className="text-left hover:underline"
                          onClick={() => {
                            const next = { id: item.id }
                            fields.forEach((ff) => {
                              next[ff.key] = item[ff.key] ?? ''
                            })
                            setForm(next)
                          }}
                        >
                          {String(item[f.key] ?? '')}
                        </button>
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right">
                      <DangerButton onClick={() => remove(item.id)} disabled={busy}>
                        Xóa
                      </DangerButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  )
}

export function AdminPage() {
  const [tab, setTab] = useState('dashboard')

  const tabContent = useMemo(() => {
    switch (tab) {
      case 'dashboard':
        return <DashboardTab />
      case 'articles':
        return <ArticlesTab />
      case 'categories':
        return (
          <SimpleCrudTab
            title="categories"
            fetchAll={fetchCategories}
            createOne={createCategory}
            updateOne={updateCategory}
            deleteOne={deleteCategory}
            fields={[
              { key: 'name', label: 'Name', placeholder: 'Thời sự' },
              { key: 'slug', label: 'Slug', placeholder: 'thoi-su' },
            ]}
          />
        )
      case 'sources':
        return (
          <SimpleCrudTab
            title="sources"
            fetchAll={fetchSources}
            createOne={createSource}
            updateOne={updateSource}
            deleteOne={deleteSource}
            fields={[
              { key: 'name', label: 'Name', placeholder: 'VnExpress' },
              { key: 'website', label: 'Website', placeholder: 'https://...' },
              { key: 'logo', label: 'Logo', placeholder: '/uploads/logo.png' },
            ]}
          />
        )
      case 'users':
        return (
          <SimpleCrudTab
            title="users"
            fetchAll={fetchUsers}
            createOne={createUser}
            updateOne={updateUser}
            deleteOne={deleteUser}
            fields={[
              { key: 'name', label: 'Name', placeholder: 'Nguyễn Văn A' },
              { key: 'email', label: 'Email', placeholder: 'you@email.com' },
              { key: 'avatar_url', label: 'Avatar URL', placeholder: 'https://...' },
              { key: 'role', label: 'Role', placeholder: 'user/admin' },
            ]}
          />
        )
      default:
        return null
    }
  }, [tab])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="text-sm text-slate-500">Quản trị</div>
        <div className="mt-1 text-2xl font-semibold text-slate-900">Admin</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <TabButton
              key={t.id}
              active={tab === t.id}
              icon={t.icon}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </TabButton>
          ))}
        </div>
      </div>

      {tabContent}
    </div>
  )
}

