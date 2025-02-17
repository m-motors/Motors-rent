import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Filters from "../components/vehicles/filters";
import VehicleCard from "../components/vehicles/VehicleCard";

const Home: React.FC = () => {
  return (
    <div className="home" style={{ height: '100vh' }}>
      <Header />
      <Filters />
      <VehicleCard />
      <Footer />
    </div>
  );
};

export default Home;
