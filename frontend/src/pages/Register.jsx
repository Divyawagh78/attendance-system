import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await registerUser(form);
      setSuccess("Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Register as student or teacher</p>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleRegister}>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required	
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
         <select
  style={styles.input}
  name="role"
  value={form.role}
  onChange={handleChange}
>
  <option value="student">Student</option>
  <option value="teacher">Teacher</option>
  <option value="admin">Admin</option>
</select>
          <button style={styles.button} type="submit">Register</button>
        </form>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/")}>Login here</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f2f5" },
  card: { backgroundColor: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" },
  title: { margin: "0 0 4px", fontSize: "24px", color: "#1a1a2e" },
  subtitle: { margin: "0 0 24px", color: "#888", fontSize: "14px" },
  input: { width: "100%", padding: "12px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" },
  button: { width: "100%", padding: "12px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
  error: { color: "red", fontSize: "13px", marginBottom: "12px" },
  success: { color: "green", fontSize: "13px", marginBottom: "12px" },
  loginText: { marginTop: "16px", fontSize: "13px", color: "#666", textAlign: "center" },
  link: { color: "#4f46e5", cursor: "pointer", fontWeight: "500" },
};