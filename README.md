<div align="center">
  <div style="background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%); padding: 50px 20px; border-radius: 15px; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 4em; font-family: sans-serif; letter-spacing: 4px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">PingR</h1>
    <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 1.4em; font-weight: 300;">RESTful Instant Messaging System</p>
  </div>

  <h3>🚀 Software Engineering Capstone Project | Class of 2026</h3>
  
  <p>
    <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java" /> &nbsp;
    <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot" /> &nbsp;
    <img src="https://img.shields.io/badge/React-2026-61DAFB?style=for-the-badge&logo=react" /> &nbsp;
    <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" /> &nbsp;
    <img src="https://img.shields.io/badge/PostgreSQL-Ready-4169E1?style=for-the-badge&logo=postgresql" />
  </p>
</div>

---

## 📖 Overview
**PingR** is a high-availability communication platform developed as a **Software Engineering** flagship project. Heavily inspired by the user experience of **Discord**, this release focuses on establishing a robust **multidirectional communication flow** and resolving critical identity management issues in multi-tenant environments.

> **💡 Engineering Decision:** To simulate real-time interaction, PingR implements a **Short Polling** strategy (5s cycles). This choice ensures Client/Server state consistency while operating on a standard, secure, and scalable REST API infrastructure.

---

## 🎨 Design & Modeling (UML & MERISE)

> **Visual & Data Engineering**: A rigorous prototyping and modeling phase was conducted to ensure a **Discord-like** seamless messaging experience and absolute data integrity.

### 🖋️ UI/UX Prototyping (Figma)
| Desktop Interface Design | Component & User Flow Architecture |
| :--- | :--- |
| <a href="https://i.ibb.co/N2s14bkG/Capture-d-cran-2026-02-17-001122.png" target="_blank"><img src="https://i.ibb.co/N2s14bkG/Capture-d-cran-2026-02-17-001122.png" alt="Figma Desktop"></a> | <a href="https://i.ibb.co/GvRrqj2t/Capture-d-cran-2026-02-17-000814.png" target="_blank"><img src="https://i.ibb.co/GvRrqj2t/Capture-d-cran-2026-02-17-000814.png" alt="Figma Architecture"></a> |

### 📊 Database & Logic
| Class Diagram (DTO Structure) | Conceptual Data Model (MCD) |
| :--- | :--- |
| <a href="https://i.ibb.co/NgbTyXsJ/Capture-d-cran-2026-02-17-001601.png" target="_blank"><img src="https://i.ibb.co/NgbTyXsJ/Capture-d-cran-2026-02-17-001601.png" alt="UML Class"></a> | <a href="https://i.ibb.co/cS2N4962/Capture-d-cran-2026-02-17-001358.png" target="_blank"><img src="https://i.ibb.co/cS2N4962/Capture-d-cran-2026-02-17-001358.png" alt="MCD Schema"></a> |

---

## 📸 Technical Showcase

### 🛡️ Authentication & Session Guard
| Client Interface | Session Storage (JWT Management) |
| :--- | :--- |
| <a href="https://i.ibb.co/m54y03jP/Capture-d-cran-2026-02-17-000001.png" target="_blank"><img src="https://i.ibb.co/m54y03jP/Capture-d-cran-2026-02-17-000001.png" alt="PingR UI"></a> | <a href="https://i.ibb.co/rRwzBBcC/image.png" target="_blank"><img src="https://i.ibb.co/rRwzBBcC/image.png" alt="PingR Debug"></a> |

> **Pro Tip:** I migrated from `localStorage` to `sessionStorage` to ensure strict browser tab isolation. Sensitive tokens are automatically cleared when the tab is closed, preventing identity overlap.

---

## 🛠️ Tech Stack & Methodology

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.x, **Apache Tomcat (Embedded)** |
| **Frontend** | React 18, Tailwind CSS, Lucide React |
| **ORM & Persistence** | **Hibernate (JPA)**, **PostgreSQL 15** |
| **DevOps & Tools** | **Docker**, **Postman**, Docker-Compose |
| **Security** | Auth JWT (HS256), BCrypt, DTO Pattern |

---

## ⚙️ Backend Architecture & API

The project follows a rigorous **N-Tier Architecture** to decouple concerns:
1. **Controller Layer**: REST endpoints exposure and payload validation via Spring Web.
2. **Service Layer**: Business logic, transaction management, and security checks.
3. **Repository Layer**: Data Access via **Hibernate** and Spring Data JPA.

### 📡 API Validation (Swagger & Postman)
| Swagger UI Documentation | Postman Endpoint Testing |
|:---:|:---:|
| <a href="https://i.ibb.co/HTkkf1R0/Capture-d-cran-2026-02-16-233603.png" target="_blank"><img src="https://i.ibb.co/HTkkf1R0/Capture-d-cran-2026-02-16-233603.png" alt="Swagger UI"></a> | <a href="https://i.ibb.co/C5M2Zhf4/Capture-d-cran-2026-02-16-233850.png" target="_blank"><img src="https://i.ibb.co/C5M2Zhf4/Capture-d-cran-2026-02-16-233850.png" alt="Data Structure"></a> |

> **Testing Strategy:** Beyond Swagger's documentation, all endpoints are verified via a **Postman Collection** to ensure JWT-protected route integrity and correct HTTP status code returns.

---

## ✅ Quality Assurance & Environment
<a href="https://i.ibb.co/d054x0hr/Capture-d-cran-2026-02-16-234149.png" target="_blank">
  <img src="https://i.ibb.co/d054x0hr/Capture-d-cran-2026-02-16-234149.png" alt="Unit Test Results">
</a>

> **Containerization:** The entire ecosystem (**Spring Boot**, **PostgreSQL**) is orchestrated using **Docker**, ensuring a "one-command" deployment and environment parity across different machines.

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/MatthieuClaessens/PingR.git

# Navigate to project
cd PingR

# Spin up the entire containerized stack
docker-compose up --build
