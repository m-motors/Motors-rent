import "../../styles/DropdownMenu.css";
import { useState } from "react";
import { FiUser, FiFolder, FiHome, FiLogIn, FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white px-4 py-2 rounded-full shadow-md flex items-center gap-2 hover:shadow-lg transition"
      >
        <FiUser size={20} color="black" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <ul className="dropdown-menu py-2">
            <li>
              <button onClick={() => handleNavigation("/")} className="dropdown-item">
                <FiHome className="inline mr-2" color="black" /> Accueil
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation("/register")} className="dropdown-item">
                <FiUser className="inline mr-2" color="black" /> S'inscrire
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation("/login")} className="dropdown-item">
                <FiLogIn className="inline mr-2" color="black" /> Connexion
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation("/folder")} className="dropdown-item">
                <FiFolder className="inline mr-2" color="black" /> Dossiers
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation("/foldercreate")} className="dropdown-item">
                <FiPlusCircle className="inline mr-2" color="black" /> Nouveau Dossier
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
