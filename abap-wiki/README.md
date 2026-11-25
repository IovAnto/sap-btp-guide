# ABAP Data Dictionary Wiki (Tree View)

Wiki minimale, ad alte prestazioni e focalizzata sul contenuto per la consultazione del **Dizionario Dati ABAP (DDIC)** di SAP.

Organizzata in formato gerarchico ad albero:
$$\text{Modulo (SD / MM / FI / S4)} \longrightarrow \text{Tabella} \longrightarrow \text{Campi / Colonne} \longrightarrow \text{Data Element} \longrightarrow \text{Dominio}$$

---

## Caratteristiche Chiave

* **Albero Esplorativo**: Navigazione visuale per Modulo $\rightarrow$ Tabella $\rightarrow$ Colonna $\rightarrow$ Dettaglio tecnico.
* **Informazioni Complete DDIC**:
  * Nome colonna, flag chiave primaria (`KEY`), etichetta in italiano.
  * **Etimologia tedesca** del campo (es. `FKDAT` = *Fakturadatum*, `VBRK` = *Verkaufsbeleg Rechnungskopf*).
  * **Elemento Dati (Data Element)** associato e testo breve.
  * **Dominio** con tipo dati tecnico (`CHAR`, `DATS`, `CURR`, `NUMC`, `QUAN`), lunghezza e decimali.
* **Generatore di Snippet ABAP "One-Click"**:
  * Copia immediata negli appunti delle dichiarazioni per variabili (`DATA lv_fkdat TYPE vbrk-fkdat.`), strutture (`DATA ls_vbrk TYPE vbrk.`) e tabelle interne (`DATA lt_vbrk TYPE TABLE OF vbrk.`).
* **Design Minimalista ad Alta Densità**:
  * Palette monocromatica, layout privo di distrazioni.
  * **Dark Mode** / **Light Mode** istantaneo con persistenza in `localStorage`.
  * Scorciatoia da tastiera: premi `/` in qualsiasi momento per cercare istantaneamente tra tabelle e campi.
* **Import / Export JSON Estendibile**:
  * Puoi aggiungere qualsiasi tabella standard o personalizzata (`Z*`) semplicemente incollando il JSON dal pulsante **Import JSON**.
* **Zero Build & Compatibile GitHub Pages**:
  * Applicazione 100% statica in Vanilla JS, senza Node.js, Webpack o dipendenze esterne.
  * Funziona sia aprendo direttamente `index.html` con doppio clic (`file://`) sia pubblicata su **GitHub Pages**.

---

## Struttura del Progetto

```
abap-wiki/
├── index.html              # Entry point HTML dell'applicazione
├── css/
│   └── style.css           # CSS minimale con variabili Dark/Light theme
├── js/
│   └── app.js              # Motore di ricerca, rendering albero e gestione clipboard
├── data/
│   ├── dictionary.json     # Dataset completo in formato standard JSON
│   └── tables.js           # Bundle JS per compatibilità offline / file:// senza vincoli CORS
└── README.md               # Documentazione della Wiki
```

---

## Tabelle Core Incluse nella Fase 1

1. **SD (Sales & Distribution)**:
   * `VBAK` (Testata Ordine di Vendita)
   * `VBAP` (Posizione Ordine di Vendita)
   * `VBRK` (Testata Fattura di Vendita)
   * `VBRP` (Posizione Fattura di Vendita)
   * `LIKP` (Testata Spedizione / DDT)
   * `LIPS` (Posizione Spedizione / DDT)
2. **MM (Materials Management)**:
   * `MARA` (Anagrafica Articoli - Dati Generali)
   * `MARC` (Anagrafica Articoli - Dati di Stabilimento / MRP)
   * `MARD` (Giacenze Articoli - Magazzino / Ubicazione)
   * `EKKO` (Testata Documento d'Acquisto / ODA)
   * `EKPO` (Posizione Documento d'Acquisto / ODA)
3. **FI (Financial Accounting)**:
   * `BKPF` (Testata Documento Contabile)
   * `BSEG` (Posizione Documento Contabile)
   * `KNA1` (Anagrafica Clienti Generale)
   * `LFA1` (Anagrafica Fornitori Generale)
4. **S/4HANA Innovation**:
   * `ACDOCA` (Universal Journal Entry - Libro Giornale Unificato)

---

## Pubblicazione su GitHub Pages

L'applicazione è posizionata in `abap-wiki/` all'interno del repository `sap-btp-guide`.
Una volta effettuato il push su `origin main`, l'URL pubblico su GitHub Pages è:

* **`https://iovanto.github.io/sap-btp-guide/abap-wiki/`**
