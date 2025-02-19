// src/AdminPage.js
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";
import users from "../components/data/userData.json"
import vehicle from "../components/data/vehicleData.json"

const AdminPage = () => {

  const stats = {
    totalUsers: 100,
    totalFolders: 500,
    sharedFolders: 150,
    recentActivity: 'Ajout de 5 nouveaux utilisateurs aujourd\'hui',
  };

  const actions = [
    { id: 1, action: 'Ajout de l\'utilisateur John Doe', date: '2023-01-01 10:00' },
    { id: 2, action: 'Suppression de l\'utilisateur Jane Smith', date: '2023-01-02 11:00' },
    // Ajoutez d'autres actions ici
  ];

  return (
    <div>
        <Header />
        <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Tableau de Bord Administrateur</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Statistiques</h3>
                <p><strong>Utilisateurs Totaux:</strong> {stats.totalUsers}</p>
                <p><strong>Dossiers Totaux:</strong> {stats.totalFolders}</p>
                <p><strong>Dossiers Partagés:</strong> {stats.sharedFolders}</p>
                <p><strong>Activité Récente:</strong> {stats.recentActivity}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Actions Rapides</h3>
                <Link to="/addUser"> <button className="block mt-2 text-blue-500 hover:underline cursor-pointer">Ajouter un nouvel utilisateur</button> </Link>
                <Link to="/addVehicle"> <button className="block mt-2 text-blue-500 hover:underline cursor-pointer">Ajouter une nouvelle annonce</button> </Link>
                <button className="block mt-2 text-blue-500 hover:underline cursor-pointer">Exporter les données des utilisateurs</button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Paramètres de Gestion</h3>
                <button className="block mt-2 text-blue-500 hover:underline cursor-pointer">Gérer les rôles et permissions</button>
                <button className="block mt-2 text-blue-500 hover:underline cursor-pointer">Configurer les notifications globales</button>
            </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold mb-2">Comptes Clients</h3>
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Nom</th>
                        <th className="py-2 px-4 border-b">Prénom</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Date d'inscription</th>
                        <th className="py-2 px-4 border-b">Statut</th>
                        <th className="py-2 px-4 border-b">Actif</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                        <td className="py-2 px-4 border-b">{user.id}</td>
                        <td className="py-2 px-4 border-b">{user.last_name}</td>
                        <td className="py-2 px-4 border-b">{user.first_name}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.created_at}</td>
                        <td className="py-2 px-4 border-b">{user.user_role} </td>
                        <td className="py-2 px-4 border-b">{user.is_active ? "Oui" : "Non"}</td>
                        <td className="py-2 px-4 border-b">
                            <button className="text-red-500 hover:underline">Supprimer</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold mb-2">Offres</h3>
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Disponible</th>
                        <th className="py-2 px-4 border-b">Marque</th>
                        <th className="py-2 px-4 border-b">Modèle</th>
                        <th className="py-2 px-4 border-b">Année</th>
                        <th className="py-2 px-4 border-b">Date de création</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {vehicle.map(vehicle => (
                        <tr key={vehicle.id}>
                        <Link to={`/voitures/${vehicle.id}}`}><td className="py-2 px-4 border-b">{vehicle.id}</td></Link>
                        <td className="py-2 px-4 border-b">{vehicle.available ? "Oui" : "Non"}</td>
                        <td className="py-2 px-4 border-b">{vehicle.brand}</td>
                        <td className="py-2 px-4 border-b">{vehicle.model}</td>
                        <td className="py-2 px-4 border-b">{vehicle.year}</td>
                        <td className="py-2 px-4 border-b">{vehicle.created_at}</td>
                        <td className="py-2 px-4 border-b">{vehicle.status}</td>
                        <td className="py-2 px-4 border-b">
                            <button className="text-red-500 hover:underline">Supprimer</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Historique des Actions</h3>
            <ul>
                {actions.map(action => (
                <li key={action.id} className="mb-2">
                    <strong>{action.date}:</strong> {action.action}
                </li>
                ))}
            </ul>
            </div>
        </div>
        </div>
        <Footer />
    </div>
  );
};

export default AdminPage;
