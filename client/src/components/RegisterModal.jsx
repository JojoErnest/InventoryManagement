import React from "react";
import "../CSS/HomePage.css"; 

const RegisterModal = ({
  username, setUsername,
  password, setPassword,
  fullName, setFullName,
  email, setEmail,
  phone, setPhone,
  onClose,
  onSubmit
}) => {
  return (
    <div className="modal-backdrop">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Register</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
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
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="btn-primary" type="submit">Submit</button>
          <button
            className="btn-secondary"
            type="button"
            onClick={onClose}
            style={{ marginTop: "10px" }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
