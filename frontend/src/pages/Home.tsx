import Filters from "../components/vehicles/filters";
import DropdownMenu from "../components/common/DropdownMenu";
import VehiculeCard from "../components/vehicles/VehicleCard";

const Home: React.FC = () => {
  return (
    <div className="home" style={{ height: '100vh' }}>
      <DropdownMenu />
      <Filters />
      <VehiculeCard />
    </div>
  );
};

export default Home;
