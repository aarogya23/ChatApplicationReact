import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // NORMAL SIGNUP
  const signup = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/users/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    if (res.ok) {
      alert("Signup successful 🎉");
      navigate("/chat");
    } else {
      alert("Signup failed");
    }
  };

  // GOOGLE OAUTH SIGNUP / LOGIN
  const googleSignup = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create Account</h2>

        <form onSubmit={signup}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button>Create Account</button>
        </form>

        <div style={styles.divider}>OR</div>

        <button style={styles.googleBtn} onClick={googleSignup}>
          Continue with Google
        </button>

        <p onClick={() => navigate("/login")} style={styles.link}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px"
  },
  card: {
    width: "340px",
    padding: "25px",
    background: "#1e293b",
    color: "white",
    borderRadius: "10px"
  },
  divider: {
    textAlign: "center",
    margin: "15px 0",
    color: "#94a3b8"
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
  link: {
    marginTop: "10px",
    cursor: "pointer",
    color: "#38bdf8",
    textAlign: "center"
  }
};
