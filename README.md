<div align="center">
  <div style="background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%); padding: 50px 20px; border-radius: 15px; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 4em; font-family: sans-serif; letter-spacing: 4px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">PingR</h1>
    <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 1.4em; font-weight: 300;">Messagerie Instantanée RESTful</p>
  </div>

  <h3>🚀 Projet de Certification CDA | Promotion 2026</h3>
  
  <p>
    <img src="https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java" />
    <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot" />
    <img src="https://img.shields.io/badge/React-2025-61DAFB?style=for-the-badge&logo=react" />
    <img src="https://img.shields.io/badge/Security-JWT_HS256-black?style=for-the-badge&logo=jsonwebtokens" />
    <img src="https://img.shields.io/badge/PostgreSQL-Ready-4169E1?style=for-the-badge&logo=postgresql" />
  </p>
</div>

---

## 📖 Présentation du Projet
**PingR** est une plateforme de communication moderne développée pour la certification **Concepteur Développeur d'Applications (CDA)**. 

L'objectif principal était de concevoir un système robuste capable de gérer des échanges privés et groupés, avec une sécurité maximale via une architecture **stateless** et une gestion fine des droits d'accès (RBAC).

> **💡 Décision d'Ingénierie :** Pour simuler l'instantanéité, PingR utilise une stratégie de **Short Polling** (cycle de 5s). Ce choix permet de garantir une cohérence d'état Client/Serveur tout en restant sur une infrastructure API REST standard, sécurisée et scalable.

---

## 🎨 Conception & Méthodologie
La réalisation de ce projet a suivi une démarche de conception logicielle complète :

* **Maquettage UI/UX (Figma)** : Design de l'interface utilisateur haute fidélité pour optimiser les flux de navigation.
* **Modélisation MERISE (Looping)** : Conception du MCD et du MLD pour garantir une structure de données normalisée et performante.
* **Modélisation UML (StarUML)** : Réalisation des diagrammes de cas d'utilisation, de séquence et de classes pour structurer la logique applicative.



---

## 🛠️ Stack Technique

| Couche | Technologies |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.x, Spring Security |
| **Frontend** | React, Tailwind CSS, Lucide React |
| **Persistance** | **PostgreSQL**, Hibernate, Spring Data JPA |
| **Sécurité** | Auth JWT (HS256), DTO Pattern, Password Hashing |
| **Doc & Tests** | Swagger (OpenAPI 3), JUnit 5, Mockito |

---

## ✨ Fonctionnalités Clés

- 🔐 **Sécurité Avancée** : Authentification par JWT. Les données sensibles ne sont jamais exposées grâce à l'étanchéité des **DTOs**.
- 💬 **Moteur de Messagerie** : 
    - Logique d'unicité sur les conversations privées (gestion stricte des participants).
    - Support complet des groupes de discussion.
    - Contrôle d'accès : Vérification systématique de l'appartenance à une conversation (Custom Security Guards).
- 🔍 **UX Dynamique** : Recherche d'utilisateurs et interface réactive conçue avec React.

---

## 🏗️ Architecture Backend

Le projet suit une **architecture en couches** (N-Tier) :



1.  **Layer Controller** : Points d'entrée REST et validation des payloads.
2.  **Layer Service** : Logique métier (Validation, droits, règles de gestion).
3.  **Layer Repository** : Abstraction de la persistance PostgreSQL via Spring Data JPA.
4.  **DTOs & Mappers** : Isolation entre le modèle de données et la couche de présentation.

---

## 📡 Documentation API (Swagger)

🔗 **Lien local :** `http://localhost:8080/swagger-ui/index.html`

---

## ⚙️ Installation & Lancement

### Lancement via Docker (Recommandé)
```bash
git clone https://github.com/MatthieuClaessens/PingR.git
cd PingR
docker-compose up --build
