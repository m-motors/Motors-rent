-- Utilisation de la base de données
-- Suppresion et recreation 
DROP DATABASE app;
CREATE DATABASE app;
use app;

-- Création de la table user avec user_role en ENUM
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    user_role ENUM('client', 'admin') NOT NULL DEFAULT 'client',
    password VARCHAR(255) NOT NULL
);

-- Insertion des utilisateurs
INSERT INTO users (email, first_name, last_name, is_active, user_role, created_at, password) 
VALUES
    ('user1@example.com', 'Alice', 'Dupont', TRUE, 'client', NOW(), 'alice'), 
    ('user2@example.com', 'Bob', 'Martin', TRUE, 'client', NOW(), 'bob'), 
    ('admin@example.com', 'Charlie', 'Durand', TRUE, 'admin', NOW(), 'charlie'),
    ('user3@example.com', 'David', 'Lemoine', TRUE, 'client', NOW(), 'david'), 
    ('user4@example.com', 'Emma', 'Morel', TRUE, 'client', NOW(), '$2y$10$abcdefghijklmnopqrstuv');

-- Création de la table vehicule
CREATE TABLE vehicules(
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    `year` INT(4) NOT NULL,
    horsepower INT(10) NOT NULL,
    price INT(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    motor VARCHAR(100) NOT NULL,
    color VARCHAR(20) NOT NULL,
    mileage INT(20) NOT NULL
);

-- Insertion des véhicules
INSERT INTO vehicules (brand, model, `year`, horsepower, price, category, motor, color, mileage) 
VALUES
    ('Toyota', 'Corolla', 2021, 130, 20000, 'Compact', 'Essence', 'Rouge', 15000),
    ('Ford', 'Mustang', 2020, 450, 35000, 'Sport', 'Essence', 'Bleu', 20000),
    ('BMW', 'X5', 2019, 350, 50000, 'SUV', 'Diesel', 'Noir', 25000),
    ('Tesla', 'Model 3', 2023, 283, 45000, 'Berline', 'Électrique', 'Blanc', 5000),
    ('Audi', 'A4', 2022, 190, 38000, 'Berline', 'Essence', 'Gris', 12000),
    ('Volkswagen', 'Golf', 2021, 150, 25000, 'Compact', 'Diesel', 'Vert', 18000),
    ('Mercedes', 'C-Class', 2020, 255, 40000, 'Berline', 'Essence', 'Argent', 30000),
    ('Nissan', 'Leaf', 2021, 150, 35000, 'Hatchback', 'Électrique', 'Bleu', 10000),
    ('Peugeot', '208', 2021, 100, 20000, 'Compact', 'Essence', 'Jaune', 8000),
    ('Honda', 'Civic', 2020, 180, 22000, 'Compact', 'Essence', 'Rouge', 22000);

-- Création de la table application
CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    vehicule_id INT NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'En cours de validation',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicule_id) REFERENCES vehicules(id) ON DELETE CASCADE
);

-- Création de la table documents
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    application_id INT NOT NULL,
    document_type VARCHAR(50) NOT NULL, 
    link VARCHAR(255) NOT NULL,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);
