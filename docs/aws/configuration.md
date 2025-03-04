## **Configuration du Service AWS ECS**

### **Informations Générales**  
- **ARN du service :**  
  `arn:aws:ecs:eu-...:<1111111>:service/hetic-web3-groupe11-mmotors/hetic-web3-groupe11-mmotors-service-1`  
- **Définition de la tâche (Révision) :**  
  `hetic-web3-groupe11-mmotors-task:9`  
- **Type de service :**  
  `REPLICA`  
- **Créé par :**  
  `arn:aws:iam::<1111111>:user/groupe11`  
- **Version de plateforme :**  
  `LATEST`  
- **Famille de plateformes :**  
  `Linux`  

### **Balises et Répartition des Ressources**  
- **Balises gérées par Amazon ECS :** `Activé`  
- **Propager des balises à partir de :** `Aucun(e)`  
- **Rééquilibrage des zones de disponibilité :** `Activé`  

### **Déploiement et Gestion du Service**  
- **Pile CloudFormation :**  
  `hetic-web3-groupe11-mmotors-service-1`  
- **ECS Exec :**  
  `Désactivé`  

### **Capacité et Fargate**  
- **Stratégie de fournisseur de capacité :**  
  - **Fournisseur de capacité :** `Base`  
  - **Pondération :** `FARGATE 0`  
  - **Stockage éphémère Fargate :** `Non spécifié`  

### **Configuration Réseau**  
- **VPC :** `vpc-5...`  
- **Sous-réseaux :**  
  - ...
- **Groupes de sécurité :**  
  - default  
  - hetic-web3-groupe11-mmotors-sg
- **Attribution automatique d'une adresse IP publique :** `Activé`  

### **Autres Paramètres**  
- **Période de grâce de la vérification de l'état :** `Non spécifiée`  
- **Rôle du service :** `AWSServiceRoleForECS`  
- **Noms de serveur DNS :** `Non spécifié`  

## **Présentation de la Tâche AWS ECS**  

### **Informations Générales**  
- **ARN de la tâche :**  
  `arn:aws:ecs:eu-...:<111111111>:task/hetic-web3-groupe11-mmotors/`  
- **Dernier statut :** `En cours d'exécution`  
- **Statut souhaité :** `En cours d'exécution`  
- **Date de création/démarrage :**  
  - **Créé le :** 
  - **Démarré le :** 

### **Stockage & Sécurité**  
- **Stockage éphémère Fargate :** `20 Gio`  
- **Chiffrement :** `Chiffrement AWS Fargate par défaut`  

### **Configuration de la Tâche**  
- **Système d'exploitation / Architecture :** `Linux / X86_64`  
- **CPU | Mémoire :** `1 vCPU | 3 GB`  
- **Version de plateforme :** `1.4.0`  
- **ECS Exec :** `Désactivé`  
- **Injection de pannes :** `Désactivé`  

### **Fournisseur de Capacité & Lancement**  
- **Fournisseur de capacité :** `FARGATE`  
- **Type de lancement :** `FARGATE`  

### **Déploiement & Réseau**  
- **Définition de la tâche (Révision) :** `hetic-web3-groupe11-mmotors-task:9`  
- **Groupe de tâches :** `service:hetic-web3-groupe11-mmotors-service-1`  
- **Service associé :** `hetic-web3-groupe11-mmotors-service-1`  

### **Configuration Réseau**  
- **Mode réseau :** `awsvpc`  
- **ID d'ENI :** `eni-0...`  
- **ID du sous-réseau :** `subnet-f...`  
- **Adresse IP publique :** `15....` (adresse ouverte)  
- **Adresse IP privée :** `172....`  
- **Adresse MAC :** `0a:...`  

## **Groupe de Sécurité AWS ECS**  

### **Informations Générales**  
- **Nom du groupe de sécurité :** `hetic-web3-groupe11-mmotors-sg`  
- **ID du groupe de sécurité :** hetic-web3-groupe11-mmotors-sg 
- **Description :** `http-https`  
- **ID du VPC :** `vpc-5...`  
- **Propriétaire :** `<111111111>`  

### **Règles de Sécurité**  

#### **Règles Entrantes (Inbound) :**  
| ID de règle | Version IP | Type  | Protocole | Port | Source | Description |
|------------|-----------|------|----------|------|--------|-------------|
| `sgr-05...` | IPv4 | HTTP | TCP | 80 | `0.0.0.0/0` | - |
| `sgr-0c...` | IPv4 | HTTPS | TCP | 443 | `0.0.0.0/0` | - |

#### **Règles Sortantes (Outbound) :**  
| ID de règle | Version IP | Type  | Protocole | Port | Destination | Description |
|------------|-----------|------|----------|------|-------------|-------------|
| `sgr-02...` | IPv6 | Tout le trafic | Tous | Tous | `::/0` | - |
| `sgr-0d...` | IPv4 | Tout le trafic | Tous | Tous | `0.0.0.0/0` | - |

---

Ce groupe de sécurité permet les connexions entrantes sur **HTTP (port 80)** et **HTTPS (port 443)** depuis n'importe quelle source (`0.0.0.0/0`).  
Les règles sortantes autorisent **tout le trafic** vers toutes les destinations en IPv4 et IPv6.  
