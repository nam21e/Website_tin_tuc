import { useMemo, useState } from 'react'
import { fetchArticles } from '../api/articles.js'
import { useAsync } from '../hooks/useAsync.js'
import { HeroSection } from '../components/articles/HeroSection.jsx'
import { MostReadSidebar } from '../components/articles/MostReadSidebar.jsx'
import { ArticleCard } from '../components/articles/ArticleCard.jsx'
import { Skeleton } from '../components/ui/Skeleton.jsx'

function sortByIdDesc(a, b) {
  return (b?.id ?? 0) - (a?.id ?? 0)
}

function sortByViewsDesc(a, b) {
  return (b?.views ?? 0) - (a?.views ?? 0)
}

export function HomePage() {
  const { data: articles, loading, error } = useAsync(() => fetchArticles(), [])
  const [page, setPage] = useState(1)
  const pageSize = 8

  const { latest, side, mainList, mostRead } = useMemo(() => {
    const all = (articles || []).slice().sort(sortByIdDesc)
    const latestArticle = all[0] || null
    const sideList = all.slice(1, 5)
    const list = all.slice(5)
    const most = (articles || []).slice().sort(sortByViewsDesc)
    return { latest: latestArticle, side: sideList, mainList: list, mostRead: most }
  }, [articles])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return mainList.slice(start, start + pageSize)
  }, [mainList, page])

  const totalPages = Math.max(1, Math.ceil(mainList.length / pageSize))

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-xl border bg-white p-4 text-sm text-rose-700">
          {error.message}
        </div>
      ) : null}

      <HeroSection loading={loading} latest={latest} side={side} />

      <section className="grid gap-6 lg:grid-cols-10">
        <div className="lg:col-span-7">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Bài viết mới
            </h2>
            <div className="text-xs text-slate-500">
              Trang {page}/{totalPages}
            </div>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="grid gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[132px] w-full rounded-xl" />
                ))}
              </div>
            ) : (
              paged.map((a) => <ArticleCard key={a.id} article={a} />)
            )}
          </div>

          {!loading && totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                className="rounded-lg border bg-white px-3 py-2 text-sm disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Trước
              </button>
              <button
                type="button"
                className="rounded-lg border bg-white px-3 py-2 text-sm disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Sau
              </button>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-3">
          <MostReadSidebar loading={loading} articles={mostRead} />
        </div>
      </section>
    </div>
  )
}

