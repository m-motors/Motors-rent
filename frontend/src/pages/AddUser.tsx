import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useState } from 'react';

const AddUser = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [message, setMessage] = useState('');

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        fetch('/api/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            setMessage(data.message);
        })
        .catch(error => {
            console.error('Erreur:', error);
            setMessage('Une erreur est survenue.');
        });
    };

    return (
        <div>
            <Header />
        <div className="add_page">
            <div className="add_page_card shadow-2xl max-w-2xl">
                <h2>Ajouter un utilisateur</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="add_user_label" htmlFor="username">Nom d'utilisateur :</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="shadow focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="form-group">
                        <label className="add_user_label" htmlFor="email">Email :</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="shadow focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="form-group">
                        <label className="add_user_label" htmlFor="password">Mot de passe :</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="shadow focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="form-group">
                        <label className="add_user_label" htmlFor="role">Rôle :</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="shadow focus:outline-none focus:shadow-outline mb-4"
                        >
                            <option value="user">Utilisateur</option>
                            <option value="admin">Administrateur</option>
                        </select>
                    </div>
                    <div className="div_button">
                        <button
                        type="submit"
                        className="hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                        >
                            Ajouter Utilisateur
                        </button>
                    </div>
                </form>
                {message && <div className="message">{message}</div>}
            </div>
        </div>
            <Footer />
        </div>
    );
};

export default AddUser;
