import "../../styles/VehicleCard.css"
import { useNavigate } from "react-router-dom";
function VehiculeCard() {
    const navigate = useNavigate();
    const isAdmin = false
    const handleClick = (id: number) => {
      navigate(`voitures/${id}`);
    }
    const data: any = [
      { id: 1, created_at: "2025-02-11 22:02:12", available: true, brand: "Toyota", model: "Corolla", year: 2020, horsepower: 132, price: 20000, category: "Sedan", motor: "Gasoline", color: "White", mileage: 15000 },
      { id: 2, created_at: "2025-02-11 22:02:12", available: true, brand: "Honda", model: "Civic", year: 2019, horsepower: 158, price: 22000, category: "Sedan", motor: "Gasoline", color: "Black", mileage: 12000 },
      { id: 3, created_at: "2025-02-11 22:02:12", available: true, brand: "Ford", model: "Mustang", year: 2021, horsepower: 450, price: 35000, category: "Coupe", motor: "Gasoline", color: "Red", mileage: 5000 },
      { id: 4, created_at: "2025-02-11 22:02:12", available: true, brand: "Chevrolet", model: "Camaro", year: 2020, horsepower: 275, price: 33000, category: "Coupe", motor: "Gasoline", color: "Blue", mileage: 8000 },
      { id: 5, created_at: "2025-02-11 22:02:12", available: true, brand: "BMW", model: "3 Series", year: 2018, horsepower: 255, price: 28000, category: "Sedan", motor: "Gasoline", color: "Gray", mileage: 20000 },
      { id: 6, created_at: "2025-02-11 22:02:12", available: true, brand: "Mercedes", model: "C-Class", year: 2019, horsepower: 255, price: 30000, category: "Sedan", motor: "Gasoline", color: "Silver", mileage: 18000 },
      { id: 7, created_at: "2025-02-11 22:02:12", available: true, brand: "Audi", model: "A4", year: 2020, horsepower: 261, price: 32000, category: "Sedan", motor: "Gasoline", color: "Black", mileage: 15000 },
      { id: 8, created_at: "2025-02-11 22:02:12", available: true, brand: "Tesla", model: "Model 3", year: 2021, horsepower: 283, price: 40000, category: "Sedan", motor: "Electric", color: "White", mileage: 10000 },
      { id: 9, created_at: "2025-02-11 22:02:12", available: true, brand: "Volkswagen", model: "Golf", year: 2018, horsepower: 147, price: 19000, category: "Hatchback", motor: "Gasoline", color: "Blue", mileage: 25000 },
      { id: 10, created_at: "2025-02-11 22:02:12", available: true, brand: "Subaru", model: "Outback", year: 2019, horsepower: 182, price: 27000, category: "SUV", motor: "Gasoline", color: "Green", mileage: 22000 },
      { id: 11, created_at: "2025-02-11 22:02:12", available: true, brand: "Nissan", model: "Altima", year: 2020, horsepower: 188, price: 25000, category: "Sedan", motor: "Gasoline", color: "Gray", mileage: 16000 },
      { id: 12, created_at: "2025-02-11 22:02:12", available: true, brand: "Hyundai", model: "Tucson", year: 2021, horsepower: 187, price: 28000, category: "SUV", motor: "Gasoline", color: "Red", mileage: 12000 },
      { id: 13, created_at: "2025-02-11 22:02:12", available: true, brand: "Kia", model: "Sportage", year: 2019, horsepower: 181, price: 26000, category: "SUV", motor: "Gasoline", color: "Black", mileage: 19000 },
      { id: 14, created_at: "2025-02-11 22:02:12", available: true, brand: "Mazda", model: "CX-5", year: 2020, horsepower: 187, price: 29000, category: "SUV", motor: "Gasoline", color: "White", mileage: 15000 },
      { id: 15, created_at: "2025-02-11 22:02:12", available: true, brand: "Jeep", model: "Wrangler", year: 2021, horsepower: 285, price: 38000, category: "SUV", motor: "Gasoline", color: "Yellow", mileage: 8000 },
      { id: 16, created_at: "2025-02-11 22:02:12", available: true, brand: "Lexus", model: "RX", year: 2018, horsepower: 295, price: 33000, category: "SUV", motor: "Gasoline", color: "Silver", mileage: 28000 },
      { id: 17, created_at: "2025-02-11 22:02:12", available: true, brand: "Chevrolet", model: "Silverado", year: 2019, horsepower: 355, price: 35000, category: "Truck", motor: "Gasoline", color: "Blue", mileage: 20000 },
      { id: 18, created_at: "2025-02-11 22:02:12", available: true, brand: "Ford", model: "F-150", year: 2020, horsepower: 400, price: 42000, category: "Truck", motor: "Gasoline", color: "Black", mileage: 15000 },
      { id: 19, created_at: "2025-02-11 22:02:12", available: true, brand: "Ram", model: "1500", year: 2021, horsepower: 395, price: 44000, category: "Truck", motor: "Gasoline", color: "Red", mileage: 10000 },
      { id: 20, created_at: "2025-02-11 22:02:12", available: true, brand: "Porsche", model: "911", year: 2022, horsepower: 379, price: 90000, category: "Coupe", motor: "Gasoline", color: "White", mileage: 5000 }
    ];
  
    return (
      <div className="vehicule_cards">
        
        <div className="vehicule_list">
          {data.map((vehicule: any) => (
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
                  <p className="text-red-700">Supprimer</p>
                  </div>
              )} 
              <div className="vehicule_card_description">
                <h3>{vehicule.brand} {vehicule.model}</h3>
                <p style={{ margin: "5px 0", color: "#555" }}>{vehicule.year} • {vehicule.category} • {vehicule.color}</p>
                
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
  