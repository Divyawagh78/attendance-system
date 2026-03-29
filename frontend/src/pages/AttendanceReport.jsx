import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSubjects, getAttendanceReport } from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AttendanceReport() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubjectName, setSelectedSubjectName] = useState("");
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getSubjects().then((res) => setSubjects(res.data)).catch(() => {});
  }, []);

  const handleSubjectChange = async (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedSubject(id);
    setSelectedSubjectName(name);

    if (!id) return;

    try {
      const res = await getAttendanceReport(id);
      setRecords(res.data);
      setMessage(res.data.length === 0 ? "No records found" : "");
    } catch {
      setMessage("Failed to load report");
    }
  };

  const exportToExcel = () => {
    if (!records.length) return;
    const data = records.map((r) => ({
      "Student Name": r.student_name,
      Email: r.email,
      Date: r.date,
      Status: r.is_present ? "Present" : "Absent",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `${selectedSubjectName}_attendance.xlsx`);
  };

  const exportToCSV = () => {
    if (!records.length) return;
    const headers = ["Student Name", "Email", "Date", "Status"];
    const rows = records.map((r) => [
      r.student_name,
      r.email,
      r.date,
      r.is_present ? "Present" : "Absent",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    saveAs(new Blob([csv]), `${selectedSubjectName}_attendance.csv`);
  };

  const presentCount = records.filter((r) => r.is_present).length;
  const absentCount = records.filter((r) => !r.is_present).length;

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
        <h2 style={styles.title}>Attendance Report</h2>

        <div style={styles.card}>
          <select
            style={styles.input}
            value={selectedSubject}
            onChange={handleSubjectChange}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {message && <div style={styles.toast}>{message}</div>}

        {records.length > 0 && (
          <>
            {/* Summary */}
            <div style={styles.summary}>
              <span style={styles.present}>Present: {presentCount}</span>
              <span style={styles.absent}>Absent: {absentCount}</span>
              <span style={styles.total}>Total: {records.length}</span>

              <div style={styles.actions}>
                <button style={styles.btnGray} onClick={exportToCSV}>CSV</button>
                <button style={styles.btnGreen} onClick={exportToExcel}>Excel</button>
              </div>
            </div>

            {/* Table */}
            <div style={styles.card}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{r.student_name}</td>
                      <td style={styles.td}>{r.email}</td>
                      <td style={styles.td}>{r.date}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: r.is_present ? "#dcfce7" : "#fee2e2",
                          color: r.is_present ? "#16a34a" : "#dc2626",
                        }}>
                          {r.is_present ? "Present" : "Absent"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
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
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  summary: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
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

  total: {
    background: "#dbeafe",
    color: "#2563eb",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  actions: {
    marginLeft: "auto",
    display: "flex",
    gap: "8px",
  },

  btnGray: {
    padding: "8px 12px",
    background: "#6b7280",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  btnGreen: {
    padding: "8px 12px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "10px",
    borderBottom: "1px solid #e5e7eb",
    color: "#6b7280",
  },

  td: {
    padding: "10px",
  },

  badge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
  },

  toast: {
    background: "#dbeafe",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
};