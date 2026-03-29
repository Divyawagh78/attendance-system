import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSubjects, getAllStudents, bulkMarkAttendance } from "../services/api";

export default function BulkAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

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

  const toggleAttendance = (id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async () => {
    if (!selectedSubject || !date) {
      setMessage("Select subject and date");
      return;
    }

    const attendanceList = students.map((s) => ({
      student_id: s.id,
      is_present: attendance[s.id],
    }));

    try {
      await bulkMarkAttendance(selectedSubject, date, attendanceList);
      setMessage("Attendance submitted successfully");
    } catch {
      setMessage("Failed to submit attendance");
    }
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = students.length - presentCount;

  const navItems = [
    { label: "Dashboard", path: "/teacher" },
    { label: "Attendance Report", path: "/attendance-report" },
    { label: "Bulk Attendance", path: "/bulk-attendance" },
    { label: "Leave Requests", path: "/leave-management" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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
              backgroundColor:
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
        <h2 style={styles.title}>Bulk Attendance</h2>

        {message && <div style={styles.toast}>{message}</div>}

        {/* Controls */}
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
            type="date"
            style={styles.input}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <span style={styles.present}>Present: {presentCount}</span>
          <span style={styles.absent}>Absent: {absentCount}</span>
        </div>

        {/* Student List */}
        <div style={styles.card}>
          {students.length === 0 ? (
            <p style={styles.muted}>No students found</p>
          ) : (
            students.map((s) => (
              <div key={s.id} style={styles.row}>
                <div>
                  <p style={styles.name}>{s.name}</p>
                  <p style={styles.email}>{s.email}</p>
                </div>

                <button
                  style={{
                    ...styles.toggle,
                    background: attendance[s.id] ? "#10b981" : "#ef4444",
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
          <button style={styles.submit} onClick={handleSubmit}>
            Submit Attendance
          </button>
        )}
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    background: "#f1f5f9",
    fontFamily: "Inter, sans-serif",
  },

  sidebar: {
    width: "240px",
    background: "#0f172a",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },

  brand: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "30px",
  },

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

  main: {
    flex: 1,
    padding: "30px",
    overflowY: "auto",
  },

  title: {
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  summary: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  present: {
    background: "#dcfce7",
    color: "#16a34a",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  absent: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  name: {
    margin: 0,
    fontWeight: "500",
  },

  email: {
    margin: 0,
    fontSize: "12px",
    color: "#64748b",
  },

  toggle: {
    padding: "8px 16px",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  submit: {
    width: "100%",
    padding: "14px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    cursor: "pointer",
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