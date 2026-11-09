# SCOM — Système de Gestion Commerciale

Application web complète, 100 % locale/offline, dédiée à la gestion commerciale
(vendeurs, rayons, bons de commande, commissions, paiements, utilisateurs)
avec dashboard, statistiques et rapports.

Aucune dépendance à Internet, Firebase, Auth0 ou service cloud.

---

## 1. Architecture générale

```
SCOM/
│
├── backend-hibernate/     Spring Boot + Hibernate (CRUD)  → port 8081
├── backend-jpa/           Spring Boot + Spring Data JPA (stats)  → port 8082
├── frontend/              React + Vite (UI ERP/SaaS)  → port 5173
└── database/
    └── db_scom_database.sql   Script de création de la base MySQL
```

```
                         SCOM
                          │
                 ┌────────▼────────┐
                 │    React JS     │   :5173
                 └────────┬────────┘
              ┌───────────┴───────────┐
              ▼                       ▼
     ┌─────────────────┐     ┌─────────────────┐
     │ Backend         │     │ Backend         │
     │ Hibernate       │     │ JPA             │
     │ :8081           │     │ :8082           │
     └────────┬────────┘     └────────┬────────┘
              └───────────┬───────────┘
                          ▼
                ┌──────────────────┐
                │   MySQL / WAMP   │
                │ db_scom_database │
                │      :3306       │
                └──────────────────┘
```

---

## 2. Prérequis

| Outil        | Version                              |
| ------------ | ------------------------------------ |
| **JDK**      | **Java 25** (obligatoire)            |
| Maven        | 3.9+                                 |
| Node.js      | 18+                                  |
| npm          | 9+                                   |
| WAMP Server  | avec MySQL 5.7+ ou 8.x               |
| MySQL        | Base `db_scom_database` (voir §5)    |

Vérifiez :

```bash
java -version   # doit afficher "25"
mvn -v
node -v
```

### Installation JDK 25 (Windows)

1. Téléchargez **JDK 25** depuis Oracle, Temurin (Eclipse Adoptium) ou Amazon Corretto.
2. Installez-le (par ex. `C:\Program Files\Java\jdk-25`).
3. Définissez la variable d'environnement `JAVA_HOME`.
4. Ajoutez `%JAVA_HOME%\bin` au `PATH`.

### Installation Maven

1. Téléchargez Apache Maven 3.9+.
2. Décompressez dans `C:\apache-maven-3.9.x`.
3. Ajoutez `C:\apache-maven-3.9.x\bin` au `PATH`.

---

## 3. Configuration WAMP / MySQL

1. Démarrez **WAMP Server** (icône verte).
2. Ouvrez **phpMyAdmin** ([http://localhost/phpmyadmin](http://localhost/phpmyadmin)).
3. Importez le fichier **`database/db_scom_database.sql`** :
   - Il crée la base `db_scom_database`
   - Il crée les 8 tables (`RAYON`, `VENDEUR`, `BON_COMMANDE`, `COMMISSION`,
     `PAIEMENT`, `UTILISATEUR`, `EXPLOITER`, `ETRE_PAYE_PAR`)
   - Il insère un jeu de données de démonstration (5 vendeurs, 4 rayons, 8 bons,
     7 commissions, 5 paiements, 3 utilisateurs)

Paramètres par défaut :

| Paramètre    | Valeur              |
| ------------ | ------------------- |
| Host         | `localhost`         |
| Port         | `3306`              |
| Utilisateur  | `root`              |
| Mot de passe | *(vide)*            |
| Base         | `db_scom_database`  |

Si votre WAMP utilise un autre mot de passe, ajustez-le dans les deux fichiers
`application.properties` :

- `backend-hibernate/src/main/resources/application.properties`
- `backend-jpa/src/main/resources/application.properties`

---

## 4. Lancement des trois applications

### 4.1 — Backend Hibernate (port 8081)

```bash
cd backend-hibernate
mvn clean install
mvn spring-boot:run
```

- API : http://localhost:8081/api
- Health : http://localhost:8081/api/health
- Swagger : http://localhost:8081/swagger-ui/index.html

### 4.2 — Backend JPA (port 8082)

```bash
cd backend-jpa
mvn clean install
mvn spring-boot:run
```

- API : http://localhost:8082/api
- Health : http://localhost:8082/api/health
- Swagger : http://localhost:8082/swagger-ui/index.html

### 4.3 — Frontend React (port 5173)

```bash
cd frontend
npm install
npm run dev
```

- UI : http://localhost:5173

### Comptes de démonstration

| Login       | Mot de passe    | Rôle       |
| ----------- | --------------- | ---------- |
| `admin`     | `admin123`      | ADMIN      |
| `manager`   | `manager123`    | MANAGER    |
| `operateur` | `operateur123`  | OPERATEUR  |

---

## 5. URLs récapitulatives

| Composant             | URL                                                       |
| --------------------- | --------------------------------------------------------- |
| **Frontend React**    | http://localhost:5173                                     |
| Backend Hibernate     | http://localhost:8081                                     |
| Swagger Hibernate     | http://localhost:8081/swagger-ui/index.html               |
| Backend JPA           | http://localhost:8082                                     |
| Swagger JPA           | http://localhost:8082/swagger-ui/index.html               |
| MySQL                 | localhost:3306 (base `db_scom_database`)                  |

---

## 6. Architecture MVC & SOLID

### Couches (MVC)

```
Controller  →  Service (interface + impl)  →  Repository  →  Base MySQL
```

- **Controller** : reçoit la requête HTTP, valide les DTO, renvoie la réponse.
  Ne contient **jamais** de logique métier.
- **Service** : orchestre la logique métier, gère les transactions.
- **Repository** : accès aux données via Hibernate / Spring Data JPA.
- **Mapper** : conversion Entity ↔ DTO.
- **Entity** : mappage direct des tables SQL.
- **DTO** : `xxxRequest` (entrée) et `xxxResponse` (sortie). Les entités ne
  sont **jamais** exposées directement.

### Principes SOLID appliqués

| Principe                                | Application                                                                                    |
| --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **S** — Single Responsibility           | 1 classe = 1 rôle (Controller, Service, Repository, Mapper, DTO)                               |
| **O** — Open / Closed                   | Interfaces `xxxService` + implémentations `xxxServiceImpl`                                     |
| **L** — Liskov Substitution             | Les impls respectent le contrat des interfaces                                                 |
| **I** — Interface Segregation           | Interfaces ciblées par entité, pas d'interface géante                                          |
| **D** — Dependency Inversion            | Injection par constructeur (`@RequiredArgsConstructor`) sur toutes les dépendances             |

---

## 7. Différence entre les deux backends

### Backend Hibernate (port 8081)

Utilisé pour toutes les opérations **CRUD** :

- `/api/vendeurs`, `/api/rayons`, `/api/bons-commandes`
- `/api/commissions`, `/api/paiements`, `/api/utilisateurs`
- `/api/utilisateurs/login` — authentification locale

Il illustre l'utilisation classique **d'Hibernate** avec des transactions,
des relations `@ManyToOne`, `@OneToMany`, `@ManyToMany` et des mappers manuels.

### Backend JPA (port 8082)

Utilisé pour **statistiques, rapports, classements, recherches avancées** :

- `/api/dashboard` — KPI globaux
- `/api/statistiques/classement-vendeurs`
- `/api/statistiques/rayons`
- `/api/vendeurs/page` — pagination + tri via `Pageable`
- `/api/vendeurs/search` — recherche full-text via `@Query`

Il illustre la puissance de **Spring Data JPA** :

- `Pageable` / `Sort` natifs
- `@Query` JPQL avec projection dans un DTO (`SELECT new ...`)
- `@Query` natives SQL avec agrégations (`GROUP BY`, `DATE_FORMAT`)
- Méthodes dérivées (`findByNomVendeurContainingIgnoreCase`)

Le frontend consomme **explicitement** les deux backends grâce à deux clients
Axios distincts (`hibernateApi` / `jpaApi`) déclarés dans `frontend/src/services/api.js`.

---

## 8. Modèle de données

8 tables (les noms SQL sont respectés à l'identique) :

| Table            | Description                                     |
| ---------------- | ----------------------------------------------- |
| `RAYON`          | Départements commerciaux                        |
| `VENDEUR`        | Vendeurs                                        |
| `BON_COMMANDE`   | Bons de commande (rattachés à un vendeur)       |
| `COMMISSION`     | Commissions (rattachées à un vendeur)           |
| `PAIEMENT`       | Encaissements                                   |
| `UTILISATEUR`    | Comptes locaux (authentification)               |
| `EXPLOITER`      | Association `VENDEUR` ↔ `RAYON` (many-to-many)  |
| `ETRE_PAYE_PAR`  | Association `BON_COMMANDE` ↔ `PAIEMENT` (n:n)  |

---

## 9. Validation & gestion des erreurs

- Chaque `xxxRequest` (record) porte les contraintes Bean Validation
  (`@NotBlank`, `@Email`, `@Size`, `@DecimalMin`, `@NotNull`, `@Positive`).
- Un `@RestControllerAdvice` (`GlobalExceptionHandler`) centralise les erreurs
  et retourne un JSON uniforme :

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Erreur de validation",
  "timestamp": "2025-01-01T10:15:30",
  "details": { "nomVendeur": "Le nom est obligatoire" }
}
```

Codes gérés : `400`, `404`, `409` (contrainte de clé), `500`.

---

## 10. CORS

Les deux backends autorisent explicitement l'origine `http://localhost:5173`
(voir `config/CorsConfig.java`). Aucune configuration navigateur particulière
n'est requise.

---

## 11. Tests

```bash
cd backend-hibernate
mvn test          # test unitaire de VendeurService + smoke test H2

cd backend-jpa
mvn test          # smoke test du contexte Spring
```

Les tests utilisent une base **H2 en mémoire** (mode compatibilité MySQL)
pour ne pas nécessiter WAMP.

---

## 12. Dépannage

| Problème                                                     | Solution                                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `Access denied for user 'root'@'localhost'`                  | Ajuster `spring.datasource.password` dans les deux `application.properties`           |
| `Communications link failure`                                | WAMP n'est pas démarré, ou MySQL n'écoute pas sur 3306                                |
| `Table 'db_scom_database.vendeur' doesn't exist`             | Ré-importer `database/db_scom_database.sql` dans phpMyAdmin                           |
| CORS bloqué dans le navigateur                               | Vérifier que l'URL React est bien `http://localhost:5173` (pas 5174)                  |
| `Web server failed to start. Port 8081 was already in use`   | Arrêter le processus qui utilise 8081 (ou changer le port dans `application.properties`) |
| Erreur `unsupported class file major version`                | Vous n'êtes pas sur JDK 25 — voir §2                                                  |
| `npm run dev` échoue                                         | Supprimer `node_modules` + `package-lock.json`, relancer `npm install`                |

---

## 13. Sécurité (contexte académique)

Cette application est prévue pour un usage **local / hors-ligne / démonstration
académique**. Le mot de passe utilisateur est stocké en clair et comparé
par simple égalité de chaînes. Pour un usage réel :

- ajouter Spring Security + BCrypt
- ajouter JWT ou session HTTP
- durcir les CORS et activer HTTPS

---

## 14. Licence

Projet à usage académique — libre de reprise et de modification.
