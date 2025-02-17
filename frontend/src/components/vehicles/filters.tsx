import "../../styles/Filters.css";

const data: any = [
  { id: 1, created_at: "2025-02-11 22:02:12", available: true, brand: "Toyota", model: "Corolla", year: 2020, horsepower: 132, price: 20000, category: "Sedan", motor: "Gasoline", color: "White", mileage: 15000 },
  { id: 2, created_at: "2025-02-11 22:02:12", available: true, brand: "Honda", model: "Civic", year: 2019, horsepower: 158, price: 22000, category: "Sedan", motor: "Gasoline", color: "Black", mileage: 12000 },
  { id: 3, created_at: "2025-02-11 22:02:12", available: true, brand: "Ford", model: "Mustang", year: 2021, horsepower: 450, price: 35000, category: "Coupe", motor: "Gasoline", color: "Red", mileage: 5000 },
  { id: 4, created_at: "2025-02-11 22:02:12", available: true, brand: "Chevrolet", model: "Camaro", year: 2020, horsepower: 275, price: 33000, category: "Coupe", motor: "Gasoline", color: "Blue", mileage: 8000 },
  { id: 5, created_at: "2025-02-11 22:02:12", available: true, brand: "BMW", model: "3 Series", year: 2018, horsepower: 255, price: 28000, category: "Sedan", motor: "Gasoline", color: "Gray", mileage: 20000 },
];

function Filters() {
  return (
    <div className="filters_container">
      <ul className="filters_list">
        <li>
          <select name="brand" id="brand" className="filter_select">
            <option value="">Marque</option>
            {[...new Set(data.map((car: any) => car.brand))].map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </li>
        <li>
          <select name="category" id="category" className="filter_select">
            <option value="">Catégorie</option>
            {[...new Set(data.map((car: any) => car.category))].map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </li>
        <li>
          <select name="year" id="year" className="filter_select">
            <option value="">Année</option>
            {[...new Set(data.map((car: any) => car.year))].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </li>
        <li>
          <select name="horsepower" id="horsepower" className="filter_select">
            <option value="">Puissance</option>
            {[...new Set(data.map((car: any) => car.horsepower))].map((horsepower) => (
              <option key={horsepower} value={horsepower}>{horsepower} ch</option>
            ))}
          </select>
        </li>
        <li>
          <select name="price" id="price" className="filter_select">
            <option value="">Prix</option>
            {[...new Set(data.map((car: any) => car.price))].map((price) => (
              <option key={price} value={price}>${price.toLocaleString()}</option>
            ))}
          </select>
        </li>
        <li>
          <select name="motor" id="motor" className="filter_select">
            <option value="">Motorisation</option>
            {[...new Set(data.map((car: any) => car.motor))].map((motor) => (
              <option key={motor} value={motor}>{motor}</option>
            ))}
          </select>
        </li>
      </ul>
    </div>
  );
}

export default Filters;
