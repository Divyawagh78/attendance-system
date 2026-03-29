import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAttendancePercentage, getMySubjects } from "../services/api";
import Sidebar from "../components/Sidebar";

export default function StudentDashboard() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const studentId = localStorage.getItem("user_id");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const mySubRes = await getMySubjects();
      const enrolledSubjects = mySubRes.data;

      if (enrolledSubjects.length === 0) {
        setAttendanceData([]);
        setLoading(false);
        return;
      }

      const percentages = await Promise.all(
        enrolledSubjects.map((s) =>
          getAttendancePercentage(studentId, s.id)
            .then((res) => ({ subject: s.name, ...res.data }))
            .catch(() => ({
              subject: s.name,
              percentage: 0,
              present: 0,
              total_classes: 0,
              alert: false,
            }))
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
    navigate("/login");
  };

  return (
    <Sidebar>
      <div style={styles.wrapper}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Student Dashboard</h2>
            <p style={styles.subtitle}>Track your attendance across subjects</p>
          </div>

          <div style={styles.actions}>
            <button style={styles.primaryBtn} onClick={() => navigate("/leave-request")}>
              Apply Leave
            </button>

            <button style={styles.successBtn} onClick={() => navigate("/enroll")}>
              My Subjects
            </button>

            <button style={styles.dangerBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p style={styles.muted}>Loading...</p>
        ) : attendanceData.length === 0 ? (
          <p style={styles.muted}>No attendance data available</p>
        ) : (
          <div style={styles.grid}>
            {attendanceData.map((item, index) => {
              const isRisk = item.alert;

              return (
                <div key={index} style={styles.card}>
                  
                  {/* Top */}
                  <div style={styles.cardHeader}>
                    <h3 style={styles.subject}>{item.subject}</h3>

                    <span
                      style={{
                        ...styles.badge,
                        background: isRisk ? "#fee2e2" : "#dcfce7",
                        color: isRisk ? "#dc2626" : "#16a34a",
                        border: `1px solid ${isRisk ? "#fecaca" : "#a7f3d0"}`,
                      }}
                    >
                      {item.percentage}%
                    </span>
                  </div>

                  {/* Stats */}
                  <p style={styles.detail}>
                    {item.present} / {item.total_classes} classes attended
                  </p>

                  {/* Alert */}
                  {isRisk && (
                    <div style={styles.alertBox}>
                      ⚠ Attendance below 75% — risk of shortage
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Sidebar>
  );
}

const styles = {
  wrapper: {
    padding: "30px",
    background: "#f1f5f9",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    flexWrap: "wrap",
    gap: "10px",
  },

  title: {
    margin: 0,
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },

  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  successBtn: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  dangerBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
  },

  card: {
    background: "#fff",
    padding: "18px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  subject: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "600",
  },

  badge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  detail: {
    fontSize: "13px",
    color: "#64748b",
  },

  alertBox: {
    marginTop: "10px",
    background: "#fef2f2",
    color: "#dc2626",
    padding: "8px",
    borderRadius: "8px",
    fontSize: "12px",
  },

  muted: {
    color: "#9ca3af",
  },
};