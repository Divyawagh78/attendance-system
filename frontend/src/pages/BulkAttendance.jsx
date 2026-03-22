import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects, getAllStudents, bulkMarkAttendance } from "../services/api";

export default function BulkAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [subRes, stuRes] = await Promise.all([getSubjects(), getAllStudents()]);
    setSubjects(subRes.data);
    setStudents(stuRes.data);
    const initial = {};
    stuRes.data.forEach((s) => (initial[s.id] = false));
    setAttendance(initial);
  };

  const toggleAttendance = (studentId) => {
    setAttendance((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handleSubmit = async () => {
    if (!selectedSubject || !date) {
      setMessage("Please select subject and date");
      return;
    }
    const attendanceList = students.map((s) => ({
      student_id: s.id,
      is_present: attendance[s.id],
    }));
    try {
      await bulkMarkAttendance(selectedSubject, date, attendanceList);
      setMessage("Attendance marked successfully for all students");
    } catch {
      setMessage("Failed to mark attendance");
    }
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = students.length - presentCount;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Bulk Attendance</h2>
        <button style={styles.backBtn} onClick={() => navigate("/teacher")}>Back</button>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.card}>
        <select
          style={styles.input}
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input
          style={styles.input}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div style={styles.summary}>
        <span style={styles.presentBadge}>Present: {presentCount}</span>
        <span style={styles.absentBadge}>Absent: {absentCount}</span>
      </div>

      <div style={styles.card}>
        {students.length === 0 ? (
          <p style={styles.muted}>No students registered yet</p>
        ) : (
          students.map((s) => (
            <div key={s.id} style={styles.studentRow}>
              <div>
                <p style={styles.studentName}>{s.name}</p>
                <p style={styles.studentEmail}>{s.email}</p>
              </div>
              <button
                style={{
                  ...styles.toggleBtn,
                  backgroundColor: attendance[s.id] ? "#10b981" : "#ef4444",
                }}
                onClick={() => toggleAttendance(s.id)}
              >
                {attendance[s.id] ? "Present" : "Absent"}
              </button>
            </div>
          ))
        )}
      </div>

      {students.length > 0 && (
        <button style={styles.submitBtn} onClick={handleSubmit}>
          Submit Attendance
        </button>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "0 auto", padding: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "22px", color: "#1a1a2e" },
  backBtn: { padding: "8px 16px", backgroundColor: "#6b7280", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  card: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  input: { width: "100%", padding: "10px 12px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" },
  summary: { display: "flex", gap: "12px", marginBottom: "16px" },
  presentBadge: { padding: "6px 16px", backgroundColor: "#f0fdf4", color: "#10b981", borderRadius: "20px", fontWeight: "600", fontSize: "14px" },
  absentBadge: { padding: "6px 16px", backgroundColor: "#fef2f2", color: "#ef4444", borderRadius: "20px", fontWeight: "600", fontSize: "14px" },
  studentRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f3f4f6" },
  studentName: { fontSize: "14px", fontWeight: "500", color: "#1a1a2e", margin: 0 },
  studentEmail: { fontSize: "12px", color: "#9ca3af", margin: "2px 0 0" },
  toggleBtn: { padding: "8px 20px", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500" },
  submitBtn: { width: "100%", padding: "14px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
  message: { backgroundColor: "#eff6ff", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", color: "#1d4ed8" },
  muted: { color: "#9ca3af", fontSize: "14px" },
};