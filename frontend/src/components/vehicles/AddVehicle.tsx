import { useState, ChangeEvent, FormEvent } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import "../../styles/AddPages.css";

interface VehicleData {
  title: string;
  description: string;
  brand: string;
  model: string;
  year: string;
  horsepower: string;
  price: string;
  category: string;
  motor: string;
  color: string;
  mileage: string;
  available: boolean;
  status: string;
}

const AddVehicle: React.FC = () => {
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    title: '',
    description: '',
    brand: '',
    model: '',
    year: '',
    horsepower: '',
    price: '',
    category: '',
    motor: '',
    color: '',
    mileage: '',
    available: true,
    status: 'sale', // ou 'rent' par défaut
  });

  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleData({
      ...vehicleData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (Number(vehicleData.year) < 1900 || Number(vehicleData.year) > new Date().getFullYear()) {
      setMessage("Année invalide.");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'annonce.");
      }

      setMessage("Annonce créée avec succès !");
      handleReset();

    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la création de l'annonce.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setVehicleData({
      title: '',
      description: '',
      brand: '',
      model: '',
      year: '',
      horsepower: '',
      price: '',
      category: '',
      motor: '',
      color: '',
      mileage: '',
      available: true,
      status: 'sale',
    });
  };

  return (
    <div>
      <Header />
      <div className="add_page">
        <div className="add_page_card shadow-2xl max-w-2xl">
          <h2>Nouvelle Annonce</h2>

          {message && (
            <p className={`text-center mb-4 text-lg font-semibold ${message.includes('succès') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Champs obligatoires */}
            <div className="mb-4">
              <label className="add_user_label" htmlFor="title">Titre</label>
              <input id="title" name="title" value={vehicleData.title} onChange={handleChange} required className="shadow focus:outline-none focus:shadow-outline p-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="mb-4">
              <label className="add_user_label" htmlFor="description">Description</label>
              <textarea id="description" name="description" value={vehicleData.description} onChange={handleChange} className="shadow focus:outline-none focus:shadow-outline p-2 border border-gray-300 rounded-lg" />
            </div>

            {Object.entries(vehicleData).filter(([key]) =>
              !['title', 'description', 'available', 'status'].includes(key)
            ).map(([field, value]) => (
              <div className="mb-4" key={field}>
                <label className="add_user_label" htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={field}
                  name={field}
                  value={value}
                  onChange={handleChange}
                  className="shadow focus:outline-none focus:shadow-outline p-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="add_user_label" htmlFor="status">Statut</label>
              <select id="status" name="status" value={vehicleData.status} onChange={handleChange} required className="shadow focus:outline-none focus:shadow-outline p-2 border border-gray-300 rounded-lg">
                <option value="sale">Vente</option>
                <option value="rent">Location</option>
              </select>
            </div>

            <div className="div_button">
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline cursor-pointer text-white font-bold py-2 px-4 rounded-lg mx-2">
                {loading ? 'Création...' : 'Créer l\'Annonce'}
              </button>

              <button type="button" onClick={handleReset} className="bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline cursor-pointer text-white font-bold py-2 px-4 rounded-lg mx-2">
                Réinitialiser
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddVehicle;