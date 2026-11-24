// ABAP Data Dictionary Core Dataset (Rich Examples)
window.ABAP_DICTIONARY = {
  "metadata": {
    "title": "ABAP Data Dictionary Reference",
    "version": "1.0.0",
    "generated": "2026-11-24",
    "totalTables": 15
  },
  "modules": [
    {
      "id": "SD",
      "name": "Sales & Distribution",
      "description": "Vendite, Fatturazione, Consegne"
    },
    {
      "id": "MM",
      "name": "Materials Management",
      "description": "Anagrafica Articoli, Ordini di Acquisto, Magazzino"
    },
    {
      "id": "FI",
      "name": "Financial Accounting",
      "description": "Contabilità Generale, Clienti, Fornitori"
    },
    {
      "id": "S4",
      "name": "S/4HANA Innovation",
      "description": "Tabelle unificate di nuova generazione (Universal Journal)"
    }
  ],
  "tables": [
    {
      "tableName": "VBRK",
      "module": "SD",
      "shortText": "Fattura di vendita: Dati di testata",
      "germanEtymology": "Verkaufsbeleg: Rechnungskopf",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Contiene le informazioni generali di testata per tutti i documenti di fatturazione emessi a clienti (fatture, note di credito, note di debito, storni).",
      "mainKey": [
        "MANDT",
        "VBELN"
      ],
      "relationships": [
        {
          "targetTable": "VBRP",
          "foreignKey": "VBELN",
          "description": "Posizioni / righe della fattura"
        },
        {
          "targetTable": "KNA1",
          "foreignKey": "KUNAG = KUNNR",
          "description": "Anagrafica del cliente committente"
        },
        {
          "targetTable": "BKPF",
          "foreignKey": "BELNR = BELNR AND GJAHR = GJAHR",
          "description": "Documento contabile registrato in Finanza (FI)"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante (Client SAP)",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Identificativo mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "VBELN",
          "isKey": true,
          "shortText": "Numero documento di fatturazione",
          "germanName": "Verkaufsbelegnummer (Rechnung)",
          "dataElement": {
            "name": "VBELN_VF",
            "shortText": "Documento di fatturazione",
            "domain": {
              "name": "VBELN",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento"
            }
          }
        },
        {
          "position": 3,
          "fieldname": "FKART",
          "isKey": false,
          "shortText": "Tipo di fatturazione",
          "germanName": "Fakturaart",
          "dataElement": {
            "name": "FKART",
            "shortText": "Tipo fattura (es. F2=Fattura, G2=Nota credito)",
            "domain": {
              "name": "FKART",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Tipo fattura"
            }
          },
          "examples": [
            {
              "code": "F2",
              "desc": "Fattura standard di vendita (creata dopo consegna merce o prestazione)"
            },
            {
              "code": "F1",
              "desc": "Fattura d'ordine (senza bolla di consegna)"
            },
            {
              "code": "G2",
              "desc": "Nota di accredito (Credit Memo) emessa per reso o sconto post-vendita"
            },
            {
              "code": "L2",
              "desc": "Nota di addebito (Debit Memo) per addebito spese o conguaglio"
            },
            {
              "code": "RE",
              "desc": "Fattura resi merce da cliente"
            },
            {
              "code": "S1",
              "desc": "Storno fattura (inverte contabilmente una fattura errata)"
            },
            {
              "code": "IV",
              "desc": "Fatturazione interna infragruppo (Intercompany Billing)"
            }
          ],
          "businessMeaning": "Determina la procedura di fatturazione, il conto contabile e la tipologia di documento IVA generato."
        },
        {
          "position": 4,
          "fieldname": "VBTYP",
          "isKey": false,
          "shortText": "Tipo di documento commerciale",
          "germanName": "Verkaufsbelegtyp",
          "dataElement": {
            "name": "VBTYP",
            "shortText": "Categoria documento SD (M=Fattura, P=Nota debito)",
            "domain": {
              "name": "VBTYP",
              "dataType": "CHAR",
              "length": 1,
              "decimals": 0,
              "shortText": "Tipo documento SD"
            }
          },
          "examples": [
            {
              "code": "M",
              "desc": "Fattura standard (Invoice)"
            },
            {
              "code": "P",
              "desc": "Nota di addebito (Debit Memo)"
            },
            {
              "code": "O",
              "desc": "Fattura pro-forma"
            },
            {
              "code": "N",
              "desc": "Storno fattura"
            },
            {
              "code": "5",
              "desc": "Fattura intercompany infragruppo"
            }
          ],
          "businessMeaning": "Identifica la natura logica e la classificazione del documento all'interno del modulo SD."
        },
        {
          "position": 5,
          "fieldname": "WAERK",
          "isKey": false,
          "shortText": "Divisa del documento SD",
          "germanName": "Währung",
          "dataElement": {
            "name": "WAERK",
            "shortText": "Divisa del documento commerciale (EUR, USD, ecc.)",
            "domain": {
              "name": "WAERS",
              "dataType": "CUKY",
              "length": 5,
              "decimals": 0,
              "shortText": "Codice divisa"
            }
          }
        },
        {
          "position": 6,
          "fieldname": "VKORG",
          "isKey": false,
          "shortText": "Organizzazione commerciale",
          "germanName": "Verkaufsorganisation",
          "dataElement": {
            "name": "VKORG",
            "shortText": "Organizzazione commerciale responsabile della vendita",
            "domain": {
              "name": "VKORG",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Organizzazione commerciale"
            }
          },
          "examples": [
            {
              "code": "1000",
              "desc": "Organizzazione commerciale Italia Sede Centrale"
            },
            {
              "code": "2000",
              "desc": "Organizzazione commerciale Export / Estero"
            }
          ],
          "businessMeaning": "Ente giuridico responsabile della negoziazione e della vendita al cliente."
        },
        {
          "position": 7,
          "fieldname": "VTWEG",
          "isKey": false,
          "shortText": "Canale distributivo",
          "germanName": "Vertriebsweg",
          "dataElement": {
            "name": "VTWEG",
            "shortText": "Canale distributivo (Ingrosso, Dettaglio, E-commerce)",
            "domain": {
              "name": "VTWEG",
              "dataType": "CHAR",
              "length": 2,
              "decimals": 0,
              "shortText": "Canale distributivo"
            }
          },
          "examples": [
            {
              "code": "10",
              "desc": "Vendita all'ingrosso (Wholesale)"
            },
            {
              "code": "20",
              "desc": "Vendita al dettaglio (Retail)"
            },
            {
              "code": "30",
              "desc": "Canale E-commerce / Web Shop"
            }
          ],
          "businessMeaning": "Canale commerciale attraverso cui la merce o il servizio raggiunge il cliente."
        },
        {
          "position": 8,
          "fieldname": "FKDAT",
          "isKey": false,
          "shortText": "Data fattura per indice e stampa",
          "germanName": "Fakturadatum",
          "dataElement": {
            "name": "FKDAT",
            "shortText": "Data di fatturazione",
            "domain": {
              "name": "DATUM",
              "dataType": "DATS",
              "length": 8,
              "decimals": 0,
              "shortText": "Data formato AAAAMMGG"
            }
          },
          "examples": [
            {
              "code": "20261124",
              "desc": "Data di emissione fattura memorizzata in formato DB YYYYMMDD (a video: 24.11.2026)"
            }
          ],
          "businessMeaning": "Data contabile e fiscale usata per il calcolo dell'IVA e per la scadenza dei pagamenti."
        },
        {
          "position": 9,
          "fieldname": "BELNR",
          "isKey": false,
          "shortText": "Numero documento contabile collegato",
          "germanName": "Belegnummer (FI)",
          "dataElement": {
            "name": "BELNR_D",
            "shortText": "Numero documento contabile registrato in BKPF",
            "domain": {
              "name": "BELNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento contabile"
            }
          }
        },
        {
          "position": 10,
          "fieldname": "GJAHR",
          "isKey": false,
          "shortText": "Esercizio contabile",
          "germanName": "Geschäftsjahr",
          "dataElement": {
            "name": "GJAHR",
            "shortText": "Anno fiscale / Esercizio contabile",
            "domain": {
              "name": "GJAHR",
              "dataType": "NUMC",
              "length": 4,
              "decimals": 0,
              "shortText": "Esercizio"
            }
          }
        },
        {
          "position": 11,
          "fieldname": "KUNRG",
          "isKey": false,
          "shortText": "Destinatario fattura (Payer)",
          "germanName": "Kunde Rechnungsempfänger",
          "dataElement": {
            "name": "KUNRG",
            "shortText": "Codice anagrafico del soggetto pagatore",
            "domain": {
              "name": "KUNNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero cliente"
            }
          },
          "examples": [
            {
              "code": "0001000245",
              "desc": "Spesso coincide col committente, ma può essere la casa madre per una filiale"
            }
          ],
          "businessMeaning": "Pagatore (Payer): il soggetto giuridico a cui è intestata la fattura e che effettua il bonifico."
        },
        {
          "position": 12,
          "fieldname": "KUNAG",
          "isKey": false,
          "shortText": "Committente (Sold-to party)",
          "germanName": "Kunde Auftraggeber",
          "dataElement": {
            "name": "KUNAG",
            "shortText": "Codice anagrafico del cliente che ha ordinato",
            "domain": {
              "name": "KUNNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero cliente"
            }
          },
          "examples": [
            {
              "code": "0001000245",
              "desc": "Codice anagrafico a 10 cifre del cliente che ha emesso l'ordine"
            }
          ],
          "businessMeaning": "Committente (Sold-to party): l'entità che ha firmato il contratto o l'ordine d'acquisto."
        },
        {
          "position": 13,
          "fieldname": "NETWR",
          "isKey": false,
          "shortText": "Valore netto del documento",
          "germanName": "Nettowert",
          "dataElement": {
            "name": "NETWR",
            "shortText": "Valore netto complessivo della fattura",
            "domain": {
              "name": "WERTV8",
              "dataType": "CURR",
              "length": 15,
              "decimals": 2,
              "shortText": "Importo valuta"
            }
          }
        },
        {
          "position": 14,
          "fieldname": "RFBSK",
          "isKey": false,
          "shortText": "Stato trasferimento in contabilità",
          "germanName": "Rechnungsfreigabestatus FI",
          "dataElement": {
            "name": "RFBSK",
            "shortText": "Stato registrazione contabile (C=Registrato, A=Bloccato)",
            "domain": {
              "name": "RFBSK",
              "dataType": "CHAR",
              "length": 1,
              "decimals": 0,
              "shortText": "Stato trasferimento FI"
            }
          },
          "examples": [
            {
              "code": "C",
              "desc": "Registrazione contabile eseguita con successo in FI (documento creato)"
            },
            {
              "code": "A",
              "desc": "Fattura bloccata per il trasferimento in contabilità (necessario rilascio in VF02)"
            },
            {
              "code": "B",
              "desc": "Errore durante la determinazione dei conti contabili (manca configurazione in VKOA)"
            }
          ],
          "businessMeaning": "Mostra se la fattura ha già creato la registrazione contabile di ricavo nel modulo FI."
        }
      ]
    },
    {
      "tableName": "VBRP",
      "module": "SD",
      "shortText": "Fattura di vendita: Dati di posizione",
      "germanEtymology": "Verkaufsbeleg: Rechnungsposition",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Contiene le singole righe di dettaglio merce/servizio fatturate, con quantità, prezzi e articoli.",
      "mainKey": [
        "MANDT",
        "VBELN",
        "POSNR"
      ],
      "relationships": [
        {
          "targetTable": "VBRK",
          "foreignKey": "VBELN",
          "description": "Testata della fattura corrispondente"
        },
        {
          "targetTable": "MARA",
          "foreignKey": "MATNR",
          "description": "Dati generali dell articolo fatturato"
        },
        {
          "targetTable": "VBAP",
          "foreignKey": "AUBEL = VBELN AND AUPOS = POSNR",
          "description": "Riga ordine di vendita originale"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "VBELN",
          "isKey": true,
          "shortText": "Numero documento di fatturazione",
          "germanName": "Verkaufsbelegnummer",
          "dataElement": {
            "name": "VBELN_VF",
            "shortText": "Documento di fatturazione",
            "domain": {
              "name": "VBELN",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento"
            }
          }
        },
        {
          "position": 3,
          "fieldname": "POSNR",
          "isKey": true,
          "shortText": "Numero di posizione",
          "germanName": "Positionsnummer",
          "dataElement": {
            "name": "POSNR_VF",
            "shortText": "Numero riga fattura (es. 000010, 000020)",
            "domain": {
              "name": "POSNR",
              "dataType": "NUMC",
              "length": 6,
              "decimals": 0,
              "shortText": "Numero posizione"
            }
          }
        },
        {
          "position": 4,
          "fieldname": "FKIMG",
          "isKey": false,
          "shortText": "Quantità effettivamente fatturata",
          "germanName": "Fakturierte Menge",
          "dataElement": {
            "name": "FKIMG",
            "shortText": "Quantità fatturata",
            "domain": {
              "name": "MENGV13",
              "dataType": "QUAN",
              "length": 13,
              "decimals": 3,
              "shortText": "Quantità"
            }
          }
        },
        {
          "position": 5,
          "fieldname": "VRKME",
          "isKey": false,
          "shortText": "Unità di misura di vendita",
          "germanName": "Verkaufsmengeneinheit",
          "dataElement": {
            "name": "VRKME",
            "shortText": "Unità di misura commerciale (PZ, KG, M, ecc.)",
            "domain": {
              "name": "MEINS",
              "dataType": "UNIT",
              "length": 3,
              "decimals": 0,
              "shortText": "Unità di misura"
            }
          }
        },
        {
          "position": 6,
          "fieldname": "NETWR",
          "isKey": false,
          "shortText": "Valore netto della posizione",
          "germanName": "Nettowert Position",
          "dataElement": {
            "name": "NETWR_FP",
            "shortText": "Valore netto della singola riga",
            "domain": {
              "name": "WERTV8",
              "dataType": "CURR",
              "length": 15,
              "decimals": 2,
              "shortText": "Importo valuta"
            }
          }
        },
        {
          "position": 7,
          "fieldname": "MATNR",
          "isKey": false,
          "shortText": "Codice Articolo / Materiale",
          "germanName": "Materialnummer",
          "dataElement": {
            "name": "MATNR",
            "shortText": "Codice articolo (chiave di MARA)",
            "domain": {
              "name": "MATNR",
              "dataType": "CHAR",
              "length": 18,
              "decimals": 0,
              "shortText": "Numero materiale"
            }
          }
        },
        {
          "position": 8,
          "fieldname": "ARKTX",
          "isKey": false,
          "shortText": "Descrizione articolo nella fattura",
          "germanName": "Artikelkurztext",
          "dataElement": {
            "name": "ARKTX",
            "shortText": "Descrizione testuale dell articolo fatturato",
            "domain": {
              "name": "TEXT40",
              "dataType": "CHAR",
              "length": 40,
              "decimals": 0,
              "shortText": "Testo 40 caratteri"
            }
          }
        },
        {
          "position": 9,
          "fieldname": "WERKS",
          "isKey": false,
          "shortText": "Divisione / Stabilimento (Plant)",
          "germanName": "Werk",
          "dataElement": {
            "name": "WERKS_D",
            "shortText": "Stabilimento da cui proviene la merce",
            "domain": {
              "name": "WERKS",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Divisione"
            }
          },
          "examples": [
            {
              "code": "1000",
              "desc": "Stabilimento Milano / Sede centrale"
            },
            {
              "code": "1010",
              "desc": "Stabilimento Produzione Torino"
            }
          ],
          "businessMeaning": "Unità organizzativa deputata alla produzione, immagazzinamento o spedizione merci."
        },
        {
          "position": 10,
          "fieldname": "AUBEL",
          "isKey": false,
          "shortText": "Numero ordine di vendita originale",
          "germanName": "Auftragsbelegnummer",
          "dataElement": {
            "name": "AUBEL",
            "shortText": "Numero documento ordine di provenienza (VBAK)",
            "domain": {
              "name": "VBELN",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento"
            }
          }
        },
        {
          "position": 11,
          "fieldname": "AUPOS",
          "isKey": false,
          "shortText": "Posizione ordine di provenienza",
          "germanName": "Auftragspositionsnummer",
          "dataElement": {
            "name": "AUPOS",
            "shortText": "Numero riga ordine di provenienza (VBAP)",
            "domain": {
              "name": "POSNR",
              "dataType": "NUMC",
              "length": 6,
              "decimals": 0,
              "shortText": "Numero posizione"
            }
          }
        }
      ]
    },
    {
      "tableName": "VBAK",
      "module": "SD",
      "shortText": "Ordine di vendita: Dati di testata",
      "germanEtymology": "Verkaufsbeleg: Auftragskopf",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Testata degli ordini di vendita commerciali, preventivi e richieste d offerta.",
      "mainKey": [
        "MANDT",
        "VBELN"
      ],
      "relationships": [
        {
          "targetTable": "VBAP",
          "foreignKey": "VBELN",
          "description": "Posizioni / righe dell ordine di vendita"
        },
        {
          "targetTable": "KNA1",
          "foreignKey": "KUNNR",
          "description": "Anagrafica cliente ordinante"
        },
        {
          "targetTable": "VBKD",
          "foreignKey": "VBELN",
          "description": "Condizioni commerciali e bancarie dell ordine"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "VBELN",
          "isKey": true,
          "shortText": "Numero ordine di vendita",
          "germanName": "Verkaufsbelegnummer (Auftrag)",
          "dataElement": {
            "name": "VBELN_VA",
            "shortText": "Numero ordine di vendita",
            "domain": {
              "name": "VBELN",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento"
            }
          }
        },
        {
          "position": 3,
          "fieldname": "ERDAT",
          "isKey": false,
          "shortText": "Data di creazione del record",
          "germanName": "Erfassungsdatum",
          "dataElement": {
            "name": "ERDAT",
            "shortText": "Data in cui l ordine è stato inserito a sistema",
            "domain": {
              "name": "DATUM",
              "dataType": "DATS",
              "length": 8,
              "decimals": 0,
              "shortText": "Data"
            }
          }
        },
        {
          "position": 4,
          "fieldname": "ERNAM",
          "isKey": false,
          "shortText": "Nome utente creatore",
          "germanName": "Erfassername",
          "dataElement": {
            "name": "ERNAM",
            "shortText": "Username SAP dell utente che ha registrato l ordine",
            "domain": {
              "name": "USNAM",
              "dataType": "CHAR",
              "length": 12,
              "decimals": 0,
              "shortText": "Nome utente"
            }
          }
        },
        {
          "position": 5,
          "fieldname": "AUDAT",
          "isKey": false,
          "shortText": "Data del documento / ordine",
          "germanName": "Auftragsdatum",
          "dataElement": {
            "name": "AUDAT",
            "shortText": "Data ufficiale della richiesta d ordine del cliente",
            "domain": {
              "name": "DATUM",
              "dataType": "DATS",
              "length": 8,
              "decimals": 0,
              "shortText": "Data"
            }
          }
        },
        {
          "position": 6,
          "fieldname": "AUART",
          "isKey": false,
          "shortText": "Tipo documento di vendita",
          "germanName": "Auftragsart",
          "dataElement": {
            "name": "AUART",
            "shortText": "Tipo ordine (OR=Ordine standard, QT=Preventivo)",
            "domain": {
              "name": "AUART",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Tipo ordine"
            }
          },
          "examples": [
            {
              "code": "OR",
              "desc": "Ordine standard di vendita (Standard Sales Order)"
            },
            {
              "code": "QT",
              "desc": "Preventivo commerciale / Offerta formale (Quotation)"
            },
            {
              "code": "IN",
              "desc": "Richiesta di offerta conoscitiva cliente (Inquiry)"
            },
            {
              "code": "FD",
              "desc": "Consegna gratuita di campionatura (Free of charge)"
            },
            {
              "code": "KB",
              "desc": "Carico merce in conto deposito cliente (Consignment Fill-up)"
            },
            {
              "code": "KE",
              "desc": "Prelievo merce da conto deposito cliente (Consignment Issue)"
            },
            {
              "code": "CR",
              "desc": "Richiesta di nota di accredito per reclamo"
            }
          ],
          "businessMeaning": "Governa l'intero flusso documentale (se richiede spedizione merce, fattura, blocchi di credito)."
        },
        {
          "position": 7,
          "fieldname": "NETWR",
          "isKey": false,
          "shortText": "Valore netto complessivo ordine",
          "germanName": "Nettowert Auftrag",
          "dataElement": {
            "name": "NETWR_AK",
            "shortText": "Totale netto ordine in divisa documento",
            "domain": {
              "name": "WERTV8",
              "dataType": "CURR",
              "length": 15,
              "decimals": 2,
              "shortText": "Importo valuta"
            }
          }
        },
        {
          "position": 8,
          "fieldname": "WAERK",
          "isKey": false,
          "shortText": "Divisa dell ordine",
          "germanName": "Währung",
          "dataElement": {
            "name": "WAERK",
            "shortText": "Divisa del documento di vendita",
            "domain": {
              "name": "WAERS",
              "dataType": "CUKY",
              "length": 5,
              "decimals": 0,
              "shortText": "Codice divisa"
            }
          }
        },
        {
          "position": 9,
          "fieldname": "VKORG",
          "isKey": false,
          "shortText": "Organizzazione commerciale",
          "germanName": "Verkaufsorganisation",
          "dataElement": {
            "name": "VKORG",
            "shortText": "Organizzazione commerciale",
            "domain": {
              "name": "VKORG",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Organizzazione commerciale"
            }
          }
        },
        {
          "position": 10,
          "fieldname": "VTWEG",
          "isKey": false,
          "shortText": "Canale distributivo",
          "germanName": "Vertriebsweg",
          "dataElement": {
            "name": "VTWEG",
            "shortText": "Canale distributivo",
            "domain": {
              "name": "VTWEG",
              "dataType": "CHAR",
              "length": 2,
              "decimals": 0,
              "shortText": "Canale distributivo"
            }
          }
        },
        {
          "position": 11,
          "fieldname": "SPART",
          "isKey": false,
          "shortText": "Settore merceologico (Division)",
          "germanName": "Sparte",
          "dataElement": {
            "name": "SPART",
            "shortText": "Settore merceologico aziendale",
            "domain": {
              "name": "SPART",
              "dataType": "CHAR",
              "length": 2,
              "decimals": 0,
              "shortText": "Settore"
            }
          }
        },
        {
          "position": 12,
          "fieldname": "KUNNR",
          "isKey": false,
          "shortText": "Committente (Sold-to party)",
          "germanName": "Kundennummer Auftraggeber",
          "dataElement": {
            "name": "KUNAG",
            "shortText": "Numero cliente che emette l ordine",
            "domain": {
              "name": "KUNNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero cliente"
            }
          }
        }
      ]
    },
    {
      "tableName": "VBAP",
      "module": "SD",
      "shortText": "Ordine di vendita: Dati di posizione",
      "germanEtymology": "Verkaufsbeleg: Auftragsposition",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Contiene i singoli articoli ordinati dal cliente, quantità ordinate e prezzi unitari.",
      "mainKey": [
        "MANDT",
        "VBELN",
        "POSNR"
      ],
      "relationships": [
        {
          "targetTable": "VBAK",
          "foreignKey": "VBELN",
          "description": "Testata dell ordine di vendita"
        },
        {
          "targetTable": "MARA",
          "foreignKey": "MATNR",
          "description": "Anagrafica articolo"
        },
        {
          "targetTable": "LIPS",
          "foreignKey": "VGBEL = VBELN AND VGPOS = POSNR",
          "description": "Posizione di consegna merce (DDT)"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "VBELN",
          "isKey": true,
          "shortText": "Numero ordine di vendita",
          "germanName": "Verkaufsbelegnummer",
          "dataElement": {
            "name": "VBELN_VA",
            "shortText": "Numero ordine",
            "domain": {
              "name": "VBELN",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento"
            }
          }
        },
        {
          "position": 3,
          "fieldname": "POSNR",
          "isKey": true,
          "shortText": "Numero posizione ordine",
          "germanName": "Positionsnummer",
          "dataElement": {
            "name": "POSNR_VA",
            "shortText": "Numero di riga (es. 000010)",
            "domain": {
              "name": "POSNR",
              "dataType": "NUMC",
              "length": 6,
              "decimals": 0,
              "shortText": "Numero posizione"
            }
          }
        },
        {
          "position": 4,
          "fieldname": "MATNR",
          "isKey": false,
          "shortText": "Codice Articolo / Materiale",
          "germanName": "Materialnummer",
          "dataElement": {
            "name": "MATNR",
            "shortText": "Numero articolo ordinato",
            "domain": {
              "name": "MATNR",
              "dataType": "CHAR",
              "length": 18,
              "decimals": 0,
              "shortText": "Numero materiale"
            }
          }
        },
        {
          "position": 5,
          "fieldname": "ARKTX",
          "isKey": false,
          "shortText": "Descrizione articolo",
          "germanName": "Artikeltext",
          "dataElement": {
            "name": "ARKTX",
            "shortText": "Descrizione testuale merce ordinata",
            "domain": {
              "name": "TEXT40",
              "dataType": "CHAR",
              "length": 40,
              "decimals": 0,
              "shortText": "Testo 40 caratteri"
            }
          }
        },
        {
          "position": 6,
          "fieldname": "KWMENG",
          "isKey": false,
          "shortText": "Quantità cumulativa ordinata",
          "germanName": "Kundenwunschmenge",
          "dataElement": {
            "name": "KWMENG",
            "shortText": "Quantità richiesta dal cliente",
            "domain": {
              "name": "MENGV13",
              "dataType": "QUAN",
              "length": 13,
              "decimals": 3,
              "shortText": "Quantità"
            }
          }
        },
        {
          "position": 7,
          "fieldname": "VRKME",
          "isKey": false,
          "shortText": "Unità di vendita",
          "germanName": "Verkaufseinheit",
          "dataElement": {
            "name": "VRKME",
            "shortText": "Unità di misura di vendita",
            "domain": {
              "name": "MEINS",
              "dataType": "UNIT",
              "length": 3,
              "decimals": 0,
              "shortText": "Unità di misura"
            }
          }
        },
        {
          "position": 8,
          "fieldname": "NETWR",
          "isKey": false,
          "shortText": "Valore netto posizione",
          "germanName": "Nettowert Position",
          "dataElement": {
            "name": "NETWR_AP",
            "shortText": "Prezzo totale netto della riga d ordine",
            "domain": {
              "name": "WERTV8",
              "dataType": "CURR",
              "length": 15,
              "decimals": 2,
              "shortText": "Importo valuta"
            }
          }
        },
        {
          "position": 9,
          "fieldname": "WERKS",
          "isKey": false,
          "shortText": "Stabilimento fornitore (Plant)",
          "germanName": "Lieferwerk",
          "dataElement": {
            "name": "WERKS_EXT",
            "shortText": "Stabilimento da cui verrà spedita la merce",
            "domain": {
              "name": "WERKS",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Divisione"
            }
          },
          "examples": [
            {
              "code": "1000",
              "desc": "Stabilimento Milano / Sede centrale"
            },
            {
              "code": "1010",
              "desc": "Stabilimento Produzione Torino"
            }
          ],
          "businessMeaning": "Unità organizzativa deputata alla produzione, immagazzinamento o spedizione merci."
        },
        {
          "position": 10,
          "fieldname": "LGORT",
          "isKey": false,
          "shortText": "Magazzino di prelievo",
          "germanName": "Lagerort",
          "dataElement": {
            "name": "LGORT_D",
            "shortText": "Ubicazione di magazzino",
            "domain": {
              "name": "LGORT",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Magazzino"
            }
          }
        }
      ]
    },
    {
      "tableName": "LIKP",
      "module": "SD",
      "shortText": "Consegna / Spedizione (DDT): Testata",
      "germanEtymology": "Lieferung: Kopf",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Testata del documento di consegna/spedizione fisica delle merci al cliente o tra stabilimenti.",
      "mainKey": [
        "MANDT",
        "VBELN"
      ],
      "relationships": [
        {
          "targetTable": "LIPS",
          "foreignKey": "VBELN",
          "description": "Righe della consegna"
        },
        {
          "targetTable": "KNA1",
          "foreignKey": "KUNNR",
          "description": "Destinatario delle merci (Ship-to party)"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "VBELN",
          "isKey": true,
          "shortText": "Numero documento di consegna",
          "germanName": "Lieferungsnummer",
          "dataElement": {
            "name": "VBELN_VL",
            "shortText": "Numero consegna / DDT",
            "domain": {
              "name": "VBELN",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento"
            }
          }
        },
        {
          "position": 3,
          "fieldname": "ERDAT",
          "isKey": false,
          "shortText": "Data di creazione consegna",
          "germanName": "Erfassungsdatum",
          "dataElement": {
            "name": "ERDAT",
            "shortText": "Data creazione",
            "domain": {
              "name": "DATUM",
              "dataType": "DATS",
              "length": 8,
              "decimals": 0,
              "shortText": "Data"
            }
          }
        },
        {
          "position": 4,
          "fieldname": "VSTEL",
          "isKey": false,
          "shortText": "Punto di spedizione (Shipping Point)",
          "germanName": "Versandstelle",
          "dataElement": {
            "name": "VSTEL",
            "shortText": "Punto di spedizione merce",
            "domain": {
              "name": "VSTEL",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Punto di spedizione"
            }
          }
        },
        {
          "position": 5,
          "fieldname": "LFART",
          "isKey": false,
          "shortText": "Tipo di consegna",
          "germanName": "Lieferart",
          "dataElement": {
            "name": "LFART",
            "shortText": "Tipo consegna (es. LF=Standard, NL=Replenishment)",
            "domain": {
              "name": "LFART",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Tipo consegna"
            }
          }
        },
        {
          "position": 6,
          "fieldname": "WADAT_IST",
          "isKey": false,
          "shortText": "Data effettiva uscita merci (PGI)",
          "germanName": "Warenausgangsdatum Ist",
          "dataElement": {
            "name": "WADAT_IST",
            "shortText": "Data in cui la merce ha lasciato fisicamente il magazzino",
            "domain": {
              "name": "DATUM",
              "dataType": "DATS",
              "length": 8,
              "decimals": 0,
              "shortText": "Data"
            }
          }
        },
        {
          "position": 7,
          "fieldname": "KUNNR",
          "isKey": false,
          "shortText": "Destinatario merci (Ship-to)",
          "germanName": "Warenempfänger",
          "dataElement": {
            "name": "KUNWE",
            "shortText": "Cliente destinatario della consegna fisica",
            "domain": {
              "name": "KUNNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero cliente"
            }
          }
        }
      ]
    },
    {
      "tableName": "LIPS",
      "module": "SD",
      "shortText": "Consegna / Spedizione (DDT): Posizione",
      "germanEtymology": "Lieferung: Position",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Dettaglio degli articoli e quantità spedite con il documento di consegna.",
      "mainKey": [
        "MANDT",
        "VBELN",
        "POSNR"
      ],
      "relationships": [
        {
          "targetTable": "LIKP",
          "foreignKey": "VBELN",
          "description": "Testata della consegna"
        },
        {
          "targetTable": "MARA",
          "foreignKey": "MATNR",
          "description": "Anagrafica articolo spedito"
        },
        {
          "targetTable": "VBAP",
          "foreignKey": "VGBEL = VBELN AND VGPOS = POSNR",
          "description": "Riga ordine di vendita di origine"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "VBELN",
          "isKey": true,
          "shortText": "Numero documento consegna",
          "germanName": "Lieferungsnummer",
          "dataElement": {
            "name": "VBELN_VL",
            "shortText": "Numero consegna",
            "domain": {
              "name": "VBELN",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento"
            }
          }
        },
        {
          "position": 3,
          "fieldname": "POSNR",
          "isKey": true,
          "shortText": "Posizione di consegna",
          "germanName": "Positionsnummer",
          "dataElement": {
            "name": "POSNR_VL",
            "shortText": "Posizione riga consegna",
            "domain": {
              "name": "POSNR",
              "dataType": "NUMC",
              "length": 6,
              "decimals": 0,
              "shortText": "Numero posizione"
            }
          }
        },
        {
          "position": 4,
          "fieldname": "MATNR",
          "isKey": false,
          "shortText": "Codice Articolo spedito",
          "germanName": "Materialnummer",
          "dataElement": {
            "name": "MATNR",
            "shortText": "Codice articolo",
            "domain": {
              "name": "MATNR",
              "dataType": "CHAR",
              "length": 18,
              "decimals": 0,
              "shortText": "Numero materiale"
            }
          }
        },
        {
          "position": 5,
          "fieldname": "LFIMG",
          "isKey": false,
          "shortText": "Quantità effettiva consegnata",
          "germanName": "Liefermenge",
          "dataElement": {
            "name": "LFIMG",
            "shortText": "Quantità consegnata in bolla",
            "domain": {
              "name": "MENGV13",
              "dataType": "QUAN",
              "length": 13,
              "decimals": 3,
              "shortText": "Quantità"
            }
          }
        },
        {
          "position": 6,
          "fieldname": "MEINS",
          "isKey": false,
          "shortText": "Unità di misura di base",
          "germanName": "Basismengeneinheit",
          "dataElement": {
            "name": "MEINS",
            "shortText": "Unità di misura",
            "domain": {
              "name": "MEINS",
              "dataType": "UNIT",
              "length": 3,
              "decimals": 0,
              "shortText": "Unità di misura"
            }
          }
        },
        {
          "position": 7,
          "fieldname": "WERKS",
          "isKey": false,
          "shortText": "Stabilimento di prelievo",
          "germanName": "Werk",
          "dataElement": {
            "name": "WERKS_D",
            "shortText": "Stabilimento",
            "domain": {
              "name": "WERKS",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Divisione"
            }
          },
          "examples": [
            {
              "code": "1000",
              "desc": "Stabilimento Milano / Sede centrale"
            },
            {
              "code": "1010",
              "desc": "Stabilimento Produzione Torino"
            }
          ],
          "businessMeaning": "Unità organizzativa deputata alla produzione, immagazzinamento o spedizione merci."
        },
        {
          "position": 8,
          "fieldname": "LGORT",
          "isKey": false,
          "shortText": "Magazzino di prelievo merce",
          "germanName": "Lagerort",
          "dataElement": {
            "name": "LGORT_D",
            "shortText": "Ubicazione magazzino",
            "domain": {
              "name": "LGORT",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Magazzino"
            }
          }
        }
      ]
    },
    {
      "tableName": "MARA",
      "module": "MM",
      "shortText": "Anagrafica Articoli: Dati generali",
      "germanEtymology": "Materialstamm: Allgemein",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Dati generali validi per tutta l azienda per ogni articolo / materiale (peso, unità di misura, tipo merce, gruppo merceologico).",
      "mainKey": [
        "MANDT",
        "MATNR"
      ],
      "relationships": [
        {
          "targetTable": "MARC",
          "foreignKey": "MATNR",
          "description": "Dati di stabilimento (MRP, scorte) per lo stesso articolo"
        },
        {
          "targetTable": "MARD",
          "foreignKey": "MATNR",
          "description": "Giacenze e scorte per ubicazione/magazzino"
        },
        {
          "targetTable": "MAKT",
          "foreignKey": "MATNR",
          "description": "Descrizioni e testi articolo in varie lingue"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "MATNR",
          "isKey": true,
          "shortText": "Codice Articolo / Materiale",
          "germanName": "Materialnummer",
          "dataElement": {
            "name": "MATNR",
            "shortText": "Codice identificativo univoco dell articolo",
            "domain": {
              "name": "MATNR",
              "dataType": "CHAR",
              "length": 18,
              "decimals": 0,
              "shortText": "Numero materiale"
            }
          }
        },
        {
          "position": 3,
          "fieldname": "ERSDA",
          "isKey": false,
          "shortText": "Data di creazione anagrafica",
          "germanName": "Erstellungsdatum",
          "dataElement": {
            "name": "ERSDA",
            "shortText": "Data prima creazione anagrafica",
            "domain": {
              "name": "DATUM",
              "dataType": "DATS",
              "length": 8,
              "decimals": 0,
              "shortText": "Data"
            }
          }
        },
        {
          "position": 4,
          "fieldname": "ERNAM",
          "isKey": false,
          "shortText": "Nome utente creatore",
          "germanName": "Erfassername",
          "dataElement": {
            "name": "ERNAM",
            "shortText": "Autore creazione record",
            "domain": {
              "name": "USNAM",
              "dataType": "CHAR",
              "length": 12,
              "decimals": 0,
              "shortText": "Nome utente"
            }
          }
        },
        {
          "position": 5,
          "fieldname": "MTART",
          "isKey": false,
          "shortText": "Tipo di materiale / articolo",
          "germanName": "Materialart",
          "dataElement": {
            "name": "MTART",
            "shortText": "Tipo articolo (FERT=Finito, ROH=Materia prima, HALB=Semilavorato)",
            "domain": {
              "name": "MTART",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Tipo materiale"
            }
          },
          "examples": [
            {
              "code": "FERT",
              "desc": "Prodotto Finito (Fertigerzeugnis): prodotto internamente e pronto per la vendita"
            },
            {
              "code": "ROH",
              "desc": "Materia Prima (Rohstoff): acquistata dall'esterno per essere lavorata in produzione"
            },
            {
              "code": "HALB",
              "desc": "Semilavorato (Halbfabrikat): componente intermedio del ciclo produttivo"
            },
            {
              "code": "HAWA",
              "desc": "Merce per commercio (Handelsware): acquistata e rivenduta senza alcuna lavorazione"
            },
            {
              "code": "DIEN",
              "desc": "Servizio / Prestazione (Dienstleistung): bene immateriale (consulenza, manodopera)"
            },
            {
              "code": "VERP",
              "desc": "Materiale di imballaggio (Verpackung)"
            }
          ],
          "businessMeaning": "Definisce se l'articolo è soggetto a gestione stock, acquisti, vendite o contabilità industriale."
        },
        {
          "position": 6,
          "fieldname": "MBRSH",
          "isKey": false,
          "shortText": "Settore industriale",
          "germanName": "Branchenschlüssel",
          "dataElement": {
            "name": "MBRSH",
            "shortText": "Settore industriale (es. Meccanica, Chimica)",
            "domain": {
              "name": "MBRSH",
              "dataType": "CHAR",
              "length": 1,
              "decimals": 0,
              "shortText": "Settore"
            }
          }
        },
        {
          "position": 7,
          "fieldname": "MATKL",
          "isKey": false,
          "shortText": "Gruppo merci (Commodity Group)",
          "germanName": "Materialgruppe",
          "dataElement": {
            "name": "MATKL",
            "shortText": "Gruppo merci per raggruppare articoli simili",
            "domain": {
              "name": "MATKL",
              "dataType": "CHAR",
              "length": 9,
              "decimals": 0,
              "shortText": "Gruppo merci"
            }
          }
        },
        {
          "position": 8,
          "fieldname": "MEINS",
          "isKey": false,
          "shortText": "Unità di misura di base",
          "germanName": "Basismengeneinheit",
          "dataElement": {
            "name": "MEINS",
            "shortText": "Unità di misura per gestione scorte",
            "domain": {
              "name": "MEINS",
              "dataType": "UNIT",
              "length": 3,
              "decimals": 0,
              "shortText": "Unità di misura"
            }
          }
        },
        {
          "position": 9,
          "fieldname": "BRGEW",
          "isKey": false,
          "shortText": "Peso lordo",
          "germanName": "Bruttogewicht",
          "dataElement": {
            "name": "BRGEW",
            "shortText": "Peso lordo articolo",
            "domain": {
              "name": "MENG13",
              "dataType": "QUAN",
              "length": 13,
              "decimals": 3,
              "shortText": "Quantità"
            }
          }
        },
        {
          "position": 10,
          "fieldname": "NTGEW",
          "isKey": false,
          "shortText": "Peso netto",
          "germanName": "Nettogewicht",
          "dataElement": {
            "name": "NTGEW",
            "shortText": "Peso netto articolo",
            "domain": {
              "name": "MENG13",
              "dataType": "QUAN",
              "length": 13,
              "decimals": 3,
              "shortText": "Quantità"
            }
          }
        },
        {
          "position": 11,
          "fieldname": "GEWEI",
          "isKey": false,
          "shortText": "Unità di peso",
          "germanName": "Gewichtseinheit",
          "dataElement": {
            "name": "GEWEI",
            "shortText": "Unità di peso (KG, G, T)",
            "domain": {
              "name": "MEINS",
              "dataType": "UNIT",
              "length": 3,
              "decimals": 0,
              "shortText": "Unità di misura"
            }
          }
        }
      ]
    },
    {
      "tableName": "MARC",
      "module": "MM",
      "shortText": "Anagrafica Articoli: Dati di Stabilimento",
      "germanEtymology": "Materialstamm: Werk",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Parametri di pianificazione della produzione, MRP, approvvigionamento e controllo qualità per stabilimento.",
      "mainKey": [
        "MANDT",
        "MATNR",
        "WERKS"
      ],
      "relationships": [
        {
          "targetTable": "MARA",
          "foreignKey": "MATNR",
          "description": "Dati generali dell articolo"
        },
        {
          "targetTable": "MARD",
          "foreignKey": "MATNR AND WERKS",
          "description": "Ubicazioni e magazzini nello stabilimento"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "MATNR",
          "isKey": true,
          "shortText": "Codice Articolo",
          "germanName": "Materialnummer",
          "dataElement": {
            "name": "MATNR",
            "shortText": "Numero articolo",
            "domain": {
              "name": "MATNR",
              "dataType": "CHAR",
              "length": 18,
              "decimals": 0,
              "shortText": "Numero materiale"
            }
          }
        },
        {
          "position": 3,
          "fieldname": "WERKS",
          "isKey": true,
          "shortText": "Divisione / Stabilimento",
          "germanName": "Werk",
          "dataElement": {
            "name": "WERKS_D",
            "shortText": "Codice stabilimento",
            "domain": {
              "name": "WERKS",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Divisione"
            }
          },
          "examples": [
            {
              "code": "1000",
              "desc": "Stabilimento Milano / Sede centrale"
            },
            {
              "code": "1010",
              "desc": "Stabilimento Produzione Torino"
            }
          ],
          "businessMeaning": "Unità organizzativa deputata alla produzione, immagazzinamento o spedizione merci."
        },
        {
          "position": 4,
          "fieldname": "DISMM",
          "isKey": false,
          "shortText": "Caratteristica di pianificazione MRP",
          "germanName": "Dispositionsmerkmal",
          "dataElement": {
            "name": "DISMM",
            "shortText": "Metodo di pianificazione MRP (PD=Deterministico, VB=Punto di riordino)",
            "domain": {
              "name": "DISMM",
              "dataType": "CHAR",
              "length": 2,
              "decimals": 0,
              "shortText": "Metodo MRP"
            }
          },
          "examples": [
            {
              "code": "PD",
              "desc": "MRP deterministico standard (calcola fabbisogni su base ordini e previsioni)"
            },
            {
              "code": "VB",
              "desc": "Pianificazione manuale a punto di riordino (riordina quando scorta < soglia)"
            },
            {
              "code": "VM",
              "desc": "Pianificazione automatica a punto di riordino (calcolata con trend statistico)"
            },
            {
              "code": "ND",
              "desc": "Nessuna pianificazione MRP (gestione a vista o non riordinabile)"
            }
          ],
          "businessMeaning": "Determina l'algoritmo con cui il sistema SAP calcola quando e quanto acquistare o produrre."
        },
        {
          "position": 5,
          "fieldname": "DISPO",
          "isKey": false,
          "shortText": "Pianificatore MRP",
          "germanName": "Disponent",
          "dataElement": {
            "name": "DISPO",
            "shortText": "Gruppo/Responsabile della pianificazione materiale",
            "domain": {
              "name": "DISPO",
              "dataType": "CHAR",
              "length": 3,
              "decimals": 0,
              "shortText": "Pianificatore MRP"
            }
          }
        },
        {
          "position": 6,
          "fieldname": "PLIFZ",
          "isKey": false,
          "shortText": "Tempo di approvvigionamento pianificato (gg)",
          "germanName": "Planlieferzeit",
          "dataElement": {
            "name": "PLIFZ",
            "shortText": "Giorni necessari per ricevere la merce dal fornitore",
            "domain": {
              "name": "DEC3",
              "dataType": "DEC",
              "length": 3,
              "decimals": 0,
              "shortText": "Giorni"
            }
          }
        },
        {
          "position": 7,
          "fieldname": "WEBAZ",
          "isKey": false,
          "shortText": "Tempo lavorazione entrata merci (gg)",
          "germanName": "Wareneingangsbearbeitungszeit",
          "dataElement": {
            "name": "WEBAZ",
            "shortText": "Giorni necessari per il controllo qualità e stoccaggio",
            "domain": {
              "name": "DEC3",
              "dataType": "DEC",
              "length": 3,
              "decimals": 0,
              "shortText": "Giorni"
            }
          }
        }
      ]
    },
    {
      "tableName": "MARD",
      "module": "MM",
      "shortText": "Anagrafica Articoli: Giacenze di Magazzino",
      "germanEtymology": "Materialstamm: Lagerortdaten",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Scorte fisiche e giacenze contabili dell articolo per stabilimento e singola ubicazione di magazzino.",
      "mainKey": [
        "MANDT",
        "MATNR",
        "WERKS",
        "LGORT"
      ],
      "relationships": [
        {
          "targetTable": "MARC",
          "foreignKey": "MATNR AND WERKS",
          "description": "Dati stabilimento"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "MATNR",
          "isKey": true,
          "shortText": "Codice Articolo",
          "germanName": "Materialnummer",
          "dataElement": {
            "name": "MATNR",
            "shortText": "Codice articolo",
            "domain": {
              "name": "MATNR",
              "dataType": "CHAR",
              "length": 18,
              "decimals": 0,
              "shortText": "Numero materiale"
            }
          }
        },
        {
          "position": 3,
          "fieldname": "WERKS",
          "isKey": true,
          "shortText": "Stabilimento",
          "germanName": "Werk",
          "dataElement": {
            "name": "WERKS_D",
            "shortText": "Stabilimento",
            "domain": {
              "name": "WERKS",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Divisione"
            }
          },
          "examples": [
            {
              "code": "1000",
              "desc": "Stabilimento Milano / Sede centrale"
            },
            {
              "code": "1010",
              "desc": "Stabilimento Produzione Torino"
            }
          ],
          "businessMeaning": "Unità organizzativa deputata alla produzione, immagazzinamento o spedizione merci."
        },
        {
          "position": 4,
          "fieldname": "LGORT",
          "isKey": true,
          "shortText": "Magazzino (Storage Location)",
          "germanName": "Lagerort",
          "dataElement": {
            "name": "LGORT_D",
            "shortText": "Codice magazzino",
            "domain": {
              "name": "LGORT",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Magazzino"
            }
          }
        },
        {
          "position": 5,
          "fieldname": "LABST",
          "isKey": false,
          "shortText": "Scorta a libera utilizzazione",
          "germanName": "Lagerbestand frei verwendbar",
          "dataElement": {
            "name": "LABST",
            "shortText": "Giacenza fisica disponibile per vendita o produzione",
            "domain": {
              "name": "MENGV13",
              "dataType": "QUAN",
              "length": 13,
              "decimals": 3,
              "shortText": "Quantità"
            }
          }
        },
        {
          "position": 6,
          "fieldname": "INSME",
          "isKey": false,
          "shortText": "Scorta in controllo qualità",
          "germanName": "Qualitätsprüfbestand",
          "dataElement": {
            "name": "INSME",
            "shortText": "Merce bloccata in attesa di collaudo",
            "domain": {
              "name": "MENGV13",
              "dataType": "QUAN",
              "length": 13,
              "decimals": 3,
              "shortText": "Quantità"
            }
          }
        },
        {
          "position": 7,
          "fieldname": "SPEME",
          "isKey": false,
          "shortText": "Scorta bloccata",
          "germanName": "Gesperrter Bestand",
          "dataElement": {
            "name": "SPEME",
            "shortText": "Merce non utilizzabile (scaduta o difettosa)",
            "domain": {
              "name": "MENGV13",
              "dataType": "QUAN",
              "length": 13,
              "decimals": 3,
              "shortText": "Quantità"
            }
          }
        }
      ]
    },
    {
      "tableName": "EKKO",
      "module": "MM",
      "shortText": "Documento d Acquisto: Dati di testata",
      "germanEtymology": "Einkaufsbeleg: Kopf",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Testata di ordini d acquisto (ODA), contratti quadro e richieste di offerta verso fornitori.",
      "mainKey": [
        "MANDT",
        "EBELN"
      ],
      "relationships": [
        {
          "targetTable": "EKPO",
          "foreignKey": "EBELN",
          "description": "Posizioni / righe merci ordinate al fornitore"
        },
        {
          "targetTable": "LFA1",
          "foreignKey": "LIFNR",
          "description": "Anagrafica fornitore"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "EBELN",
          "isKey": true,
          "shortText": "Numero documento d acquisto (ODA)",
          "germanName": "Einkaufsbelegnummer",
          "dataElement": {
            "name": "EBELN",
            "shortText": "Numero ordine d acquisto",
            "domain": {
              "name": "EBELN",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento d acquisto"
            }
          }
        },
        {
          "position": 3,
          "fieldname": "BUKRS",
          "isKey": false,
          "shortText": "Società acquirente (Company Code)",
          "germanName": "Buchungskreis",
          "dataElement": {
            "name": "BUKRS",
            "shortText": "Società giuridica responsabile dell acquisto",
            "domain": {
              "name": "BUKRS",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Società"
            }
          },
          "examples": [
            {
              "code": "1000",
              "desc": "Società Italia S.p.A."
            },
            {
              "code": "2000",
              "desc": "Società Germania GmbH"
            }
          ],
          "businessMeaning": "Soggetto giuridico indipendente che redige il proprio bilancio d'esercizio."
        },
        {
          "position": 4,
          "fieldname": "BSTYP",
          "isKey": false,
          "shortText": "Categoria documento d acquisto",
          "germanName": "Beschaffungsbelegtyp",
          "dataElement": {
            "name": "EBSTYP",
            "shortText": "Categoria (F=Ordine d acquisto, K=Contratto)",
            "domain": {
              "name": "EBSTYP",
              "dataType": "CHAR",
              "length": 1,
              "decimals": 0,
              "shortText": "Categoria ODA"
            }
          },
          "examples": [
            {
              "code": "F",
              "desc": "Ordine d'acquisto effettivo (Purchase Order / ODA)"
            },
            {
              "code": "K",
              "desc": "Contratto quadro a valore o quantità (Contract)"
            },
            {
              "code": "L",
              "desc": "Piano di consegne programmato (Scheduling Agreement)"
            },
            {
              "code": "A",
              "desc": "Richiesta di offerta fornitore (Request for Quotation / RFQ)"
            }
          ],
          "businessMeaning": "Distingue un ordine esecutivo immediato da un accordo a lungo termine o preventivo."
        },
        {
          "position": 5,
          "fieldname": "BSART",
          "isKey": false,
          "shortText": "Tipo documento d acquisto",
          "germanName": "Bestellart",
          "dataElement": {
            "name": "ESART",
            "shortText": "Tipo ordine fornitore (es. NB=Standard, UB=Trasferimento)",
            "domain": {
              "name": "ESART",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Tipo documento acquisti"
            }
          },
          "examples": [
            {
              "code": "NB",
              "desc": "Ordine d'acquisto standard verso fornitore terzo"
            },
            {
              "code": "UB",
              "desc": "Ordine di trasferimento stock tra stabilimenti aziendali"
            },
            {
              "code": "FO",
              "desc": "Ordine quadro per prestazioni di servizi ripetitive"
            }
          ],
          "businessMeaning": "Determina il tipo documento, il range numerico e le regole di approvazione/workflow."
        },
        {
          "position": 6,
          "fieldname": "AEDAT",
          "isKey": false,
          "shortText": "Data di creazione documento",
          "germanName": "Änderungsdatum / Erstellungsdatum",
          "dataElement": {
            "name": "ERDAT",
            "shortText": "Data registrazione",
            "domain": {
              "name": "DATUM",
              "dataType": "DATS",
              "length": 8,
              "decimals": 0,
              "shortText": "Data"
            }
          }
        },
        {
          "position": 7,
          "fieldname": "LIFNR",
          "isKey": false,
          "shortText": "Codice Fornitore (Vendor)",
          "germanName": "Lieferantennummer",
          "dataElement": {
            "name": "ELIFN",
            "shortText": "Codice fornitore fornitore dell ordine",
            "domain": {
              "name": "LIFNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero fornitore"
            }
          }
        },
        {
          "position": 8,
          "fieldname": "EKORG",
          "isKey": false,
          "shortText": "Organizzazione acquisti",
          "germanName": "Einkaufsorganisation",
          "dataElement": {
            "name": "EKORG",
            "shortText": "Ente responsabile della negoziazione",
            "domain": {
              "name": "EKORG",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Organizzazione acquisti"
            }
          }
        },
        {
          "position": 9,
          "fieldname": "EKGRP",
          "isKey": false,
          "shortText": "Gruppo acquisti (Buyer)",
          "germanName": "Einkäufergruppe",
          "dataElement": {
            "name": "BKGRP",
            "shortText": "Buyer operativo / Gruppo acquisti",
            "domain": {
              "name": "BKGRP",
              "dataType": "CHAR",
              "length": 3,
              "decimals": 0,
              "shortText": "Gruppo acquisti"
            }
          }
        },
        {
          "position": 10,
          "fieldname": "WAERS",
          "isKey": false,
          "shortText": "Divisa ordine acquisto",
          "germanName": "Währung",
          "dataElement": {
            "name": "WAERS",
            "shortText": "Divisa della fornitura",
            "domain": {
              "name": "WAERS",
              "dataType": "CUKY",
              "length": 5,
              "decimals": 0,
              "shortText": "Codice divisa"
            }
          }
        }
      ]
    },
    {
      "tableName": "EKPO",
      "module": "MM",
      "shortText": "Documento d Acquisto: Dati di posizione",
      "germanEtymology": "Einkaufsbeleg: Position",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Posizioni dell ordine d acquisto con articoli ordinati al fornitore, quantità, prezzi e date di consegna.",
      "mainKey": [
        "MANDT",
        "EBELN",
        "EBELP"
      ],
      "relationships": [
        {
          "targetTable": "EKKO",
          "foreignKey": "EBELN",
          "description": "Testata dell ordine fornitore"
        },
        {
          "targetTable": "MARA",
          "foreignKey": "MATNR",
          "description": "Anagrafica articolo acquistato"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "EBELN",
          "isKey": true,
          "shortText": "Numero documento d acquisto",
          "germanName": "Einkaufsbelegnummer",
          "dataElement": {
            "name": "EBELN",
            "shortText": "Numero ordine",
            "domain": {
              "name": "EBELN",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento d acquisto"
            }
          }
        },
        {
          "position": 3,
          "fieldname": "EBELP",
          "isKey": true,
          "shortText": "Numero posizione d acquisto",
          "germanName": "Einkaufsbelegpositionsnummer",
          "dataElement": {
            "name": "EBELP",
            "shortText": "Numero riga ordine d acquisto (es. 00010)",
            "domain": {
              "name": "EBELP",
              "dataType": "NUMC",
              "length": 5,
              "decimals": 0,
              "shortText": "Numero posizione ODA"
            }
          }
        },
        {
          "position": 4,
          "fieldname": "TXZ01",
          "isKey": false,
          "shortText": "Testo breve della riga",
          "germanName": "Kurztext Position",
          "dataElement": {
            "name": "TXZ01",
            "shortText": "Descrizione del bene o servizio ordinato",
            "domain": {
              "name": "TEXT40",
              "dataType": "CHAR",
              "length": 40,
              "decimals": 0,
              "shortText": "Testo 40 caratteri"
            }
          }
        },
        {
          "position": 5,
          "fieldname": "MATNR",
          "isKey": false,
          "shortText": "Codice Articolo",
          "germanName": "Materialnummer",
          "dataElement": {
            "name": "MATNR",
            "shortText": "Codice materiale",
            "domain": {
              "name": "MATNR",
              "dataType": "CHAR",
              "length": 18,
              "decimals": 0,
              "shortText": "Numero materiale"
            }
          }
        },
        {
          "position": 6,
          "fieldname": "WERKS",
          "isKey": false,
          "shortText": "Stabilimento ricevente",
          "germanName": "Werk",
          "dataElement": {
            "name": "EWERK",
            "shortText": "Stabilimento a cui consegnare la merce",
            "domain": {
              "name": "WERKS",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Divisione"
            }
          },
          "examples": [
            {
              "code": "1000",
              "desc": "Stabilimento Milano / Sede centrale"
            },
            {
              "code": "1010",
              "desc": "Stabilimento Produzione Torino"
            }
          ],
          "businessMeaning": "Unità organizzativa deputata alla produzione, immagazzinamento o spedizione merci."
        },
        {
          "position": 7,
          "fieldname": "MENGE",
          "isKey": false,
          "shortText": "Quantità ordinata",
          "germanName": "Bestellmenge",
          "dataElement": {
            "name": "BSTMG",
            "shortText": "Quantità ordinata al fornitore",
            "domain": {
              "name": "MENG13",
              "dataType": "QUAN",
              "length": 13,
              "decimals": 3,
              "shortText": "Quantità"
            }
          }
        },
        {
          "position": 8,
          "fieldname": "MEINS",
          "isKey": false,
          "shortText": "Unità di misura acquisti",
          "germanName": "Bestellmengeneinheit",
          "dataElement": {
            "name": "BSTME",
            "shortText": "Unità di misura ordine acquisti",
            "domain": {
              "name": "MEINS",
              "dataType": "UNIT",
              "length": 3,
              "decimals": 0,
              "shortText": "Unità di misura"
            }
          }
        },
        {
          "position": 9,
          "fieldname": "NETPR",
          "isKey": false,
          "shortText": "Prezzo netto unitario",
          "germanName": "Nettopreis",
          "dataElement": {
            "name": "BPREI",
            "shortText": "Prezzo netto unitario per quantità base",
            "domain": {
              "name": "WERTV6",
              "dataType": "CURR",
              "length": 11,
              "decimals": 2,
              "shortText": "Prezzo netto"
            }
          }
        },
        {
          "position": 10,
          "fieldname": "NETWR",
          "isKey": false,
          "shortText": "Valore netto totale riga",
          "germanName": "Nettowert Position",
          "dataElement": {
            "name": "BWERT",
            "shortText": "Totale netto della posizione ODA",
            "domain": {
              "name": "WERTV8",
              "dataType": "CURR",
              "length": 15,
              "decimals": 2,
              "shortText": "Importo valuta"
            }
          }
        }
      ]
    },
    {
      "tableName": "BKPF",
      "module": "FI",
      "shortText": "Documento Contabile: Dati di testata",
      "germanEtymology": "Buchhaltung: Belegkopf",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Testata delle registrazioni contabili di prima nota, fatture fornitori/clienti registrate in contabilità generale.",
      "mainKey": [
        "MANDT",
        "BUKRS",
        "BELNR",
        "GJAHR"
      ],
      "relationships": [
        {
          "targetTable": "BSEG",
          "foreignKey": "BUKRS AND BELNR AND GJAHR",
          "description": "Posizioni contabili in dare/avere del documento"
        },
        {
          "targetTable": "VBRK",
          "foreignKey": "BELNR = VBELN",
          "description": "Fattura SD origine (se generata da vendita)"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "BUKRS",
          "isKey": true,
          "shortText": "Società (Company Code)",
          "germanName": "Buchungskreis",
          "dataElement": {
            "name": "BUKRS",
            "shortText": "Codice società contabile (es. 1000)",
            "domain": {
              "name": "BUKRS",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Società"
            }
          },
          "examples": [
            {
              "code": "1000",
              "desc": "Società Italia S.p.A."
            },
            {
              "code": "2000",
              "desc": "Società Germania GmbH"
            }
          ],
          "businessMeaning": "Soggetto giuridico indipendente che redige il proprio bilancio d'esercizio."
        },
        {
          "position": 3,
          "fieldname": "BELNR",
          "isKey": true,
          "shortText": "Numero documento contabile",
          "germanName": "Belegnummer",
          "dataElement": {
            "name": "BELNR_D",
            "shortText": "Numero registrazione contabile",
            "domain": {
              "name": "BELNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento contabile"
            }
          }
        },
        {
          "position": 4,
          "fieldname": "GJAHR",
          "isKey": true,
          "shortText": "Esercizio contabile (Fiscal Year)",
          "germanName": "Geschäftsjahr",
          "dataElement": {
            "name": "GJAHR",
            "shortText": "Anno fiscale (es. 2026)",
            "domain": {
              "name": "GJAHR",
              "dataType": "NUMC",
              "length": 4,
              "decimals": 0,
              "shortText": "Esercizio"
            }
          }
        },
        {
          "position": 5,
          "fieldname": "BLART",
          "isKey": false,
          "shortText": "Tipo di documento contabile",
          "germanName": "Belegart",
          "dataElement": {
            "name": "BLART",
            "shortText": "Tipo registrazione (DR=Fattura cliente, KR=Fattura fornitore, SA=Generale)",
            "domain": {
              "name": "BLART",
              "dataType": "CHAR",
              "length": 2,
              "decimals": 0,
              "shortText": "Tipo documento"
            }
          },
          "examples": [
            {
              "code": "DR",
              "desc": "Fattura Cliente (Debitor Rechnung): generata in automatico da SD o registrata in FI"
            },
            {
              "code": "DZ",
              "desc": "Incasso / Pagamento Cliente (Debitor Zahlung)"
            },
            {
              "code": "DG",
              "desc": "Nota di accredito a Cliente"
            },
            {
              "code": "KR",
              "desc": "Fattura Fornitore (Kreditor Rechnung)"
            },
            {
              "code": "KZ",
              "desc": "Pagamento Fornitore (Kreditor Zahlung)"
            },
            {
              "code": "SA",
              "desc": "Prima nota di Contabilità Generale (Sachkonto Beleg)"
            },
            {
              "code": "AB",
              "desc": "Compensazione contabile generale (Ausgleichsbeleg)"
            }
          ],
          "businessMeaning": "Classifica la registrazione contabile a fini civilistici, fiscali e per il range di numerazione."
        },
        {
          "position": 6,
          "fieldname": "BLDAT",
          "isKey": false,
          "shortText": "Data documento contabile",
          "germanName": "Belegdatum",
          "dataElement": {
            "name": "BLDAT",
            "shortText": "Data di emissione del documento originario",
            "domain": {
              "name": "DATUM",
              "dataType": "DATS",
              "length": 8,
              "decimals": 0,
              "shortText": "Data"
            }
          }
        },
        {
          "position": 7,
          "fieldname": "BUDAT",
          "isKey": false,
          "shortText": "Data di registrazione a libro giornale",
          "germanName": "Buchungsdatum",
          "dataElement": {
            "name": "BUDAT",
            "shortText": "Data ufficiale di registrazione a bilancio",
            "domain": {
              "name": "DATUM",
              "dataType": "DATS",
              "length": 8,
              "decimals": 0,
              "shortText": "Data"
            }
          }
        },
        {
          "position": 8,
          "fieldname": "MONAT",
          "isKey": false,
          "shortText": "Periodo contabile",
          "germanName": "Buchungsmonat",
          "dataElement": {
            "name": "MONAT",
            "shortText": "Mese / Periodo contabile (01-12 o periodi speciali)",
            "domain": {
              "name": "MONAT",
              "dataType": "NUMC",
              "length": 2,
              "decimals": 0,
              "shortText": "Mese"
            }
          }
        },
        {
          "position": 9,
          "fieldname": "WAERS",
          "isKey": false,
          "shortText": "Divisa del documento contabile",
          "germanName": "Währung",
          "dataElement": {
            "name": "WAERS",
            "shortText": "Codice divisa",
            "domain": {
              "name": "WAERS",
              "dataType": "CUKY",
              "length": 5,
              "decimals": 0,
              "shortText": "Codice divisa"
            }
          }
        },
        {
          "position": 10,
          "fieldname": "BKTXT",
          "isKey": false,
          "shortText": "Testo di testata documento",
          "germanName": "Belegkopftext",
          "dataElement": {
            "name": "BKTXT",
            "shortText": "Note e causale del documento contabile",
            "domain": {
              "name": "TEXT25",
              "dataType": "CHAR",
              "length": 25,
              "decimals": 0,
              "shortText": "Testo 25 caratteri"
            }
          }
        }
      ]
    },
    {
      "tableName": "BSEG",
      "module": "FI",
      "shortText": "Documento Contabile: Segmento di posizione",
      "germanEtymology": "Buchhaltung: Segment (Position)",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Singole righe contabili in Dare o Avere (conti Co.Ge., partitari clienti, fornitori, cespiti). In S/4HANA confluita in ACDOCA.",
      "mainKey": [
        "MANDT",
        "BUKRS",
        "BELNR",
        "GJAHR",
        "BUZEI"
      ],
      "relationships": [
        {
          "targetTable": "BKPF",
          "foreignKey": "BUKRS AND BELNR AND GJAHR",
          "description": "Testata del documento contabile"
        },
        {
          "targetTable": "KNA1",
          "foreignKey": "KUNNR",
          "description": "Cliente collegato alla riga (se conto cliente)"
        },
        {
          "targetTable": "LFA1",
          "foreignKey": "LIFNR",
          "description": "Fornitore collegato alla riga (se conto fornitore)"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "BUKRS",
          "isKey": true,
          "shortText": "Società",
          "germanName": "Buchungskreis",
          "dataElement": {
            "name": "BUKRS",
            "shortText": "Codice società",
            "domain": {
              "name": "BUKRS",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Società"
            }
          },
          "examples": [
            {
              "code": "1000",
              "desc": "Società Italia S.p.A."
            },
            {
              "code": "2000",
              "desc": "Società Germania GmbH"
            }
          ],
          "businessMeaning": "Soggetto giuridico indipendente che redige il proprio bilancio d'esercizio."
        },
        {
          "position": 3,
          "fieldname": "BELNR",
          "isKey": true,
          "shortText": "Numero documento contabile",
          "germanName": "Belegnummer",
          "dataElement": {
            "name": "BELNR_D",
            "shortText": "Numero documento",
            "domain": {
              "name": "BELNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento contabile"
            }
          }
        },
        {
          "position": 4,
          "fieldname": "GJAHR",
          "isKey": true,
          "shortText": "Esercizio contabile",
          "germanName": "Geschäftsjahr",
          "dataElement": {
            "name": "GJAHR",
            "shortText": "Esercizio",
            "domain": {
              "name": "GJAHR",
              "dataType": "NUMC",
              "length": 4,
              "decimals": 0,
              "shortText": "Esercizio"
            }
          }
        },
        {
          "position": 5,
          "fieldname": "BUZEI",
          "isKey": true,
          "shortText": "Numero riga contabile",
          "germanName": "Buchungszeile",
          "dataElement": {
            "name": "BUZEI",
            "shortText": "Numero riga (001, 002, ecc.)",
            "domain": {
              "name": "BUZEI",
              "dataType": "NUMC",
              "length": 3,
              "decimals": 0,
              "shortText": "Riga contabile"
            }
          }
        },
        {
          "position": 6,
          "fieldname": "BSCHL",
          "isKey": false,
          "shortText": "Chiave di contabilizzazione (Posting Key)",
          "germanName": "Buchungsschlüssel",
          "dataElement": {
            "name": "BSCHL",
            "shortText": "Chiave Dare/Avere (es. 40=Dare CoGe, 50=Avere CoGe, 01=Fattura cliente)",
            "domain": {
              "name": "BSCHL",
              "dataType": "CHAR",
              "length": 2,
              "decimals": 0,
              "shortText": "Chiave registrazione"
            }
          },
          "examples": [
            {
              "code": "01",
              "desc": "Fattura Cliente (Dare partita aperta, aumenta il credito)"
            },
            {
              "code": "11",
              "desc": "Nota di credito Cliente (Avere partita aperta, riduce il credito)"
            },
            {
              "code": "15",
              "desc": "Incasso da Cliente (Avere, chiude la partita aperta)"
            },
            {
              "code": "31",
              "desc": "Fattura Fornitore (Avere partita aperta, aumenta il debito)"
            },
            {
              "code": "21",
              "desc": "Nota di credito Fornitore (Dare partita aperta, riduce il debito)"
            },
            {
              "code": "25",
              "desc": "Pagamento a Fornitore (Dare, chiude il debito)"
            },
            {
              "code": "40",
              "desc": "Dare su conto di mastro Co.Ge. (es. Costo o Cassa)"
            },
            {
              "code": "50",
              "desc": "Avere su conto di mastro Co.Ge. (es. Ricavo o Banca)"
            }
          ],
          "businessMeaning": "Controlla l'effetto contabile (Dare o Avere), il tipo di conto movimentato e i campi obbligatori a video."
        },
        {
          "position": 7,
          "fieldname": "KOART",
          "isKey": false,
          "shortText": "Tipo di conto contabile",
          "germanName": "Kontoart",
          "dataElement": {
            "name": "KOART",
            "shortText": "Tipo conto (D=Cliente/Debitore, K=Fornitore/Creditore, S=Conto CoGe, A=Cespite)",
            "domain": {
              "name": "KOART",
              "dataType": "CHAR",
              "length": 1,
              "decimals": 0,
              "shortText": "Tipo conto"
            }
          },
          "examples": [
            {
              "code": "D",
              "desc": "Clienti / Debitori (Debitor)"
            },
            {
              "code": "K",
              "desc": "Fornitori / Creditori (Kreditor)"
            },
            {
              "code": "S",
              "desc": "Conti di Mastro Co.Ge. (Sachkonto)"
            },
            {
              "code": "A",
              "desc": "Cespiti e Beni Ammortizzabili (Anlagen)"
            },
            {
              "code": "M",
              "desc": "Materiali e Rimanenze (Material)"
            }
          ],
          "businessMeaning": "Specifica quale sub-ledger (partitario speciale) viene aggiornato dalla riga contabile."
        },
        {
          "position": 8,
          "fieldname": "SHKZG",
          "isKey": false,
          "shortText": "Indicatore Dare / Avere",
          "germanName": "Soll/Haben Kennzeichen",
          "dataElement": {
            "name": "SHKZG",
            "shortText": "Indicatore (S=Soll/Dare, H=Haben/Avere)",
            "domain": {
              "name": "SHKZG",
              "dataType": "CHAR",
              "length": 1,
              "decimals": 0,
              "shortText": "Indicatore Dare/Avere"
            }
          },
          "examples": [
            {
              "code": "S",
              "desc": "Soll = DARE (Addebito patrimoniale o costo)"
            },
            {
              "code": "H",
              "desc": "Haben = AVERE (Accredito patrimoniale o ricavo)"
            }
          ],
          "businessMeaning": "Direzione algebrica della registrazione sul conto contabile."
        },
        {
          "position": 9,
          "fieldname": "DMBTR",
          "isKey": false,
          "shortText": "Importo in divisa locale (Aziendale)",
          "germanName": "Hauswährungsbetrag",
          "dataElement": {
            "name": "DMBTR",
            "shortText": "Importo espresso nella divisa della società (es. EUR)",
            "domain": {
              "name": "WERTV8",
              "dataType": "CURR",
              "length": 15,
              "decimals": 2,
              "shortText": "Importo valuta"
            }
          }
        },
        {
          "position": 10,
          "fieldname": "WRBTR",
          "isKey": false,
          "shortText": "Importo in divisa documento originaria",
          "germanName": "Belegwährungsbetrag",
          "dataElement": {
            "name": "WRBTR",
            "shortText": "Importo nella valuta della fattura/transazione",
            "domain": {
              "name": "WERTV8",
              "dataType": "CURR",
              "length": 15,
              "decimals": 2,
              "shortText": "Importo valuta"
            }
          }
        },
        {
          "position": 11,
          "fieldname": "AUGDT",
          "isKey": false,
          "shortText": "Data di compensazione (Clearing Date)",
          "germanName": "Ausgleichsdatum",
          "dataElement": {
            "name": "AUGDT",
            "shortText": "Data in cui la partita è stata saldata/chiusa",
            "domain": {
              "name": "DATUM",
              "dataType": "DATS",
              "length": 8,
              "decimals": 0,
              "shortText": "Data"
            }
          }
        },
        {
          "position": 12,
          "fieldname": "AUGBL",
          "isKey": false,
          "shortText": "Numero documento di compensazione",
          "germanName": "Ausgleichsbelegnummer",
          "dataElement": {
            "name": "AUGBL",
            "shortText": "Numero documento con cui la riga è stata chiusa/pagata",
            "domain": {
              "name": "BELNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento contabile"
            }
          }
        },
        {
          "position": 13,
          "fieldname": "KUNNR",
          "isKey": false,
          "shortText": "Codice Cliente (se partita aperta cliente)",
          "germanName": "Kundennummer",
          "dataElement": {
            "name": "KUNNR",
            "shortText": "Codice cliente",
            "domain": {
              "name": "KUNNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero cliente"
            }
          }
        },
        {
          "position": 14,
          "fieldname": "LIFNR",
          "isKey": false,
          "shortText": "Codice Fornitore (se partita fornitore)",
          "germanName": "Lieferantennummer",
          "dataElement": {
            "name": "LIFNR",
            "shortText": "Codice fornitore",
            "domain": {
              "name": "LIFNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero fornitore"
            }
          }
        }
      ]
    },
    {
      "tableName": "KNA1",
      "module": "FI",
      "shortText": "Anagrafica Clienti: Dati generali",
      "germanEtymology": "Kundenstamm: Allgemein",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Anagrafica generale di tutti i clienti aziendali (indirizzo, partita IVA, ragione sociale, codice fiscale).",
      "mainKey": [
        "MANDT",
        "KUNNR"
      ],
      "relationships": [
        {
          "targetTable": "KNB1",
          "foreignKey": "KUNNR",
          "description": "Dati contabili del cliente per società"
        },
        {
          "targetTable": "KNVV",
          "foreignKey": "KUNNR",
          "description": "Dati commerciali di vendita per area"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "KUNNR",
          "isKey": true,
          "shortText": "Codice Cliente univoco",
          "germanName": "Kundennummer",
          "dataElement": {
            "name": "KUNNR",
            "shortText": "Numero anagrafico del cliente",
            "domain": {
              "name": "KUNNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero cliente"
            }
          }
        },
        {
          "position": 3,
          "fieldname": "LAND1",
          "isKey": false,
          "shortText": "Codice Paese (Country Key)",
          "germanName": "Länderschlüssel",
          "dataElement": {
            "name": "LAND1",
            "shortText": "Paese di residenza cliente (IT, DE, FR)",
            "domain": {
              "name": "LAND1",
              "dataType": "CHAR",
              "length": 3,
              "decimals": 0,
              "shortText": "Paese"
            }
          }
        },
        {
          "position": 4,
          "fieldname": "NAME1",
          "isKey": false,
          "shortText": "Ragione Sociale / Nome 1",
          "germanName": "Kundenname",
          "dataElement": {
            "name": "NAME1_GP",
            "shortText": "Denominazione principale o nome del cliente",
            "domain": {
              "name": "NAME",
              "dataType": "CHAR",
              "length": 35,
              "decimals": 0,
              "shortText": "Nome"
            }
          }
        },
        {
          "position": 5,
          "fieldname": "ORT01",
          "isKey": false,
          "shortText": "Città / Località",
          "germanName": "Wohnort",
          "dataElement": {
            "name": "ORT01_GP",
            "shortText": "Città del cliente",
            "domain": {
              "name": "TEXT35",
              "dataType": "CHAR",
              "length": 35,
              "decimals": 0,
              "shortText": "Testo 35 caratteri"
            }
          }
        },
        {
          "position": 6,
          "fieldname": "PSTLZ",
          "isKey": false,
          "shortText": "Codice Avviamento Postale (CAP)",
          "germanName": "Postleitzahl",
          "dataElement": {
            "name": "PSTLZ",
            "shortText": "CAP",
            "domain": {
              "name": "PSTLZ",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "CAP"
            }
          }
        },
        {
          "position": 7,
          "fieldname": "STRAS",
          "isKey": false,
          "shortText": "Via e numero civico",
          "germanName": "Straße",
          "dataElement": {
            "name": "STRAS_GP",
            "shortText": "Indirizzo stradale",
            "domain": {
              "name": "TEXT35",
              "dataType": "CHAR",
              "length": 35,
              "decimals": 0,
              "shortText": "Testo 35 caratteri"
            }
          }
        },
        {
          "position": 8,
          "fieldname": "TELF1",
          "isKey": false,
          "shortText": "Numero di telefono principale",
          "germanName": "Telefonnummer",
          "dataElement": {
            "name": "TELF1",
            "shortText": "Telefono aziendale",
            "domain": {
              "name": "TEXT16",
              "dataType": "CHAR",
              "length": 16,
              "decimals": 0,
              "shortText": "Testo 16 caratteri"
            }
          }
        }
      ]
    },
    {
      "tableName": "LFA1",
      "module": "FI",
      "shortText": "Anagrafica Fornitori: Dati generali",
      "germanEtymology": "Lieferantenstamm: Allgemein",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "Anagrafica generale dei fornitori (dati anagrafici, sede legale, recapiti, coordinate fiscali).",
      "mainKey": [
        "MANDT",
        "LIFNR"
      ],
      "relationships": [
        {
          "targetTable": "LFB1",
          "foreignKey": "LIFNR",
          "description": "Dati contabili fornitore per società"
        },
        {
          "targetTable": "LFM1",
          "foreignKey": "LIFNR",
          "description": "Dati acquisti fornitore per organizzazione acquisti"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "MANDT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          },
          "examples": [
            {
              "code": "100",
              "desc": "Mandante di sviluppo"
            },
            {
              "code": "200",
              "desc": "Mandante di test / qualità"
            },
            {
              "code": "500",
              "desc": "Mandante di produzione"
            }
          ],
          "businessMeaning": "Isola i dati aziendali all'interno della stessa istanza del database SAP."
        },
        {
          "position": 2,
          "fieldname": "LIFNR",
          "isKey": true,
          "shortText": "Codice Fornitore univoco",
          "germanName": "Lieferantennummer",
          "dataElement": {
            "name": "LIFNR",
            "shortText": "Numero anagrafico del fornitore",
            "domain": {
              "name": "LIFNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero fornitore"
            }
          }
        },
        {
          "position": 3,
          "fieldname": "LAND1",
          "isKey": false,
          "shortText": "Codice Paese",
          "germanName": "Länderschlüssel",
          "dataElement": {
            "name": "LAND1",
            "shortText": "Paese di residenza fornitore",
            "domain": {
              "name": "LAND1",
              "dataType": "CHAR",
              "length": 3,
              "decimals": 0,
              "shortText": "Paese"
            }
          }
        },
        {
          "position": 4,
          "fieldname": "NAME1",
          "isKey": false,
          "shortText": "Ragione Sociale Fornitore",
          "germanName": "Lieferantenname",
          "dataElement": {
            "name": "NAME1_GP",
            "shortText": "Denominazione principale fornitore",
            "domain": {
              "name": "NAME",
              "dataType": "CHAR",
              "length": 35,
              "decimals": 0,
              "shortText": "Nome"
            }
          }
        },
        {
          "position": 5,
          "fieldname": "ORT01",
          "isKey": false,
          "shortText": "Città / Località",
          "germanName": "Wohnort",
          "dataElement": {
            "name": "ORT01_GP",
            "shortText": "Città sede fornitore",
            "domain": {
              "name": "TEXT35",
              "dataType": "CHAR",
              "length": 35,
              "decimals": 0,
              "shortText": "Testo 35 caratteri"
            }
          }
        },
        {
          "position": 6,
          "fieldname": "PSTLZ",
          "isKey": false,
          "shortText": "CAP",
          "germanName": "Postleitzahl",
          "dataElement": {
            "name": "PSTLZ",
            "shortText": "CAP",
            "domain": {
              "name": "PSTLZ",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "CAP"
            }
          }
        },
        {
          "position": 7,
          "fieldname": "STRAS",
          "isKey": false,
          "shortText": "Indirizzo stradale",
          "germanName": "Straße",
          "dataElement": {
            "name": "STRAS_GP",
            "shortText": "Via e numero civico",
            "domain": {
              "name": "TEXT35",
              "dataType": "CHAR",
              "length": 35,
              "decimals": 0,
              "shortText": "Testo 35 caratteri"
            }
          }
        }
      ]
    },
    {
      "tableName": "ACDOCA",
      "module": "S4",
      "shortText": "Universal Journal Entry: Libro Giornale Unificato S/4HANA",
      "germanEtymology": "Accounting Document Actual (Universal Journal)",
      "tableCategory": "TRANSP",
      "deliveryClass": "A",
      "description": "La tabella regina di S/4HANA Finanza: unifica in una sola riga i dati di Contabilità Generale (FI), Controlling (CO), Cespiti (AA), Material Ledger (ML) e Contabilità Clienti/Fornitori, eliminando la necessità di riconciliazioni.",
      "mainKey": [
        "RCLNT",
        "RLDNR",
        "RBUKRS",
        "GJAHR",
        "BELNR",
        "DOCLN"
      ],
      "relationships": [
        {
          "targetTable": "BKPF",
          "foreignKey": "RBUKRS = BUKRS AND BELNR = BELNR AND GJAHR = GJAHR",
          "description": "Testata del documento contabile originario"
        }
      ],
      "fields": [
        {
          "position": 1,
          "fieldname": "RCLNT",
          "isKey": true,
          "shortText": "Mandante",
          "germanName": "Mandant",
          "dataElement": {
            "name": "MANDT",
            "shortText": "Mandante",
            "domain": {
              "name": "MANDT",
              "dataType": "CLNT",
              "length": 3,
              "decimals": 0,
              "shortText": "Mandante"
            }
          }
        },
        {
          "position": 2,
          "fieldname": "RLDNR",
          "isKey": true,
          "shortText": "Ledger Contabile (es. 0L=Leading Ledger)",
          "germanName": "Ledger",
          "dataElement": {
            "name": "FINS_LEDGER",
            "shortText": "Libro mastro contabile (0L=Standard civilistico)",
            "domain": {
              "name": "FINS_LEDGER",
              "dataType": "CHAR",
              "length": 2,
              "decimals": 0,
              "shortText": "Ledger"
            }
          },
          "examples": [
            {
              "code": "0L",
              "desc": "Leading Ledger: il libro mastro principale conforme ai principi contabili nazionali"
            },
            {
              "code": "2L",
              "desc": "Non-Leading Ledger: libro mastro parallelo conforme a standard IFRS o US-GAAP"
            }
          ],
          "businessMeaning": "Consente la gestione contabile multi-principio (multi-GAAP) nello stesso documento S/4HANA."
        },
        {
          "position": 3,
          "fieldname": "RBUKRS",
          "isKey": true,
          "shortText": "Società",
          "germanName": "Buchungskreis",
          "dataElement": {
            "name": "BUKRS",
            "shortText": "Codice società",
            "domain": {
              "name": "BUKRS",
              "dataType": "CHAR",
              "length": 4,
              "decimals": 0,
              "shortText": "Società"
            }
          }
        },
        {
          "position": 4,
          "fieldname": "GJAHR",
          "isKey": true,
          "shortText": "Esercizio contabile",
          "germanName": "Geschäftsjahr",
          "dataElement": {
            "name": "GJAHR",
            "shortText": "Anno fiscale",
            "domain": {
              "name": "GJAHR",
              "dataType": "NUMC",
              "length": 4,
              "decimals": 0,
              "shortText": "Esercizio"
            }
          }
        },
        {
          "position": 5,
          "fieldname": "BELNR",
          "isKey": true,
          "shortText": "Numero documento contabile",
          "germanName": "Belegnummer",
          "dataElement": {
            "name": "BELNR_D",
            "shortText": "Numero documento contabile",
            "domain": {
              "name": "BELNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Numero documento contabile"
            }
          }
        },
        {
          "position": 6,
          "fieldname": "DOCLN",
          "isKey": true,
          "shortText": "Numero riga contabile a 6 cifre",
          "germanName": "Dokumentenzeile",
          "dataElement": {
            "name": "DOCLN_6",
            "shortText": "Identificativo univoco della riga nel journal unificato",
            "domain": {
              "name": "NUMC6",
              "dataType": "NUMC",
              "length": 6,
              "decimals": 0,
              "shortText": "Numero a 6 cifre"
            }
          }
        },
        {
          "position": 7,
          "fieldname": "RACCT",
          "isKey": false,
          "shortText": "Conto Co.Ge. / Cost Element",
          "germanName": "Sachkonto / Kostenart",
          "dataElement": {
            "name": "RACCT",
            "shortText": "Conto di mastro o conto economico",
            "domain": {
              "name": "SAKNR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Conto di mastro"
            }
          }
        },
        {
          "position": 8,
          "fieldname": "PRCTR",
          "isKey": false,
          "shortText": "Centro di Profitto (Profit Center)",
          "germanName": "Profitcenter",
          "dataElement": {
            "name": "PRCTR",
            "shortText": "Centro di profitto per bilancio analitico",
            "domain": {
              "name": "PRCTR",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Centro di profitto"
            }
          }
        },
        {
          "position": 9,
          "fieldname": "KOSTL",
          "isKey": false,
          "shortText": "Centro di Costo (Cost Center)",
          "germanName": "Kostenstelle",
          "dataElement": {
            "name": "KOSTL",
            "shortText": "Centro di costo per contabilità analitica CO",
            "domain": {
              "name": "KOSTL",
              "dataType": "CHAR",
              "length": 10,
              "decimals": 0,
              "shortText": "Centro di costo"
            }
          }
        },
        {
          "position": 10,
          "fieldname": "HSL",
          "isKey": false,
          "shortText": "Importo in divisa della società (EUR)",
          "germanName": "Betrag in Hauswährung",
          "dataElement": {
            "name": "FINS_VHURR",
            "shortText": "Importo saldo in divisa aziendale",
            "domain": {
              "name": "WERTV8",
              "dataType": "CURR",
              "length": 23,
              "decimals": 2,
              "shortText": "Importo valuta"
            }
          }
        },
        {
          "position": 11,
          "fieldname": "WSL",
          "isKey": false,
          "shortText": "Importo in divisa della transazione",
          "germanName": "Betrag in Transaktionswährung",
          "dataElement": {
            "name": "FINS_VWURR",
            "shortText": "Importo saldo in valuta del documento originario",
            "domain": {
              "name": "WERTV8",
              "dataType": "CURR",
              "length": 23,
              "decimals": 2,
              "shortText": "Importo valuta"
            }
          }
        }
      ]
    }
  ]
};
