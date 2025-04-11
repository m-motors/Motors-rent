// src/CreateAdPage.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import "../../styles/AddPages.css";

interface VehicleData {
  brand: string;
  model: string;
  year: string;
  horsepower: string;
  price: string;
  category: string;
  motor: string;
  color: string;
  mileage: string;
}

const AddVehicle: React.FC = () => {
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    brand: '',
    model: '',
    year: '',
    horsepower: '',
    price: '',
    category: '',
    motor: '',
    color: '',
    mileage: '',
  });

  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      setMessage("Erreur lors de la création de l'annonce.");
      console.error(error);
    } finally {
      setLoading(false);
      console.log(vehicleData);
    }
  };

  const handleReset = () => {
    setVehicleData({
      brand: '',
      model: '',
      year: '',
      horsepower: '',
      price: '',
      category: '',
      motor: '',
      color: '',
      mileage: '',
    });
  };

  return (
    <div>
      <Header />
      <div className="add_page">
        <div className="add_page_card shadow-2xl max-w-2xl">
          <h2>Nouvelle Annonce</h2>

          {message && (
            <p className="text-center mb-4 text-lg font-semibold text-red-600">{message}</p>
          )}

          <form onSubmit={handleSubmit}>
            {Object.keys(vehicleData).map((field) => (
              <div className="mb-4" key={field}>
                <label className="add_user_label" htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={field}
                  name={field}
                  value={vehicleData[field as keyof VehicleData]}
                  onChange={handleChange}
                  className="shadow focus:outline-none focus:shadow-outline p-2 border border-gray-300 rounded-lg"
                  />
                  {/* required */}
              </div>
            ))}

            <div className="div_button">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline cursor-pointer text-white font-bold py-2 px-4 rounded-lg mx-2"
              >
                {loading ? 'Création...' : 'Créer l\'Annonce'}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline cursor-pointer text-white font-bold py-2 px-4 rounded-lg mx-2"
              >
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
