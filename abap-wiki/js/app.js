/**
 * ABAP Data Dictionary Wiki - Main Application Logic
 */

(function () {
  'use strict';

  // Application State
  const state = {
    dictionary: null,
    activeTable: null,
    searchQuery: '',
    expandedModules: new Set(['SD', 'MM', 'FI', 'S4']),
    expandedFields: new Set(),
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
   * Load Data (Pre-bundled or Local Storage or Fetch)
   */
  function initData() {
    let baseData = null;

    if (window.ABAP_DICTIONARY) {
      baseData = window.ABAP_DICTIONARY;
    }

    // Merge any custom user-imported tables from localStorage
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

    // Auto-select first table (e.g. VBRK)
    if (state.dictionary && state.dictionary.tables.length > 0) {
      selectTable('VBRK');
    }
  }

  function updateCounts() {
    if (!state.dictionary) return;
    const total = state.dictionary.tables.length;
    el.tableCountBadge.textContent = `${total} Tabelle`;
  }

  /**
   * Render Hierarchical Tree Navigation
   */
  function renderTree() {
    if (!state.dictionary) return;

    const query = state.query ? state.query.toLowerCase().trim() : '';
    let filteredTables = state.dictionary.tables;

    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      filteredTables = state.dictionary.tables.filter(table => {
        const matchTable = table.tableName.toLowerCase().includes(q) ||
                           (table.shortText && table.shortText.toLowerCase().includes(q)) ||
                           (table.germanEtymology && table.germanEtymology.toLowerCase().includes(q));
        const matchFields = table.fields && table.fields.some(f => 
          f.fieldname.toLowerCase().includes(q) ||
          (f.shortText && f.shortText.toLowerCase().includes(q)) ||
          (f.germanName && f.germanName.toLowerCase().includes(q)) ||
          (f.dataElement && f.dataElement.name.toLowerCase().includes(q)) ||
          (f.dataElement && f.dataElement.domain && f.dataElement.domain.name.toLowerCase().includes(q)) ||
          (f.businessMeaning && f.businessMeaning.toLowerCase().includes(q)) ||
          (f.examples && f.examples.some(ex => ex.code.toLowerCase().includes(q) || ex.desc.toLowerCase().includes(q)))
        );
        return matchTable || matchFields;
      });
    }

    // Group tables by module
    const moduleMap = {};
    state.dictionary.modules.forEach(m => {
      moduleMap[m.id] = { ...m, tables: [] };
    });

    // Default container for orphan or custom tables
    if (!moduleMap['CUSTOM']) {
      moduleMap['CUSTOM'] = { id: 'CUSTOM', name: 'Tabelle Personalizzate (Z*)', tables: [] };
    }

    filteredTables.forEach(tbl => {
      const modId = tbl.module || 'CUSTOM';
      if (!moduleMap[modId]) {
        moduleMap[modId] = { id: modId, name: modId, tables: [] };
      }
      moduleMap[modId].tables.push(tbl);
    });

    el.treeContainer.innerHTML = '';

    Object.values(moduleMap).forEach(mod => {
      if (mod.tables.length === 0) return;

      const isExpanded = state.expandedModules.has(mod.id) || state.searchQuery.length > 0;

      const modWrapper = document.createElement('div');
      modWrapper.className = 'tree-module';

      const header = document.createElement('div');
      header.className = 'tree-module-header';
      header.innerHTML = `
        <span class="tree-arrow ${isExpanded ? 'expanded' : ''}">▶</span>
        <span>${escapeHtml(mod.id)} - ${escapeHtml(mod.name)}</span>
        <span class="field-count">(${mod.tables.length})</span>
      `;

      header.addEventListener('click', () => {
        if (state.expandedModules.has(mod.id)) {
          state.expandedModules.delete(mod.id);
        } else {
          state.expandedModules.add(mod.id);
        }
        renderTree();
      });

      modWrapper.appendChild(header);

      if (isExpanded) {
        const tableList = document.createElement('div');
        tableList.className = 'tree-table-list';

        mod.tables.forEach(table => {
          const item = document.createElement('div');
          item.className = `tree-table-item ${state.activeTable === table.tableName ? 'active' : ''}`;
          item.innerHTML = `
            <span class="table-name-mono">${escapeHtml(table.tableName)}</span>
            <span class="field-count">${table.fields ? table.fields.length : 0} col.</span>
          `;
          item.addEventListener('click', (e) => {
            e.stopPropagation();
            selectTable(table.tableName);
          });
          tableList.appendChild(item);
        });

        modWrapper.appendChild(tableList);
      }

      el.treeContainer.appendChild(modWrapper);
    });
  }

  /**
   * Select & Display a Table
   */
  function selectTable(tableName) {
    if (!state.dictionary) return;
    const table = state.dictionary.tables.find(t => t.tableName === tableName);
    if (!table) return;

    state.activeTable = tableName;
    state.expandedFields.clear(); // reset expanded field details
    renderTree();
    renderTableDetail(table);
  }

  /**
   * Render Table Detail in Main Pane
   */
  function renderTableDetail(table) {
    el.emptyState.style.display = 'none';
    el.tableDetailContainer.style.display = 'block';

    const keys = table.mainKey ? table.mainKey.join(', ') : 'N/A';

    let html = `
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
            <span>Etimologia Tedesca:</span> <em>${escapeHtml(table.germanEtymology)}</em>
          </div>
        ` : ''}
      </div>

      <!-- Quick ABAP Snippets -->
      <div class="snippet-box">
        <span class="snippet-code">DATA ls_${table.tableName.toLowerCase()} TYPE ${table.tableName.toLowerCase()}. " Singola riga (Struttura)</span>
        <button class="btn-copy" onclick="copySnippet('DATA ls_${table.tableName.toLowerCase()} TYPE ${table.tableName.toLowerCase()}.')">Copia</button>
      </div>

      <div class="snippet-box" style="margin-top: -16px;">
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

    // Fields Tree Grid
    html += `
      <div class="section-title">
        <span>Colonne della Tabella (Struttura ad Albero)</span>
        <span style="font-size: 11px; text-transform: none; color: var(--text-muted);">Clicca su una riga per esplorare Data Element e Dominio</span>
      </div>
      <table class="fields-tree-table">
        <thead>
          <tr>
            <th style="width: 40px;">Pos</th>
            <th>Campo / Colonna</th>
            <th>Descrizione</th>
            <th>Data Element</th>
            <th>Dominio</th>
            <th>Tipo & Lunghezza</th>
            <th style="text-align: right;">Snippet ABAP</th>
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
        const isExpanded = state.expandedFields.has(field.fieldname);

        html += `
          <tr class="field-row" onclick="window.ABAP_APP.toggleFieldDetail('${escapeHtml(field.fieldname)}')">
            <td style="font-family: var(--font-mono); color: var(--text-muted);">${field.position || '-'}</td>
            <td>
              <span class="table-name-mono" style="color: var(--accent);">${escapeHtml(field.fieldname)}</span>
              ${isKey ? '<span class="badge-key">KEY</span>' : ''}
            </td>
            <td>${escapeHtml(field.shortText || '')}</td>
            <td><span class="badge-element">${escapeHtml(elemName)}</span></td>
            <td><span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">${escapeHtml(domName)}</span></td>
            <td><span class="badge-datatype">${escapeHtml(domType)}</span></td>
            <td style="text-align: right;">
              <button class="btn-copy" onclick="event.stopPropagation(); copySnippet('DATA lv_${field.fieldname.toLowerCase()} TYPE ${table.tableName.toLowerCase()}-${field.fieldname.toLowerCase()}.')">
                TYPE ${table.tableName.toLowerCase()}-${field.fieldname.toLowerCase()}
              </button>
            </td>
          </tr>
        `;

        // Drilldown Row
        html += `
          <tr id="drawer-${escapeHtml(field.fieldname)}" style="display: ${isExpanded ? 'table-row' : 'none'};">
            <td colspan="7" style="padding: 0 10px 10px 10px;">
              <div class="field-detail-panel active">
                <div class="detail-tree">
                  <div class="detail-tree-branch">
                    <span class="tree-level-label">1. Colonna:</span>
                    <div class="tree-level-content">
                      <strong>${escapeHtml(field.fieldname)}</strong> — ${escapeHtml(field.shortText || '')}
                      ${field.germanName ? `<br><small style="color: var(--text-muted);">Tedesco: <em>${escapeHtml(field.germanName)}</em></small>` : ''}
                    </div>
                  </div>
                  <div class="detail-tree-branch">
                    <span class="tree-level-label">2. Data Element:</span>
                    <div class="tree-level-content">
                      <span class="badge-element">${escapeHtml(elemName)}</span> — ${escapeHtml(field.dataElement ? field.dataElement.shortText : '')}
                    </div>
                  </div>
                  <div class="detail-tree-branch">
                    <span class="tree-level-label">3. Dominio:</span>
                    <div class="tree-level-content">
                      <strong>${escapeHtml(domName)}</strong> [Tipo: <span class="badge-datatype">${escapeHtml(domType)}</span>] — ${escapeHtml(dom ? dom.shortText : '')}
                    </div>
                  </div>
                  ${field.businessMeaning ? `
                  <div class="detail-tree-branch">
                    <span class="tree-level-label">Significato:</span>
                    <div class="tree-level-content" style="color: var(--text-secondary);">
                      ${escapeHtml(field.businessMeaning)}
                    </div>
                  </div>
                  ` : ''}
                  ${field.examples && field.examples.length > 0 ? `
                  <div class="detail-tree-branch" style="margin-top: 4px;">
                    <span class="tree-level-label">Valori / Esempi:</span>
                    <div class="tree-level-content">
                      <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 4px; padding: 6px 10px; margin-top: 2px;">
                        ${field.examples.map(ex => `
                          <div style="padding: 2px 0; font-size: 11px; display: flex; gap: 8px;">
                            <strong style="color: var(--accent); font-family: var(--font-mono);">${escapeHtml(ex.code)}</strong>
                            <span style="color: var(--text-primary);">— ${escapeHtml(ex.desc)}</span>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                  ` : ''}
                  <div class="detail-tree-branch" style="margin-top: 6px;">
                    <span class="tree-level-label">Dichiarazione:</span>
                    <div class="tree-level-content" style="color: var(--accent);">
                      <code>DATA lv_${field.fieldname.toLowerCase()} TYPE ${table.tableName.toLowerCase()}-${field.fieldname.toLowerCase()}.</code>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        `;
      });
    } else {
      html += `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">Nessuna colonna registrata.</td></tr>`;
    }

    html += `
        </tbody>
      </table>

      <!-- Esempio Query ABAP Reale -->
      <div class="section-title">Esempio Query ABAP (Modern SQL)</div>
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
   * Toggle Field Drilldown Panel
   */
  function toggleFieldDetail(fieldname) {
    if (state.expandedFields.has(fieldname)) {
      state.expandedFields.delete(fieldname);
    } else {
      state.expandedFields.add(fieldname);
    }
    const drawer = document.getElementById(`drawer-${fieldname}`);
    if (drawer) {
      drawer.style.display = state.expandedFields.has(fieldname) ? 'table-row' : 'none';
    }
  }

  /**
   * Global Copy Snippet to Clipboard
   */
  window.copySnippet = function (text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copiato negli appunti: ' + text);
    }).catch(() => {
      // Fallback
      const input = document.createElement('textarea');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
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
        background-color: var(--text-primary);
        color: var(--bg-primary);
        padding: 8px 16px;
        border-radius: 6px;
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
    // Search with debounce
    let searchDebounce;
    el.globalSearch.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        state.searchQuery = e.target.value;
        renderTree();
      }, 150);
    });

    // Keyboard shortcut '/' to search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== el.globalSearch && document.activeElement !== el.importJsonText) {
        e.preventDefault();
        el.globalSearch.focus();
        el.globalSearch.select();
      }
    });

    // Expand / Collapse All
    el.btnExpandAll.addEventListener('click', () => {
      if (state.dictionary) {
        state.dictionary.modules.forEach(m => state.expandedModules.add(m.id));
        state.expandedModules.add('CUSTOM');
        renderTree();
      }
    });

    el.btnCollapseAll.addEventListener('click', () => {
      state.expandedModules.clear();
      renderTree();
    });

    // Import / Export Modal
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

  /**
   * Handle JSON Import
   */
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

  /**
   * Handle JSON Export
   */
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

  // Expose public methods for inline DOM handlers
  window.ABAP_APP = {
    selectTable,
    toggleFieldDetail
  };

  // Bootstrap
  initTheme();
  initEvents();
  initData();

})();
