import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage"; // atau './pages/LoginPage' tergantung struktur folder
import HomePage from "./Pages/HomePage"; // atau './pages/HomePage' tergantung struktur folder

function AppWrapper(){
  const [user, setUser] = useState(localStorage.getItem("username"));

  return (
    <Router>
      <App user={user} setUser={setUser} />
    </Router>
  )
}

function App() {
  const API = "http://localhost:5243";
  const navigate = useNavigate();

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

      localStorage.setItem("username", username);
      setUser(username);
      navigate("/home"); 
    } catch (err) {
      console.error(err);
      alert("Server error while login");
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("username"); 
  setUser(null);
  navigate("/"); 
  alert("You have logged out successfully.");
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
    <Routes>
      <Route path="/" element={<LoginPage onLogin={handleLogin} onRegister={handleRegister} />} />
      <Route path="/home" element={<HomePage user={user} onLogout={handleLogout} />} />
    </Routes>
  );
}

export default App;
