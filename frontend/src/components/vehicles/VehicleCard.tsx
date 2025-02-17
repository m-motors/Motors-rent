import "../../styles/VehicleCard.css"
import { useNavigate } from "react-router-dom";
function VehiculeCard() {
    const navigate = useNavigate();
    const handleClick = (id: number) => {
      navigate(`voitures/${id}`);
    }
    const data: any = [
      { id: 1, created_at: "2025-02-11 22:02:12", available: true, brand: "Toyota", model: "Corolla", year: 2020, horsepower: 132, price: 20000, category: "Sedan", motor: "Gasoline", color: "White", mileage: 15000 },
      { id: 2, created_at: "2025-02-11 22:02:12", available: true, brand: "Honda", model: "Civic", year: 2019, horsepower: 158, price: 22000, category: "Sedan", motor: "Gasoline", color: "Black", mileage: 12000 },
      { id: 3, created_at: "2025-02-11 22:02:12", available: true, brand: "Ford", model: "Mustang", year: 2021, horsepower: 450, price: 35000, category: "Coupe", motor: "Gasoline", color: "Red", mileage: 5000 },
      { id: 4, created_at: "2025-02-11 22:02:12", available: true, brand: "Chevrolet", model: "Camaro", year: 2020, horsepower: 275, price: 33000, category: "Coupe", motor: "Gasoline", color: "Blue", mileage: 8000 },
      { id: 5, created_at: "2025-02-11 22:02:12", available: true, brand: "BMW", model: "3 Series", year: 2018, horsepower: 255, price: 28000, category: "Sedan", motor: "Gasoline", color: "Gray", mileage: 20000 },
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
  