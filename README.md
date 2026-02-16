<div align="center">
  <div style="background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%); padding: 50px 20px; border-radius: 15px; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 4em; font-family: sans-serif; letter-spacing: 4px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">PingR</h1>
    <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 1.4em; font-weight: 300;">RESTful Instant Messaging System</p>
  </div>

  <h3>🚀 Software Engineering Capstone Project | Class of 2026</h3>
  
  <p>
    <img src="https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java" /> &nbsp;
    <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot" /> &nbsp;
    <img src="https://img.shields.io/badge/React-2025-61DAFB?style=for-the-badge&logo=react" /> &nbsp;
    <img src="https://img.shields.io/badge/Security-JWT_HS256-black?style=for-the-badge&logo=jsonwebtokens" /> &nbsp;
    <img src="https://img.shields.io/badge/PostgreSQL-Ready-4169E1?style=for-the-badge&logo=postgresql" />
  </p>
</div>

---

## 📖 Overview
**PingR** is a high-availability communication platform developed as a **Software Engineering** flagship project. This stable release focuses on establishing a robust **multidirectional communication flow** and resolving critical identity management issues in multi-tenant environments.

> **💡 Engineering Decision:** To simulate real-time interaction, PingR implements a **Short Polling** strategy (5s cycles). This choice ensures Client/Server state consistency while operating on a standard, secure, and scalable REST API infrastructure.

---

## 🎨 Design & Modeling (UML & MERISE)

> **Visual & Data Engineering**: A rigorous prototyping and modeling phase was conducted to ensure a seamless messaging experience and absolute data integrity.

### 🖋️ UI/UX Prototyping (Figma)
| Desktop Interface Design | Component & User Flow Architecture |
| :--- | :--- |
| <a href="https://i.ibb.co/N2s14bkG/Capture-d-cran-2026-02-17-001122.png" target="_blank" rel="noopener noreferrer"><img src="https://i.ibb.co/N2s14bkG/Capture-d-cran-2026-02-17-001122.png" alt="Figma Desktop"></a> | <a href="https://i.ibb.co/GvRrqj2t/Capture-d-cran-2026-02-17-000814.png" target="_blank" rel="noopener noreferrer"><img src="https://i.ibb.co/GvRrqj2t/Capture-d-cran-2026-02-17-000814.png" alt="Figma Architecture"></a> |

### 👥 Functional & Logic Modeling (UML)
| Use Case Diagram (Roles) | Sequence Diagram (Logic Flow) |
| :--- | :--- |
| <a href="https://i.ibb.co/q33WKJd1/Capture-d-cran-2026-02-17-001705.png" target="_blank" rel="noopener noreferrer"><img src="https://i.ibb.co/q33WKJd1/Capture-d-cran-2026-02-17-001705.png" alt="UML Use Case"></a> | <a href="https://i.ibb.co/C3hm24Q8/Capture-d-cran-2026-02-17-001807.png" target="_blank" rel="noopener noreferrer"><img src="https://i.ibb.co/C3hm24Q8/Capture-d-cran-2026-02-17-001807.png" alt="UML Sequence"></a> |

| Class Diagram (Data & DTO Structure) |
| :--- |
| <a href="https://i.ibb.co/NgbTyXsJ/Capture-d-cran-2026-02-17-001601.png" target="_blank" rel="noopener noreferrer"><img src="https://i.ibb.co/NgbTyXsJ/Capture-d-cran-2026-02-17-001601.png" alt="UML Class Diagram"></a> |

### 📊 Database Architecture (MERISE)
| Conceptual Data Model (MCD) | Logical Data Model (MLD) |
| :--- | :--- |
| <a href="https://i.ibb.co/cS2N4962/Capture-d-cran-2026-02-17-001358.png" target="_blank" rel="noopener noreferrer"><img src="https://i.ibb.co/cS2N4962/Capture-d-cran-2026-02-17-001358.png" alt="MCD Schema"></a> | <a href="https://i.ibb.co/zhkmFtnH/Capture-d-cran-2026-02-17-001413.png" target="_blank" rel="noopener noreferrer"><img src="https://i.ibb.co/zhkmFtnH/Capture-d-cran-2026-02-17-001413.png" alt="MLD Schema"></a> |

---

## 📸 Technical Showcase

### 🌐 Multidirectional UI & UX
<a href="https://i.ibb.co/NdvBXXHj/Capture-d-cran-2026-02-16-234856.png" target="_blank" rel="noopener noreferrer">
  <img src="https://i.ibb.co/NdvBXXHj/Capture-d-cran-2026-02-16-234856.png" alt="Front-end Preview">
</a>

> **Visual distinction**: Dynamic color system for participants. This view demonstrates the successful rendering of a group conversation where incoming and outgoing messages are clearly separated and identified.

### 🛡️ Authentication & Session Guard
| Client Interface | Session Storage (JWT Management) |
| :--- | :--- |
| <a href="https://i.ibb.co/m54y03jP/Capture-d-cran-2026-02-17-000001.png" target="_blank" rel="noopener noreferrer"><img src="https://i.ibb.co/m54y03jP/Capture-d-cran-2026-02-17-000001.png" alt="PingR UI"></a> | <a href="https://i.ibb.co/rRwzBBcC/image.png" target="_blank" rel="noopener noreferrer"><img src="https://i.ibb.co/rRwzBBcC/image.png" alt="PingR Debug"></a> |

> **Pro Tip:** I migrated from `localStorage` to `sessionStorage` to ensure strict browser tab isolation. Sensitive tokens are automatically cleared when the tab is closed, preventing identity overlap.

---

## 🛠️ Tech Stack & Methodology

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.x, Spring Security |
| **Frontend** | React, Tailwind CSS, Lucide React |
| **Persistence** | **PostgreSQL**, Hibernate, Spring Data JPA |
| **Security** | Auth JWT (HS256), DTO Pattern, Password Hashing |

---

## ⚙️ Backend Architecture & API

The project implements a rigorous **N-Tier Architecture** to decouple concerns:
1. **Controller Layer**: REST endpoints exposure and payload validation.
2. **Service Layer**: Business logic (management rules and RBAC).
3. **Repository Layer**: Persistence abstraction via Spring Data JPA.
4. **DTOs & Mappers**: Strict isolation to ensure JPA entities are never exposed directly to the client.

### 📡 API Documentation (Swagger)
| 🛠️ API Endpoints | 📊 Data Structure |
|:---:|:---:|
| <a href="https://i.ibb.co/HTkkf1R0/Capture-d-cran-2026-02-16-233603.png" target="_blank" rel="noopener noreferrer"><img src="https://i.ibb.co/HTkkf1R0/Capture-d-cran-2026-02-16-233603.png" alt="Swagger UI"></a> | <a href="https://i.ibb.co/C5M2Zhf4/Capture-d-cran-2026-02-16-233850.png" target="_blank" rel="noopener noreferrer"><img src="https://i.ibb.co/C5M2Zhf4/Capture-d-cran-2026-02-16-233850.png" alt="DTO Structure"></a> |

---

## ✅ Quality Assurance
<a href="https://i.ibb.co/d054x0hr/Capture-d-cran-2026-02-16-234149.png" target="_blank" rel="noopener noreferrer">
  <img src="https://i.ibb.co/d054x0hr/Capture-d-cran-2026-02-16-234149.png" alt="Unit Test Results">
</a>

> **Reliability**: Core features are covered by **JUnit 5** and **Mockito**. JWT-protected endpoints are fully tested to ensure no message can be posted without a valid session.

---

## 🚀 Installation

```bash
git clone https://github.com/MatthieuClaessens/PingR.git
cd PingR
docker-compose up --build
