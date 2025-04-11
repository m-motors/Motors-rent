## **AWS Amplify**  

### **1. Principales Fonctions**  
####  **Hébergement et Déploiement**  
- Hébergement d’applications web statiques et full-stack.  
- Support des frameworks React, Angular, Vue, Next.js, etc.  
- Déploiement continu avec intégration GitHub, GitLab, Bitbucket.  
- CDN intégré avec AWS CloudFront.  

#### **Développement & Gestion**  
- **Amplify CLI** : Configuration simplifiée.  
- **Amplify Studio** : Interface visuelle pour la gestion du backend.  
- **Monitoring** : Logs et analyse avec CloudWatch.  
- **Scalabilité automatique** : Adaptation à la charge.  

### **2. Avantages et Inconvénients**  
#### **Points forts**  
- **Simplicité & rapidité** : Déploiement en quelques minutes.  
- **Scalabilité automatique** : Adapté aux montées en charge.  
- **Sécurité intégrée** : IAM & Cognito.  
- **Multi-plateforme** : Compatible web et mobile.

#### **Limitations**  
- **Dépendance à AWS** : Moins flexible hors de l’écosystème.  
- **Coût variable** : Facturation à la bande passante.  
- **Personnalisation limitée** : Moins de contrôle que EC2 ou S3 + CloudFront.  
- **Support SSR limité**

### **3. Alternatives AWS**  
- **S3 + CloudFront** : Idéal pour un site statique, coût optimisé.  
- **Elastic Beanstalk** : Déploiement backend simplifié, plus de contrôle.  
- **AWS App Runner** : Hébergement d’apps conteneurisées.  


### **4. Mise en Place**  
 
1. **Configurer le dépôt Git** :  
   - Sélectionner **Héberger une application Web**.  
   - Choisir **Connecter un dépôt Git** (GitHub, GitLab, Bitbucket, CodeCommit).  
   - Autoriser AWS Amplify à accéder au dépôt et sélectionner la branche à déployer.  

2. **Détection automatique du framework** :  
   - Amplify détecte et propose une configuration adaptée (React, Vue, Angular, etc.).  
   - Vérifier ou modifier les commandes de build si nécessaire.  

3. **Personnalisation des variables d’environnement** :  
   - Aller dans **Paramètres → Variables d’environnement**.

3. **Lancer le déploiement** :  
   - Cliquer sur **Enregistrer et déployer**.  
   - Suivre la progression dans l’onglet **Build & Deploy**.  
