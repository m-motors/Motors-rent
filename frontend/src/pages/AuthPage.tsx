// src/components/AuthPage.tsx
import { useState } from "react";
import Header from "../components/layout/Header";
import Register from "./Register";
import Login from "./Login";
import "../styles/Register.css";

function AuthPage() {
  const [isRegister, setIsRegister] = useState(true);

  return (
    <div>
      <Header />
      <div className="auth-container">
        <div className="flex flex-col">
          <h2 className="auth_container_title">
            {isRegister ? "Inscription" : "Connexion"}
          </h2>
          <p
            className="auth_toggle-subtitle"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Déjà inscrit ? Connectez-vous" : "Pas encore inscrit ? Inscrivez-vous"}
          </p>
        </div>
        <div className="auth-box">
          {isRegister ? <Register /> : <Login />}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
