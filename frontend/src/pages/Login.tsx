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
        alert("Connexion réussie !");
        localStorage.setItem("token", data.content?.token);
        window.location.href = "/dashboard";
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
      setError("Problème de connexion au serveur.");
    }
  };

  return (
    <div>
      <DropdownMenu />
      <h2>Connexion</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email :</label>
        <input
          type="email"
          placeholder="Votre email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Mot de passe :</label>
        <input
          type="password"
          placeholder="Votre mot de passe"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;
