// src/CreateAdPage.js
import { useState } from "react";

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import "../../styles/AddPages.css"

const AddVehicle = () => {
  const [vehicleData, setVehicleData] = useState({
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setVehicleData({
      ...vehicleData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Logique de soumission du formulaire
    console.log('Annonce créée :', vehicleData);
  };

  return (
    <div>
        <Header />
        <div className="add_page">
        <div className="add_page_card shadow-2xl max-w-2xl">
            <h2>une Annonce de Voiture</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="add_user_label" htmlFor="brand">
                  Marque
                </label>
                <input name="brand" value={vehicleData.brand} onChange={handleChange} className="shadow focus:outline-none focus:shadow-outline" required/>
            </div>
            <div className="mb-4">
                <label className="add_user_label" htmlFor="model">
                Modèle
                </label>
                <input name="model" value={vehicleData.model} onChange={handleChange} className="shadow focus:outline-none focus:shadow-outline" required/>
            </div>
            <div className="mb-4">
                <label className="add_user_label" htmlFor="year">
                Année
                </label>
                <input name="year" value={vehicleData.year} onChange={handleChange} className="shadow focus:outline-none focus:shadow-outline" required/>
            </div>
            <div className="mb-4">
                <label className="add_user_label" htmlFor="horsepower">
                Puissance (CV)
                </label>
                <input name="horsepower" value={vehicleData.horsepower} onChange={handleChange} className="shadow focus:outline-none focus:shadow-outline" required/>
            </div>
            <div className="mb-4">
                <label className="add_user_label" htmlFor="price">
                Prix (€)
                </label>
                <input name="price" value={vehicleData.price} onChange={handleChange} className="shadow focus:outline-none focus:shadow-outline" required/>
            </div>
            <div className="mb-4">
                <label className="add_user_label" htmlFor="category">
                Catégorie
                </label>
                <input name="category" value={vehicleData.category} onChange={handleChange} className="shadow focus:outline-none focus:shadow-outline" required/>
            </div>
            <div className="mb-4">
                <label className="add_user_label" htmlFor="motor">
                Moteur
                </label>
                <input name="motor" value={vehicleData.motor} onChange={handleChange} className="shadow focus:outline-none focus:shadow-outline" required/>
            </div>
            <div className="mb-4">
                <label className="add_user_label" htmlFor="color">
                Couleur
                </label>
                <input name="color" value={vehicleData.color} onChange={handleChange} className="shadow focus:outline-none focus:shadow-outline" required/>
            </div>
            <div className="mb-4">
                <label className="add_user_label" htmlFor="mileage">
                Kilométrage (km)
                </label>
                <input name="mileage" value={vehicleData.mileage} onChange={handleChange} className="shadow focus:outline-none focus:shadow-outline" required/>
            </div>
            <div className="div_button">
                <button
                type="submit"
                className="hover:bg-blue-700 focus:outline-none focus:shadow-outline">
                Créer l'Annonce
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
