import { useState } from "react";
import Header from "../components/layout/Header";
import Register from "./Register";
import Login from "./Login";

import "../styles/Register.css";

const AuthPage: React.FC<{register?: boolean}> = ({register}) => {
  const [isRegister, setIsRegister] = useState(register);

  return (
    <div>
      <Header />
      <div className="auth-container">
        <div className="w-full max-w-md flex flex-col items-center mb-6">
          <h2 className="auth-title">
            {isRegister ? "Créer un compte" : "Connexion"}
          </h2>

          <p
            className="auth-toggle-subtitle"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "Déjà inscrit ? Connectez-vous"
              : "Pas encore inscrit ? Inscrivez-vous"}
          </p>
        </div>

        <div className="auth-box">
          {isRegister ? <Register /> : <Login />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
