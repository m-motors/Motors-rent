import Filters from "../components/vehicles/filters";
import DropdownMenu from "../components/common/DropdownMenu";

const Home: React.FC = () => {
  return (
    <div className="home">
      <DropdownMenu />
      <Filters />
    </div>
  );
};

export default Home;
