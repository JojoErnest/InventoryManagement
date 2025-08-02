import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/UserListPage.css";
import RegisterModal from "../components/RegisterModal";

const UserListPage = ({ user, onLogout, onRegister}) => {

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regRole, setRegRole] = useState(2); 

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const API = "http://localhost:5243";

  const handleHome = () => navigate("/home");

      const openRegisterModal = () => {
      setShowRegisterModal(true)
      setRegUsername("");
      setRegPassword("");
    };

    const handleRegisterSubmit = (e) => {
      e.preventDefault();
      if (
        !regUsername.trim() ||
        !regPassword.trim() ||
        !regFullName.trim() ||
        !regEmail.trim() ||
        !regPhone.trim()
      ) {
        alert("Please fill in all fields");
        return;
      }

       onRegister({
        username: regUsername,
        password: regPassword,
        fullName: regFullName,
        email: regEmail,
        phone: regPhone,
        role: regRole,
        actionsBy: user?.username
      });

      setShowRegisterModal(false);
    };

  useEffect(() => {
    fetch(`${API}/api/user`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <button onClick={handleHome}>🏠 Home</button>

        {user?.role === 0 && (
          <>
            <button onClick={openRegisterModal}>➕ Register</button>
            <button onClick={() => navigate("/users")}>👥 User List</button>
          </>
        )}

        <button onClick={onLogout} className="logout-btn">🚪 Logout</button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1>User List</h1>
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td className={user.role === 0 ? "admin-role" : "user-role"}>
                    {user.role === 0 ? "Admin" : "User"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Register Modal */}
      {showRegisterModal && (
        <RegisterModal
          username={regUsername}
          setUsername={setRegUsername}
          password={regPassword}
          setPassword={setRegPassword}
          fullName={regFullName}
          setFullName={setRegFullName}
          email={regEmail}
          setEmail={setRegEmail}
          phone={regPhone}
          setPhone={setRegPhone}
          role={regRole}
          setRole={setRegRole}
          onClose={() => setShowRegisterModal(false)}
          onSubmit={handleRegisterSubmit}
        />
      )}
    </div>
  );
};


export default UserListPage;
