/**
 * ABAP Data Dictionary Wiki — Main Application Logic
 * Supporto per navigazione ad albero a 3 livelli (Modulo -> Tabella -> Campo)
 * e Pagine Dettagliate complete per ogni singola colonna.
 */

(function () {
  'use strict';

  // Application State
  const state = {
    dictionary: null,
    activeTable: 'VBRK',
    activeField: null, // If set, displays the dedicated field page
    searchQuery: '',
    expandedModules: new Set(['SD', 'MM', 'FI', 'S4']),
    expandedTables: new Set(['VBRK']),
    theme: localStorage.getItem('abap-wiki-theme') || 'dark'
  };

  // DOM Elements
  const el = {
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    themeLabel: document.getElementById('theme-label'),
    globalSearch: document.getElementById('global-search'),
    treeContainer: document.getElementById('tree-container'),
    emptyState: document.getElementById('empty-state'),
    tableDetailContainer: document.getElementById('table-detail-container'),
    tableCountBadge: document.getElementById('table-count-badge'),
    btnExpandAll: document.getElementById('btn-expand-all'),
    btnCollapseAll: document.getElementById('btn-collapse-all'),
    btnImportModal: document.getElementById('btn-import-modal'),
    modalImport: document.getElementById('modal-import'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnCancelModal: document.getElementById('btn-cancel-modal'),
    btnConfirmImport: document.getElementById('btn-confirm-import'),
    btnExportJson: document.getElementById('btn-export-json'),
    importJsonText: document.getElementById('import-json-text')
  };

  /**
   * Initialize Theme
   */
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeUI();

    el.themeToggle.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('abap-wiki-theme', state.theme);
      updateThemeUI();
    });
  }

  function updateThemeUI() {
    if (state.theme === 'dark') {
      el.themeIcon.textContent = '●';
      el.themeLabel.textContent = 'Dark';
    } else {
      el.themeIcon.textContent = '○';
      el.themeLabel.textContent = 'Light';
    }
  }

  /**
   * Load Data
   */
  function initData() {
    let baseData = null;

    if (window.ABAP_DICTIONARY) {
      baseData = window.ABAP_DICTIONARY;
    }

    // Merge custom user-imported tables from localStorage
    const customTables = JSON.parse(localStorage.getItem('abap-custom-tables') || '[]');
    if (baseData && customTables.length > 0) {
      customTables.forEach(customTable => {
        const existingIdx = baseData.tables.findIndex(t => t.tableName === customTable.tableName);
        if (existingIdx >= 0) {
          baseData.tables[existingIdx] = customTable;
        } else {
          baseData.tables.push(customTable);
        }
      });
    }

    state.dictionary = baseData;
    updateCounts();
    renderTree();

    // Default: select VBRK
    if (state.dictionary && state.dictionary.tables.length > 0) {
      selectTable('VBRK');
    }
  }

  function updateCounts() {
    if (!state.dictionary) return;
    const total = state.dictionary.tables.length;
    let totalFields = 0;
    state.dictionary.tables.forEach(t => {
      if (t.fields) totalFields += t.fields.length;
    });
    el.tableCountBadge.textContent = `${total} Tabelle (${totalFields} Campi)`;
  }

  /**
   * Render Hierarchical Tree Navigation (Level 1: Module -> Level 2: Table -> Level 3: Field)
   */
  function renderTree() {
    if (!state.dictionary) return;

    const q = state.searchQuery.toLowerCase().trim();
    let filteredTables = state.dictionary.tables;

    // Group tables by module
    const moduleMap = {};
    state.dictionary.modules.forEach(m => {
      moduleMap[m.id] = { ...m, tables: [] };
    });

    if (!moduleMap['CUSTOM']) {
      moduleMap['CUSTOM'] = { id: 'CUSTOM', name: 'Tabelle Personalizzate (Z*)', tables: [] };
    }

    filteredTables.forEach(table => {
      const modId = table.module || 'CUSTOM';
      if (!moduleMap[modId]) {
        moduleMap[modId] = { id: modId, name: modId, tables: [] };
      }

      if (!q) {
        moduleMap[modId].tables.push(table);
      } else {
        const matchTable = table.tableName.toLowerCase().includes(q) ||
                           (table.shortText && table.shortText.toLowerCase().includes(q));
        const matchFields = table.fields && table.fields.some(f => 
          f.fieldname.toLowerCase().includes(q) ||
          (f.shortText && f.shortText.toLowerCase().includes(q)) ||
          (f.germanName && f.germanName.toLowerCase().includes(q)) ||
          (f.dataElement && f.dataElement.name.toLowerCase().includes(q)) ||
          (f.businessMeaning && f.businessMeaning.toLowerCase().includes(q)) ||
          (f.examples && f.examples.some(ex => ex.code.toLowerCase().includes(q) || ex.desc.toLowerCase().includes(q)))
        );

        if (matchTable || matchFields) {
          moduleMap[modId].tables.push(table);
          // Auto-expand this module and table during search
          state.expandedModules.add(modId);
          state.expandedTables.add(table.tableName);
        }
      }
    });

    el.treeContainer.innerHTML = '';

    Object.values(moduleMap).forEach(mod => {
      if (mod.tables.length === 0) return;

      const isModExpanded = state.expandedModules.has(mod.id);

      const modWrapper = document.createElement('div');
      modWrapper.className = 'tree-module';

      const modHeader = document.createElement('div');
      modHeader.className = 'tree-module-header';
      modHeader.innerHTML = `
        <span class="tree-arrow ${isModExpanded ? 'expanded' : ''}">▶</span>
        <span><strong>${escapeHtml(mod.id)}</strong> — ${escapeHtml(mod.name)}</span>
        <span class="field-count">(${mod.tables.length})</span>
      `;

      modHeader.addEventListener('click', () => {
        if (state.expandedModules.has(mod.id)) {
          state.expandedModules.delete(mod.id);
        } else {
          state.expandedModules.add(mod.id);
        }
        renderTree();
      });

      modWrapper.appendChild(modHeader);

      if (isModExpanded) {
        const tableList = document.createElement('div');
        tableList.className = 'tree-table-list';

        mod.tables.forEach(table => {
          const isTableExpanded = state.expandedTables.has(table.tableName);
          const isTableActive = (state.activeTable === table.tableName && !state.activeField);

          const tableNode = document.createElement('div');
          tableNode.className = 'tree-table-node';

          const tableRow = document.createElement('div');
          tableRow.className = `tree-table-row ${isTableActive ? 'active' : ''}`;
          tableRow.innerHTML = `
            <div class="table-row-left">
              <span class="tree-arrow ${isTableExpanded ? 'expanded' : ''}" data-toggle-table="${escapeHtml(table.tableName)}">▶</span>
              <span class="table-name-mono">${escapeHtml(table.tableName)}</span>
            </div>
            <span class="field-count">${table.fields ? table.fields.length : 0}</span>
          `;

          tableRow.addEventListener('click', (e) => {
            // If click is on arrow, just toggle fields expansion
            if (e.target.dataset.toggleTable) {
              if (state.expandedTables.has(table.tableName)) {
                state.expandedTables.delete(table.tableName);
              } else {
                state.expandedTables.add(table.tableName);
              }
              renderTree();
              return;
            }

            // Normal click: select table overview and ensure expanded
            state.expandedTables.add(table.tableName);
            selectTable(table.tableName);
          });

          tableNode.appendChild(tableRow);

          // Level 3: Fields / Columns list
          if (isTableExpanded && table.fields && table.fields.length > 0) {
            const fieldList = document.createElement('div');
            fieldList.className = 'tree-field-list';

            table.fields.forEach(field => {
              const isFieldActive = (state.activeTable === table.tableName && state.activeField === field.fieldname);
              const domType = field.dataElement && field.dataElement.domain ? field.dataElement.domain.dataType : '';

              // Filter field if active search
              if (q) {
                const matchFld = field.fieldname.toLowerCase().includes(q) ||
                                 (field.shortText && field.shortText.toLowerCase().includes(q)) ||
                                 (field.examples && field.examples.some(ex => ex.code.toLowerCase().includes(q) || ex.desc.toLowerCase().includes(q)));
                const matchTbl = table.tableName.toLowerCase().includes(q);
                if (!matchFld && !matchTbl) return;
              }

              const fieldItem = document.createElement('div');
              fieldItem.className = `tree-field-item ${isFieldActive ? 'active' : ''}`;
              fieldItem.innerHTML = `
                <div class="field-item-name">
                  <span>${escapeHtml(field.fieldname)}</span>
                  ${field.isKey ? '<span class="badge-key">KEY</span>' : ''}
                </div>
                <span class="field-type-dim">${escapeHtml(domType)}</span>
              `;

              fieldItem.addEventListener('click', (e) => {
                e.stopPropagation();
                selectField(table.tableName, field.fieldname);
              });

              fieldList.appendChild(fieldItem);
            });

            tableNode.appendChild(fieldList);
          }

          tableList.appendChild(tableNode);
        });

        modWrapper.appendChild(tableList);
      }

      el.treeContainer.appendChild(modWrapper);
    });
  }

  /**
   * Select & Display Table Overview
   */
  function selectTable(tableName) {
    if (!state.dictionary) return;
    const table = state.dictionary.tables.find(t => t.tableName === tableName);
    if (!table) return;

    state.activeTable = tableName;
    state.activeField = null; // show table overview
    state.expandedTables.add(tableName);
    renderTree();
    renderTableDetail(table);

    const scrollArea = document.querySelector('.main-content');
    if (scrollArea) scrollArea.scrollTop = 0;
  }

  /**
   * Select & Display Dedicated Complete Field Page (100% Info)
   */
  function selectField(tableName, fieldname) {
    if (!state.dictionary) return;
    const table = state.dictionary.tables.find(t => t.tableName === tableName);
    if (!table) return;
    const field = table.fields.find(f => f.fieldname === fieldname);
    if (!field) return;

    state.activeTable = tableName;
    state.activeField = fieldname;
    state.expandedTables.add(tableName);
    renderTree();
    renderFieldDetail(table, field);

    const scrollArea = document.querySelector('.main-content');
    if (scrollArea) scrollArea.scrollTop = 0;
  }

  /**
   * Render Dedicated Field Page (100% Info on Single Column)
   */
  function renderFieldDetail(table, field) {
    el.emptyState.style.display = 'none';
    el.tableDetailContainer.style.display = 'block';

    const elem = field.dataElement || {};
    const dom = elem.domain || {};
    const domType = dom.dataType ? `${dom.dataType}(${dom.length}${dom.decimals ? ',' + dom.decimals : ''})` : 'N/A';
    const isKey = field.isKey;

    let html = `
      <!-- Breadcrumb Bar -->
      <div class="breadcrumb-bar">
        <span class="breadcrumb-link" onclick="window.ABAP_APP.selectTable('${escapeHtml(table.tableName)}')">Modulo ${escapeHtml(table.module)}</span>
        <span>/</span>
        <span class="breadcrumb-link" onclick="window.ABAP_APP.selectTable('${escapeHtml(table.tableName)}')">Tabella ${escapeHtml(table.tableName)}</span>
        <span>/</span>
        <strong style="color: var(--text-primary);">${escapeHtml(field.fieldname)}</strong>
      </div>

      <!-- Field & Data Element Header -->
      <div class="field-page-header">
        <div class="field-page-title-row">
          <span class="field-page-title">Elemento Dati: ${escapeHtml(elem.name || field.fieldname)}</span>
          ${isKey ? '<span class="badge-key" style="font-size: 11px; padding: 2px 6px;">PRIMARY KEY</span>' : ''}
          <span class="badge-datatype">${escapeHtml(domType)}</span>
        </div>
        <p class="field-page-desc" style="font-size: 15px; color: var(--text-primary); margin-bottom: 4px;"><strong>${escapeHtml(elem.shortText || field.shortText || '')}</strong></p>
        <div style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono);">
          Tabella e Campo DB: <strong style="color: var(--accent);">${escapeHtml(table.tableName)}-${escapeHtml(field.fieldname)}</strong>
          ${field.germanName ? `&nbsp;|&nbsp; Tedesco: <em>${escapeHtml(field.germanName)}</em>` : ''}
        </div>
      </div>

      <!-- Quick ABAP Declaration Snippet -->
      <div class="snippet-box">
        <span class="snippet-code">DATA lv_${field.fieldname.toLowerCase()} TYPE ${table.tableName.toLowerCase()}-${field.fieldname.toLowerCase()}.</span>
        <button class="btn-copy" onclick="copySnippet('DATA lv_${field.fieldname.toLowerCase()} TYPE ${table.tableName.toLowerCase()}-${field.fieldname.toLowerCase()}.')">Copia Snippet</button>
      </div>

      <!-- 1. Gerarchia ad Albero DDIC -->
      <div class="section-title">1. Struttura Gerarchica ad Albero (DDIC)</div>
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-family: var(--font-mono); font-size: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <span>Tabella: <strong style="color: var(--accent);">${escapeHtml(table.tableName)}</strong></span>
        <span>→</span>
        <span>Colonna: <strong style="color: var(--accent);">${escapeHtml(field.fieldname)}</strong></span>
        <span>→</span>
        <span>Elemento Dati: <strong style="color: var(--text-primary);">${escapeHtml(elem.name || field.fieldname)}</strong></span>
        <span>→</span>
        <span>Dominio: <strong style="color: var(--text-primary);">${escapeHtml(dom.name || 'N/A')}</strong></span>
      </div>

      <!-- 2. Scheda Tecnica Completa SE11 -->
      <div class="section-title">2. Scheda Tecnica di Dizionario (Transazione SE11)</div>
      <table class="specs-table">
        <tbody>
          <tr>
            <td class="label-col">Tabella Database</td>
            <td class="val-col"><strong>${escapeHtml(table.tableName)}</strong> (${escapeHtml(table.shortText || '')})</td>
          </tr>
          <tr>
            <td class="label-col">Nome Campo / Colonna</td>
            <td class="val-col"><strong>${escapeHtml(field.fieldname)}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Etimologia Tedesca</td>
            <td class="val-col"><em>${escapeHtml(field.germanName || 'N/A')}</em></td>
          </tr>
          <tr>
            <td class="label-col">Posizione nel Record</td>
            <td class="val-col">#${field.position || '—'}</td>
          </tr>
          <tr>
            <td class="label-col">Chiave Primaria</td>
            <td class="val-col">${isKey ? '<strong style="color: var(--key-badge);">SÌ (Primary Key componente della chiave univoca)</strong>' : 'No'}</td>
          </tr>
          <tr>
            <td class="label-col">Elemento Dati (Data Element)</td>
            <td class="val-col"><span class="badge-element">${escapeHtml(elem.name || field.fieldname)}</span> — ${escapeHtml(elem.shortText || '')}</td>
          </tr>
          <tr>
            <td class="label-col">Dominio Tecnico</td>
            <td class="val-col"><strong>${escapeHtml(dom.name || 'N/A')}</strong> — ${escapeHtml(dom.shortText || '')}</td>
          </tr>
          <tr>
            <td class="label-col">Tipo Dati Tecnico</td>
            <td class="val-col"><span class="badge-datatype">${escapeHtml(dom.dataType || 'CHAR')}</span></td>
          </tr>
          <tr>
            <td class="label-col">Lunghezza Caratteri</td>
            <td class="val-col">${dom.length || '—'} caratteri</td>
          </tr>
          <tr>
            <td class="label-col">Decimali</td>
            <td class="val-col">${dom.decimals !== undefined ? dom.decimals : 0}</td>
          </tr>
          <tr>
            <td class="label-col">Formato Memoria DB</td>
            <td class="val-col">${getInternalFormatDesc(dom.dataType, dom.length)}</td>
          </tr>
        </tbody>
      </table>

      <!-- 3. Significato di Business & Processo -->
      <div class="section-title">3. Ruolo di Business & Processo Aziendale</div>
      <div style="background: var(--bg-secondary); border-left: 3px solid var(--accent); padding: 12px 16px; border-radius: 0 4px 4px 0; margin-bottom: 24px; font-size: 13px; line-height: 1.6;">
        <p><strong>Cosa rappresenta:</strong> ${escapeHtml(field.businessMeaning || field.shortText || '')}</p>
        <p style="margin-top: 8px; color: var(--text-secondary);">
          Nel contesto della tabella <strong>${escapeHtml(table.tableName)}</strong>, questo campo viene valorizzato automaticamente dalle transazioni standard di SAP (es. salvataggio ordine, creazione fattura, registrazione prima nota) oppure attraverso programmi ABAP personalizzati.
        </p>
      </div>

      <!-- 4. Valori Ammessi ed Esempi Reali di Business -->
      <div class="section-title">4. Valori Ammessi ed Esempi Concreti di Business</div>
    `;

    if (field.examples && field.examples.length > 0) {
      html += `
        <table class="examples-table">
          <thead>
            <tr>
              <th style="width: 120px;">Valore / Codice</th>
              <th>Descrizione del Significato</th>
              <th>Contesto Operativo Reale</th>
            </tr>
          </thead>
          <tbody>
      `;
      field.examples.forEach(ex => {
        html += `
          <tr>
            <td><strong style="color: var(--accent); font-family: var(--font-mono); font-size: 13px;">${escapeHtml(ex.code)}</strong></td>
            <td><strong>${escapeHtml(ex.desc)}</strong></td>
            <td style="color: var(--text-secondary); font-size: 11px;">Standard SAP / Sistema di Produzione</td>
          </tr>
        `;
      });
      html += `
          </tbody>
        </table>
      `;
    } else {
      html += `
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 4px; padding: 10px 14px; margin-bottom: 24px; font-size: 12px; color: var(--text-muted);">
          Questo campo memorizza valori dinamici di business (come date, numeri di documento, descrizioni testuali o codici anagrafici) conformi al tipo tecnico <code>${escapeHtml(domType)}</code>.
        </div>
      `;
    }

    // 5. Guida Pratica ABAP per il campo
    html += `
      <div class="section-title">5. Guida Pratica ABAP per questo Campo</div>
      <div style="background: var(--bg-code); border: 1px solid var(--border-color); border-radius: 6px; padding: 14px 18px; font-family: var(--font-mono); font-size: 12px; line-height: 1.6; margin-bottom: 24px;">
        <span style="color: var(--text-muted);">" 1. Dichiarazione variabile locale agganciata al campo</span><br>
        <span style="color: var(--accent); font-weight: 600;">DATA</span> lv_${field.fieldname.toLowerCase()} <span style="color: var(--accent); font-weight: 600;">TYPE</span> ${table.tableName.toLowerCase()}-${field.fieldname.toLowerCase()}.<br><br>

        <span style="color: var(--text-muted);">" 2. Selezione da database con lettura di questo campo</span><br>
        <span style="color: var(--accent); font-weight: 600;">SELECT SINGLE</span> ${field.fieldname.toLowerCase()}<br>
        &nbsp;&nbsp;<span style="color: var(--accent); font-weight: 600;">FROM</span> ${table.tableName.toLowerCase()}<br>
        &nbsp;&nbsp;<span style="color: var(--accent); font-weight: 600;">WHERE</span> mandt = @sy-mandt<br>
        &nbsp;&nbsp;<span style="color: var(--accent); font-weight: 600;">INTO</span> @lv_${field.fieldname.toLowerCase()}.<br><br>

        <span style="color: var(--text-muted);">" 3. Utilizzo nella clausola WHERE come filtro</span><br>
        <span style="color: var(--accent); font-weight: 600;">SELECT</span> * <span style="color: var(--accent); font-weight: 600;">FROM</span> ${table.tableName.toLowerCase()}<br>
        &nbsp;&nbsp;<span style="color: var(--accent); font-weight: 600;">WHERE</span> ${field.fieldname.toLowerCase()} = @lv_${field.fieldname.toLowerCase()}<br>
        &nbsp;&nbsp;<span style="color: var(--accent); font-weight: 600;">INTO TABLE</span> @<span style="color: var(--accent); font-weight: 600;">DATA</span>(lt_risultati).
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color);">
        <button class="btn" onclick="window.ABAP_APP.selectTable('${escapeHtml(table.tableName)}')">
          ← Torna alla Panoramica della Tabella ${escapeHtml(table.tableName)}
        </button>
      </div>
    `;

    el.tableDetailContainer.innerHTML = html;
  }

  function getInternalFormatDesc(dataType, length) {
    switch (dataType) {
      case 'DATS': return 'Data di 8 cifre in formato AAAAMMGG (es. 20261124)';
      case 'CLNT': return 'Codice mandante a 3 cifre numeriche (es. 100)';
      case 'CHAR': return `Stringa alfanumerica a lunghezza fissa (${length} caratteri)`;
      case 'NUMC': return `Sequenza di cifre numeriche con padding di zeri iniziali (${length} cifre)`;
      case 'CURR': return 'Numero decimale a virgola fissa per importi valutari (memorizzato in centesimi)';
      case 'CUKY': return 'Codice ISO divisa a 5 caratteri (es. EUR, USD, CHF)';
      case 'UNIT': return 'Unità di misura tecnica/commerciale (es. ST/PZ, KG, M)';
      case 'QUAN': return 'Quantità numerica con 3 cifre decimali';
      default: return `${dataType} (${length} caratteri)`;
    }
  }

  /**
   * Render Table Detail Overview in Main Pane
   */
  function renderTableDetail(table) {
    el.emptyState.style.display = 'none';
    el.tableDetailContainer.style.display = 'block';

    const keys = table.mainKey ? table.mainKey.join(', ') : 'MANDT';

    let html = `
      <div class="breadcrumb-bar">
        <span class="breadcrumb-link" onclick="window.ABAP_APP.selectModule('${escapeHtml(table.module)}')">Modulo ${escapeHtml(table.module)}</span>
        <span>/</span>
        <strong style="color: var(--text-primary);">Tabella ${escapeHtml(table.tableName)}</strong>
      </div>

      <div class="table-header-box">
        <div class="table-title-row">
          <div class="table-title-left">
            <span class="table-title">${escapeHtml(table.tableName)}</span>
            <span class="badge-module">${escapeHtml(table.module || 'DDIC')}</span>
            <span class="badge-tag">${escapeHtml(table.tableCategory || 'TRANSP')}</span>
            <span class="badge-tag">Classe: ${escapeHtml(table.deliveryClass || 'A')}</span>
          </div>
        </div>
        <p class="table-desc">${escapeHtml(table.shortText || '')}</p>
        
        <div class="table-meta-list">
          <div class="table-meta-item">Chiave Primaria: <strong>${escapeHtml(keys)}</strong></div>
          <div class="table-meta-item">Totale Colonne: <strong>${table.fields ? table.fields.length : 0}</strong></div>
        </div>

        ${table.germanEtymology ? `
          <div class="etymology-box">
            <span>Etimologia Tedesca:</span> <em>${escapeHtml(table.germanEtymology)}</em><br>
            <span style="font-size: 12px; color: var(--text-muted);">${escapeHtml(table.description || '')}</span>
          </div>
        ` : ''}
      </div>

      <!-- Quick ABAP Snippets -->
      <div class="snippet-box">
        <span class="snippet-code">DATA ls_${table.tableName.toLowerCase()} TYPE ${table.tableName.toLowerCase()}. " Singola riga (Struttura)</span>
        <button class="btn-copy" onclick="copySnippet('DATA ls_${table.tableName.toLowerCase()} TYPE ${table.tableName.toLowerCase()}.')">Copia</button>
      </div>

      <div class="snippet-box" style="margin-top: -8px;">
        <span class="snippet-code">DATA lt_${table.tableName.toLowerCase()} TYPE TABLE OF ${table.tableName.toLowerCase()}. " Tante righe (Tabella Interna)</span>
        <button class="btn-copy" onclick="copySnippet('DATA lt_${table.tableName.toLowerCase()} TYPE TABLE OF ${table.tableName.toLowerCase()}.')">Copia</button>
      </div>
    `;

    // Relationships
    if (table.relationships && table.relationships.length > 0) {
      html += `
        <div class="section-title">Relazioni con altre Tabelle (Foreign Keys / Join)</div>
        <div class="relationships-list">
      `;
      table.relationships.forEach(rel => {
        html += `
          <div class="relationship-item">
            <span class="rel-target" onclick="window.ABAP_APP.selectTable('${escapeHtml(rel.targetTable)}')">${escapeHtml(rel.targetTable)}</span>
            <span class="rel-fk">[${escapeHtml(rel.foreignKey)}]</span>
            <span style="color: var(--text-secondary);">${escapeHtml(rel.description)}</span>
          </div>
        `;
      });
      html += `</div>`;
    }

    // Fields Table with Direct Links to Full Field Pages
    html += `
      <!-- Fields Table -->
      <div class="section-title">
        <span>Colonne della Tabella</span>
        <span style="font-size: 11px; text-transform: none; color: var(--text-muted); font-weight: normal;">Clicca su un elemento o tipo per aprire la scheda tecnica completa</span>
      </div>
      <table class="fields-tree-table">
        <thead>
          <tr>
            <th style="width: 40px;">Pos</th>
            <th>Campo</th>
            <th>Descrizione</th>
            <th>Elemento Dati</th>
            <th>Dominio</th>
            <th>Tipo & Lunghezza</th>
          </tr>
        </thead>
        <tbody>
    `;

    if (table.fields && table.fields.length > 0) {
      table.fields.forEach(field => {
        const isKey = field.isKey;
        const elemName = field.dataElement ? field.dataElement.name : '-';
        const dom = field.dataElement && field.dataElement.domain ? field.dataElement.domain : null;
        const domType = dom ? `${dom.dataType}(${dom.length}${dom.decimals ? ',' + dom.decimals : ''})` : '-';
        const domName = dom ? dom.name : '-';

        html += `
          <tr class="field-row" onclick="window.ABAP_APP.selectField('${escapeHtml(table.tableName)}', '${escapeHtml(field.fieldname)}')">
            <td style="font-family: var(--font-mono); color: var(--text-muted);">${field.position || '-'}</td>
            <td>
              <span class="table-name-mono" style="color: var(--accent);">${escapeHtml(field.fieldname)}</span>
              ${isKey ? '<span class="badge-key">KEY</span>' : ''}
              ${field.germanName ? `<br><small style="color: var(--text-muted); font-size: 10px;">${escapeHtml(field.germanName)}</small>` : ''}
            </td>
            <td>
              <div style="color: var(--text-primary); font-weight: 500;">${escapeHtml(field.shortText || '')}</div>
              ${field.examples && field.examples.length > 0 ? `<small style="color: var(--text-muted); font-size: 11px;">Es: ${field.examples.slice(0, 3).map(e => e.code + ' (' + e.desc.split('(')[0].trim() + ')').join(', ')}...</small>` : ''}
            </td>
            <td><span class="badge-element" title="Clicca per la descrizione del Data Element">${escapeHtml(elemName)}</span></td>
            <td><span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">${escapeHtml(domName)}</span></td>
            <td><span class="badge-datatype" title="Clicca per i dettagli del tipo">${escapeHtml(domType)}</span></td>
          </tr>
        `;
      });
    } else {
      html += `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">Nessuna colonna registrata.</td></tr>`;
    }

    html += `
        </tbody>
      </table>

      <!-- Esempio Query ABAP Reale -->
      <div class="section-title">Esempio Pratico Query ABAP (Modern SQL)</div>
      <div style="background: var(--bg-code); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px 16px; font-family: var(--font-mono); font-size: 12px; margin-bottom: 24px; color: var(--text-primary); line-height: 1.5; overflow-x: auto;">
        <span style="color: var(--text-muted);">* Selezione moderna da ${table.tableName} con dichiarazione inline</span><br>
        <span style="color: var(--accent); font-weight: 600;">SELECT</span> ${table.fields.slice(0, 5).map(f => f.fieldname.toLowerCase()).join(', ')}<br>
        &nbsp;&nbsp;<span style="color: var(--accent); font-weight: 600;">FROM</span> <span style="font-weight: 600;">${table.tableName.toLowerCase()}</span><br>
        &nbsp;&nbsp;<span style="color: var(--accent); font-weight: 600;">WHERE</span> mandt = @sy-mandt<br>
        &nbsp;&nbsp;<span style="color: var(--accent); font-weight: 600;">INTO TABLE</span> @<span style="color: var(--accent); font-weight: 600;">DATA</span>(lt_${table.tableName.toLowerCase()})<br>
        &nbsp;&nbsp;<span style="color: var(--accent); font-weight: 600;">UP TO</span> 50 <span style="color: var(--accent); font-weight: 600;">ROWS</span>.<br><br>
        <span style="color: var(--accent); font-weight: 600;">IF</span> sy-subrc = 0.<br>
        &nbsp;&nbsp;<span style="color: var(--accent); font-weight: 600;">LOOP AT</span> lt_${table.tableName.toLowerCase()} <span style="color: var(--accent); font-weight: 600;">ASSIGNING FIELD-SYMBOL</span>(&lt;ls_row&gt;).<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span style="color: var(--text-muted);">" Elaborazione record...</span><br>
        &nbsp;&nbsp;<span style="color: var(--accent); font-weight: 600;">ENDLOOP</span>.<br>
        <span style="color: var(--accent); font-weight: 600;">ENDIF</span>.
      </div>
    `;

    el.tableDetailContainer.innerHTML = html;
  }

  /**
   * Global Copy Snippet to Clipboard
   */
  window.copySnippet = function (text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copiato: ' + text);
    }).catch(() => {
      showToast('Copiato: ' + text);
    });
  };

  /**
   * Minimal Toast Notification
   */
  function showToast(message) {
    let toast = document.getElementById('wiki-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'wiki-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: var(--accent);
        color: #ffffff;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 12px;
        font-family: var(--font-mono);
        z-index: 1000;
        box-shadow: var(--shadow-md);
        transition: opacity 0.2s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.style.opacity = '0';
    }, 2200);
  }

  /**
   * Global Escape HTML
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Event Listeners
   */
  function initEvents() {
    let searchDebounce;
    el.globalSearch.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        state.searchQuery = e.target.value;
        renderTree();
      }, 120);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== el.globalSearch && document.activeElement !== el.importJsonText) {
        e.preventDefault();
        el.globalSearch.focus();
        el.globalSearch.select();
      }
    });

    el.btnExpandAll.addEventListener('click', () => {
      if (state.dictionary) {
        state.dictionary.modules.forEach(m => state.expandedModules.add(m.id));
        state.dictionary.tables.forEach(t => state.expandedTables.add(t.tableName));
        renderTree();
      }
    });

    el.btnCollapseAll.addEventListener('click', () => {
      state.expandedModules.clear();
      state.expandedTables.clear();
      renderTree();
    });

    el.btnImportModal.addEventListener('click', () => {
      el.modalImport.classList.add('active');
    });

    el.btnCloseModal.addEventListener('click', () => {
      el.modalImport.classList.remove('active');
    });

    el.btnCancelModal.addEventListener('click', () => {
      el.modalImport.classList.remove('active');
    });

    el.btnConfirmImport.addEventListener('click', handleImport);
    el.btnExportJson.addEventListener('click', handleExport);
  }

  function handleImport() {
    const raw = el.importJsonText.value.trim();
    if (!raw) {
      alert('Incolla del JSON valido prima di confermare.');
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const tablesToAdd = Array.isArray(parsed) ? parsed : (parsed.tables || [parsed]);
      const stored = JSON.parse(localStorage.getItem('abap-custom-tables') || '[]');

      tablesToAdd.forEach(newTable => {
        if (!newTable.tableName) return;
        newTable.tableName = newTable.tableName.toUpperCase();
        if (!newTable.module) newTable.module = 'CUSTOM';

        const existingIdx = stored.findIndex(t => t.tableName === newTable.tableName);
        if (existingIdx >= 0) {
          stored[existingIdx] = newTable;
        } else {
          stored.push(newTable);
        }

        const dictIdx = state.dictionary.tables.findIndex(t => t.tableName === newTable.tableName);
        if (dictIdx >= 0) {
          state.dictionary.tables[dictIdx] = newTable;
        } else {
          state.dictionary.tables.push(newTable);
        }
      });

      localStorage.setItem('abap-custom-tables', JSON.stringify(stored));
      el.modalImport.classList.remove('active');
      el.importJsonText.value = '';
      updateCounts();
      renderTree();
      selectTable(tablesToAdd[0].tableName);
      showToast(`Importate con successo ${tablesToAdd.length} tabelle!`);
    } catch (err) {
      alert('Errore nel formato JSON: ' + err.message);
    }
  }

  function handleExport() {
    if (!state.dictionary) return;
    const blob = new Blob([JSON.stringify(state.dictionary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abap_dictionary_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Public API
  window.ABAP_APP = {
    selectTable,
    selectField,
    selectModule: (modId) => {
      state.expandedModules.add(modId);
      renderTree();
    }
  };

  // Bootstrap
  initTheme();
  initEvents();
  initData();

})();
