import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticleById } from "../../services/articleService";

export default function ArticleDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadArticle = async () => {
      try {
        const res = await getArticleById(id);
        setData(res.data);
      } catch (err) {
        console.error("Failed to load article:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Không thể tải chi tiết bài viết."
        );
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  if (loading) {
    return <div style={{ padding: 24 }}>Đang tải chi tiết bài viết …</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 24, color: "#b91c1c" }}>
        Lỗi: {error}
      </div>
    );
  }

  if (!data) {
    return <div style={{ padding: 24 }}>Bài viết không tồn tại.</div>;
  }

  return (
    <div style={{ padding: 24, textAlign: "left" }}>
      <h1 style={{ fontSize: 32 }}>{data.title}</h1>
      <p style={{ color: "#4b5563", marginTop: 16 }}>{data.content}</p>
    </div>
  );
}