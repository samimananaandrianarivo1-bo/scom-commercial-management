-- ============================================================
--  SCOM - Système de Gestion Commerciale
--  Base de données : db_scom_database
--  SGBD : MySQL (WAMP)
-- ============================================================
--  Exécuter dans phpMyAdmin ou dans un client MySQL :
--    - Se connecter à MySQL (root)
--    - Copier / coller ce fichier
--    - Vérifier que la base `db_scom_database` a été créée
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
--  Jeu de données de démonstration
-- ============================================================

INSERT INTO RAYON (ID_rayon, code_rayon, nom_rayon, description_rayon) VALUES
    (1, 'RAY-ELEC', 'Électronique',      'TV, hi-fi, informatique'),
    (2, 'RAY-ALIM', 'Alimentation',      'Épicerie fine et produits frais'),
    (3, 'RAY-VETE', 'Vêtements',         'Prêt-à-porter homme et femme'),
    (4, 'RAY-MEUB', 'Meubles',           'Mobilier et décoration');

INSERT INTO VENDEUR (ID_vendeur, code_vendeur, nom_vendeur, prenom_vendeur, email_vendeur, telephone_vendeur, adresse_vendeur) VALUES
    (1, 'V001', 'El Amrani', 'Mounir', 'mounir@scom.local', '+212600000001', 'Casablanca'),
    (2, 'V002', 'Benali',    'Salma',  'salma@scom.local',  '+212600000002', 'Rabat'),
    (3, 'V003', 'Idrissi',   'Karim',  'karim@scom.local',  '+212600000003', 'Fès'),
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
    (3, 'operateur', 'operateur123', 'Opérateur de Saisie',  'operateur@scom.local', 'OPERATEUR');

-- ============================================================
--  Fin du script
-- ============================================================
