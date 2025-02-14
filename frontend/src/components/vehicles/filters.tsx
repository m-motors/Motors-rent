const Filters: React.FC = () => {
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
