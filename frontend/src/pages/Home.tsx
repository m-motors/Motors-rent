import Header from "../components/common/Header"
import Filters from "../components/vehicles/filters";
import VehiculeCard from "../components/vehicles/VehicleCard";

const Home: React.FC = () => {
  return (
    <div className="home" style={{ height: '100vh' }}>
      <Header />
      <Filters />
      <VehiculeCard />
    </div>
  );
};

export default Home;
