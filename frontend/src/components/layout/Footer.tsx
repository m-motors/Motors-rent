import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

import { useEffect, useState } from "react";
import axios from "axios";


export default function Footer() {
  const [version, setVersion] = useState("0.0.0");
  const host = import.meta.env.VITE_API_HOST  ?? "error";

  useEffect(() => {
    const fetchVersion = async () => {
        const response = await axios.get(`${host}/api/tools/version`);
        setVersion(response.data.content);
    }
    fetchVersion();
  }, [host]); 

  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <div className="text-lg font-semibold">M-Motors</div>
        
        <nav className="my-4 md:my-0">
          <ul className="flex space-x-6">
            <li>
              <a href="/" className="hover:text-gray-400 transition">Accueil</a>
            </li>
            <li>
              <a href="/about" className="hover:text-gray-400 transition">À propos</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-gray-400 transition">Contact</a>
            </li>
            <li>
              <a href="/terms" className="hover:text-gray-400 transition">Conditions</a>
            </li>
          </ul>
        </nav>
        
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-400 transition">
            <FiFacebook size={20} />
          </a>
          <a href="#" className="hover:text-gray-400 transition">
            <FiTwitter size={20} />
          </a>
          <a href="#" className="hover:text-gray-400 transition">
            <FiInstagram size={20} />
          </a>
        </div>
      </div>

      <div className="text-center text-sm mt-4">&copy; 2025 M-Motors. Tous droits réservés. V{version}</div>
    </footer>
  );
}
