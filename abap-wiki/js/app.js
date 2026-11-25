/**
 * ABAP Data Dictionary — Manuale Tecnico di Riferimento
 * Script di navigazione, lettura continua (unrolled manual) e ispezione DDIC
 */

(function () {
  'use strict';

  // State
  const state = {
    dictionary: window.ABAP_DICTIONARY || null,
    activeTable: 'VBRK',
    searchQuery: '',
    expandedModules: new Set(['SD', 'MM', 'FI', 'S4']),
    expandedTables: new Set(['VBRK']),
    theme: localStorage.getItem('abap-wiki-theme') || 'dark'
  };

  // DOM Elements
  const el = {
    searchInput: document.getElementById('search-input'),
    tocNav: document.getElementById('toc-nav'),
    manualContainer: document.getElementById('manual-container'),
    footerCount: document.getElementById('footer-count'),
    themeBtn: document.getElementById('theme-btn'),
    readingScroll: document.getElementById('reading-scroll'),
    inspectorModal: document.getElementById('inspector-modal'),
    modalBadge: document.getElementById('modal-badge'),
    modalTitle: document.getElementById('modal-title'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalBody: document.getElementById('modal-body')
  };

  /**
   * Theme Controller
   */
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeBtn();

    el.themeBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('abap-wiki-theme', state.theme);
      updateThemeBtn();
    });
  }

  function updateThemeBtn() {
    el.themeBtn.textContent = state.theme === 'dark' ? 'Tema: Dark' : 'Tema: Light';
  }

  /**
   * Initialize Data
   */
  function initData() {
    if (!state.dictionary || !state.dictionary.tables) return;

    el.footerCount.textContent = `${state.dictionary.tables.length} Tabelle DDIC`;
    renderTOC();
    renderManualChapter(state.activeTable);
  }

  /**
   * Inspector Modal Controller (Data Elements, Domains, Technical Types)
   */
  function openInspector(title, badgeText, contentHtml) {
    if (!el.inspectorModal) return;
    el.modalTitle.textContent = title;
    el.modalBadge.textContent = badgeText;
    el.modalBody.innerHTML = contentHtml;
    el.inspectorModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeInspector() {
    if (!el.inspectorModal) return;
    el.inspectorModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  /**
   * Inspect Data Element
   */
  function inspectDataElement(elemName) {
    if (!state.dictionary || !state.dictionary.tables) return;

    // Find all occurrences in all tables
    const whereUsed = [];
    let elemDefinition = null;

    state.dictionary.tables.forEach(table => {
      if (!table.fields) return;
      table.fields.forEach(field => {
        if (field.dataElement && field.dataElement.name === elemName) {
          whereUsed.push({
            table: table.tableName,
            module: table.module,
            field: field.fieldname,
            shortText: field.shortText,
            isKey: field.isKey
          });
          if (!elemDefinition) {
            elemDefinition = field.dataElement;
          }
        }
      });
    });

    const title = elemName;
    const dom = (elemDefinition && elemDefinition.domain) ? elemDefinition.domain : {};
    const domType = dom.dataType ? `${dom.dataType}(${dom.length}${dom.decimals ? ',' + dom.decimals : ''})` : 'N/A';
    const shortText = elemDefinition ? elemDefinition.shortText : 'Data Element ABAP';

    let html = `
      <div style="margin-bottom: 16px;">
        <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-title); margin-bottom: 4px;">
          ${escapeHtml(shortText)}
        </h3>
        <p style="color: var(--text-muted); font-size: 0.86rem;">
          Elemento di dati semantico del dizionario ABAP. Definisce il significato di business e il testo d'intestazione a video.
        </p>
      </div>

      <div class="inspector-section-title">Specifiche Tecniche & Dominio Sottostante</div>
      <table class="manual-spec-table" style="margin-top: 6px;">
        <tbody>
          <tr>
            <td class="spec-lbl">Dominio Tecnico</td>
            <td class="spec-val">
              ${dom.name ? `
                <span class="link-ddic" onclick="window.ABAP_MANUAL.inspectDomain('${escapeHtml(dom.name)}')">${escapeHtml(dom.name)}</span>
                <span style="color: var(--text-muted); font-size: 0.8rem;"> — ${escapeHtml(dom.shortText || '')}</span>
              ` : 'N/A'}
            </td>
          </tr>
          <tr>
            <td class="spec-lbl">Tipo e Lunghezza</td>
            <td class="spec-val">
              <span class="field-type-pill">${escapeHtml(domType)}</span>
              <span style="color: var(--text-muted); font-size: 0.8rem; margin-left: 6px;">(${getFormatNote(dom.dataType)})</span>
            </td>
          </tr>
          <tr>
            <td class="spec-lbl">Dichiarazione ABAP</td>
            <td class="spec-val">
              <code>${highlightABAP('DATA lv_' + elemName.toLowerCase() + ' TYPE ' + elemName.toLowerCase() + '.')}</code>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="inspector-section-title">Dove è Usato nel Dizionario (Where-Used List — ${whereUsed.length} occorrenze)</div>
      ${whereUsed.length > 0 ? `
        <table class="inspector-where-table">
          <thead>
            <tr>
              <th style="width: 100px;">Tabella</th>
              <th style="width: 120px;">Campo</th>
              <th>Descrizione Ruolo</th>
              <th style="width: 80px; text-align: right;">Azione</th>
            </tr>
          </thead>
          <tbody>
            ${whereUsed.map(item => `
              <tr>
                <td>
                  <span class="link-target" onclick="window.ABAP_MANUAL.selectTable('${escapeHtml(item.table)}')">${escapeHtml(item.table)}</span>
                  <span style="font-size: 10px; color: var(--text-muted);">(${escapeHtml(item.module)})</span>
                </td>
                <td>
                  <strong style="font-family: var(--font-mono); color: var(--text-title);">${escapeHtml(item.field)}</strong>
                  ${item.isKey ? '<span class="badge-key-tag" style="margin-left: 4px;">KEY</span>' : ''}
                </td>
                <td style="color: var(--text-main); font-size: 0.82rem;">${escapeHtml(item.shortText || '')}</td>
                <td style="text-align: right;">
                  <button class="btn-jump-field" onclick="window.ABAP_MANUAL.scrollToField('${escapeHtml(item.table)}', '${escapeHtml(item.field)}')">
                    Apri ↗
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `
        <p style="color: var(--text-muted); font-size: 0.84rem; padding: 8px 0;">Nessun'altra tabella nel dizionario locale utilizza questo elemento dati.</p>
      `}
    `;

    openInspector(title, '[DATA ELEMENT]', html);
  }

  /**
   * Inspect Domain
   */
  function inspectDomain(domName) {
    if (!state.dictionary || !state.dictionary.tables) return;

    // Find all occurrences in all tables
    const whereUsed = [];
    let domDefinition = null;

    state.dictionary.tables.forEach(table => {
      if (!table.fields) return;
      table.fields.forEach(field => {
        if (field.dataElement && field.dataElement.domain && field.dataElement.domain.name === domName) {
          whereUsed.push({
            table: table.tableName,
            module: table.module,
            field: field.fieldname,
            dataElement: field.dataElement.name,
            shortText: field.shortText,
            isKey: field.isKey
          });
          if (!domDefinition) {
            domDefinition = field.dataElement.domain;
          }
        }
      });
    });

    const title = domName;
    const domType = (domDefinition && domDefinition.dataType) ? `${domDefinition.dataType}(${domDefinition.length}${domDefinition.decimals ? ',' + domDefinition.decimals : ''})` : 'N/A';
    const shortText = domDefinition ? (domDefinition.shortText || 'Dominio Tecnico ABAP') : 'Dominio Tecnico ABAP';

    let html = `
      <div style="margin-bottom: 16px;">
        <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-title); margin-bottom: 4px;">
          ${escapeHtml(shortText)}
        </h3>
        <p style="color: var(--text-muted); font-size: 0.86rem;">
          Dominio tecnico DDIC. Definisce le caratteristiche fisiche a livello di database (tipo dati primario, lunghezza, conversion exit e intervalli di valori ammessi).
        </p>
      </div>

      <div class="inspector-section-title">Caratteristiche Fisiche Database</div>
      <table class="manual-spec-table" style="margin-top: 6px;">
        <tbody>
          <tr>
            <td class="spec-lbl">Tipo Dati Base</td>
            <td class="spec-val">
              <span class="field-type-pill">${escapeHtml(domDefinition?.dataType || 'N/A')}</span>
              <span style="color: var(--text-muted); font-size: 0.8rem; margin-left: 6px;">(${getFormatNote(domDefinition?.dataType)})</span>
            </td>
          </tr>
          <tr>
            <td class="spec-lbl">Lunghezza / Decimali</td>
            <td class="spec-val">
              <strong>${domDefinition?.length || '—'}</strong> caratteri
              ${domDefinition?.decimals ? ` (Decimali: <strong>${domDefinition.decimals}</strong>)` : ''}
            </td>
          </tr>
          <tr>
            <td class="spec-lbl">Sintassi ABAP Diretta</td>
            <td class="spec-val">
              <code>${highlightABAP('DATA lv_val TYPE ' + domName.toLowerCase() + '.')}</code>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="inspector-section-title">Dove è Usato nel Dizionario (Where-Used List — ${whereUsed.length} campi)</div>
      ${whereUsed.length > 0 ? `
        <table class="inspector-where-table">
          <thead>
            <tr>
              <th style="width: 90px;">Tabella</th>
              <th style="width: 110px;">Campo</th>
              <th style="width: 130px;">Data Element</th>
              <th>Descrizione Ruolo</th>
              <th style="width: 70px; text-align: right;">Azione</th>
            </tr>
          </thead>
          <tbody>
            ${whereUsed.map(item => `
              <tr>
                <td>
                  <span class="link-target" onclick="window.ABAP_MANUAL.selectTable('${escapeHtml(item.table)}')">${escapeHtml(item.table)}</span>
                </td>
                <td>
                  <strong style="font-family: var(--font-mono); color: var(--text-title);">${escapeHtml(item.field)}</strong>
                  ${item.isKey ? '<span class="badge-key-tag" style="margin-left: 4px;">KEY</span>' : ''}
                </td>
                <td>
                  <span class="link-ddic" onclick="window.ABAP_MANUAL.inspectDataElement('${escapeHtml(item.dataElement)}')">${escapeHtml(item.dataElement)}</span>
                </td>
                <td style="color: var(--text-main); font-size: 0.82rem;">${escapeHtml(item.shortText || '')}</td>
                <td style="text-align: right;">
                  <button class="btn-jump-field" onclick="window.ABAP_MANUAL.scrollToField('${escapeHtml(item.table)}', '${escapeHtml(item.field)}')">
                    Apri ↗
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `
        <p style="color: var(--text-muted); font-size: 0.84rem; padding: 8px 0;">Nessun campo nel dizionario locale utilizza direttamente questo dominio.</p>
      `}
    `;

    openInspector(title, '[DOMINIO TECNICO]', html);
  }

  /**
   * Render Table of Contents (TOC) with 3-Level Hierarchy
   */
  function renderTOC() {
    if (!state.dictionary) return;

    const q = state.searchQuery.toLowerCase().trim();
    const moduleMap = {};

    state.dictionary.modules.forEach(m => {
      moduleMap[m.id] = { ...m, tables: [] };
    });

    state.dictionary.tables.forEach(table => {
      const modId = table.module || 'SD';
      if (!moduleMap[modId]) {
        moduleMap[modId] = { id: modId, name: modId, description: '', tables: [] };
      }

      if (!q) {
        moduleMap[modId].tables.push(table);
      } else {
        const matchTable = table.tableName.toLowerCase().includes(q) ||
                           (table.shortText && table.shortText.toLowerCase().includes(q));
        const matchField = table.fields && table.fields.some(f => 
          f.fieldname.toLowerCase().includes(q) ||
          (f.shortText && f.shortText.toLowerCase().includes(q)) ||
          (f.dataElement && f.dataElement.name.toLowerCase().includes(q)) ||
          (f.examples && f.examples.some(ex => ex.code.toLowerCase().includes(q) || ex.desc.toLowerCase().includes(q)))
        );

        if (matchTable || matchField) {
          moduleMap[modId].tables.push(table);
          state.expandedModules.add(modId);
          state.expandedTables.add(table.tableName);
        }
      }
    });

    el.tocNav.innerHTML = '';

    Object.values(moduleMap).forEach(mod => {
      if (mod.tables.length === 0) return;

      const isModExpanded = state.expandedModules.has(mod.id);

      const modGroup = document.createElement('div');
      modGroup.className = 'toc-module-group';

      const modTitle = document.createElement('div');
      modTitle.className = 'toc-module-title';
      modTitle.innerHTML = `
        <span>${escapeHtml(mod.id)} — ${escapeHtml(mod.name)}</span>
        <span class="toc-arrow ${isModExpanded ? 'expanded' : ''}">▶</span>
      `;

      modTitle.addEventListener('click', () => {
        if (state.expandedModules.has(mod.id)) {
          state.expandedModules.delete(mod.id);
        } else {
          state.expandedModules.add(mod.id);
        }
        renderTOC();
      });

      modGroup.appendChild(modTitle);

      if (isModExpanded) {
        mod.tables.forEach(tbl => {
          const isTableExpanded = state.expandedTables.has(tbl.tableName);
          const isTableActive = (state.activeTable === tbl.tableName);

          const tableBlock = document.createElement('div');
          tableBlock.className = 'toc-table-block';

          const tableLink = document.createElement('div');
          tableLink.className = `toc-table-link ${isTableActive ? 'active' : ''}`;
          tableLink.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px; overflow: hidden;">
              <span class="toc-arrow ${isTableExpanded ? 'expanded' : ''}" data-toggle-table="${escapeHtml(tbl.tableName)}">▶</span>
              <span class="toc-table-mono">${escapeHtml(tbl.tableName)}</span>
            </div>
            <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">${tbl.fields ? tbl.fields.length : 0}</span>
          `;

          tableLink.addEventListener('click', (e) => {
            if (e.target.dataset.toggleTable) {
              if (state.expandedTables.has(tbl.tableName)) {
                state.expandedTables.delete(tbl.tableName);
              } else {
                state.expandedTables.add(tbl.tableName);
              }
              renderTOC();
              return;
            }

            state.expandedTables.add(tbl.tableName);
            selectTable(tbl.tableName);
          });

          tableBlock.appendChild(tableLink);

          if (isTableExpanded && tbl.fields && tbl.fields.length > 0) {
            const fieldList = document.createElement('div');
            fieldList.className = 'toc-field-list';

            tbl.fields.forEach(field => {
              if (q) {
                const matchFld = field.fieldname.toLowerCase().includes(q) ||
                                 (field.shortText && field.shortText.toLowerCase().includes(q)) ||
                                 (field.examples && field.examples.some(ex => ex.code.toLowerCase().includes(q) || ex.desc.toLowerCase().includes(q)));
                const matchTbl = tbl.tableName.toLowerCase().includes(q);
                if (!matchFld && !matchTbl) return;
              }

              const fieldLink = document.createElement('a');
              fieldLink.className = 'toc-field-link';
              fieldLink.innerHTML = `
                <span>${escapeHtml(field.fieldname)}</span>
                ${field.isKey ? '<span style="color: var(--accent-orange); font-size: 9px; font-weight: 700;">KEY</span>' : ''}
              `;

              fieldLink.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToField(tbl.tableName, field.fieldname);
              });

              fieldList.appendChild(fieldLink);
            });

            tableBlock.appendChild(fieldList);
          }

          modGroup.appendChild(tableBlock);
        });
      }

      el.tocNav.appendChild(modGroup);
    });
  }

  /**
   * Select and Render Table Manual Chapter
   */
  function selectTable(tableName) {
    state.activeTable = tableName;
    closeInspector();
    renderTOC();
    renderManualChapter(tableName);
    el.readingScroll.scrollTop = 0;
  }

  /**
   * Scroll smoothly directly to a specific field inside the manual
   */
  function scrollToField(tableName, fieldname) {
    closeInspector();
    if (state.activeTable !== tableName) {
      state.activeTable = tableName;
      renderManualChapter(tableName);
    }
    renderTOC();

    setTimeout(() => {
      const target = document.getElementById(`field-${fieldname}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.add('highlighted');
        setTimeout(() => target.classList.remove('highlighted'), 2000);
      }
    }, 50);
  }

  /**
   * Render Complete Continuous Manual Chapter for a Table
   */
  function renderManualChapter(tableName) {
    if (!state.dictionary) return;
    const table = state.dictionary.tables.find(t => t.tableName === tableName);
    if (!table) return;

    const keys = table.mainKey ? table.mainKey.join(', ') : 'MANDT';
    const mod = state.dictionary.modules.find(m => m.id === table.module) || { name: table.module };

    let html = `
      <!-- Manual Header -->
      <div class="manual-header">
        <div class="manual-module-tag">MODULO ${escapeHtml(table.module)} — ${escapeHtml(mod.name)}</div>
        <h1 class="manual-title">${escapeHtml(table.tableName)}</h1>
        <p class="manual-desc"><strong>${escapeHtml(table.shortText)}</strong></p>
        <div class="manual-meta-strip">
          <span>Chiave Primaria: <strong>${escapeHtml(keys)}</strong></span>
          <span>Categoria: <strong>${escapeHtml(table.tableCategory || 'TRANSP')}</strong></span>
          <span>Classe di Consegna: <strong>${escapeHtml(table.deliveryClass || 'A')}</strong></span>
          <span>Totale Colonne: <strong>${table.fields ? table.fields.length : 0}</strong></span>
        </div>
      </div>

      <!-- Etymology & Business Role Quote -->
      ${table.germanEtymology ? `
        <div class="manual-quote">
          <strong>Etimologia Tedesca:</strong> <em>${escapeHtml(table.germanEtymology)}</em><br>
          <span style="font-size: 0.9rem; color: var(--text-muted);">${escapeHtml(table.description || '')}</span>
        </div>
      ` : ''}

      <!-- Quick ABAP Declarations -->
      <div class="manual-snippet-bar">
        <span><code>${highlightABAP('DATA ls_' + table.tableName.toLowerCase() + ' TYPE ' + table.tableName.toLowerCase() + '.')}</code> <span style="color: var(--text-muted);">" Struttura (1 riga)</span></span>
        <button class="btn-copy-code" onclick="copySnippet('DATA ls_${table.tableName.toLowerCase()} TYPE ${table.tableName.toLowerCase()}.')">Copia</button>
      </div>
      <div class="manual-snippet-bar" style="margin-top: 4px;">
        <span><code>${highlightABAP('DATA lt_' + table.tableName.toLowerCase() + ' TYPE TABLE OF ' + table.tableName.toLowerCase() + '.')}</code> <span style="color: var(--text-muted);">" Tabella Interna (più righe)</span></span>
        <button class="btn-copy-code" onclick="copySnippet('DATA lt_${table.tableName.toLowerCase()} TYPE TABLE OF ${table.tableName.toLowerCase()}.')">Copia</button>
      </div>

      <!-- Section 1: Relazioni con altre tabelle (Foreign Keys) -->
      ${table.relationships && table.relationships.length > 0 ? `
        <h2 class="manual-h2">1. Relazioni Strutturali con altre Tabelle SAP</h2>
        <p class="manual-p">Come questa tabella si connette al flusso documentale a monte e a valle (Foreign Keys):</p>
        <div class="manual-rel-list">
          ${table.relationships.map(rel => `
            <div class="manual-rel-item">
              <span class="manual-rel-link" onclick="window.ABAP_MANUAL.selectTable('${escapeHtml(rel.targetTable)}')">
                ${escapeHtml(rel.targetTable)} ↗
              </span>
              <code style="font-family: var(--font-mono); color: var(--accent); font-size: 0.8rem;">[${escapeHtml(rel.foreignKey)}]</code>
              <span style="color: var(--text-muted); font-size: 0.84rem;">— ${escapeHtml(rel.description)}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Section 2: Dizionario Campi Completo (Manuale Continuo Unrolled) -->
      <h2 class="manual-h2">2. Dizionario Dati Completo delle Colonne (${table.fields ? table.fields.length : 0} Campi)</h2>
      <p class="manual-p">Panoramica compatta e dettaglio unrolled per ogni campo (clicca su Data Element, Dominio o Tipo per consultare la scheda tecnica e l'elenco delle tabelle collegate):</p>
    `;

    // Compact Summary Table (Clean, without Action column)
    if (table.fields && table.fields.length > 0) {
      html += `
        <div class="manual-summary-box">
          <table class="manual-summary-table">
            <thead>
              <tr>
                <th style="width: 45px;">Pos</th>
                <th style="width: 140px;">Campo</th>
                <th>Descrizione</th>
                <th style="width: 130px;">Data Element</th>
                <th style="width: 110px;">Dominio</th>
                <th style="width: 100px;">Tipo</th>
              </tr>
            </thead>
            <tbody>
              ${table.fields.map(f => {
                const elem = f.dataElement || {};
                const dom = elem.domain || {};
                const domType = dom.dataType ? `${dom.dataType}(${dom.length}${dom.decimals ? ',' + dom.decimals : ''})` : 'N/A';
                return `
                  <tr>
                    <td style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.78rem;">#${f.position || '—'}</td>
                    <td>
                      <span class="link-field" onclick="window.ABAP_MANUAL.scrollToField('${escapeHtml(table.tableName)}', '${escapeHtml(f.fieldname)}')">
                        ${escapeHtml(f.fieldname)}
                      </span>
                      ${f.isKey ? '<span class="badge-key-tag" style="margin-left: 4px;">KEY</span>' : ''}
                    </td>
                    <td style="color: var(--text-title);">${escapeHtml(f.shortText || '—')}</td>
                    <td>
                      <span class="link-ddic" onclick="window.ABAP_MANUAL.inspectDataElement('${escapeHtml(elem.name || f.fieldname)}')">
                        ${escapeHtml(elem.name || f.fieldname)}
                      </span>
                    </td>
                    <td>
                      ${dom.name ? `
                        <span class="link-ddic" onclick="window.ABAP_MANUAL.inspectDomain('${escapeHtml(dom.name)}')">
                          ${escapeHtml(dom.name)}
                        </span>
                      ` : '<span style="color: var(--text-muted);">—</span>'}
                    </td>
                    <td>
                      <span class="field-type-pill clickable" onclick="window.ABAP_MANUAL.inspectDomain('${escapeHtml(dom.name || '')}')" title="Ispeziona tipo tecnico">
                        ${escapeHtml(domType)}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;

      // Unrolled Detailed Field Chapters
      table.fields.forEach(field => {
        const elem = field.dataElement || {};
        const dom = elem.domain || {};
        const domType = dom.dataType ? `${dom.dataType}(${dom.length}${dom.decimals ? ',' + dom.decimals : ''})` : 'N/A';
        const isKey = field.isKey;

        // Check if field has matching relationship or foreign key
        const matchingRel = table.relationships?.find(rel => 
          rel.foreignKey && (rel.foreignKey.includes(field.fieldname) || (rel.foreignKey.includes('=') && rel.foreignKey.split('=')[0].trim() === field.fieldname))
        );

        html += `
          <div class="manual-field-chapter" id="field-${escapeHtml(field.fieldname)}">
            <div class="field-head-row">
              <div class="field-head-title">
                <span>#${field.position || '—'}</span>
                <span>${escapeHtml(field.fieldname)}</span>
                ${isKey ? '<span class="badge-key-tag">PRIMARY KEY</span>' : ''}
              </div>
              <span class="field-type-pill clickable" onclick="window.ABAP_MANUAL.inspectDomain('${escapeHtml(dom.name || '')}')" title="Clicca per ispezionare il dominio">
                ${escapeHtml(domType)}
              </span>
            </div>

            <!-- Hierarchical Trail -->
            <div class="field-tree-trail">
              <span>Albero DDIC: <strong>${escapeHtml(table.tableName)}</strong> → <strong>${escapeHtml(field.fieldname)}</strong> → Data Element: <span class="link-ddic" onclick="window.ABAP_MANUAL.inspectDataElement('${escapeHtml(elem.name || field.fieldname)}')">${escapeHtml(elem.name || field.fieldname)}</span> → Dominio: <span class="link-ddic" onclick="window.ABAP_MANUAL.inspectDomain('${escapeHtml(dom.name || '')}')">${escapeHtml(dom.name || 'N/A')}</span></span>
            </div>

            <p class="manual-p" style="font-size: 1rem; margin-bottom: 8px;">
              <strong>${escapeHtml(field.shortText || '')}</strong>
            </p>

            ${field.businessMeaning ? `
              <p class="manual-p" style="color: var(--text-muted); font-size: 0.9rem;">
                ${escapeHtml(field.businessMeaning)}
              </p>
            ` : ''}

            <!-- Technical Spec Table -->
            <table class="manual-spec-table">
              <tbody>
                <tr>
                  <td class="spec-lbl">Etimologia Tedesca</td>
                  <td class="spec-val"><em>${escapeHtml(field.germanName || 'N/A')}</em></td>
                </tr>
                <tr>
                  <td class="spec-lbl">Elemento Dati</td>
                  <td class="spec-val">
                    <span class="link-ddic" onclick="window.ABAP_MANUAL.inspectDataElement('${escapeHtml(elem.name || field.fieldname)}')">${escapeHtml(elem.name || field.fieldname)}</span>
                    <span style="color: var(--text-muted); font-size: 0.82rem;"> — ${escapeHtml(elem.shortText || '')}</span>
                  </td>
                </tr>
                <tr>
                  <td class="spec-lbl">Dominio Tecnico</td>
                  <td class="spec-val">
                    ${dom.name ? `
                      <span class="link-ddic" onclick="window.ABAP_MANUAL.inspectDomain('${escapeHtml(dom.name)}')">${escapeHtml(dom.name)}</span>
                      <span style="color: var(--text-muted); font-size: 0.82rem;"> — ${escapeHtml(dom.shortText || '')}</span>
                    ` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td class="spec-lbl">Tipo e Lunghezza</td>
                  <td class="spec-val">
                    <span class="field-type-pill clickable" onclick="window.ABAP_MANUAL.inspectDomain('${escapeHtml(dom.name || '')}')">${escapeHtml(domType)}</span>
                    <span style="color: var(--text-muted); font-size: 0.82rem; margin-left: 6px;">(${getFormatNote(dom.dataType)})</span>
                  </td>
                </tr>
                ${matchingRel ? `
                  <tr>
                    <td class="spec-lbl">Tabella Collegata</td>
                    <td class="spec-val">
                      <span class="link-target" onclick="window.ABAP_MANUAL.selectTable('${escapeHtml(matchingRel.targetTable)}')">
                        ${escapeHtml(matchingRel.targetTable)} ↗
                      </span>
                      <span style="color: var(--text-muted); font-size: 0.82rem;"> (${escapeHtml(matchingRel.description)})</span>
                    </td>
                  </tr>
                ` : ''}
              </tbody>
            </table>

            <!-- Real-World Examples Box -->
            ${field.examples && field.examples.length > 0 ? `
              <div class="manual-examples-box">
                <div class="manual-examples-title">Valori Ammessi ed Esempi Reali di Business (${escapeHtml(field.fieldname)})</div>
                <table class="manual-examples-table">
                  <tbody>
                    ${field.examples.map(ex => `
                      <tr>
                        <td class="code-cell">${escapeHtml(ex.code)}</td>
                        <td>${escapeHtml(ex.desc)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            <!-- Code Snippet Bar -->
            <div class="manual-snippet-bar">
              <span>Dichiarazione: <code>${highlightABAP('DATA lv_' + field.fieldname.toLowerCase() + ' TYPE ' + table.tableName.toLowerCase() + '-' + field.fieldname.toLowerCase() + '.')}</code></span>
              <button class="btn-copy-code" onclick="copySnippet('DATA lv_${field.fieldname.toLowerCase()} TYPE ${table.tableName.toLowerCase()}-${field.fieldname.toLowerCase()}.')">Copia</button>
            </div>
          </div>
        `;
      });
    }

    // Section 3: Practical Modern ABAP SQL Query
    const orderField = table.fields.find(f => f.isKey && f.fieldname !== 'MANDT')?.fieldname.toLowerCase() || (table.fields[1] ? table.fields[1].fieldname.toLowerCase() : 'vbeln');
    const queryCode = `* Selezione moderna da ${table.tableName} con clausola WHERE
SELECT ${table.fields.slice(0, 5).map(f => f.fieldname.toLowerCase()).join(', ')}
  FROM ${table.tableName.toLowerCase()}
  WHERE mandt = @sy-mandt
  ORDER BY ${orderField}
  INTO TABLE @DATA(lt_${table.tableName.toLowerCase()})
  UP TO 50 ROWS.

IF sy-subrc = 0.
  LOOP AT lt_${table.tableName.toLowerCase()} ASSIGNING FIELD-SYMBOL(<ls_row>).
    " Elaborazione record...
  ENDLOOP.
ENDIF.`;

    html += `
      <h2 class="manual-h2">3. Esempio Pratico di Query ABAP (Modern SQL)</h2>
      <p class="manual-p">Esempio compilabile di codice ABAP per interrogare questa tabella con dichiarazione inline e ciclo di elaborazione:</p>
      <div class="code-header-bar">
        <span>Query & Loop di Elaborazione (${escapeHtml(table.tableName)})</span>
        <button class="btn-copy-code" onclick="copySnippet(${escapeHtml(JSON.stringify(queryCode))})">Copia Codice</button>
      </div>
      <pre class="manual-code-box"><code>${highlightABAP(queryCode)}</code></pre>
    `;

    el.manualContainer.innerHTML = html;
  }

  function getFormatNote(dataType) {
    switch (dataType) {
      case 'DATS': return 'Data AAAAMMGG';
      case 'CHAR': return 'Testo alfanumerico';
      case 'NUMC': return 'Numerico con zeri iniziali';
      case 'CURR': return 'Importo valuta';
      case 'CLNT': return 'Mandante SAP a 3 cifre';
      case 'CUKY': return 'Codice divisa ISO';
      case 'UNIT': return 'Unità di misura';
      case 'QUAN': return 'Quantità numerica';
      default: return dataType || 'Formato standard';
    }
  }

  /**
   * Clipboard Helper
   */
  window.copySnippet = function (text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copiato: ' + text);
    }).catch(() => {
      showToast('Copiato: ' + text);
    });
  };

  function showToast(text) {
    let toast = document.getElementById('manual-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'manual-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: var(--accent);
        color: #ffffff;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-family: var(--font-mono);
        z-index: 1100;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: opacity 0.2s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.style.opacity = '1';
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.style.opacity = '0';
    }, 2000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const keywordsSet = new Set([
    'SELECT', 'SINGLE', 'FROM', 'WHERE', 'INTO', 'TABLE', 'APPENDING', 'CORRESPONDING', 'FIELDS',
    'OF', 'ORDER', 'BY', 'UP', 'TO', 'ROWS', 'GROUP', 'HAVING', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
    'INNER', 'JOIN', 'LEFT', 'OUTER', 'RIGHT', 'CROSS', 'ON', 'AS', 'DISTINCT',
    'FOR', 'ALL', 'ENTRIES', 'IN', 'UNION',
    'INSERT', 'UPDATE', 'MODIFY', 'DELETE', 'COMMIT', 'ROLLBACK', 'WORK', 'WAIT',
    'LOOP', 'AT', 'ASSIGNING', 'FIELD-SYMBOL', 'FIELD-SYMBOLS', 'REFERENCE', 'ENDLOOP',
    'READ', 'WITH', 'KEY', 'BINARY', 'SEARCH', 'TRANSPORTING', 'NO', 'INDEX',
    'SORT', 'ASCENDING', 'DESCENDING', 'TEXT',
    'FIRST', 'LAST', 'NEW', 'END', 'ENDAT', 'COLLECT', 'CLEAR', 'REFRESH', 'FREE',
    'VALUE', 'MAPPING', 'EXCEPT', 'BASE', 'COND', 'SWITCH', 'WHEN', 'THEN', 'ELSE',
    'REDUCE', 'INIT', 'NEXT', 'FILTER', 'CONV', 'EXACT', 'REF',
    'IF', 'ELSEIF', 'ENDIF', 'CASE', 'WHEN', 'OTHERS', 'ENDCASE',
    'DO', 'TIMES', 'ENDDO', 'WHILE', 'ENDWHILE', 'CHECK', 'EXIT', 'CONTINUE', 'RETURN', 'STOP',
    'DATA', 'TYPES', 'BEGIN', 'CONSTANTS', 'STATICS', 'LIKE', 'LINE', 'TYPE', 'LENGTH', 'DECIMALS',
    'STANDARD', 'SORTED', 'HASHED', 'UNIQUE', 'NON-UNIQUE', 'EMPTY', 'RANGE',
    'OCCURS', 'HEADER', 'RANGES', 'TABLES',
    'BREAK-POINT', 'BREAK', 'ASSERT', 'LOG-POINT', 'ID', 'CONDITION', 'SUBKEY',
    'WRITE', 'ULINE', 'SKIP', 'BACK', 'POSITION', 'NEW-PAGE', 'NEW-LINE', 'FORMAT', 'COLOR',
    'INTENSIFIED', 'INVERSE', 'RESET', 'HOTSPOT', 'HIDE', 'CURSOR', 'PF-STATUS', 'TITLEBAR',
    'PARAMETERS', 'SELECT-OPTIONS', 'SELECTION-SCREEN', 'BLOCK', 'COMMENT', 'PUSHBUTTON',
    'USER-COMMAND', 'DEFAULT', 'OBLIGATORY', 'RADIOBUTTON', 'CHECKBOX', 'MODIF',
    'INITIALIZATION', 'START-OF-SELECTION', 'END-OF-SELECTION', 'OUTPUT',
    'CLASS', 'ENDCLASS', 'DEFINITION', 'IMPLEMENTATION', 'PUBLIC', 'PROTECTED', 'PRIVATE',
    'SECTION', 'FINAL', 'CREATE', 'METHODS', 'METHOD', 'ENDMETHOD', 'IMPORTING', 'EXPORTING',
    'CHANGING', 'RETURNING', 'RAISING', 'CALL', 'FUNCTION', 'PERFORM', 'FORM', 'ENDFORM',
    'TRY', 'CATCH', 'CLEANUP', 'ENDTRY', 'RAISE', 'EXCEPTION', 'RESUME',
    'MESSAGE', 'DISPLAY', 'SET', 'PARAMETER', 'GET', 'EXPORT', 'IMPORT', 'DATABASE',
    'MOVE', 'COMPUTE', 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'CONCATENATE', 'SEPARATED',
    'SPLIT', 'CONDENSE', 'NO-GAPS', 'TRANSLATE', 'UPPER', 'LOWER', 'REPLACE',
    'PROVIDE', 'ENDPROVIDE', 'DESCRIBE', 'LINES', 'ASSIGN', 'COMPONENT', 'STRUCTURE',
    'UNASSIGN', 'IS', 'INITIAL', 'NOT', 'ASSIGNED', 'BOUND', 'BETWEEN', 'AND', 'OR', 'EQ', 'NE', 'LT', 'LE', 'GT', 'GE'
  ]);

  function highlightABAP(code) {
    if (!code) return '';
    const lines = code.split('\n');
    const tokenRegex = /(\"[^\r\n]*)|('(?:[^']|'')*')|(\|(?:[^\\|]|\\[\s\S])*\|)|(@(?:DATA|data)\b|@[A-Za-z0-9_]+(?:-[A-Za-z0-9_]+)?|<[A-Za-z0-9_]+>)|(\bsy-[A-Za-z0-9_]+\b)|(\b\d+(?:\.\d+)?\b)|([A-Za-z0-9_#-]+)/g;

    return lines.map(line => {
      if (/^\s*\*/.test(line)) {
        return '<span class="hl-com">' + escapeHtml(line) + '</span>';
      }

      return line.replace(tokenRegex, (match, com, str1, tmpl, hostOrFs, sysVar, num, word) => {
        if (com) {
          return '<span class="hl-com">' + escapeHtml(com) + '</span>';
        }
        if (str1 || tmpl) {
          return '<span class="hl-str">' + escapeHtml(match) + '</span>';
        }
        if (hostOrFs) {
          return '<span class="hl-sys">' + escapeHtml(hostOrFs) + '</span>';
        }
        if (sysVar) {
          return '<span class="hl-sys">' + escapeHtml(sysVar) + '</span>';
        }
        if (num) {
          return '<span class="hl-num">' + escapeHtml(num) + '</span>';
        }
        if (word) {
          const upper = word.toUpperCase();
          if (keywordsSet.has(upper)) {
            return '<span class="hl-kw">' + escapeHtml(word) + '</span>';
          }
          return escapeHtml(word);
        }
        return escapeHtml(match);
      });
    }).join('\n');
  }

  /**
   * Event Listeners
   */
  function initEvents() {
    let searchDebounce;
    el.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        state.searchQuery = e.target.value;
        renderTOC();
      }, 120);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeInspector();
      } else if (e.key === '/' && document.activeElement !== el.searchInput) {
        e.preventDefault();
        el.searchInput.focus();
        el.searchInput.select();
      }
    });

    if (el.modalCloseBtn) {
      el.modalCloseBtn.addEventListener('click', closeInspector);
    }

    if (el.inspectorModal) {
      el.inspectorModal.addEventListener('click', (e) => {
        if (e.target === el.inspectorModal) {
          closeInspector();
        }
      });
    }
  }

  // Public API
  window.ABAP_MANUAL = {
    selectTable,
    scrollToField,
    inspectDataElement,
    inspectDomain,
    closeInspector
  };

  // Bootstrap
  initTheme();
  initEvents();
  initData();

})();
