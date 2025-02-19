import { Link } from "react-router-dom";

const isAdmin = false
const isLogged = false

export default function Header() {
  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link to="/">M-Motors</Link>
      </div>
      
      <nav className="hidden md:flex gap-6 text-sm uppercase">
        <Link to="/" className="hover:text-gray-400">Accueil</Link>
        {!isAdmin && isLogged && (
          <Link to="/user" className="hover:text-gray-400">Mon compte</Link>
          )}
        {isAdmin && isLogged && (
          <Link to="/admin" className="hover:text-gray-400">Mon compte</Link>
          )}
        {!isLogged && (
          <Link to="/register" className="hover:text-gray-400">Mon compte</Link>
        )}
        
        <Link to={`/users/${1}/applications`} > Mes dossiers </Link>
        <Link to="/addVehicle" className="hover:text-gray-400">Nouvelle offre</Link>
      </nav>
      
      <div className="flex items-center gap-2">
        {isAdmin && (
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300">Admin</span>
        )}
      </div>
    </header>
  );
}
