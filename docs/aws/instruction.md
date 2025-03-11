## Création de l'image 

### Mise en place de GitHub Container Registry (GHCR) pour stocker vos images Docker  

L'objectif est de configurer **GitHub Container Registry (GHCR)** afin de stocker et gérer vos images Docker pour ensuite les déployer sur AWS ECS (Fargate).  

### Étapes principales :  
1. **Activer GitHub Container Registry**  
2. **Créer un fichier `~/.docker/config.json` avec l'authentification GHCR**  
3. **Construire et taguer l'image Docker**  
4. **Pousser l'image vers GHCR**  
5. **Vérifier l'image dans GitHub Packages**  

---

## 1. Activer GitHub Container Registry  
GHCR est activé par défaut sur GitHub, mais vous devez générer un **Personal Access Token (PAT)** pour l'authentification.  

### a) Générer un token personnel (PAT)  
1. Aller sur [GitHub Developer Settings](https://github.com/settings/tokens)  
2. Cliquer sur **Generate new token (classic)**  
3. Sélectionner une **durée de validité** ou "No expiration" (attention aux tokens persistants)  
4. Cocher les scopes suivants :  
   - `read:packages` (lecture des images)  
   - `write:packages` (écriture des images)  
   - `delete:packages` (suppression des images, optionnel)  
   - `repo` (si votre repo est privé)  
5. Générer et copier le token  

---

## 2. Se connecter à GHCR avec Docker  
Dans un terminal, exécutez la commande suivante pour s'authentifier :  

```sh
echo "<TOKEN_PERSONNEL>" | docker login ghcr.io -u <NOM_UTILISATEUR_GITHUB> --password-stdin

echo "<TOKEN_PERSONNEL>" | docker login ghcr.io -u j-renevier --password-stdin
```

Remplacez :  
- `<TOKEN_PERSONNEL>` par le token généré  
- `<NOM_UTILISATEUR_GITHUB>` par votre pseudo GitHub  

Si l'authentification réussit, vous verrez :
```sh
Login Succeeded
```

---

## 3. Construire et taguer l'image Docker  
Dans votre projet, assurez-vous d'avoir un `Dockerfile`, puis exécutez :  

```sh
docker build -t ghcr.io/<NOM_UTILISATEUR_GITHUB>/<NOM_IMAGE>:latest -f <DOCERFILE_PATH> <BUILD_CONTEXT>

docker build -t ghcr.io/j-renevier/backend:v1 ./backend


docker build -t ghcr.io/j-renevier/backend:v0.0.1 -f ./backend/Dockerfile.prod ./backend
```

---

## 4. Pousser l'image vers GHCR  
Après la construction, poussez l'image vers GHCR :  

```sh
docker push ghcr.io/<NOM_UTILISATEUR_GITHUB>/<NOM_IMAGE>:latest

docker push ghcr.io/j-renevier/backend:v1
```

---

## 5. Vérifier l'image sur GitHub  
1. Aller sur **GitHub > Votre repo > Packages**  
2. Vous devriez voir votre image Docker dans **GitHub Packages**  
3. Vous pouvez ensuite la récupérer via :  

```sh
docker pull ghcr.io/<NOM_UTILISATEUR_GITHUB>/<NOM_IMAGE>:latest

docker pull ghcr.io/j-renevier/backend:v1
```

---

## Création ecs 

### Utilisation d'une image Docker stockée sur GitHub Container Registry (GHCR) pour créer un service AWS ECS (Fargate)  

L'objectif est d'utiliser l'image `ghcr.io/j-renevier/backend:v1` pour déployer un service **AWS ECS (Fargate)**.  

### 📌 Étapes principales :  
1. **Donner accès à AWS pour récupérer l’image sur GHCR**  
2. **Créer un cluster ECS**  
3. **Créer une tâche ECS (Task Definition)**  
4. **Créer un service ECS (Fargate) basé sur la tâche**  
5. **Vérifier et tester le déploiement**  

---

## 1️⃣ Donner accès à AWS pour récupérer l’image sur GHCR  

### a) Rendre l’image publique (optionnel)  
Si vous ne souhaitez pas gérer l’authentification AWS → GHCR, rendez l’image **publique** :  
1. Aller sur **GitHub > Packages > backend:v1**  
2. Cliquer sur **Package settings**  
3. Changer la visibilité en **Public**  

💡 **Si l’image est privée**, AWS devra s’authentifier avec un secret ECR via AWS Secrets Manager (voir plus bas).  


## 1️⃣ Créer un secret dans AWS Secrets Manager  

### a) Récupérer le token GitHub  
Générez un **Personal Access Token (PAT)** sur [GitHub Settings](https://github.com/settings/tokens) avec les scopes :  
- `read:packages` (lecture des images)  
- `repo` (si votre repo est privé)  

Copiez ce token.  

### b) Stocker le token dans AWS Secrets Manager  

Exécutez la commande suivante pour stocker les identifiants dans AWS Secrets Manager :  

```sh
aws secretsmanager create-secret \
    --name ghcr-auth-secret \
    --secret-string '{
      "username": "j-renevier",
      "password": "<TOKEN_GITHUB>"
    }'
```

Remplacez `<TOKEN_GITHUB>` par votre token personnel.  

---

## 2️⃣ Créer un cluster ECS (si ce n’est pas fait)  
Si vous n’avez pas encore de **cluster ECS**, créez-en un avec AWS CLI :  

```sh
aws ecs create-cluster --cluster-name motors-rent-cluster
```

Vous pouvez aussi le créer via la **console AWS** sous **ECS > Clusters > Create Cluster**.

---

## 3️⃣ Créer une tâche ECS (Task Definition)  
La **Task Definition** définit comment ECS doit exécuter votre conteneur.  

### a) Créer un fichier `task-definition.json`  
Créez un fichier `task-definition.json` avec :  

```json
{
  "family": "backend-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "ghcr.io/j-renevier/backend:v1",
      "portMappings": [
        {
          "containerPort": 5000,
          "hostPort": 5000,
          "protocol": "tcp"
        }
      ],
      "essential": true
    }
  ]
}
```

💡 Remplacez **`<AWS_ACCOUNT_ID>`** par votre ID AWS.  

### b) Enregistrer la tâche ECS  
Exécutez la commande pour enregistrer la tâche ECS :  

```sh
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

---

## 4️⃣ Créer un service ECS (Fargate)  

### a) Vérifier que le **VPC** et le **subnet** existent  
Récupérez l’ID du VPC :  

```sh
aws ec2 describe-vpcs
```

Récupérez l’ID d’un **subnet public** :  

```sh
aws ec2 describe-subnets
```

### b) Créer le service ECS  
Créez le service en utilisant **AWS CLI** :  

```sh
aws ecs create-service \
    --cluster motors-rent-cluster \
    --service-name backend-service \
    --task-definition backend-task \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
    --desired-count 1
```

Remplacez :  
- **`subnet-xxxxx`** par l’ID d’un **subnet public**  
- **`sg-xxxxx`** par l’ID d’un **groupe de sécurité** autorisant le port 5000  

---

## 5️⃣ Vérifier et tester le déploiement  

### a) Vérifier que la tâche tourne  
```sh
aws ecs list-tasks --cluster motors-rent-cluster
```

### b) Récupérer l’IP publique du conteneur  
Si l'IP publique est activée, utilisez :  

```sh
aws ecs describe-tasks --cluster motors-rent-cluster --tasks <TASK_ID>
```

Sinon, ajoutez un **Load Balancer** ou un **AWS API Gateway** pour exposer votre backend.  

---

### ✅ Résumé  
1. **Configurer GHCR** et rendre l’image publique (ou gérer l’authentification)  
2. **Créer un cluster ECS** (si non existant)  
3. **Créer une Task Definition** avec l’image `ghcr.io/j-renevier/backend:v1`  
4. **Créer un service ECS** sur Fargate avec un subnet et un groupe de sécurité  
5. **Vérifier que le service fonctionne** et récupérer son IP  

Une fois ce service en place, vous pouvez connecter Amplify (frontend) à cette API ! 🚀



Action 
S3 creation dun bucket avec des folder 
RDS création d'un database 
ECS creation cluster + service + task + security group
Amplyfi creation d'une app 