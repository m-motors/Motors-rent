import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/ApplicationForm.css"
import vehicleData from '../components/data/vehicleData.json';

const ApplicationForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'Rental', // Par défaut, le type est "Rental"
    documents: {
      idCard: null,
      drivingLicense: null,
      proofOfAddress: null,
    },
  });

  const voiture = vehicleData.find((car) => car.id === parseInt(id));

  if (!voiture) {
    return <h2>Véhicule non trouvé</h2>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de soumission du formulaire
    console.log('Annonce créée :', vehicleData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      documents: {
        ...prevData.documents,
        [name]: files ? files[0] : null,
      },
    }));
  };

  return (
    <div>
      <Header />
      <div className="application_form">
        <div className="application_form_card">
          <h2>Déposer un dossier pour {voiture.brand} {voiture.model}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="application_form_label" htmlFor="type">Type de demande</label>
              <select id="type" name="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="Rental">Location</option>
                <option value="Buy">Achat</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="application_form_label" htmlFor="idCard">Carte d'identité (PDF)</label>
              <input className="shadow focus:outline-none focus:shadow-outline" type="file" id="idCard" name="idCard" accept="application/pdf" onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="application_form_label" htmlFor="drivingLicense">Permis de conduire (PDF)</label>
              <input className="shadow focus:outline-none focus:shadow-outline" type="file" id="drivingLicense" name="drivingLicense" accept="application/pdf" onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="application_form_label" htmlFor="proofOfAddress">Justificatif de domicile (PDF)</label>
              <input className="shadow focus:outline-none focus:shadow-outline" type="file" id="proofOfAddress" name="proofOfAddress" accept="application/pdf" onChange={handleChange} required />
            </div>
            <div className="div_button">
              <button type="submit" className="hover:bg-blue-700 focus:outline-none focus:shadow-outline">
                Soumettre le dossier
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplicationForm;
