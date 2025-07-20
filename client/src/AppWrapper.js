import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

function AppWrapper() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <Router>
      <App user={user} setUser={setUser} />
    </Router>
  );
}

export default AppWrapper;
