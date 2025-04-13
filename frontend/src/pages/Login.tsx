import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../store/UserContext";
import { useApi } from "../hooks/useApi";

import "../styles/Register.css";

type LoginResponseData = {
  token?: string;
  user?: unknown;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [qry, setQry] = useState<{
    error: string | null;
    data: LoginResponseData | null;
    loading: boolean;
  }>({
    error: null,
    data: null,
    loading: false,
  });

  const api = useApi();  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQry((prev) => ({ ...prev, loading: true }));
  
    try {
      const loginResponse = await api.post("/api/authentication/login", {
        identification: email,
        password: password,
      });

      const token = loginResponse.data.content.access_token;
      setQry((prev) => ({ ...prev, data: { token } }));

      const identityResponse = await api.get("/api/tools/identity", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = {
        token: token,
        firstName: identityResponse.data.content.first_name,
        lastName: identityResponse.data.content.last_name,
        email: identityResponse.data.content.email,
        role: identityResponse.data.content.user_role,
      }

      setQry((prev) => ({
        ...prev,
        data: { ...prev.data, user },
      }));

      dispatch({
        type: "SET_USER",
        payload: {
          token,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });

      navigate("/");
    } catch (error: any) {
      console.error(error);
      setQry((prev) => ({
        ...prev,
        error: error.message ?? "Email ou mot de passe incorrect.",
        data: null,
      }));
    } finally {
      setQry((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Connexion</h2>

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

        <button className="auth-button" type="submit" disabled={qry.loading}>
          {qry.loading ? "Connexion..." : "Se connecter"}
        </button>

        {qry.error && <p className="auth-error">{qry.error}</p>}
      </form>
    </>
  );
};

export default Login;
