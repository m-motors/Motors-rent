// src/components/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const host = import.meta.env.VITE_API_HOST;
    const url = `${host}/api/users`;

    try {
      const response = await axios.post(url, formData);
      if (response.status === 201) {
        alert("Inscription réussie !");
        navigate("/");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Erreur :", error);
      setError("Problème de connexion au serveur.");
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Prénom"
          required
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Nom"
          required
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />
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
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          required
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
        />
        <button className="auth-button" type="submit">
          S'inscrire
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Register;
