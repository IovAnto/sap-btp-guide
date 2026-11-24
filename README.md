# SAP BTP Master Guide & Enterprise Certification Hub

> **Guida interattiva e pragmatica per lo studio, il lavoro e la certificazione su SAP Business Technology Platform (SAP BTP).**  
> Basata sul testo ufficiale Rheinwerk / SAP PRESS *"SAP Business Technology Platform (SAP BTP): An Introduction"*.

🌐 **Accedi alle applicazioni live su GitHub Pages**:  
* 👉 **[SAP BTP Master Guide](https://iovanto.github.io/sap-btp-guide/)**
* 👉 **[ABAP Data Dictionary (DDIC) Tree Wiki](https://iovanto.github.io/sap-btp-guide/abap-wiki/)** (Reference minimale per Tabelle, Colonne, Data Element, Domini e Snippet)

---

## 📌 Panoramica del Progetto

Questa applicazione è una Single Page Application autonoma ad alte prestazioni, fruibile da qualsiasi dispositivo (desktop, tablet, smartphone) sia online che offline.

### 📊 Numeri Chiave
- **18 Capitoli Integrali**: Copertura completa di Fondamenti, Architettura, Componenti BTP e tutti i Casi d'Uso Reali di settore.
- **180 Domande di Quiz & Certificazione**: 10 domande per capitolo con feedback immediato e spiegazione architetturale approfondita.
- **63 Figure e Diagrammi Ufficiali**: Schemi architetturali estratti dal testo SAP Press ad alta risoluzione con Lightbox interattivo.
- **179 Definizioni e Glossario**: Concetti chiave formalizzati per colloqui tecnici ed esami.
- **93 Best Practice di Cantiere**: Linee guida pratiche con livelli di rischio espliciti (`[CRITICO]`, `[ALTO]`, `[MEDIO]`).
- **18 Blueprint Architetturali**: Schemi di topologia ASCII e modelli di flusso end-to-end.
- **Persistenza Locale**: Avanzamento e risposte ai quiz salvati automaticamente nel browser (`localStorage`).

---

## 📚 Struttura dei Contenuti

### Parte I: Overview & Architettura
1. **Capitolo 01**: Introduzione, Digital Transformation, Intelligent Enterprise, O-Data vs X-Data, Clean Core e i 4 Pilastri Tecnologici.
2. **Capitolo 02**: Setup e Amministrazione degli Account, Gerarchia (Global Account, Directory, Subaccount), Modelli Commerciali (CPEA, Pay-As-You-Go, Subscription, Free Tier), Entitlements, Quotas & Boosters.
3. **Capitolo 03**: Pattern Architetturali e Metodologia di Sviluppo (TOGAF ADM, Lean EA, Microservizi, Serverless, Event-Driven, 5-Phase Approach).

### Parte II: Concetti Chiave & Servizi
4. **Capitolo 04**: User Interface (SAP Fiori UX, Launchpad Service / Work Zone, Managed vs Standalone App Router, SAPUI5 vs Fiori Elements, MDK).
5. **Capitolo 05**: Business Logic & Runtimes (Cloud Foundry, Kyma, ABAP Steampunk, CAP Node.js/Java con CDS, RAP, Draft Handling, Workflow Management).
6. **Capitolo 06**: Integrazione di Processi e Sistemi (ISA-M, SAP Integration Suite, Cloud Integration CPI, API Management, Open Connectors, Integration Advisor, Event Mesh, Cloud Connector).
7. **Capitolo 07**: Database & Integrazione Dati (SAP HANA Cloud multi-modello, Data Tiering Hot/Warm/Cold, Data Lake, SDI/SDA, SAP Data Intelligence).
8. **Capitolo 08**: Analytics (SAP Analytics Cloud, Augmented Analytics con Smart Assist, Enterprise Planning, SAP Datasphere / Data Warehouse Cloud).
9. **Capitolo 09**: Sicurezza (Shared Responsibility, SAP Cloud Identity Services IAS/IPS, XSUAA Scopes & Role Collections, Principal Propagation con certificati X.509).
10. **Capitolo 10**: DevOps & ALM (Plan-Develop-Deliver-Operate, SAP CI/CD, Project Piper, Business Application Studio, MTA, Cloud Transport Management cTMS, Alert Notification, Automation Pilot, Cloud ALM).
11. **Capitolo 11**: Identificazione Casi d'Uso (8 Archetipi di Innovazione, Fit-to-Standard in SAP Activate, Commodity vs Differentiator, In-App vs Side-by-Side Extensibility, RICEFW Modernization Matrix).

### Parte III: Casi d'Uso Reali di Settore
12. **Capitolo 12**: *Ming Bike Inc.* — Gestione di ERP Multipli ed Estensione di SAP S/4HANA (Two-Tier ERP, Hub di Armonizzazione, Canonical Data Model, Pattern Saga).
13. **Capitolo 13**: *BayView Hotels* — Governance della Spesa di Procurement con SAP Ariba (Tail Spend, Maverick Buying, Spend Cube in HANA Cloud, Augmented Analytics).
14. **Capitolo 14**: *Aceme Inc.* — Portale di Guided Prehire Experience per SAP SuccessFactors (Pre-onboarding, Identity Federation via IAS, SuccessFactors Work Zone, Object Store cifrato).
15. **Capitolo 15**: *Qitic Inc.* — Duty of Care & Integrazione del Rischio Pandemico con SAP Concur (BTP ABAP Steampunk come Risk Hub, REST APIs, Cloud Connector verso mail server on-premise).
16. **Capitolo 16**: *Teleporter* — Churn Prevention & Closed-Loop Customer Experience con Qualtrics e SAP Service Cloud (X-Data + O-Data, Sentiment Analysis, Webhooks).
17. **Capitolo 17**: *Nutri-formance* — Sviluppo di Applicazioni SaaS Multitenant su CAP e ABAP Steampunk (Tenant Awareness, Isolamento Schemi con Container HDI via Service Manager, `@sap/cds-mtx`, `saas-registry`, Landscape Portal).
18. **Capitolo 18**: *Samaritan* — Applicazioni Cloud-Native su SAP BTP, Kyma Runtime (Cluster Kubernetes enterprise fully-managed, Container Docker, Helm, Istio APIRules sicure con OAuth 2.0 / JWT, Horizontal Pod Autoscaler HPA).

---

## 💻 Utilizzo Locale

Per consultare l'applicazione in locale senza connessione web:
```bash
# Clona il repository
git clone https://github.com/IovAnto/sap-btp-guide.git
cd sap-btp-guide

# Apri semplicemente index.html nel tuo browser
xdg-open index.html   # Linux
open index.html       # macOS
start index.html      # Windows
```

---

## 📄 Licenza & Note
Guida realizzata a scopo formativo e professionale. Contenuti e riferimenti basati sulla documentazione ufficiale e sulle pubblicazioni Rheinwerk / SAP PRESS.
