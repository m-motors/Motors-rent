import { Link } from "react-router-dom";
import DropdownMenu from "../common/DropdownMenu";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link to="/">M-Motors</Link>
      </div>
      
      <nav className="hidden md:flex gap-6 text-sm uppercase">
        <Link to="/" className="hover:text-gray-400">Accueil</Link>
        <Link to="/voitures" className="hover:text-gray-400">Véhicules</Link>
        <Link to="/location" className="hover:text-gray-400">Location</Link>
        <Link to="/contact" className="hover:text-gray-400">Contact</Link>
      </nav>
      
      <div className="flex items-center">
        <DropdownMenu />
      </div>
    </header>
  );
}
