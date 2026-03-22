import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminSummary } from "../services/api";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminSummary()
      .then((res) => setSummary(res.data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      {loading ? (
        <p style={styles.muted}>Loading...</p>
      ) : !summary ? (
        <p style={styles.muted}>Failed to load data</p>
      ) : (
        <>
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <p style={styles.statNumber}>{summary.total_students}</p>
              <p style={styles.statLabel}>Students</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statNumber}>{summary.total_teachers}</p>
              <p style={styles.statLabel}>Teachers</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statNumber}>{summary.total_subjects}</p>
              <p style={styles.statLabel}>Subjects</p>
            </div>
            <div style={styles.statCard}>
              <p style={{ ...styles.statNumber, color: "#ef4444" }}>
                {summary.student_summary.filter((s) => s.alert).length}
              </p>
              <p style={styles.statLabel}>At Risk</p>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Student Attendance Overview</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Present</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Percentage</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {summary.student_summary.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ ...styles.td, textAlign: "center", color: "#9ca3af" }}>
                      No attendance records yet
                    </td>
                  </tr>
                ) : (
                  summary.student_summary.map((s, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9fafb" : "#fff" }}>
                      <td style={styles.td}>{s.student_name}</td>
                      <td style={styles.td}>{s.email}</td>
                      <td style={styles.td}>{s.present}</td>
                      <td style={styles.td}>{s.total_classes}</td>
                      <td style={styles.td}>{s.percentage}%</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: s.alert ? "#fef2f2" : s.total_classes === 0 ? "#f3f4f6" : "#f0fdf4",
                          color: s.alert ? "#ef4444" : s.total_classes === 0 ? "#9ca3af" : "#10b981",
                        }}>
                          {s.total_classes === 0 ? "No Data" : s.alert ? "At Risk" : "Good"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "900px", margin: "0 auto", padding: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "22px", color: "#1a1a2e" },
  logoutBtn: { padding: "8px 16px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" },
  statCard: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  statNumber: { fontSize: "32px", fontWeight: "600", color: "#4f46e5", margin: "0 0 4px" },
  statLabel: { fontSize: "13px", color: "#6b7280", margin: 0 },
  card: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  sectionTitle: { fontSize: "16px", color: "#374151", marginBottom: "16px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: "13px", color: "#6b7280", borderBottom: "1px solid #e5e7eb" },
  td: { padding: "10px 12px", fontSize: "14px", color: "#1a1a2e" },
  badge: { padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "500" },
  muted: { color: "#9ca3af", fontSize: "14px" },
};