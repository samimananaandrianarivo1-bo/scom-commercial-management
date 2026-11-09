# SCOM - Systeme de Gestion Commerciale

> Documentation complete du projet SCOM — Mis a jour le 26/08/2026

---

## Table des matieres

1. Architecture globale
2. Pre-requis
3. Demarrage rapide
4. Base de donnees
5. Backend Hibernate (port 8081)
6. Backend JPA (port 8082)
7. Frontend React (port 5173)
8. API REST - Endpoints
9. Structure des fichiers
10. Comptes de demonstration
11. Problemes connus et solutions
12. Code SQL complet
13. Fonctionnalites implementees

---

## 1. Architecture globale

```
                    +---------------------------+
                    |   React SPA (Vite)        |
                    |   localhost (port 5173)    |
                    |   react-router-dom v6      |
                    |   axios dual-client        |
                    +-----------+-------+--------+
                                |       |
                hibernateApi    |       |    jpaApi
                (CRUD)          |       |    (Dashboard/Stats)
                                v       v
                +--------------------+ +--------------------+
                | backend-hibernate  | |   backend-jpa      |
                |   :8081            | |   :8082            |
                |  Spring Boot 3.5   | |  Spring Boot 3.5   |
                |  Java 25           | |  Java 25           |
                +----------+---------+ +----------+---------+
                           |                       |
                           v                       v
                +---------------------------------------------+
                |     MySQL 8.4 (db_scom_database)             |
                |     localhost:3306 -- WAMP                    |
                +---------------------------------------------+
```

**Dual backend :**
- **Backend Hibernate** (:8081) -- CRUD complet (vendeurs, utilisateurs, rayons, bons de commande, commissions, paiements)
- **Backend JPA** (:8082) -- Dashboard, statistiques, classements, pagination, recherche full-text

---

## 2. Pre-requis

| Outil        | Version  | Port  |
|--------------|----------|-------|
| Java (JDK)   | 25       | --    |
| Maven        | 3.9.16   | --    |
| Node.js      | 24.19.0  | --    |
| MySQL (WAMP) | 8.4.7    | 3306  |

---

## 3. Demarrage rapide

### 1. Importer la base de donnees

```powershell
C:\wamp64\bin\mysql\mysql8.4.7\bin\mysql.exe -u root < "database\db_scom_database.sql"
```

Ou via phpMyAdmin : Importer le fichier `database/db_scom_database.sql`.

### 2. Demarrer Backend Hibernate (port 8081)

```powershell
cd "backend-hibernate"
mvn spring-boot:run
```

### 3. Demarrer Backend JPA (port 8082)

```powershell
cd "backend-jpa"
mvn spring-boot:run
```

### 4. Demarrer le Frontend (port 5173)

```powershell
cd "frontend"
npm install
npm run dev
```

### 5. Acces

| Service          | URL                                    |
|------------------|----------------------------------------|
| Frontend         | http://localhost:5173                   |
| Hibernate API    | http://localhost:8081/api               |
| Hibernate Swagger| http://localhost:8081/swagger-ui.html   |
| JPA API          | http://localhost:8082/api               |
| JPA Swagger      | http://localhost:8082/swagger-ui.html   |
| MySQL            | localhost:3306                          |

---

## 4. Base de donnees

### Nom : `db_scom_database`

- SGBD : MySQL 8.4 (WAMP)
- Charset : utf8mb4 / utf8mb4_unicode_ci
- DDL auto : none (schema gere via SQL)

### Tables principales

#### RAYON
| Colonne            | Type         | Contrainte     |
|--------------------|--------------|----------------|
| ID_rayon           | BIGINT       | PK             |
| code_rayon         | VARCHAR(50)  | NOT NULL, UNI  |
| nom_rayon          | VARCHAR(100) | NOT NULL       |
| description_rayon  | VARCHAR(500) | NULL           |

#### VENDEUR
| Colonne            | Type         | Contrainte     |
|--------------------|--------------|----------------|
| ID_vendeur         | BIGINT       | PK             |
| code_vendeur       | VARCHAR(50)  | NOT NULL, UNI  |
| nom_vendeur        | VARCHAR(100) | NOT NULL       |
| prenom_vendeur     | VARCHAR(100) | NULL           |
| email_vendeur      | VARCHAR(150) | NULL           |
| telephone_vendeur  | VARCHAR(30)  | NULL           |
| adresse_vendeur    | VARCHAR(255) | NULL           |

#### BON_COMMANDE
| Colonne            | Type           | Contrainte     |
|--------------------|----------------|----------------|
| ID_bon_commande    | BIGINT         | PK             |
| numero_bon         | VARCHAR(50)    | NOT NULL, UNI  |
| date_bon           | DATE           | NULL           |
| montant_bon        | DECIMAL(15,2)  | NOT NULL, def 0|
| statut_bon         | VARCHAR(30)    | NULL           |
| ID_vendeur         | BIGINT         | FK -> VENDEUR  |

Statuts possibles : `PAYE`, `EN_COURS`, `ANNULE`

#### COMMISSION
| Colonne            | Type           | Contrainte     |
|--------------------|----------------|----------------|
| ID_commission      | BIGINT         | PK             |
| code_commission    | VARCHAR(50)    | NOT NULL, UNI  |
| taux_commission    | DECIMAL(6,2)   | NOT NULL, def 0|
| montant_commission | DECIMAL(15,2)  | NOT NULL, def 0|
| date_commission    | DATE           | NULL           |
| ID_vendeur         | BIGINT         | FK -> VENDEUR  |

#### PAIEMENT
| Colonne            | Type           | Contrainte     |
|--------------------|----------------|----------------|
| ID_paiement        | BIGINT         | PK             |
| code_paiement      | VARCHAR(50)    | NOT NULL, UNI  |
| mode_paiement      | VARCHAR(50)    | NOT NULL       |
| montant_paiement   | DECIMAL(15,2)  | NOT NULL, def 0|
| date_paiement      | DATE           | NULL           |

Modes de paiement : `ESPECES`, `CB`, `VIREMENT`

#### UTILISATEUR
| Colonne             | Type         | Contrainte     |
|---------------------|--------------|----------------|
| ID_utilisateur      | BIGINT       | PK             |
| login_utilisateur   | VARCHAR(100) | NOT NULL, UNI  |
| password_utilisateur| VARCHAR(255) | NOT NULL       |
| nom_utilisateur     | VARCHAR(100) | NULL           |
| email_utilisateur   | VARCHAR(150) | NULL           |
| role_utilisateur    | VARCHAR(50)  | NULL           |
| photo_utilisateur   | TEXT         | NULL           |

Roles : `ADMIN`, `MANAGER`, `OPERATEUR`

Photo : base64 (data:image/jpeg;base64,...) stockee en TEXT, upload via PUT /api/utilisateurs/{id}/photo

### Tables d'association

#### EXPLOITER (VENDEUR <-> RAYON)
| Colonne    | Type   | Contrainte            |
|------------|--------|-----------------------|
| ID_vendeur | BIGINT | PK, FK -> VENDEUR     |
| ID_rayon   | BIGINT | PK, FK -> RAYON       |

#### ETRE_PAYE_PAR (BON_COMMANDE <-> PAIEMENT)
| Colonne         | Type   | Contrainte                 |
|-----------------|--------|----------------------------|
| ID_bon_commande | BIGINT | PK, FK -> BON_COMMANDE     |
| ID_paiement     | BIGINT | PK, FK -> PAIEMENT         |

---

## 5. Backend Hibernate (port 8081)

- **GroupId** : com.scom
- **ArtifactId** : backend-hibernate
- **Java** : 25
- **Spring Boot** : 3.5.16
- **Swagger** : /swagger-ui.html

### Dependances principales

| Dependance                                  | Version       |
|---------------------------------------------|---------------|
| spring-boot-starter-web                     | (managed)     |
| spring-boot-starter-data-jpa                | (managed)     |
| mysql-connector-j                           | (managed)     |
| spring-boot-starter-validation              | (managed)     |
| lombok                                      | (managed)     |
| springdoc-openapi-starter-webmvc-ui         | 2.8.6         |

### Configuration (application.properties)

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/db_scom_database?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&useUnicode=true
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=none
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=false
spring.jpa.open-in-view=false
```

### Packages Java

| Package      | Contenu                                                      |
|--------------|--------------------------------------------------------------|
| config       | CorsConfig, OpenApiConfig                                    |
| controller   | 7 controllers (Vendeur, Utilisateur, Rayon, BonCommande, Commission, Paiement, Health) |
| dto          | Request/Response pour chaque entite                          |
| entity       | 6 entites JPA                                                |
| exception    | ConflictException, ResourceNotFoundException, GlobalExceptionHandler |
| mapper       | Mappers Entity <-> DTO pour chaque entite                    |
| repository   | 6 repositories (Spring Data JPA)                             |
| service      | 6 interfaces + 6 impl (Service Layer)                        |

---

## 6. Backend JPA (port 8082)

- **GroupId** : com.scom
- **ArtifactId** : backend-jpa
- **Java** : 25
- **Spring Boot** : 3.5.16
- **Swagger** : /swagger-ui.html

### Dependances principales

| Dependance                                  | Version       |
|---------------------------------------------|---------------|
| spring-boot-starter-web                     | (managed)     |
| spring-boot-starter-data-jpa                | (managed)     |
| mysql-connector-j                           | (managed)     |
| spring-boot-starter-validation              | (managed)     |
| lombok                                      | 1.18.38       |
| byte-buddy                                  | 1.18.12       |
| springdoc-openapi-starter-webmvc-ui         | 2.8.13        |
| h2                                          | (managed, test)|

### Configuration (application.properties)

Meme configuration que le backend Hibernate, avec le meme URL JDBC UTF-8.

### Packages Java

| Package      | Contenu                                                      |
|--------------|--------------------------------------------------------------|
| config       | CorsConfig, OpenApiConfig                                    |
| controller   | 4 controllers (Dashboard, Statistique, VendeurQuery, Health) |
| dto          | DashboardStats, RayonStat, VendeurClassement, MoisMontant + Request/Response |
| entity       | 6 entites JPA                                                |
| exception    | ResourceNotFoundException, GlobalExceptionHandler             |
| repository   | 6 repositories                                               |
| service      | DashboardService, StatistiqueService + impl                   |

---

## 7. Frontend React (port 5173)

- **Framework** : React 18 + Vite 6
- **Routing** : react-router-dom v6
- **HTTP** : axios (dual client : hibernateApi :8081, jpaApi :8082)
- **Charts** : Recharts 2.15
- **Icons** : react-icons 5.4
- **CSS** : index.css (custom, sans framework CSS externe)

### Commandes

```powershell
cd frontend
npm install      # Installer les dependances
npm run dev      # Demarrer le serveur dev (port 5173)
npm run build    # Build de production
npm run preview  # Previsualiser le build
```

### Routes

| Route                     | Composant          | Auth requise |
|---------------------------|--------------------|--------------|
| /                         | Redirect -> /dashboard | Non      |
| /login                    | Login              | Non          |
| /dashboard                | Dashboard          | Oui          |
| /vendeurs                 | Vendeurs           | Oui          |
| /vendeurs/:id             | VendeurDetail      | Oui          |
| /rayons                   | Rayons             | Oui          |
| /bons-commandes           | BonsCommandes      | Oui          |
| /bons-commandes/:id       | BonCommandeDetail  | Oui          |
| /commissions              | Commissions        | Oui          |
| /commissions/:id          | CommissionDetail   | Oui          |
| /paiements                | Paiements          | Oui          |
| /utilisateurs             | Utilisateurs       | Oui          |
| /rapports                 | Rapports           | Oui          |
| /parametres               | Parametres         | Oui          |

### Structure frontend/src/

```
frontend/src/
+-- main.jsx                    (point d'entree)
+-- App.jsx                     (routes react-router)
+-- styles/
|   +-- index.css               (CSS complet, scrollbar custom, animations, responsive)
+-- context/
|   +-- AuthContext.jsx         (auth context : login/logout/updatePhoto)
+-- components/
|   +-- CrudTable.jsx           (table CRUD generique)
|   +-- Modal.jsx               (modale reutilisable)
|   +-- ProtectedRoute.jsx      (garde d'authentification)
|   +-- Toast.jsx               (notifications toast)
|   +-- common/
|   |   +-- Avatar.jsx          (avatar photo ou initiales, 8 couleurs auto)
|   |   +-- CurrencyDisplay.jsx (affichage devise Ar, responsive)
|   +-- layout/
|       +-- AppLayout.jsx       (layout principal avec sidebar)
|       +-- Sidebar.jsx         (menu lateral avec logo + avatar)
|       +-- Topbar.jsx          (barre superieure avec mini avatar + logout)
+-- pages/
|   +-- Dashboard.jsx           (KPI, graphiques, classements)
|   +-- Vendeurs.jsx            (liste vendeurs)
|   +-- VendeurDetail.jsx       (detail d'un vendeur)
|   +-- Rayons.jsx              (gestion des rayons)
|   +-- BonsCommandes.jsx       (liste bons de commande)
|   +-- BonCommandeDetail.jsx   (detail d'un bon)
|   +-- Commissions.jsx         (liste commissions)
|   +-- CommissionDetail.jsx    (detail d'une commission)
|   +-- Paiements.jsx           (liste paiements)
|   +-- Utilisateurs.jsx        (gestion utilisateurs + colonne photo)
|   +-- Rapports.jsx            (rapports et stats)
|   +-- Parametres.jsx          (photo profil upload/delete + a propos)
|   +-- auth/
|       +-- Login.jsx           (page de connexion avec Fontground.png)
+-- services/
|   +-- api.js                  (clients axios : hibernateApi, jpaApi)
|   +-- vendeurService.js
|   +-- utilisateurService.js   (+ updatePhoto)
|   +-- rayonService.js
|   +-- bonCommandeService.js
|   +-- commissionService.js
|   +-- paiementService.js
|   +-- dashboardService.js
+-- utils/
    +-- format.js               (re-export de formatAriary)
    +-- formatCurrency.js       (formatAriary : formatage en Ariary malgache)
    +-- resizeImage.js          (crop/resize 200x200, retourne base64)
```

---

## 8. API REST - Endpoints

### Backend Hibernate (:8081) -- 33 endpoints

#### Health
| Methode | Path               | Description     |
|---------|--------------------|-----------------|
| GET     | /api/health        | Health check    |

#### Vendeurs
| Methode | Path               | Description          |
|---------|--------------------|----------------------|
| GET     | /api/vendeurs      | Lister tous          |
| GET     | /api/vendeurs/{id} | Detail               |
| POST    | /api/vendeurs      | Creer (201)          |
| PUT     | /api/vendeurs/{id} | Modifier             |
| DELETE  | /api/vendeurs/{id} | Supprimer (204)      |

#### Utilisateurs
| Methode | Path                       | Description          |
|---------|----------------------------|----------------------|
| GET     | /api/utilisateurs          | Lister tous          |
| GET     | /api/utilisateurs/{id}     | Detail               |
| POST    | /api/utilisateurs          | Creer (201)          |
| PUT     | /api/utilisateurs/{id}     | Modifier             |
| DELETE  | /api/utilisateurs/{id}     | Supprimer (204)      |
| PUT     | /api/utilisateurs/{id}/photo| Upload photo profil  |
| POST    | /api/utilisateurs/login    | Authentification     |

#### Rayons
| Methode | Path               | Description          |
|---------|--------------------|----------------------|
| GET     | /api/rayons        | Lister tous          |
| GET     | /api/rayons/{id}   | Detail               |
| POST    | /api/rayons        | Creer (201)          |
| PUT     | /api/rayons/{id}   | Modifier             |
| DELETE  | /api/rayons/{id}   | Supprimer (204)      |

#### Bons de commande
| Methode | Path                     | Description          |
|---------|--------------------------|----------------------|
| GET     | /api/bons-commandes      | Lister tous          |
| GET     | /api/bons-commandes/{id} | Detail               |
| POST    | /api/bons-commandes      | Creer (201)          |
| PUT     | /api/bons-commandes/{id} | Modifier             |
| DELETE  | /api/bons-commandes/{id} | Supprimer (204)      |

#### Commissions
| Methode | Path                    | Description          |
|---------|-------------------------|----------------------|
| GET     | /api/commissions        | Lister toutes        |
| GET     | /api/commissions/{id}   | Detail               |
| POST    | /api/commissions        | Creer (201)          |
| PUT     | /api/commissions/{id}   | Modifier             |
| DELETE  | /api/commissions/{id}   | Supprimer (204)      |

#### Paiements
| Methode | Path                  | Description          |
|---------|-----------------------|----------------------|
| GET     | /api/paiements        | Lister tous          |
| GET     | /api/paiements/{id}   | Detail               |
| POST    | /api/paiements        | Creer (201)          |
| PUT     | /api/paiements/{id}   | Modifier             |
| DELETE  | /api/paiements/{id}   | Supprimer (204)      |

### Backend JPA (:8082) -- 7 endpoints

| Methode | Path                                    | Description                   |
|---------|-----------------------------------------|-------------------------------|
| GET     | /api/health                             | Health check                  |
| GET     | /api/dashboard                          | Stats globales dashboard      |
| GET     | /api/statistiques/classement-vendeurs   | Classement vendeurs par ventes|
| GET     | /api/statistiques/rayons                | Stats par rayon               |
| GET     | /api/vendeurs                           | Lister tous les vendeurs      |
| GET     | /api/vendeurs/page                      | Pagination (page, size, sort) |
| GET     | /api/vendeurs/search                    | Recherche full-text (q)       |

### Total : 39 endpoints API

---

## 9. Structure des fichiers

### Racine du projet

```
scom commercial B final/
+-- .gitignore
+-- Logo.jpg                  (logo du projet)
+-- README.md
+-- package.json              (Next.js racine - couche secondaire)
+-- next.config.ts
+-- tsconfig.json
+-- drizzle.config.json
+-- eslint.config.mjs
+-- src/                      (app Next.js - couche secondaire)
+-- database/
|   +-- db_scom_database.sql  (script SQL complet)
+-- backend-hibernate/        (Spring Boot CRUD API -- port 8081)
+-- backend-jpa/              (Spring Boot Dashboard API -- port 8082)
+-- frontend/                 (React SPA -- port 5173)
```

### backend-hibernate : 52 fichiers Java

```
backend-hibernate/src/main/java/com/scom/hibernate/
+-- ScomHibernateApplication.java
+-- config/
|   +-- CorsConfig.java
|   +-- OpenApiConfig.java
+-- controller/
|   +-- BonCommandeController.java
|   +-- CommissionController.java
|   +-- HealthController.java
|   +-- PaiementController.java
|   +-- RayonController.java
|   +-- UtilisateurController.java
|   +-- VendeurController.java
+-- dto/
|   +-- BonCommandeRequest.java
|   +-- BonCommandeResponse.java
|   +-- CommissionRequest.java
|   +-- CommissionResponse.java
|   +-- LoginRequest.java
|   +-- PaiementRequest.java
|   +-- PaiementResponse.java
|   +-- RayonRequest.java
|   +-- RayonResponse.java
|   +-- UtilisateurRequest.java
|   +-- UtilisateurResponse.java
|   +-- VendeurRequest.java
|   +-- VendeurResponse.java
+-- entity/
|   +-- BonCommande.java
|   +-- Commission.java
|   +-- Paiement.java
|   +-- Rayon.java
|   +-- Utilisateur.java
|   +-- Vendeur.java
+-- exception/
|   +-- ConflictException.java
|   +-- GlobalExceptionHandler.java
|   +-- ResourceNotFoundException.java
+-- mapper/
|   +-- BonCommandeMapper.java
|   +-- CommissionMapper.java
|   +-- PaiementMapper.java
|   +-- RayonMapper.java
|   +-- UtilisateurMapper.java
|   +-- VendeurMapper.java
+-- repository/
|   +-- BonCommandeRepository.java
|   +-- CommissionRepository.java
|   +-- PaiementRepository.java
|   +-- RayonRepository.java
|   +-- UtilisateurRepository.java
|   +-- VendeurRepository.java
+-- service/
    +-- BonCommandeService.java
    +-- CommissionService.java
    +-- PaiementService.java
    +-- RayonService.java
    +-- UtilisateurService.java
    +-- VendeurService.java
    +-- impl/
        +-- BonCommandeServiceImpl.java
        +-- CommissionServiceImpl.java
        +-- PaiementServiceImpl.java
        +-- RayonServiceImpl.java
        +-- UtilisateurServiceImpl.java
        +-- VendeurServiceImpl.java
```

### backend-jpa : 41 fichiers Java

```
backend-jpa/src/main/java/com/scom/jpa/
+-- ScomJpaApplication.java
+-- config/
|   +-- CorsConfig.java
|   +-- OpenApiConfig.java
+-- controller/
|   +-- DashboardController.java
|   +-- HealthController.java
|   +-- StatistiqueController.java
|   +-- VendeurQueryController.java
+-- dto/
|   +-- BonCommandeRequest.java
|   +-- BonCommandeResponse.java
|   +-- CommissionRequest.java
|   +-- CommissionResponse.java
|   +-- DashboardStats.java
|   +-- LoginRequest.java
|   +-- MoisMontant.java
|   +-- PaiementRequest.java
|   +-- PaiementResponse.java
|   +-- RayonRequest.java
|   +-- RayonResponse.java
|   +-- RayonStat.java
|   +-- UtilisateurRequest.java
|   +-- UtilisateurResponse.java
|   +-- VendeurClassement.java
|   +-- VendeurRequest.java
|   +-- VendeurResponse.java
+-- entity/
|   +-- BonCommande.java
|   +-- Commission.java
|   +-- Paiement.java
|   +-- Rayon.java
|   +-- Utilisateur.java
|   +-- Vendeur.java
+-- exception/
|   +-- GlobalExceptionHandler.java
|   +-- ResourceNotFoundException.java
+-- repository/
|   +-- BonCommandeRepository.java
|   +-- CommissionRepository.java
|   +-- PaiementRepository.java
|   +-- RayonRepository.java
|   +-- UtilisateurRepository.java
|   +-- VendeurRepository.java
+-- service/
    +-- DashboardService.java
    +-- StatistiqueService.java
    +-- impl/
        +-- DashboardServiceImpl.java
        +-- StatistiqueServiceImpl.java
```

---

## 10. Comptes de demonstration

| Login      | Mot de passe  | Nom                   | Role       |
|------------|---------------|-----------------------|------------|
| admin      | admin123      | Administrateur        | ADMIN      |
| manager    | manager123    | Manager Ventes        | MANAGER    |
| operateur  | operateur123  | Operateur de Saisie   | OPERATEUR  |

### Donnees de demo

| Table          | Enregistrements |
|----------------|-----------------|
| RAYON          | 4               |
| VENDEUR        | 5               |
| BON_COMMANDE   | 8               |
| COMMISSION     | 7               |
| PAIEMENT       | 5               |
| UTILISATEUR    | 3               |
| EXPLOITER      | 8               |
| ETRE_PAYE_PAR  | 5               |

---

## 11. Problemes connus et solutions

### caracteres speciaux affiches en "?"

**Cause** : Le client MySQL Windows utilise cp850 par defaut au lieu de UTF-8.

**Solution** :
1. Ajouter `&characterEncoding=UTF-8&useUnicode=true` a l'URL JDBC dans les deux `application.properties`
2. Corriger les donnees corrompues en base avec `UPDATE` SQL

### Erreur de compilation Java 25 + Lombok

**Cause** : Lombok n'est pas compatible par defaut avec Java 25.

**Solution** : Ajouter `annotationProcessorPaths` dans `maven-compiler-plugin` :
```xml
<annotationProcessorPaths>
  <path>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.38</version>
  </path>
</annotationProcessorPaths>
```

### Swagger ne fonctionne pas

**Cause** : Dependance manquante.

**Solution** : Ajouter `springdoc-openapi-starter-webmvc-ui` dans le `pom.xml`.

### Google Fonts impossible a charger (100% offline)

**Cause** : Le projet fonctionne hors-ligne, pas de connexion internet.

**Solution** : Supprimer le `@import url(...)` dans `index.css`, utiliser les polices systeme.

### Mismatch de colonnes base de donnees

**Cause** : La base MySQL n'a pas ete importee avec le bon script SQL.

**Solution** : Reimporter `database/db_scom_database.sql` pour recreer toutes les tables.

---

## 12. Code SQL complet

```sql
-- ============================================================
--  SCOM - Systeme de Gestion Commerciale
--  Base de donnees : db_scom_database
--  SGBD : MySQL (WAMP)
-- ============================================================

CREATE DATABASE IF NOT EXISTS db_scom_database
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE db_scom_database;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS ETRE_PAYE_PAR;
DROP TABLE IF EXISTS EXPLOITER;
DROP TABLE IF EXISTS COMMISSION;
DROP TABLE IF EXISTS BON_COMMANDE;
DROP TABLE IF EXISTS PAIEMENT;
DROP TABLE IF EXISTS UTILISATEUR;
DROP TABLE IF EXISTS VENDEUR;
DROP TABLE IF EXISTS RAYON;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
--  Tables principales
-- ============================================================

CREATE TABLE RAYON (
    ID_rayon           BIGINT       NOT NULL,
    code_rayon         VARCHAR(50)  NOT NULL,
    nom_rayon          VARCHAR(100) NOT NULL,
    description_rayon  VARCHAR(500) NULL,
    PRIMARY KEY (ID_rayon),
    UNIQUE KEY uk_rayon_code (code_rayon)
) ENGINE=InnoDB;

CREATE TABLE VENDEUR (
    ID_vendeur         BIGINT       NOT NULL,
    code_vendeur       VARCHAR(50)  NOT NULL,
    nom_vendeur        VARCHAR(100) NOT NULL,
    prenom_vendeur     VARCHAR(100) NULL,
    email_vendeur      VARCHAR(150) NULL,
    telephone_vendeur  VARCHAR(30)  NULL,
    adresse_vendeur    VARCHAR(255) NULL,
    PRIMARY KEY (ID_vendeur),
    UNIQUE KEY uk_vendeur_code (code_vendeur)
) ENGINE=InnoDB;

CREATE TABLE BON_COMMANDE (
    ID_bon_commande    BIGINT         NOT NULL,
    numero_bon         VARCHAR(50)    NOT NULL,
    date_bon           DATE           NULL,
    montant_bon        DECIMAL(15,2)  NOT NULL DEFAULT 0,
    statut_bon         VARCHAR(30)    NULL,
    ID_vendeur         BIGINT         NULL,
    PRIMARY KEY (ID_bon_commande),
    UNIQUE KEY uk_bon_numero (numero_bon),
    KEY idx_bon_vendeur (ID_vendeur),
    CONSTRAINT fk_bon_vendeur FOREIGN KEY (ID_vendeur)
        REFERENCES VENDEUR (ID_vendeur) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE COMMISSION (
    ID_commission       BIGINT         NOT NULL,
    code_commission     VARCHAR(50)    NOT NULL,
    taux_commission     DECIMAL(6,2)   NOT NULL DEFAULT 0,
    montant_commission  DECIMAL(15,2)  NOT NULL DEFAULT 0,
    date_commission     DATE           NULL,
    ID_vendeur          BIGINT         NULL,
    PRIMARY KEY (ID_commission),
    UNIQUE KEY uk_commission_code (code_commission),
    KEY idx_commission_vendeur (ID_vendeur),
    CONSTRAINT fk_commission_vendeur FOREIGN KEY (ID_vendeur)
        REFERENCES VENDEUR (ID_vendeur) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE PAIEMENT (
    ID_paiement       BIGINT        NOT NULL,
    code_paiement     VARCHAR(50)   NOT NULL,
    mode_paiement     VARCHAR(50)   NOT NULL,
    montant_paiement  DECIMAL(15,2) NOT NULL DEFAULT 0,
    date_paiement     DATE          NULL,
    PRIMARY KEY (ID_paiement),
    UNIQUE KEY uk_paiement_code (code_paiement)
) ENGINE=InnoDB;

CREATE TABLE UTILISATEUR (
    ID_utilisateur       BIGINT       NOT NULL,
    login_utilisateur    VARCHAR(100) NOT NULL,
    password_utilisateur VARCHAR(255) NOT NULL,
    nom_utilisateur      VARCHAR(100) NULL,
    email_utilisateur    VARCHAR(150) NULL,
    role_utilisateur     VARCHAR(50)  NULL,
    photo_utilisateur    TEXT         NULL,
    PRIMARY KEY (ID_utilisateur),
    UNIQUE KEY uk_utilisateur_login (login_utilisateur)
) ENGINE=InnoDB;

-- ============================================================
--  Tables d'association
-- ============================================================

CREATE TABLE EXPLOITER (
    ID_vendeur BIGINT NOT NULL,
    ID_rayon   BIGINT NOT NULL,
    PRIMARY KEY (ID_vendeur, ID_rayon),
    CONSTRAINT fk_exploiter_vendeur FOREIGN KEY (ID_vendeur)
        REFERENCES VENDEUR (ID_vendeur) ON DELETE CASCADE,
    CONSTRAINT fk_exploiter_rayon FOREIGN KEY (ID_rayon)
        REFERENCES RAYON (ID_rayon) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ETRE_PAYE_PAR (
    ID_bon_commande BIGINT NOT NULL,
    ID_paiement     BIGINT NOT NULL,
    PRIMARY KEY (ID_bon_commande, ID_paiement),
    CONSTRAINT fk_epp_bon FOREIGN KEY (ID_bon_commande)
        REFERENCES BON_COMMANDE (ID_bon_commande) ON DELETE CASCADE,
    CONSTRAINT fk_epp_paiement FOREIGN KEY (ID_paiement)
        REFERENCES PAIEMENT (ID_paiement) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
--  Jeu de donnees de demonstration
-- ============================================================

INSERT INTO RAYON (ID_rayon, code_rayon, nom_rayon, description_rayon) VALUES
    (1, 'RAY-ELEC', 'Electronique',      'TV, hi-fi, informatique'),
    (2, 'RAY-ALIM', 'Alimentation',      'Epicerie fine et produits frais'),
    (3, 'RAY-VETE', 'Vetements',         'Pret-a-porter homme et femme'),
    (4, 'RAY-MEUB', 'Meubles',           'Mobilier et decoration');

INSERT INTO VENDEUR (ID_vendeur, code_vendeur, nom_vendeur, prenom_vendeur, email_vendeur, telephone_vendeur, adresse_vendeur) VALUES
    (1, 'V001', 'El Amrani', 'Mounir', 'mounir@scom.local', '+212600000001', 'Casablanca'),
    (2, 'V002', 'Benali',    'Salma',  'salma@scom.local',  '+212600000002', 'Rabat'),
    (3, 'V003', 'Idrissi',   'Karim',  'karim@scom.local',  '+212600000003', 'Fes'),
    (4, 'V004', 'Sadiki',    'Nadia',  'nadia@scom.local',  '+212600000004', 'Marrakech'),
    (5, 'V005', 'Chraibi',   'Hicham', 'hicham@scom.local', '+212600000005', 'Tanger');

INSERT INTO EXPLOITER (ID_vendeur, ID_rayon) VALUES
    (1,1),(1,2),(2,3),(3,4),(4,1),(4,3),(5,2),(5,4);

INSERT INTO BON_COMMANDE (ID_bon_commande, numero_bon, date_bon, montant_bon, statut_bon, ID_vendeur) VALUES
    (1, 'BC-2025-001', '2025-01-15', 12500.00, 'PAYE',     1),
    (2, 'BC-2025-002', '2025-02-10',  8300.50, 'EN_COURS', 2),
    (3, 'BC-2025-003', '2025-02-22', 15720.00, 'PAYE',     1),
    (4, 'BC-2025-004', '2025-03-05',  4300.00, 'ANNULE',   3),
    (5, 'BC-2025-005', '2025-03-18',  9600.75, 'PAYE',     4),
    (6, 'BC-2025-006', '2025-04-02', 21500.00, 'EN_COURS', 1),
    (7, 'BC-2025-007', '2025-04-14',  5400.00, 'PAYE',     5),
    (8, 'BC-2025-008', '2025-05-06', 11250.00, 'PAYE',     2);

INSERT INTO COMMISSION (ID_commission, code_commission, taux_commission, montant_commission, date_commission, ID_vendeur) VALUES
    (1, 'CO-2025-001', 5.00, 625.00,  '2025-01-31', 1),
    (2, 'CO-2025-002', 4.50, 373.50,  '2025-02-28', 2),
    (3, 'CO-2025-003', 5.00, 786.00,  '2025-02-28', 1),
    (4, 'CO-2025-004', 4.00, 384.03,  '2025-03-31', 4),
    (5, 'CO-2025-005', 6.00, 1290.00, '2025-04-30', 1),
    (6, 'CO-2025-006', 3.50, 189.00,  '2025-04-30', 5),
    (7, 'CO-2025-007', 5.00, 562.50,  '2025-05-31', 2);

INSERT INTO PAIEMENT (ID_paiement, code_paiement, mode_paiement, montant_paiement, date_paiement) VALUES
    (1, 'PAY-001', 'ESPECES',    12500.00, '2025-01-16'),
    (2, 'PAY-002', 'CB',         15720.00, '2025-02-23'),
    (3, 'PAY-003', 'VIREMENT',    9600.75, '2025-03-19'),
    (4, 'PAY-004', 'CB',          5400.00, '2025-04-15'),
    (5, 'PAY-005', 'ESPECES',    11250.00, '2025-05-07');

INSERT INTO ETRE_PAYE_PAR (ID_bon_commande, ID_paiement) VALUES
    (1,1),(3,2),(5,3),(7,4),(8,5);

INSERT INTO UTILISATEUR (ID_utilisateur, login_utilisateur, password_utilisateur, nom_utilisateur, email_utilisateur, role_utilisateur) VALUES
    (1, 'admin',     'admin123',     'Administrateur',       'admin@scom.local',     'ADMIN'),
    (2, 'manager',   'manager123',   'Manager Ventes',       'manager@scom.local',   'MANAGER'),
    (3, 'operateur', 'operateur123', 'Operateur de Saisie',  'operateur@scom.local', 'OPERATEUR');
```

---

## 13. Fonctionnalites implementees

### Photo de profil
- **Upload** : page Parametres, selecteur de fichier (jpg/png, max 5 Mo)
- **Resize auto** : crop carre 200x200 px, JPEG 85% qualite (cote client via canvas)
- **Stockage** : base64 en colonne `photo_utilisateur` (TEXT) dans MySQL
- **Affichage** : composant `Avatar.jsx` — photo ou initiales colorees (8 couleurs auto)
- **Presentation** : avatar dans la sidebar (38px), le topbar (34px), la page Parametres (120px), le tableau Utilisateurs
- **Suppression** : bouton "Supprimer" dans Parametres

### Formatage monetaire (Ariary malgache)
- **Utilitaire** : `formatAriary(value)` — formate en `1 500 000 Ar`
- **Compact** : mode `compact` — `1,5 M Ar` pour les gros chiffres
- **Composant** : `CurrencyDisplay.jsx` — taille sm/lg, variante green
- **Utilisation** : Dashboard KPIs, tableaux, tooltips Recharts
- **Fallback** : `format.js` re-exporte `formatAriary as money` pour compatibilite

### Interface utilisateur
- **Sidebar** : etat actif avec texte blanc + font-weight 600, hover avec fond semi-transparent, transitions 0.15s ease
- **Topbar** : avatar, nom, role, bouton deconnexion
- **Login** : background `Fontground.png` avec overlay sombre (rgba(0,0,0,0.4))
- **Logo** : `Logo.jpg` dans sidebar, login, favicon, page Parametres
- **CSS** : scrollbar custom, animations cards, modal fade-in, responsive (768px, 900px, 1024px)

### Base de donnees
- Charset UTF-8 (`characterEncoding=UTF-8&useUnicode=true` dans JDBC URL)
- Donnees corrompues corrigees (rayons, utilisateurs)
