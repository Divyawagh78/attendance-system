import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      if (res.data.length === 0) setMessage("No records found for this subject");
      else setMessage("");
    } catch {
      setMessage("Failed to load report");
    }
  };

  const exportToExcel = () => {
    if (records.length === 0) return;
    const data = records.map((r) => ({
      "Student Name": r.student_name,
      "Email": r.email,
      "Date": r.date,
      "Status": r.is_present ? "Present" : "Absent",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `${selectedSubjectName}_attendance.xlsx`);
  };

  const exportToCSV = () => {
    if (records.length === 0) return;
    const headers = ["Student Name", "Email", "Date", "Status"];
    const rows = records.map((r) => [
      r.student_name,
      r.email,
      r.date,
      r.is_present ? "Present" : "Absent",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, `${selectedSubjectName}_attendance.csv`);
  };

  const presentCount = records.filter((r) => r.is_present).length;
  const absentCount = records.filter((r) => !r.is_present).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Attendance Report</h2>
        <button style={styles.backBtn} onClick={() => navigate("/teacher")}>Back</button>
      </div>

      <div style={styles.card}>
        <select style={styles.input} value={selectedSubject} onChange={handleSubjectChange}>
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      {records.length > 0 && (
        <>
          <div style={styles.summaryRow}>
            <span style={styles.presentBadge}>Present: {presentCount}</span>
            <span style={styles.absentBadge}>Absent: {absentCount}</span>
            <span style={styles.totalBadge}>Total: {records.length}</span>
            <div style={styles.exportBtns}>
              <button style={styles.csvBtn} onClick={exportToCSV}>Export CSV</button>
              <button style={styles.excelBtn} onClick={exportToExcel}>Export Excel</button>
            </div>
          </div>

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
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9fafb" : "#fff" }}>
                    <td style={styles.td}>{r.student_name}</td>
                    <td style={styles.td}>{r.email}</td>
                    <td style={styles.td}>{r.date}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: r.is_present ? "#f0fdf4" : "#fef2f2",
                        color: r.is_present ? "#10b981" : "#ef4444",
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
    </div>
  );
}

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", padding: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "22px", color: "#1a1a2e" },
  backBtn: { padding: "8px 16px", backgroundColor: "#6b7280", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  card: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  input: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" },
  summaryRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", flexWrap: "wrap" },
  presentBadge: { padding: "6px 16px", backgroundColor: "#f0fdf4", color: "#10b981", borderRadius: "20px", fontWeight: "600", fontSize: "14px" },
  absentBadge: { padding: "6px 16px", backgroundColor: "#fef2f2", color: "#ef4444", borderRadius: "20px", fontWeight: "600", fontSize: "14px" },
  totalBadge: { padding: "6px 16px", backgroundColor: "#eff6ff", color: "#3b82f6", borderRadius: "20px", fontWeight: "600", fontSize: "14px" },
  exportBtns: { marginLeft: "auto", display: "flex", gap: "8px" },
  csvBtn: { padding: "8px 16px", backgroundColor: "#6b7280", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
  excelBtn: { padding: "8px 16px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: "13px", color: "#6b7280", borderBottom: "1px solid #e5e7eb" },
  td: { padding: "10px 12px", fontSize: "14px", color: "#1a1a2e" },
  statusBadge: { padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "500" },
  message: { backgroundColor: "#eff6ff", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", color: "#1d4ed8" },
};