import { useState } from "react";
import "../../styles/DropdownMenu.css";

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown-container">
      <button onClick={() => setIsOpen(!isOpen)} className="menu-button">
        ...
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li>
              <button>Accueil</button>
            </li>
            <li>
              <button>Register</button>
            </li>
            <li>
              <button>Login</button>
            </li>
            <li>
              <button>Folder</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
