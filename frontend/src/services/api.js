import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (formData) => API.post("/auth/login", formData);
export const registerUser = (data) => API.post("/auth/register", data);
export const getSubjects = () => API.get("/subjects/");
export const createSubject = (data) => API.post("/subjects/", data);
export const markAttendance = (data) => API.post("/attendance/mark", data);
export const getStudentAttendance = (studentId) => API.get(`/attendance/student/${studentId}`);
export const getAttendancePercentage = (studentId, subjectId) => API.get(`/attendance/percentage/${studentId}/${subjectId}`);

export const getAllStudents = () => API.get("/attendance/students");
export const bulkMarkAttendance = (subjectId, date, attendanceList) =>
  API.post(`/attendance/bulk-mark?subject_id=${subjectId}&date=${date}`, attendanceList, {
    headers: { "Content-Type": "application/json" }
  });
 export const getAttendanceReport = (subjectId) => API.get(`/attendance/report/${subjectId}`);
 export const getAdminSummary = () => API.get("/attendance/admin/summary");
 export const applyLeave = (data) => API.post("/leave/apply", data);
export const getMyLeaveRequests = () => API.get("/leave/my-requests");
export const getPendingLeaves = () => API.get("/leave/pending");
export const actionLeave = (leaveId, action) => API.put(`/leave/action/${leaveId}?action=${action}`);
export const enrollInSubject = (subjectId) => API.post("/enrollments/enroll", { subject_id: subjectId });
export const unenrollFromSubject = (subjectId) => API.delete(`/enrollments/unenroll/${subjectId}`);
export const getMySubjects = () => API.get("/enrollments/my-subjects");
export const getEnrolledStudents = (subjectId) => API.get(`/enrollments/subject/${subjectId}/students`);
export const getAllEnrollments = () => API.get("/enrollments/all");
export const deleteStudent = (studentId) => API.delete(`/attendance/admin/delete-student/${studentId}`);
export const getAllTeachers = () => API.get("/attendance/admin/teachers");