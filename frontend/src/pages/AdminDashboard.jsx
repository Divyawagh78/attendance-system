import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAdminSummary, deleteStudent, getAllTeachers } from "../services/api";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("students");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    Promise.all([getAdminSummary(), getAllTeachers()])
      .then(([summaryRes, teachersRes]) => {
        setSummary(summaryRes.data);
        setTeachers(teachersRes.data);
      })
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id, name) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }

    try {
      await deleteStudent(id);
      setMessage(`${name} deleted`);
      setConfirmDelete(null);
      loadData();
    } catch {
      setMessage("Delete failed");
      setConfirmDelete(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const statusBadge = (s) => {
    if (s.total_classes === 0)
      return { label: "No Data", bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };

    if (s.alert)
      return { label: "At Risk", bg: "#fee2e2", color: "#dc2626", border: "#fecaca" };

    return { label: "Good", bg: "#dcfce7", color: "#16a34a", border: "#a7f3d0" };
  };

  const navItems = [
    { label: "Dashboard", path: "/admin" },
  ];

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
              background:
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
        <h2 style={styles.title}>Admin Dashboard</h2>

        {message && <div style={styles.toast}>{message}</div>}

        {loading ? (
          <p style={styles.muted}>Loading...</p>
        ) : !summary ? (
          <p style={styles.muted}>Failed to load data</p>
        ) : (
          <>
            {/* Stats */}
            <div style={styles.stats}>
              <div style={styles.statCard}>
                <p style={styles.statNum}>{summary.total_students}</p>
                <p>Students</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statNum}>{summary.total_teachers}</p>
                <p>Teachers</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statNum}>{summary.total_subjects}</p>
                <p>Subjects</p>
              </div>
              <div style={styles.statCard}>
                <p style={{ ...styles.statNum, color: "#ef4444" }}>
                  {summary.student_summary.filter((s) => s.alert).length}
                </p>
                <p>At Risk</p>
              </div>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
              {["students", "teachers"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...styles.tab,
                    background: activeTab === tab ? "#4f46e5" : "#e5e7eb",
                    color: activeTab === tab ? "#fff" : "#374151",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Students */}
            {activeTab === "students" && (
              <div style={styles.card}>
                {summary.student_summary.map((s) => {
                  const st = statusBadge(s);

                  return (
                    <div key={s.student_id} style={styles.row}>
                      <div>
                        <p style={styles.name}>{s.student_name}</p>
                        <p style={styles.email}>{s.email}</p>
                      </div>

                      <div style={styles.rowRight}>
                        <span style={{
                          ...styles.badge,
                          background: st.bg,
                          color: st.color,
                          border: `1px solid ${st.border}`,
                        }}>
                          {st.label}
                        </span>

                        <button
                          style={{
                            ...styles.delete,
                            background:
                              confirmDelete === s.student_id
                                ? "#ef4444"
                                : "#fee2e2",
                            color:
                              confirmDelete === s.student_id
                                ? "#fff"
                                : "#dc2626",
                          }}
                          onClick={() =>
                            handleDelete(s.student_id, s.student_name)
                          }
                        >
                          {confirmDelete === s.student_id ? "Confirm" : "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Teachers */}
            {activeTab === "teachers" && (
              <div style={styles.card}>
                {teachers.map((t) => (
                  <div key={t.id} style={styles.row}>
                    <div>
                      <p style={styles.name}>{t.name}</p>
                      <p style={styles.email}>{t.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", height: "100vh", background: "#f1f5f9" },

  sidebar: {
    width: "240px",
    background: "#0f172a",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },

  brand: { fontSize: "20px", marginBottom: "30px" },

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

  main: { flex: 1, padding: "30px", overflowY: "auto" },

  title: { marginBottom: "20px" },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },

  statCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
  },

  statNum: { fontSize: "24px", fontWeight: "600", color: "#4f46e5" },

  tabs: { display: "flex", gap: "10px", marginBottom: "15px" },

  tab: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  rowRight: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  name: { margin: 0, fontWeight: "500" },
  email: { margin: 0, fontSize: "12px", color: "#64748b" },

  badge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  delete: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  toast: {
    background: "#dbeafe",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  muted: { color: "#9ca3af" },
};