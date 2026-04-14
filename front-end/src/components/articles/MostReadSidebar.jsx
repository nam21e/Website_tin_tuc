import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { Skeleton } from '../ui/Skeleton.jsx'

function Item({ article }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="flex items-start justify-between gap-3 rounded-lg px-3 py-2 hover:bg-slate-50"
    >
      <div className="min-w-0">
        <div className="line-clamp-2 text-sm font-medium text-slate-900">
          {article.title}
        </div>
        <div className="mt-1 text-xs text-slate-500">ID: {article.id}</div>
      </div>
      <div className="flex flex-none items-center gap-1 text-xs text-slate-500">
        <Eye size={14} />
        {article.views ?? 0}
      </div>
    </Link>
  )
}

export function MostReadSidebar({ loading, articles }) {
  return (
    <aside className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">Tin đọc nhiều</div>
      </div>

      <div className="p-2">
        {loading ? (
          <div className="grid gap-2 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          (articles || []).slice(0, 8).map((a) => <Item key={a.id} article={a} />)
        )}
      </div>
    </aside>
  )
}

