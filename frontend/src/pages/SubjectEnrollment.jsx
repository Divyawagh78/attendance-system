import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSubjects,
  enrollInSubject,
  unenrollFromSubject,
  getMySubjects,
} from "../services/api";
import Sidebar from "../components/Sidebar";

export default function SubjectEnrollment() {
  const [allSubjects, setAllSubjects] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        getSubjects(),
        getMySubjects(),
      ]);
      setAllSubjects(allRes.data);
      setEnrolledIds(myRes.data.map((s) => s.id));
    } catch {
      setMessage("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (id) => {
    try {
      await enrollInSubject(id);
      setEnrolledIds((prev) => [...prev, id]);
      setMessage("Enrolled successfully");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to enroll");
    }
  };

  const handleUnenroll = async (id) => {
    try {
      await unenrollFromSubject(id);
      setEnrolledIds((prev) => prev.filter((i) => i !== id));
      setMessage("Unenrolled successfully");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to unenroll");
    }
  };

  return (
    <Sidebar>
      <div style={styles.wrapper}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>My Subjects</h2>
            <p style={styles.subtitle}>
              Manage your subject enrollments
            </p>
          </div>

          <span style={styles.summaryBadge}>
            {enrolledIds.length} / {allSubjects.length} Enrolled
          </span>
        </div>

        {message && <div style={styles.toast}>{message}</div>}

        {/* Content */}
        {loading ? (
          <p style={styles.muted}>Loading subjects...</p>
        ) : allSubjects.length === 0 ? (
          <p style={styles.muted}>No subjects available</p>
        ) : (
          <div style={styles.grid}>
            {allSubjects.map((subject) => {
              const isEnrolled = enrolledIds.includes(subject.id);

              return (
                <div key={subject.id} style={styles.card}>
                  
                  {/* Top */}
                  <div style={styles.cardHeader}>
                    <h3 style={styles.subject}>{subject.name}</h3>

                    <span
                      style={{
                        ...styles.status,
                        background: isEnrolled ? "#dcfce7" : "#f1f5f9",
                        color: isEnrolled ? "#16a34a" : "#64748b",
                        border: `1px solid ${
                          isEnrolled ? "#a7f3d0" : "#e2e8f0"
                        }`,
                      }}
                    >
                      {isEnrolled ? "Enrolled" : "Not Enrolled"}
                    </span>
                  </div>

                  {/* Action */}
                  <button
                    style={{
                      ...styles.actionBtn,
                      background: isEnrolled ? "#fee2e2" : "#4f46e5",
                      color: isEnrolled ? "#dc2626" : "#fff",
                    }}
                    onClick={() =>
                      isEnrolled
                        ? handleUnenroll(subject.id)
                        : handleEnroll(subject.id)
                    }
                  >
                    {isEnrolled ? "Unenroll" : "Enroll"}
                  </button>
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

  summaryBadge: {
    background: "#dbeafe",
    color: "#2563eb",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  subject: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "600",
  },

  status: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  actionBtn: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },

  toast: {
    background: "#dbeafe",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  muted: {
    color: "#9ca3af",
  },
};