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


   