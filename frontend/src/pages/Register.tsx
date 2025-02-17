import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import "../styles/Register.css";

function AuthPage() {
  const [isRegister, setIsRegister] = useState(true);
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className="auth-container">
        <div className="auth-box">
          <button
            className="toggle-button"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Déjà inscrit ? Connectez-vous" : "Pas encore inscrit ? Inscrivez-vous"}
          </button>
          <h2>{isRegister ? "Inscription" : "Connexion"}</h2>
          <form className="auth-form">
            {isRegister && (
              <>
                <input type="text" placeholder="Firstname" required id="firstname" />
                <input type="text" placeholder="Lastname" required id="lastname" />
              </>
            )}
            <input type="email" placeholder="Email" required id="email" />
            <input type="password" placeholder="Password" required id="password" />
            {isRegister && <input type="password" placeholder="Confirm password" required id="confirmPassword" />}
            <button className="auth-button" type="submit">
              {isRegister ? "S'inscrire" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>

      <DropdownMenu />
      <form id="registerForm">
        {/*FirstName :*/}
        <input type="text" id="name" placeholder="Name" required />
        {/*LastName :*/}
        <input type="text" id="lastname" placeholder="Lastname" required />
        {/*email :*/}
        <input type="email" id="email" placeholder="Email" required />
        {/*password :*/}
        <input type="password" id="password" placeholder="Password" required />
        {/*confirm password :*/}
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>

    </div>
  );
}

export default AuthPage;