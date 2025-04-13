import { useContext } from "react"; 
import { Link, useNavigate } from "react-router-dom";

import ChatBot from "../llm/ChatBot";
import { UserContext } from "../../store/UserContext"; 

export default function Header() {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT"});
    navigate("/auth?isregister=true");
  };

  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link to="/">M-Motors</Link>
      </div>

      <nav className="hidden md:flex gap-6 text-sm uppercase">
        <Link to="/" className="hover:text-gray-400">Accueil</Link>

        {state.role && (
          <>
            <Link to="/users/:id/applications" className="hover:text-gray-400">Dossiers</Link>
          </>
        )}

        {state.role === "client" && (
          <Link to="/user" className="hover:text-gray-400">Mon compte</Link>
        )}

        {state.role === "admin" && (
          <>
            <Link to="/admin" className="hover:text-gray-400">Admin</Link>
            <Link to="/addVehicle" className="hover:text-gray-400">Nouvelle offre</Link>
            <Link to="/llm" className="hover:text-gray-400">LLM</Link>
          </>
        )}
      </nav>

      <div className="flex items-center gap-2">
        {state.role && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm">
            {state.firstName} {state.lastName} | {state.email} | {state.role} 
          </span>
        )}
        {state.role ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Déconnexion
          </button>
        ) : (
          <>
            <Link to="/auth?isregister=false" className="bg-blue-500 px-3 py-1 rounded">Inscription</Link>
            <Link to="/auth?isregister=true" className="bg-blue-500 px-3 py-1 rounded">Connexion</Link>
          </>
        )}
      </div>

      <div className="fixed bottom-8 right-8 bg-blue-500 z-10">
        <ChatBot />
      </div>
    </header>
  );
}
