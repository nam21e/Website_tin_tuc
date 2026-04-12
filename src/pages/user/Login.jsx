import { useState } from "react";
import { login } from "../../services/authService";

export default function Login() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const handle = async () => {
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setError("");
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err?.response?.data?.message || err?.message || "Đăng nhập thất bại"
      );
    }
  };

  return (
    <div style={{ padding: 24, textAlign: "left", maxWidth: 360, margin: "0 auto" }}>
      <h1>Đăng nhập</h1>
      <div style={{ marginBottom: 8 }}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />
      </div>
      <button onClick={handle} style={{ padding: "10px 16px" }}>
        Login
      </button>
      {error && (
        <div style={{ marginTop: 12, color: "#b91c1c" }}>{error}</div>
      )}
    </div>
  );
}
