const Filters: React.FC = () => {
  const carsData = [
    {
      id: 1,
      created_at: "2025-02-11 22:02:12",
      available: true,
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      horsepower: 132,
      price: 20000,
      category: "Sedan",
      motor: "Gasoline",
      color: "White",
      mileage: 15000,
    },
    {
      id: 2,
      created_at: "2025-02-11 22:02:12",
      available: true,
      brand: "Honda",
      model: "Civic",
      year: 2019,
      horsepower: 158,
      price: 22000,
      category: "Sedan",
      motor: "Gasoline",
      color: "Black",
      mileage: 12000,
    },
    {
      id: 3,
      created_at: "2025-02-11 22:02:12",
      available: true,
      brand: "Ford",
      model: "Mustang",
      year: 2021,
      horsepower: 450,
      price: 35000,
      category: "Coupe",
      motor: "Gasoline",
      color: "Red",
      mileage: 5000,
    },
    {
      id: 4,
      created_at: "2025-02-11 22:02:12",
      available: true,
      brand: "Chevrolet",
      model: "Camaro",
      year: 2020,
      horsepower: 275,
      price: 33000,
      category: "Coupe",
      motor: "Gasoline",
      color: "Blue",
      mileage: 8000,
    },
    {
      id: 5,
      created_at: "2025-02-11 22:02:12",
      available: true,
      brand: "BMW",
      model: "3 Series",
      year: 2018,
      horsepower: 255,
      price: 28000,
      category: "Sedan",
      motor: "Gasoline",
      color: "Gray",
      mileage: 20000,
    },
    {
      id: 6,
      created_at: "2025-02-11 22:02:12",
      available: true,
      brand: "Audi",
      model: "A4",
      year: 2019,
      horsepower: 248,
      price: 30000,
      category: "Sedan",
      motor: "Gasoline",
      color: "Silver",
      mileage: 18000,
    },
    {
      id: 7,
      created_at: "2025-02-11 22:02:12",
      available: true,
      brand: "Mercedes-Benz",
      model: "C-Class",
      year: 2021,
      horsepower: 255,
      price: 40000,
      category: "Sedan",
      motor: "Gasoline",
      color: "White",
      mileage: 7000,
    },
    {
      id: 8,
      created_at: "2025-02-11 22:02:12",
      available: true,
      brand: "Tesla",
      model: "Model 3",
      year: 2021,
      horsepower: 283,
      price: 45000,
      category: "Sedan",
      motor: "Electric",
      color: "Black",
      mileage: 3000,
    },
    {
      id: 9,
      created_at: "2025-02-11 22:02:12",
      available: true,
      brand: "Nissan",
      model: "Altima",
      year: 2020,
      horsepower: 188,
      price: 24000,
      category: "Sedan",
      motor: "Gasoline",
      color: "Blue",
      mileage: 16000,
    },
    {
      id: 10,
      created_at: "2025-02-11 22:02:12",
      available: true,
      brand: "Hyundai",
      model: "Elantra",
      year: 2019,
      horsepower: 147,
      price: 19000,
      category: "Sedan",
      motor: "Gasoline",
      color: "Red",
      mileage: 14000,
    },
  ];
  const data = {
    brands: [
      {
        name: "Toyota",
        origin: "Japon",
      },
      {
        name: "Volkswagen",
        origin: "Allemagne",
      },
      {
        name: "Renault",
        origin: "France",
      },
    ],
    categories: [
      {
        name: "SUV",
      },
      {
        name: "Citadine",
      },
    ],
  };

  return (
    <div className="filter">
      <ul>
        <li>
          <label htmlFor="brand">Brand : </label>
          <select name="brand" id="brand">
            {data.brands.map((brand) => (
              <option key={brand.name} value={brand.name}>
                {brand.name} - {brand.origin}
              </option>
            ))}
          </select>
        </li>
        <li>
          <label htmlFor="categories">Categories : </label>
          <select name="categories" id="categories">
            {data.categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </li>
      </ul>
    </div>
  );
};

export default Filters;
