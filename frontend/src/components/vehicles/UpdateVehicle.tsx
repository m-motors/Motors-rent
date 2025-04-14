import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import "../../styles/AddPages.css";
import { VehicleType } from "./Content";
import { useApi } from "../../hooks/useApi";

const defaultVehicle: VehicleType = {
  id: 0,
  title: "",
  description: "",
  created_at: new Date(),
  available: false,
  brand: "",
  model: "",
  year: 0,
  horsepower: 0,
  price: 0,
  category: "",
  motor: "",
  color: "",
  mileage: 0,
  status: "sale"
};

const UpdateVehicle: React.FC = () => {
  const [vehicleData, setVehicleData] = useState<VehicleType>(defaultVehicle);
  const [initialData, setInitialData] = useState<VehicleType>(defaultVehicle);
  const [qry, setQry] = useState({ error: null as string | null, loading: false });
  const [qryUpdate, setQryUpdate] = useState({ error: null as string | null, loading: false });

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const api = useApi();

  const fetchVehicle = async () => {
    if (!id) return navigate("/");

    setQry({ ...qry, loading: true });

    try {
      const response = await api.get(`/api/vehicles/${id}`);
      const vehicle = response.data?.content;

      if (!vehicle) {
        throw new Error("Véhicule non trouvé");
      }

      setVehicleData(vehicle);
      setInitialData(vehicle);
    } catch (error: any) {
      setQry({ error: error.message || "Erreur lors de la récupération du véhicule", loading: false });
    } finally {
      setQry((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value, 
    }));
  };
  const handleChangeDescription = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setVehicleData((prevData) => ({
      ...prevData,
      description: e.target.value, 
    }));
  };

  const handleCheckboxChange = () => {
    setVehicleData({ ...vehicleData, available: !vehicleData.available });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setQryUpdate({ error: null, loading: true });

    try {
      const modifiedFields = getModifiedFields(vehicleData, initialData);
      const response = await api.patch(`/api/vehicles/${id}`, modifiedFields);
      const updatedVehicle = response.data?.content;

      if (!updatedVehicle) {
        throw new Error("Échec de la mise à jour");
      }

      setVehicleData(updatedVehicle);
    } catch (error: any) {
      setQryUpdate({ error: error.message || "Erreur lors de la mise à jour", loading: false });
    } finally {
      setQryUpdate((prev) => ({ ...prev, loading: false }));
    }
  };
  
  const handleReset = () => {
    if (initialData) {
      setVehicleData(initialData);
    }
  };

  const getModifiedFields = (
    current: VehicleType,
    initial: VehicleType
  ): Partial<VehicleType> => {
    const modified: any = {};
  
    if (current.id !== initial.id) modified.id = current.id;
    if (current.title !== initial.title) modified.title = current.title;
    if (current.description !== initial.description) modified.description = current.description;
    if (current.available !== initial.available) modified.available = current.available;
    if (current.brand !== initial.brand) modified.brand = current.brand;
    if (current.model !== initial.model) modified.model = current.model;
    if (current.year !== initial.year) modified.year = current.year;
    if (current.horsepower !== initial.horsepower) modified.horsepower = current.horsepower;
    if (current.price !== initial.price) modified.price = current.price;
    if (current.category !== initial.category) modified.category = current.category;
    if (current.motor !== initial.motor) modified.motor = current.motor;
    if (current.color !== initial.color) modified.color = current.color;
    if (current.mileage !== initial.mileage) modified.mileage = current.mileage;
    if (current.status !== initial.status) modified.status = current.status;
  
    return modified;
  };
  
  
  return (
      <div className="voiture_detail flex flex-col">
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
                <div className="flex align-center mb-40 h-auto" style={{justifyContent: 'center', height:'auto'}}>
                  <div className="shadow-2xl mx-4 my-4 px-12 py-8 rounded-xl max-w-3/4">
                    <h2 className="text-2xl font-bold">Mise à jour de l'annonce : {vehicleData.title}</h2>

                    <form onSubmit={handleSubmit} className="my-4">

                      <div className="grid md:grid-cols-1 md:gap-6">
                        <div className="mb-2">
                          <label className="add_user_label" htmlFor="title">Titre</label>
                          <input id="title" name="title" value={vehicleData.title} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-1 md:gap-6">
                        <div className="mb-2">

                            <label className="add_user_label" htmlFor="description">Description</label>
                            <textarea 
                              name="description" 
                              id="description" // Correction de l'ID pour qu'il corresponde à "description"
                              rows={3} 
                              onChange={handleChangeDescription} 
                              className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none" 
                              value={vehicleData.description} // Lier la valeur au champ de l'état
                              placeholder="Description ..."
                            ></textarea>
                          </div>
                      </div>

                      <div className="grid md:grid-cols-3 md:gap-6">
                        <div className="mb-2">
                        <label  htmlFor="status" className="block mb-2 text-sm font-medium">Statut</label>
                        <select id="status" name="status" value={vehicleData.status} onChange={handleChange}  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                            <option value="sale">Vente</option>
                            <option value="rent">Location</option>
                          </select>
                        </div>
                        <div className="mb-2 inline-flex  items-center">
                          <label className="inline-flex items-center flex-col cursor-pointer" >
                            <input type="checkbox" value='' checked={vehicleData.available} className="sr-only peer" onClick={handleCheckboxChange}/>
                            <span className="ms-3 mb-2 text-sm font-medium text-gray-900">Disponible</span>
                            <div className="relative my-2 w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 md:gap-6">
                        <div className="mb-2">
                          <label className="add_user_label" htmlFor="brand">Marque</label>
                          <input id="brand" name="brand" value={vehicleData.brand} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" />
                        </div>
                        <div className="mb-2">
                          <label className="add_user_label" htmlFor="model">Model</label>
                          <input id="model" name="model" value={vehicleData.model} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 md:gap-6">
                        <div className="mb-2">
                          <label className="add_user_label" htmlFor="category">Categorie</label>
                          <input id="category" name="category" value={vehicleData.category} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" />
                        </div>
                        <div className="mb-2">
                          <label className="add_user_label" htmlFor="horsepower">Puissance</label>
                          <input type="number" min={0} max={2000} id="horsepower" name="horsepower" value={vehicleData.horsepower} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" />
                        </div>
                        <div className="mb-2">
                          <label className="add_user_label" htmlFor="motor">Moteur</label>
                          <input id="motor" name="motor" value={vehicleData.motor} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 md:gap-6">
                        <div className="mb-2">
                          <label className="add_user_label" htmlFor="price">Prix</label>
                          <input type="number" min={0} id="price" name="price" value={vehicleData.price} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" />
                        </div>
                        <div className="mb-2">
                          <label className="add_user_label" htmlFor="mileage">Nombre de kilometre</label>
                          <input type="number" min={0} id="mileage" name="mileage" value={vehicleData.mileage} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" />
                        </div>
                        <div className="mb-2">
                          <label className="add_user_label" htmlFor="brand">Année de construction</label>
                          <input id="year" name="year" type="number" min={1900} max={2100} step={1} value={vehicleData.year} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 md:gap-6">
                        <div className="mb-2">
                          <label className="add_user_label" htmlFor="color">Couleur</label>
                          <input id="color" name="color" value={vehicleData.color} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" />
                        </div>
                      </div>

                      <div className="div_button">
                        <button type="submit" disabled={qryUpdate.loading} className="bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline cursor-pointer text-white font-bold py-2 px-4 rounded-lg mx-2">
                          {qryUpdate.loading ? 'Création...' : 'Modifier l\'Annonce'}
                        </button>

                        <button type="button" onClick={handleReset} className="bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline cursor-pointer text-white font-bold py-2 px-4 rounded-lg mx-2">
                          Réinitialiser
                        </button>
                      </div>
                    </form>
                  </div>
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

export default UpdateVehicle;


