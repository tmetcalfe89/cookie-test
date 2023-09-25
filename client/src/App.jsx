import { useCallback, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function getCurrentUser() {
      const response = await fetch("/api/users/check");
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.username);
      } else {
        setCurrentUser(null);
      }
    }
    getCurrentUser();
  }, []);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();

      const response = await fetch("/api/users/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        setCurrentUser(username);
        alert("Success");
      } else {
        alert("Failure");
      }
    },
    [password, username]
  );

  const handleLogout = useCallback(async () => {
    const response = await fetch("/api/users/logout");

    if (response.ok) {
      alert("Success");
    } else {
      alert("Failure");
    }
  }, []);

  return (
    <>
      <section>
        <form onSubmit={handleLogin}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button>Login</button>
        </form>
      </section>
      <section>
        <button onClick={handleLogout}>Logout</button>
      </section>
      <section>{currentUser}</section>
    </>
  );
}

export default App;
