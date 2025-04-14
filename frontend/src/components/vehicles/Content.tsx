import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiRefreshCcw } from "react-icons/fi";

import "../../styles/Filters.css";
import "../../styles/VehicleCard.css"
import { useApi } from "../../hooks/useApi";

export type VehicleType = {
  id: number,
  title: string,
  description: string,
  created_at: Date,
  available: boolean,
  brand: string,
  model: string,
  year: number,
  horsepower: number,
  price: number,
  category: string,
  motor: string,
  color: string,
  mileage: number,
  status: string
}


function Filters() {
  const [vehicles, setvehicles] = useState<VehicleType[]>();
  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    year: "",
    horsepower: "",
    price: "",
    motor: "",
    status: ""
  });

  const isAdmin = true;
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    navigate(`/voitures/${id}`);
  };

  const [qry, setQry] = useState<{
    error: string | null;
    loading: boolean;
  }>({
    error: null,
    loading: false,
  });

  const api = useApi();  

  const fetchVehicles = async () => {
    setQry((prev) => ({ ...prev, loading: true }));
  
    try {
      const response = await api.get("/api/vehicles");

      
      setvehicles(response.data.content.vehicles)
      
    } catch (error: any) {
      console.error(error);
      setQry((prev) => ({
        ...prev,
        error: error.message ?? "Echec lors de la récupérion des vehicles",
      }));
    } finally {
      setQry((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(()=>{
    fetchVehicles()
  }, [])

  const filteredVehicles = vehicles?.filter((car) => {
    const { status, brand, category, year, horsepower, price, motor } = filters;
    return (
      (!status || car.status === status) &&
      (!brand || car.brand === brand) &&
      (!category || car.category === category) &&
      (!year || car.year === parseInt(year)) &&
      (!horsepower || car.horsepower === parseInt(horsepower)) &&
      (!price || car.price === parseInt(price)) &&
      (!motor || car.motor === motor)
    );
  });

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div>
      {
        qry.loading ? (
          <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : qry.error ? (
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
          <div className="filters_container"> 
            <ul className="filters_list">
              <li>
                <select name="status" id="status" className="filter_select" onChange={handleFilterChange}>
                  <option value="">Status</option>
                  {[...new Set(vehicles?.map((car) => car.status))].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </li>
              <li>
                <select name="brand" id="brand" className="filter_select" onChange={handleFilterChange}>
                  <option value="">Marque</option>
                  {[...new Set(vehicles?.map((car) => car.brand))].map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </li>
              <li>
                <select name="category" id="category" className="filter_select" onChange={handleFilterChange}>
                  <option value="">Catégorie</option>
                  {[...new Set(vehicles?.map((car) => car.category))].map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </li>
              <li>
                <select name="year" id="year" className="filter_select" onChange={handleFilterChange}>
                  <option value="">Année</option>
                  {[...new Set(vehicles?.map((car) => car.year))].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </li>
              <li>
                <select name="horsepower" id="horsepower" className="filter_select" onChange={handleFilterChange}>
                  <option value="">Puissance</option>
                  {[...new Set(vehicles?.map((car) => car.horsepower))].map((horsepower) => (
                    <option key={horsepower} value={horsepower}>{horsepower} ch</option>
                  ))}
                </select>
              </li>
              <li>
                <select name="price" id="price" className="filter_select" onChange={handleFilterChange}>
                  <option value="">Prix</option>
                  {[...new Set(vehicles?.map((car) => car.price))].map((price) => (
                    <option key={price} value={price}>${price.toLocaleString()}</option>
                  ))}
                </select>
              </li>
              <li>
                <select name="motor" id="motor" className="filter_select" onChange={handleFilterChange}>
                  <option value="">Motorisation</option>
                  {[...new Set(vehicles?.map((car) => car.motor))].map((motor) => (
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
                <Link to="/voitures/add">
                  <button className="bg-green-500 text-white py-2 px-3 flex items-center justify-center rounded-xl cursor-pointer">
                    Ajouter une annonce <FiPlus />
                  </button>
                </Link>
              </div>
            )}
            <div className="vehicule_list">
              {filteredVehicles?.map((vehicle: VehicleType) => (
                <div key={vehicle.id} onClick={() => handleClick(vehicle.id)} className="vehicule_card relative">
                  <div className="absolute flex justify-center m-2 text-sm" style={{ width: "95%"}}>
                    {vehicle.status === "Location" ? (
                      <span className="bg-yellow-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">Location</span>
                    ) : vehicle.status === "Achat" ? (
                      <span className="bg-blue-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">Achat</span>
                    ) : null }
                  </div>
                  <img
                    src="https://image.web.stellantis.com/lib/fe34117175640475711d70/m/1/5bebd465-e526-406f-b012-45faeee97c5a.jpg"
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="vehicule_img"
                  />
                  <div className="vehicule_card_description">
                    <div className="vehicule_card_description_header">
                      <h3>{vehicle.brand} {vehicle.model}</h3> 
                      <h3>{vehicle.price} €</h3>
                    </div>
                    <p style={{ margin: "5px 0", color: "#555" }}>
                      {vehicle.year} • {vehicle.category} • {vehicle.color}
                    </p>
                    <div className="vehicule_card_bottom">
                      <span style={{ color: vehicle.available ? "green" : "red" }}>
                        {vehicle.available ? "Disponible ✅" : "Indisponible ❌"}
                      </span>
                      <span>{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Filters
