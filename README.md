### Créer le fichier .env.local avec les secrets ###


# M-Motors : Une Success Story

M-Motors a été créée en 1987 comme un spécialiste en vente des véhicules d’occasion. L’entreprise a gagné beaucoup de succès et de réputation. Elle est devenue, après 30 ans de création, une des 10 entreprises au niveau national. Ce succès vient de plusieurs aspects, mais tous centrés autour de la satisfaction client.

## Une Offre Variée et un Service Client de Qualité

L'entreprise propose une gamme variée de :  

- Marques  
- Modèles  
- Motorisations  
- Kilométrages  
- Prix  

Cela permet de répondre aux besoins et aux budgets de tous les clients. Tout cela s’accompagne de voitures de qualité garantissant un bon état mécanique et un entretien régulier afin d’assurer leur fiabilité et leur sécurité. Cela inclut :  

- Des contrôles techniques approfondis  
- Des remises en état  
- Des garanties  

L'entreprise dispose également d’un service commercial et d’un service après-vente, qui accompagnent les clients grâce à un conseil personnalisé. L’objectif est d’offrir un service client de qualité en écoutant les besoins des clients et en les conseillant sur le choix du véhicule le plus adapté.  

### Services Complémentaires  

- **Essai routier** : permet aux clients d’essayer les véhicules avant l’achat.  
- **Service de financement** : propose des solutions adaptées aux budgets des clients en partenariat avec des organismes financiers.  
- **Reprise d’ancien véhicule** : facilite le processus d’achat en reprenant l’ancien véhicule du client.  

## Structure et Effectifs  

L'entreprise est composée de **800 employés** et compte environ **un million de clients** au niveau national.  

## Nouveau Service : Location Longue Durée avec Option d’Achat  

Suite à une étude de terrain menée par le service commercial, un **nouveau service** a été proposé à l'entreprise :  

**Location Longue Durée avec Option d’Achat (LLD/LOA)**  

Ce service inclut plusieurs options dans l’abonnement de location :  

- Assurance tous risques  
- Assistance dépannage  
- Entretien et SAV  
- Contrôle technique  

Une étude détaillée avec un **business plan de ROI** a été réalisée. Le projet a été validé par la direction et un **gros budget** a été alloué pour la refonte de l’application web actuelle, qui permet l’achat de voitures d’occasion.  

## Refonte de l’Application Web  

Une réunion a été organisée entre la direction, le service commercial et le service IT. Un **Product Owner** du service commercial a été nommé.  

### Nouvelles Fonctionnalités  

#### Côté Client  

- Recherche de véhicules selon deux options : **achat** ou **location**  
- Inscription et dépôt de dossier d’achat ou de location  
- Téléchargement des documents depuis l’interface (dossier **100% dématérialisé**)  
- Suivi de l’avancement du dossier depuis un **espace client**

#### Côté Back Office  

- Ajout de véhicules à la **location**  
- Ajout de véhicules à **vendre**  
- Basculer un véhicule de **location** ↔ **vente**  
- Visualisation des dossiers de **location/achat**  
- Validation ou refus des dossiers de **location/achat**  

## Exigences Techniques du Service IT  

- Définition des valeurs **RPO** (Recovery Point Objective) et **RTO** (Recovery Time Objective) avec le Product Owner  
- Retravailler **l’architecture logicielle** en fonction de ces valeurs  
- Migration des **données actuelles** vers une **nouvelle base de données**  
- Hébergement dans le cloud dans le cadre de l’opération **“Move to Cloud”**  

## Architecture projet

Frontend 

Backend

Database

Fichiers necessaire lors de l'initialisation de la base


## Stack Technologique  

### Backend API  

- **Flask**  

### Frontend  

- **React**  

### DevOps 

- **Docker**
- **Déploiement sur AWS**
  - ECS  ??
  - Lambda ?? 
  - EC2 ??
  - Lightsail   
  - RDS  ??
  - S3 ??

## Liens

https://trello.com/b/9OujogUZ/motors-rent

https://github.com/Makhtar99/Motors-rent

## Membres du groupe

DIOUF Makhtar
Charlery Malcolm
RENÉ Marie
BENGUIGUI Avidan
RENEVIER Joachim
REKIK Kylian
BERNARD Anne-Flore

## Environnement 

### Set le ENV_MODE 

Dans **.env**  set => ENV_MODE="development" 

### Set les varibles d'environnement 

.env = variable par default sans secret  => versionné
.env.local = secret => non versoinné
Lors de la création des container les variables d'environement du .env son réécrite par celle du .env.local

### Créer le fichier .env.local avec les secrets ###

## Démarer l'aplication 

docker compose up --build 

Le plus long a creer est le backend on attend que la base soit dispo avant la création ajout de fichier de migrations pour pas avoir de regression dans la base

OR WITH LLM (OLLAMA)

docker-compose -f docker-compose.yml -f docker-compose.llm.yml up -d

PLEASE READ THE MAKEFILE : make help

## Connecting to PGAdmin via Web

If you don’t have the PGAdmin application installed, you can access it directly from your web browser.

### Web Interface Access:
- **URL**: [localhost:8080](http://localhost:8080)
- **Email / Username**: `admin@admin.fr`
- **Password**: `ChangeMe`

### Navigating in PGAdmin:
1. In the left panel, expand `Servers`.
2. When prompted for a password, use: **`ChangeMe`**.
3. To view tables:
   - **Servers** → **Databases** → **groupe11** → **Schemas** → **Tables**.


Mettre a jour le data, la version de postgres sur rds est trop veille pas de retrocompatibilité sur backup/restore. 
Pour setup la base, supprime l'existant, execute le init comme requete sql 


pip install ollama chromadb langchain langchain-core langchain_community

pip freeze > requirements.txt


## LLM 

#### Etape 1 : Setup llm 100%
#### Etape 2 : Enregistrer des documents 70%  - Manque la synchro entre s3 et postgres 
#### Etape 3 : Creer embedder + vectorstore store avec retriever 100%
#### Etape 4 : Charger les documents 90%  
#### Etape 5 : Creation d'un chat 80%  
#### Etape 6 : Generer une reponse 70% - Il faut ameliorer la generation de la reponse 

### Reste à faire 
- Tester le setup from scratch
- Fonction pour setup en une seule fois 
- Vérifier la protabilité du storage chromadb



### Détail des routes avec paramètres

#### **LLM Models (`/rag/llm`)**

| Méthode | Route      | Description                | Paramètres attendus                                  |
|---------|------------|----------------------------|-------------------------------------------------------|
| GET     | `/rag/llm` | Lister les LLM disponibles | Aucun                                                 |
| POST    | `/rag/llm` | Installer un LLM           | `llm_model_name: str` *(optionnel, JSON)*            |
| DELETE  | `/rag/llm` | Désinstaller un LLM        | `llm_model_name: str` *(optionnel, JSON)*            |

---

#### **Chats (`/rag/chats`)**

| Méthode | Route                       | Description                         | Paramètres attendus                                                                 |
|---------|-----------------------------|-------------------------------------|--------------------------------------------------------------------------------------|
| GET     | `/rag/chats`                | Lister les chats                    | Aucun                                                                               |
| POST    | `/rag/chats`                | Créer un chat                       | `name: str` (obligatoire), `llm_model_name`, `description`, `options: dict`, `collection` *(JSON)* |
| DELETE  | `/rag/chats`                | Supprimer un chat                   | `id: str` *(obligatoire, JSON)*                                                    |
| POST    | `/rag/chats/search`         | Rechercher un chat                  | `id: str` *(optionnel)*, `name: str` *(optionnel)* *(JSON)*                        |
| POST    | `/rag/chats/deepsearch`     | Recherche avancée                   | `partial: dict` *(obligatoire, JSON)*                                              |
| POST    | `/rag/chats/options`        | Lister options                      | `id: str` *(obligatoire, JSON)*                                                    |
| PATCH   | `/rag/chats/options`        | Mettre à jour options               | `id: str`, `options: dict` *(obligatoire, JSON)*                                   |
| PATCH   | `/rag/chats/collection`     | Modifier la collection du chat      | `id: str`, `collection: str` *(obligatoire, JSON)*                                 |

---

#### **RAG Inference**

| Méthode | Route     | Description                       | Paramètres attendus                                                                                      |
|---------|-----------|-----------------------------------|-----------------------------------------------------------------------------------------------------------|
| POST    | `/rag`    | Générer réponse avec LLM + RAG    | `question: str` (obligatoire), `llm_model_name`, `id`, `with_retriever`, `collection`, `prompt_template` *(JSON)* |

---

#### **Stockage (`/rag/storage`)**

| Méthode | Route                        | Description            | Paramètres attendus                                                                 |
|---------|------------------------------|------------------------|--------------------------------------------------------------------------------------|
| GET     | `/rag/storage`               | Lister les fichiers    | Aucun                                                                               |
| POST    | `/rag/storage`               | Upload fichier         | Form-data : `file: File`, `file_name: str` *(optionnel)*, `folder_name: str` *(optionnel)* |
| GET     | `/rag/storage/download`      | Télécharger un fichier | Query : `file_name: str`, `folder_name: str` *(optionnel)*, `local_path: str` *(optionnel)* |
| DELETE  | `/rag/storage`               | Supprimer un fichier   | Query : `file_name: str`, `folder_name: str` *(optionnel)*                         |

---

#### **Documents RAG (`/rag/documents`)**

| Méthode | Route                            | Description                 | Paramètres attendus                                                              |
|---------|----------------------------------|-----------------------------|-----------------------------------------------------------------------------------|
| GET     | `/rag/documents`                | Lister tous les documents   | Aucun                                                                            |
| GET     | `/rag/documents/<doc_id>`       | Obtenir un document         | `doc_id: int` dans l’URL                                                         |
| POST    | `/rag/documents`                | Sauvegarder un document     | `name: str`, `doc_format: str`, `status: str` *(optionnel, JSON)*               |
| PATCH   | `/rag/documents/<doc_id>`       | Mettre à jour un document   | `name`, `doc_format`, `link`, `e_tag`, `status` *(tous optionnels, JSON)*       |
| DELETE  | `/rag/documents/<doc_id>`       | Supprimer un document       | `doc_id: int` dans l’URL                                                         |

---

#### **Embedders (`/rag/embedders`)**

| Méthode | Route                        | Description             | Paramètres attendus                                           |
|---------|------------------------------|-------------------------|----------------------------------------------------------------|
| GET     | `/rag/embedders`            | Lister les embedders    | Aucun                                                         |
| POST    | `/rag/embedders`            | Créer un embedder       | `model_name: str` *(optionnel)*, `is_encode_kwargs: bool` *(optionnel, JSON)* |
| DELETE  | `/rag/embedders`            | Supprimer un embedder   | `id: str` *(obligatoire, JSON)*                               |
| POST    | `/rag/embedders/search`     | Rechercher un embedder  | `id: str`, `name: str` *(optionnels, JSON)*                   |

---

#### **Collections (`/rag/collections`)**

| Méthode | Route                          | Description                 | Paramètres attendus                                                                        |
|---------|--------------------------------|-----------------------------|---------------------------------------------------------------------------------------------|
| GET     | `/rag/collections`            | Lister les collections      | Aucun                                                                                      |
| POST    | `/rag/collections`            | Créer une collection        | `persist_directory`, `collection_name`, `embedder_id` *(tous optionnels, JSON)*            |
| PATCH   | `/rag/collections`            | Mettre à jour une collection| `id: str` (obligatoire), `name`, `persist_directory`, `docs`, `embedder` *(optionnels, JSON)* |
| DELETE  | `/rag/collections`            | Supprimer une collection    | `id: str` *(obligatoire, JSON)*                                                            |
| POST    | `/rag/collections/search`     | Rechercher une collection   | `id: str`, `name: str` *(optionnels, JSON)*                                                |

---

#### **Retriever & Indexation (`/rag/retriver`)**

| Méthode | Route             | Description                         | Paramètres attendus                                                                 |
|---------|-------------------|-------------------------------------|--------------------------------------------------------------------------------------|
| POST    | `/rag/retriver`   | Ajouter docs dans store (vector DB) | `store_id: str` (obligatoire), `dirs: list`, `files: list`, `chunk_size: int`, `chunk_overlap: int` *(JSON)* |


