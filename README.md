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

#### Etape 1 : Setup llm  100%
#### Etape 2 : Enregistrer des documents 70%  - Manque la synchro entre s3 et postgres 
#### Etape 3 : Creer embedder + vectorstore store avec retriever 100%
#### Etape 4 : Charger les documents 90%  
#### Etape 5 : Creation d'un chat 80%  
#### Etape 6 : Generer une reponse 70% - Il faut ameliorer la generation de la reponse 

### Reste à faire 
- Tester le setup from scratch
- Fonction pour setup en une seule fois 
- Vérifier la protabilité du storage chromadb


generate_response
POST /rag
question", "str", required=True
llm_model_name", "str", required=False
id", "str", required=False
with_retriever", "bool", required=False
vectorstore_id", "str", required=False
prompt_template", "str", required=False

---

### **1. Storage - S3** :  

list_storage_files
GET /rag/storage


upload_storage_file
POST /rag/storage
file "file", required=True
filename "str", required=False
folder_name "str", required=False

download_storage_file
GET /rag/storage/download
label="file_name", field_type="str", required=True
label="folder_name", field_type="str", required=False
label="local_path", field_type="str", required=False

delete_storage_file
DELETE /rag/storage
label="file_name", field_type="str", required=True
label="folder_name", field_type="str", required=False

---

### **2. Documents** :  

list_documents
GET /rag/documents

get_document
GET /rag/documents/<int:doc_id>

save_document
POST /rag/documents
"name", "str", required=True
"doc_format", "str", required=True
"status", "str", required=False

update_document
PATCH /rag/documents/<int:doc_id>
name", "str", required=False
doc_format", "str", required=False
link", "str", required=False
e_tag", "str", required=False
status", "str", required=False

delete_document
DELETE /rag/documents/<int:doc_id>
---

### **3. Embedders** :  

list_embedders
GET /rag/embedders

create_embedder
POST /rag/embedders
model_name", "str", required=False
is_encode_kwargs", "bool", required=False

remove_embedder
DELETE /rag/embedders
"id", "str", required=True

search_embedder
POST /rag/embedders/search
id", "str", required=False
name", "str", required=False
---

### **4. Vectorestores** : 
list_vectorestores
GET /rag/vectorestores

create_vectorestore
POST /rag/vectorestores
persist_directory", "str", required=False
collection_name", "str", required=False

remove_vectorestore
DELETE /rag/vectorestores
"id", "str", required=True

search_embedder
POST /rag/vectorestores/search
id", "str", required=False
name", "str", required=False


### **5. Retrievers** :  
add_docs_store
POST /rag/retriver
store_id", "str", required=True
dirs", "list", required=False
files", "list", required=False
chunk_size", "int", required=False
chunk_overlap", "int", required=False

---

### **6. LLM (Large Language Models)** :  

list_llm
GET /rag/llm

install_llm
POST /rag/llm
"llm_model_name", "str", required=False

uninstall_llm
DELETE /rag/llm
"llm_model_name", "str", required=False

---

### **7. Chats** :  

list_chats
GET /rag/chats

create_chat
POST /rag/chats
name", "str", required=True
llm_model_name", "str", required=False
description", "str", required=False
options", "dict", required=False
vectorstore_id", "dict", required=False

remove_chat 
DELETE /rag/chats
"id", "str", required=True

search_chat
POST /rag/chats/search
"id", "str", required=False
"name", "str", required=False

deepsearch_chat
POST /rag/chats/deepsearch
"partial", "dict", required=True


list_chat_options
POST /rag/chats/options
id", "str", required=True

list_chat_options
PATCH /rag/chats/options
id", "str", required=True
"options", "dict", required=True

update_vectorstore_chat
PATCH /rag/chats/vectorstore 
id", "str", required=True
vectorstore_id", "str", required=True

---  

Cette structure permet une gestion claire et fluide des fichiers, documents, embedders, vectorestores, retrievers, LLM et chats dans votre application.


### **Résumé de la demande**  
Vous avez partagé la structure actuelle de votre API REST dédiée au système RAG (Retrieval-Augmented Generation) avec les endpoints liés à la gestion de fichiers, documents, embedders, vectorstores, retrievers, modèles LLM et chats. Vous souhaitez maintenant une version mise au propre, bien structurée et lisible pour la documentation ou la maintenance.

---

## 📘 **API RAG – Structure des Endpoints**

---

### 🔍 **1. Génération de réponse**

**POST /rag**  
_Génère une réponse basée sur une question, avec ou sans récupération contextuelle._
- `question`: `str` (requis) – Question posée à l’IA.
- `llm_model_name`: `str` – Nom du modèle LLM à utiliser.
- `id`: `str` – ID de la conversation ou session.
- `with_retriever`: `bool` – Active ou non la recherche dans le vecteur store.
- `vectorstore_id`: `str` – ID du vecteur store.
- `prompt_template`: `str` – Template du prompt.

---

### 📁 **2. Storage (S3)**

#### 🔸 Lister les fichiers
**GET /rag/storage**

#### 🔸 Uploader un fichier
**POST /rag/storage**
- `file`: `file` (requis) – Fichier à stocker.
- `filename`: `str` – Nom du fichier (facultatif).
- `folder_name`: `str` – Dossier cible (facultatif).

#### 🔸 Télécharger un fichier
**GET /rag/storage/download**
- `file_name`: `str` (requis)
- `folder_name`: `str` – Nom du dossier (facultatif).
- `local_path`: `str` – Chemin local de téléchargement (facultatif).

#### 🔸 Supprimer un fichier
**DELETE /rag/storage**
- `file_name`: `str` (requis)
- `folder_name`: `str` – Nom du dossier (facultatif).

---

### 📄 **3. Documents**

#### 🔸 Lister les documents
**GET /rag/documents**

#### 🔸 Obtenir un document
**GET /rag/documents/<int:doc_id>**

#### 🔸 Enregistrer un document
**POST /rag/documents**
- `name`: `str` (requis)
- `doc_format`: `str` (requis)
- `status`: `str` – État du document (facultatif)

#### 🔸 Mettre à jour un document
**PATCH /rag/documents/<int:doc_id>**
- `name`, `doc_format`, `link`, `e_tag`, `status`: `str` – Champs modifiables (tous facultatifs)

#### 🔸 Supprimer un document
**DELETE /rag/documents/<int:doc_id>**

---

### 🧠 **4. Embedders**

#### 🔸 Lister les embedders
**GET /rag/embedders**

#### 🔸 Créer un embedder
**POST /rag/embedders**
- `model_name`: `str`
- `is_encode_kwargs`: `bool`

#### 🔸 Supprimer un embedder
**DELETE /rag/embedders**
- `id`: `str` (requis)

#### 🔸 Rechercher un embedder
**POST /rag/embedders/search**
- `id`: `str`
- `name`: `str`

---

### 🧱 **5. Vectorstores**

#### 🔸 Lister les vectorstores
**GET /rag/vectorestores**

#### 🔸 Créer un vectorstore
**POST /rag/vectorestores**
- `persist_directory`: `str`
- `collection_name`: `str`

#### 🔸 Supprimer un vectorstore
**DELETE /rag/vectorestores**
- `id`: `str` (requis)

#### 🔸 Rechercher un vectorstore
**POST /rag/vectorestores/search**
- `id`: `str`
- `name`: `str`

---

### 📦 **6. Retrievers**

#### 🔸 Ajouter des documents à un store
**POST /rag/retriver**
- `store_id`: `str` (requis)
- `dirs`: `list` – Répertoires à inclure
- `files`: `list` – Fichiers à indexer
- `chunk_size`: `int`
- `chunk_overlap`: `int`

---

### 🧠 **7. LLMs (modèles de langage)**

#### 🔸 Lister les LLM installés
**GET /rag/llm**

#### 🔸 Installer un LLM
**POST /rag/llm**
- `llm_model_name`: `str`

#### 🔸 Désinstaller un LLM
**DELETE /rag/llm**
- `llm_model_name`: `str`

---

### 💬 **8. Chats**

#### 🔸 Lister les chats
**GET /rag/chats**

#### 🔸 Créer un chat
**POST /rag/chats**
- `name`: `str` (requis)
- `llm_model_name`: `str`
- `description`: `str`
- `options`: `dict`
- `vectorstore_id`: `dict`

#### 🔸 Supprimer un chat
**DELETE /rag/chats**
- `id`: `str` (requis)

#### 🔸 Rechercher un chat
**POST /rag/chats/search**
- `id`: `str`
- `name`: `str`

#### 🔸 Recherche approfondie
**POST /rag/chats/deepsearch**
- `partial`: `dict` (requis)

#### 🔸 Obtenir les options d’un chat
**POST /rag/chats/options**
- `id`: `str` (requis)

#### 🔸 Modifier les options d’un chat
**PATCH /rag/chats/options**
- `id`: `str` (requis)
- `options`: `dict` (requis)

#### 🔸 Mettre à jour le vectorstore d’un chat
**PATCH /rag/chats/vectorstore**
- `id`: `str` (requis)
- `vectorstore_id`: `str` (requis)

---

### **Résumé**  
Cette API REST couvre l’ensemble des fonctionnalités nécessaires à un système RAG : gestion des fichiers, des documents, des embedders, des vectorstores, des retrievers, des LLMs et des chats. Elle permet une flexibilité dans la configuration du contexte, du modèle, et des sources pour un système de génération augmentée fiable et extensible.