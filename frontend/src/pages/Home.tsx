import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Content from "../components/vehicles/Content";
const Home: React.FC = () => {
  return (
    <div className="home" style={{ height: '100vh' }}>
      <Header />
      <Content />
      <Footer />
    </div>
  );
};

export default Home;
