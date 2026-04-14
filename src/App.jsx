import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import Login from "./pages/user/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <div style={{ padding: 24, textAlign: "left" }}>
              <h1>Trang không tồn tại</h1>
              <p>Vui lòng quay lại trang chủ.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;