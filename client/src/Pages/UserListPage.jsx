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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const API = "http://localhost:5243";

  const handleHome = () => navigate("/home");

      const openRegisterModal = () => {
      setShowRegisterModal(true)
      setRegUsername("");
      setRegPassword("");
    };

    const handleEdit = (user) => {
      setSelectedUser(user);   
      setIsEditModalOpen(true); 
    };

    const handleSaveEdit = async () => {
      try {
        const response = await fetch(`${API}/api/user/${selectedUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...selectedUser,
            updatedBy: user?.username 
          })
        });



        if (response.ok) {
          setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
          setIsEditModalOpen(false);
          alert("User berhasil diupdate!");
        } else {
          alert("Gagal update user");
        }
      } catch (err) {
        console.error(err);
        alert("Terjadi error saat update user");
      }
    };

    const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus user ini?")) return;

    try {
      const response = await fetch(`${API}/api/user/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
        alert("User berhasil dihapus!");
      } else {
        alert("Gagal menghapus user");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi error saat menghapus user");
    }
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
                <th>Fullname</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td className={user.role === 0 ? "admin-role" : user.role === 1 ? "manager-role" : "user-role"}>
                    {user.role === 0 ? "Admin" : user.role === 1 ? "Manager": "User"}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
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

      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
      <div className="modal-backdrop">
        <div className="modal">
          <h2>Edit User</h2>
          <label>Username</label>
          <input
            type="text"
            value={selectedUser.username}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, username: e.target.value })
            }
          />

          <label>Email</label>
          <input
            type="email"
            value={selectedUser.email}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, email: e.target.value })
            }
          />

          <label>Full Name</label>
          <input
            type="text"
            value={selectedUser.fullName}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, fullName: e.target.value })
            }
          />
    
          <label>Phone</label>
          <input
            type="text"
            value={selectedUser.phone}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, phone: e.target.value })
            }
          />

          <label>Role</label>
          <select
            value={selectedUser.role}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, role: parseInt(e.target.value) })
            }
          >
            <option value={0}>Admin</option>
            <option value={1}>Manager</option>
            <option value={2}>User</option>
          </select>

          <div className="modal-actions">
            <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button onClick={handleSaveEdit}>Save</button>
          </div>
        </div>
      </div>
    )}

    </div>
  );
};


export default UserListPage;
