import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchArticles } from '../api/articles.js'
import { fetchCategories } from '../api/categories.js'
import { useAsync } from '../hooks/useAsync.js'
import { ArticleCard } from '../components/articles/ArticleCard.jsx'
import { MostReadSidebar } from '../components/articles/MostReadSidebar.jsx'
import { Skeleton } from '../components/ui/Skeleton.jsx'

function includesText(haystack, needle) {
  if (!needle) return true
  return String(haystack || '')
    .toLowerCase()
    .includes(String(needle).toLowerCase())
}

export function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const categoryId = params.get('category') || ''

  const { data: articles, loading, error } = useAsync(() => fetchArticles(), [])
  const { data: categories } = useAsync(() => fetchCategories(), [])

  const categoryName = useMemo(() => {
    if (!categoryId) return ''
    const found = (categories || []).find((c) => String(c.id) === String(categoryId))
    return found?.name || ''
  }, [categories, categoryId])

  const filtered = useMemo(() => {
    const all = articles || []
    return all.filter((a) => {
      const okCategory = categoryId
        ? String(a.category_id) === String(categoryId)
        : true
      const okText =
        includesText(a.title, q) || includesText(a.content, q) || includesText(a.slug, q)
      return okCategory && okText
    })
  }, [articles, q, categoryId])

  const mostRead = useMemo(() => {
    return (articles || []).slice().sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
  }, [articles])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="text-sm text-slate-500">Kết quả tìm kiếm</div>
        <div className="mt-1 text-xl font-semibold text-slate-900">
          {categoryName ? `Chuyên mục: ${categoryName}` : 'Tất cả bài viết'}
        </div>
        {q ? (
          <div className="mt-2 text-sm text-slate-600">
            Từ khóa: <span className="font-medium text-slate-900">{q}</span>
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-xl border bg-white p-4 text-sm text-rose-700">
          {error.message}
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-10">
        <div className="lg:col-span-7">
          <div className="mb-3 text-sm text-slate-500">
            {loading ? 'Đang tải...' : `${filtered.length} bài viết`}
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="grid gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-[132px] w-full rounded-xl" />
                ))}
              </div>
            ) : (
              filtered.map((a) => <ArticleCard key={a.id} article={a} />)
            )}
          </div>
        </div>
        <div className="lg:col-span-3">
          <MostReadSidebar loading={loading} articles={mostRead} />
        </div>
      </section>
    </div>
  )
}

