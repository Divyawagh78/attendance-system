import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { icon: "✅", title: "Smart Attendance", desc: "Mark attendance individually or for entire class in one click" },
    { icon: "📊", title: "Real-time Reports", desc: "Export attendance data to CSV or Excel instantly" },
    { icon: "⚠️", title: "75% Alert System", desc: "Automatic alerts when student attendance drops below threshold" },
    { icon: "📝", title: "Leave Management", desc: "Students apply for leave, teachers approve or reject digitally" },
    { icon: "🔐", title: "Secure Access", desc: "JWT authentication with role-based access control" },
    { icon: "👥", title: "Multi-role System", desc: "Separate dashboards for Students, Teachers, and Admins" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <nav style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 40px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>🎓</span>
          <span style={{ fontWeight: "700", fontSize: "18px", color: "#1e293b" }}>AttendX</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => navigate("/Login")}
            style={{ padding: "8px 20px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#fff", cursor: "pointer", fontSize: "14px", color: "#475569" }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{ padding: "8px 20px", border: "none", borderRadius: "8px", backgroundColor: "#4f46e5", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}
          >
            Get Started
          </button>
        </div>
      </nav>

      <div style={{
        background: "linear-gradient(135deg, #1e293b 0%, #4f46e5 100%)",
        padding: "100px 40px",
        textAlign: "center",
        color: "#fff",
      }}>
        <div style={{
          display: "inline-block",
          backgroundColor: "rgba(255,255,255,0.1)",
          padding: "6px 16px",
          borderRadius: "20px",
          fontSize: "13px",
          marginBottom: "24px",
          border: "1px solid rgba(255,255,255,0.2)",
        }}>
          College Attendance Management System
        </div>
        <h1 style={{ fontSize: "52px", fontWeight: "800", marginBottom: "20px", lineHeight: "1.2" }}>
          Attendance Tracking<br />
          <span style={{ color: "#a5b4fc" }}>Made Simple</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#cbd5e1", maxWidth: "600px", margin: "0 auto 40px", lineHeight: "1.7" }}>
          A complete attendance management solution for colleges with real-time tracking, automated alerts, and digital leave management.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/register")}
            style={{ padding: "14px 32px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}
          >
            Get Started Free →
          </button>
          <button
            onClick={() => navigate("/Login")}
            style={{ padding: "14px 32px", backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "10px", fontSize: "16px", cursor: "pointer" }}
          >
            Login to Dashboard
          </button>
        </div>
      </div>

      <div style={{ padding: "80px 40px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>
          Everything you need
        </h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "48px", fontSize: "16px" }}>
          Built for colleges, designed for everyone
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {features.map((f, i) => (
            <div key={i} style={{
              backgroundColor: "#fff",
              padding: "28px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#eff6ff",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                marginBottom: "16px",
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: "#1e293b", padding: "60px 40px", textAlign: "center" }}>
        <h2 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", marginBottom: "12px" }}>
          Ready to get started?
        </h2>
        <p style={{ color: "#94a3b8", marginBottom: "28px" }}>Join your college attendance system today</p>
        <button
          onClick={() => navigate("/register")}
          style={{ padding: "14px 32px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}
        >
          Create Account →
        </button>
        <p style={{ color: "#475569", fontSize: "13px", marginTop: "40px" }}>
          Built with FastAPI + React · Divya wagh · 2026
        </p>
      </div>
    </div>
  );
}