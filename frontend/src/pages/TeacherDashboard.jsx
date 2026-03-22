import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSubjects,
  createSubject,
  markAttendance,
  getAttendancePercentage,
  getAllStudents,
} from "../services/api";

export default function TeacherDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState("");
  const [isPresent, setIsPresent] = useState(true);
  const [percentageInfo, setPercentageInfo] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadSubjects();
    loadStudents();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await getSubjects();
      setSubjects(res.data);
    } catch {
      setMessage("Failed to load subjects");
    }
  };

  const loadStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data);
    } catch {
      setMessage("Failed to load students");
    }
  };

  const handleCreateSubject = async () => {
    if (!newSubject.trim()) {
      setMessage("Subject name cannot be empty");
      return;
    }
    try {
      await createSubject({ name: newSubject });
      setNewSubject("");
      setMessage("Subject created successfully");
      loadSubjects();
    } catch {
      setMessage("Failed to create subject");
    }
  };

  const handleMarkAttendance = async () => {
    if (!selectedStudent || !selectedSubject || !date) {
      setMessage("Please fill all fields");
      return;
    }
    try {
      await markAttendance({
        student_id: parseInt(selectedStudent),
        subject_id: parseInt(selectedSubject),
        date,
        is_present: isPresent,
      });
      setMessage("Attendance marked successfully");
    } catch {
      setMessage("Failed to mark attendance");
    }
  };

  const handleCheckPercentage = async () => {
    if (!selectedStudent || !selectedSubject) {
      setMessage("Select student and subject first");
      return;
    }
    try {
      const res = await getAttendancePercentage(selectedStudent, selectedSubject);
      setPercentageInfo(res.data);
      setMessage("");
    } catch {
      setMessage("Failed to fetch percentage");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const atRiskStudents = [];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Teacher Dashboard</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={styles.reportBtn} onClick={() => navigate("/attendance-report")}>View Report</button>
          <button style={styles.bulkBtn} onClick={() => navigate("/bulk-attendance")}>Bulk Attendance</button>
		  <button style={styles.leaveBtn} onClick={() => navigate("/leave-management")}>Leave Requests</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Create Subject</h3>
        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="Subject name"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
          />
          <button style={styles.btn} onClick={handleCreateSubject}>Create</button>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Mark Attendance</h3>

        <select
          style={styles.input}
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.name} — {s.email}</option>
          ))}
        </select>

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

        <div style={styles.row}>
          <label style={styles.label}>
            <input type="radio" checked={isPresent === true} onChange={() => setIsPresent(true)} /> Present
          </label>
          <label style={styles.label}>
            <input type="radio" checked={isPresent === false} onChange={() => setIsPresent(false)} /> Absent
          </label>
        </div>

        <div style={styles.row}>
          <button style={styles.btn} onClick={handleMarkAttendance}>Mark Attendance</button>
          <button style={styles.btnSecondary} onClick={handleCheckPercentage}>Check Percentage</button>
        </div>
      </div>

      {percentageInfo && (
        <div style={{
          ...styles.section,
          backgroundColor: percentageInfo.alert ? "#fff3f3" : "#f0fff4",
          border: `1px solid ${percentageInfo.alert ? "#f87171" : "#34d399"}`,
        }}>
          <h3 style={styles.sectionTitle}>
            Attendance Report
            {percentageInfo.alert && percentageInfo.total_classes >= 10 && (
              <span style={styles.alertBadge}>⚠ At Risk</span>
            )}
          </h3>
          <p>Student: <strong>{students.find(s => s.id === parseInt(selectedStudent))?.name}</strong></p>
          <p>Total Classes: <strong>{percentageInfo.total_classes}</strong></p>
          <p>Present: <strong>{percentageInfo.present}</strong></p>
          <p>Percentage: <strong>{percentageInfo.percentage}%</strong></p>
          {percentageInfo.alert && percentageInfo.total_classes < 10 && (
            <p style={{ color: "#f59e0b", fontSize: "13px", marginTop: "8px" }}>
              ⚠ Below 75% — but fewer than 10 classes held. Monitor closely.
            </p>
          )}
          {percentageInfo.alert && percentageInfo.total_classes >= 10 && (
            <p style={styles.alertText}>⚠ Below 75% — Student at risk of detention</p>
          )}
        </div>
      )}

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>All Subjects</h3>
        {subjects.length === 0 ? (
          <p style={styles.muted}>No subjects yet</p>
        ) : (
          subjects.map((s) => (
            <div key={s.id} style={styles.subjectItem}>
              {s.id}. {s.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "0 auto", padding: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "10px" },
  title: { fontSize: "22px", color: "#1a1a2e" },
  logoutBtn: { padding: "8px 16px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  bulkBtn: { padding: "8px 16px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  reportBtn: { padding: "8px 16px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  section: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  sectionTitle: { fontSize: "16px", marginBottom: "16px", color: "#374151", display: "flex", alignItems: "center", gap: "10px" },
  input: { width: "100%", padding: "10px 12px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" },
  row: { display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" },
  btn: { padding: "10px 20px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
  btnSecondary: { padding: "10px 20px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
  label: { fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" },
  message: { backgroundColor: "#eff6ff", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", color: "#1d4ed8" },
  alertText: { color: "#ef4444", fontWeight: "500", marginTop: "8px" },
  alertBadge: { backgroundColor: "#fef2f2", color: "#ef4444", padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "500" },
  muted: { color: "#9ca3af", fontSize: "14px" },
  subjectItem: { padding: "8px 12px", backgroundColor: "#f9fafb", borderRadius: "6px", marginBottom: "8px", fontSize: "14px" },
  leaveBtn: { padding: "8px 16px", backgroundColor: "#f59e0b", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
};