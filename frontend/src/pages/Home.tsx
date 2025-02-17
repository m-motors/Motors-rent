import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Filters from "../components/vehicles/filters";
import VehiculeCard from "../components/vehicles/VehicleCard";

const Home: React.FC = () => {
  return (
    <div className="home" style={{ height: '100vh' }}>
      <Header />
      <Filters />
      <VehiculeCard />
      <Footer />
    </div>
  );
};

export default Home;
