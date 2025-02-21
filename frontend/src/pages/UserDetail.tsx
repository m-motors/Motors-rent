import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import axios from 'axios';

const UserPage = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        console.log("response: ", response)
        setUserData(response.data.content);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, [id]);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  // if (!userData) {
  //   return <div>Chargement en cours...</div>;
  // }

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
                  <p><strong>Nom et Prénom:</strong> {userData.first_name} {userData.last_name}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Date d'anniversaire:</strong> {userData.birthdate}</p>
                  <p><strong>Date d’inscription:</strong> {userData.registrationDate}</p>
                  <p><strong>Statut:</strong> {userData.status}</p>
                  <Link to={`/modifyUser/${userData.id}`}><button className="mt-2 text-blue-500 hover:underline cursor-pointer">Modifier les informations</button></Link>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        <Footer />
    </div>
  );
};
export default UserPage;
