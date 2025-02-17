import { useState } from "react";
import DropdownMenu from "../components/common/DropdownMenu";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); 

  const API_URL = "http://localhost:3000/api/authentication/login";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identification: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Connexion successful !");
        localStorage.setItem("token", data.content?.token);
        window.location.href = "/";
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("connexion Failed !:", error);
      setError("Problem connecting to server.");
    }
  };

  return (
    <div>
      <DropdownMenu />
      <form onSubmit={handleSubmit}>
        {/*<label>Email :</label>*/}
        <input
          type="email"
          placeholder="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /> 
        {/*<label>Password :</label>*/}
        <input
          type="password"
          placeholder="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /> 
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">log in</button>
      </form>
    </div>
  );
}

export default Login;
