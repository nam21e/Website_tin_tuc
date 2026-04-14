import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Eye } from 'lucide-react'
import { fetchArticleById, updateArticle } from '../api/articles.js'
import { resolveAssetUrl } from '../lib/url.js'
import { Skeleton } from '../components/ui/Skeleton.jsx'

export function ArticleDetailPage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const thumbnailUrl = useMemo(
    () => resolveAssetUrl(article?.thumbnail),
    [article?.thumbnail],
  )

  useEffect(() => {
    let active = true
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchArticleById(id)
        if (active) setArticle(data)

        const currentViews = data?.views ?? 0
        updateArticle(id, { views: currentViews + 1 }).catch(() => {})
      } catch (e) {
        if (active) setError(e)
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="aspect-[16/8] w-full rounded-2xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-white p-4 text-sm text-rose-700">
        {error.message}
      </div>
    )
  }

  if (!article) {
    return (
      <div className="rounded-xl border bg-white p-4 text-sm text-slate-700">
        Không tìm thấy bài viết.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:underline"
        >
          <ArrowLeft size={16} />
          Quay lại
        </Link>
      </div>

      <header className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          {article.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Eye size={16} />
            {article.views ?? 0}
          </span>
          <span className="rounded bg-slate-100 px-2 py-1 text-xs">
            ID: {article.id}
          </span>
        </div>
      </header>

      {thumbnailUrl ? (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <img
            src={thumbnailUrl}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <article className="rounded-2xl border bg-white p-5 shadow-sm">
        {article.content ? (
          <div className="whitespace-pre-wrap text-sm leading-7 text-slate-800">
            {article.content}
          </div>
        ) : (
          <div className="text-sm text-slate-600">Bài viết chưa có nội dung.</div>
        )}
      </article>
    </div>
  )
}

