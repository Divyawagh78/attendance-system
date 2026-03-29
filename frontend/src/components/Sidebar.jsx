import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = {
  student: [
    { label: "Dashboard", path: "/student", icon: "🏠" },
    { label: "My Subjects", path: "/enroll", icon: "📚" },
    { label: "Apply Leave", path: "/leave-request", icon: "📝" },
  ],
  teacher: [
    { label: "Dashboard", path: "/teacher", icon: "🏠" },
    { label: "Bulk Attendance", path: "/bulk-attendance", icon: "✅" },
    { label: "View Report", path: "/attendance-report", icon: "📊" },
    { label: "Leave Requests", path: "/leave-management", icon: "📋" },
  ],
  admin: [
    { label: "Dashboard", path: "/admin", icon: "🏠" },
  ],
};

export default function Sidebar({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const items = menuItems[role] || [];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <div style={{
        width: collapsed ? "70px" : "240px",
        backgroundColor: "#1e293b",
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        height: "100vh",
        zIndex: 100,
        overflow: "hidden",
      }}>
        <div style={{
          padding: "20px 16px",
          borderBottom: "1px solid #334155",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "70px",
        }}>
          {!collapsed && (
            <div>
              <p style={{ color: "#fff", fontWeight: "700", fontSize: "15px", margin: 0 }}>AttendX</p>
              <p style={{ color: "#94a3b8", fontSize: "11px", margin: 0, textTransform: "capitalize" }}>{role}</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "18px",
              padding: "4px",
              marginLeft: collapsed ? "auto" : "0",
              marginRight: collapsed ? "auto" : "0",
            }}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: isActive ? "#4f46e5" : "transparent",
                  color: isActive ? "#fff" : "#94a3b8",
                  cursor: "pointer",
                  marginBottom: "4px",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: isActive ? "600" : "400",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.target.style.backgroundColor = "#334155";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.target.style.backgroundColor = "transparent";
                }}
              >
                <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: "1px solid #334155" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "transparent",
              color: "#ef4444",
              cursor: "pointer",
              fontSize: "14px",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <span style={{ fontSize: "18px", flexShrink: 0 }}>🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div style={{
        marginLeft: collapsed ? "70px" : "240px",
        flex: 1,
        transition: "margin-left 0.3s ease",
        minHeight: "100vh",
      }}>
        {children}
      </div>
    </div>
  );
}