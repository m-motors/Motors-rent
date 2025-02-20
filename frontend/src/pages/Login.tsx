// src/components/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const host = import.meta.env.VITE_API_HOST;
    const url = `${host}/api/authentication/login`;

    try {
      const response = await axios.post(url, { identification: email, password });
      if (response.status === 200) {
        alert("Connexion réussie !");
        localStorage.setItem("token", response.data.content?.token);
        navigate("/dashboard");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
      setError("Problème de connexion au serveur.");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
