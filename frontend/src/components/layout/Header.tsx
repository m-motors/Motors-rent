import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_HOST}/api/tools/all`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data.user);
          setIsLogged(true);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setIsLogged(false);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    navigate("/authpage");
  };

  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link to="/">M-Motors</Link>
      </div>

      <nav className="hidden md:flex gap-6 text-sm uppercase">
        <Link to="/" className="hover:text-gray-400">Accueil</Link>
        {isLogged && user?.role !== "admin" && (
          <Link to="/user" className="hover:text-gray-400">Mon compte</Link>
        )}
        {isLogged && user?.role === "admin" && (
          <Link to="/admin" className="hover:text-gray-400">Admin</Link>
        )}
        {!isLogged && (
          <Link to="/authpage" className="hover:text-gray-400">Connexion</Link>
        )}
        <Link to="/users/:id/applications" className="hover:text-gray-400">Mes dossiers</Link>
        <Link to="/addVehicle" className="hover:text-gray-400">Nouvelle offre</Link>
        {isLogged && (
          <button onClick={handleLogout} className="hover:text-gray-400">Déconnexion</button>
        )}
      </nav>

      <div className="flex items-center gap-2">
        {isLogged && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm">
            {user?.name}
          </span>
        )}
        {isLogged ? (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setIsLogged(false);
            }}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Déconnexion
          </button>
        ) : (
          <Link to="/authpage" className="bg-blue-500 px-3 py-1 rounded">Connexion</Link>
        )}
      </div>
    </header>
  );
}
