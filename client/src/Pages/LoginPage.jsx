import { useState } from "react";
import "../CSS/LoginPage.css";        

function LoginPage({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal]   = useState(false);
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return; 
    onLogin(username, password);
  };

  const openRegisterModal = () => {
    setShowModal(true);
    setRegUsername("");
    setRegPassword("");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regUsername.trim() || !regPassword.trim()) return;
    onRegister(regUsername, regPassword);
    setShowModal(false);
  };

  return (
    <>
      <div className="page-container">
        <div className="card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-primary" type="submit">
              Login
            </button>
            <button
              className="btn-secondary"
              type="button"
              onClick={openRegisterModal}
              style={{ marginTop: "10px" }}
            >
              Register
            </button>
          </form>
        </div>
      </div>

      {/* ----- MODAL REGISTER ----- */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Register</h3>
            <form onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <button className="btn-primary" type="submit">
                Submit
              </button>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => setShowModal(false)}
                style={{ marginTop: "10px" }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginPage;
