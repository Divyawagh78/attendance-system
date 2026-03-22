import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects, applyLeave, getMyLeaveRequests } from "../services/api";

export default function LeaveRequest() {
  const [subjects, setSubjects] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [form, setForm] = useState({ subject_id: "", date: "", reason: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getSubjects().then((res) => setSubjects(res.data)).catch(() => {});
    loadMyRequests();
  }, []);

  const loadMyRequests = () => {
    getMyLeaveRequests().then((res) => setMyRequests(res.data)).catch(() => {});
  };

  const handleSubmit = async () => {
    if (!form.subject_id || !form.date || !form.reason.trim()) {
      setMessage("Please fill all fields");
      return;
    }
    try {
      await applyLeave({
        subject_id: parseInt(form.subject_id),
        date: form.date,
        reason: form.reason,
      });
      setMessage("Leave application submitted successfully");
      setForm({ subject_id: "", date: "", reason: "" });
      loadMyRequests();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to submit leave");
    }
  };

  const statusColor = (status) => {
    if (status === "approved") return { bg: "#f0fdf4", color: "#10b981" };
    if (status === "rejected") return { bg: "#fef2f2", color: "#ef4444" };
    return { bg: "#fffbeb", color: "#f59e0b" };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Apply for Leave</h2>
        <button style={styles.backBtn} onClick={() => navigate("/student")}>Back</button>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>New Leave Application</h3>
        <select
          style={styles.input}
          value={form.subject_id}
          onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input
          style={styles.input}
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <textarea
          style={styles.textarea}
          placeholder="Reason for leave (medical, family emergency, etc.)"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          rows={4}
        />
        <button style={styles.btn} onClick={handleSubmit}>Submit Application</button>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>My Leave Applications</h3>
        {myRequests.length === 0 ? (
          <p style={styles.muted}>No applications submitted yet</p>
        ) : (
          myRequests.map((r) => {
            const sc = statusColor(r.status);
            return (
              <div key={r.id} style={styles.requestItem}>
                <div style={styles.requestHeader}>
                  <span style={styles.requestDate}>{r.date}</span>
                  <span style={{ ...styles.statusBadge, backgroundColor: sc.bg, color: sc.color }}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                </div>
                <p style={styles.requestReason}>{r.reason}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "0 auto", padding: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "22px", color: "#1a1a2e" },
  backBtn: { padding: "8px 16px", backgroundColor: "#6b7280", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  card: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  sectionTitle: { fontSize: "16px", color: "#374151", marginBottom: "16px" },
  input: { width: "100%", padding: "10px 12px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px 12px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box", resize: "vertical" },
  btn: { width: "100%", padding: "12px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", cursor: "pointer" },
  message: { backgroundColor: "#eff6ff", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", color: "#1d4ed8" },
  requestItem: { padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px", marginBottom: "10px" },
  requestHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" },
  requestDate: { fontSize: "13px", fontWeight: "500", color: "#374151" },
  statusBadge: { padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "500" },
  requestReason: { fontSize: "13px", color: "#6b7280", margin: 0 },
  muted: { color: "#9ca3af", fontSize: "14px" },
};