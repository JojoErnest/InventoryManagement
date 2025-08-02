import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import UserListPage from "./Pages/UserListPage";
import { act } from "react";

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

const handleRegister = async ({ username, password, role, fullName, email, phone }) => {
  try {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        role,
        fullName,
        email,
        phone,
        actionsBy: user?.username 
      }),
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
      <Route path="/" element={<LoginPage onLogin={handleLogin}/>} />
      {/* <Route path="/home" element={<HomePage onRegister={handleRegister}/>} /> */}
      {/* <Route path="/users" element={<UserListPage user={user}  onLogout={handleLogout} onRegister={handleRegister}/>} /> */}
      <Route path="/users" element={
        user ? (
          <UserListPage user={user} onLogout={handleLogout} onRegister={handleRegister}/>
        ) : (
          <Navigate to="/" replace />
        )
      } />
      <Route path="/home" element={user ? (<HomePage user={user} onLogout={handleLogout} onRegister={handleRegister}/>) : (<Navigate to="/" replace />)}/>
    </Routes>
  );
}

export default App;
