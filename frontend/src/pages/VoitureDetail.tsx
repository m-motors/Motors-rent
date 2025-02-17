import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../../src/styles/VoitureDetail.css"

const VoitureDetail = () => {
  // Récupérer l'ID depuis les paramètres de l'URL
  const { id } = useParams<{ id: string }>();

  // En attendant, on simule la récupération des données (dans une vraie application, tu ferais une requête API)
  const voitureData = {
    id: 1,
    created_at: "2025-02-11 22:02:12",
    available: true,
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    horsepower: 132,
    price: 20000,
    category: "Sedan",
    motor: "Gasoline",
    color: "White",
    mileage: 15000,
    dossierStatus: "En attente de validation", 
  };

  // Si l'ID ne correspond pas à la voiture (par exemple, ID invalide), on peut afficher un message ou rediriger
  if (parseInt(id) !== voitureData.id) {
    return <h2>Véhicule non trouvé</h2>;
  }

  return (
    <div>
      <div className="voiture_detail">
        <Header />
        <img
          src="https://www.jeep.fr/content/dam/cps/jeep/fr-fr/Promotions/renegade-hybrid-lld/nov-24/AVENGER_CPS_1600x505.jpg"
          alt="Voiture en promotion"
          className="w-full h-full object-cover"
        />
      
        <div className="voiture_detail_title">
          <h1>
            {voitureData.brand} {voitureData.model}
          </h1>

          <div>
            <button>
              Acheter ce véhicule
            </button>
            {voitureData.available && (
              <button>
                Louer ce véhicule
              </button>
            )}
          </div>
        
          <div className="mt-4">
            <button className="px-6 py-3 bg-yellow-500 rounded-full text-gray-900 hover:bg-yellow-600">
              Déposer mon dossier
            </button>
          </div>
        </div>
        </div>
          <div className="voiture_detail_description">
            <p>
              <strong>Année :</strong> {voitureData.year}
            </p>
            <p>
              <strong>Catégorie :</strong> {voitureData.category}
            </p>
            <p>
              <strong>Motorisation :</strong> {voitureData.motor}
            </p>
            <p>
              <strong>Couleur :</strong> {voitureData.color}
            </p>
            <p>
              <strong>Puissance :</strong> {voitureData.horsepower} ch
            </p>
            <p>
              <strong>Kilométrage :</strong> {voitureData.mileage.toLocaleString()} km
            </p>
          </div>

          {voitureData.available && (
            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold">Options de location longue durée :</h2>
              <ul className="text-md list-disc list-inside">
                <li>✅ Assurance tous risques</li>
                <li>✅ Assistance dépannage</li>
                <li>✅ Entretien & SAV</li>
                <li>✅ Contrôle technique</li>
              </ul>
            </div>
          )}

          <p className="mt-4 text-md">Statut du dossier: <span className="font-bold">{voitureData.dossierStatus}</span></p>
          <Footer />
    </div>
  );
};

export default VoitureDetail;
