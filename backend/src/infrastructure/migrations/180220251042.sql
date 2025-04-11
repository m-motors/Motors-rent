-- 2. Création de la table de liaison client_folder_vehicles si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_folder_vehicles') THEN
        CREATE TABLE client_folder_vehicles (
            client_folder_id INTEGER NOT NULL,
            vehicule_id INTEGER NOT NULL,
            PRIMARY KEY (client_folder_id, vehicule_id),
            FOREIGN KEY (client_folder_id) REFERENCES client_folders (id) ON DELETE CASCADE,
            FOREIGN KEY (vehicule_id) REFERENCES vehicules (id) ON DELETE CASCADE
        );
    END IF;
END $$;

-- 3. Création de la table de liaison client_folder_documents si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_folder_documents') THEN
        CREATE TABLE client_folder_documents (
            client_folder_id INTEGER NOT NULL,
            document_id INTEGER NOT NULL,
            PRIMARY KEY (client_folder_id, document_id),
            FOREIGN KEY (client_folder_id) REFERENCES client_folders (id) ON DELETE CASCADE,
            FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
        );
    END IF;
END $$;

-- 4. Enregistrement de la migration dans la table migrations
INSERT INTO migrations (version, applied_at) VALUES ('180220251042', NOW());
