import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getSubjects,
  createSubject,
  markAttendance,
  getAttendancePercentage,
  getAllStudents,
} from "../services/api";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState("");
  const [isPresent, setIsPresent] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSubjects();
    loadStudents();
  }, []);

  const loadSubjects = async () => {
    const res = await getSubjects();
    setSubjects(res.data);
  };

  const loadStudents = async () => {
    const res = await getAllStudents();
    setStudents(res.data);
  };

  const handleCreateSubject = async () => {
    if (!newSubject.trim()) return;
    await createSubject({ name: newSubject });
    setNewSubject("");
    loadSubjects();
  };

  const handleMarkAttendance = async () => {
    if (!selectedStudent || !selectedSubject || !date) {
      setMessage("Fill all fields");
      return;
    }
    await markAttendance({
      student_id: parseInt(selectedStudent),
      subject_id: parseInt(selectedSubject),
      date,
      is_present: isPresent,
    });
    setMessage("Attendance marked");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/teacher" },
    { label: "Attendance Report", path: "/attendance-report" },
    { label: "Bulk Attendance", path: "/bulk-attendance" },
    { label: "Leave Requests", path: "/leave-management" },
  ];

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
        <div style={styles.header}>
          <h2>Teacher Dashboard</h2>
        </div>

        {message && <div style={styles.toast}>{message}</div>}

        {/* Create Subject */}
        <div style={styles.card}>
          <h3>Create Subject</h3>
          <div style={styles.flex}>
            <input
              style={styles.input}
              placeholder="Subject name"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <button style={styles.primaryBtn} onClick={handleCreateSubject}>
              Create
            </button>
          </div>
        </div>

        {/* Mark Attendance */}
        <div style={styles.card}>
          <h3>Mark Attendance</h3>

          <select
            style={styles.input}
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
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
            type="date"
            style={styles.input}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div style={styles.flex}>
            <label><input type="radio" checked={isPresent} onChange={() => setIsPresent(true)} /> Present</label>
            <label><input type="radio" checked={!isPresent} onChange={() => setIsPresent(false)} /> Absent</label>
          </div>

          <button style={styles.primaryBtn} onClick={handleMarkAttendance}>
            Mark Attendance
          </button>
        </div>
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    fontFamily: "Inter, sans-serif",
    background: "#f1f5f9",
  },

  sidebar: {
    width: "240px",
    background: "#0f172a",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },

  brand: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "30px",
  },

  navItem: {
    padding: "12px",
    marginBottom: "8px",
    border: "none",
    color: "#fff",
    textAlign: "left",
    borderRadius: "8px",
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

  header: {
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

  primaryBtn: {
    padding: "10px 16px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  flex: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  toast: {
    background: "#dbeafe",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
};