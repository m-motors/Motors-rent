// src/CreateAdPage.js
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import React, { useState } from "react";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({
      ...vehicleData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de soumission du formulaire
    console.log('Annonce créée :', vehicleData);
  };

  return (
    <div>
        <Header />
        <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Créer une Annonce de Voiture</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand">
                Marque
                </label>
                <input
                type="text"
                id="brand"
                name="brand"
                value={vehicleData.brand}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
                Modèle
                </label>
                <input
                type="text"
                id="model"
                name="model"
                value={vehicleData.model}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                Année
                </label>
                <input
                type="number"
                id="year"
                name="year"
                value={vehicleData.year}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="horsepower">
                Puissance (CV)
                </label>
                <input
                type="number"
                id="horsepower"
                name="horsepower"
                value={vehicleData.horsepower}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Prix (€)
                </label>
                <input
                type="number"
                id="price"
                name="price"
                value={vehicleData.price}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Catégorie
                </label>
                <input
                type="text"
                id="category"
                name="category"
                value={vehicleData.category}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="motor">
                Moteur
                </label>
                <input
                type="text"
                id="motor"
                name="motor"
                value={vehicleData.motor}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
                Couleur
                </label>
                <input
                type="text"
                id="color"
                name="color"
                value={vehicleData.color}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mileage">
                Kilométrage (km)
                </label>
                <input
                type="number"
                id="mileage"
                name="mileage"
                value={vehicleData.mileage}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
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
