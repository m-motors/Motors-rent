import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Register from "./Register";
import Login from "./Login";

import "../styles/Register.css";
import { useSearchParams } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get("isregister");

  const defaultIsRegister = param === "true";
  const [isRegister, setIsRegister] = useState(defaultIsRegister);

  useEffect(() => {
    setIsRegister(param === "true");
  }, [param]);

  const toggleForm = () => {
    const newIsRegister = !isRegister;
    setSearchParams({ isregister: newIsRegister.toString() });
  };

  return (
    <div>
      <Header />
      <div className="auth-container">
        <div className="w-full max-w-md flex flex-col items-center mb-6">
          <h2 className="auth-title">
            {isRegister ?"Connexion" : "Créer un compte"}
          </h2>

          <p
            className="auth-toggle-subtitle"
            onClick={toggleForm}
          >
            {isRegister
              ? "Pas encore inscrit ? Inscrivez-vous"
              : "Déjà inscrit ? Connectez-vous"}
          </p>
        </div>

        <div className="auth-box">
          {isRegister ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
