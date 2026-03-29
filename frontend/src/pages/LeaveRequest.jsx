import { useState, useEffect } from "react";
import { getSubjects, applyLeave, getMyLeaveRequests } from "../services/api";
import Sidebar from "../components/Sidebar";

export default function LeaveRequest() {
  const [subjects, setSubjects] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [form, setForm] = useState({ subject_id: "", date: "", reason: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSubjects().then((res) => setSubjects(res.data)).catch(() => {});
    loadMyRequests();
  }, []);

  const loadMyRequests = () => {
    getMyLeaveRequests().then((res) => setMyRequests(res.data)).catch(() => {});
  };

  const handleSubmit = async () => {
    if (!form.subject_id || !form.date || !form.reason.trim()) {
      setMessage("Fill all fields");
      return;
    }

    try {
      await applyLeave({
        subject_id: parseInt(form.subject_id),
        date: form.date,
        reason: form.reason,
      });

      setMessage("Leave submitted");
      setForm({ subject_id: "", date: "", reason: "" });
      loadMyRequests();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to submit");
    }
  };

  const statusColor = (status) => {
    if (status === "approved")
      return { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" };

    if (status === "rejected")
      return { bg: "#fef2f2", color: "#7f1d1d", border: "#fecaca" };

    return { bg: "#fffbeb", color: "#78350f", border: "#fde68a" };
  };

  return (
    <Sidebar>
      <div style={styles.wrapper}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Leave Requests</h2>
            <p style={styles.subtitle}>Apply and track your leave status</p>
          </div>
        </div>

        {message && <div style={styles.toast}>{message}</div>}

        <div style={styles.grid}>
          
          {/* LEFT: FORM */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Apply Leave</h3>

            <select
              style={styles.input}
              value={form.subject_id}
              onChange={(e) =>
                setForm({ ...form, subject_id: e.target.value })
              }
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <input
              type="date"
              style={styles.input}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <textarea
              style={styles.textarea}
              placeholder="Reason (medical, emergency, etc.)"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />

            <button style={styles.primaryBtn} onClick={handleSubmit}>
              Submit Application
            </button>
          </div>

          {/* RIGHT: HISTORY */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>My Applications</h3>

            {myRequests.length === 0 ? (
              <p style={styles.muted}>No applications yet</p>
            ) : (
              myRequests.map((r) => {
                const sc = statusColor(r.status);

                return (
                  <div key={r.id} style={styles.requestCard}>
                    
                    <div style={styles.requestHeader}>
                      <span style={styles.date}>{r.date}</span>

                      <span
                        style={{
                          ...styles.badge,
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        {r.status}
                      </span>
                    </div>

                    <p style={styles.reason}>{r.reason}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
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
    marginBottom: "20px",
  },

  title: {
    margin: 0,
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  sectionTitle: {
    marginBottom: "12px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    resize: "vertical",
  },

  primaryBtn: {
    width: "100%",
    padding: "12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  requestCard: {
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "10px",
    marginBottom: "10px",
  },

  requestHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
  },

  date: {
    fontSize: "13px",
    fontWeight: "500",
  },

  reason: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },

  badge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
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