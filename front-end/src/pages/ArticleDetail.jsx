import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getArticleById,
  getCategories,
  getSources,
  assetUrl,
} from "../api/client.js";

export default function ArticleDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [article, setArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [aRes, cRes, sRes] = await Promise.all([
          getArticleById(id),
          getCategories(),
          getSources(),
        ]);
        if (cancelled) return;
        setArticle(aRes.data);
        setCategories(cRes.data || []);
        setSources(sRes.data || []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Không tải được bài viết");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const category = useMemo(() => {
    if (!article?.category_id) return null;
    return categories.find((c) => Number(c.id) === Number(article.category_id));
  }, [article, categories]);

  const source = useMemo(() => {
    if (!article?.source_id) return null;
    return sources.find((s) => Number(s.id) === Number(article.source_id));
  }, [article, sources]);

  const thumb = article ? assetUrl(article.thumbnail) : null;

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" aria-label="Đang tải" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-page">
        <div className="error-box">
          <strong>Lỗi:</strong> {error || "Không tìm thấy bài viết."}
        </div>
        <p style={{ marginTop: "1rem" }}>
          <Link to="/" className="back">
            ← Về trang chủ
          </Link>
        </p>
      </div>
    );
  }

  if (article.is_published === false) {
    return (
      <div className="article-page">
        <div className="empty">Bài viết chưa được xuất bản.</div>
        <p style={{ marginTop: "1rem" }}>
          <Link to="/" className="back">
            ← Về trang chủ
          </Link>
        </p>
      </div>
    );
  }

  const contentHtml = article.content || "";

  return (
    <article className="article-page">
      <Link to="/" className="back">
        ← Trang chủ
      </Link>

      {thumb && (
        <div className="article-hero">
          <img src={thumb} alt="" />
        </div>
      )}

      <header className="article-header">
        <h1>{article.title}</h1>
        <div className="article-meta">
          {category && <span>{category.name}</span>}
          {source && <span>Nguồn: {source.name}</span>}
          {article.views != null && <span>{article.views} lượt xem</span>}
        </div>
      </header>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
