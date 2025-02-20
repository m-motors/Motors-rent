import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import "../styles/Register.css";
import axios from 'axios';

function AuthPage() {
  const [isRegister, setIsRegister] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    identification: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("coucou")
    console.log("formData", formData)
    if (isRegister && formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const host = import.meta.env.VITE_API_HOST
    const url = isRegister ? `${host}/api/users` : `${host}/api/authentication/login`;
    const data = isRegister ? formData : { identification: formData.email, password: formData.password };

    try {
      const response = await axios.post(url, data);
      console.log("response", response)
      console.log("dans le try")
      if (response.status === 200 || response.status === 201) {
        if (isRegister) {
          alert("Inscription réussie !");
        } else {
          alert("Connexion réussie !");
          localStorage.setItem("token", response.data.content?.token);
          navigate("/dashboard");
        }
      } else {
        console.log("dans le else")
        setError(response.data.message);
      }
    } catch (error) {
      console.log("dans l'erreur")
      console.error("Erreur :", error);
      setError("Problème de connexion au serveur.");
    }
  };

  return (
    <div>
      <Header />
      <div className="auth-container">
        <div className="flex flex-col">
          {isRegister ? (
            <h2 className="auth_container_title">Inscription</h2>
          ) : (
            <h2 className="auth_container_title">Connexion</h2>
          )}
          <p
            className="auth_toggle-subtitle"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Déjà inscrit ? Connectez-vous" : "Pas encore inscrit ? Inscrivez-vous"}
          </p>
        </div>
        <div className="auth-box">
          <h2>{isRegister ? "Inscription" : "Connexion"}</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <input
                  type="text"
                  placeholder="Prénom"
                  required
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="Nom"
                  required
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              required
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              required
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {isRegister && (
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                required
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            )}
            <button className="auth-button" type="submit">
              {isRegister ? "S'inscrire" : "Se connecter"}
            </button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
