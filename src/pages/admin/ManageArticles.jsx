import { useEffect, useState } from "react";
import {
  getArticles,
  deleteArticle,
} from "../../services/articleService";
import AdminLayout from "../../layouts/AdminLayout";

export default function ManageArticles() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const res = await getArticles();
      setData(res.data || []);
    } catch (err) {
      console.error("Failed to load articles:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể tải danh sách bài viết."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteArticle(id);
      loadData();
    } catch (err) {
      console.error("Failed to delete article:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Xóa bài viết thất bại."
      );
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-4">Quản lý bài viết</h1>

      {loading ? (
        <div>Đang tải bài viết …</div>
      ) : error ? (
        <div style={{ color: "#b91c1c" }}>{error}</div>
      ) : data.length === 0 ? (
        <div>Không có bài viết nào.</div>
      ) : (
        data.map((a) => (
          <div key={a._id} className="border p-3 mb-2 flex justify-between">
            <span>{a.title}</span>
            <button
              onClick={() => handleDelete(a._id)}
              className="text-red-500"
            >
              Xóa
            </button>
          </div>
        ))
      )}
    </AdminLayout>
  );
}