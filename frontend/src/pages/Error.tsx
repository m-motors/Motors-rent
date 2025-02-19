// src/components/NotFoundPage.tsx
import { Link } from 'react-router-dom';
import '../styles/Error.css';

const NotFoundPage = () => {
  return (
    <div className="error_container">
      <div className="error_content">
        <h1 className="error_title">Oups ! Page non trouvée</h1>
        <img
          src="../assets/404.svg"
          alt="Voiture perdue"
          className="error_image"
        />
        <p className="error_message">
          On dirait que cette voiture a pris un mauvais virage. Revenez à la page d'accueil ou explorez d'autres sections du site.
        </p>
        <div className="error_buttons">
          <Link to="/" className="error_button">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
