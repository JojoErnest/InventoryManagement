import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";

function App({ user, setUser }) {
  const API = "http://localhost:5243";
  // const navigate = useNavigate();

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
        return null;
      }

      const userData = await res.json();
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      // navigate("/home");
      return userData;
    } catch (err) {
      console.error(err);
      // console.log("user", user);
      // console.log("username", username);
      alert("Server error while login");
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    // navigate("/");
  };

  const handleRegister = async (username, password) => {
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        alert("Register success! Now you can login.");
      } else {
        const err = await res.text();
        alert("Register failed: " + err);
      }
    } catch (error) {
      console.error(error);
      alert("Server error during registration.");
    }
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={handleLogin} onRegister={handleRegister} />} />
      <Route path="/home" element={user ? (<HomePage user={user} onLogout={handleLogout} />) : (<Navigate to="/" replace />)}/>
    </Routes>
  );
}

export default App;
