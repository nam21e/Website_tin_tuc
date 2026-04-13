import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { resolveAssetUrl } from '../../lib/url.js'

export function ArticleCard({ article }) {
  const thumbnailUrl = resolveAssetUrl(article?.thumbnail)

  return (
    <article className="overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow transition-shadow">
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[180px_1fr]">
        <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={article?.title || 'thumbnail'}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </div>

        <div className="min-w-0">
          <Link
            to={`/articles/${article?.id}`}
            className="line-clamp-2 text-base font-semibold text-slate-900 hover:underline sm:text-lg"
          >
            {article?.title || 'Không có tiêu đề'}
          </Link>

          {article?.content ? (
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">
              {article.content}
            </p>
          ) : null}

          <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Eye size={14} />
              {article?.views ?? 0}
            </span>
            {article?.is_published === false ? (
              <span className="rounded bg-amber-50 px-2 py-1 text-amber-700">
                Nháp
              </span>
            ) : (
              <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">
                Public
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

