DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'groupe11') THEN
        CREATE DATABASE groupe11;
    END IF;
END $$;

-- Connexion à la base de données
\c groupe11;

-- Table: application
CREATE TABLE "application" (
    "id" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP DEFAULT current_timestamp,
    "user_id" INTEGER NOT NULL,
    "vehicule_id" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'En cours de validation'
);

-- Table: documents
CREATE TABLE "documents" (
    "id" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP DEFAULT current_timestamp,
    "application_id" INTEGER NOT NULL,
    "document_type" VARCHAR(50) NOT NULL
);

-- Table: user
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP DEFAULT current_timestamp,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "user_role" TEXT NOT NULL CHECK ("user_role" IN ('client', 'admin')),
    "password" VARCHAR(255) NOT NULL
);

-- Table: vehicule
CREATE TABLE "vehicule" (
    "id" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP DEFAULT current_timestamp,
    "brand" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "year" INTEGER NOT NULL,
    "horsepower" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "motor" VARCHAR(100) NOT NULL,
    "color" VARCHAR(20) NOT NULL,
    "mileage" INTEGER NOT NULL
);

-- Ajout des clés étrangères
ALTER TABLE "application"
    ADD CONSTRAINT fk_application_user FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE,
    ADD CONSTRAINT fk_application_vehicule FOREIGN KEY ("vehicule_id") REFERENCES "vehicule"("id") ON DELETE CASCADE;

ALTER TABLE "documents"
    ADD CONSTRAINT fk_documents_application FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE CASCADE;

-- Insertion des données pour la table `user`
INSERT INTO "user" ("id", "created_at", "email", "first_name", "last_name", "is_active", "user_role", "password") VALUES
(1, '2025-02-11 22:02:12', 'user1@example.com', 'Alice', 'Dupont', TRUE, 'client', 'alice'),
(2, '2025-02-11 22:02:12', 'user2@example.com', 'Bob', 'Martin', TRUE, 'client', 'bob'),
(3, '2025-02-11 22:02:12', 'admin@example.com', 'Charlie', 'Durand', TRUE, 'admin', 'charlie'),
(4, '2025-02-11 22:02:12', 'user3@example.com', 'David', 'Lemoine', TRUE, 'client', 'david'),
(5, '2025-02-11 22:02:12', 'user4@example.com', 'Emma', 'Morel', TRUE, 'client', '$2y$10$abcdefghijklmnopqrstuv');
