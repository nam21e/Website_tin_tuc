import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="shell header-inner">
          <Link to="/" className="brand">
            Tin tức
          </Link>
          <span className="tagline">Đọc bài qua REST API</span>
        </div>
      </header>
      <main className="shell main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bai-viet/:id" element={<ArticleDetail />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          Frontend gọi <code>/api/articles</code>, <code>/api/categories</code>
        </div>
      </footer>
    </div>
  );
}
