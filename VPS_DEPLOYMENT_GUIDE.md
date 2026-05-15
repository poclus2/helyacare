# Guide Complet : Déploiement de HelyaCare sur VPS Contabo

Ce guide vous accompagne pas à pas pour déployer HelyaCare (Frontend Next.js + Backend Medusa + PostgreSQL + Redis) sur un VPS Contabo sous Ubuntu (20.04, 22.04 ou 24.04).

## Prérequis
1. Un VPS Contabo avec **Ubuntu** installé.
2. Vos noms de domaine (`helyacare.com` et `api.helyacare.com`) pointant vers l'adresse IP de votre VPS (Enregistrements `A` dans votre zone DNS).

---

## Étape 1 : Connexion et Mise à jour du Serveur

Ouvrez un terminal (PowerShell sur Windows) et connectez-vous à votre serveur :
```bash
ssh root@IP_DE_VOTRE_VPS
```
*(Remplacez `IP_DE_VOTRE_VPS` par l'IP fournie par Contabo).*

Mettez à jour le système :
```bash
apt update && apt upgrade -y
```

---

## Étape 2 : Installation de Docker et Docker Compose

HelyaCare fonctionnera via des conteneurs isolés et stables. Installez Docker avec ces commandes :

```bash
# Téléchargement et installation du script Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installation du plugin Docker Compose
apt-get install docker-compose-plugin -y

# Vérification
docker compose version
```

---

## Étape 3 : Récupération de votre projet HelyaCare

Installez Git s'il n'est pas déjà présent :
```bash
apt install git -y
```

Clonez votre dépôt GitHub dans un dossier `/var/www/helyacare` :
```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/votre-nom/helyacare.git
cd helyacare
```
*(Remarque : Si votre dépôt est privé, Git vous demandera votre nom d'utilisateur et un Personal Access Token (PAT) en guise de mot de passe).*

---

## Étape 4 : Configuration des Variables d'Environnement (.env)

Créez le fichier de configuration `.env` à la racine de votre projet :
```bash
nano .env
```

Copiez-y le contenu suivant (en modifiant les secrets) :
```env
# ==== BASE DE DONNÉES ====
POSTGRES_USER=helya_admin
POSTGRES_PASSWORD=un_mot_de_passe_très_sécurisé
POSTGRES_DB=helyacare_db

# ==== MEDUSA BACKEND ====
JWT_SECRET=generer_un_secret_jwt_aleatoire
COOKIE_SECRET=generer_un_secret_cookie_aleatoire
STORE_CORS=https://helyacare.com
ADMIN_CORS=https://api.helyacare.com,https://helyacare.com
AUTH_CORS=https://helyacare.com,https://api.helyacare.com

# ==== FRONTEND ====
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.helyacare.com
```
Pour sauvegarder et quitter `nano` : appuyez sur `Ctrl+O`, `Entrée`, puis `Ctrl+X`.

---

## Étape 5 : Lancement de l'Infrastructure

Toujours dans le dossier `/var/www/helyacare`, lancez le build et le démarrage des conteneurs :

```bash
docker compose up -d --build
```
*Cette étape va prendre quelques minutes (téléchargement de Node.js, compilation de Next.js et Medusa). Une fois terminé, la base de données migrera automatiquement ses tables.*

Pour vérifier que tout tourne correctement :
```bash
docker compose ps
```

---

## Étape 6 : Configuration de Nginx (Reverse Proxy)

Vos applications tournent maintenant sur les ports `3000` (Front) et `9000` (Back) en interne. Nous allons utiliser Nginx pour les lier à vos noms de domaine.

Installez Nginx :
```bash
apt install nginx -y
```

### 6.1 Configuration de l'API (Backend)
```bash
nano /etc/nginx/sites-available/api.helyacare.com
```
Collez ceci :
```nginx
server {
    listen 80;
    server_name api.helyacare.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Sauvegardez (`Ctrl+O`, `Entrée`, `Ctrl+X`).

### 6.2 Configuration du Frontend
```bash
nano /etc/nginx/sites-available/helyacare.com
```
Collez ceci :
```nginx
server {
    listen 80;
    server_name helyacare.com www.helyacare.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Sauvegardez.

### 6.3 Activation
Activez ces sites et redémarrez Nginx :
```bash
ln -s /etc/nginx/sites-available/api.helyacare.com /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/helyacare.com /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## Étape 7 : Sécurisation avec SSL (HTTPS)

Il est indispensable d'avoir des certificats SSL (HTTPS). Nous utilisons Certbot pour les générer gratuitement via Let's Encrypt :

```bash
apt install certbot python3-certbot-nginx -y
```

Générez les certificats (Certbot modifiera automatiquement vos fichiers Nginx) :
```bash
certbot --nginx -d api.helyacare.com
certbot --nginx -d helyacare.com -d www.helyacare.com
```
Suivez les instructions à l'écran (entrez votre email, acceptez les conditions).

---

## ✅ C'est terminé !
Félicitations ! Votre plateforme HelyaCare est désormais en ligne et sécurisée sur votre propre serveur Contabo. Vos bases de données sont persistées sur le volume Docker, à l'abri des réinitialisations aléatoires !
