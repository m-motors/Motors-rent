import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axiosConfig"; // <-- Utiliser notre axios configuré

import "../styles/Register.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await api.post("/api/authentication/login", {
        identification: email,
        password,
      });

      if (response.data.erorr) {
        throw new Error()

      }

      const token = response.data.content.access_token
      localStorage.setItem("jwt-token", token);
      navigate("/");


    } catch (error) {
      console.error("Erreur de connexion :", error);
      setError("Problème de connexion au serveur.");
    }
  };

  return (
    <div>
      <form className="auth-form" onSubmit={handleSubmit}>
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
        <button className="auth-button" type="submit">Se connecter</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;