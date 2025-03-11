-- Vérifier si la table options existe avant de la créer
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'options') THEN
        CREATE TABLE "options" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR(100) NOT NULL UNIQUE
        );
        
        INSERT INTO "options" (name) VALUES
        ('Assurance tous risques'),
        ('Assistance dépannage'),
        ('Entretien et SAV'),
        ('Contrôle technique');
    END IF;
END $$;

-- Vérifier si la table client_folder_options existe avant de la créer
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'client_folder_options') THEN
        CREATE TABLE "client_folder_options" (
            "client_folder_id" INTEGER NOT NULL,
            "option_id" INTEGER NOT NULL,
            PRIMARY KEY ("client_folder_id", "option_id"),
            FOREIGN KEY ("client_folder_id") REFERENCES "client_folders" ("id") ON DELETE CASCADE,
            FOREIGN KEY ("option_id") REFERENCES "options" ("id") ON DELETE CASCADE
        );
    END IF;
END $$;

CREATE TYPE client_folder_type AS ENUM (
    'Buy', 
    'Rental'
);


-- Ajouter un enregistrement dans la table de gestion des migrations
INSERT INTO migrations (version, applied_at) VALUES ('160220250941', NOW());