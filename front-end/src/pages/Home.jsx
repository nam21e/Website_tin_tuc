import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getArticles,
  getCategories,
  getSources,
  assetUrl,
} from "../api/client.js";

function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
}

function excerpt(text, max = 140) {
  if (!text) return "";
  return text.length <= max ? text : `${text.slice(0, max).trim()}…`;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [aRes, cRes, sRes] = await Promise.all([
          getArticles(),
          getCategories(),
          getSources(),
        ]);
        if (cancelled) return;
        setArticles(aRes.data || []);
        setCategories(cRes.data || []);
        setSources(sRes.data || []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Không tải được dữ liệu");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryMap = useMemo(() => {
    const m = new Map();
    for (const c of categories) {
      if (c?.id != null) m.set(Number(c.id), c);
    }
    return m;
  }, [categories]);

  const sourceMap = useMemo(() => {
    const m = new Map();
    for (const s of sources) {
      if (s?.id != null) m.set(Number(s.id), s);
    }
    return m;
  }, [sources]);

  const visible = useMemo(() => {
    return (articles || []).filter((item) => item.is_published !== false);
  }, [articles]);

  const filtered = useMemo(() => {
    if (!categoryId) return visible;
    const id = Number(categoryId);
    return visible.filter((a) => Number(a.category_id) === id);
  }, [visible, categoryId]);

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" aria-label="Đang tải" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-box">
        <strong>Lỗi:</strong> {error}
        <p style={{ marginTop: "0.75rem", fontSize: "0.875rem" }}>
          Hãy chạy backend tại cổng 5000 rồi chạy lại <code>npm run dev</code>{" "}
          (proxy Vite).
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Trang chủ tin tức</h1>
      <p className="page-desc">
        Danh sách lấy từ <strong>GET /api/articles</strong>; chỉ hiển thị bài đã
        xuất bản (<code>is_published !== false</code>).
      </p>

      <div className="toolbar">
        <label>
          Chuyên mục
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Tất cả</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
          {filtered.length} bài
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">Không có bài viết nào phù hợp.</div>
      ) : (
        <div className="grid">
          {filtered.map((article) => {
            const cat = categoryMap.get(Number(article.category_id));
            const src = sourceMap.get(Number(article.source_id));
            const thumb = assetUrl(article.thumbnail);
            const plain = stripHtml(article.content);
            return (
              <article key={article.id} className="card">
                <Link
                  to={`/bai-viet/${article.id}`}
                  className="card-link"
                >
                  <div className="card-thumb-wrap">
                    {thumb ? (
                      <img
                        className="card-thumb"
                        src={thumb}
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <div className="card-thumb" />
                    )}
                  </div>
                  <div className="card-body">
                    <div className="card-meta">
                      {cat?.name && <span>{cat.name}</span>}
                      {src?.name && <span>{src.name}</span>}
                      {article.views != null && (
                        <span>{article.views} lượt xem</span>
                      )}
                    </div>
                    <h2 className="card-title">{article.title}</h2>
                    {plain && (
                      <p className="card-excerpt">{excerpt(plain)}</p>
                    )}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
