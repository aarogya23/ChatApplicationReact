import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  // Google OAuth Login
  const googleLogin = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>

        <button style={styles.googleBtn} onClick={googleLogin}>
          Continue with Google
        </button>

        <p style={styles.text}>
          Don’t have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

/* Inline styles */
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "120px",
    fontFamily: "Arial, sans-serif",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white"
  },
  card: {
    width: "300px",
    padding: "25px",
    background: "#1e293b",
    borderRadius: "10px",
    textAlign: "center"
  },
  googleBtn: {
    width: "100%",
    padding: "10px",
    background: "#4285f4",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "white"
  },
  text: {
    marginTop: "15px"
  },
  link: {
    color: "#38bdf8",
    cursor: "pointer"
  }
};
