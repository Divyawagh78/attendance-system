import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import BulkAttendance from "./pages/BulkAttendance";
import AttendanceReport from "./pages/AttendanceReport";
import AdminDashboard from "./pages/AdminDashboard";
import LeaveRequest from "./pages/LeaveRequest";
import LeaveManagement from "./pages/LeaveManagement";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        <Route path="/student" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/bulk-attendance" element={
          <ProtectedRoute allowedRoles={["teacher", "admin"]}>
            <BulkAttendance />
          </ProtectedRoute>
        } />

        <Route path="/attendance-report" element={
          <ProtectedRoute allowedRoles={["teacher", "admin"]}>
            <AttendanceReport />
          </ProtectedRoute>
        } />

        <Route path="/leave-request" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <LeaveRequest />
          </ProtectedRoute>
        } />

        <Route path="/leave-management" element={
          <ProtectedRoute allowedRoles={["teacher", "admin"]}>
            <LeaveManagement />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}