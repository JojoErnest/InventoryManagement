import { useState } from "react";
import LoginPage from "./Pages/LoginPage"; // atau './pages/LoginPage' tergantung struktur folder

function App() {
  const API = "http://localhost:5243";

  const [user, setUser] = useState(localStorage.getItem("username"));
  
  const handleLogin = async (username, password) => {
     try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errMsg = await res.text();
      alert("Login failed: " + errMsg);
      return;
    }

    // kalau OK
      localStorage.setItem("username", username);
      setUser(username);
    } catch (err) {
      console.error(err);
      alert("Server error while login");
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("username"); // hapus sesi
  setUser(null);                       // kembali ke halaman login
  };

   const handleRegister = async (username, password) => {
    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert("Register success! Now you can login.");
      } else {
        const err = await response.text();
        alert("Register failed: " + err);
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Server error during registration.");
    }
  };

  return (
   <>
    {!user ? (
      <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
    ) : (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0.5rem",
            backgroundColor: "#ef4444",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Logout
        </button>

        {/* Isi halaman setelah login */}
        <div className="p-4" style={{ textAlign: "center", marginTop: "4rem" }}>
          Welcome, {user}!
        </div>
      </div>
    )}
  </>
  );
}

export default App;
