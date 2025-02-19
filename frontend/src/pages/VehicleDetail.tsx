import { useParams, Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/VehicleDetail.css";
import vehicleData from "../components/data/vehicleData.json";

const VoitureDetail = () => {
  // Récupérer l'ID depuis les paramètres de l'URL
  const { id } = useParams<{ id: string }>();

  // Trouver le véhicule correspondant à l'ID
  const voiture = vehicleData.find((car) => car.id === parseInt(id));

  if (!voiture) {
    return <h2>Véhicule non trouvé</h2>;
  }

  return (
    <div className="voiture_detail">
      <Header />
      <img
        src="https://www.jeep.fr/content/dam/cps/jeep/fr-fr/Promotions/renegade-hybrid-lld/nov-24/AVENGER_CPS_1600x505.jpg"
        alt="Voiture en promotion"
        className="voiture_detail_image"
      />
      <div className="voiture_detail_title">
        <h1>
          {voiture.brand} {voiture.model}
        </h1>
      </div>
      {voiture.available && (
        <div className="options_list">
          <h2 className="text-md font-bold">Options de location longue durée :</h2>
          <ul className="text-sm list-disc list-inside">
            <li>✅ Assurance tous risques</li>
            <li>✅ Assistance dépannage</li>
            <li>✅ Entretien & SAV</li>
            <li>✅ Contrôle technique</li>
          </ul>
        </div>
      )}
      <div className="voiture_detail_buttons">
        {voiture.available ? (
          <Link to={`/voitures/${id}/apply`}>
            <button className="px-6 py-3 bg-blue-500 rounded-full hover:bg-blue-600 cursor-pointer">
              Déposer mon dossier
            </button>
          </Link>
        ) : (
          <button className="px-6 py-3 bg-red-500 rounded-full hover:bg-red-600">
            Voiture non disponible
          </button>
        )}
      </div>
      <div className="voiture_detail_description">
        <p>
          <strong>Année :</strong> {voiture.year}
        </p>
        <p>
          <strong>Catégorie :</strong> {voiture.category}
        </p>
        <p>
          <strong>Motorisation :</strong> {voiture.motor}
        </p>
        <p>
          <strong>Couleur :</strong> {voiture.color}
        </p>
        <p>
          <strong>Puissance :</strong> {voiture.horsepower} ch
        </p>
        <p>
          <strong>Kilométrage :</strong> {voiture.mileage.toLocaleString()} km
        </p>
      </div>
      <div style={{ position: "absolute", width: "100%", bottom: "0"}}>
        <Footer />
      </div>
    </div>
  );
};

export default VoitureDetail;
