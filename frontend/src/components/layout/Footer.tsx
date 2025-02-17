import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
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

      <div className="text-center text-sm mt-4">&copy; 2025 M-Motors. Tous droits réservés.</div>
    </footer>
  );
}
