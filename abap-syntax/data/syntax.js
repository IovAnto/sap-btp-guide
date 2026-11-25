/**
 * ABAP Syntax & Semantics Reference Dataset
 * Manuale completo di tutti i costrutti del linguaggio ABAP (Moderno, Classico, Deprecato ma Supportato)
 */

window.ABAP_SYNTAX = {
  metadata: {
    title: "ABAP Syntax & Semantics Technical Reference",
    version: "1.0.0",
    language: "it",
    generated: "2026-11-25",
    totalCategories: 13,
    description: "Specifiche formali, semantica runtime, costrutti deprecati con guida alla modernizzazione, casi limite ed esempi compilabili per il 100% della sintassi ABAP."
  },

  categories: [
    {
      id: "DATA_DEF",
      number: "01",
      name: "Dichiarazione Dati & Tipi",
      description: "Variabili scalari, strutture, tipi tabella, costanti e i costrutti storici di Header Line (OCCURS, WITH HEADER LINE, itab[])."
    },
    {
      id: "ASSIGN_STRING",
      number: "02",
      name: "Assegnazioni, Calcoli & Stringhe",
      description: "Operazioni di assegnazione, calcolo matematico, elaborazione stringhe classiche (CONCATENATE, SPLIT) e moderne (String Templates, &&)."
    },
    {
      id: "SQL_ACCESS",
      number: "03",
      name: "Accesso Database & ABAP SQL",
      description: "Open SQL / ABAP SQL moderno e classico: SELECT, host variables @, FOR ALL ENTRIES, JOIN, aggregazioni e gestione LUW."
    },
    {
      id: "ITAB_OPS",
      number: "04",
      name: "Operazioni su Tabelle Interne",
      description: "Standard, Sorted e Hashed Tables; READ TABLE vs Table Expressions itab[...], LOOP AT con Field-Symbol, control breaks e costrutti obsoleti."
    },
    {
      id: "CONSTRUCTORS",
      number: "05",
      name: "Espressioni Costruttore (ABAP 7.40+)",
      description: "Costruttori funzionali VALUE, CORRESPONDING, COND, SWITCH, REDUCE, FILTER, CONV ed EXACT per codice compatto e dichiarativo."
    },
    {
      id: "POINTERS",
      number: "06",
      name: "Puntatori, Field Symbols & Riferimenti Dati",
      description: "Puntatori nativi FIELD-SYMBOLS, assegnazione dinamica ASSIGN COMPONENT, riferimenti anonimi REF TO DATA e dereferenziazione."
    },
    {
      id: "CONTROL_FLOW",
      number: "07",
      name: "Flusso di Controllo & Cicli",
      description: "Istruzioni condizionali (IF, CASE), cicli iterativi (DO, WHILE), istruzioni di interruzione (CHECK, EXIT, CONTINUE, RETURN) e STOP."
    },
    {
      id: "DEBUG_TRACE",
      number: "08",
      name: "Debug, Checkpoint & Variabili sy-*",
      description: "Istruzioni per l'analisi a runtime: BREAK-POINT, BREAK utente, Checkpoint Group SAAB (ASSERT, LOG-POINT) e variabili di sistema."
    },
    {
      id: "PRINT_LIST",
      number: "09",
      name: "Stampa a Video & List Processing Classico",
      description: "Output a video classico di SAP GUI: WRITE, ULINE, SKIP, FORMAT COLOR, liste interattive con HIDE e AT LINE-SELECTION."
    },
    {
      id: "SELECTION_SCREEN",
      number: "10",
      name: "Schermate di Selezione & Maschere",
      description: "Costruzione delle schermate di input: PARAMETERS, SELECT-OPTIONS, cornici BLOCK, PBO dinamico con LOOP AT SCREEN ed eventi del report."
    },
    {
      id: "MODULARIZATION",
      number: "11",
      name: "Modularizzazione, Metodi & Update Task",
      description: "Classi e metodi OO, Function Modules, chiamate asincrone aRFC e V1/V2 Update Task, e le subroutine storiche PERFORM/FORM."
    },
    {
      id: "MEMORY_PARAM",
      number: "12",
      name: "Memorie SAP, Parametri SPA/GPA & Cluster",
      description: "Condivisione dati cross-programma: Memoria utente SAP GUI (SPA/GPA), ABAP Memory di sessione (EXPORT/IMPORT) e Cluster INDX nel Database."
    },
    {
      id: "ERROR_MESSAGE",
      number: "13",
      name: "Gestione Eccezioni & Messaggistica",
      description: "Eccezioni orientate agli oggetti (TRY...CATCH cx_*), sollevamento con RAISE EXCEPTION, e tutti i tipi di messaggio SAP (S, I, W, E, A, X)."
    }
  ],

  constructs: [
    /* ==========================================================================
       01. DICHIARAZIONE DATI & TIPI
       ========================================================================== */
    {
      id: "data-primitive",
      category: "DATA_DEF",
      name: "DATA (Dichiarazione Variabili Primitive)",
      status: "modern",
      statusBadge: "[MODERNO / STANDARD]",
      syntax: "DATA lv_var TYPE type [LENGTH n] [DECIMALS m] [VALUE val].\nDATA(lv_inline) = val.",
      shortText: "Dichiara una variabile scalare o una struttura all'interno del contesto corrente (locale o globale).",
      semantic: "Alloca memoria per una variabile con il tipo specificato. In ABAP 7.40+ supporta la dichiarazione inline tramite `DATA(...)` al primo punto di assegnazione (es. nel SELECT o dopo un metodo).",
      gotchas: "I tipi a lunghezza fissa (es. C, N, P) necessitano della clausola LENGTH o DECIMALS se non specificati nel Data Element. I tipi 'string' e 'xstring' sono a lunghezza variabile e risiedono nello heap di memoria dinamica.",
      systemFields: ["Nessuno"],
      exampleCode: `* Dichiarazione esplicita classica
DATA: lv_count TYPE i VALUE 0,
      lv_price TYPE p DECIMALS 2 VALUE '19.99',
      lv_name  TYPE string.

* Dichiarazione inline moderna (ABAP 7.40+)
DATA(lv_date) = cl_abap_context_info=>get_system_date( ).
DATA(lv_msg)  = |Oggi è il { lv_date DATE = USER }|.`,
      tags: ["data", "variabili", "inline", "string", "tipi", "primitivi"]
    },
    {
      id: "types-struct",
      category: "DATA_DEF",
      name: "TYPES (Definizione di Strutture e Tipi Locali)",
      status: "modern",
      statusBadge: "[MODERNO / STANDARD]",
      syntax: "TYPES: BEGIN OF ty_struct,\n         col1 TYPE type1,\n         col2 TYPE type2,\n       END OF ty_struct.",
      shortText: "Definisce un tipo di dato utente complesso (struttura) senza allocare memoria a runtime.",
      semantic: "Istruzione puramente descrittiva per il compilatore. Definisce il layout dei campi che verranno utilizzati per istanziare work area (`DATA ls_rec TYPE ty_struct`) o tipi tabella.",
      gotchas: "TYPES non alloca byte in memoria fino a quando non viene usato con un'istruzione `DATA`. L'ordine dei campi nella struttura determina l'allineamento dei byte in memoria (data padding).",
      systemFields: ["Nessuno"],
      exampleCode: `TYPES: BEGIN OF ty_order_header,
         vbeln TYPE vbak-vbeln,
         erdat TYPE vbak-erdat,
         kunnr TYPE vbak-kunnr,
         netwr TYPE vbak-netwr,
         waerk TYPE vbak-waerk,
       END OF ty_order_header.

DATA ls_order TYPE ty_order_header.
ls_order-vbeln = '0000010001'.
ls_order-netwr = '1540.50'.`,
      tags: ["types", "strutture", "begin of", "end of", "struttura"]
    },
    {
      id: "types-table",
      category: "DATA_DEF",
      name: "TYPES ... TYPE TABLE OF (Definizione Tipi Tabella)",
      status: "modern",
      statusBadge: "[MODERNO / STANDARD]",
      syntax: "TYPES ty_itab TYPE [STANDARD | SORTED | HASHED] TABLE OF line_type\n  WITH [UNIQUE | NON-UNIQUE] KEY key_spec.",
      shortText: "Definisce un tipo tabella interna specificando categoria di accesso (Standard, Sorted, Hashed) e chiave primaria.",
      semantic: "Le tabelle Standard permettono accesso lineare e per indice; le Sorted mantengono le righe ordinate e hanno accesso logaritmico O(log n); le Hashed utilizzano una tabella hash interna per accesso istantaneo a tempo costante O(1).",
      gotchas: "Una tabella HASHED o SORTED con UNIQUE KEY genera un dump irreversibile (ITAB_DUPLICATE_KEY) se si tenta di inserire un record con chiave già presente via INSERT.",
      systemFields: ["Nessuno"],
      exampleCode: `* Tipo Tabella Standard (chiave non univoca)
TYPES ty_t_orders TYPE STANDARD TABLE OF ty_order_header WITH EMPTY KEY.

* Tipo Tabella Hashed ad altissime prestazioni per lookup univoco O(1)
TYPES ty_h_cust TYPE HASHED TABLE OF kna1 WITH UNIQUE KEY kunnr.

DATA lt_customers TYPE ty_h_cust.`,
      tags: ["table of", "sorted", "hashed", "standard", "chiave", "performance"]
    },
    {
      id: "constants",
      category: "DATA_DEF",
      name: "CONSTANTS (Definizione di Costanti Immutabili)",
      status: "modern",
      statusBadge: "[MODERNO / STANDARD]",
      syntax: "CONSTANTS c_name TYPE type VALUE val.\nCONSTANTS: BEGIN OF c_group,\n             val1 TYPE type VALUE 'A',\n             val2 TYPE type VALUE 'B',\n           END OF c_group.",
      shortText: "Dichiara un oggetto dati con valore immutabile determinato alla compilazione.",
      semantic: "La memoria della costante viene protetta in scrittura. Qualsiasi tentativo di modifica genererà un errore di sintassi del compilatore o un dump se tentato tramite puntatore/Field-Symbol sporco.",
      gotchas: "Utilizzare sempre costanti strutturate anziché 'magic numbers' o 'magic strings' hardcodati nel codice per rispettare i principi Clean ABAP.",
      systemFields: ["Nessuno"],
      exampleCode: `CONSTANTS: BEGIN OF c_order_status,
             created   TYPE c LENGTH 1 VALUE 'A',
             in_review TYPE c LENGTH 1 VALUE 'B',
             approved  TYPE c LENGTH 1 VALUE 'C',
             rejected  TYPE c LENGTH 1 VALUE 'R',
           END OF c_order_status.

IF ls_order-status = c_order_status-approved.
  " Esegui evasione ordine...
ENDIF.`,
      tags: ["constants", "costanti", "clean abap", "immutabile"]
    },
    {
      id: "statics",
      category: "DATA_DEF",
      name: "STATICS (Variabili Locali Statiche e Persistenti)",
      status: "classic",
      statusBadge: "[CLASSICO STANDARD]",
      syntax: "STATICS s_var TYPE type [VALUE val].",
      shortText: "Dichiara una variabile all'interno di una routine o metodo che mantiene il suo valore tra chiamate successive.",
      semantic: "A differenza di DATA locale che viene allocata e deallocata sullo stack a ogni invocazione del metodo, STATICS alloca una singola locazione di memoria nello stack statico che sopravvive fino alla fine del programma/LUW.",
      gotchas: "Non è thread-safe in ambienti paralleli e introduce stato nascosto (hidden state). In Clean ABAP si preferisce utilizzare attributi privati di classe (`DATA` o `CLASS-DATA`).",
      systemFields: ["Nessuno"],
      exampleCode: `METHOD get_next_sequence.
  STATICS s_counter TYPE i VALUE 0.
  s_counter = s_counter + 1.
  rv_next = s_counter.
ENDMETHOD.`,
      tags: ["statics", "statico", "persistente", "routine"]
    },
    {
      id: "with-header-line",
      category: "DATA_DEF",
      name: "WITH HEADER LINE (Tabella con Work Area Fantasma)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "DATA itab TYPE TABLE OF struc WITH HEADER LINE.",
      shortText: "Dichiara contemporaneamente due oggetti con lo stesso identico nome: una tabella interna e una work area scalare.",
      semantic: "Il compilatore alloca una tabella interna e una struttura scalare con il medesimo identificatore `itab`. Quando si usa `itab` senza parentesi quadre, le istruzioni fanno riferimento alla work area; per accedere alla tabella vera e propria occorre usare la sintassi a parentesi quadre `itab[]`.",
      whyDeprecated: "Genera enorme ambiguità semantica: guardando il codice non è chiaro se si stia leggendo la riga corrente o l'intera tabella. È categoricamente vietato nei contesti ad oggetti (ABAP Objects, classi, metodi e ABAP Cloud).",
      modernEquivalent: "Dichiarare separatamente e chiaramente la tabella e la relativa work area: `DATA lt_table TYPE TABLE OF ...` e `DATA ls_wa TYPE ...`.",
      gotchas: "L'istruzione `CLEAR itab` svuota SOLTANTO la work area scalare, lasciando intatte tutte le righe della tabella interna! Per svuotare la tabella occorre scrivere `CLEAR itab[]` oppure `REFRESH itab`.",
      systemFields: ["Nessuno"],
      exampleCode: `* VECCHIO CODICE DEPRECATO CON HEADER LINE:
DATA it_vbrk TYPE TABLE OF vbrk WITH HEADER LINE.

it_vbrk-vbeln = '90000001'. " Scrive nella work area!
APPEND it_vbrk.             " Inserisce la work area nella tabella!

CLEAR it_vbrk.   " ATTENZIONE: La tabella contiene ancora 1 riga!
CLEAR it_vbrk[]. " Ora la tabella interna è vuota.

* -------------------------------------------------------------
* EQUIVALENTE MODERNO CLEAN ABAP:
DATA lt_vbrk TYPE TABLE OF vbrk.
DATA ls_vbrk TYPE vbrk.

ls_vbrk-vbeln = '90000001'.
APPEND ls_vbrk TO lt_vbrk.
CLEAR lt_vbrk. " Svuota la tabella in modo inequivocabile`,
      tags: ["with header line", "header line", "deprecato", "work area", "brackets", "obsoleto"]
    },
    {
      id: "brackets-itab",
      category: "DATA_DEF",
      name: "Parentesi Quadre itab[] (Accesso al Corpo della Tabella)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "itab[] = itab_source[].\nCLEAR itab[].",
      shortText: "Sintassi obbligatoria per riferirsi al corpo della tabella interna quando questa è stata definita WITH HEADER LINE.",
      semantic: "Se `itab` possiede una header line, scrivere `itab` equivale a riferirsi alla sua riga temporanea di lavoro; le parentesi quadre `[]` forzano il runtime ABAP a considerare la tabella interna a più righe nella sua interezza (es. per copie in blocco o passaggio a parametri).",
      whyDeprecated: "La nozione di header line è obsoleta da oltre 20 anni. Nelle tabelle moderne prive di header line le parentesi quadre `[]` sono inutili e scoraggiate.",
      modernEquivalent: "Nelle tabelle moderne senza header line il nome `lt_table` identifica già nativamente il corpo della tabella.",
      gotchas: "In una tabella moderna senza header line, scrivere `lt_tab[]` è ancora accettato dal compilatore ma è considerato 'bad practice' perché superfluo.",
      systemFields: ["Nessuno"],
      exampleCode: `* In presenza di tabelle legacy:
CLEAR legacy_tab[]. " Svuota il corpo
legacy_tab[] = other_tab[]. " Copia l'intero contenuto della tabella`,
      tags: ["brackets", "quadre", "itab[]", "header line", "deprecato"]
    },
    {
      id: "occurs",
      category: "DATA_DEF",
      name: "OCCURS n (Dichiarazione Pre-7.0 di Tabelle Interne)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "DATA: BEGIN OF itab OCCURS n,\n        col1 TYPE type1,\n        col2 TYPE type2,\n      END OF itab.",
      shortText: "Costrutto preistorico di ABAP (R/3 3.x/4.x) per dichiarare contemporaneamente una struttura e una tabella interna con header line.",
      semantic: "Il parametro `n` specificava la dimensione iniziale del blocco di memoria paginato allocato per la tabella. Il compilatore creava implicitamente una tabella interna e la relativa header line.",
      whyDeprecated: "Totalmente obsoleto. Sostituito dalla separazione netta tra `TYPES` e `DATA` con `TYPE TABLE OF`.",
      modernEquivalent: "Definire la struttura con `TYPES: BEGIN OF ty_name ... END OF ty_name.` e la tabella con `DATA lt_tab TYPE TABLE OF ty_name.`.",
      gotchas: "L'allocazione basata su `OCCURS n` è gestita in modo completamente automatico dal memory manager di SAP dai tempi di WebAS 6.20; specificare `n` non ha più alcun effetto prestazionale reale.",
      systemFields: ["Nessuno"],
      exampleCode: `* VECCHIO CODICE LEGACY:
DATA: BEGIN OF it_mara OCCURS 0,
        matnr TYPE mara-matnr,
        mtart TYPE mara-mtart,
      END OF it_mara.

* EQUIVALENTE MODERNO:
TYPES: BEGIN OF ty_mara,
         matnr TYPE mara-matnr,
         mtart TYPE mara-mtart,
       END OF ty_mara.
DATA lt_mara TYPE TABLE OF ty_mara.`,
      tags: ["occurs", "pre-7.0", "deprecato", "obsoleto", "legacy", "header line"]
    },
    {
      id: "ranges-classic",
      category: "DATA_DEF",
      name: "RANGES (Dichiarazione Tabelle Intervallo)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "RANGES r_field FOR dbtab-column.",
      shortText: "Dichiara una tabella interna con struttura di range standard (SIGN, OPTION, LOW, HIGH) e header line implicita.",
      semantic: "Genera una tabella interna per memorizzare intervalli di selezione e filtri WHERE complessi, ma assegna automaticamente una header line.",
      whyDeprecated: "La sintassi `RANGES` crea una tabella con header line. È deprecata ed esclusa dai contesti OO.",
      modernEquivalent: "Usare `DATA lr_range TYPE RANGE OF dbtab-column.`",
      gotchas: "Un range vuoto in una clausola `WHERE col IN @lr_range` non applica alcun filtro (estrae tutti i record).",
      systemFields: ["Nessuno"],
      exampleCode: `* Sintassi moderna Clean ABAP
DATA lr_matnr TYPE RANGE OF mara-matnr.

lr_matnr = VALUE #( ( sign   = 'I' 
                      option = 'EQ' 
                      low    = '000000000000000100' )
                    ( sign   = 'I' 
                      option = 'BT' 
                      low    = '000000000000000200' 
                      high   = '000000000000000299' ) ).`,
      tags: ["ranges", "range of", "sign", "option", "low", "high", "deprecato"]
    },
    {
      id: "tables-dbtab",
      category: "DATA_DEF",
      name: "TABLES: dbtab (Area di Memoria Condivisa per Dynpro)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "TABLES: vbak, vbrk, kna1.",
      shortText: "Dichiara una struttura globale di interfaccia con lo stesso nome della tabella DB, usata per il passaggio dati con le dynpro classiche.",
      semantic: "Nei programmi di tipo Module Pool e Report classici, `TABLES: dbtab` creava una work area globale utilizzata dal sottosistema Dynpro per copiare automaticamente i dati da e verso i campi a video con lo stesso nome.",
      whyDeprecated: "Crea variabili globali ad altissimo rischio di sovrascrittura accidentale; viola l'incapsulamento dei dati e non è consentito nelle classi o nei metodi.",
      modernEquivalent: "Nei contesti moderni i dati vengono passati via strutture esplicite o oggetti di contesto.",
      gotchas: "Se una routine sovrascrive `vbak-vbeln`, il valore viene modificato per tutto il programma e per la schermata a video associata.",
      systemFields: ["Nessuno"],
      exampleCode: `* Nel codice legacy dei Report SAP:
TABLES: vbak.
SELECT-OPTIONS: s_vbeln FOR vbak-vbeln.

* In ABAP Moderno:
DATA lv_vbeln TYPE vbak-vbeln.
SELECT-OPTIONS: s_vbeln FOR lv_vbeln.`,
      tags: ["tables", "dynpro", "deprecato", "work area", "globale"]
    },
    {
      id: "clear-refresh-free",
      category: "DATA_DEF",
      name: "CLEAR vs REFRESH vs FREE (Gestione della Memoria)",
      status: "modern",
      statusBadge: "[MODERNO / CONFRONTO]",
      syntax: "CLEAR dobj.\nREFRESH itab. \" Obsoleto\nFREE itab.",
      shortText: "Comandi per inizializzare variabili o liberare la memoria allocata per tabelle interne.",
      semantic: "`CLEAR itab` cancella tutte le righe della tabella mantenendo però allocata la memoria iniziale allocata per l'heap per velocizzare futuri reinserimenti. `FREE itab` elimina tutte le righe E rilascia completamente la memoria al sistema operativo. `REFRESH` è il sinonimo arcaico di `CLEAR itab`.",
      whyDeprecated: "`REFRESH` è un'istruzione ridondante sostituita da `CLEAR`.",
      modernEquivalent: "Usare `CLEAR itab` per svuotare tabelle normali; usare `FREE itab` solo quando una tabella molto voluminosa (es. 500.000 righe) non verrà più utilizzata nel programma.",
      gotchas: "Ricordare l'insidia con `WITH HEADER LINE`: `CLEAR itab` svuota la work area; `CLEAR itab[]` svuota le righe.",
      systemFields: ["Nessuno"],
      exampleCode: `DATA lt_huge_dataset TYPE TABLE OF bseg.
" ... elaborazione con milioni di record ...
FREE lt_huge_dataset. " Rilascia subito i 400 MB di RAM`,
      tags: ["clear", "refresh", "free", "memoria", "heap", "ram"]
    },

    /* ==========================================================================
       02. ASSEGNAZIONI, CALCOLI & STRINGHE
       ========================================================================== */
    {
      id: "move-to",
      category: "ASSIGN_STRING",
      name: "MOVE ... TO ... (Assegnazione Valore)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "MOVE source TO target.\nMOVE ?= source TO target. \" Cast",
      shortText: "Istruzione classica per assegnare il valore di una variabile a un'altra.",
      semantic: "Copia il contenuto del dato sorgente nella destinazione eseguendo eventuali conversioni di tipo elementari previste dal runtime ABAP.",
      whyDeprecated: "La sintassi `MOVE ... TO ...` è verbosa e contraria alla sintassi di tutti i moderni linguaggi di programmazione.",
      modernEquivalent: "Utilizzare l'operatore di assegnazione diretta: `target = source.` (oppure `target ?= source.` per il downcasting di oggetti).",
      gotchas: "Nessun gotcha semantico, ma rallenta la leggibilità del codice.",
      systemFields: ["Nessuno"],
      exampleCode: `* Legacy:
MOVE '100' TO lv_number.

* Moderno:
lv_number = 100.`,
      tags: ["move", "assegnazione", "deprecato", "clean abap"]
    },
    {
      id: "compute",
      category: "ASSIGN_STRING",
      name: "COMPUTE (Parola Chiave Aritmetica Obsoleta)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "COMPUTE target = exp.",
      shortText: "Parola chiave arcaica risalente alle prime versioni di COBOL e Fortran per indicare un calcolo.",
      semantic: "Il compilatore ABAP la ignora completamente e calcola l'espressione `target = exp`.",
      whyDeprecated: "Totalmente superflua da oltre 30 anni.",
      modernEquivalent: "Scrivere direttamente l'espressione: `target = exp.`",
      gotchas: "Nessuno.",
      systemFields: ["Nessuno"],
      exampleCode: `* Legacy:
COMPUTE lv_total = lv_qty * lv_price.

* Moderno:
lv_total = lv_qty * lv_price.`,
      tags: ["compute", "calcolo", "deprecato", "obsoleto"]
    },
    {
      id: "add-subtract",
      category: "ASSIGN_STRING",
      name: "ADD, SUBTRACT, MULTIPLY, DIVIDE (Istruzioni Matematiche)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "ADD n TO var.\nSUBTRACT n FROM var.\nMULTIPLY var BY n.\nDIVIDE var BY n.",
      shortText: "Istruzioni verbali per eseguire operazioni matematiche di base.",
      semantic: "Eseguono la modifica in-place del valore numerico contenuto in `var`.",
      whyDeprecated: "Istruzioni verbali verbose e obsolete. Vietate nei contesti ABAP Objects e Cloud.",
      modernEquivalent: "Utilizzare gli operatori matematici compatti: `var = var + n.` o `var += n.` (in ABAP moderno).",
      gotchas: "La divisione per zero con `DIVIDE` genera il dump runtime `BCD_ZERODIVIDE` o `COMPUTE_INT_ZERODIVIDE`.",
      systemFields: ["Nessuno"],
      exampleCode: `* Legacy:
ADD 1 TO lv_counter.
MULTIPLY lv_amount BY '1.22'.

* Moderno:
lv_counter = lv_counter + 1.
lv_amount  = lv_amount * '1.22'.`,
      tags: ["add", "subtract", "multiply", "divide", "matematica", "deprecato"]
    },
    {
      id: "move-corresponding-classic",
      category: "ASSIGN_STRING",
      name: "MOVE-CORRESPONDING (Copia Campi Omonimi tra Strutture)",
      status: "classic",
      statusBadge: "[CLASSICO / MODERNO DISPONIBILE]",
      syntax: "MOVE-CORRESPONDING struc1 TO struc2 [EXPANDING NESTED TABLES].",
      shortText: "Copia il valore di tutti i campi aventi lo stesso identico nome tra due strutture o tabelle.",
      semantic: "Esegue una scansione dei componenti della struttura sorgente e copia i valori nei componenti corrispondenti della struttura di destinazione, ignorando i campi non coincidenti.",
      whyDeprecated: "In ABAP 7.40+ l'espressione funzionale `CORRESPONDING #( ... )` è immensamente superiore perché consente inline declaration, mappature di nomi differenti (`MAPPING`) ed esclusioni esplicite (`EXCEPT`).",
      modernEquivalent: "Usare `struc2 = CORRESPONDING #( struc1 ).` oppure `struc2 = CORRESPONDING #( BASE ( struc2 ) struc1 ).`",
      gotchas: "Nei loop su tabelle interne ad alto volume, `MOVE-CORRESPONDING` classico è sensibilmente più lento di un'assegnazione mirata campo per campo.",
      systemFields: ["Nessuno"],
      exampleCode: `* Sintassi moderna ABAP 7.40+ con eccezioni e mappatura:
ls_target = CORRESPONDING #( ls_source 
                             MAPPING partner_id = kunnr 
                             EXCEPT erdat ).`,
      tags: ["move-corresponding", "corresponding", "strutture", "mapping"]
    },
    {
      id: "string-templates",
      category: "ASSIGN_STRING",
      name: "String Templates |... { var } ...| (Interpolazione)",
      status: "modern",
      statusBadge: "[MODERNO 7.40+]",
      syntax: "|Testo statico { var [formatting_options] } altro testo|",
      shortText: "Costrutto moderno per comporre stringhe dinamiche con interpolazione di variabili ed espressioni.",
      semantic: "Sostituisce qualsiasi combinazione arcaica di `CONCATENATE` e `WRITE TO`. Permette opzioni di formattazione integrate per date (`DATE = USER|ISO`), ore (`TIME = USER`), valute (`CURRENCY = 'EUR'`), zeri iniziali (`ALPHA = IN|OUT`) e allineamento (`WIDTH = n PAD = 'c'`).",
      gotchas: "All'interno delle parentesi graffe `{ ... }` è obbligatorio lasciare sempre uno spazio dopo l'apertura `{` e prima della chiusura `}` (es. `{ var }` e non `{var}`).",
      systemFields: ["Nessuno"],
      exampleCode: `DATA(lv_doc)   = '0000045000'.
DATA(lv_price) = '12500.50'.
DATA(lv_date)  = cl_abap_context_info=>get_system_date( ).

* Output formattato ad arte in una riga:
DATA(lv_text) = |Fattura: { lv_doc ALPHA = OUT } | &&
                |Data: { lv_date DATE = USER } | &&
                |Importo: { lv_price CURRENCY = 'EUR' NUMBER = USER } EUR|.`,
      tags: ["string templates", "interpolazione", "alpha", "date", "formattazione"]
    },
    {
      id: "concatenate-classic",
      category: "ASSIGN_STRING",
      name: "CONCATENATE (Concatenazione Classica di Stringhe)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "CONCATENATE s1 s2 ... INTO res [SEPARATED BY sep] [RESPECTING BLANKS].",
      shortText: "Istruzione classica per unire due o più stringhe in una variabile di destinazione.",
      semantic: "Accoda le sequenze di caratteri dei campi sorgente nella variabile `res`.",
      whyDeprecated: "Completamente superata dagli operatori moderni di concatenazione `&&` e dai String Templates `|...|`.",
      modernEquivalent: "Usare `DATA(res) = s1 && sep && s2.` oppure `DATA(res) = |{ s1 }{ sep }{ s2 }|.`",
      gotchas: "Di default, `CONCATENATE` rimuove gli spazi finali dai campi sorgente a lunghezza fissa (tipo C) a meno che non si specifichi esplicitamente la clausola `RESPECTING BLANKS`.",
      systemFields: ["Nessuno"],
      exampleCode: `* Codice legacy:
CONCATENATE 'Ordine' lv_vbeln INTO lv_msg SEPARATED BY space.

* Equivalente moderno:
DATA(lv_msg) = |Ordine { lv_vbeln }|.`,
      tags: ["concatenate", "stringhe", "deprecato", "blanks", "obsoleto"]
    },
    {
      id: "split-statement",
      category: "ASSIGN_STRING",
      name: "SPLIT (Divisione di Stringhe su Delimitatore)",
      status: "classic",
      statusBadge: "[CLASSICO STANDARD]",
      syntax: "SPLIT str AT delim INTO TABLE lt_tokens.\nSPLIT str AT delim INTO var1 var2 ...",
      shortText: "Suddivide una stringa in base a un separatore e inserisce i pezzi in una tabella interna o in variabili singole.",
      semantic: "Esegue il parsing della stringa `str` individuando le occorrenze del delimitatore `delim`. I segmenti estratti vengono memorizzati in sequenza.",
      gotchas: "Se si usa `INTO var1 var2` e la stringa contiene più segmenti rispetto al numero di variabili specificate, l'ultima variabile riceverà l'intera porzione restante della stringa (inclusi i delimitatori residui!).",
      systemFields: ["Nessuno"],
      exampleCode: `DATA(lv_csv_line) = 'MANDT;VBELN;FKDAT;NETWR'.
DATA lt_columns TYPE TABLE OF string.

SPLIT lv_csv_line AT ';' INTO TABLE lt_columns.`,
      tags: ["split", "delimitatore", "csv", "tokens", "stringhe"]
    },
    {
      id: "condense-statement",
      category: "ASSIGN_STRING",
      name: "CONDENSE (Rimozione Spazi Multipli)",
      status: "classic",
      statusBadge: "[CLASSICO / FUNZIONE DISPONIBILE]",
      syntax: "CONDENSE str [NO-GAPS].\nDATA(res) = condense( val = str [del = ' '] ).",
      shortText: "Compatta gli spazi vuoti multipli in un singolo spazio e rimuove gli spazi iniziali e finali.",
      semantic: "Se specificata l'opzione `NO-GAPS`, rimuove TUTTI gli spazi vuoti presenti nella stringa senza eccezioni.",
      whyDeprecated: "L'istruzione procedurale in-place è spesso sostituita dalla funzione stringa integrata funzionale `condense( str )`.",
      modernEquivalent: "Usare l'espressione funzionale `DATA(clean) = condense( str ).`",
      gotchas: "`NO-GAPS` elimina anche gli spazi tra parole separate; fare attenzione se si formattano nomi e cognomi.",
      systemFields: ["Nessuno"],
      exampleCode: `DATA lv_raw TYPE string VALUE '   SAP    BTP    Master    Guide   '.
CONDENSE lv_raw. " Diventa: 'SAP BTP Master Guide'

DATA lv_code TYPE string VALUE 'IT 02 12345 67890'.
CONDENSE lv_code NO-GAPS. " Diventa: 'IT021234567890'`,
      tags: ["condense", "no-gaps", "spazi", "pulizia"]
    },
    {
      id: "translate-statement",
      category: "ASSIGN_STRING",
      name: "TRANSLATE (Conversione Maiuscolo/Minuscolo Obsoleta)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "TRANSLATE str TO UPPER CASE.\nTRANSLATE str TO LOWER CASE.\nTRANSLATE str USING 'ABXY'.",
      shortText: "Modifica in-place i caratteri di una stringa convertendoli o sostituendoli carattere per carattere.",
      semantic: "Converte tutti i caratteri della variabile secondo la regola indicata.",
      whyDeprecated: "Istruzione procedurale obsoleta.",
      modernEquivalent: "Utilizzare le funzioni integrate moderne `to_upper( str )` e `to_lower( str )`.",
      gotchas: "La variante `USING 'ABXY'` sostituisce ogni 'A' con 'B' e ogni 'X' con 'Y'; è molto difficile da leggere e manutenere.",
      systemFields: ["Nessuno"],
      exampleCode: `* Legacy:
TRANSLATE lv_email TO LOWER CASE.

* Moderno Clean ABAP:
DATA(lv_email_clean) = to_lower( lv_email ).`,
      tags: ["translate", "to upper", "to lower", "deprecato", "maiuscolo"]
    },
    {
      id: "search-statement",
      category: "ASSIGN_STRING",
      name: "SEARCH (Ricerca di Sottostringhe Obsoleta)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "SEARCH str FOR pattern [STARTING AT pos] [AND MARK].",
      shortText: "Verifica se un pattern è contenuto in una stringa e imposta sy-subrc e sy-fdpos.",
      semantic: "Cerca la sottostringa `pattern` all'interno di `str`. Se trovata, imposta `sy-subrc = 0` e la posizione iniziale in `sy-fdpos`.",
      whyDeprecated: "L'uso delle variabili di sistema `sy-subrc` e `sy-fdpos` per una ricerca testuale è anti-intuitivo e incline a bug.",
      modernEquivalent: "Usare `find( val = str sub = pattern )` o le funzioni booleane `contains( val = str sub = pattern )` o espressioni regolari `matches( ... )`.",
      gotchas: "`sy-fdpos` è a base 0, mentre la maggior parte delle funzioni moderne usa indici a base 0 o 1 in modo trasparente.",
      systemFields: ["sy-subrc", "sy-fdpos"],
      exampleCode: `* Legacy:
SEARCH lv_text FOR 'ERROR'.
IF sy-subrc = 0.
  " Trovato alla posizione sy-fdpos
ENDIF.

* Moderno:
IF contains( val = lv_text sub = 'ERROR' ).
  DATA(lv_pos) = find( val = lv_text sub = 'ERROR' ).
ENDIF.`,
      tags: ["search", "sy-fdpos", "deprecato", "find", "contains"]
    },

    /* ==========================================================================
       03. ACCESSO DATABASE & ABAP SQL MODERNO (OPEN SQL)
       ========================================================================== */
    {
      id: "select-modern",
      category: "SQL_ACCESS",
      name: "SELECT Moderno (ABAP SQL 7.40 / 7.50+)",
      status: "modern",
      statusBadge: "[MODERNO 7.40+]",
      syntax: "SELECT col1, col2, ...\n  FROM dbtab\n  WHERE col = @lv_var\n  ORDER BY col1\n  INTO TABLE @DATA(lt_result)\n  UP TO @lv_max ROWS.",
      shortText: "La forma raccomandata e standard per l'interrogazione del database in SAP S/4HANA e BTP.",
      semantic: "Richiede l'escape delle variabili host ABAP con la chiocciola `@`, l'uso obbligatorio delle virgole `,` per separare l'elenco dei campi, e supporta la dichiarazione inline della tabella di destinazione con `@DATA(...)`.",
      gotchas: "Se si omette la chiocciola `@` davanti a una variabile host in una query moderna che usa le virgole, il compilatore genererà un errore di sintassi 'Strict Mode'.",
      systemFields: ["sy-subrc", "sy-dbcnt"],
      exampleCode: `SELECT vbeln, erdat, kunnr, netwr, waerk
  FROM vbak
  WHERE mandt = @sy-mandt
    AND auart = 'TA'
    AND netwr > 1000
  ORDER BY netwr DESCENDING
  INTO TABLE @DATA(lt_top_orders)
  UP TO 100 ROWS.

IF sy-subrc = 0.
  " sy-dbcnt contiene il numero di righe estratte dal DB
  DATA(lv_total_read) = sy-dbcnt.
ENDIF.`,
      tags: ["select", "abap sql", "open sql", "modern", "host variables", "@data"]
    },
    {
      id: "select-single",
      category: "SQL_ACCESS",
      name: "SELECT SINGLE (Estrazione Singola Riga)",
      status: "modern",
      statusBadge: "[MODERNO / STANDARD]",
      syntax: "SELECT SINGLE col1, col2\n  FROM dbtab\n  WHERE key_col1 = @val1 AND key_col2 = @val2\n  INTO @DATA(ls_record).",
      shortText: "Estrae esattamente un record dal database in una struttura di destinazione.",
      semantic: "Se il record viene trovato, restituisce `sy-subrc = 0` e popola la struttura. Se non trovato, restituisce `sy-subrc = 4` e azzera la struttura.",
      gotchas: "Best Practice SAP: specificare SEMPRE l'intera chiave primaria nella clausola WHERE quando si usa `SELECT SINGLE`. Se la chiave è incompleta, il database restituirà una riga non deterministica (in S/4HANA con HANA DB genera un warning dell'Extended Check SLIN). Per chiavi parziali usare `UP TO 1 ROWS` con `ORDER BY`.",
      systemFields: ["sy-subrc"],
      exampleCode: `SELECT SINGLE vbeln, fkart, fkdat, kunag, netwr
  FROM vbrk
  WHERE mandt = @sy-mandt
    AND vbeln = @lv_invoice_num
  INTO @DATA(ls_invoice).

IF sy-subrc = 0.
  " Fattura trovata
ELSE.
  " Fattura non esistente (sy-subrc = 4)
ENDIF.`,
      tags: ["select single", "chiave primaria", "singolo record", "sy-subrc"]
    },
    {
      id: "for-all-entries",
      category: "SQL_ACCESS",
      name: "FOR ALL ENTRIES IN (Join Lato Applicativo)",
      status: "classic",
      statusBadge: "[CLASSICO / INSIDIA CRITICA]",
      syntax: "IF lt_filter IS NOT INITIAL.\n  SELECT col1, col2\n    FROM dbtab\n    FOR ALL ENTRIES IN @lt_filter\n    WHERE key_col = @lt_filter-key\n    INTO TABLE @DATA(lt_result).\nENDIF.",
      shortText: "Clausola Open SQL per interrogare il database filtrando su una tabella interna di valori.",
      semantic: "Il database optimizer traduce la query in blocchi di clausole `OR` o tabelle temporanee unendo i risultati.",
      gotchas: "TRABOCCHETTO CRITICO DI PRODUZIONE: Se `lt_filter` è VUOTA, il runtime ABAP IGNORA COMPLETAMENTE la clausola WHERE ed estrae TUTTI I RECORD dell'intera tabella database! È un obbligo tassativo verificare `IF lt_filter IS NOT INITIAL` prima di eseguire la query. Inoltre, la query esegue una `DISTINCT` implicita: se non si estraggono i campi chiave primaria, righe con campi uguali verranno accorpate e perse!",
      systemFields: ["sy-subrc", "sy-dbcnt"],
      exampleCode: `* PROTEZIONE OBBLIGATORIA:
IF lt_orders IS NOT INITIAL.
  " 1. Ordina e rimuovi duplicati per ottimizzare la query FAE
  SORT lt_orders BY vbeln.
  DELETE ADJACENT DUPLICATES FROM lt_orders COMPARING vbeln.

  " 2. Esegui la query
  SELECT vbeln, posnr, matnr, netwr
    FROM vbap
    FOR ALL ENTRIES IN @lt_orders
    WHERE vbeln = @lt_orders-vbeln
    INTO TABLE @DATA(lt_items).
ENDIF.`,
      tags: ["for all entries", "fae", "insidia", "tabella vuota", "distinct", "gotcha"]
    },
    {
      id: "sql-join",
      category: "SQL_ACCESS",
      name: "JOIN (INNER, LEFT OUTER, RIGHT OUTER)",
      status: "modern",
      statusBadge: "[MODERNO / STANDARD]",
      syntax: "SELECT a~vbeln, a~kunnr, b~posnr, b~matnr\n  FROM vbak AS a\n  INNER JOIN vbap AS b ON b~vbeln = a~vbeln\n  LEFT OUTER JOIN mara AS m ON m~matnr = b~matnr\n  WHERE a~vbeln = @lv_num\n  INTO TABLE @DATA(lt_joined).",
      shortText: "Combina righe provenienti da due o più tabelle database sul motore HANA in un'unica query atomica.",
      semantic: "Il join viene eseguito direttamente nel database engine di SAP HANA, riducendo drasticamente il traffico di rete tra Application Server e Database Server (principio 'Code Pushdown').",
      gotchas: "Evitare Join tra troppe tabelle pesanti senza indici. Nei LEFT JOIN, se la tabella destra non ha record corrispondenti, i campi destri avranno valore iniziale/NULL.",
      systemFields: ["sy-subrc", "sy-dbcnt"],
      exampleCode: `SELECT h~vbeln, h~fkart, h~fkdat,
       i~posnr, i~matnr, i~netwr,
       c~name1 AS customer_name
  FROM vbrk AS h
  INNER JOIN vbrp AS i ON i~vbeln = h~vbeln
  LEFT OUTER JOIN kna1 AS c ON c~kunnr = h~kunag
  WHERE h~fkdat >= @lv_start_date
  INTO TABLE @DATA(lt_billing_report).`,
      tags: ["join", "inner join", "left join", "code pushdown", "database"]
    },
    {
      id: "commit-rollback-work",
      category: "SQL_ACCESS",
      name: "COMMIT WORK & ROLLBACK WORK (SAP LUW)",
      status: "modern",
      statusBadge: "[MODERNO / FONDAMENTALE]",
      syntax: "COMMIT WORK [AND WAIT].\nROLLBACK WORK.",
      shortText: "Conclude o annulla una SAP Logical Unit of Work (LUW), rendendo persistenti o revocando le modifiche al database.",
      semantic: "La SAP LUW è diversa dalla DB LUW. `COMMIT WORK` innesca l'esecuzione delle funzioni registrate in Update Task (V1 e V2), i subroutines `PERFORM ... ON COMMIT` e rende persistenti tutte le scritture. L'opzione `AND WAIT` blocca il thread fino a quando l'Update Server non ha terminato la scrittura fisica.",
      gotchas: "NON eseguire MAI un `COMMIT WORK` all'interno di User Exit, BAdI, chiamate RFC o metodi di salvataggio del framework RAP (Restful Application Programming), poiché interferisce con la transazione globale provocando incoerenza dati o dump `DYNPRO_COMMIT_ERROR`.",
      systemFields: ["sy-subrc"],
      exampleCode: `CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
  EXPORTING
    wait = abap_true
  IMPORTING
    return = ls_return.

IF ls_return-type = 'E'.
  ROLLBACK WORK.
ENDIF.`,
      tags: ["commit work", "rollback work", "luw", "and wait", "bapi", "transazione"]
    },

    /* ==========================================================================
       04. OPERAZIONI SU TABELLE INTERNE
       ========================================================================== */
    {
      id: "read-table-expression",
      category: "ITAB_OPS",
      name: "Table Expressions itab[...] (Accesso Diretto a Riga)",
      status: "modern",
      statusBadge: "[MODERNO 7.40+]",
      syntax: "DATA(ls_row) = itab[ col = val ].\nDATA(lv_val) = itab[ col = val ]-subcol.\nDATA(ls_opt) = VALUE #( itab[ col = val ] OPTIONAL ).\nDATA(ls_def) = VALUE #( itab[ col = val ] DEFAULT fallback ).",
      shortText: "Sintassi concisa moderna per leggere una riga da una tabella interna senza dover usare l'istruzione procedurale READ TABLE.",
      semantic: "Cerca la prima riga che soddisfa la condizione. Se la riga non esiste e non si usano le opzioni `OPTIONAL` o `DEFAULT`, scatena l'eccezione intercettabile `cx_sy_itab_line_not_found`.",
      gotchas: "Se si scrive `DATA(row) = itab[ key = val ].` senza TRY...CATCH e la riga manca, il programma va in dump runtime crash immediato! Usare sempre `VALUE #( itab[ ... ] OPTIONAL )` se l'assenza del record è uno scenario ammesso.",
      systemFields: ["Nessuno (usa eccezioni invece di sy-subrc)"],
      exampleCode: `* 1. Accesso sicuro con fallback se non trovato
DATA(ls_user) = VALUE #( lt_users[ uname = sy-uname ] OPTIONAL ).
IF ls_user IS NOT INITIAL.
  " Utente presente
ENDIF.

* 2. Lettura di un singolo campo annidato
DATA(lv_name) = VALUE #( lt_users[ uname = 'DEVELOPER' ]-name_first DEFAULT 'Ospite' ).`,
      tags: ["table expressions", "itab[...]", "optional", "default", "line not found", "modern"]
    },
    {
      id: "line-exists-index",
      category: "ITAB_OPS",
      name: "line_exists( ) & line_index( ) (Funzioni Predicato)",
      status: "modern",
      statusBadge: "[MODERNO 7.40+]",
      syntax: "IF line_exists( itab[ col = val ] ).\nDATA(lv_idx) = line_index( itab[ col = val ] ).",
      shortText: "Funzioni booleana e numerica per verificare l'esistenza di una riga o ottenerne l'indice posizionale.",
      semantic: "`line_exists` restituisce `abap_true` o `abap_false` senza copiare alcun dato in memoria. `line_index` restituisce l'indice intero della riga (equivalente di `sy-tabix`), oppure `0` se non trovata.",
      gotchas: "Molto più efficienti di un `READ TABLE itab TRANSPORTING NO FIELDS` o di un blocco TRY-CATCH.",
      systemFields: ["Nessuno"],
      exampleCode: `IF line_exists( lt_materials[ matnr = '000000000000000100' ] ).
  DATA(lv_pos) = line_index( lt_materials[ matnr = '000000000000000100' ] ).
  " lv_pos contiene l'indice (es. riga 4)
ENDIF.`,
      tags: ["line_exists", "line_index", "esistenza", "indice", "modern"]
    },
    {
      id: "loop-at-fs",
      category: "ITAB_OPS",
      name: "LOOP AT ... ASSIGNING FIELD-SYMBOL (Iterazione Zero-Copy)",
      status: "modern",
      statusBadge: "[MODERNO / PERFORMANCE]",
      syntax: "LOOP AT itab ASSIGNING FIELD-SYMBOL(<fs_row>) WHERE cond.\n  <fs_row>-col = new_val.\nENDLOOP.",
      shortText: "Itera sulle righe di una tabella interna collegando un puntatore diretto a ciascuna riga senza copiare memoria.",
      semantic: "Non alloca byte per una work area locale; il puntatore `<fs_row>` punta direttamente alla locazione di memoria fisica della riga all'interno della tabella. Qualsiasi modifica applicata a `<fs_row>-campo` si riflette istantaneamente nella tabella interna senza necessità di chiamare `MODIFY itab FROM wa`.",
      gotchas: "All'interno del loop, non chiamare istruzioni che riallocano la memoria della tabella (es. `DELETE itab` indiscriminati o `SORT itab`) su cui si sta ciclando.",
      systemFields: ["sy-tabix"],
      exampleCode: `* Modifica di massa super prestazionale:
LOOP AT lt_items ASSIGNING FIELD-SYMBOL(<ls_item>) WHERE netwr > 5000.
  <ls_item>-discount = '0.05'.
  <ls_item>-status   = 'REVIEWED'.
  " Nessun MODIFY itab necessario: la riga è già aggiornata!
ENDLOOP.`,
      tags: ["loop at", "field-symbol", "zero-copy", "performance", "sy-tabix"]
    },
    {
      id: "loop-at-group-by",
      category: "ITAB_OPS",
      name: "LOOP AT ... GROUP BY (Raggruppamento Moderno 7.40)",
      status: "modern",
      statusBadge: "[MODERNO 7.40+]",
      syntax: "LOOP AT itab INTO wa GROUP BY ( key1 = wa-col1 key2 = wa-col2 ) \n  ASSIGNING FIELD-SYMBOL(<group>).\n  LOOP AT GROUP <group> ASSIGNING FIELD-SYMBOL(<member>).\n  ENDLOOP.\nENDLOOP.",
      shortText: "Costrutto nativo moderno per raggruppare record di una tabella interna in base a una o più chiavi.",
      semantic: "Sostituisce completamente le vecchie insidiose istruzioni di rottura di livello `AT NEW` e `AT END OF`. Consente loop annidati sul gruppo corrente calcolando subtotali e statistiche in modo pulito e deterministico.",
      gotchas: "Non richiede che la tabella sia pre-ordinata per funzionare, a differenza di `AT NEW`.",
      systemFields: ["sy-tabix"],
      exampleCode: `LOOP AT lt_sales_items INTO DATA(ls_item)
  GROUP BY ( matnr = ls_item-matnr )
  ASSIGNING FIELD-SYMBOL(<group_mat>).

  DATA(lv_total_qty) = 0.
  LOOP AT GROUP <group_mat> ASSIGNING FIELD-SYMBOL(<line>).
    lv_total_qty = lv_total_qty + <line>-kwmeng.
  ENDLOOP.

  " lv_total_qty contiene il totale aggregato per l'articolo <group_mat>-matnr
ENDLOOP.`,
      tags: ["group by", "grouping", "aggregazione", "subtotali", "modern"]
    },
    {
      id: "control-breaks-classic",
      category: "ITAB_OPS",
      name: "AT NEW / AT END OF / AT FIRST (Control Breaks Classici)",
      status: "classic",
      statusBadge: "[CLASSICO / INSIDIA ASTERISCHI]",
      syntax: "LOOP AT itab INTO wa.\n  AT FIRST. ... ENDAT.\n  AT NEW field. ... ENDAT.\n  AT END OF field. ... ENDAT.\n  AT LAST. ... ENDAT.\nENDLOOP.",
      shortText: "Eventi procedurali classici scatenati durante il ciclo `LOOP AT` quando cambia il valore di un campo di controllo.",
      semantic: "Il runtime ABAP confronta il valore del campo `field` e di tutti i campi posti alla sua sinistra rispetto alla riga precedente. Se il valore cambia, il blocco di codice viene eseguito.",
      gotchas: "TRABOCCHETTO STORICO D'ESAME & PRODUZIONE: Quando si entra all'interno di un blocco `AT NEW` o `AT END OF`, il runtime ABAP riempie AUTOMATICAMENTE tutti i campi posti alla DESTRA del campo di controllo con ASTERISCHI (es. '**********') per i campi carattere o ZERI per i numerici! Se si tenta di leggere o salvare `wa-altro_campo` all'interno di `AT NEW`, si leggeranno asterischi sporchi. Per evitare questo, occorre memorizzare preventivamente la riga originale in una variabile ausiliaria o migrare al moderno `GROUP BY`.",
      systemFields: ["sy-tabix"],
      exampleCode: `SORT lt_vbrp BY vbeln posnr.

LOOP AT lt_vbrp INTO ls_vbrp.
  DATA(ls_safe_row) = ls_vbrp. " Salvataggio riga prima che AT NEW la sporchi!

  AT NEW vbeln.
    " Qui ls_vbrp-posnr e i campi a destra valgono '******'!
    " Usare ls_safe_row se servono dati della riga.
    WRITE: / 'Nuova Fattura:', ls_safe_row-vbeln.
  ENDAT.

  AT END OF vbeln.
    SUM. " Calcola la somma automatica dei campi numerici del gruppo
    WRITE: / 'Totale Fattura:', ls_vbrp-netwr.
  ENDAT.
ENDLOOP.`,
      tags: ["at new", "at end of", "at first", "at last", "sum", "asterischi", "insidia"]
    },
    {
      id: "on-change-of",
      category: "ITAB_OPS",
      name: "ON CHANGE OF (Control Break con Memoria Globale)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "ON CHANGE OF f1 [OR f2 ...].\n  \" Codice eseguito solo al variare del valore\nENDON.",
      shortText: "Costrutto di controllo storico che memorizza internamente il valore della variabile ed esegue il blocco se il valore è cambiato.",
      semantic: "Il kernel ABAP alloca un'area di memoria nascosta per conservare l'ultimo valore valutato di `f1`. Se l'istruzione viene rieseguita e `f1` è differente, il blocco viene eseguito.",
      whyDeprecated: "Completamente vietato in ABAP Objects e fortemente sconsigliato nei report: l'area di memoria globale non viene resettata tra chiamate successive o in subroutine riutilizzate, causando bug fantasma gravissimi e non riproducibili.",
      modernEquivalent: "Mantenere una variabile locale esplicita di confronto (es. `IF lv_current <> lv_previous. lv_previous = lv_current. ... ENDIF.`).",
      gotchas: "Se il blocco viene interrotto con un `EXIT` o `RETURN`, la memoria interna non viene sincronizzata, compromettendo tutte le esecuzioni future del programma.",
      systemFields: ["Nessuno"],
      exampleCode: `* VECCHIO CODICE DEPRECATO:
ON CHANGE OF ls_order-kunnr.
  WRITE: / 'Nuovo Cliente:', ls_order-kunnr.
ENDON.

* EQUIVALENTE MODERNO PULITO:
IF ls_order-kunnr <> lv_prev_kunnr.
  lv_prev_kunnr = ls_order-kunnr.
  WRITE: / 'Nuovo Cliente:', ls_order-kunnr.
ENDIF.`,
      tags: ["on change of", "endon", "deprecato", "memoria globale", "insidia", "obsoleto"]
    },
    {
      id: "provide-statement",
      category: "ITAB_OPS",
      name: "PROVIDE (Interval Join Temporale Storico HCM)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "PROVIDE fields FROM itab1 fields FROM itab2\n  BETWEEN d1 AND d2 [VALID flag] [BOUNDS beg end].",
      shortText: "Costrutto arcaico specifico per elaborare intersezioni temporali di infotipi SAP HCM (date di validità BEGDA e ENDDA).",
      semantic: "Unisce e itera sulle sovrapposizioni temporali tra due tabelle interne ordinate per intervalli di date temporali.",
      whyDeprecated: "Sintassi complessa, opaca e specifica del vecchio modulo HR. Oggi nei contesti S/4HANA HCM si usano query SQL temporali native o metodi di classi dedicati.",
      modernEquivalent: "Query SQL con condizioni di sovrapposizione date (`begda <= @end AND endda >= @beg`).",
      gotchas: "Le tabelle devono essere obbligatoriamente di tipo STANDARD TABLE con header line e ordinate rigorosamente per chiave e per date di validità.",
      systemFields: ["sy-tabix", "sy-subrc"],
      exampleCode: `* Utilizzo tipico in report HR/HCM Infotypes:
PROVIDE * FROM p0001 * FROM p0008
  BETWEEN pn-begda AND pn-endda
  VALID p0001-uname.
  " Elabora intersezione temporale contrattuale e retributiva
ENDPROVIDE.`,
      tags: ["provide", "endprovide", "hcm", "hr", "infotipi", "date", "deprecato"]
    },

    /* ==========================================================================
       05. ESPRESSIONI COSTRUTTORE (ABAP 7.40+)
       ========================================================================== */
    {
      id: "value-operator",
      category: "CONSTRUCTORS",
      name: "VALUE #( ) (Costruttore Dati Universale)",
      status: "modern",
      statusBadge: "[MODERNO 7.40+]",
      syntax: "DATA(ls_struct) = VALUE ty_struct( col1 = val1 col2 = val2 ).\nDATA(lt_table)  = VALUE ty_table( ( col1 = v1 ) ( col1 = v2 ) ).\nDATA(lt_init)   = VALUE #( BASE lt_existing ( col1 = v3 ) ).",
      shortText: "Costruttore per creare e popolare istantaneamente strutture, tabelle interne e scalari senza istruzioni sequenziali.",
      semantic: "Alloca e popola il tipo specificato. Se il tipo può essere dedotto dal contesto a sinistra dell'assegnazione, si usa il simbolo cancelletto `VALUE #( ... )`.",
      gotchas: "La clausola `BASE` permette di mantenere i dati preesistenti e aggiungere ulteriori righe o campi sovrascritti.",
      systemFields: ["Nessuno"],
      exampleCode: `* Popolamento di una tabella interna con 3 righe in un'unica espressione:
DATA(lt_status) = VALUE string_table(
  ( 'DRAFT' )
  ( 'IN_APPROVAL' )
  ( 'CONFIRMED' )
).

* Struttura con campi:
DATA(ls_hdr) = VALUE vbak(
  vbeln = '0000010001'
  auart = 'OR'
  netwr = '2500.00'
  waerk = 'EUR'
).`,
      tags: ["value", "costruttore", "value #", "base", "tabelle", "strutture", "modern"]
    },
    {
      id: "corresponding-operator",
      category: "CONSTRUCTORS",
      name: "CORRESPONDING #( ) (Mappatura Avanzata Strutture)",
      status: "modern",
      statusBadge: "[MODERNO 7.40+]",
      syntax: "target = CORRESPONDING #( [BASE ( target )] source \n  [MAPPING tgt_col = src_col]\n  [EXCEPT col1 col2] ).",
      shortText: "Mappa e copia campi tra strutture e tabelle con supporto per rinomina campi ed esclusioni mirate.",
      semantic: "Supera `MOVE-CORRESPONDING`. Permette di specificare corrispondenze tra campi con nomi differenti via `MAPPING` e di escludere campi specifici con `EXCEPT`.",
      gotchas: "Senza `BASE ( target )`, i campi di `target` che non esistono in `source` vengono azzerati/inizializzati. Usare `BASE` se si desidera preservare i valori preesistenti.",
      systemFields: ["Nessuno"],
      exampleCode: `ls_invoice_item = CORRESPONDING #( ls_order_item
  MAPPING invoice_item_id = order_posnr
          product_code    = matnr
  EXCEPT  created_by
          created_at ).`,
      tags: ["corresponding", "mapping", "except", "base", "conversione", "modern"]
    },
    {
      id: "cond-operator",
      category: "CONSTRUCTORS",
      name: "COND #( ) (Operatore Condizionale Ternario)",
      status: "modern",
      statusBadge: "[MODERNO 7.40+]",
      syntax: "DATA(res) = COND #( WHEN cond1 THEN val1\n                     WHEN cond2 THEN val2\n                     ELSE def_val ).",
      shortText: "Operatore condizionale inline che restituisce un valore in base alla prima condizione vera.",
      semantic: "Valuta in sequenza le espressioni booleane dei rami `WHEN`. Non appena trova una condizione vera, valuta e restituisce il ramo `THEN` corrispondente. Se nessuna è vera, restituisce il valore del ramo `ELSE`.",
      gotchas: "Se nessuna condizione `WHEN` è soddisfatta e manca il ramo `ELSE`, viene scatenata l'eccezione runtime `cx_sy_cond_catchall_error`.",
      systemFields: ["Nessuno"],
      exampleCode: `DATA(lv_discount_pct) = COND decfloat16(
  WHEN lv_total_amount > 10000 THEN '0.15'
  WHEN lv_total_amount > 5000  THEN '0.10'
  WHEN lv_vip_customer = abap_true THEN '0.05'
  ELSE '0.00'
).`,
      tags: ["cond", "condizionale", "ternario", "when then else", "modern"]
    },
    {
      id: "switch-operator",
      category: "CONSTRUCTORS",
      name: "SWITCH #( ) (Istruzione di Selezione Valore Inline)",
      status: "modern",
      statusBadge: "[MODERNO 7.40+]",
      syntax: "DATA(res) = SWITCH #( var WHEN val1 THEN res1\n                          WHEN val2 THEN res2\n                          ELSE def_res ).",
      shortText: "Equivalente funzionale inline dell'istruzione procedurale CASE...WHEN.",
      semantic: "Confronta il valore di `var` con ciascun valore nei rami `WHEN` restituendo il risultato del primo match.",
      gotchas: "Se il valore non combacia con nessun `WHEN` e il ramo `ELSE` è omesso, scatena l'eccezione `cx_sy_switch_catchall_error`.",
      systemFields: ["Nessuno"],
      exampleCode: `DATA(lv_status_text) = SWITCH string( ls_invoice-fkart
  WHEN 'F2' THEN 'Fattura Standard di Vendita'
  WHEN 'G2' THEN 'Nota di Credito'
  WHEN 'L2' THEN 'Nota di Debito'
  WHEN 'S1' THEN 'Fattura di Storno'
  ELSE |Tipo non gestito ({ ls_invoice-fkart })|
).`,
      tags: ["switch", "case inline", "selezione", "modern"]
    },
    {
      id: "reduce-operator",
      category: "CONSTRUCTORS",
      name: "REDUCE #( ) (Iteratore Funzionale & Accumulatore)",
      status: "modern",
      statusBadge: "[MODERNO 7.40+]",
      syntax: "DATA(res) = REDUCE type(\n  INIT acc = init_val\n  FOR wa IN itab [WHERE cond]\n  NEXT acc = acc + wa-amount ).",
      shortText: "Riduce una tabella interna a un singolo valore scalare o a una struttura mediante aggregazione iterativa.",
      semantic: "Inizializza una variabile accumulatore con `INIT`. Per ogni riga della tabella che soddisfa l'eventuale `WHERE`, valuta l'espressione `NEXT` aggiornando l'accumulatore. Al termine del ciclo restituisce il valore finale.",
      gotchas: "Permette di sommare, concatenare o calcolare medie senza dover dichiarare loop procedurali e variabili d'appoggio esterne.",
      systemFields: ["Nessuno"],
      exampleCode: `* Calcolo istantaneo del totale importi di una tabella posizioni:
DATA(lv_grand_total) = REDUCE netwr(
  INIT sum = CONV netwr( 0 )
  FOR item IN lt_billing_items
  WHERE fkurs > 0
  NEXT sum = sum + item-netwr
).`,
      tags: ["reduce", "accumulatore", "somma", "funzionale", "aggregazione", "modern"]
    },
    {
      id: "filter-operator",
      category: "CONSTRUCTORS",
      name: "FILTER #( ) (Filtro Dichiarativo su Tabelle)",
      status: "modern",
      statusBadge: "[MODERNO 7.40+]",
      syntax: "DATA(lt_filtered) = FILTER #( itab WHERE col = val ).\nDATA(lt_except)   = FILTER #( itab EXCEPT WHERE col = val ).",
      shortText: "Filtra i record di una tabella interna e ne crea una copia filtrata senza loop manuali.",
      semantic: "Estrae un sottoinsieme di righe da `itab`. Funziona su tabelle di tipo `SORTED` o `HASHED`, oppure su tabelle che possiedono una chiave secondaria adatta.",
      gotchas: "La tabella sorgente DEVE avere una chiave (primaria o secondaria) che corrisponde ai campi usati nella clausola `WHERE`. Non funziona su tabelle Standard con chiave vuota.",
      systemFields: ["Nessuno"],
      exampleCode: `TYPES ty_sorted_items TYPE SORTED TABLE OF vbap WITH NON-UNIQUE KEY matnr.
DATA lt_all_items TYPE ty_sorted_items.

" Estrae tutte le posizioni relative a uno specifico articolo
DATA(lt_target_items) = FILTER #( lt_all_items WHERE matnr = 'MAT-001' ).`,
      tags: ["filter", "filtro", "sorted", "hashed", "chiave secondaria", "modern"]
    },

    /* ==========================================================================
       06. PUNTATORI, FIELD SYMBOLS & RIFERIMENTI DATI
       ========================================================================== */
    {
      id: "field-symbols-def",
      category: "POINTERS",
      name: "FIELD-SYMBOLS & ASSIGN (Puntatori Simbolici)",
      status: "modern",
      statusBadge: "[MODERNO / PERFORMANCE]",
      syntax: "FIELD-SYMBOLS: <fs> TYPE any [TABLE].\nASSIGN dobj TO <fs>.\nASSIGN COMPONENT name OF STRUCTURE struc TO <fs>.",
      shortText: "Definisce un puntatore simbolico tipizzato o generico e lo collega alla memoria di un oggetto dati.",
      semantic: "Un Field-Symbol in ABAP non alloca memoria propria, ma funge da alias (dereferenced pointer) a una locazione di memoria esistente. Qualsiasi lettura o scrittura su `<fs>` opera direttamente sulla variabile sorgente.",
      gotchas: "Accedere a un Field-Symbol che non è stato assegnato (`<fs> IS NOT ASSIGNED`) scatena il dump runtime irreversibile `GETWA_NOT_ASSIGNED`. Verificare sempre `IF <fs> IS ASSIGNED` prima di usarlo.",
      systemFields: ["sy-subrc"],
      exampleCode: `FIELD-SYMBOLS: <lv_field> TYPE any.

ASSIGN COMPONENT 'NETWR' OF STRUCTURE ls_invoice TO <lv_field>.
IF <lv_field> IS ASSIGNED.
  <lv_field> = <lv_field> * '1.10'. " Modifica il valore direttamente nella struttura
  UNASSIGN <lv_field>. " Buona norma per evitare puntamenti pendenti
ENDIF.`,
      tags: ["field-symbols", "assign", "puntatori", "is assigned", "unassign", "dump"]
    },
    {
      id: "data-references",
      category: "POINTERS",
      name: "DATA REF TO & CREATE DATA (Riferimenti Dati Dinamici)",
      status: "modern",
      statusBadge: "[MODERNO / DINAMICO]",
      syntax: "DATA dref TYPE REF TO data.\nCREATE DATA dref TYPE (dynamic_typename).\nASSIGN dref->* TO FIELD-SYMBOL(<fs_dyn>).",
      shortText: "Gestione di puntatori ad oggetti dati anonimi allocati dinamicamente nello heap a runtime.",
      semantic: "Permette di creare tabelle, strutture o variabili il cui tipo è sconosciuto a compile-time (es. il nome di una tabella passato da parametro video). L'operatore `->*` effettua la dereferenziazione del puntatore.",
      gotchas: "A differenza dei linguaggi come C++, ABAP gestisce la memoria dei data reference tramite Garbage Collector automatico: quando nessun puntatore fa più riferimento all'oggetto, la memoria viene deallocata in background.",
      systemFields: ["sy-subrc"],
      exampleCode: `PARAMETERS p_table TYPE tabname DEFAULT 'MARA'.
DATA lr_table TYPE REF TO data.

" Crea a runtime una tabella interna del tipo digitato dall'utente
CREATE DATA lr_table TYPE TABLE OF (p_table).
ASSIGN lr_table->* TO FIELD-SYMBOL(<lt_dynamic>).

SELECT * FROM (p_table) INTO TABLE @<lt_dynamic> UP TO 10 ROWS.`,
      tags: ["ref to data", "create data", "dereferenziazione", "dinamico", "garbage collector"]
    },

    /* ==========================================================================
       07. FLUSSO DI CONTROLLO & CICLI
       ========================================================================== */
    {
      id: "check-statement",
      category: "CONTROL_FLOW",
      name: "CHECK (Condizione di Guardia Multifunzionale)",
      status: "classic",
      statusBadge: "[CLASSICO / INSIDIA CONTESTO]",
      syntax: "CHECK condition.",
      shortText: "Verifica una condizione ed esce anticipatamente dall'iterazione o dal blocco se falsa.",
      semantic: "Se `condition` è vera, l'esecuzione prosegue normalmente. Se `condition` è falsa, il comportamento dipende dal contesto: all'interno di un loop (DO, WHILE, LOOP) agisce come `CONTINUE` (salta all'iterazione successiva); all'interno di una routine o metodo agisce come `RETURN`; all'interno di eventi di report (es. GET, START-OF-SELECTION) salta all'evento successivo.",
      whyDeprecated: "La guida ufficiale Clean ABAP ne sconsiglia l'uso all'interno dei metodi a causa della sua semantica mutante a seconda del contesto; si preferisce un costrutto esplicito `IF NOT condition. RETURN. ENDIF.` o `CONTINUE`.",
      modernEquivalent: "Usare guard clauses esplicite con `IF NOT cond. RETURN. ENDIF.` oppure `IF NOT cond. CONTINUE. ENDIF.`",
      gotchas: "L'uso di CHECK fuori dai cicli crea confusione a chi legge se si aspetta un comportamento analogo a un'asserzione.",
      systemFields: ["Nessuno"],
      exampleCode: `* In un ciclo (agisce come CONTINUE se falso):
LOOP AT lt_items INTO DATA(ls_item).
  CHECK ls_item-netwr > 0. " Se 0 o negativo, salta subito alla riga dopo
  " Elaborazione riga positiva...
ENDLOOP.`,
      tags: ["check", "control flow", "guard clause", "continue", "insidia"]
    },
    {
      id: "do-times",
      category: "CONTROL_FLOW",
      name: "DO ... TIMES (Ciclo Iterativo a Contatore)",
      status: "modern",
      statusBadge: "[MODERNO / STANDARD]",
      syntax: "DO [n TIMES].\n  \" sy-index contiene l'indice corrente dell'iterazione\n  IF exit_condition. EXIT. ENDIF.\nENDDO.",
      shortText: "Esegue un blocco di codice per un numero fisso di volte o all'infinito fino a un'uscita esplicita.",
      semantic: "A ogni ciclo, la variabile di sistema `sy-index` viene incrementata automaticamente partendo da 1. Se il numero di volte non è specificato, il ciclo continua finché non viene incontrata un'istruzione `EXIT`, `RETURN` o `RAISE EXCEPTION`.",
      gotchas: "Dimenticare l'istruzione di uscita in un ciclo `DO` senza `TIMES` genera un loop infinito che satura la CPU fino all'abbattimento del processo da parte del Time Limit di SAP (`TIME_OUT` dump).",
      systemFields: ["sy-index"],
      exampleCode: `DO 5 TIMES.
  WRITE: / |Iterazione numero { sy-index }|.
ENDDO.`,
      tags: ["do", "times", "sy-index", "ciclo", "loop infinito"]
    },

    /* ==========================================================================
       08. DEBUG, CHECKPOINT & VARIABILI SY-*
       ========================================================================== */
    {
      id: "break-point",
      category: "DEBUG_TRACE",
      name: "BREAK-POINT (Punto di Interruzione Statico)",
      status: "modern",
      statusBadge: "[MODERNO / STRUMENTO DEBUG]",
      syntax: "BREAK-POINT.\nBREAK <username>.",
      shortText: "Interrompe forzatamente l'esecuzione del programma e apre l'ABAP Debugger nella SAP GUI.",
      semantic: "Se il programma è eseguito in modalità interattiva da un utente con autorizzazione di debug, il runtime congela il thread di esecuzione sul work process e visualizza il debugger. La variante `BREAK <username>` (es. `BREAK JSMITH`) scatta SOLAMENTE se l'utente connesso corrisponde allo username indicato.",
      gotchas: "PERICOLO IN PRODUZIONE: Non rilasciare mai istruzioni `BREAK-POINT` incondizionate nel codice di produzione! Se eseguite in un background job (batch), causeranno la terminazione anomala o il blocco permanente del job.",
      systemFields: ["Nessuno"],
      exampleCode: `* Breakpoint incondizionato generico:
BREAK-POINT.

* Breakpoint mirato per il solo sviluppatore Mario Rossi:
BREAK mrossi. " Non scatterà per gli altri utenti`,
      tags: ["break-point", "break", "debugger", "sap gui", "saab", "produzione"]
    },
    {
      id: "break-point-id",
      category: "DEBUG_TRACE",
      name: "BREAK-POINT ID & ASSERT (Checkpoint Groups SAAB)",
      status: "modern",
      statusBadge: "[MODERNO / BEST PRACTICE]",
      syntax: "BREAK-POINT ID group_name.\nASSERT [ID group_name] CONDITION log_exp.\nLOG-POINT ID group_name SUBKEY key FIELDS f1 f2.",
      shortText: "Punti di debug, asserzioni e tracciamento dinamico controllabili tramite la transazione SAAB.",
      semantic: "Consentono di inserire verifiche senza impatti negativi in produzione: di default sono spenti (costo CPU pari a zero). L'amministratore o lo sviluppatore può attivarli selettivamente dalla transazione `SAAB` per un singolo utente o per l'intero sistema (es. come breakpoint, come log silente o come dump).",
      gotchas: "Se `ASSERT` viene usato senza `ID group` e la condizione è falsa, genera IMMEDIATAMENTE il dump irreversibile `ASSERTION_FAILED` in qualsiasi ambiente (incluso produzione!).",
      systemFields: ["Nessuno"],
      exampleCode: `* Asserzione controllata da checkpoint group 'ZFINANCE':
ASSERT ID zfinance CONDITION ls_invoice-netwr >= 0.

* Tracciamento silente ad alte prestazioni senza fermare il codice:
LOG-POINT ID zfinance SUBKEY ls_invoice-vbeln 
          FIELDS ls_invoice-fkart ls_invoice-netwr.`,
      tags: ["saab", "assert", "log-point", "checkpoint", "dump", "produzione"]
    },
    {
      id: "system-fields-debug",
      category: "DEBUG_TRACE",
      name: "Variabili di Sistema sy-* Fondamentali",
      status: "modern",
      statusBadge: "[MODERNO / RIFERIMENTO GLOBALE]",
      syntax: "sy-subrc, sy-tabix, sy-index, sy-dbcnt, sy-batch, sy-uname, sy-datum, sy-uzeit, sy-repid",
      shortText: "Struttura globale SYST manutenuta in tempo reale dal kernel ABAP con lo stato dell'ambiente e delle ultime operazioni.",
      semantic: "Fornisce informazioni immediate sullo stato di ritorno: `sy-subrc = 0` (successo), `sy-tabix` (indice riga itab), `sy-index` (indice iterazione loop), `sy-dbcnt` (conteggio righe toccate dal database), `sy-batch = 'X'` (se in background job).",
      gotchas: "Le istruzioni ABAP sovrascrivono continuamente `sy-subrc`. Se occorre conservare il risultato di una query o di una ricerca, salvarlo subito in una variabile locale (`DATA(lv_rc) = sy-subrc.`) prima di chiamare altre istruzioni.",
      systemFields: ["sy-subrc", "sy-tabix", "sy-index", "sy-dbcnt", "sy-batch"],
      exampleCode: `IF sy-batch = abap_true.
  " Esecuzione schedulata in background (nessuna GUI attiva)
ENDIF.

WRITE: / |Utente connesso: { sy-uname } su programma { sy-repid }|.
WRITE: / |Data server: { sy-datum DATE = ISO }, Ora: { sy-uzeit TIME = ISO }|.`,
      tags: ["sy-subrc", "sy-tabix", "sy-index", "sy-batch", "sy-uname", "variabili di sistema"]
    },

    /* ==========================================================================
       09. STAMPA A VIDEO & LIST PROCESSING CLASSICO
       ========================================================================== */
    {
      id: "write-statement",
      category: "PRINT_LIST",
      name: "WRITE: / (Output a Video su Lista Classica)",
      status: "classic",
      statusBadge: "[CLASSICO STANDARD]",
      syntax: "WRITE: / [pos(len)] dobj [COLOR col] [INTENSIFIED] [HOTSPOT [ON|OFF]].\nULINE [/(pos(len))].\nSKIP [n].",
      shortText: "Istruzione fondamentale per generare l'output grafico su report a lista classica SAP GUI.",
      semantic: "Il carattere `/` forza l'avanzamento a una nuova riga (new line). `ULINE` disegna una linea orizzontale separatrice, `SKIP` salta righe vuote. L'opzione `HOTSPOT ON` trasforma il testo in un link cliccabile con l'icona della mano.",
      whyDeprecated: "Nello sviluppo moderno (SAP Fiori, SAPUI5, ALV Grid moderna `cl_salv_table`) la scrittura diretta a video con `WRITE` è obsoleta e non utilizzabile in ambienti web o cloud.",
      modernEquivalent: "Utilizzare la classe ALV `cl_salv_table` per creare griglie interattive moderne, o esporre servizi OData per Fiori.",
      gotchas: "Non funziona nei contesti background se non viene generato uno spool di stampa associato.",
      systemFields: ["sy-linno", "sy-colno"],
      exampleCode: `WRITE: /1(10) 'Numero' COLOR COL_HEADING,
        12(30) 'Descrizione' COLOR COL_HEADING,
        45(15) 'Importo' COLOR COL_HEADING.
ULINE.

WRITE: /1(10) 'DOC-1001' HOTSPOT ON,
        12(30) 'Materiale Acciaio Inox',
        45(15) '1,250.00' COLOR COL_TOTAL.`,
      tags: ["write", "uline", "skip", "liste classiche", "report", "sap gui"]
    },
    {
      id: "hide-statement",
      category: "PRINT_LIST",
      name: "HIDE & AT LINE-SELECTION (Liste Interattive)",
      status: "classic",
      statusBadge: "[CLASSICO / TECNICA HIDE]",
      syntax: "WRITE: / dobj.\nHIDE: key_field1, key_field2.\n\nAT LINE-SELECTION.\n  \" key_field1 contiene il valore associato alla riga cliccata!",
      shortText: "Tecnica storica di ABAP per memorizzare dati non visibili associati a ciascuna riga della lista stampata.",
      semantic: "Quando viene stampata una riga con `WRITE`, l'istruzione `HIDE: f` memorizza il valore del campo `f` in un'area di memoria nascosta collegata al numero di riga. Quando l'utente fa doppio clic sulla riga a video (evento `AT LINE-SELECTION`), il kernel ripristina istantaneamente il valore originario nelle variabili specificate nell'HIDE.",
      whyDeprecated: "Sostituito dalle griglie ALV orientate agli oggetti (`cl_gui_alv_grid` o `cl_salv_table`).",
      modernEquivalent: "Gestire gli eventi di selezione riga tramite l'evento `double_click` del controller ALV.",
      gotchas: "L'istruzione `HIDE` deve trovarsi subito dopo il `WRITE` della riga di riferimento, prima del successivo avanzamento di riga.",
      systemFields: ["sy-lsind", "sy-lilli"],
      exampleCode: `LOOP AT lt_invoices INTO ls_invoice.
  WRITE: / ls_invoice-vbeln HOTSPOT ON, ls_invoice-fkdat, ls_invoice-netwr.
  HIDE: ls_invoice-vbeln. " Salva il codice fattura nella hide area della riga
ENDLOOP.

AT LINE-SELECTION.
  " Quando l'utente clicca una riga, ls_invoice-vbeln contiene già la chiave esatta!
  SET PARAMETER ID 'VF' FIELD ls_invoice-vbeln.
  CALL TRANSACTION 'VF03' AND SKIP FIRST SCREEN.`,
      tags: ["hide", "at line-selection", "liste interattive", "doppio clic", "classico"]
    },

    /* ==========================================================================
       10. SCHERMATE DI SELEZIONE & MASCHERE
       ========================================================================== */
    {
      id: "parameters-statement",
      category: "SELECTION_SCREEN",
      name: "PARAMETERS (Campi Singoli di Selezione)",
      status: "modern",
      statusBadge: "[MODERNO / STANDARD REPORT]",
      syntax: "PARAMETERS: p_var TYPE type [DEFAULT val] [OBLIGATORY]\n            [AS CHECKBOX] [RADIOBUTTON GROUP grp] [MODIF ID id].",
      shortText: "Genera un campo di input a singolo valore sulla maschera di avvio del programma.",
      semantic: "Crea automaticamente l'etichetta a video (recuperata dai Text Elements del programma o dal Data Element), il controllo di obbligatorietà e l'aiuto ricerca F4.",
      gotchas: "Per i Radiobutton, un solo elemento del gruppo può avere `DEFAULT 'X'`; se nessuno ha DEFAULT, il sistema seleziona il primo per impostazione predefinita.",
      systemFields: ["Nessuno"],
      exampleCode: `SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-001.
  PARAMETERS: p_bukrs TYPE bukrs OBLIGATORY DEFAULT '1000',
              p_test  AS CHECKBOX DEFAULT 'X'.

  PARAMETERS: p_rad1 RADIOBUTTON GROUP r1 DEFAULT 'X',
              p_rad2 RADIOBUTTON GROUP r1.
SELECTION-SCREEN END OF BLOCK b1.`,
      tags: ["parameters", "selection-screen", "checkbox", "radiobutton", "maschera"]
    },
    {
      id: "select-options-statement",
      category: "SELECTION_SCREEN",
      name: "SELECT-OPTIONS (Campi Intervallo Multivalore)",
      status: "modern",
      statusBadge: "[MODERNO / FONDAMENTALE]",
      syntax: "SELECT-OPTIONS: s_field FOR dbtab-column [NO-EXTENSION] [NO INTERVALS] [OBLIGATORY].",
      shortText: "Crea una maschera complessa per inserire intervalli (DA... A...), inclusioni, esclusioni ed elenchi multipli.",
      semantic: "Genera una tabella interna di tipo RANGE a 4 colonne: `SIGN` ('I' include, 'E' esclude), `OPTION` ('EQ', 'BT', 'CP', 'GT', 'LE', ecc.), `LOW` (valore minimo) e `HIGH` (valore massimo). Può essere usata direttamente nella clausola WHERE con la sintassi `WHERE col IN @s_field`.",
      gotchas: "Se l'utente non inserisce nulla a video, la tabella `s_field` è vuota e in SQL `IN @s_field` significa 'seleziona tutto senza filtro'.",
      systemFields: ["Nessuno"],
      exampleCode: `DATA gv_matnr TYPE mara-matnr.
SELECT-OPTIONS: s_matnr FOR gv_matnr.

* Utilizzo diretto e pulito nella query:
SELECT matnr, mtart, meins
  FROM mara
  WHERE matnr IN @s_matnr
  INTO TABLE @DATA(lt_materials).`,
      tags: ["select-options", "range", "sign", "option", "low", "high", "maschera"]
    },
    {
      id: "selection-screen-events",
      category: "SELECTION_SCREEN",
      name: "Ciclo di Vita & Dinamismo della Maschera (PBO/PAI)",
      status: "modern",
      statusBadge: "[MODERNO / CICLO VITA REPORT]",
      syntax: "INITIALIZATION.\nAT SELECTION-SCREEN OUTPUT.\nAT SELECTION-SCREEN ON field.\nAT SELECTION-SCREEN ON VALUE-REQUEST FOR field.\nSTART-OF-SELECTION.\nEND-OF-SELECTION.",
      shortText: "Eventi sequenziali del report per inizializzare valori, manipolare dinamicamente i campi a video e avviare l'elaborazione.",
      semantic: "`INITIALIZATION` viene eseguito una sola volta all'avvio. `AT SELECTION-SCREEN OUTPUT` (PBO) viene eseguito a ogni rendering della maschera e permette di nascondere o disabilitare campi ciclando sulla tabella di sistema `SCREEN` con `LOOP AT SCREEN ... MODIFY SCREEN`. `START-OF-SELECTION` scatta quando l'utente preme F8 (Esegui).",
      gotchas: "Se si modifica un attributo di `SCREEN` (es. `screen-active = 0`), è obbligatorio chiamare `MODIFY SCREEN` immediatamente all'interno del loop, altrimenti la modifica viene scartata.",
      systemFields: ["sy-ucomm"],
      exampleCode: `AT SELECTION-SCREEN OUTPUT.
  " Nascondi dinamicamente i campi con MODIF ID 'MOD' se la checkbox di test è attiva
  LOOP AT SCREEN.
    IF screen-group1 = 'MOD' AND p_test = abap_true.
      screen-active = 0.
      MODIFY SCREEN.
    ENDIF.
  ENDLOOP.

START-OF-SELECTION.
  " Esecuzione della logica di business principale (premuto F8)`,
      tags: ["selection-screen", "initialization", "loop at screen", "modify screen", "start-of-selection"]
    },

    /* ==========================================================================
       11. MODULARIZZAZIONE, METODI & UPDATE TASK
       ========================================================================== */
    {
      id: "class-methods-oo",
      category: "MODULARIZATION",
      name: "Classi & Metodi (ABAP Objects Moderno)",
      status: "modern",
      statusBadge: "[MODERNO / ARCHITETTURA]",
      syntax: "CLASS zcl_service DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    METHODS execute IMPORTING iv_param TYPE string\n                    RETURNING VALUE(rv_result) TYPE i\n                    RAISING   cx_static_check.\nENDCLASS.",
      shortText: "Struttura cardine della programmazione orientata agli oggetti moderna in SAP S/4HANA.",
      semantic: "I metodi supportano parametri `IMPORTING`, `EXPORTING`, `CHANGING` e un singolo parametro funzionale di ritorno `RETURNING VALUE(...)`, che consente di chiamare il metodo all'interno di espressioni inline (`DATA(res) = oref->execute( 'VAL' ).`).",
      gotchas: "Nei metodi funzionali (che hanno RETURNING), non è consentito avere parametri EXPORTING o CHANGING.",
      systemFields: ["Nessuno"],
      exampleCode: `CLASS zcl_calculator DEFINITION.
  PUBLIC SECTION.
    METHODS multiply IMPORTING iv_a TYPE i
                               iv_b TYPE i
                     RETURNING VALUE(rv_res) TYPE i.
ENDCLASS.

CLASS zcl_calculator IMPLEMENTATION.
  METHOD multiply.
    rv_res = iv_a * iv_b.
  ENDMETHOD.
ENDCLASS.

" Invocazione moderna fluida:
DATA(lo_calc) = NEW zcl_calculator( ).
DATA(lv_val)  = lo_calc->multiply( iv_a = 5 iv_b = 10 ).`,
      tags: ["class", "methods", "returning", "abap objects", "oo", "modern"]
    },
    {
      id: "call-function-update-task",
      category: "MODULARIZATION",
      name: "CALL FUNCTION ... IN UPDATE TASK (V1/V2 Update)",
      status: "classic",
      statusBadge: "[CLASSICO / TRANSAZIONALE]",
      syntax: "CALL FUNCTION 'Z_SAVE_DOCUMENT' IN UPDATE TASK\n  EXPORTING\n    is_header = ls_hdr\n  TABLES\n    it_items  = lt_items.",
      shortText: "Registra l'esecuzione asincrona di un Function Module all'interno del processo di Update (V1/V2) durante il COMMIT WORK.",
      semantic: "Il codice del modulo di funzione NON viene eseguito al momento della chiamata, ma viene serializzato e salvato nelle tabelle di log di update (`VBHDR`, `VBDATA`). Quando successivamente il programma esegue `COMMIT WORK`, il dispatcher SAP affida l'esecuzione al work process di tipo UPD (V1 = aggiornamenti primari critici, V2 = statistiche secondarie).",
      gotchas: "In un function module `IN UPDATE TASK` è SEVERAMENTE VIETATO usare qualsiasi interazione a video (`WRITE`, schermi dynpro, popup) e non è possibile eseguire un ulteriore `COMMIT WORK`, pena dump immediato `DYNPRO_NOT_SUPPORTED`.",
      systemFields: ["sy-subrc"],
      exampleCode: `* Registrazione scrittura asincrona garantita:
CALL FUNCTION 'Z_POST_LEDGER_UPDATE' IN UPDATE TASK
  EXPORTING
    is_doc = ls_accounting_doc.

* Scrittura fisica nel database innescata qui:
COMMIT WORK AND WAIT.
IF sy-subrc = 0.
  " Salvataggio riuscito e confermato dall'Update Work Process
ENDIF.`,
      tags: ["in update task", "v1", "v2", "update work process", "commit work", "transazionale"]
    },
    {
      id: "perform-form",
      category: "MODULARIZATION",
      name: "PERFORM & FORM (Subroutine Classiche Obsolete)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "PERFORM subr_name USING p1 CHANGING p2.\nFORM subr_name USING value(p1) CHANGING p2.\nENDFORM.",
      shortText: "Costrutto procedurale arcaico di modularizzazione interna del codice.",
      semantic: "Salta all'esecuzione del blocco `FORM` passando parametri per valore o per riferimento.",
      whyDeprecated: "I FORM non supportano visibilità privata/pubblica, non supportano eccezioni basate su classi, non sono verificati in modo sicuro dal compilatore sui tipi generici e sono categoricamente vietati in ABAP Objects e Cloud.",
      modernEquivalent: "Sostituire qualsiasi `PERFORM` con metodi di classi locali o globali (`METHODS subr_name ...`).",
      gotchas: "Se i parametri in `USING` non hanno la parola chiave `value(...)`, vengono passati per riferimento, consentendo alla subroutine di modificarne inaspettatamente il valore esterno!",
      systemFields: ["sy-subrc"],
      exampleCode: `* VECCHIO CODICE LEGACY CON PERFORM:
PERFORM calculate_tax USING ls_item-netwr CHANGING ls_item-tax.

FORM calculate_tax USING value(iv_net) CHANGING cv_tax.
  cv_tax = iv_net * '0.22'.
ENDFORM.`,
      tags: ["perform", "form", "subroutine", "deprecato", "obsoleto", "abap objects"]
    },

    /* ==========================================================================
       12. MEMORIE SAP, PARAMETRI SPA/GPA & CLUSTER
       ========================================================================== */
    {
      id: "set-get-parameter-id",
      category: "MEMORY_PARAM",
      name: "GET/SET PARAMETER ID (Memoria Utente SPA/GPA)",
      status: "classic",
      statusBadge: "[CLASSICO / SAP MEMORY]",
      syntax: "SET PARAMETER ID 'pid' FIELD dobj.\nGET PARAMETER ID 'pid' FIELD dobj.",
      shortText: "Scrive o legge parametri nella memoria globale della sessione utente (SAP GUI SPA/GPA).",
      semantic: "I parametri SPA/GPA rimangono attivi per l'intera durata della sessione utente su quel computer (es. memoria del codice cliente 'KUN' o del materiale 'MAT'). Permettono il pre-popolamento automatico delle maschere quando si salta da una transazione all'altra con `CALL TRANSACTION`.",
      gotchas: "La chiave PID è un identificativo a 3 caratteri alfanumerici definito nel dizionario dati (tabella TPARA). Fare attenzione: la memoria è condivisa da tutte le finestre/modalità aperte dall'utente in quella sessione.",
      systemFields: ["sy-subrc"],
      exampleCode: `* Pre-imposta il numero fattura prima di saltare alla transazione VF03:
SET PARAMETER ID 'VF' FIELD '0090000001'.
CALL TRANSACTION 'VF03' AND SKIP FIRST SCREEN.

* In un altro programma, legge l'ultimo materiale inserito dall'utente:
DATA lv_matnr TYPE mara-matnr.
GET PARAMETER ID 'MAT' FIELD lv_matnr.`,
      tags: ["set parameter id", "get parameter id", "spa/gpa", "tpara", "memoria utente", "call transaction"]
    },
    {
      id: "export-import-memory",
      category: "MEMORY_PARAM",
      name: "EXPORT / IMPORT MEMORY ID (ABAP Memory di Sessione)",
      status: "classic",
      statusBadge: "[CLASSICO / ABAP MEMORY]",
      syntax: "EXPORT f1 = v1 f2 = v2 TO MEMORY ID 'SHARED_ID'.\nIMPORT f1 = v1 f2 = v2 FROM MEMORY ID 'SHARED_ID'.\nFREE MEMORY ID 'SHARED_ID'.",
      shortText: "Salva o recupera cluster di variabili e tabelle interne all'interno della memoria interna dello stesso Internal Session.",
      semantic: "Permette il passaggio rapido di strutture complesse o grandi tabelle interne tra programmi richiamati con `SUBMIT ... AND RETURN` o `CALL TRANSACTION` all'interno della stessa finestra applicativa.",
      whyDeprecated: "Accoppia i programmi in modo implicito creando dipendenze invisibili. In architetture moderne si preferisce passare i dati tramite interfacce esplicite, classi singleton o tabelle di staging.",
      gotchas: "Se il tipo o i nomi delle variabili esportate e importate non coincidono esattamente, `IMPORT` può fallire silenziosamente o restituire `sy-subrc = 4` lasciando i dati non inizializzati.",
      systemFields: ["sy-subrc"],
      exampleCode: `* Nel Programma 1:
EXPORT orders = lt_orders TO MEMORY ID 'Z_PENDING_ORDERS'.
SUBMIT z_report_2 AND RETURN.

* Nel Programma 2 (z_report_2):
DATA lt_imported_orders TYPE TABLE OF vbak.
IMPORT orders = lt_imported_orders FROM MEMORY ID 'Z_PENDING_ORDERS'.
FREE MEMORY ID 'Z_PENDING_ORDERS'. " Pulizia fondamentale`,
      tags: ["export to memory", "import from memory", "abap memory", "cluster", "submit"]
    },
    {
      id: "export-import-database",
      category: "MEMORY_PARAM",
      name: "EXPORT TO DATABASE indx(ar) (Cluster su Database)",
      status: "deprecated",
      statusBadge: "[DEPRECATO MA SUPPORTATO]",
      syntax: "EXPORT tab = lt_data TO DATABASE indx(xy) ID 'KEY_NAME'.\nIMPORT tab = lt_data FROM DATABASE indx(xy) ID 'KEY_NAME'.",
      shortText: "Comprime e serializza strutture dati complesse all'interno delle tabelle cluster di sistema (INDX, AINDX).",
      semantic: "Il kernel ABAP converte la variabile in un flusso di byte compresso e lo salva nei campi BLOB/VARBINARY della tabella INDX del database, identificato dall'area a 2 caratteri (RelID) e dalla chiave ID.",
      whyDeprecated: "I dati salvati in formato cluster INDX non possono essere letti da nessun altro strumento esterno (né da SAP HANA Studio, né da viste CDS, né da Python/PowerBI) poiché il formato di compressione è proprietario del kernel ABAP.",
      modernEquivalent: "Memorizzare dati strutturati in tabelle trasparenti normalizzate o in campi testo JSON/XML.",
      gotchas: "Non è conforme ai principi di SAP S/4HANA Clean Core.",
      systemFields: ["sy-subrc"],
      exampleCode: `* Salvataggio persistente nel database INDX:
EXPORT report_cache = lt_big_data TO DATABASE indx(zc) ID 'DAILY_20261125'.`,
      tags: ["export to database", "indx", "cluster", "compressione", "deprecato"]
    },

    /* ==========================================================================
       13. GESTIONE ERRORI, ECCEZIONI & MESSAGGISTICA
       ========================================================================== */
    {
      id: "try-catch-cleanup",
      category: "ERROR_MESSAGE",
      name: "TRY ... CATCH ... CLEANUP (Eccezioni ad Oggetti)",
      status: "modern",
      statusBadge: "[MODERNO / FONDAMENTALE]",
      syntax: "TRY.\n    \" Codice a rischio eccezione\n  CATCH cx_root INTO DATA(lx_error).\n    \" Gestione errore\n  CLEANUP.\n    \" Eseguito solo se l'eccezione viene propagata verso l'alto\nENDTRY.",
      shortText: "Struttura moderna e robusta per intercettare e gestire gli errori a runtime tramite gerarchie di classi cx_*.",
      semantic: "Se all'interno del blocco `TRY` si verifica un errore, il runtime interrompe il flusso e cerca il primo blocco `CATCH` compatibile con la classe dell'eccezione. L'oggetto catturato contiene il testo dell'errore (`lx_error->get_text( )`). Il blocco facoltativo `CLEANUP` viene eseguito se l'eccezione non viene gestita localmente ma rilanciata verso il chiamante, garantendo il rilascio delle risorse.",
      gotchas: "Catturare `cx_root` (la radice di tutte le eccezioni) può mascherare errori di sistema gravi; catturare sempre le classi più specifiche possibili (es. `cx_sy_zerodivide`, `cx_sy_open_sql_error`).",
      systemFields: ["Nessuno"],
      exampleCode: `TRY.
    DATA(lv_res) = 100 / iv_divisor.
  CATCH cx_sy_zerodivide INTO DATA(lx_zero).
    DATA(lv_msg) = lx_zero->get_text( ).
    " Gestione divisione per zero sicura senza dump!
  CATCH cx_root INTO DATA(lx_unexpected).
    " Errore generico imprevisto
ENDTRY.`,
      tags: ["try", "catch", "cleanup", "cx_root", "eccezioni", "modern"]
    },
    {
      id: "message-statement",
      category: "ERROR_MESSAGE",
      name: "MESSAGE (Visualizzazione & Cattura Messaggi)",
      status: "modern",
      statusBadge: "[MODERNO / STANDARD]",
      syntax: "MESSAGE e001(zmsg) WITH p1 p2.\nMESSAGE 'Errore generico' TYPE 'E' DISPLAY LIKE 'I'.\nMESSAGE e002(zmsg) INTO DATA(lv_text).",
      shortText: "Invia notifiche, errori o warning all'utente basandosi sui messaggi definiti nella transazione SE91.",
      semantic: "Il tipo di messaggio controlla il flusso applicativo: 'S' (Success/Status in basso a video), 'I' (Information popup), 'W' (Warning bloccante in dynpro fino a invio), 'E' (Error bloccante obbliga reinserimento dati), 'A' (Abort termina la transazione corrente), 'X' (Short dump immediato `MESSAGE_TYPE_X`).",
      gotchas: "L'uso della clausola `INTO DATA(lv_text)` NON invia alcun messaggio a video, ma si limita a formattare e restituire il testo corrispondente nella variabile, impostando anche `sy-msgid`, `sy-msgno`, `sy-msgty`, `sy-msgv1`.",
      systemFields: ["sy-msgid", "sy-msgno", "sy-msgty", "sy-msgv1", "sy-msgv2", "sy-msgv3", "sy-msgv4"],
      exampleCode: `* 1. Errore bloccante da classe messaggi SE91:
MESSAGE e105(zsales) WITH ls_order-vbeln 'NON TROVATO'.

* 2. Cattura sicura del testo per log o API REST:
MESSAGE e105(zsales) WITH ls_order-vbeln 'NON TROVATO' INTO DATA(lv_err_msg).
" lv_err_msg contiene la stringa espansa senza interrompere il programma`,
      tags: ["message", "se91", "sy-msgid", "sy-msgno", "error", "warning", "display like"]
    }
  ]
};
