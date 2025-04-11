import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

import "../styles/Register.css";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post("/api/authentication/login", {
        identification: email,
        password,
      });

      if (response.data.erorr) {
        throw new Error();
      }

      const token = response.data.content.access_token;
      localStorage.setItem("jwt-token", token);
      navigate("/");

    } catch (error) {
      console.error(error);
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="auth-form auth-box" onSubmit={handleSubmit}>
        <h2 className="auth-title">Connexion</h2>

        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" required value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
