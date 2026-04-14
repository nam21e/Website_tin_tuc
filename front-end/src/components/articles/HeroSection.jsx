import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { resolveAssetUrl } from '../../lib/url.js'
import { Skeleton } from '../ui/Skeleton.jsx'

function HeroMain({ article }) {
  const thumbnailUrl = resolveAssetUrl(article?.thumbnail)
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm"
    >
      <div className="aspect-[16/10] bg-slate-100">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="p-5">
        <div className="mb-2 inline-flex items-center gap-1 text-xs text-slate-500">
          <Clock size={14} />
          Mới nhất
        </div>
        <h2 className="line-clamp-3 text-xl font-semibold text-slate-900 sm:text-2xl">
          {article.title}
        </h2>
        {article.content ? (
          <p className="mt-2 line-clamp-3 text-sm text-slate-600">
            {article.content}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

function HeroSideItem({ article }) {
  const thumbnailUrl = resolveAssetUrl(article?.thumbnail)
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group flex gap-3 rounded-xl border bg-white p-3 shadow-sm hover:shadow transition-shadow"
    >
      <div className="h-16 w-24 flex-none overflow-hidden rounded-lg bg-slate-100">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={article.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="min-w-0">
        <div className="line-clamp-2 text-sm font-medium text-slate-900 group-hover:underline">
          {article.title}
        </div>
        <div className="mt-1 text-xs text-slate-500">ID: {article.id}</div>
      </div>
    </Link>
  )
}

export function HeroSection({ loading, latest, side }) {
  if (loading) {
    return (
      <section className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          <Skeleton className="mt-3 h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
        </div>
        <div className="grid gap-3 lg:col-span-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[92px] w-full rounded-xl" />
          ))}
        </div>
      </section>
    )
  }

  if (!latest) return null

  return (
    <section className="grid gap-4 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <HeroMain article={latest} />
      </div>
      <div className="grid gap-3 lg:col-span-4">
        {(side || []).slice(0, 4).map((a) => (
          <HeroSideItem key={a.id} article={a} />
        ))}
      </div>
    </section>
  )
}

