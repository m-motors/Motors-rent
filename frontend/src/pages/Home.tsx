import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Content from "../components/vehicles/Content";
const Home: React.FC = () => {
  return (
    <div className="home min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Content />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
