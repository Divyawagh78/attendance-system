import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getPendingLeaves, actionLeave } from "../services/api";

export default function LeaveManagement() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    getPendingLeaves().then((res) => setRequests(res.data)).catch(() => {});
  };

  const handleAction = async (leaveId, action) => {
    try {
      await actionLeave(leaveId, action);
      setMessage(`Request ${action}`);
      loadRequests();
    } catch {
      setMessage("Failed to update");
    }
  };

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const pending = requests.filter((r) => r.status === "pending").length;

 const statusColor = (status) => {
  if (status === "approved")
    return {
      bg: "#ecfdf5",
      color: "#065f46",
      border: "#a7f3d0",
    };

  if (status === "rejected")
    return {
      bg: "#fef2f2",
      color: "#7f1d1d",
      border: "#fecaca",
    };

  return {
    bg: "#fffbeb",
    color: "#78350f",
    border: "#fde68a",
  };
};
  const navItems = [
    { label: "Dashboard", path: "/teacher" },
    { label: "Attendance Report", path: "/attendance-report" },
    { label: "Bulk Attendance", path: "/bulk-attendance" },
    { label: "Leave Requests", path: "/leave-management" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.wrapper}>
      
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>AttendX</div>

        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.navItem,
              backgroundColor:
                location.pathname === item.path ? "#4f46e5" : "transparent",
            }}
          >
            {item.label}
          </button>
        ))}

        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <h2 style={styles.title}>Leave Management</h2>

        {pending > 0 && (
          <div style={styles.warning}>
            ⚠ {pending} pending request{pending > 1 ? "s" : ""}
          </div>
        )}

        {message && <div style={styles.toast}>{message}</div>}

        {/* Filters */}
        <div style={styles.filters}>
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                background: filter === f ? "#4f46e5" : "#e5e7eb",
                color: filter === f ? "#fff" : "#374151",
              }}
            >
              {f}
              {f === "pending" && pending > 0 && (
                <span style={styles.badge}>{pending}</span>
              )}
            </button>
          ))}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div style={styles.card}>
            <p style={styles.muted}>No requests</p>
          </div>
        ) : (
          filtered.map((r) => {
            const sc = statusColor(r.status);

            return (
              <div key={r.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <p style={styles.name}>{r.student_name}</p>
                    <p style={styles.email}>{r.email}</p>
                  </div>

                  <span
                    style={{
                      ...styles.status,
                      background: sc.bg,
                      color: sc.color,
                    }}
                  >
                    {r.status}
                  </span>
                </div>

                <p><strong>Subject:</strong> {r.subject_name}</p>
                <p><strong>Date:</strong> {r.date}</p>
                <p><strong>Reason:</strong> {r.reason}</p>

                {r.status === "pending" && (
                  <div style={styles.actions}>
                    <button
                      style={styles.approve}
                      onClick={() => handleAction(r.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      style={styles.reject}
                      onClick={() => handleAction(r.id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    background: "#f1f5f9",
    fontFamily: "Inter, sans-serif",
  },

  sidebar: {
    width: "240px",
    background: "#0f172a",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },

  brand: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "30px",
  },

  navItem: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    color: "#fff",
    textAlign: "left",
    marginBottom: "8px",
    cursor: "pointer",
  },

  logout: {
    marginTop: "auto",
    padding: "12px",
    background: "#ef4444",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "30px",
    overflowY: "auto",
  },

  title: {
    marginBottom: "10px",
  },

  warning: {
    background: "#fef9c3",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    color: "#92400e",
  },

  toast: {
    background: "#dbeafe",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  filters: {
    display: "flex",
    gap: "8px",
    marginBottom: "15px",
  },

  filterBtn: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    position: "relative",
  },

  badge: {
    background: "#ef4444",
    color: "#fff",
    borderRadius: "10px",
    padding: "2px 6px",
    fontSize: "11px",
    marginLeft: "5px",
  },

  card: {
    background: "#fff",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  name: {
    margin: 0,
    fontWeight: "500",
  },

  email: {
    margin: 0,
    fontSize: "12px",
    color: "#64748b",
  },

status: {
  padding: "4px 12px",
  borderRadius: "999px", // pill shape
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "capitalize",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
},

  actions: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },

  approve: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  reject: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  muted: {
    color: "#9ca3af",
  },
};