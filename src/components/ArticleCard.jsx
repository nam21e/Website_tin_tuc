export default function ArticleCard({ article }) {
  return (
    <article
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
        textAlign: "left",
      }}
    >
      {article.image ? (
        <img
          src={article.image}
          alt={article.title || "Ảnh bài viết"}
          style={{ width: "100%", height: 180, objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: 180,
            background: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
          }}
        >
          Không có ảnh
        </div>
      )}
      <div style={{ padding: 16 }}>
        <h2 style={{ margin: 0, marginBottom: 8, fontSize: 20 }}>
          {article.title || "Tiêu đề trống"}
        </h2>
        <p style={{ margin: 0, color: "#4b5563", fontSize: 14 }}>
          {article.description ||
            article.content?.slice(0, 120) ||
            "Nội dung đang được cập nhật."}
        </p>
      </div>
    </article>
  );
}