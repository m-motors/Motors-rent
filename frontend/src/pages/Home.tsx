import Filters from "../components/vehicles/filters";
import DropdownMenu from "../components/common/DropdownMenu";
import VeiculCard from "../components/vehicles/VehicleCard";

const Home: React.FC = () => {
  return (
    <div className="home">
      <DropdownMenu />
      <Filters />
      <VeiculCard />
    </div>
  );
};

export default Home;
