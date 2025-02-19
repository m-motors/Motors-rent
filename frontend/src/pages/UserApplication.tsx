import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/UserApplication.css";
import applicationData from "../../src/components/data/userApplication.json"

const UserApplications = () => {
  const { userId } = useParams<{ userId: string }>();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Filtrer les applications pour l'utilisateur spécifié
    const userApplications = applicationData.filter(app => app.user_id === parseInt(userId));
    setApplications(userApplications);
  }, [userId]);

  return (
    <div>
      <Header />
      <div className="user_applications">
        <h1>Mes Dossiers</h1>
        {applications.length === 0 ? (
          <p>Aucun dossier trouvé.</p>
        ) : (
          <ul className="applications_list">
            {applications.map((app) => (
              <li key={app.id} className="application_card">
                  <div className="application_details">
                    <h2>{app.type === 'Rental' ? 'Location' : 'Achat'} de {app.vehicule_id}</h2>
                    <div className="application_status">
                      <strong>Statut : </strong>
                      {app.status === "En cours" ? (
                        <p className="text-orange-500"> {app.status} </p>
                        ) : app.status === "Validé" ? (
                        <p className="text-green-500"> {app.status} </p> 
                        ) : app.status === "Refusé" ? (
                          <p className="text-red-500"> {app.status} </p> 
                        ) : null}
                      </div>
                    <p><strong>Date de soumission :</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                    <div className="application_buttons">
                      <Link to={`/voitures/${app.vehicule_id}`}>
                      <button className="border px-2 py-1 rounded-xl cursor-pointer">Offre</button>
                      </Link>
                      <Link to={`/applications/${app.id}`}>
                          <button className="border px-2 py-1 rounded-xl cursor-pointer">Application</button>
                      </Link>
                    </div>
                  </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserApplications;
