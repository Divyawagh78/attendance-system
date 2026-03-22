import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const res = await loginUser(formData);
   localStorage.setItem("token", res.data.access_token);
localStorage.setItem("role", res.data.role);
localStorage.setItem("user_id", res.data.user_id);

      if (res.data.role === "teacher") {
  navigate("/teacher");
} else if (res.data.role === "admin") {
  navigate("/admin");
} else {
  navigate("/student");
}
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Attendance System</h2>
        <p style={styles.subtitle}>Login to continue</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">
            Login
          </button>
       </form>

        <p style={styles.registerText}>
          Don't have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/register")}>Register here</span>
        </p>
      </div>
    </div>
  );
}
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    margin: "0 0 4px",
    fontSize: "24px",
    color: "#1a1a2e",
  },
  subtitle: {
    margin: "0 0 24px",
    color: "#888",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "12px",
  },
  
  registerText: { marginTop: "16px", fontSize: "13px", color: "#666", textAlign: "center" },
  link: { color: "#4f46e5", cursor: "pointer", fontWeight: "500" },
};