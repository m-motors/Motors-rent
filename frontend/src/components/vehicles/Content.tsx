import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiRefreshCcw } from "react-icons/fi";
import vehicleData from "../data/vehicleData.json";
import "../../styles/Filters.css";
import "../../styles/VehicleCard.css"

function Filters() {
  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    year: "",
    horsepower: "",
    price: "",
    motor: "",
    status: ""
  });

  const isAdmin = false;
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    navigate(`/voitures/${id}`);
  };

  const [filteredData, setFilteredData] = useState(vehicleData);

  const resetFilters = () => {
    setFilters({
      brand: "",
      category: "",
      year: "",
      horsepower: "",
      price: "",
      motor: "",
      status: ""
    });
  };

  useEffect(() => {
    const filterVehicles = () => {
      return vehicleData.filter((car) => {
        return (
          (filters.status === "" || car.status === filters.status) &&
          (filters.brand === "" || car.brand === filters.brand) &&
          (filters.category === "" || car.category === filters.category) &&
          (filters.year === "" || car.year === parseInt(filters.year)) &&
          (filters.horsepower === "" || car.horsepower === parseInt(filters.horsepower)) &&
          (filters.price === "" || car.price === parseInt(filters.price)) &&
          (filters.motor === "" || car.motor === filters.motor)
        );
      });
    };

    setFilteredData(filterVehicles());
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="filters_container">
      <ul className="filters_list">
        <li>
          <select name="status" id="status" className="filter_select" onChange={handleFilterChange}>
            <option value="">Status</option>
            {[...new Set(vehicleData.map((car) => car.status))].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </li>
        <li>
          <select name="brand" id="brand" className="filter_select" onChange={handleFilterChange}>
            <option value="">Marque</option>
            {[...new Set(vehicleData.map((car) => car.brand))].map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </li>
        <li>
          <select name="category" id="category" className="filter_select" onChange={handleFilterChange}>
            <option value="">Catégorie</option>
            {[...new Set(vehicleData.map((car) => car.category))].map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </li>
        <li>
          <select name="year" id="year" className="filter_select" onChange={handleFilterChange}>
            <option value="">Année</option>
            {[...new Set(vehicleData.map((car) => car.year))].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </li>
        <li>
          <select name="horsepower" id="horsepower" className="filter_select" onChange={handleFilterChange}>
            <option value="">Puissance</option>
            {[...new Set(vehicleData.map((car) => car.horsepower))].map((horsepower) => (
              <option key={horsepower} value={horsepower}>{horsepower} ch</option>
            ))}
          </select>
        </li>
        <li>
          <select name="price" id="price" className="filter_select" onChange={handleFilterChange}>
            <option value="">Prix</option>
            {[...new Set(vehicleData.map((car) => car.price))].map((price) => (
              <option key={price} value={price}>${price.toLocaleString()}</option>
            ))}
          </select>
        </li>
        <li>
          <select name="motor" id="motor" className="filter_select" onChange={handleFilterChange}>
            <option value="">Motorisation</option>
            {[...new Set(vehicleData.map((car) => car.motor))].map((motor) => (
              <option key={motor} value={motor}>{motor}</option>
            ))}
          </select>
        </li>
        <button onClick={() => resetFilters()} className="cursor-pointer" title="Réinitialiser les filtres">
          <FiRefreshCcw />
        </button>
      </ul>
      {isAdmin && (
        <div className="flex justify-center items-center">
          <Link to="/addVehicle">
            <button className="bg-green-500 text-white py-2 px-3 flex items-center justify-center rounded-xl cursor-pointer">
              Ajouter une annonce <FiPlus />
            </button>
          </Link>
        </div>
      )}
      <div className="vehicule_list">
        {filteredData.map((vehicule) => (
          <div key={vehicule.id} onClick={() => handleClick(vehicule.id)} className="vehicule_card relative">
            {isAdmin && (
              <div className="absolute flex justify-between m-2 text-sm" style={{ width: "95%"}}>
                <button className="bg-blue-700">Modifier</button>
                <button className="bg-red-700"> Supprimer </button>
              </div>
            )}
            <div className="absolute flex justify-center m-2 text-sm" style={{ width: "95%"}}>
              {vehicule.status === "Location" ? (
                <span className="bg-red-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">Location</span>
              ) : vehicule.status === "Achat" ? (
                <span className="bg-blue-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">Achat</span>
              ) : null }
            </div>
            <img
              src="https://image.web.stellantis.com/lib/fe34117175640475711d70/m/1/5bebd465-e526-406f-b012-45faeee97c5a.jpg"
              alt={`${vehicule.brand} ${vehicule.model}`}
              className="vehicule_img"
            />
            <div className="vehicule_card_description">
              <div className="vehicule_card_description_header">
                <h3>{vehicule.brand} {vehicule.model}</h3> 
                <h3>{vehicule.price} €</h3>
              </div>
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

export default Filters
