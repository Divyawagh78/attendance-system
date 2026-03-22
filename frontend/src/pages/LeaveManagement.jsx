import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingLeaves, actionLeave } from "../services/api";

export default function LeaveManagement() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    getPendingLeaves().then((res) => setRequests(res.data)).catch(() => {});
  };

  const handleAction = async (leaveId, action) => {
    try {
      await actionLeave(leaveId, action);
      setMessage(`Leave request ${action} successfully`);
      loadRequests();
    } catch {
      setMessage("Failed to update leave request");
    }
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const statusColor = (status) => {
    if (status === "approved") return { bg: "#f0fdf4", color: "#10b981" };
    if (status === "rejected") return { bg: "#fef2f2", color: "#ef4444" };
    return { bg: "#fffbeb", color: "#f59e0b" };
  };

  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Leave Management</h2>
          {pending > 0 && (
            <p style={styles.pendingNote}>⚠ {pending} pending request{pending > 1 ? "s" : ""} awaiting review</p>
          )}
        </div>
        <button style={styles.backBtn} onClick={() => navigate("/teacher")}>Back</button>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.filterRow}>
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            style={{ ...styles.filterBtn, backgroundColor: filter === f ? "#4f46e5" : "#f3f4f6", color: filter === f ? "#fff" : "#374151" }}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && pending > 0 && (
              <span style={styles.badge}>{pending}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.card}>
          <p style={styles.muted}>No {filter === "all" ? "" : filter} requests found</p>
        </div>
      ) : (
        filtered.map((r) => {
          const sc = statusColor(r.status);
          return (
            <div key={r.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.studentName}>{r.student_name}</p>
                  <p style={styles.studentEmail}>{r.email}</p>
                </div>
                <span style={{ ...styles.statusBadge, backgroundColor: sc.bg, color: sc.color }}>
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Subject:</span>
                <span style={styles.detailValue}>{r.subject_name}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Date:</span>
                <span style={styles.detailValue}>{r.date}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Reason:</span>
                <span style={styles.detailValue}>{r.reason}</span>
              </div>

              {r.status === "pending" && (
                <div style={styles.actionRow}>
                  <button style={styles.approveBtn} onClick={() => handleAction(r.id, "approved")}>
                    Approve
                  </button>
                  <button style={styles.rejectBtn} onClick={() => handleAction(r.id, "rejected")}>
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "0 auto", padding: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { fontSize: "22px", color: "#1a1a2e", margin: "0 0 4px" },
  pendingNote: { fontSize: "13px", color: "#f59e0b", margin: 0 },
  backBtn: { padding: "8px 16px", backgroundColor: "#6b7280", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  filterRow: { display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" },
  filterBtn: { padding: "8px 16px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500", position: "relative" },
  badge: { backgroundColor: "#ef4444", color: "#fff", borderRadius: "10px", padding: "1px 6px", fontSize: "11px", marginLeft: "6px" },
  card: { backgroundColor: "#fff", padding: "16px", borderRadius: "12px", marginBottom: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
  studentName: { fontSize: "15px", fontWeight: "500", color: "#1a1a2e", margin: "0 0 2px" },
  studentEmail: { fontSize: "12px", color: "#9ca3af", margin: 0 },
  statusBadge: { padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "500" },
  detailRow: { display: "flex", gap: "8px", marginBottom: "6px", fontSize: "14px" },
  detailLabel: { color: "#6b7280", minWidth: "60px" },
  detailValue: { color: "#1a1a2e" },
  actionRow: { display: "flex", gap: "10px", marginTop: "12px" },
  approveBtn: { padding: "8px 20px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
  rejectBtn: { padding: "8px 20px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
  message: { backgroundColor: "#eff6ff", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", color: "#1d4ed8" },
  muted: { color: "#9ca3af", fontSize: "14px" },
};