import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { useApi } from "../hooks/useApi";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { VehicleType } from "../components/vehicles/Content";

import "../styles/VehicleDetail.css";
import { UserContext } from "../store/UserContext";

const VoitureDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<VehicleType>()
  const { state } = useContext(UserContext);
  

  const [qry, setQry] = useState<{
    error: string | null;
    loading: boolean;
  }>({
    error: null,
    loading: false,
  });

  const api = useApi();  

  const fetchVehicle = async () => {
    setQry((prev) => ({ ...prev, loading: true }));
  
    try {
      const response = await api.get(`/api/vehicles/${id}`);
      const vehicle = response.data.content

      if (!vehicle) {
        setQry((prev) => ({
          ...prev,
          error: "Vehicule non trouvé",
        }));
      }

      setCar(vehicle);
    } catch (error: any) {
      console.error(error);
      setQry((prev) => ({
        ...prev,
        error: error.message ?? "Echec lors de la récupérion du vehicle",
      }));
    } finally {
      setQry((prev) => ({ ...prev, loading: false }));
    }
  };

  const deleteVehicle = async () => {
    setQry((prev) => ({ ...prev, loading: true }));
    try {
      const response = await api.delete(`/api/vehicles/${id}`);

      if (response.data.content) {
        setQry((prev) => ({
          ...prev,
          error: "Vehicule non supprimé",
        }));
      }
    } catch (error: any) {
      console.error(error);
      setQry((prev) => ({
        ...prev,
        error: error.message ?? "Echec lors de la suppresion du vehicle",
      }));
    } finally {
      setQry((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(()=>{
    fetchVehicle()
  }, [])

  const handleRemoveCar = () => {
    deleteVehicle()
    navigate("/");
  }

  return (
    <div className="voiture_detail min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        {
          qry.error ? (
            <div className="flex p-4 my-6 mx-auto max-w-2xl text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              <svg
                className="shrink-0 inline w-4 h-4 me-3 mt-[2px]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Erreur</span>
              <div>
                <span className="font-medium">Erreur lors de la récupération des données :</span>
                <ul className="mt-1.5 list-disc list-inside">
                  <li>{qry.error.toString()}</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              {
                qry.loading ?? (
                  <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) 
              }
              <img
                src="https://www.jeep.fr/content/dam/cps/jeep/fr-fr/Promotions/renegade-hybrid-lld/nov-24/AVENGER_CPS_1600x505.jpg"
                alt="Voiture en promotion"
                className="voiture_detail_image"
              />
              <div className="voiture_detail_title">
                <h1>
                  {car?.brand} {car?.model}
                </h1>
                {state.role === 'admin' && (
                  <div className="flex items-center gap-3 mr-6">
                    <Link className="px-6 py-3 bg-yellow-500 rounded-full hover:bg-yellow-600 cursor-pointer text-base" to={`/voitures/update/${id}`}>
                      Modifier l'offre
                    </Link>
                    <button className="px-6 py-3 bg-red-500 rounded-full hover:bg-red-600 cursor-pointer" onClick={handleRemoveCar}>
                      Supprimer l'offre
                    </button>
                  </div>
                  )}
              </div>
              {car?.available && (
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
                {car?.available ? (
                  <Link to={`/voitures/${id}/apply`}>
                    <button className="px-6 py-3 bg-blue-500 rounded-full hover:bg-blue-600 cursor-pointer">
                      Déposer mon dossier pour
                      {car?.status === "rent" ? (
                        <p> louer le véhicule</p>
                      ) : car?.status === "sale" ? (
                        <p> acheter le véhicule</p>
                      ) : null}
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
                  <strong>Année :</strong> {car?.year}
                </p>
                <p>
                  <strong>Catégorie :</strong> {car?.category}
                </p>
                <p>
                  <strong>Motorisation :</strong> {car?.motor}
                </p>
                <p>
                  <strong>Couleur :</strong> {car?.color}
                </p>
                <p>
                  <strong>Puissance :</strong> {car?.horsepower} ch
                </p>
                <p>
                  <strong>Kilométrage :</strong> {car?.mileage.toLocaleString()} km
                </p>
              </div>
            </>
          )
        }
      </div>
      <div style={{ position: "absolute", width: "100%", bottom: "0"}}>
        <Footer />
      </div>
    </div>
  );
};

export default VoitureDetail;


