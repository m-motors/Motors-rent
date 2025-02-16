import "../../styles/DropdownMenu.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="dropdown-container">
      <button onClick={() => setIsOpen(!isOpen)} className="menu-button">
        🏡
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li>
              <button onClick={() => handleNavigation("/")}>Accueil</button>{" "}
            </li>
            <li>
              <button onClick={() => handleNavigation("/register")}>
                Register
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation("/login")}>Login</button>
            </li>
            <li>
              <button onClick={() => handleNavigation("/folder")}>
                Folder
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation("/foldercreate")}>
                Create Folder
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation("/Profile")}>
                Profile
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
