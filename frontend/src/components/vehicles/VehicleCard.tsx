import "../../styles/VehicleCard.css";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiXCircle } from "react-icons/fi";
import vehicleData from "../data/vehicleCards.json"

function VehiculeCard() {
  const isAdmin = true;
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/voitures/${id}`);
  };

  return (
    <div className="vehicule_cards">
      {isAdmin && (
        <div className="flex justify-center items-center mb-4">
          <Link to="/addVehicle">
            <button className="bg-green-500 text-white py-2 px-3 flex items-center justify-center rounded-xl cursor-pointer">
              Ajouter une annonce <FiPlus />
            </button>
          </Link>
        </div>
      )}

      <div className="vehicule_list">
        {vehicleData.map((vehicule) => (
          <div
            key={vehicule.id}
            className="vehicule_card"
            onClick={() => handleClick(vehicule.id)}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://image.web.stellantis.com/lib/fe34117175640475711d70/m/1/5bebd465-e526-406f-b012-45faeee97c5a.jpg"
              alt={`${vehicule.brand} ${vehicule.model}`}
              className="vehicule_img"
            />
            {isAdmin && (
              <div className="flex justify-around m-2 text-gray-400 text-sm">
                <p className="text-blue-700">Modifier</p>
                <p className="flex items-center gap-2 text-red-700">
                  <FiXCircle /> Supprimer
                </p>
              </div>
            )}
            <div className="vehicule_card_description">
              <h3>{vehicule.brand} {vehicule.model}</h3>
              <p style={{ margin: "5px 0", color: "#555" }}>
                {vehicule.year} • {vehicule.category} • {vehicule.color}
              </p>
              <div className="vehicule_card_bottom">
                <span style={{ color: vehicule.available ? "green" : "red" }}>
                  {vehicule.available ? "Disponible ✅" : "Indisponible ❌"}
                </span>
                <span>{vehicule.mileage.toLocaleString()} km</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehiculeCard;
