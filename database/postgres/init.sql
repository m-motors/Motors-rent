DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'groupe11') THEN
        CREATE DATABASE groupe11;
    END IF;
END $$;

-- Connexion à la base de données
\c groupe11;

-- Table: user
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "user_role" TEXT NOT NULL CHECK ("user_role" IN ('client', 'admin')),
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP DEFAULT current_timestamp
);

-- Table: vehicule
CREATE TABLE "vehicules" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(256) NOT NULL,
    "description" VARCHAR(512) DEFAULT NULL,
    "brand" VARCHAR(100),
    "model" VARCHAR(100),
    "year" INTEGER,
    "horsepower" REAL,
    "price" REAL,
    "category" VARCHAR(100),
    "motor" VARCHAR(100),
    "color" VARCHAR(20),
    "mileage" REAL,
    "available" BOOLEAN NOT NULL DEFAULT TRUE,
    "status" TEXT NOT NULL CHECK ("status" IN ('rent', 'sale')),
    "created_at" TIMESTAMP DEFAULT current_timestamp
);

CREATE TYPE client_folder_status AS ENUM (
    'created', 
    'in_validation', 
    'validated', 
    'rejected', 
    'deleted'
);

-- Création de la table client_folders après l'ENUM
CREATE TABLE client_folders (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT current_timestamp,
    user_id INTEGER NOT NULL,
    vehicule_id INTEGER DEFAULT NULL,
    type VARCHAR(50) NOT NULL,
    status client_folder_status DEFAULT 'created'
);

-- Création du type ENUM pour le statut des documents
CREATE TYPE document_status AS ENUM (
    'created',
    'in_validation', 
    'validated', 
    'rejected', 
    'expired'
);

-- Création de la table documents
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT current_timestamp,
    client_folder_id INTEGER NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    link VARCHAR(255) NOT NULL,
    status document_status NOT NULL DEFAULT 'created',
    user_id INTEGER,
    expired_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajout des clés étrangères
ALTER TABLE "client_folders"
    ADD CONSTRAINT fk_client_folder_user FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    ADD CONSTRAINT fk_client_folder_vehicule FOREIGN KEY ("vehicule_id") REFERENCES "vehicules"("id") ON DELETE CASCADE;

ALTER TABLE "documents"
    ADD CONSTRAINT fk_documents_user FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    ADD CONSTRAINT fk_documents_client_folder FOREIGN KEY ("client_folder_id") REFERENCES "client_folders"("id") ON DELETE CASCADE;

-- Insertion des données pour la table `user`
INSERT INTO "users" ("created_at", "email", "first_name", "last_name", "is_active", "user_role", "password") VALUES
('2025-02-11 22:02:12', 'user1@example.com', 'Alice', 'Dupont', TRUE, 'client', 'alice'),
('2025-02-11 22:02:12', 'user2@example.com', 'Bob', 'Martin', TRUE, 'client', 'bob'),
('2025-02-11 22:02:12', 'admin@example.com', 'Charlie', 'Durand', TRUE, 'admin', 'charlie'),
('2025-02-11 22:02:12', 'user3@example.com', 'David', 'Lemoine', TRUE, 'client', 'david'),
('2025-02-11 22:02:12', 'user4@example.com', 'Emma', 'Morel', TRUE, 'client', '$2y$10$abcdefghijklmnopqrstuv');

-- Insertion des données pour la table `vehicules`
INSERT INTO "vehicules" 
("title", "description", "created_at", "brand", "model", "year", "horsepower", "price", "category", "motor", "color", "mileage", "status") VALUES
('Toyota Corolla 2020', 'Sedan essence fiable, économique avec 132 chevaux et 15,000 km.', '2025-02-11 22:02:12', 'Toyota', 'Corolla', 2020, 132, 20000, 'Sedan', 'Gasoline', 'White', 15000, 'rent'),
('Honda Civic 2019', 'Compact sportive, 158 chevaux, faible consommation et bon confort.', '2025-02-11 22:02:12', 'Honda', 'Civic', 2019, 158, 22000, 'Sedan', 'Gasoline', 'Black', 12000, 'rent'),
('Ford Mustang 2021', 'Muscle car iconique avec 450 chevaux, idéale pour les passionnés.', '2025-02-11 22:02:12', 'Ford', 'Mustang', 2021, 450, 35000, 'Coupe', 'Gasoline', 'Red', 5000, 'rent'),
('Chevrolet Camaro 2020', 'Voiture sportive avec un moteur puissant de 275 chevaux.', '2025-02-11 22:02:12', 'Chevrolet', 'Camaro', 2020, 275, 33000, 'Coupe', 'Gasoline', 'Blue', 8000, 'rent'),
('BMW 3 Series 2018', 'Berline premium, 255 chevaux, élégance et performance.', '2025-02-11 22:02:12', 'BMW', '3 Series', 2018, 255, 28000, 'Sedan', 'Gasoline', 'Gray', 20000, 'rent'),
('Audi A4 2019', 'Berline allemande raffinée, 248 chevaux et intérieur haut de gamme.', '2025-02-11 22:02:12', 'Audi', 'A4', 2019, 248, 30000, 'Sedan', 'Gasoline', 'Silver', 18000, 'rent'),
('Mercedes-Benz C-Class 2021', 'Luxe et performance avec 255 chevaux, en excellent état.', '2025-02-11 22:02:12', 'Mercedes-Benz', 'C-Class', 2021, 255, 40000, 'Sedan', 'Gasoline', 'White', 7000, 'sale'),
('Tesla Model 3 2021', 'Voiture électrique performante, autonomie élevée et technologie avancée.', '2025-02-11 22:02:12', 'Tesla', 'Model 3', 2021, 283, 45000, 'Sedan', 'Electric', 'Black', 3000, 'sale'),
('Nissan Altima 2020', 'Berline spacieuse et confortable avec 188 chevaux et faible kilométrage.', '2025-02-11 22:02:12', 'Nissan', 'Altima', 2020, 188, 24000, 'Sedan', 'Gasoline', 'Blue', 16000, 'sale'),
('Hyundai Elantra 2019', 'Voiture économique et fiable avec 147 chevaux et 14,000 km.', '2025-02-11 22:02:12', 'Hyundai', 'Elantra', 2019, 147, 19000, 'Sedan', 'Gasoline', 'Red', 14000, 'sale');

-- Insertion des données pour la table `client_folders`
INSERT INTO "client_folders" ("created_at", "user_id", "vehicule_id", "type", "status") VALUES
('2025-02-11 22:02:12', 1, 1, 'Rental', 'in_validation'),
('2025-02-11 22:02:12', 2, 2, 'Buy', 'rejected'),
('2025-02-11 22:02:12', 3, 8, 'Rental', 'in_validation'),
('2025-02-11 22:02:12', 4, 4, 'Rental', 'validated'),
('2025-02-11 22:02:12', 5, 5, 'Buy', 'in_validation');

-- Insertion des données pour la table `documents`
INSERT INTO "documents" ("created_at", "client_folder_id", "document_type", "link") VALUES
('2025-02-11 22:02:12', 1, 'ID Card', 'http://example.com/doc1.pdf'),
('2025-02-11 22:02:12', 1, 'Driving license', 'http://example.com/doc6.pdf'),
('2025-02-11 22:02:12', 1, 'Proof of Address', 'http://example.com/doc7.pdf'),
('2025-02-11 22:02:12', 2, 'Driver License', 'http://example.com/doc2.pdf'),
('2025-02-11 22:02:12', 3, 'Insurance', 'http://example.com/doc3.pdf'),
('2025-02-11 22:02:12', 4, 'Registration', 'http://example.com/doc4.pdf'),
('2025-02-11 22:02:12', 5, 'Proof of Address', 'http://example.com/doc5.pdf');
