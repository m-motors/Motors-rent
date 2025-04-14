import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
7
import { useApi } from "../hooks/useApi";
import { UserContext } from "../store/UserContext";

import "../styles/Register.css";

type RegisterResponseData = {
  token?: string;
  user?: unknown;
};

const Register: React.FC = () => {
  const api = useApi(); 
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const [qry, setQry] = useState<{
    error: string | null;
    data: RegisterResponseData | null;
    loading: boolean;
  }>({
    error: null,
    data: null,
    loading: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQry((prev) => ({ ...prev, loading: true }));
    
    try {

      if (formData.password !== confirmPassword) {
        setQry((prev) => ({
          ...prev,
          error: "Les mots de passe ne correspondent pas.",
          data: null,
        }));
        return;
      }

      const response = await api.post(`/api/users`, formData);

      const loginResponse = await api.post("/api/authentication/login", {
        identification: formData.email,
        password: formData.password,
      });
      
      const user = {
        token: loginResponse.data.content.access_token,
        firstName: response.data.content.first_name,
        lastName: response.data.content.last_name,
        email: response.data.content.email,
        role: response.data.content.user_role,
        id: response.data.content.id,
      }
      
      setQry((prev) => ({
        ...prev,
        data: { ...prev.data, user },
      }));

      dispatch({
        type: "SET_USER",
        payload: {
          token: user.token,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          id: user.id,
        },
      });

      navigate("/");
    }

    catch (error:any) {
      console.error(error);
      setQry((prev) => ({
        ...prev,
        error: error.message ?? "Erreur lors de l'inscription",
        data: null,
      }));
    } 
    
    finally {
      setQry((prev) => ({ ...prev, loading: false }));
    }
  }

  const [confirmPassword, setConfirmPassword] = useState('');

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


  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Créer un compte</h2>

        <input type="text" placeholder="Prénom" name="first_name" required value={formData.first_name} onChange={handleChange} />
        <input type="text" placeholder="Nom" name="last_name" required value={formData.last_name} onChange={handleChange} />
        <input type="email" placeholder="Email" name="email" required value={formData.email} onChange={handleChange} />
        <input type="password" placeholder="Mot de passe" name="password" required value={formData.password} onChange={handleChange} />
        <input type="password" placeholder="Confirmer le mot de passe" name="confirmPassword" required value={confirmPassword} onChange={handleChange} />

        <button className="auth-button" type="submit" disabled={qry.loading}>
          {qry.loading ? "Création..." : "S'inscrire"}
        </button>

        {qry.error && <p className="auth-error">{qry.error}</p>}
      </form>
    </>
  );
};

export default Register;
