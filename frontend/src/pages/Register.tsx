import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/Register.css";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const host = import.meta.env.VITE_API_HOST;
    const url = `${host}/api/users`;

    try {
      const response = await axios.post(url, formData);
      if (response.status === 201) {
        navigate("/");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError("Problème de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="auth-form auth-box" onSubmit={handleSubmit}>
        <h2 className="auth-title">Créer un compte</h2>

        <input type="text" placeholder="Prénom" name="first_name" required value={formData.first_name} onChange={handleChange} />
        <input type="text" placeholder="Nom" name="last_name" required value={formData.last_name} onChange={handleChange} />
        <input type="email" placeholder="Email" name="email" required value={formData.email} onChange={handleChange} />
        <input type="password" placeholder="Mot de passe" name="password" required value={formData.password} onChange={handleChange} />
        <input type="password" placeholder="Confirmer le mot de passe" name="confirmPassword" required value={confirmPassword} onChange={handleChange} />

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Création..." : "S'inscrire"}
        </button>

        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
