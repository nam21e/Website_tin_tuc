import { useEffect, useState } from "react";
import { getArticles } from "../../services/articleService";
import ArticleCard from "../../components/ArticleCard";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const res = await getArticles();
        setData(res.data || []);
      } catch (err) {
        console.error("Failed to load articles:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Không thể tải bài viết. Vui lòng kiểm tra backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <main style={{ padding: 24, textAlign: "left" }}>
      <h1 style={{ marginBottom: 16, fontSize: 32 }}>Tin tức nổi bật</h1>

      {loading ? (
        <div>Đang tải bài viết …</div>
      ) : error ? (
        <div style={{ color: "#b91c1c" }}>
          Lỗi khi tải bài viết: {error}
        </div>
      ) : data.length === 0 ? (
        <div>
          Chưa có bài viết nào. Vui lòng kiểm tra backend hoặc thêm nội dung.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {data.map((article) => (
            <ArticleCard key={article._id ?? article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
