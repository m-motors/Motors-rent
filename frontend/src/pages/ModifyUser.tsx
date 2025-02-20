import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import "../styles/Register.css";
import axios from 'axios';

function ModifyUser() {
  const [isRegister, setIsRegister] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.put('/api/users/me', formData);
      setSuccess("Informations mises à jour avec succès !");
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError("Erreur lors de la mise à jour des informations.");
    }
  };

  return (
    <div>
      <Header />
      <div className="auth-container">
        <div className="auth-box">
          <h2>Modifier les informations</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
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
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button className="auth-button" type="submit">
              Mettre à jour
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </div>
      </div>
    </div>
  );
}

export default ModifyUser;
