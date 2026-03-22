import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects, getAttendancePercentage } from "../services/api";

export default function StudentDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const studentId = localStorage.getItem("user_id");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const subRes = await getSubjects();
      setSubjects(subRes.data);

      const percentages = await Promise.all(
        subRes.data.map((s) =>
          getAttendancePercentage(studentId, s.id)
            .then((res) => ({ subject: s.name, ...res.data }))
            .catch(() => ({ subject: s.name, percentage: 0, present: 0, total_classes: 0, alert: false }))
        )
      );
      setAttendanceData(percentages);
    } catch {
      console.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Student Dashboard</h2>
		<button style={styles.leaveBtn} onClick={() => navigate("/leave-request")}>Apply Leave</button>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      {loading ? (
        <p style={styles.muted}>Loading...</p>
      ) : attendanceData.length === 0 ? (
        <p style={styles.muted}>No attendance records found.</p>
      ) : (
        attendanceData.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.card,
              borderLeft: `4px solid ${item.alert ? "#ef4444" : "#10b981"}`,
            }}
          >
            <div style={styles.cardHeader}>
              <h3 style={styles.subjectName}>{item.subject}</h3>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: item.alert ? "#fef2f2" : "#f0fdf4",
                  color: item.alert ? "#ef4444" : "#10b981",
                }}
              >
                {item.percentage}%
              </span>
            </div>
            <p style={styles.detail}>
              Present: {item.present} / {item.total_classes} classes
            </p>
            {item.alert && (
              <p style={styles.alertText}>⚠ Attendance below 75% — at risk</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "0 auto", padding: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "22px", color: "#1a1a2e" },
  logoutBtn: { padding: "8px 16px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  card: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  subjectName: { fontSize: "16px", color: "#1a1a2e" },
  badge: { padding: "4px 12px", borderRadius: "20px", fontWeight: "600", fontSize: "14px" },
  detail: { fontSize: "13px", color: "#6b7280" },
  alertText: { color: "#ef4444", fontSize: "13px", marginTop: "6px", fontWeight: "500" },
  muted: { color: "#9ca3af", fontSize: "14px" },
  leaveBtn: { padding: "8px 16px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
};