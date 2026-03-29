import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user_id", res.data.user_id);
      if (res.data.role === "teacher") navigate("/teacher");
      else if (res.data.role === "admin") navigate("/admin");
      else navigate("/student");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "#f8fafc" }}>
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #1e293b 0%, #4f46e5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        color: "#fff",
      }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "56px", marginBottom: "24px" }}>🎓</div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "16px" }}>AttendX</h1>
          <p style={{ fontSize: "16px", color: "#cbd5e1", lineHeight: "1.7" }}>
            College Attendance Management System — track attendance, manage leaves, and generate reports all in one place.
          </p>
          <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {["JWT Secured Authentication", "Role-based Access Control", "Real-time Attendance Tracking"].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", color: "#a5b4fc" }}>
                <span>✓</span>
                <span style={{ fontSize: "14px" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>Welcome back</h2>
          <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "15px" }}>Sign in to your account to continue</p>

          {error && (
            <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "15px", boxSizing: "border-box", outline: "none" }}
              />
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "15px", boxSizing: "border-box", outline: "none" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "13px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#64748b" }}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} style={{ color: "#4f46e5", cursor: "pointer", fontWeight: "500" }}>
              Create one
            </span>
          </p>
          <p style={{ textAlign: "center", marginTop: "12px", fontSize: "14px", color: "#64748b" }}>
            <span onClick={() => navigate("/home")} style={{ color: "#4f46e5", cursor: "pointer", fontWeight: "500" }}>
              ← Back to home
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}