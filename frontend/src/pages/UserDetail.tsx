import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Link } from "react-router-dom";

const UserPage = () => {
  const userData = {
    id: '678',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    birthdate: '12/34/5678',
    registrationDate: '2022-01-15',
    status: 'Utilisateur standard',
    folders: [
      { id: 1, name: 'Dossier 1', shared: false },
      { id: 2, name: 'Dossier 2', shared: true },
    ],
    actions: [
      { id: 1, action: 'Ajout de Dossier 1', date: '2023-01-01 10:00' },
      { id: 2, action: 'Modification de Dossier 2', date: '2023-01-02 11:00' },
    ],
  };

  return (
    <div>
        <Header />
        <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Détails de l'Utilisateur</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Informations du Profil</h3>
                <div className="flex items-center mb-2">
                <div>
                    <p><strong>Nom et Prénom:</strong> {userData.firstName} {userData.lastName}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Date d'anniversaire:</strong> {userData.birthdate}</p>
                    <p><strong>Date d’inscription:</strong> {userData.registrationDate}</p>
                    <p><strong>Statut:</strong> {userData.status}</p>
                    <Link to={`/modifyUser/${userData.id}`}><button className="mt-2 text-blue-500 hover:underline cursor-pointer">Modifier les informations</button></Link>
                </div>
                </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Mes Dossiers</h3>
                <ul>
                {userData.folders.map(folder => (
                  <Link to={`/user/${userData.id}/folder/${folder.id}`}>
                    <li key={folder.id} className="mb-2">
                    <strong>{folder.name}</strong> {folder.shared && '(Partagé)'}
                    </li>
                  </Link>
                ))}
                </ul>
                <button className="mt-2 text-blue-500 hover:underline cursor-pointer">Créer un nouveau dossier</button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow md:col-span-2">
                <h3 className="text-lg font-semibold mb-2">Historique des Actions</h3>
                <ul>
                {userData.actions.map(action => (
                    <li key={action.id} className="mb-2">
                    <strong>{action.date}:</strong> {action.action}
                    </li>
                ))}
                </ul>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Paramètres du Compte</h3>
                <button className="block mt-2 text-blue-500 hover:underline cursor-pointer">Changer l’adresse e-mail</button>
                <button className="block mt-2 text-blue-500 hover:underline cursor-pointer">Modifier le mot de passe</button>
                <button className="block mt-2 text-blue-500 hover:underline cursor-pointer">Activer/Désactiver les notifications</button>
            </div>
            {/* Gestion de Compte */}
            <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Gestion de Compte</h3>
                <button className="block mt-2 text-blue-500 hover:underline cursor-pointer">Déconnexion</button>
                <button className="block mt-2 text-red-500 hover:underline cursor-pointer">Supprimer le compte</button>
            </div>
            </div>
        </div>
        </div>
        <Footer />
    </div>
  );
};

export default UserPage;
