/**
 * ABAP Sintassi & Semantica — Manuale Tecnico del Linguaggio
 * Controller per la navigazione gerarchica, ricerca istantanea e lettura continua (unrolled)
 */

(function () {
  'use strict';

  // State
  const state = {
    dataset: window.ABAP_SYNTAX || null,
    activeCategory: 'DATA_DEF',
    searchQuery: '',
    statusFilter: 'all', // 'all' | 'modern' | 'classic' | 'deprecated'
    viewMode: 'full',    // 'full' | 'compact'
    expandedCategories: new Set([
      'DATA_DEF', 'ASSIGN_STRING', 'SQL_ACCESS', 'ITAB_OPS',
      'CONSTRUCTORS', 'POINTERS', 'CONTROL_FLOW', 'DEBUG_TRACE',
      'PRINT_LIST', 'SELECTION_SCREEN', 'MODULARIZATION', 'MEMORY_PARAM', 'ERROR_MESSAGE'
    ]),
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
   * Theme Controller (synchronized with abap-wiki and portal)
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
    if (!state.dataset || !state.dataset.categories) return;

    const totalConstructs = state.dataset.constructs ? state.dataset.constructs.length : 0;
    el.footerCount.textContent = `${totalConstructs} Costrutti ABAP`;

    renderTOC();
    renderCategoryChapter(state.activeCategory);
  }

  /**
   * Render Table of Contents (TOC)
   */
  function renderTOC() {
    if (!state.dataset) return;

    const q = state.searchQuery.toLowerCase().trim();
    el.tocNav.innerHTML = '';

    state.dataset.categories.forEach(cat => {
      // Find constructs for this category
      const allCategoryConstructs = state.dataset.constructs.filter(c => c.category === cat.id);
      let matchingConstructs = allCategoryConstructs;

      if (q) {
        matchingConstructs = allCategoryConstructs.filter(c => {
          const nameMatch = c.name.toLowerCase().includes(q);
          const synMatch = c.syntax.toLowerCase().includes(q);
          const textMatch = c.shortText && c.shortText.toLowerCase().includes(q);
          const semMatch = c.semantic && c.semantic.toLowerCase().includes(q);
          const gotchaMatch = c.gotchas && c.gotchas.toLowerCase().includes(q);
          const tagsMatch = c.tags && c.tags.some(t => t.toLowerCase().includes(q));
          return nameMatch || synMatch || textMatch || semMatch || gotchaMatch || tagsMatch;
        });

        if (matchingConstructs.length === 0 && !cat.name.toLowerCase().includes(q)) {
          return; // Skip category if nothing matches
        }

        state.expandedCategories.add(cat.id);
      }

      const isCatExpanded = state.expandedCategories.has(cat.id);
      const isCatActive = (state.activeCategory === cat.id);

      const catGroup = document.createElement('div');
      catGroup.className = 'toc-cat-group';

      const catTitle = document.createElement('div');
      catTitle.className = `toc-cat-title ${isCatActive ? 'active' : ''}`;
      catTitle.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; overflow: hidden;">
          <span class="toc-arrow ${isCatExpanded ? 'expanded' : ''}" data-toggle-cat="${escapeHtml(cat.id)}">▶</span>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent);">${escapeHtml(cat.number)}.</span>
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(cat.name)}</span>
        </div>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">${matchingConstructs.length}</span>
      `;

      catTitle.addEventListener('click', (e) => {
        if (e.target.dataset.toggleCat) {
          if (state.expandedCategories.has(cat.id)) {
            state.expandedCategories.delete(cat.id);
          } else {
            state.expandedCategories.add(cat.id);
          }
          renderTOC();
          return;
        }

        state.expandedCategories.add(cat.id);
        selectCategory(cat.id);
      });

      catGroup.appendChild(catTitle);

      // Render nested constructs
      if (isCatExpanded && matchingConstructs.length > 0) {
        const constructList = document.createElement('div');
        constructList.className = 'toc-construct-list';

        matchingConstructs.forEach(c => {
          const item = document.createElement('a');
          item.className = 'toc-construct-link';

          let miniBadgeClass = 'cls';
          let miniBadgeText = 'CLS';
          if (c.status === 'deprecated') {
            miniBadgeClass = 'dep';
            miniBadgeText = 'DEP';
          } else if (c.status === 'modern') {
            miniBadgeClass = 'mod';
            miniBadgeText = 'MOD';
          }

          item.innerHTML = `
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(c.name.split('(')[0].trim())}</span>
            <span class="toc-mini-badge ${miniBadgeClass}">${miniBadgeText}</span>
          `;

          item.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToConstruct(cat.id, c.id);
          });

          constructList.appendChild(item);
        });

        catGroup.appendChild(constructList);
      }

      el.tocNav.appendChild(catGroup);
    });
  }

  /**
   * Select and Render Category Chapter
   */
  function selectCategory(catId) {
    state.activeCategory = catId;
    closeInspector();
    renderTOC();
    renderCategoryChapter(catId);
    el.readingScroll.scrollTop = 0;
  }

  /**
   * Scroll smoothly directly to a specific construct
   */
  function scrollToConstruct(catId, constructId) {
    closeInspector();
    let reRenderNeeded = false;
    if (state.activeCategory !== catId) {
      state.activeCategory = catId;
      reRenderNeeded = true;
    }
    const targetConstruct = state.dataset.constructs.find(c => c.id === constructId);
    if (targetConstruct && state.statusFilter !== 'all' && targetConstruct.status !== state.statusFilter) {
      state.statusFilter = 'all';
      reRenderNeeded = true;
    }

    if (reRenderNeeded) {
      renderCategoryChapter(catId);
    }
    renderTOC();

    setTimeout(() => {
      const target = document.getElementById(`construct-${constructId}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.add('highlighted');
        setTimeout(() => target.classList.remove('highlighted'), 2000);
      }
    }, 60);
  }

  /**
   * Render Category Chapter (Unrolled continuous reading)
   */
  function renderCategoryChapter(catId) {
    if (!state.dataset) return;
    const cat = state.dataset.categories.find(c => c.id === catId);
    if (!cat) return;

    const allConstructs = state.dataset.constructs.filter(c => c.category === catId);

    // Compute filter counts
    const counts = {
      all: allConstructs.length,
      modern: allConstructs.filter(c => c.status === 'modern').length,
      classic: allConstructs.filter(c => c.status === 'classic').length,
      deprecated: allConstructs.filter(c => c.status === 'deprecated').length
    };

    // Filter constructs
    const constructs = state.statusFilter === 'all'
      ? allConstructs
      : allConstructs.filter(c => c.status === state.statusFilter);

    let html = `
      <!-- Category Header -->
      <div class="category-header">
        <div class="category-number-tag">CATEGORIA ${escapeHtml(cat.number)} — ${escapeHtml(cat.id)}</div>
        <h1 class="category-title">${escapeHtml(cat.name)}</h1>
        <p class="category-desc">${escapeHtml(cat.description)}</p>
      </div>

      <!-- Chapter Toolbar: Status Filters & View Mode -->
      <div class="chapter-toolbar">
        <div class="filter-pills-group">
          <span class="toolbar-label">Filtra per stato:</span>
          <button class="filter-pill ${state.statusFilter === 'all' ? 'active' : ''}" onclick="window.ABAP_SYNTAX_APP.setStatusFilter('all')">Tutti (${counts.all})</button>
          ${counts.modern > 0 ? `<button class="filter-pill ${state.statusFilter === 'modern' ? 'active' : ''}" onclick="window.ABAP_SYNTAX_APP.setStatusFilter('modern')">Moderni (${counts.modern})</button>` : ''}
          ${counts.classic > 0 ? `<button class="filter-pill ${state.statusFilter === 'classic' ? 'active' : ''}" onclick="window.ABAP_SYNTAX_APP.setStatusFilter('classic')">Classici (${counts.classic})</button>` : ''}
          ${counts.deprecated > 0 ? `<button class="filter-pill ${state.statusFilter === 'deprecated' ? 'active' : ''}" onclick="window.ABAP_SYNTAX_APP.setStatusFilter('deprecated')">Deprecati (${counts.deprecated})</button>` : ''}
        </div>

        <div class="view-mode-group">
          <button class="view-mode-btn ${state.viewMode === 'full' ? 'active' : ''}" data-mode="full" onclick="window.ABAP_SYNTAX_APP.setViewMode('full')">Vista Completa</button>
          <button class="view-mode-btn ${state.viewMode === 'compact' ? 'active' : ''}" data-mode="compact" onclick="window.ABAP_SYNTAX_APP.setViewMode('compact')">Vista Rapida</button>
        </div>
      </div>

      <!-- Quick Jump Horizontal Strip -->
      <div class="quick-jump-strip">
        <span class="jump-label">Salto Rapido:</span>
        <div class="jump-pills-scroll">
          ${allConstructs.map((c, idx) => `
            <button class="jump-pill" onclick="window.ABAP_SYNTAX_APP.scrollToConstruct('${escapeHtml(cat.id)}', '${escapeHtml(c.id)}')">
              #${idx + 1} ${escapeHtml(c.name.split(' (')[0])}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Section 1: Panoramica Sintetica della Categoria -->
      <h2 class="manual-h2">1. Panoramica Sintetica (${constructs.length} di ${allConstructs.length} Costrutti)</h2>
      <p class="manual-p">Tabella di consultazione rapida. Clicca su qualsiasi riga per scorrere direttamente alla scheda tecnica:</p>
      
      <div class="syntax-summary-box">
        <table class="syntax-summary-table">
          <thead>
            <tr>
              <th style="width: 220px;">Costrutto</th>
              <th style="width: 140px;">Stato</th>
              <th>Definizione & Scopo Rapido</th>
            </tr>
          </thead>
          <tbody>
            ${constructs.map(c => {
              let badgeCls = 'classic';
              if (c.status === 'deprecated') badgeCls = 'deprecated';
              if (c.status === 'modern') badgeCls = 'modern';

              return `
                <tr style="cursor: pointer;" onclick="window.ABAP_SYNTAX_APP.scrollToConstruct('${escapeHtml(cat.id)}', '${escapeHtml(c.id)}')">
                  <td>
                    <span class="link-construct">
                      ${escapeHtml(c.name)}
                    </span>
                  </td>
                  <td>
                    <span class="badge-status ${badgeCls}">${escapeHtml(c.statusBadge)}</span>
                  </td>
                  <td style="color: var(--text-main); font-size: 0.85rem;">
                    ${formatRichText(c.shortText)}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Section 2: Dettaglio Completo dei Costrutti (Schede Tecniche) -->
      <h2 class="manual-h2" style="margin-top: 36px;">2. Schede Tecniche & Semantica dei Costrutti</h2>
      <p class="manual-p">Firme formali, semantica di esecuzione, insidie d'esame e di runtime, alternative Clean ABAP ed esempi compilabili:</p>
    `;

    constructs.forEach((c, idx) => {
      let badgeCls = 'classic';
      if (c.status === 'deprecated') badgeCls = 'deprecated';
      if (c.status === 'modern') badgeCls = 'modern';

      html += `
        <article class="construct-card" id="construct-${escapeHtml(c.id)}">
          
          <!-- Card Header -->
          <div class="construct-card-header">
            <div class="construct-card-title-group">
              <span class="construct-index-badge">#${idx + 1}</span>
              <h3 class="construct-card-title">${escapeHtml(c.name)}</h3>
            </div>
            <div class="construct-header-actions">
              <span class="badge-status ${badgeCls}">${escapeHtml(c.statusBadge)}</span>
              <button class="btn-card-action" onclick="window.ABAP_SYNTAX_APP.copySnippet(${escapeHtml(JSON.stringify(c.syntax))})">Copia Sintassi</button>
            </div>
          </div>

          <!-- Syntax Signature Box -->
          <div class="syntax-sig-container">
            <div class="syntax-sig-label">Firma Sintattica Formale:</div>
            <div class="syntax-sig-box">${highlightABAP(c.syntax)}</div>
          </div>

          <!-- Quick Purpose Bar -->
          <div class="construct-purpose-bar">
            <span class="purpose-tag">Scopo Rapido:</span>
            <span class="purpose-text">${formatRichText(c.shortText)}</span>
          </div>

          <!-- Expand button for compact mode -->
          <button class="btn-expand-details" onclick="window.ABAP_SYNTAX_APP.toggleCardDetails('${escapeHtml(c.id)}')">
            Espandi Dettagli (Semantica & Gotchas)
          </button>

          <!-- Execution Semantic Block -->
          <div class="construct-semantic-block">
            <div class="semantic-label">Semantica & Regole di Esecuzione:</div>
            <div class="semantic-content">${formatRichText(c.semantic)}</div>
          </div>

          <!-- Callout Stack (Deprecato, Modern Clean ABAP, Gotchas) -->
          <div class="callouts-stack">
            ${c.whyDeprecated ? `
              <div class="callout-card callout-deprec">
                <div class="callout-title">
                  <span class="callout-tag">[DEPRECATO]</span> Motivo della Deprecazione:
                </div>
                <div class="callout-text">${formatRichText(c.whyDeprecated)}</div>
              </div>
            ` : ''}

            ${c.modernEquivalent ? `
              <div class="callout-card callout-modern">
                <div class="callout-title">
                  <span class="callout-tag">[MODERN CLEAN ABAP]</span> Alternativa Raccomandata:
                </div>
                <div class="callout-text">${formatRichText(c.modernEquivalent)}</div>
              </div>
            ` : ''}

            ${c.gotchas ? `
              <div class="callout-card callout-gotcha">
                <div class="callout-title">
                  <span class="callout-tag">[INSIDIE & GOTCHAS]</span> Trabocchetti & Casi Limite:
                </div>
                <div class="callout-text">${formatRichText(c.gotchas)}</div>
              </div>
            ` : ''}
          </div>

          <!-- System Fields Influenced -->
          ${c.systemFields && c.systemFields.length > 0 && c.systemFields[0] !== 'Nessuno' ? `
            <div class="sysfields-row">
              <span class="sysfields-label">Campi di Sistema Influenzati:</span>
              <div class="sysfields-tags">
                ${c.systemFields.map(sf => `<code class="sys-chip">${escapeHtml(sf)}</code>`).join(' ')}
              </div>
            </div>
          ` : ''}

          <!-- Practical Compilable Example Code -->
          ${c.exampleCode ? `
            <div style="margin-top: 16px;">
              <div class="code-header-bar">
                <span>Esempio Pratico Compilabile</span>
                <button class="btn-copy-code" onclick="window.ABAP_SYNTAX_APP.copySnippet(${escapeHtml(JSON.stringify(c.exampleCode))})">Copia Codice</button>
              </div>
              <pre class="manual-code-box"><code>${highlightABAP(c.exampleCode)}</code></pre>
            </div>
          ` : ''}

        </article>
      `;
    });

    el.manualContainer.innerHTML = html;
    if (state.viewMode === 'compact') {
      el.manualContainer.classList.add('view-compact');
    } else {
      el.manualContainer.classList.remove('view-compact');
    }
  }

  /**
   * Inspector Modal (Detail sheet)
   */
  function inspectConstruct(constructId) {
    if (!state.dataset) return;
    const construct = state.dataset.constructs.find(c => c.id === constructId);
    if (!construct) return;

    el.modalTitle.textContent = construct.name;
    el.modalBadge.textContent = construct.statusBadge;

    let html = `
      <div class="syntax-sig-container">
        <div class="syntax-sig-label">Firma Sintattica:</div>
        <div class="syntax-sig-box">${highlightABAP(construct.syntax)}</div>
      </div>

      <div class="construct-purpose-bar" style="margin: 12px 0;">
        <span class="purpose-tag">Scopo:</span>
        <span class="purpose-text">${formatRichText(construct.shortText)}</span>
      </div>

      <div class="construct-semantic-block">
        <div class="semantic-label">Semantica & Regole di Esecuzione:</div>
        <div class="semantic-content">${formatRichText(construct.semantic)}</div>
      </div>

      <div class="callouts-stack">
        ${construct.whyDeprecated ? `
          <div class="callout-card callout-deprec">
            <div class="callout-title">
              <span class="callout-tag">[DEPRECATO]</span> Motivo Deprecazione:
            </div>
            <div class="callout-text">${formatRichText(construct.whyDeprecated)}</div>
          </div>
        ` : ''}

        ${construct.modernEquivalent ? `
          <div class="callout-card callout-modern">
            <div class="callout-title">
              <span class="callout-tag">[MODERN CLEAN ABAP]</span> Alternativa Raccomandata:
            </div>
            <div class="callout-text">${formatRichText(construct.modernEquivalent)}</div>
          </div>
        ` : ''}

        ${construct.gotchas ? `
          <div class="callout-card callout-gotcha">
            <div class="callout-title">
              <span class="callout-tag">[INSIDIE & GOTCHAS]</span> Trabocchetti:
            </div>
            <div class="callout-text">${formatRichText(construct.gotchas)}</div>
          </div>
        ` : ''}
      </div>

      ${construct.exampleCode ? `
        <div style="margin-top: 14px;">
          <div class="code-header-bar">
            <span>Esempio di Codice</span>
            <button class="btn-copy-code" onclick="window.ABAP_SYNTAX_APP.copySnippet(${escapeHtml(JSON.stringify(construct.exampleCode))})">Copia Codice</button>
          </div>
          <pre class="manual-code-box"><code>${highlightABAP(construct.exampleCode)}</code></pre>
        </div>
      ` : ''}
    `;

    el.modalBody.innerHTML = html;
    el.inspectorModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeInspector() {
    if (!el.inspectorModal) return;
    el.inspectorModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  /**
   * Clipboard Helper
   */
  function copySnippet(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Codice copiato negli appunti!');
    }).catch(() => {
      showToast('Codice copiato!');
    });
  }

  function showToast(text) {
    let toast = document.getElementById('syntax-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'syntax-toast';
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

  function formatRichText(text) {
    if (!text) return '';
    const parts = text.split(/`([^`\n]+)`/g);
    let res = '';
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 1) {
        res += '<code class="syntax-inline-code">' + highlightABAP(parts[i]) + '</code>';
      } else {
        res += escapeHtml(parts[i]);
      }
    }
    return res.replace(/\n\n/g, '</p><p class="rich-p">').replace(/\n/g, '<br>');
  }

  function setStatusFilter(filter) {
    state.statusFilter = filter;
    renderCategoryChapter(state.activeCategory);
  }

  function setViewMode(mode) {
    state.viewMode = mode;
    const container = document.getElementById('manual-container');
    if (container) {
      if (mode === 'compact') {
        container.classList.add('view-compact');
      } else {
        container.classList.remove('view-compact');
      }
    }
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });
  }

  function toggleCardDetails(constructId) {
    const card = document.getElementById(`construct-${constructId}`);
    if (card) {
      const semanticBlock = card.querySelector('.construct-semantic-block');
      const callouts = card.querySelector('.callouts-stack');
      const btn = card.querySelector('.btn-expand-details');
      const isHidden = semanticBlock && window.getComputedStyle(semanticBlock).display === 'none';

      if (semanticBlock) semanticBlock.style.display = isHidden ? 'block' : 'none';
      if (callouts) callouts.style.display = isHidden ? 'flex' : 'none';
      if (btn) btn.textContent = isHidden ? 'Riduci Dettagli' : 'Espandi Dettagli (Semantica & Gotchas)';
    }
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
      }, 100);
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
  window.ABAP_SYNTAX_APP = {
    selectCategory,
    scrollToConstruct,
    inspectConstruct,
    copySnippet,
    closeInspector,
    setStatusFilter,
    setViewMode,
    toggleCardDetails
  };

  // Bootstrap
  initTheme();
  initEvents();
  initData();

})();
